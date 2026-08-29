import { Circle, Img, Layout, Node, Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import { Origin, Vector2, all, chain, createRef, createRefArray, createSignal, easeInCirc, easeInExpo, easeOutBack, easeOutCirc, easeOutExpo, loop, range, run, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { MonoTxt, RoboticTxt } from "../../components/helpers";
import { Cat, CatTrap, CheddarBabyRat, TileType, TileTypeInfo } from "../../battlecode/mit26/prefabs";
import { BattlecodeMap } from "../../battlecode/map";
import { BattlecodeBot } from "../../battlecode/bot";

import simplerat from "../../battlecode/mit26/img/robots/cheddar/rat_7_64x64.png";
import simpleratdown from "../../battlecode/mit26/img/robots/cheddar/rat_3_64x64.png";
import simpleratup from "../../battlecode/mit26/img/robots/plum/rat_7_64x64.png";
import simpleratleft from "../../battlecode/mit26/img/robots/plum/rat_1_64x64.png";
import simplecat from "../../battlecode/mit26/img/robots/cat/cat_3.png";
import simplecatright from "../../battlecode/mit26/img/robots/cat/cat_5.png";
import simplecattopright from "../../battlecode/mit26/img/robots/cat/cat_6.png";
import simplecatup from "../../battlecode/mit26/img/robots/cat/cat_7.png";
import simplecatattack from "../../battlecode/mit26/img/robots/cat/cat_scratch_3.png";
import simplecatupattack from "../../battlecode/mit26/img/robots/cat/cat_scratch_7.png";
import simplecatnom from "../../battlecode/mit26/img/robots/cat/cat_feed_3.png";
import simplecatnomright from "../../battlecode/mit26/img/robots/cat/cat_feed_5.png";
import simplecatnomtopright from "../../battlecode/mit26/img/robots/cat/cat_feed_6.png";
import simpleratkingleft from "../../battlecode/mit26/img/robots/plum/rat_king_64x64.png";
import cats_were_dumb from "../../video/CatSpec.png";

const TURN_TIME = 0.5
const TURN_MOVE_TIME = 0.2
const TURN_WAIT_TIME = TURN_TIME - TURN_MOVE_TIME

export default makeScene2D(function* (view) {
    yield* waitUntil("catstart");
    
    yield* waitUntil("brokenspec");
    const spec_img = createRef<Img>();
    const darken = createRef<Rect>();
    const highlight = createRef<Rect>();
    view.add(<>
        <Layout ref={spec_img} scale={1.2} y={1500}>
            <Img
                src={cats_were_dumb}
                radius={5}
                stroke={"#221725"} lineWidth={16}
            />
            <Node cache>
                <Rect
                    ref={highlight}
                    size={0}
                    radius={5}
                    fill={'white'}
                />
                <Rect ref={darken}
                    size={{"x":772,"y":805}}
                    radius={5}
                    fill={'rgba(0, 0, 0, 0)'}
                    compositeOperation={'source-out'}
                />
            </Node>
        </Layout>
    </>);
    yield* spec_img().y(0, 1.2, easeOutBack);

    yield* waitUntil("firstofall");
    yield* sequence(0.1, all(spec_img().x(-300, 1.2), spec_img().y(-800, 1.2), darken().fill("rgba(0, 0, 0, 0.8)", 0.8),), spec_img().scale(1.6, 1.2));
    yield* all(
        highlight().size([772, 170], 0.8),
        highlight().y(310, 0.8),
    );

    yield* waitUntil("showvisions");
    const viscat = createRef<Img>();
    const catvis = createRef<Circle>();
    const visrat = createRef<Img>();
    const ratvis = createRef<Circle>();
    const viscatparent = createRef<Node>();
    const visratparent = createRef<Node>();
    const visratmaxbar = createRef<Rect>();
    const visrathealth = createRef<Rect>();
    const visrathealthpct = createSignal(1.0);
    view.add(<>
        <Node ref={viscatparent} x={175} /* y={100} */ y={1000}>
            <Circle ref={catvis}
                startAngle={90} endAngle={270} closed
                size={150*Math.sqrt(14)*1.5} fill={"#100a0bdd"}
                lineWidth={5} stroke={"#fff"}
                lineDash={[50, 20]} rotation={-90}
            />
            <Img ref={viscat}
                src={simplecat}
                scale={0.1*0.7}
            />
        </Node>
        
        <Node ref={visratparent} x={-175} /* y={300} */ y={1000}>
            <Circle ref={ratvis}
                startAngle={-45} endAngle={45} closed
                size={150*Math.sqrt(14)*1.5} fill={"#100a0bdd"}
                lineWidth={5} stroke={"#fff"}
                lineDash={[50, 20]} rotation={-90}
            />
            <Img ref={visrat}
                src={simplerat}
                scale={0.1*0.7}
            >
                <Rect
                    ref={visratmaxbar}
                    position={[0, 400]}
                    size={() => ["80%", 80]}
                    fill={"#221725"}
                    opacity={0}
                >
                    <Rect
                        ref={visrathealth}
                        position={() => [-1540 / 2, 0]} offsetX={-1}
                        size={() => [`${Math.floor(visrathealthpct()*80)}%`, 40]}
                        fill={"#00FFFF"}
                    ></Rect>
                </Rect>
            </Img>
        </Node>
    </>);
    yield* sequence(0.1,
        viscatparent().y(100, 1.2),
        visratparent().y(300, 1.2),
    );

    const hp_txt = createRef<Txt>();
    viscatparent().add(<RoboticTxt ref={hp_txt}
        // text={"Hp: A lot"}
        y={240} fontSize={60}
        fill={"#3D7A3D"}
        stroke={"#5CAD5C"} lineWidth={2}
    />)
    yield* waitUntil("highhp");
    yield* all(
        visratparent().x(-4000, 1.2),
        all(ratvis().startAngle(0, 0.4), ratvis().endAngle(0, 0.4), ratvis().opacity(0, 0.6)),
        all(catvis().startAngle(180, 0.4), catvis().endAngle(180, 0.4), catvis().opacity(0, 0.6)),
    );
    yield* all(
        sequence(0.1,
            spec_img().y(600, 1.8), darken().fill("rgba(0, 0, 0, 0.8)", 1.5),
            highlight().size([772, 50], 1.5),
            highlight().y(-305, 1.5),
        ),
        sequence(0.1,
            viscatparent().x(650, 1.5),
            viscatparent().y(-100, 1.5),
            viscat().scale(0.175, 1.5),
            hp_txt().text("HP: a lot", 1.2),
        )
    );

    yield* waitUntil("scratchattack");
    yield* all(
        hp_txt().text("", 1.2),
        sequence(0.1,
            spec_img().y(100, 1.8), darken().fill("rgba(0, 0, 0, 0.8)", 1.5),
            highlight().size([772, 50], 1.5),
            highlight().y(44, 1.5),
        ),
    );
    // simplecatattack
    viscatparent().zIndex(1);
    visratparent().position([665, 1000]);
    visrat().scale(0.2);
    yield* sequence(0.1, visratparent().position([665, 200], 0.8));
    yield* visratmaxbar().opacity(1, 0.5);
    yield* all(
        chain(
            viscat().src(simplecatattack, 0.0),
            all(
                viscatparent().y(viscatparent().y() + 100, 0.2, easeOutCirc).back(0.2, easeInCirc),
                visrathealthpct(0.5, 0.4),
            ),
            viscat().src(simplecat, 0.0),
        ),
    );

    yield* waitUntil("justmoveonto");
    yield* sequence(0.1,
        spec_img().y(-200, 1.8), darken().fill("rgba(0, 0, 0, 0.8)", 1.5),
        highlight().size([772, 80], 1.5),
        highlight().y(170, 1.5),
    );
    yield* sequence(0.4, viscatparent().y(visratparent().y(), 1.2, easeOutExpo), all(visrathealthpct(0, 0.4), visratparent().opacity(0, 0.8)));  

    yield* waitUntil("pounceishard");
    yield* sequence(0.1,
        spec_img().y(0, 1.8), darken().fill("rgba(0, 0, 0, 0.8)", 1.5),
        highlight().size([772, 90], 1.5),
        highlight().y(-25, 1.5),
    );
    const otherrat = visratparent().snapshotClone();
    view.add(otherrat);
    otherrat.childAs<Img>(1).childAs<Node>(0).remove();
    otherrat.childAs<Img>(1).src(simpleratdown);
    otherrat.opacity(1).y(-700);
    yield* otherrat.y(-400, 0.5, easeOutExpo);
    viscat().src(simplecatupattack);
    
    yield* waitFor(2);
    viscat().src(simplecatupattack);
    yield* all(otherrat.opacity(0, 0.8), viscatparent().y(otherrat.y(), 0.8, easeOutExpo));
    viscat().src(simplecatup);

    yield* waitUntil("bad");
    yield* all(spec_img().x(-2000, 1.2), viscatparent().x(2000, 1.2));

    yield* waitUntil("line");
    const lineparent = createRef<Node>();
    const theking = createRef<Img>();
    const thecat = createRef<Img>();
    const babyline = createRefArray<Img>();

    view.add(<Node ref={lineparent}>
        <Img ref={theking}
            // scale={0.15}
            scale={0}
            src={simpleratkingleft}
            x={800}
        />
        <Img ref={thecat}
            // scale={0.12}
            scale={0}
            src={simplecatright}
            x={-1200}
        />
        {...range(6).map(i => <>
            <Img ref={babyline}
                // scale={0.145}
                scale={0}
                src={simpleratleft}
                x={700}
            />
        </>)}
    </Node>);
    yield* theking().scale(0.1, 0.5, easeOutBack);
    yield* thecat().scale(0.1, 0.5, easeOutBack);
    babyline[1].y(babyline[1].y() - 180);
    babyline[2].y(babyline[2].y() + 180);
    babyline[3].y(babyline[3].y() - 180);
    
    // yield* 
    let active = 0;
    yield* sequence(0.05, ...range(6).map(t => babyline[t].x(babyline[t].x() - 180, 0.2)));
    yield* babyline[active++].scale(0.145, 0.5, easeOutBack);
    yield* waitFor(0.3);
    yield* all(...range(active).map(t => babyline[t].x(babyline[t].x() - 180, 0.2)), babyline[active++].scale(0.145, 0.5, easeOutBack));
    yield* waitFor(0.3);
    yield* all(...range(active).map(t => babyline[t].x(babyline[t].x() - 180, 0.2)), babyline[active++].scale(0.145, 0.5, easeOutBack));
    yield* waitFor(0.3);
    yield* all(...range(active).map(t => babyline[t].x(babyline[t].x() - 180, 0.2)), thecat().x(thecat().x() + 180, 0.2));
    yield* waitFor(0.3);
    yield* all(...range(active).map(t => babyline[t].x(babyline[t].x() - 180, 0.2)), thecat().x(thecat().x() + 180, 0.2));
    yield* waitFor(0.3);
    yield* all(...range(active).map(t => babyline[t].x(babyline[t].x() - 180, 0.2)), thecat().x(thecat().x() + 180, 0.2));

    yield* waitUntil("catattack1");
    yield* all(thecat().position(babyline[0].position(), 0.2), babyline[0].opacity(0, 0.2));
    thecat().src(simplecatnomright);
    yield* waitFor(0.5);
    yield* all(...range(active, active).map(t => babyline[t].x(babyline[t].x() - 180, 0.2)), babyline[active++].scale(0.145, 0.5, easeOutBack));
    yield* waitFor(0.3);

    yield* waitUntil("catattack2");
    thecat().src(simplecattopright);
    yield* all(thecat().position(babyline[1].position(), 0.2), babyline[1].opacity(0, 0.2));
    thecat().src(simplecatnomtopright);
    yield* waitFor(0.5);
    yield* all(...range(active-1, active).map(t => babyline[t].x(babyline[t].x() - 180, 0.2)), babyline[active++].scale(0.145, 0.5, easeOutBack));
    yield* waitFor(0.3);


    yield* waitUntil("catattack3");
    thecat().src(simplecat);
    yield* all(thecat().position(babyline[2].position(), 0.2), babyline[2].opacity(0, 0.2));
    thecat().src(simplecatnom);
    yield* waitFor(0.5);
    yield* all(...range(active-2, active).map(t => babyline[t].x(babyline[t].x() - 180, 0.2)));
    yield* waitFor(0.3);


    yield* waitUntil("catattack4");
    thecat().src(simplecattopright);
    yield* all(thecat().position(babyline[4].position(), 0.2), babyline[4].opacity(0, 0.2));
    thecat().src(simplecatnomtopright);
    yield* theking().y(theking().y() - 60, 0.1, easeOutExpo).back(0.1, easeInExpo);


    yield* waitUntil("tiemtodip");
    yield* all(theking().x(theking().x() + 180, 0.2));
    yield* waitFor(0.5);
    thecat().src(simplecatright);
    yield* all(theking().x(theking().x() + 180, 0.2), thecat().x(thecat().x() + 180, 0.2));
    yield* waitFor(0.5);
    thecat().src(simplecatright);
    babyline[3].src(simpleratup);
    yield* all(theking().x(theking().x() + 180, 0.2), thecat().x(thecat().x() + 180, 0.2), babyline[3].y(babyline[3].y()-180, 0.2));
    yield* waitFor(0.5);
    thecat().src(simplecatright);
    yield* all(theking().x(theking().x() + 180, 0.2), thecat().x(thecat().x() + 180, 0.2), babyline[3].y(babyline[3].y()-180, 0.2));
    yield* waitFor(0.5);
    thecat().src(simplecatright);
    yield* all(theking().x(theking().x() + 180, 0.2), thecat().x(thecat().x() + 180, 0.2), babyline[3].y(babyline[3].y()-180, 0.2));
    yield* waitFor(0.5);
    thecat().src(simplecatright);
    yield* all(theking().x(theking().x() + 180, 0.2), thecat().x(thecat().x() + 180, 0.2), babyline[3].y(babyline[3].y()-180, 0.2));

    yield* waitUntil("catstratbad");
    
    const map = createRef<BattlecodeMap>();
    const static_map = range(11 * 11).map(t => TileType.Empty);

    view.add(<BattlecodeMap
        ref={map}
        x={0} y={0} faded_bounds={false}
        map_bounds={[10, 10]}
        tile_size={90} tile_gap={8}
        radius={3}
        base_colors={static_map.map(t => TileTypeInfo[t].color)}
    ></BattlecodeMap>);

    yield map().run_ticks(TURN_MOVE_TIME, TURN_WAIT_TIME);
    yield* map().fade_in(3);
    const chaser = createRef<BattlecodeBot>();
    const runner = createRef<BattlecodeBot>();
    const traps = createRefArray<Img>();
    map().add(<CheddarBabyRat ref={runner} map={map()}
        pos={new Vector2(11, 4)}
        dir={Origin.Left}
        // scale={0}
    />);
    map().add(<Cat ref={chaser} map={map()}
        pos={new Vector2(0, 4)}
        dir={Origin.Right}
        scale={0}
    />);
    map().add(<>
        <CatTrap ref={traps}
            position={map().get_tile_anchor(5, 4)}
            scale={0}
            size={map().tile_size()}
            zIndex={-1}
        />
        <CatTrap ref={traps}
            position={map().get_tile_anchor(6, 4)}
            scale={0}
            size={map().tile_size()}
            zIndex={-1}
        />
    </>)
    yield* map().wait_for_next_tick();
    yield loop(9, () => all(
        chain(runner().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick()),
    ));
    yield* chaser().scale(1, 0.8, easeOutBack);
    
    yield* waitUntil("syncedmove");
    
    yield* chain(runner().look_and_move(Origin.Right, TURN_MOVE_TIME), chaser().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick());
    yield* chain(all(runner().do_action(Origin.Left), chaser().show_healthbar(0.1), chaser().damage_and_sync(0.02, 0.1)), map().wait_for_next_tick());
    yield* chain(runner().look_and_move(Origin.Right, TURN_MOVE_TIME), chaser().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick());
    yield* chain(all(runner().do_action(Origin.Left), chaser().damage_and_sync(0.02, 0.1)), map().wait_for_next_tick());
    yield* chain(runner().look_and_move(Origin.Right, TURN_MOVE_TIME), chaser().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick());
    yield* chain(all(runner().do_action(Origin.Left), chaser().damage_and_sync(0.02, 0.1)), map().wait_for_next_tick());
    
    yield* waitUntil("dothetrapthing");
    yield* chain(runner().look_and_move(Origin.Right, TURN_MOVE_TIME), map().wait_for_next_tick());
    yield* chain(all(runner().do_action(Origin.Left), traps[0].scale(1, 0.2, easeOutBack)), map().wait_for_next_tick());
    yield* waitFor(0.4);

    map().save();
    yield* all(map().x(-200, 1.2), map().y(500, 1.2), map().scale(4.5, 1.2));

    yield* waitUntil('backtooverview');
    yield* map().restore(1.2);
    yield* chain(runner().look_and_move(Origin.Right, TURN_MOVE_TIME), chaser().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick());
    yield* chain(all(traps[0].scale(1.3, 0.3), traps[0].opacity(0, 0.3), chaser().damage_and_sync(0.1, 0.1)), map().wait_for_next_tick());

    yield* chain(all(runner().do_action(Origin.Left), traps[1].scale(1, 0.2, easeOutBack)), map().wait_for_next_tick());
    yield* waitFor(3);
    yield* map().wait_for_next_tick();
    yield* chain(runner().look_and_move(Origin.Right, TURN_MOVE_TIME), chaser().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick());
    yield* chain(all(traps[1].scale(1.3, 0.3), traps[1].opacity(0, 0.3), chaser().damage_and_sync(0.1, 0.1)), map().wait_for_next_tick());

    
    const fail_popup = createRef<Txt>();
    view.add(<>
        <RoboticTxt ref={fail_popup}
            text={"FAIL"}
            fontSize={40} lineWidth={2}
            fill={"#AF2334"} stroke={"#4F2334"}
            opacity={0}
        />
    </>);
    yield* chain(all(
        runner().do_action(Origin.Left),
        runner().scale(1.1, 0.2, easeOutCirc).back(0.2, easeInCirc),
        chain(all(fail_popup().position(runner().position().addY(-40), 0), fail_popup().opacity(1, 0)),
            all(fail_popup().y(fail_popup().y() - 80, 0.8), fail_popup().opacity(0, 0.5)))
    ), map().wait_for_next_tick());
    yield* chain(runner().look_and_move(Origin.Right, TURN_MOVE_TIME), chaser().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick());
    yield* chain(waitFor(0.1), map().wait_for_next_tick());

    yield* chain(all(
        runner().do_action(Origin.Left),
        runner().scale(1.1, 0.2, easeOutCirc).back(0.2, easeInCirc),
        chain(all(fail_popup().position(runner().position().addY(-40), 0), fail_popup().opacity(1, 0)),
            all(fail_popup().y(fail_popup().y() - 80, 0.8), fail_popup().opacity(0, 0.5)))
    ), map().wait_for_next_tick());
    yield* chain(runner().look_and_move(Origin.Right, TURN_MOVE_TIME), chaser().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick());
    yield* chain(waitFor(0.1), map().wait_for_next_tick());

    yield* chain(all(
        runner().do_action(Origin.Left),
        runner().scale(1.1, 0.2, easeOutCirc).back(0.2, easeInCirc),
        chain(all(fail_popup().position(runner().position().addY(-40), 0), fail_popup().opacity(1, 0)),
            all(fail_popup().y(fail_popup().y() - 80, 0.8), fail_popup().opacity(0, 0.5)))
    ), map().wait_for_next_tick());
    yield* chain(runner().look_and_move(Origin.Right, TURN_MOVE_TIME), chaser().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick());
    yield* chain(runner().look_and_move(Origin.Right, TURN_MOVE_TIME), chaser().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick());
    yield* chain(runner().look_and_move(Origin.Right, TURN_MOVE_TIME), chaser().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick());
    yield* chain(runner().look_and_move(Origin.Right, TURN_MOVE_TIME), chaser().move_forward(TURN_MOVE_TIME), map().wait_for_next_tick());

    yield* waitUntil("end");
    yield* map().fade_out();
});
