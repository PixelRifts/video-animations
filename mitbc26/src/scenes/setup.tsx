import { Code, Img, Node, Rect, SVG, Txt, makeScene2D } from "@motion-canvas/2d";
import { Color, Origin, Vector2, all, chain, createRef, createRefArray, createSignal, easeInBack, easeInCirc, easeInExpo, easeOutCirc, easeOutExpo, linear, loop, loopFor, originToOffset, range, sequence, useTime, waitFor, waitUntil } from "@motion-canvas/core";
import { BattlecodeBot } from "../battlecode/bot";
import { BattlecodeMap } from "../battlecode/map";
import { TileType, TileTypeInfo, PlumBabyRat, CheddarRatKing, PlumRatKing, Cat, CheddarBabyRat } from "../battlecode/mit26/prefabs";
import { RoboticTxt, append_to_code, palette } from "../components/helpers";

const TURN_TIME = 0.5
const TURN_MOVE_TIME = 0.2
const TURN_WAIT_TIME = TURN_TIME - TURN_MOVE_TIME

export default makeScene2D(function* (view) {
    const time = createSignal(0);
    yield loop(Infinity, function* () { yield* time(time() + 10, 10, linear); });

    const map = createRef<BattlecodeMap>();
    const static_map = range(17 * 17).map(t => TileType.Empty);

    view.add(<BattlecodeMap
        ref={map}
        x={0} y={0} faded_bounds={false}
        map_bounds={[15, 15]}
        tile_size={60} tile_gap={4}
        radius={3}
        base_colors={static_map.map(t => TileTypeInfo[t].color)}
    ></BattlecodeMap>);

    yield map().run_ticks(TURN_MOVE_TIME, TURN_WAIT_TIME);
    yield* waitUntil("show_map_a")
    yield* map().fade_in(3);

    yield* waitUntil("oh_power_of_kings");
    const king_cheddar = createRef<BattlecodeBot>();
    const king_plum = createRef<BattlecodeBot>();
    map().add(<>
        <CheddarRatKing
            ref={king_cheddar}
            map={map()}
            pos={new Vector2(2, 13)}
            dir={Origin.Left}
            opacity={0} scale={0.2}
        />
        <PlumRatKing
            ref={king_plum}
            map={map()}
            pos={new Vector2(12, 1)}
            dir={Origin.Left}
            opacity={0} scale={0.2}
        />
    </>);
    yield* sequence(1,
        all(king_cheddar().scale(0.85, 0.8, easeInBack), king_cheddar().opacity(1, 0.8)),
        all(king_plum().scale(0.85, 0.8, easeInBack), king_plum().opacity(1, 0.8)),
    );

    yield* waitUntil("kitty");
    const cats = createRefArray<BattlecodeBot>();
    map().add(<>
        <Cat
            ref={cats}
            map={map()}
            pos={new Vector2(1, 1)}
            dir={Origin.BottomRight}
            opacity={0} scale={0.2}
        />
        <Cat
            ref={cats}
            map={map()}
            pos={new Vector2(12, 12)}
            dir={Origin.TopLeft}
            opacity={0} scale={0.2}
        />
    </>)

    yield* sequence(0.1, ...cats.map(t => all(t.opacity(1, 0.8), t.scale(1, 0.8))));
    const cat_move_loop = yield loop(1, function* () {
        for (let i = 0; i < 5; i++) {
            yield* all(
                cats[0].look_and_move(Origin.Bottom, TURN_MOVE_TIME),
                cats[1].look_and_move(Origin.Top, TURN_MOVE_TIME)
            );
            yield* map().wait_for_next_tick();
        }
        for (let i = 0; i < 5; i++) {
            yield* all(
                cats[0].look_and_move(Origin.TopRight, TURN_MOVE_TIME),
                cats[1].look_and_move(Origin.BottomLeft, TURN_MOVE_TIME),
            );
            yield* map().wait_for_next_tick();
        }
        for (let i = 0; i < 5; i++) {
            yield* all(
                cats[0].look_and_move(Origin.Left, TURN_MOVE_TIME),
                cats[1].look_and_move(Origin.Right, TURN_MOVE_TIME),
            );
            yield* map().wait_for_next_tick();
        }
    });

    const cooperation_label = createRef<Txt>();
    const cooperation_successive_rects = createRefArray<Rect>();
    view.add(<>
        <Node position={[-900, 0]} zIndex={-1}>
            {...range(2).map(i => <Rect
                ref={cooperation_successive_rects}
                position={[-55, -250]}
                // size={new Vector2([300, 300]).scale((i+2) * (i+2) * 0.15)}
                size={[0, 0]}
                fill={palette.GREENS[i]}// opacity={i}
                zIndex={-i} radius={80}
                rotation={() => (i + 1) * 100 - time() * ((i + 2) * 10)}
            />)}
            {...range(2).map(i => <Rect
                ref={cooperation_successive_rects}
                position={[-55, 250]}
                size={[0, 0]}
                // size={new Vector2([300, 300]).scale((i+2) * (i+2) * 0.25)}
                fill={palette.GREENS[i]}// opacity={i}
                zIndex={-i} radius={80}
                rotation={() => (i + 1) * 100 + time() * ((i + 2) * 10)}
            />)}
            <Rect
                ref={cooperation_successive_rects}
                position={[-55, 0]}
                // size={[4000, 4000]}
                size={[0, 0]}
                fill={palette.GREENS[2]}
                zIndex={-4} radius={80}
                rotation={45 + time()}
            />
        </Node>
        <Node position={[900, 0]} zIndex={-1}>
            {...range(2).map(i => <Rect
                ref={cooperation_successive_rects}
                position={[55, 250]}
                // size={new Vector2([300, 300]).scale((i+2) * (i+2) * 0.15)}
                size={[0, 0]}
                fill={palette.GREENS[i]}// opacity={i}
                zIndex={-i} radius={80}
                rotation={() => (i + 1) * 100 - time() * ((i + 2) * 10)}
            />)}
            {...range(2).map(i => <Rect
                ref={cooperation_successive_rects}
                position={[55, -250]}
                size={[0, 0]}
                // size={new Vector2([300, 300]).scale((i+2) * (i+2) * 0.25)}
                fill={palette.GREENS[i]}// opacity={i}
                zIndex={-i} radius={80}
                rotation={() => (i + 1) * 100 + time() * ((i + 2) * 10)}
            />)}
            <Rect
                ref={cooperation_successive_rects}
                position={[55, 0]}
                // size={[4000, 4000]}
                size={[0, 0]}
                fill={palette.GREENS[2]}
                zIndex={-4} radius={80}
                rotation={45 + time()}
            />
        </Node>
        <RoboticTxt ref={cooperation_label} fontSize={200} fill={"#00703e"} stroke={"#02bf4a"} lineWidth={5} />
    </>);

    const simbabies = createRefArray<BattlecodeBot>();
    const babyoffsetters = createRefArray<Node>();
    map().add(<>
        <Node ref={babyoffsetters}>
            <CheddarBabyRat
                ref={simbabies}
                pos={new Vector2(4, 11)}
                dir={Origin.TopRight}
                // scale={1.2}
                scale={0} opacity={0}
                map={map()}
            />
        </Node>
        <Node ref={babyoffsetters}>
            <CheddarBabyRat
                ref={simbabies}
                pos={new Vector2(3, 11)}
                dir={Origin.TopRight}
                // scale={1.2}
                scale={0} opacity={0}
                map={map()}
            />
        </Node>
        <Node ref={babyoffsetters}>
            <CheddarBabyRat
                ref={simbabies}
                pos={new Vector2(4, 12)}
                dir={Origin.TopRight}
                // scale={1.2}
                scale={0} opacity={0}
                map={map()}
            />
        </Node>
    </>)

    yield sequence(0.2,
        cooperation_label().text("Co-operation", 0.5).wait(1).back(0.5),
        all(cooperation_successive_rects[0].size(new Vector2([300, 300]).scale((2) * (2) * 0.15), 0.5),
            cooperation_successive_rects[2].size(new Vector2([300, 300]).scale((2) * (2) * 0.25), 0.7),
            cooperation_successive_rects[5].size(new Vector2([300, 300]).scale((2) * (2) * 0.15), 0.5),
            cooperation_successive_rects[7].size(new Vector2([300, 300]).scale((2) * (2) * 0.25), 0.7),),
        all(cooperation_successive_rects[1].size(new Vector2([300, 300]).scale((3) * (3) * 0.15), 0.5),
            cooperation_successive_rects[3].size(new Vector2([300, 300]).scale((3) * (3) * 0.25), 0.7),
            cooperation_successive_rects[6].size(new Vector2([300, 300]).scale((3) * (3) * 0.15), 0.5),
            cooperation_successive_rects[8].size(new Vector2([300, 300]).scale((3) * (3) * 0.25), 0.7),),
        cooperation_successive_rects[4].size(new Vector2([1000, 1000]).scale((3) * (3) * 0.25), 1.8),
        cooperation_successive_rects[9].size(new Vector2([1000, 1000]).scale((3) * (3) * 0.25), 1.8),
    );

    yield* waitUntil("begin_infiltration");
    yield* all(simbabies[0].scale(1.2, TURN_MOVE_TIME), simbabies[0].opacity(1, 0.2));
    yield* map().wait_for_next_tick();

    yield chain(loop(7, function* () {
        yield* simbabies[0].look_and_move(Origin.TopRight, TURN_MOVE_TIME);
        yield* map().wait_for_next_tick();
    }), loop(1, function* () {
        yield* simbabies[0].look_and_move(Origin.Top, TURN_MOVE_TIME);
        yield* map().wait_for_next_tick();
    }), all(
        king_plum().show_healthbar(0.2),
        king_plum().damage_and_sync(0.1, 0.5),
        babyoffsetters[0].position(babyoffsetters[0].position().addY(-20), 0.1, easeOutExpo).back(0.1, easeInExpo),
        sequence(0.05,
            all(cooperation_successive_rects[0].fill(palette.REDS[0], 0.5),
                cooperation_successive_rects[2].fill(palette.REDS[0], 0.7),
                cooperation_successive_rects[5].fill(palette.REDS[0], 0.5),
                cooperation_successive_rects[7].fill(palette.REDS[0], 0.7),),
            all(cooperation_successive_rects[1].fill(palette.REDS[1], 0.5),
                cooperation_successive_rects[3].fill(palette.REDS[1], 0.7),
                cooperation_successive_rects[6].fill(palette.REDS[1], 0.5),
                cooperation_successive_rects[8].fill(palette.REDS[1], 0.7),),
            cooperation_successive_rects[4].fill(palette.REDS[2], 1.8),
            cooperation_successive_rects[9].fill(palette.REDS[2], 1.8),
        )
    ))

    yield* all(simbabies[1].scale(1.2, TURN_MOVE_TIME), simbabies[1].opacity(1, 0.2));
    yield* map().wait_for_next_tick();

    yield loop(7, function* () {
        yield* simbabies[1].look_and_move(Origin.TopRight, TURN_MOVE_TIME);
        yield* map().wait_for_next_tick();
    })
    yield* all(simbabies[2].scale(1.2, TURN_MOVE_TIME), simbabies[2].opacity(1, 0.2));
    yield* map().wait_for_next_tick();

    yield loop(6, function* () {
        yield* simbabies[2].look_and_move(Origin.TopRight, TURN_MOVE_TIME);
        yield* map().wait_for_next_tick();
    })


    yield* waitUntil("backstab");
    cooperation_label().fill("#700018").stroke("#BF021B");
    yield* sequence(0.1,
        cooperation_label().text("Backstab", 0.5).wait(1).back(0.5),
    );

    yield* waitUntil("resume_backstab");
    yield* all(
        simbabies[2].execute_moves(TURN_MOVE_TIME, Origin.TopRight, Origin.TopRight, Origin.Top),
        simbabies[1].execute_moves(TURN_MOVE_TIME, Origin.Top,),
    );
    yield* waitUntil("ATTACKKKKK");
    simbabies[1].look_in_dir(Origin.TopRight);
    yield loop(6, function* () {
        yield all(
            babyoffsetters[0].position(babyoffsetters[0].position().addY(-20), 0.1, easeOutExpo).back(0.1, easeInExpo),
            babyoffsetters[1].position(babyoffsetters[1].position().add([20, -20]), 0.1, easeOutExpo).back(0.1, easeInExpo),
            babyoffsetters[2].position(babyoffsetters[2].position().addY(-20), 0.1, easeOutExpo).back(0.1, easeInExpo),
        );
        king_plum().damage(0.15);
        yield king_plum().health_sync(0.5);

        yield* map().wait_for_next_tick();
    });

    yield* waitUntil("grunt_work");
    yield* all(
        map().scale(2.3, 1.2),
        map().position([500, -700], 1.2),
    )

    const builders = createRefArray<BattlecodeBot>();
    const builder_offsetters = createRefArray<Node>();
    map().add(<>
        <Node ref={builder_offsetters}>
            <CheddarBabyRat
                ref={builders}
                pos={new Vector2(4, 11)}
                dir={Origin.TopRight}
                // scale={1.2}
                scale={0} opacity={0}
                map={map()}
            />
        </Node>
        <Node ref={builder_offsetters}>
            <CheddarBabyRat
                ref={builders}
                pos={new Vector2(3, 11)}
                dir={Origin.TopRight}
                // scale={1.2}
                scale={0} opacity={0}
                map={map()}
            />
        </Node>
        <Node ref={builder_offsetters}>
            <CheddarBabyRat
                ref={builders}
                pos={new Vector2(4, 12)}
                dir={Origin.TopRight}
                // scale={1.2}
                scale={0} opacity={0}
                map={map()}
            />
        </Node>
    </>);

    const dirt_locs = [[4, 9], [5, 9], [6, 10], [3, 9], [2, 9], [6, 12], [6, 13], [6, 14], [1, 9], [0, 9]];
    const dirt = createRefArray<Rect>();
    map().add(<>
        <Node>
            {...dirt_locs.map(l => <Rect
                ref={dirt} fill={"#3B2931"} radius={4}
                position={map().get_tile_anchor(l[0], l[1])}
                size={() => map().tile_size() - 4} scale={0}
            />)}
        </Node>
    </>);

    yield* chain(
        ...builders.map(t => all(
            all(t.scale(1.2, TURN_MOVE_TIME), t.opacity(1, 0.2)),
            map().wait_for_next_tick(),
        ))
    );

    yield* all(
        chain(
            chain(builders[0].look_and_move(Origin.Top, TURN_MOVE_TIME), map().wait_for_next_tick()),
            chain(builders[0].do_action(Origin.Top), dirt[0].scale(1, TURN_MOVE_TIME), map().wait_for_next_tick()),
            chain(builders[0].do_action(Origin.TopRight), dirt[1].scale(1, TURN_MOVE_TIME), map().wait_for_next_tick()),
            chain(builders[0].look_and_move(Origin.Right, TURN_MOVE_TIME), map().wait_for_next_tick()),
            chain(builders[0].do_action(Origin.Right), dirt[2].scale(1, TURN_MOVE_TIME), map().wait_for_next_tick()),
        ),

        chain(
            chain(builders[1].look_and_move(Origin.Top, TURN_MOVE_TIME), map().wait_for_next_tick()),
            chain(builders[1].do_action(Origin.Top), dirt[3].scale(1, TURN_MOVE_TIME), map().wait_for_next_tick()),
            chain(builders[1].do_action(Origin.TopLeft), dirt[4].scale(1, TURN_MOVE_TIME), map().wait_for_next_tick()),
            chain(builders[1].look_and_move(Origin.Left, TURN_MOVE_TIME), map().wait_for_next_tick()),
            chain(builders[1].look_and_move(Origin.Left, TURN_MOVE_TIME), map().wait_for_next_tick()),
            chain(builders[1].do_action(Origin.Top), dirt[8].scale(1, TURN_MOVE_TIME), map().wait_for_next_tick()),
            chain(builders[1].do_action(Origin.TopLeft), dirt[9].scale(1, TURN_MOVE_TIME), map().wait_for_next_tick()),
        ),

        chain(
            chain(builders[2].look_and_move(Origin.BottomRight, TURN_MOVE_TIME), map().wait_for_next_tick()),
            chain(builders[2].do_action(Origin.TopRight), dirt[5].scale(1, TURN_MOVE_TIME), map().wait_for_next_tick()),
            chain(builders[2].do_action(Origin.Right), dirt[6].scale(1, TURN_MOVE_TIME), map().wait_for_next_tick()),
            chain(builders[2].do_action(Origin.BottomRight), dirt[7].scale(1, TURN_MOVE_TIME), map().wait_for_next_tick()),
        ),
    );

    yield* waitUntil("highlighteverything");
    yield* sequence(0.2,
        builders[1].highlight(1.5, 1.5),
        builders[0].highlight(1.5, 1.5),
        builders[2].highlight(1.5, 1.5),
        waitFor(0.1),
        waitFor(0.1),
        king_cheddar().highlight(1.5, 1.5, 15),
    );

    yield* waitUntil("removeall");
    yield* sequence(0.5,
        all(
            map().scale(1, 1.2),
            map().position([0, 0], 1.2),
        ),
        sequence(0.1,
            ...cooperation_successive_rects.map(t => t.size([0, 0], 0.8)),
            sequence(0.05,
                ...builders.map(t => all(t.scale(0, 0.5), t.opacity(0, 0.6))),
                ...simbabies.map(t => all(t.scale(0, 0.5), t.opacity(0, 0.6))),
                ...dirt.map(t => all(t.scale(0, 0.5), t.opacity(0, 0.6))),
                ...cats.map(t => all(t.scale(0, 0.5), t.opacity(0, 0.6))),
                all(king_cheddar().scale(0, 0.5), king_cheddar().opacity(0, 0.6)),
                all(king_plum().scale(0, 0.5), king_plum().opacity(0, 0.6))
            )
        ),
    );
    yield* map().y(-1100, 1.2);

    yield* waitUntil("botscript");
    const script_code = createRef<Code>();
    view.add(<>
        <Code ref={script_code}
            fontSize={40}
            code={``}
        />
    </>);
    // yield* 

    yield* append_to_code(script_code(), `\
public class RobotPlayer {
    public static void run(RobotController rc)
        throws GameActionException {
        System.out.println("Init");

        while (true) {
            System.out.println("Tick");
            Clock.yield(); // Next turn
        }
    }
}`, 2);

    yield* waitUntil("constraint");
    yield* all(script_code().y(script_code().y() - 40, 0.5), script_code().opacity(0, 0.5));
    yield* waitUntil("end");
});