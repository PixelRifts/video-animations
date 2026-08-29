import { Img, Node, Rect, makeScene2D } from "@motion-canvas/2d";
import { Origin, Vector2, all, chain, createRef, createRefArray, easeInCirc, easeInCubic, easeInExpo, easeInSine, easeOutBack, easeOutCirc, easeOutCubic, easeOutExpo, easeOutSine, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { CheddarBabyRat, Dirt, PlumBabyRat, TileType, TileTypeInfo } from "../../battlecode/mit26/prefabs";
import { BattlecodeMap } from "../../battlecode/map";
import { BattlecodeBot } from "../../battlecode/bot";

import simpleratkingleft from "../../battlecode/mit26/img/robots/plum/rat_king_64x64.png";
import simplecatright from "../../battlecode/mit26/img/robots/cat/cat_5.png";
import simplecatnomright from "../../battlecode/mit26/img/robots/cat/cat_feed_5.png";

const TURN_TIME = 0.5
const TURN_MOVE_TIME = 0.2
const TURN_WAIT_TIME = TURN_TIME - TURN_MOVE_TIME

export default makeScene2D(function* (view) {
    yield* waitUntil('getkingaway');
    const runner_king = createRef<Img>();
    const chaser_cat = createRef<Img>();
    const middle_dirt = createRef<Rect>();

    const lineparent = createRef<Node>();
    view.add(<Node ref={lineparent}>
        <Img ref={runner_king}
            // scale={0.15}
            scale={0}
            src={simpleratkingleft}
            x={200}
        />
        <Img ref={chaser_cat}
            scale={0.1}
            src={simplecatright}
            x={-1200}
        />
        <Dirt ref={middle_dirt}
            scale={0.0}
            size={100}
        />
    </Node>);
    yield* runner_king().scale(0.1, 0.5, easeOutBack);
    yield* chain(all(chaser_cat().x(chaser_cat().x() + 180, 0.2)), waitFor(0.3));
    yield* chain(all(chaser_cat().x(chaser_cat().x() + 180, 0.2)), waitFor(0.3));
    yield* chain(all(chaser_cat().x(chaser_cat().x() + 180, 0.2)), waitFor(0.3));
    chaser_cat().save();
    runner_king().save();
    yield* waitFor(2.5);
    yield* chain(all(chaser_cat().x(chaser_cat().x() + 180, 0.2)), waitFor(0.3));
    yield* chain(all(chaser_cat().x(chaser_cat().x() + 180, 0.2), runner_king().x(runner_king().x() + 180, 0.2)), waitFor(0.3));
    yield* chain(all(chaser_cat().x(chaser_cat().x() + 180, 0.2)), waitFor(0.3));
    yield* chain(all(chaser_cat().x(chaser_cat().x() + 180, 0.2), runner_king().x(runner_king().x() + 180, 0.2)), waitFor(0.3));
    yield* chain(all(chaser_cat().x(chaser_cat().x() + 180, 0.2)), waitFor(0.3));
    yield* chain(all(chaser_cat().x(chaser_cat().x() + 180, 0.2), runner_king().x(runner_king().x() + 180, 0.2)), waitFor(0.3));
    yield* chain(all(
        chaser_cat().x(chaser_cat().x() + 180, 0.2),
        runner_king().rotation(90, 0.2),
        runner_king().opacity(0, 0.2),
    ), waitFor(0.1), chaser_cat().src(simplecatnomright, 0), waitFor(0.1));

    yield* waitUntil("undodeath");
    chaser_cat().src(simplecatright);
    yield* all(chaser_cat().restore(0.6), runner_king().restore(0.6));
    yield* waitFor(2.5);
    yield* chain(all(chaser_cat().x(chaser_cat().x() + 180, 0.2)), waitFor(0.3));
    yield* chain(all(chaser_cat().x(chaser_cat().x() + 180, 0.2), runner_king().x(runner_king().x() + 180, 0.2), middle_dirt().scale(1, 0.2)), waitFor(0.3));


    yield* waitUntil("rememberthatshit");
    yield* all(
        chaser_cat().x(chaser_cat().x() - 1000, 1.2),
        runner_king().x(runner_king().x() + 1000, 1.2),
        middle_dirt().rotation(60, 0.4, easeOutSine).back(0.4, easeInSine),
        middle_dirt().scale(4, 0.8),
    );

    
    
    const map = createRef<BattlecodeMap>();
    const static_map = range(11 * 11).map(t => TileType.Empty);
    const dirts = createRefArray<Rect>();
    const extra_dirts = createRefArray<Rect>();
    const rats = createRefArray<BattlecodeBot>();
    view.add(<BattlecodeMap
        ref={map}
        x={0} y={-1200} faded_bounds={false}
        map_bounds={[8, 8]}
        tile_size={90} tile_gap={8}
        radius={3}  show_pct={1}
        base_colors={static_map.map(t => TileTypeInfo[t].color)}
    ></BattlecodeMap>);
    const dirt_locs: [number, number][] = [
        [1, 3],
        [2, 4],
        [3, 5],
        [4, 6],
        [5, 7],
        [4, 3],
        [5, 4],
        [6, 5],
        [7, 6],
        [1, 0],
        [1, 1],
        [1, 2],
        [3, 0],
        [3, 1],
        [3, 2],
    ]
    dirt_locs.forEach(t => {
        const [x, y] = t;
        map().add_item(x, y, <Dirt ref={dirts} scale={0} />);
    })
    const extra_dirt_locs: [number, number][] = [
        [4, 4],
        [3, 4],
        [2, 2],
    ]
    extra_dirt_locs.forEach(t => {
        const [x, y] = t;
        map().add_item(x, y, <Dirt ref={extra_dirts} scale={0} />);
    })

    map().add(<>
        <CheddarBabyRat ref={rats} map={map()}
            pos={new Vector2(-1, 6)} dir={Origin.Right}
        />
        <CheddarBabyRat ref={rats} map={map()}
            pos={new Vector2(2, 8)} dir={Origin.TopRight}
        />
        <PlumBabyRat ref={rats} map={map()}
            pos={new Vector2(8, 1)} dir={Origin.Left}
        />
    </>);

    yield map().run_ticks(TURN_MOVE_TIME, TURN_WAIT_TIME);
    yield* all(sequence(0.1, middle_dirt().scale(1, 0.8), middle_dirt().y(1000, 0.8)), map().y(0, 0.8));
    yield* sequence(0.05, ...dirts.map(t => t.scale(1, 0.4, easeOutBack)));

    yield* map().wait_for_next_tick();
    yield* chain(all(...rats.map(t => t.move_forward(TURN_MOVE_TIME))), map().wait_for_next_tick());
    yield* chain(all(
        rats[0].move_forward(TURN_MOVE_TIME),
        rats[2].move_forward(TURN_MOVE_TIME),
        rats[1].do_action(Origin.TopRight),
        dirts[3].scale(0, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    yield* chain(all(
        rats[0].move_forward(TURN_MOVE_TIME),
        rats[2].move_forward(TURN_MOVE_TIME),
        rats[1].move_forward(TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    yield* chain(all(
        rats[0].do_action(Origin.TopRight),
        dirts[2].scale(0, TURN_MOVE_TIME),
        rats[2].move_forward(TURN_MOVE_TIME),
        rats[1].look_and_move(Origin.Top, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    yield* chain(all(
        rats[0].move_forward(TURN_MOVE_TIME),
        rats[2].do_action(Origin.Left),
        dirts[13].scale(0, TURN_MOVE_TIME),
        rats[1].do_action(Origin.Top),
        extra_dirts[0].scale(1, TURN_MOVE_TIME, easeOutBack),
    ), map().wait_for_next_tick());
    yield* chain(all(
        rats[2].move_forward(TURN_MOVE_TIME),
        rats[0].do_action(Origin.Top),
        extra_dirts[1].scale(1, TURN_MOVE_TIME, easeOutBack),
    ), map().wait_for_next_tick());
    yield* chain(all(
        rats[2].do_action(Origin.BottomLeft),
        extra_dirts[2].scale(1, TURN_MOVE_TIME, easeOutBack),
    ), map().wait_for_next_tick());

    yield* waitUntil("removeall");
    yield* map().y(-1000, 1.2);
    yield* waitUntil("end");
});