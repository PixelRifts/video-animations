import { Circle, Code, Gradient, Img, Layout, Node, Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import { Direction, Origin, Vector2, all, chain, createRef, createRefArray, createSignal, easeInExpo, easeOutBack, easeOutExpo, loop, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { BattlecodeMap } from "../../battlecode/map";
import { BattlecodeBot } from "../../battlecode/bot";
import { Cat, CheeseMine, PlumBabyRat, TileType, TileTypeInfo } from "../../battlecode/mit26/prefabs";
import { MonoTxt, RoboticTxt, append_to_code, wiggle } from "../../components/helpers";

import tr_rat from "../../battlecode/mit26/img/robots/cheddar/rat_6_64x64.png";
import br_rat from "../../battlecode/mit26/img/robots/cheddar/rat_4_64x64.png";
import bl_rat from "../../battlecode/mit26/img/robots/cheddar/rat_2_64x64.png";
import rat_king from "../../battlecode/mit26/img/robots/cheddar/rat_king_64x64.png";

const TURN_TIME = 0.4
const TURN_MOVE_TIME = 0.2
const TURN_WAIT_TIME = TURN_TIME - TURN_MOVE_TIME


export default makeScene2D(function* (view) {
    
    yield* waitUntil("cheese_mines");
    const time = createSignal(0);

    const map = createRef<BattlecodeMap>();
    const static_map = range(9 * 9).map(t => TileType.Empty);

    view.add(<BattlecodeMap
        ref={map}
        x={0} y={0} faded_bounds={false}
        map_bounds={[9, 9]}
        tile_size={100} tile_gap={6.667}
        radius={3} show_pct={0}
        base_colors={static_map.map(t => TileTypeInfo[t].color)}
    ></BattlecodeMap>);
    yield map().run_ticks(TURN_MOVE_TIME, TURN_WAIT_TIME);
    yield* map().fade_in(1.2);

    const cheese_mines = createRefArray<Img>();
    map().add_item(2, 2, <CheeseMine ref={cheese_mines} scale={0} />)
    map().add_item(6, 6, <CheeseMine ref={cheese_mines} scale={0} />)

    yield* sequence(0.1, ...cheese_mines.map(t => t.scale(0.9, 0.8, easeOutBack)));
    yield* waitUntil("communication_title");
    yield* map().x(-2000, 1.2);

    yield* waitUntil("nosharedvars");
    const no_comms_bots = createRefArray<Img>();
    const no_comms_vars = createRefArray<Code>();
    view.add(<Node>
        <Node>
            <Img ref={no_comms_bots}
                src={bl_rat}
                size={0}
                // size={500}
                position={[400, 100]}
            />
            <Code ref={no_comms_vars}
                // code={`public static MapLocation mine;`}
                position={[0, -300]}
            />
        </Node>
        <Node>
            <Img ref={no_comms_bots}
                src={br_rat}
                size={0}
                // size={500}
                position={[-400, 100]}
            />
            <Code ref={no_comms_vars}
                // code={`public static MapLocation mine;`}
                position={[0, -300]}
            />
        </Node>
    </Node>);
    yield* sequence(0.1, ...no_comms_bots.map(t => t.size(500, 1.2, easeOutBack)));
    yield* waitFor(2);
    yield* all(...no_comms_vars.map(t => append_to_code(t, `public static MapLocation mine;`, 0.3)));
    yield* waitFor(2);
    yield* all(
        sequence(0.1, no_comms_vars[0].x( 400, 0.8), no_comms_vars[0].fontSize(no_comms_vars[0].fontSize() - 4, 0.8), no_comms_vars[0].y(-200, 0.8)),
        sequence(0.1, no_comms_vars[1].x(-400, 0.8), no_comms_vars[1].fontSize(no_comms_vars[1].fontSize() - 4, 0.8), no_comms_vars[1].y(-200, 0.8)),
    );

    yield* waitUntil("instead");
    yield* sequence(0.1,
        all(...no_comms_vars.map((t, i) => t.x( ((1-i)*2-1)*2000 , 0.8 ))),
        all(...no_comms_bots.map((t, i) => t.x( ((1-i)*2-1)*2000 , 0.8 )))
    );
    cheese_mines.forEach(t => {t.remove(); t.dispose();});
    
    yield* waitUntil("showsqueaking");
    yield* map().x(0, 1.2);
    const squeaker = createRef<BattlecodeBot>();
    map().add(<>
        <PlumBabyRat ref={squeaker} map={map()}
            pos={new Vector2(-1, 4)} dir={Origin.Right}
        />
    </>);
    yield* chain(squeaker().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick());
    yield* chain(squeaker().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick());
    yield* chain(squeaker().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick());
    yield* chain(squeaker().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick());
    yield* chain(squeaker().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick());

    const squeak = createRef<Circle>();
    map().add(<>
        <Circle ref={squeak}
            zIndex={-1}// size={50}
            stroke={new Gradient({
                type: "radial",
                fromRadius: 0,
                toRadius: 430,
                stops: [
                    { offset: 0, color: "#5437b3", },
                    { offset: 1, color: "#221725", },
                ]
            })} lineWidth={30}
        />
    </>);
    
    yield loop(5, function* () {
        yield* all(squeak().size(440*2, 1.2), squeak().lineWidth(0, 1.8));
        squeak().size(0).lineWidth(30);
        yield* map().wait_for_next_tick();
    });

    yield* waitUntil("otherrats");
    const squeak_detector = createRef<BattlecodeBot>();
    map().add(<>
        <PlumBabyRat ref={squeak_detector} map={map()}
            pos={new Vector2(9, 6)} dir={Origin.Left}
        />
    </>);
    
    yield* chain(squeak_detector().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick());
    yield* map().wait_for_next_tick();
    yield* chain(squeaker().move_forward(TURN_MOVE_TIME), squeak_detector().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick());
    yield* map().wait_for_next_tick();
    yield* chain(squeaker().move_forward(TURN_MOVE_TIME), squeak_detector().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick());
    yield* waitFor(0.5);
    yield* squeak_detector().jump_up(1.5);
    // yield* chain(squeak_detector().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick());
    // yield* chain(squeak_detector().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick());

    yield* waitUntil("squeak_content");
    yield* map().x(-300, 1.2);
    const view_window = createRef<Rect>();
    const view_titlebar = createRef<Rect>();
    const view_title = createRef<Txt>();
    const view_lines = createRefArray<Layout>();
    const view_txts = createRefArray<Txt>();
    const view_line_data = [
        [ {text: "senderID", color: "#7094FF"}, {text: ": int", color: "#87753a"}, ],
        [ {text: "round", color: "#7094FF"}, {text: ": int", color: "#87753a"}, ],
        [ {text: "source", color: "#7094FF"}, {text: ": MapLoc", color: "#87753a"}, ],
        [ {text: "message", color: "#DB70FF"}, {text: ": int", color: "#87753a"}, ],
    ];
    view.add(<>
        <Rect ref={view_window}
            position={[550, 0]}
            // size={[300, 100]}
            width={0}
            fill={"#181818"} radius={10}
            stroke={"#31196C"} lineWidth={10}
            layout direction={"column"} clip
            // shadowOffsetY={12}
            // shadowColor={"#25145C"}
        >
            <Rect ref={view_titlebar}
                // size={[200, 80]}
                fill={"#31196C"} radius={10}
                layout padding={10} paddingLeft={15} paddingRight={20}
            >
                <RoboticTxt ref={view_title}
                    fontSize={80} fill={"#A285FF"}
                    text={"Squeak"}
                    // shadowOffsetY={4}
                    // shadowColor={"#c7b5ff33"}
                />
            </Rect>
            {view_line_data.map((l, i) => <Layout ref={view_lines}
                paddingTop={20} paddingLeft={25}
                gap={18}>
                {l.map((t, i) => <RoboticTxt ref={view_txts}
                    // text={t.text}
                    fill={t.color}
                    // fontSize={30}
                />)}
            </Layout>)}
            <Rect height={25} />
        </Rect>
    </>);
    yield* view_window().width(500, 0.8);

    yield* sequence(0.1,
        ...view_lines.slice(0, 3).map((l, li) => sequence(0.1,
            ...l.childrenAs<Txt>().map((t, ti) => t.text(view_line_data[li][ti].text, 0.8)),
        )),
    );
    yield* waitFor(1.5);
    yield* all(
        ...view_lines.slice(3).map((l, li) => sequence(0.1,
            ...l.childrenAs<Txt>().map((t, ti) => t.text(view_line_data[li+3][ti].text, 0.8)),
        )),
    );

    yield* waitUntil("danger");
    yield* sequence(0.1,
        view_window().x(2100, 1.2),
        map().x(0, 1.2),
    );

    const squeak_cat = createRef<BattlecodeBot>();
    map().add(<>
        <Cat ref={squeak_cat} map={map()}
            pos={new Vector2(-1, 1)} dir={Origin.Right}
        />
    </>);
    yield* chain(squeak_cat().move_forward(0.4), map().wait_for_next_tick());
    yield loop(1, function* () {
        yield* all(squeak().size(440*2, 1.2), squeak().lineWidth(0, 1.8));
        squeak().size(0).lineWidth(30);
        yield* map().wait_for_next_tick();
    });
    yield* chain(squeak_cat().move_forward(0.2), waitFor(0.1), squeak_cat().jump_up(1), map().wait_for_next_tick());
    yield* map().wait_for_next_tick();
    yield* chain(squeak_cat().look_and_move(Origin.BottomRight, 0.2), map().wait_for_next_tick());
    yield* squeak_detector().jump_up(1.1);
    yield* chain(squeak_cat().move_forward(0.2), squeak_detector().look_and_move(Origin.Right, 0.2), map().wait_for_next_tick());
    yield* chain(squeak_cat().look_and_move(Origin.Right, 0.2), squeak_detector().move_forward(0.2), map().wait_for_next_tick());
    yield* chain(all(squeak_cat().do_action(Origin.Right, "attack", 0.2), squeaker().show_healthbar(0.1), squeaker().damage_and_sync(0.5, 0.2), squeak_detector().move_forward(0.2)), map().wait_for_next_tick());
    yield* chain(all(squeak_cat().do_action(Origin.Right, "attack", 0.2), squeaker().opacity(0, 0.2)));
    yield  squeak_cat().sprite("eat", Origin.Right, 3);

    yield* waitUntil("second_option");
    yield* map().x(2000, 1.2);

    const global_arr = createRef<Rect>();
    const global_arr_blocks = createRefArray<Rect>();
    const global_arr_vals = createRefArray<Txt>();
    view.add(<>
        <Rect ref={global_arr}
            layout gap={12} padding={12}
            direction={"column"}
            fill={"#402B45"} radius={4}
            x={500} y={4200}
        >
            {range(64).map(i => <Rect ref={global_arr_blocks}
                width={300} height={100}
                radius={5}
                direction={"column"}
                fill={"#100a0b"}
            >
                <RoboticTxt
                    paddingLeft={5} paddingTop={5}
                    text={`${i}`}
                    fill={"#54385B"}
                    fontSize={20}
                />
                <Layout paddingLeft={25} paddingTop={5}>
                    <MonoTxt ref={global_arr_vals}
                        // text={"0000000000"}
                        fill={"#483D61"}
                        fontSize={40}
                    />
                </Layout>
            </Rect>)}
        </Rect>
    </>);
    yield* global_arr().y(3200, 1);

    const team = createRef<Node>();
    const team_members = createRefArray<Img>();
    const teamxposns = [-400,-50,-300,-180,-500];
    view.add(<Node ref={team}>
        <Img ref={team_members}
            src={br_rat}
            // size={0}
            size={100}
            position={[-400, -200]} x={-1200}
        />
        <Img ref={team_members}
            src={tr_rat}
            // size={0}
            size={100}
            position={[-50, 380]} x={-1200}
        />
        <Img ref={team_members}
            src={br_rat}
            // size={0}
            size={100}
            position={[-300, -380]} x={-1200}
        />
        <Img ref={team_members}
            src={rat_king}
            // size={0}
            size={280}
            position={[-180, 100]} x={-1200}
        />
        <Img ref={team_members}
            src={tr_rat}
            // size={0}
            size={100}
            position={[-500, 200]} x={-1200}
        />
    </Node>);
    yield* waitUntil("allaccess");
    yield* sequence(0.1,
        ...team_members.map((t, i) => t.x(teamxposns[i], 0.8))
    );

    yield* waitUntil("scroll_down");
    yield  global_arr().y(-3400, 6);

    yield* waitUntil("tenbit");
    yield* sequence(0.01,
        ...global_arr_vals.map(t => t.text("0000000000", 0.8)));

    yield* waitUntil("kingswrite");
    yield* wiggle(team_members[3].rotation, -20, 20, 0.8);
    yield* all(team_members[3].x(team_members[3].x() + 30, 0.2, easeOutExpo).back(0.2, easeInExpo),
        global_arr_vals[63].text("", 0.4).to("1100110011", 0.4), global_arr_vals[63].fill("#996188", 0.5));
    yield* all(team_members[3].x(team_members[3].x() + 30, 0.2, easeOutExpo).back(0.2, easeInExpo),
        global_arr_vals[61].text("", 0.4).to("1101110110", 0.4), global_arr_vals[61].fill("#996188", 0.5));
    
    yield* waitUntil("babiesread");
    yield* sequence(0.1,
        ...team_members.slice(0, 3).map((t, i) => all(
            t.y(t.y() - 40, 0.2, easeOutExpo).back(0.2, easeInExpo),
            t.scale(1.1, 0.2, easeOutExpo).back(0.2, easeInExpo),
            global_arr_vals[[58, 61, 63][i]].fill("#00FF00", 0.4).back(0.4),
            global_arr_vals[[58, 61, 63][i]].scale(1.1, 0.4).back(0.4),
        ))
    );

    yield* waitUntil("clearall");
    yield* sequence(0.1,
        global_arr().y(-4200, 1.2),
        ...team_members.reverse().map(t => t.x(t.x() - 1200, 0.8))
    )

    // yield* transition
    yield* waitUntil("end");
});