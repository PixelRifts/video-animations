import { Gradient, Img, Line, Node, Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import { Origin, Vector2, all, chain, createRef, createRefArray, easeOutBack, loop, map, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { BattlecodeMap } from "../../battlecode/map";
import { CheddarBabyRat, Cheese, Dirt, PlumBabyRat, PlumRatKing, TileType, TileTypeInfo, Wall } from "../../battlecode/mit26/prefabs";
import { BattlecodeBot } from "../../battlecode/bot";
import { add_dir, directions } from "../../battlecode/helpers";
import { RoboticTxt, palette } from "../../components/helpers";

const TURN_TIME = 0.5
const TURN_MOVE_TIME = 0.2
const TURN_WAIT_TIME = TURN_TIME - TURN_MOVE_TIME

export default makeScene2D(function* (view) {
    const map1 = createRef<BattlecodeMap>();
    const map2 = createRef<BattlecodeMap>();
    const static_map = range(5 * 5).map(t => TileType.Empty);
    
    view.add(<>
        <BattlecodeMap
            ref={map1}
            x={-400} y={-1000} faded_bounds={false}
            map_bounds={[5, 5]}
            tile_size={120} tile_gap={12}
            radius={3} show_pct={1}
            base_colors={static_map.map(t => TileTypeInfo[t].color)}
        ></BattlecodeMap>
        <BattlecodeMap
            ref={map2}
            x={400} y={-1000} faded_bounds={false}
            map_bounds={[5, 5]}
            tile_size={120} tile_gap={12}
            radius={3} show_pct={1}
            base_colors={static_map.map(t => TileTypeInfo[t].color)}
        ></BattlecodeMap>
    </>);
    
    const dirt1s = createRefArray<Rect>();
    const goal1 = createRef<Img>();
    const rat1 = createRef<BattlecodeBot>();
    const ratpath1 = createRef<Line>();
    const dirt1_locs: [number,number][] = [
        [0,1],[1,1],[2,1],[3,1],
        [1,3],[2,3],[3,3],[4,3],
    ];
    dirt1_locs.forEach(v => {
        const [x, y] = v;
        map1().add_item(x, y, <Dirt ref={dirt1s} />);
    })
    map1().add_item(2, 0, <Cheese ref={goal1} />);
    map1().add(<CheddarBabyRat ref={rat1} map={map1()}
        pos={new Vector2(2, 5)} dir={Origin.Top}
    />);
    map1().add(
        <Line
            ref={ratpath1}
            lineWidth={5} stroke={'#66dbff'} lineCap={"round"}
            points={[map1().get_tile_anchor(2,4), map1().get_tile_anchor(1,4), map1().get_tile_anchor(0,3), map1().get_tile_anchor(1,2), map1().get_tile_anchor(2,2), map1().get_tile_anchor(3,2), map1().get_tile_anchor(4,1), map1().get_tile_anchor(3,0), map1().get_tile_anchor(2,0),]}
            zIndex={-2} end={0} opacity={0}
        />
    );

    
    const rat2 = createRef<BattlecodeBot>();
    const rat3 = createRef<BattlecodeBot>();
    const ratpath2 = createRef<Line>();
    const ratpath3 = createRef<Line>();
    map2().add(<>
        <PlumBabyRat ref={rat2} map={map2()}
            pos={new Vector2(2, -1)} dir={Origin.Bottom}
        />
        <PlumBabyRat ref={rat3} map={map2()}
            pos={new Vector2(2, 5)} dir={Origin.Top}
        />
        <Line
            ref={ratpath2}
            lineWidth={5} stroke={'#00CC88'} lineCap={"round"}
            points={[map2().get_tile_anchor(2, 0), map2().get_tile_anchor(2, 2), map2().get_tile_anchor(2, 4)]}
            zIndex={-2} end={0} opacity={0}
        />
        <Line
            ref={ratpath3}
            lineWidth={5} stroke={'#CC8800'} lineCap={"round"}
            points={[map2().get_tile_anchor(2, 4), map2().get_tile_anchor(2, 2)]}
            zIndex={-2} end={0} opacity={0}
        />
    </>);

    const animatebug = function* () {
        yield* chain(all(rat1().move_forward(TURN_MOVE_TIME)), map1().wait_for_next_tick());
        const moves = [ Origin.Middle, Origin.Left, Origin.TopLeft, Origin.TopRight, Origin.Middle, Origin.Right, Origin.Right, Origin.TopRight, Origin.Middle, Origin.TopLeft, Origin.Left ];
        yield rat1().execute_moves(TURN_MOVE_TIME, ...moves);
        yield* chain(all(ratpath1().opacity(1, 0.1), ratpath1().end(0.395, TURN_MOVE_TIME)), map1().wait_for_next_tick());
        yield* chain(all(ratpath1().start(0.11, TURN_MOVE_TIME)), map1().wait_for_next_tick());
        yield* chain(all(ratpath1().start(0.25, TURN_MOVE_TIME)), map1().wait_for_next_tick());
        yield* chain(all(ratpath1().start(0.395, TURN_MOVE_TIME)), map1().wait_for_next_tick());
        yield* chain(all(ratpath1().end(0.75, TURN_MOVE_TIME)), map1().wait_for_next_tick());
        yield* chain(all(ratpath1().start(0.5, TURN_MOVE_TIME)), map1().wait_for_next_tick());
        yield* chain(all(ratpath1().start(0.605, TURN_MOVE_TIME)), map1().wait_for_next_tick());
        yield* chain(all(ratpath1().start(0.75, TURN_MOVE_TIME)), map1().wait_for_next_tick());
        yield* chain(all(ratpath1().end(1.0, TURN_MOVE_TIME)), map1().wait_for_next_tick());
        yield* chain(all(ratpath1().start(0.9, TURN_MOVE_TIME)), map1().wait_for_next_tick());
        yield* chain(all(goal1().opacity(0.5, 0.5), ratpath1().start(1, TURN_MOVE_TIME)), map1().wait_for_next_tick());
    }

    const animatetwirling = function* () {
        yield* chain(all(rat2().move_forward(TURN_MOVE_TIME), rat3().move_forward(TURN_MOVE_TIME)), map2().wait_for_next_tick());
        yield* chain(all(
            ratpath2().opacity(1, 0.05), ratpath3().opacity(1, 0.05),
            ratpath2().end(0.5, TURN_MOVE_TIME), ratpath3().end(1, TURN_MOVE_TIME),
        ), map2().wait_for_next_tick());
        yield* chain(all(
            rat2().move_forward(TURN_MOVE_TIME), rat3().move_forward(TURN_MOVE_TIME),
            ratpath2().start(0.25, TURN_MOVE_TIME), ratpath3().start(0.5, TURN_MOVE_TIME),
        ), map2().wait_for_next_tick());
        ratpath3().start(0).end(1)//.opacity(0);
        ratpath3().points([map2().get_tile_anchor(2, 3), map2().get_tile_anchor(3, 2), map2().get_tile_anchor(2, 1), map2().get_tile_anchor(1, 2), map2().get_tile_anchor(2, 3)]);
        yield* chain(all(
            rat2().move_forward(TURN_MOVE_TIME), rat3().look_and_move(Origin.TopRight, TURN_MOVE_TIME),
            ratpath2().start(0.5, TURN_MOVE_TIME),
        ), map2().wait_for_next_tick());
        ratpath2().start(0.5);
        yield* chain(all(
            ratpath2().start(0.75, TURN_MOVE_TIME), ratpath2().end(1, TURN_MOVE_TIME),
            rat2().move_forward(TURN_MOVE_TIME), rat3().look_and_move(Origin.TopLeft, TURN_MOVE_TIME),
        ), map2().wait_for_next_tick());
        yield* chain(all(
            ratpath2().start(1, TURN_MOVE_TIME),
            rat2().move_forward(TURN_MOVE_TIME), rat3().look_and_move(Origin.BottomLeft, TURN_MOVE_TIME),
        ), map2().wait_for_next_tick());
        yield* chain(all(
            ratpath2().opacity(0, 0.01),
            rat2().move_forward(TURN_MOVE_TIME), rat3().look_and_move(Origin.BottomRight, TURN_MOVE_TIME),
        ), map2().wait_for_next_tick());
        yield* rat3().execute_moves(TURN_MOVE_TIME, Origin.TopRight, Origin.TopLeft, Origin.BottomLeft, Origin.BottomRight, Origin.TopRight, Origin.TopLeft, Origin.BottomLeft, Origin.BottomRight);
    }
    
    yield* waitUntil("bugisbad");
    yield all(map1().run_ticks(TURN_MOVE_TIME, TURN_WAIT_TIME), map2().run_ticks(TURN_MOVE_TIME, TURN_WAIT_TIME));
    yield* sequence(0.4, map1().y(0, 1.2), map2().y(0, 1.2))
    
    yield* map1().wait_for_next_tick();
    yield animatebug();
    
    yield* waitUntil("starttwirl");
    yield* map1().wait_for_next_tick();
    yield animatetwirling();

    yield* waitUntil("heuristicmode");
    yield* all(map1().x(-1400, 1.2), map2().x(1400, 1.2));

    
    const map = createRef<BattlecodeMap>();
    const static_map_2 = range(11 * 11).map(t => TileType.Empty);

    view.add(<BattlecodeMap
        ref={map}
        x={0} y={0} faded_bounds={false}
        map_bounds={[10, 10]}
        tile_size={90} tile_gap={8}
        radius={3}
        base_colors={static_map_2.map(t => TileTypeInfo[t].color)}
    ></BattlecodeMap>);
    yield* map().fade_in(1.2);
    const dirt_locs = `0000000000\
1000000000\
11000000X0\
0100110000\
0110011000\
0000001111\
0000011001\
0000110001\
0000000001\
0000000001`;
    const dirts = createRefArray<Rect>();
    const cheesit = createRef<Img>();
    for (let i = 0; i < dirt_locs.length; i++) {
        if (dirt_locs.charAt(i) === '1') {
            map().add_item(i % 10, Math.floor(i / 10), <Wall ref={dirts} scale={0}/>);
        } else if (dirt_locs.charAt(i) === 'X') {
            map().add_item(i % 10, Math.floor(i / 10), <Cheese ref={cheesit} scale={0}/>);
        }
    }
    yield* sequence(0.005, ...dirts.map(t => t.scale(1, 0.5, easeOutBack)), cheesit().scale(1, 0.5, easeOutBack));
    const heurat1 = createRef<BattlecodeBot>();
    map().add(<>
        <CheddarBabyRat ref={heurat1} map={map()}
            pos={new Vector2(1, 8)} dir={Origin.TopRight}
            scale={0}
        />
    </>);
    yield* heurat1().scale(1, 0.5, easeOutBack);

    yield* waitUntil("zoominin");
    map().save();
    yield* all(map().scale(3.2, 1.2), map().position([1100, -1100], 1.2));

    const arrows_parent = createRef<Node>();
    const direction_arrows = createRefArray<Line>();
    const direction_scores = createRefArray<Txt>();
    const score_colors = [ "#f5da42", "#c2f542", "#69f542", "#c2f542", "#f5da42", "#f59342", "#f54242", "#f59342", ];
    const score_values = [ "-0.1", "2.2", "4.5", "2.3", "0.1", "-1.2", "-4", "-1.3", ];
    map().add(<Node ref={arrows_parent} zIndex={-1}>
        {...directions.map((o, i) => <>
            <Line ref={direction_arrows}
                points={[map().get_vector_tile_anchor(heurat1().pos), map().get_vector_tile_anchor(add_dir(heurat1().pos, o))]}
                lineWidth={4} endArrow arrowSize={20} start={0.09} end={0.09} opacity={0}
                stroke={"#7711CC"}
            />
            <RoboticTxt ref={direction_scores}
                text={score_values[i]} fill={score_colors[i]}
                position={map().get_vector_tile_anchor(add_dir(heurat1().pos, o))}
                fontSize={30} scale={0}
            />
        </>)}
    </Node>);
    yield* waitFor(1);
    yield* sequence(0.1, ...direction_arrows.map(t => all(t.opacity(1, 0.2), t.end(1, 0.5))));
    yield* waitFor(1);
    yield* sequence(0.1, ...direction_arrows.map((t, i) => t.stroke(score_colors[i], 0.5)));
    yield* sequence(0.1, ...direction_arrows.map((t, i) => sequence(0.2, t.start(1, 0.5), direction_scores[i].scale(1, 0.5, easeOutBack))));

    yield map().run_ticks(TURN_MOVE_TIME, TURN_WAIT_TIME);
    
    yield* map().wait_for_next_tick();
    yield* all(heurat1().move_forward(TURN_MOVE_TIME), sequence(0.05, ...direction_scores.map(t => t.scale(0, 0.4))))
    yield* map().restore(1.2);
    yield* map().wait_for_next_tick();
    
    const heuratflash1 = createRef<Rect>();
    map().add(<>
        <Rect ref={heuratflash1}
            fill={palette.GREENS[0]} opacity={0}
            size={() => map().tile_size()}
            zIndex={-1}
            position={map().get_vector_tile_anchor(add_dir(heurat1().pos, Origin.TopRight))}
        />
    </>);
    yield* chain(all(heuratflash1().opacity(1, TURN_MOVE_TIME).back(TURN_MOVE_TIME), heurat1().move_forward(TURN_MOVE_TIME)), map().wait_for_next_tick());

    const heurat2 = createRef<BattlecodeBot>();
    const heuratflash2 = createRef<Rect>();
    map().add(<>
        <CheddarBabyRat ref={heurat2} map={map()}
            pos={new Vector2(4, 10)} dir={Origin.TopRight}
            // scale={0}
        />
        <Rect ref={heuratflash2}
            fill={palette.GREENS[0]} opacity={0}
            size={() => map().tile_size()}
            zIndex={-1}
            position={map().get_vector_tile_anchor(add_dir(heurat2().pos, Origin.TopRight))}
        />
    </>)
    
    heuratflash1().position(map().get_vector_tile_anchor(add_dir(heurat1().pos, Origin.TopRight)));
    yield* chain(all(
        heuratflash1().opacity(1, TURN_MOVE_TIME).back(TURN_MOVE_TIME), heurat1().move_forward(TURN_MOVE_TIME),
        heuratflash2().opacity(1, TURN_MOVE_TIME).back(TURN_MOVE_TIME), heurat2().move_forward(TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    
    heuratflash1().position(map().get_vector_tile_anchor(add_dir(heurat1().pos, Origin.Right)));
    heuratflash2().position(map().get_vector_tile_anchor(add_dir(heurat2().pos, Origin.TopRight)));
    yield* chain(all(
        heuratflash1().opacity(1, TURN_MOVE_TIME).back(TURN_MOVE_TIME), heurat1().look_and_move(Origin.Right, TURN_MOVE_TIME),
        heuratflash2().opacity(1, TURN_MOVE_TIME).back(TURN_MOVE_TIME), heurat2().move_forward(TURN_MOVE_TIME),
    ), map().wait_for_next_tick());

    heuratflash1().position(map().get_vector_tile_anchor(add_dir(heurat1().pos, Origin.TopLeft)));
    heuratflash2().position(map().get_vector_tile_anchor(add_dir(heurat2().pos, Origin.TopRight)));
    yield* chain(all(
        heuratflash1().opacity(1, TURN_MOVE_TIME).back(TURN_MOVE_TIME), heurat1().look_and_move(Origin.TopLeft, TURN_MOVE_TIME),
        heuratflash2().opacity(1, TURN_MOVE_TIME).back(TURN_MOVE_TIME), heurat2().look_and_move(Origin.TopRight, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());

    heuratflash1().position(map().get_vector_tile_anchor(add_dir(heurat1().pos, Origin.TopLeft)));
    heuratflash2().position(map().get_vector_tile_anchor(add_dir(heurat2().pos, Origin.Top)));
    yield* chain(all(
        heuratflash1().opacity(1, TURN_MOVE_TIME).back(TURN_MOVE_TIME), heurat1().look_and_move(Origin.TopLeft, TURN_MOVE_TIME),
        heuratflash2().opacity(1, TURN_MOVE_TIME).back(TURN_MOVE_TIME), heurat2().look_and_move(Origin.Top, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    
    heuratflash1().position(map().get_vector_tile_anchor(add_dir(heurat1().pos, Origin.TopRight)));
    heuratflash2().position(map().get_vector_tile_anchor(add_dir(heurat2().pos, Origin.Right)));
    yield* chain(all(
        heuratflash1().opacity(1, TURN_MOVE_TIME).back(TURN_MOVE_TIME), heurat1().look_and_move(Origin.TopRight, TURN_MOVE_TIME),
        heuratflash2().opacity(1, TURN_MOVE_TIME).back(TURN_MOVE_TIME), heurat2().look_and_move(Origin.Right, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());

    
    heuratflash1().position(map().get_vector_tile_anchor(add_dir(heurat1().pos, Origin.Right)));
    heuratflash2().position(map().get_vector_tile_anchor(add_dir(heurat2().pos, Origin.Left)));
    yield* chain(all(
        heuratflash1().opacity(1, TURN_MOVE_TIME).back(TURN_MOVE_TIME), heurat1().look_and_move(Origin.Right, TURN_MOVE_TIME),
        heuratflash2().opacity(1, TURN_MOVE_TIME).back(TURN_MOVE_TIME), heurat2().look_and_move(Origin.Left, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());

    heuratflash1().position(map().get_vector_tile_anchor(add_dir(heurat1().pos, Origin.Right)));
    heuratflash2().position(map().get_vector_tile_anchor(add_dir(heurat2().pos, Origin.Right)));
    yield* chain(all(
        heuratflash1().opacity(1, TURN_MOVE_TIME).back(TURN_MOVE_TIME), heurat1().look_and_move(Origin.Right, TURN_MOVE_TIME),
        heuratflash2().opacity(1, TURN_MOVE_TIME).back(TURN_MOVE_TIME), heurat2().look_and_move(Origin.Right, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());

    heuratflash1().position(map().get_vector_tile_anchor(add_dir(heurat1().pos, Origin.Right)));
    heuratflash2().position(map().get_vector_tile_anchor(add_dir(heurat2().pos, Origin.Left)));
    yield* chain(all(
        heuratflash1().opacity(1, TURN_MOVE_TIME).back(TURN_MOVE_TIME), heurat1().look_and_move(Origin.Right, TURN_MOVE_TIME),
        heuratflash2().opacity(1, TURN_MOVE_TIME).back(TURN_MOVE_TIME), heurat2().look_and_move(Origin.Left, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());

    heuratflash1().position(map().get_vector_tile_anchor(add_dir(heurat1().pos, Origin.Right)));
    heuratflash2().position(map().get_vector_tile_anchor(add_dir(heurat2().pos, Origin.Right)));
    yield* chain(all(
        cheesit().opacity(0.5, TURN_MOVE_TIME),
        heuratflash1().opacity(1, TURN_MOVE_TIME).back(TURN_MOVE_TIME), heurat1().look_and_move(Origin.Right, TURN_MOVE_TIME),
        heuratflash2().opacity(1, TURN_MOVE_TIME).back(TURN_MOVE_TIME), heurat2().look_and_move(Origin.Right, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());

    heuratflash2().position(map().get_vector_tile_anchor(add_dir(heurat2().pos, Origin.Left)));
    yield* chain(all(
        heuratflash2().opacity(1, TURN_MOVE_TIME).back(TURN_MOVE_TIME), heurat2().look_and_move(Origin.Left, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());

    yield* waitUntil("dancing");
    const dancingmap = createRef<BattlecodeMap>();
    view.add(<BattlecodeMap
        ref={dancingmap}
        x={1400} y={0} faded_bounds={false}
        map_bounds={[8, 8]}
        tile_size={90} tile_gap={8}
        radius={3} show_pct={1}
        base_colors={static_map_2.map(t => TileTypeInfo[t].color)}
    ></BattlecodeMap>);
    const dancer1 = createRef<BattlecodeBot>();
    const dancer2 = createRef<BattlecodeBot>();
    const starver = createRef<BattlecodeBot>();
    yield dancingmap().run_ticks(TURN_MOVE_TIME, TURN_WAIT_TIME);
    dancingmap().add(<>
        <PlumBabyRat ref={dancer1} map={dancingmap()}
            pos={new Vector2(1, 6)} dir={Origin.BottomRight}
        />
        <PlumBabyRat ref={dancer2} map={dancingmap()}
            pos={new Vector2(3, 1)} dir={Origin.TopLeft}
        />
        <PlumRatKing ref={starver} map={dancingmap()}
            pos={new Vector2(6, 5)} dir={Origin.Left}
        />
    </>);
    dancingmap().add_item(0, 4, <Cheese />);
    dancingmap().add_item(6, 1, <Cheese />);
    yield* starver().show_healthbar(0);
    yield loop(Infinity, function* () {
        yield* all(
            dancer1().execute_moves(TURN_MOVE_TIME, Origin.TopRight, Origin.TopLeft, Origin.BottomLeft, Origin.BottomRight),
            dancer2().execute_moves(TURN_MOVE_TIME, Origin.BottomLeft, Origin.BottomRight, Origin.TopRight, Origin.TopLeft),
            loop(4, () => chain(starver().damage_and_sync(0.04, TURN_MOVE_TIME), dancingmap().wait_for_next_tick()),)
        );
    });

    yield* all(map().x(-1600, 1.2), dancingmap().x(0, 1.2));
    yield* waitUntil("thetries");
    yield* dancingmap().x(-1600, 1.2);
    
    
    
    yield* waitUntil("end");
});