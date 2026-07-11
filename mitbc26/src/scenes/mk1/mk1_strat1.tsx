import { Circle, Code, Gradient, Img, Layout, Line, Polygon, Rect, Shape, Txt, makeScene2D } from "@motion-canvas/2d";
import { Origin, Vector2, all, any, chain, createRef, createRefArray, easeInExpo, easeOutBack, easeOutExpo, loop, noop, range, run, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { BattlecodeMap } from "../../battlecode/map";
import { Cheese, CheeseMine, PlumBabyRat, PlumRatKing, TileType, TileTypeInfo } from "../../battlecode/mit26/prefabs";
import { BattlecodeBot } from "../../battlecode/bot";
import { MonoTxt, RoboticTxt, append_to_code } from "../../components/helpers";

const TURN_TIME = 0.5
const TURN_MOVE_TIME = 0.2
const TURN_WAIT_TIME = TURN_TIME - TURN_MOVE_TIME

export default makeScene2D(function* (view) {
    const map = createRef<BattlecodeMap>();
    const static_map = range(11 * 11).map(t => TileType.Empty);

    view.add(<BattlecodeMap
        ref={map}
        x={0} y={0} faded_bounds={false}
        map_bounds={[11, 11]}
        tile_size={80} tile_gap={8}
        radius={3}
        base_colors={static_map.map(t => TileTypeInfo[t].color)}
    ></BattlecodeMap>);

    yield map().run_ticks(TURN_MOVE_TIME, TURN_WAIT_TIME);
    yield* waitUntil("show_map_a")
    yield* map().fade_in(3);

    const reporter = createRef<BattlecodeBot>();
    const writer = createRef<BattlecodeBot>();
    const mines = createRefArray<Img>();
    const cheeses = createRefArray<Img>();
    const reporter_view = createRef<Line>();
    map().add(<>
        <PlumBabyRat ref={reporter} map={map()}
            pos={new Vector2(2, 3)} dir={Origin.TopRight}
            scale={0}
        >
            <Line ref={reporter_view}
                
            />
        </PlumBabyRat>
        <PlumRatKing ref={writer} map={map()}
            pos={new Vector2(2, 5)} dir={Origin.Right}
            scale={0}
        />
    </>);
    map().add_item(9, 9, <CheeseMine ref={mines}   scale={0.0} />);
    map().add_item(9, 1, <CheeseMine ref={mines}   scale={0.0} />);
    map().add_item(8, 2, <Cheese     ref={cheeses} scale={0.0} />);

    yield* sequence(0.05,
        ...mines.map(t => t.scale(0.9, 0.4, easeOutBack)),
        noop(),
        noop(),
        noop(),
        writer().scale(0.9, 0.5, easeOutBack),
    );
    yield* chain(map().wait_for_next_tick(), all(reporter().scale(1.2, 0.5, easeOutBack)));
    yield* chain(map().wait_for_next_tick(), all(reporter().move_forward(TURN_MOVE_TIME)));
    yield* chain(map().wait_for_next_tick(), all(reporter().move_forward(TURN_MOVE_TIME)));
    yield* chain(map().wait_for_next_tick(), all(
        reporter().look_and_move(Origin.Right, TURN_MOVE_TIME),
        cheeses[0].scale(1, TURN_MOVE_TIME, easeOutBack),
    ));
    yield* chain(map().wait_for_next_tick(), all(reporter().look_and_move(Origin.BottomRight, TURN_MOVE_TIME)));
    yield* chain(map().wait_for_next_tick(), all(reporter().look_and_move(Origin.Right, TURN_MOVE_TIME)));

    const mine_loc_capture = createRef<Rect>();
    const mine_loc_field = createRef<Rect>();
    const mine_loc_pos = createRef<Txt>();
    view.add(<>
        <Rect ref={mine_loc_capture}
            position={[575, -200]}
            // size={[400, 80]}
            fill={"#221725"}
            radius={10}
        >
            <Rect ref={mine_loc_field}
                position={[50, 0]}
                // size={[275, 80]}
                radius={8}
                fill={"#100a0b"}
            >
                <RoboticTxt ref={mine_loc_pos}
                    // text={"[ 9, 1 ]"}
                    fill={"#97BABA"}
                />
            </Rect>
        </Rect>
    </>);
    yield  map().x(-300, 1.2);
    
    yield* waitUntil("recordloc0");
    yield  all(reporter().do_action(Origin.Right), cheeses[0].position(() => reporter().position(), 0.8), cheeses[0].scale(0.5, 0.8), cheeses[0].opacity(0.5, 0.8));
    yield* mine_loc_capture().size([400, 100], 0.8);
    const minecopy = mines[1].snapshotClone();
    minecopy.position(mine_loc_capture().position().scale(-1).add(map().position()).add(mines[1].position()));
    mine_loc_capture().add(minecopy);
    yield* all(
        minecopy.position([-150, 0], 0.8),
        mine_loc_field().size([275, 80], 0.8),
    );
    yield* mine_loc_pos().text("[ 9, 1 ]", 0.8);

    yield* waitUntil("return_of_kings");
    yield* chain(map().wait_for_next_tick(), all(reporter().look_and_move(Origin.Left, TURN_MOVE_TIME)));
    yield* chain(map().wait_for_next_tick(), all(reporter().look_and_move(Origin.Left, TURN_MOVE_TIME)));
    yield* chain(map().wait_for_next_tick(), all(reporter().look_and_move(Origin.BottomLeft, TURN_MOVE_TIME)));
    
    const squeak = createRef<Circle>();
    map().add(<>
        <Circle ref={squeak}
            position={() => reporter().position()}
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
    yield* cheeses[0].position(() => writer().position(), 0.8);
    yield loop(1, function* () {
        yield* all(squeak().size(440*2, 1.2), squeak().lineWidth(0, 1.8));
        squeak().size(0).lineWidth(30);
        yield* map().wait_for_next_tick();
    });

    const capture_clone = mine_loc_capture().snapshotClone();
    view.add(capture_clone);
    yield* all(capture_clone.position([-573, 9], 1.2), capture_clone.scale(0, 1.2), capture_clone.opacity(0, 1.8));

    yield* waitUntil("bitwiseme");
    const tellline1p1 = mine_loc_pos().clone().text("9").x(-22).y(-1);
    const tellline1p2 = mine_loc_pos().clone().text("1").x(31).y(-1);
    mine_loc_field().add(tellline1p1);
    mine_loc_field().add(tellline1p2);
    yield* all(tellline1p1.y(tellline1p1.y() + 120, 0.5), tellline1p2.y(tellline1p2.y() + 120, 0.5),
    tellline1p1.x(tellline1p1.x() - 80, 0.5), tellline1p2.x(tellline1p2.x() + 80, 0.5));
    yield* waitFor(1);
    const tellline2p1 = tellline1p1.clone().fontSize(32);
    const tellline2p2 = tellline1p2.clone().fontSize(32);
    mine_loc_field().add(tellline2p1);
    mine_loc_field().add(tellline2p2);
    yield* all(
        tellline2p1.text("00001001", 0.8), tellline2p1.y(tellline2p1.y() + 100, 0.8),
        tellline2p2.text("00000001", 0.8), tellline2p2.y(tellline2p2.y() + 100, 0.8),
    );
    yield* waitFor(1);
    const tellline3p1 = tellline2p1.clone();
    const tellline3p2 = tellline2p2.clone();
    const tellline3   = tellline2p2.clone().text("").x(0).y(tellline2p2.y() + 120).fontSize(60);
    mine_loc_field().add(tellline3p1);
    mine_loc_field().add(tellline3p2);
    mine_loc_field().add(tellline3);
    yield* sequence(0.3,
        all(
            tellline3p1.x(0, 0.8), tellline3p1.y(tellline3p1.y() + 100, 0.8), tellline3p1.text("", 0.8),
            tellline3p2.x(0, 0.8), tellline3p2.y(tellline3p2.y() + 100, 0.8), tellline3p2.text("", 0.8),
        ),
        tellline3.text("2305", 0.8),
    );

    yield* waitFor(2);
    yield* sequence(0.2,
        tellline3.y(0, 1),
        all(tellline2p1.text("", 0.4), tellline2p2.text("", 0.4)),
        all(tellline1p1.text("", 0.4), tellline1p2.text("", 0.4)),
        mine_loc_pos().text("", 0.4),
    );

    yield* waitUntil("dothethingbart");
    yield* all(mine_loc_capture().position([-573, 9], 1.2), mine_loc_capture().scale(0, 1.2), mine_loc_capture().opacity(0, 1.8));

    const global_arr = createRef<Rect>();
    const global_arr_blocks = createRefArray<Rect>();
    const global_arr_vals = createRefArray<Txt>();
    view.add(<>
        <Rect ref={global_arr}
            layout gap={12} padding={12}
            direction={"column"}
            fill={"#402B45"}
            x={575} y={1200}
        >
            {range(12).map(i => <Rect ref={global_arr_blocks}
                width={225} height={80}
                radius={5}
                direction={"column"}
                fill={"#100a0b"}
            >
                <RoboticTxt
                    paddingLeft={5} paddingTop={5}
                    text={`${40+i}`}
                    fill={"#54385B"}
                    fontSize={20}
                />
                <Layout paddingLeft={20} paddingTop={5}>
                    <MonoTxt ref={global_arr_vals}
                        text={"0000000000"}
                        fill={"#483D61"}
                        fontSize={30}
                    />
                </Layout>
            </Rect>)}
        </Rect>
    </>);
    yield* global_arr().y(400, 0.8);
    yield* all(writer().do_action(Origin.Right, null), global_arr_vals[0].text("", 0.4).to("1000001001", 0.4), global_arr_vals[0].fill("#66DBFF", 0.6));
    yield* all(writer().do_action(Origin.Right, null), global_arr_vals[1].text("", 0.4).to("1000000001", 0.4), global_arr_vals[1].fill("#66DBFF", 0.6));

    yield* waitUntil("otherguys");
    const otherguys = createRefArray<BattlecodeBot>();
    const othersqueaks = createRefArray<Circle>();
    map().add(<>
        <PlumBabyRat ref={otherguys} map={map()} pos={new Vector2(-1, 9)} dir={Origin.TopRight} >
            <Circle ref={othersqueaks}
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
        </PlumBabyRat>
        <PlumBabyRat ref={otherguys} map={map()} pos={new Vector2( 2, 11)} dir={Origin.Top}>
            <Circle ref={othersqueaks}
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
        </PlumBabyRat>
    </>);

    yield* chain(map().wait_for_next_tick(), all(...otherguys.map(t => t.move_forward(TURN_MOVE_TIME))));
    yield* chain(map().wait_for_next_tick(), all(...otherguys.map(t => t.move_forward(TURN_MOVE_TIME))));
    yield* chain(map().wait_for_next_tick(), any(
        otherguys[1].move_forward(TURN_MOVE_TIME),
        run(function*() {
            yield* all(othersqueaks[0].size(440*2, 1.2), othersqueaks[0].lineWidth(0, 1.8));
            othersqueaks[0].size(0).lineWidth(30);
            yield* map().wait_for_next_tick();
        }),
        writer().do_action(Origin.Right, null),
        all(
            global_arr_vals[2].text("", 0.4).to("1001000011", 0.4), global_arr_vals[2].fill("#668FFF", 0.6),
            global_arr_vals[3].text("", 0.4).to("1000110100", 0.4), global_arr_vals[3].fill("#668FFF", 0.6),
        ),
    ));
    yield* chain(map().wait_for_next_tick(), any(
        otherguys[1].move_forward(TURN_MOVE_TIME),
        otherguys[0].look_and_move(Origin.Left, TURN_MOVE_TIME),
    ));
    yield* chain(map().wait_for_next_tick(), any(
        run(function*() {
            yield* all(othersqueaks[1].size(440*2, 1.2), othersqueaks[1].lineWidth(0, 1.8));
            othersqueaks[1].size(0).lineWidth(30);
            yield* map().wait_for_next_tick();
        }),
        otherguys[0].look_and_move(Origin.Left, TURN_MOVE_TIME),
        writer().do_action(Origin.Right, null),
        all(
            global_arr_vals[4].text("", 0.4).to("1000001001", 0.4), global_arr_vals[4].fill("#8A66FF", 0.6),
            global_arr_vals[5].text("", 0.4).to("1000001001", 0.4), global_arr_vals[5].fill("#8A66FF", 0.6),
        ),
    ));

    yield* waitUntil("do_pathfind");
    const lineA = createRef<Line>();
    const lineB = createRef<Line>();
    map().add(<>
        <Line
            ref={lineA}
            lineWidth={5} stroke={'#66dbff'} lineCap={"round"}
            points={[map().get_tile_anchor(4,3), map().get_tile_anchor(5,2), map().get_tile_anchor(6,1), map().get_tile_anchor(7,1), map().get_tile_anchor(8,1), map().get_tile_anchor(9,1), ]}
            zIndex={-2} end={0}
        />
        <Line
            ref={lineB}
            lineWidth={5} stroke={'#8a66ff'} lineCap={"round"}
            points={[map().get_tile_anchor(2,7), map().get_tile_anchor(3,8), map().get_tile_anchor(4,9), map().get_tile_anchor(5,9), map().get_tile_anchor(6,9), map().get_tile_anchor(7,9), map().get_tile_anchor(8,9), map().get_tile_anchor(9,9), ]}
            zIndex={-2} end={0}
        />
    </>);
    yield* sequence(0.1, lineA().end(1, 0.8), lineB().end(1, 0.8));
    yield* chain(map().wait_for_next_tick(), all(
        reporter().look_and_move(Origin.TopRight, TURN_MOVE_TIME), otherguys[1].look_and_move(Origin.BottomRight, TURN_MOVE_TIME),
        lineA().start(0.22, TURN_MOVE_TIME), lineB().start(0.2, TURN_MOVE_TIME),
    ));
    yield* chain(map().wait_for_next_tick(), all(
        reporter().look_and_move(Origin.TopRight, TURN_MOVE_TIME), otherguys[1].look_and_move(Origin.BottomRight, TURN_MOVE_TIME),
        lineA().start(0.48, TURN_MOVE_TIME), lineB().start(0.38, TURN_MOVE_TIME),
    ));
    yield* chain(map().wait_for_next_tick(), all(
        reporter().look_and_move(Origin.Right, TURN_MOVE_TIME), otherguys[1].look_and_move(Origin.Right, TURN_MOVE_TIME),
        lineA().start(0.68, TURN_MOVE_TIME), lineB().start(0.5, TURN_MOVE_TIME),
    ));
    yield* chain(map().wait_for_next_tick(), all(
        reporter().look_and_move(Origin.Right, TURN_MOVE_TIME), otherguys[1].look_and_move(Origin.Right, TURN_MOVE_TIME),
        lineA().start(0.8, TURN_MOVE_TIME), lineB().start(0.6, TURN_MOVE_TIME),
    ));
    yield* chain(map().wait_for_next_tick(), all(
        reporter().look_and_move(Origin.Right, TURN_MOVE_TIME), otherguys[1].look_and_move(Origin.Right, TURN_MOVE_TIME),
        lineA().start(1, TURN_MOVE_TIME), lineB().start(0.78, TURN_MOVE_TIME),
        mines[1].opacity(0.5, TURN_MOVE_TIME),
    ));
    yield* chain(map().wait_for_next_tick(), all(
        reporter().look_in_dir_gen(Origin.BottomRight), otherguys[1].look_and_move(Origin.Right, TURN_MOVE_TIME),
        lineB().start(0.87, TURN_MOVE_TIME),
    ));
    yield* chain(map().wait_for_next_tick(), all(
        reporter().look_in_dir_gen(Origin.Bottom), otherguys[1].look_and_move(Origin.Right, TURN_MOVE_TIME),
        lineB().start(1, TURN_MOVE_TIME),
        mines[0].opacity(0.5, TURN_MOVE_TIME),
    ));

    yield chain(
        chain(map().wait_for_next_tick(), all(
            reporter().look_in_dir_gen(Origin.BottomLeft), otherguys[1].look_in_dir_gen(Origin.TopRight),
        )), chain(map().wait_for_next_tick(), all(
            reporter().look_in_dir_gen(Origin.Left), otherguys[1].look_in_dir_gen(Origin.Top),
        )), chain(map().wait_for_next_tick(), all(
            reporter().look_in_dir_gen(Origin.TopLeft), otherguys[1].look_in_dir_gen(Origin.TopLeft),
        )));
    yield* waitUntil("goaway");
    yield* all(global_arr().y(1200, 0.8), map().x(-2000, 1.2));

    yield* waitUntil("end");
});