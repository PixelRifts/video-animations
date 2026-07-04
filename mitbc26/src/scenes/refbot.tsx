import { Img, Line, Node, Rect, Txt, Video, makeScene2D } from "@motion-canvas/2d";
import { Origin, Vector2, all, chain, createRef, createRefArray, createSignal, easeInBack, easeInCirc, easeOutBack, easeOutCirc, linear, loop, range, run, sequence, useRandom, waitFor, waitUntil } from "@motion-canvas/core";
import { CheddarBabyRat, CheddarRatKing, Cheese, CheeseMine, Dirt, PlumBabyRat, PlumRatKing, TileType, TileTypeInfo, Wall } from "../battlecode/mit26/prefabs";
import { BattlecodeMap } from "../battlecode/map";
import { BattlecodeBot } from "../battlecode/bot";
import { RoboticTxt, palette, wiggle } from "../components/helpers";

import pathfinding_video from "../video/Pathfinding.mp4";
import { random_dir } from "../battlecode/helpers";

const TURN_TIME = 0.5
const TURN_MOVE_TIME = 0.2
const TURN_WAIT_TIME = TURN_TIME - TURN_MOVE_TIME

export default makeScene2D(function* (view) {
    const rand = useRandom(36);

    yield* waitUntil("cheese_mines");
    const time = createSignal(0);

    const map = createRef<BattlecodeMap>();
    const static_map = range(17 * 17).map(t => TileType.Empty);

    view.add(<BattlecodeMap
        ref={map}
        x={0} y={-1100} faded_bounds={false}
        map_bounds={[15, 15]}
        tile_size={60} tile_gap={4}
        radius={3} show_pct={1}
        base_colors={static_map.map(t => TileTypeInfo[t].color)}
    ></BattlecodeMap>);
    yield map().run_ticks(TURN_MOVE_TIME, TURN_WAIT_TIME);
    yield* map().y(0, 1.2);

    const cheese_mines = createRefArray<Img>();
    map().add_item(3, 3, <CheeseMine ref={cheese_mines} scale={0} />);
    map().add_item(6, 10, <CheeseMine ref={cheese_mines} scale={0} />);
    map().add_item(12, 5, <CheeseMine ref={cheese_mines} scale={0} />);
    yield* sequence(0.1, ...cheese_mines.map(t => t.scale(1, 0.5)));


    yield* waitUntil("cheese_spawn_loop");
    const cheeses = createRefArray<Img>();
    map().add_item(3, 5, <Cheese ref={cheeses} scale={0} />);
    map().add_item(12, 3, <Cheese ref={cheeses} scale={0} />);
    map().add_item(5, 3, <Cheese ref={cheeses} scale={0} />);
    map().add_item(3, 9, <Cheese ref={cheeses} scale={0} />);
    yield* sequence(1, ...cheeses.map(t => t.scale(1.2, 0.5)));

    yield* waitUntil("the_gathering");
    const king = createRef<BattlecodeBot>();
    map().add(<PlumRatKing
        ref={king} map={map()}
        opacity={0} scale={0}
        pos={new Vector2(13, 13)}
        dir={Origin.Left}
    />);
    yield* all(
        all(king().scale(0.85, 0.8, easeOutBack), king().opacity(1, 0.8)));

    const gatherers = createRefArray<BattlecodeBot>();
    const gatherer_locs: [number, number][] = [[11, 11], [11, 12], [12, 11]];
    map().add(<>
        {...gatherer_locs.map(l => <PlumBabyRat
            ref={gatherers}
            map={map()}
            pos={new Vector2(l)}
            dir={Origin.TopLeft}
            scale={0} opacity={0}
        />)}
    </>)

    yield* all(
        // Rat King
        chain(
            all(gatherers[0].scale(1.2, TURN_MOVE_TIME), gatherers[0].opacity(1, 0.2)), map().wait_for_next_tick(),
            all(gatherers[1].scale(1.2, TURN_MOVE_TIME), gatherers[1].opacity(1, 0.2)), map().wait_for_next_tick(),
            all(gatherers[2].scale(1.2, TURN_MOVE_TIME), gatherers[2].opacity(1, 0.2)), map().wait_for_next_tick(),
        ),
        // Gatherers [0]
        chain(
            map().wait_for_next_tick(), map().wait_for_next_tick(),
            loop(6, function*() { yield* chain(gatherers[0].look_and_move(Origin.TopLeft, TURN_MOVE_TIME), map().wait_for_next_tick()); }),
            loop(1, function*() { yield* chain(gatherers[0].look_and_move(Origin.Top,     TURN_MOVE_TIME), map().wait_for_next_tick()); }),
            all(gatherers[0].do_action(Origin.Top), cheeses[2].opacity(0, 0.5), cheeses[2].scale(0, 0.5, easeInBack)),
        ),
        // Gatherers [1]
        chain(
            map().wait_for_next_tick(), map().wait_for_next_tick(), map().wait_for_next_tick(),
            loop(3, function*() { yield* chain(gatherers[1].look_and_move(Origin.TopLeft, TURN_MOVE_TIME), map().wait_for_next_tick()); }),
            loop(4, function*() { yield* chain(gatherers[1].look_and_move(Origin.Left,    TURN_MOVE_TIME), map().wait_for_next_tick()); }),
            all(gatherers[1].do_action(Origin.Left), cheeses[3].opacity(0, 0.5), cheeses[3].scale(0, 0.5, easeInBack)),
        ),
        // Gatherers [2]
        chain(
            map().wait_for_next_tick(), map().wait_for_next_tick(), map().wait_for_next_tick(), map().wait_for_next_tick(),
            loop(1, function*() { yield* chain(gatherers[2].look_and_move(Origin.TopLeft, TURN_MOVE_TIME), map().wait_for_next_tick()); }),
            loop(6, function*() { yield* chain(gatherers[2].look_and_move(Origin.Top,     TURN_MOVE_TIME), map().wait_for_next_tick()); }),
            all(gatherers[2].do_action(Origin.TopRight), cheeses[1].opacity(0, 0.5), cheeses[1].scale(0, 0.5, easeInBack)),
        ),
    );

    yield* waitUntil("wrong_moment");
    const wrong_label = createRef<Txt>();
    view.add(<RoboticTxt ref={wrong_label}
        text={"WRONG"}
        fontSize={400} lineWidth={20}
        fill={"#700018"} stroke={"#BF021B"}
    />);
    
    yield* waitUntil("goaway");
    yield* all(wrong_label().y(1200, 1.2), map().y(1200, 1.2));

    yield* waitUntil("why_no_beeline");
    yield* map().y(0, 1.2);
    yield* sequence(0.1,
        ...gatherers.map(t => all(t.opacity(0, 0.8), t.scale(0, 0.8))),
        ...cheese_mines.slice(1).map(t => all(t.opacity(0, 0.8), t.scale(0, 0.8))),
    );
    const bee = createRef<BattlecodeBot>();
    const beeline = createRef<Line>();
    map().add(<>
        <PlumBabyRat
            ref={bee}
            map={map()}
            pos={king().pos.addX(-2)}
            dir={Origin.TopLeft}
            scale={0} opacity={0}
        />

        <Line
            ref={beeline}
            stroke={'#02bf4a'} lineWidth={2}
            points={() => [bee().position(), map().get_tile_anchor(4, 6)]}
            lineDash={[50, 20]} lineDashOffset={50} end={0} opacity={0}
            zIndex={-1}
            lineCap={'round'}
        />
    </>);
    yield* chain(map().wait_for_next_tick(), all(bee().scale(1.2, TURN_MOVE_TIME), bee().opacity(1, 0.2)), map().wait_for_next_tick());
    yield* waitFor(1);
    yield beeline().lineDashOffset(beeline().lineDashOffset() - 900, 10, linear)
    yield* all(beeline().end(1, 0.5), beeline().opacity(1, 0.1));
    yield* loop(3, function*() { yield* chain(bee().look_and_move(Origin.TopLeft, TURN_MOVE_TIME), map().wait_for_next_tick()); })
    yield* waitFor(0.8);
    yield* all(beeline().start(1, 0.2), beeline().opacity(0, 0.21));

    const dirt = createRefArray<Rect>();
    const walls = createRefArray<Rect>();
    map().add_item(4, 10, <Dirt ref={dirt}  scale={0} opacity={0} />);
    map().add_item(4, 11, <Dirt ref={dirt}  scale={0} opacity={0} />);
    map().add_item(4, 12, <Dirt ref={dirt}  scale={0} opacity={0} />);
    map().add_item(4,  9, <Dirt ref={dirt}  scale={0} opacity={0} />);
    map().add_item(5,  8, <Dirt ref={dirt}  scale={0} opacity={0} />);
    map().add_item(6,  7, <Dirt ref={dirt}  scale={0} opacity={0} />);
    map().add_item(7,  6, <Dirt ref={dirt}  scale={0} opacity={0} />);
    
    map().add_item(5,  9, <Wall ref={walls} scale={0} opacity={0} />);
    map().add_item(6,  8, <Wall ref={walls} scale={0} opacity={0} />);
    map().add_item(7,  7, <Wall ref={walls} scale={0} opacity={0} />);
    map().add_item(8,  6, <Wall ref={walls} scale={0} opacity={0} />);
    map().add_item(8,  5, <Wall ref={walls} scale={0} opacity={0} />);
    map().add_item(8,  4, <Wall ref={walls} scale={0} opacity={0} />);
    map().add_item(8,  3, <Wall ref={walls} scale={0} opacity={0} />);

    yield* sequence(0.05, ...walls.map(t => all(t.opacity(1, 0.1), t.scale(1, 0.5))));
    yield* waitFor(0.5);
    yield* sequence(0.05, ...dirt.map(t => all(t.opacity(1, 0.1), t.scale(1, 0.5))));

    yield* waitUntil("removing_dirt");
    yield* sequence(0.1,
        ...dirt.map(t => all(
            wiggle(t.rotation, -15, 15, 0.8),
            t.scale(1.2, 0.4, easeOutCirc).back(0.4, easeInCirc),
        ))
    );

    yield* waitUntil("impassible");
    yield* sequence(0.1,
        ...walls.map(t => all(
            wiggle(t.rotation, -15, 15, 0.8),
            t.scale(1.2, 0.4, easeOutCirc).back(0.4, easeInCirc),
        ))
    );

    yield* waitUntil("dev_team");
    // add video
    const pfv = createRef<Video>();
    view.add(<>
        <Video
            ref={pfv}
            scale={1} y={1200}
            time={3}
            // stroke={'#02bf4a'} lineWidth={8}
            radius={20}
            src={pathfinding_video}
        />
    </>);
    pfv().play();

    yield* all(map().y(-1200, 1.2), pfv().y(0, 1.2));

    yield* waitUntil("pflecture");
    yield* pfv().y(-1200, 1.2);

    yield* waitFor(2.5);
    yield* all(map().y(0, 1.2), map().scale(1.2, 2.0));
    yield* waitUntil("dobug");
    
    bee().zIndex(3);
    beeline().lineWidth(6).lineDash([]);
    const update_line = function* (xoff: number, yoff: number) {
        const anchor = map().get_tile_anchor(bee().pos.x + xoff, bee().pos.y + yoff);
        beeline().points(() => [bee().position(), anchor]).start(0).end(1).opacity(1).zIndex(2);
    }
    
    yield* chain(
        map().wait_for_next_tick(),
        all(update_line(-4, -4), bee().look_and_move(Origin.TopLeft, TURN_MOVE_TIME),   ), map().wait_for_next_tick(),
        all(update_line( 0,  0), bee().do_action(Origin.TopLeft),                       ), waitUntil("wallfollow"),
        all(update_line(-1,  0), bee().look_and_move(Origin.Left, TURN_MOVE_TIME),      ), map().wait_for_next_tick(),
        all(update_line(-1,  1), bee().look_and_move(Origin.BottomLeft, TURN_MOVE_TIME),), map().wait_for_next_tick(),
        all(update_line( 0,  1), bee().look_and_move(Origin.Bottom, TURN_MOVE_TIME),    ), map().wait_for_next_tick(),
        all(update_line( 0,  1), bee().look_and_move(Origin.Bottom, TURN_MOVE_TIME),    ), map().wait_for_next_tick(),
        all(update_line(-1,  1), bee().look_and_move(Origin.BottomLeft, TURN_MOVE_TIME),), map().wait_for_next_tick(),
        all(update_line(-1, -1), bee().look_and_move(Origin.TopLeft, TURN_MOVE_TIME),   ), waitUntil("backtogreed"),
        map().wait_for_next_tick(), update_line(0, -6),
        bee().look_and_move(Origin.Top, TURN_MOVE_TIME), map().wait_for_next_tick(),
        bee().look_and_move(Origin.Top, TURN_MOVE_TIME), map().wait_for_next_tick(),
        bee().look_and_move(Origin.Top, TURN_MOVE_TIME), map().wait_for_next_tick(),
        bee().look_and_move(Origin.Top, TURN_MOVE_TIME), map().wait_for_next_tick(),
        bee().look_and_move(Origin.Top, TURN_MOVE_TIME), map().wait_for_next_tick(),
        bee().look_and_move(Origin.Top, TURN_MOVE_TIME), map().wait_for_next_tick(),
    );

    yield* waitUntil("kindofworks");
    yield* all(map().scale(1, 0.8), map().y(-1200, 1.2));

    yield* waitUntil("strategy");
    yield* all(map().scale(1.1, 1.8), map().y(0, 1.2), sequence(0.0,
        ...map().children().slice(1).map(t => all(t.scale(0, 0, easeInBack), t.opacity(0, 0))),
        ...map().children()[0].children().map(t => all(t.scale(0, 0, easeInBack), t.opacity(0, 0))),
    ));

    const strat_elems = createRef<Node>();
    const strat_king = createRef<BattlecodeBot>();
    const strat_gatherers = createRefArray<BattlecodeBot>();
    const strat_cheese = createRefArray<Img>();
    map().add(<Node ref={strat_elems}>
        <CheddarRatKing
            ref={strat_king} map={map()}
            opacity={0} scale={0}
            pos={new Vector2(7, 7)}
            dir={Origin.Left}
        />
        <CheddarBabyRat
            ref={strat_gatherers} map={map()}
            pos={strat_king().pos.addX(-2)}
            dir={Origin.TopLeft}
            scale={0} opacity={0}
        />
        <CheddarBabyRat
            ref={strat_gatherers} map={map()}
            pos={strat_king().pos.addX(2)}
            dir={Origin.Bottom}
            scale={0} opacity={0}
        />
        <CheddarBabyRat
            ref={strat_gatherers} map={map()}
            pos={strat_king().pos.addY(2)}
            dir={Origin.BottomRight}
            scale={0} opacity={0}
        />
        <CheddarBabyRat
            ref={strat_gatherers} map={map()}
            pos={strat_king().pos.addY(-2)}
            dir={Origin.TopLeft}
            scale={0} opacity={0}
        />
    </Node>);
    
    yield* all(strat_king().scale(0.85, 0.8, easeOutBack), strat_king().opacity(1, 0.3));
    yield* map().wait_for_next_tick();
    yield* chain(
        all(strat_gatherers[0].scale(1.2, 0.8, easeOutBack), strat_gatherers[0].opacity(1, 0.3)), map().wait_for_next_tick(),
        all(
            // strat_gatherers[0].move_forward(TURN_MOVE_TIME),
            strat_gatherers[1].scale(1.2, 0.8, easeOutBack), strat_gatherers[1].opacity(1, 0.3)
        ), map().wait_for_next_tick(),
        all(
            // strat_gatherers[0].move_forward(TURN_MOVE_TIME),
            // strat_gatherers[1].move_forward(TURN_MOVE_TIME),
            strat_gatherers[2].scale(1.2, 0.8, easeOutBack), strat_gatherers[2].opacity(1, 0.3)
        ), map().wait_for_next_tick(),
        all(
            // strat_gatherers[0].move_forward(TURN_MOVE_TIME),
            // strat_gatherers[1].move_forward(TURN_MOVE_TIME),
            // strat_gatherers[2].move_forward(TURN_MOVE_TIME),
            strat_gatherers[3].scale(1.2, 0.8, easeOutBack), strat_gatherers[3].opacity(1, 0.3)
        ), map().wait_for_next_tick(),
    );

    const the_dirs = [ Origin.Left, Origin.Top, Origin.Right, Origin.TopRight ];
    strat_gatherers.forEach((t, i) => t.look_in_dir(the_dirs[i]));
    yield* map().wait_for_next_tick();
    yield* chain(all(...strat_gatherers.map(t => t.move_forward(TURN_MOVE_TIME))), map().wait_for_next_tick());
    yield* chain(all(...strat_gatherers.map(t => t.move_forward(TURN_MOVE_TIME))), map().wait_for_next_tick());
    yield* chain(all(...strat_gatherers.map(t => t.move_forward(TURN_MOVE_TIME))), map().wait_for_next_tick());
    yield* chain(all(...strat_gatherers.map(t => t.move_forward(TURN_MOVE_TIME))), map().wait_for_next_tick());
    yield* chain(all(...strat_gatherers.map(t => t.move_forward(TURN_MOVE_TIME))), map().wait_for_next_tick());
    yield* waitFor(2);
    strat_gatherers[3].look_in_dir(Origin.BottomRight);
    strat_gatherers[0].look_in_dir(Origin.BottomRight);
    yield* waitFor(1);
    yield* map().wait_for_next_tick();
    yield* chain(all(...strat_gatherers.map(t => t.move_forward(TURN_MOVE_TIME))), map().wait_for_next_tick());
    yield* chain(all(...strat_gatherers.map(t => t.move_forward(TURN_MOVE_TIME))), map().wait_for_next_tick());
    strat_gatherers[1].look_in_dir(Origin.BottomLeft);
    strat_gatherers[2].look_in_dir(Origin.Bottom);
    strat_gatherers[3].look_in_dir(Origin.Left);
    map().save();
    yield all(map().scale(2, 1.2), map().position([400, 200], 1.2));
    yield* chain(all(...strat_gatherers.map(t => t.move_forward(TURN_MOVE_TIME))), map().wait_for_next_tick());
    map().add_item(2, 5, <Cheese ref={strat_cheese} scale={0} zIndex={1}/>);
    yield* strat_cheese().scale(1, 0.8, easeOutBack);
    yield* chain(all(...strat_gatherers.map(t => t.move_forward(TURN_MOVE_TIME))), map().wait_for_next_tick());
    yield* chain(all(...strat_gatherers.map(t => t.move_forward(TURN_MOVE_TIME))), map().wait_for_next_tick());

    yield* waitUntil("bugme");
    const bugline = createRef<Line>();
    map().add(<>
        <Line
            ref={bugline}
            lineWidth={5} stroke={'#00AA88'} lineCap={"round"}
            points={[map().get_tile_anchor(2,5), map().get_tile_anchor(3,5), map().get_tile_anchor(4,5), map().get_tile_anchor(5,4), map().get_tile_anchor(6,3),]}
            zIndex={-2} start={1}
        />
    </>);
    yield* loop(4, function*(i) { yield* bugline().start(0.75 - i * 0.25, 0.4); })
    yield* chain(all(...strat_gatherers.map(t => t.move_forward(TURN_MOVE_TIME)), bugline().end(0.70, TURN_MOVE_TIME)), map().wait_for_next_tick());
    yield* chain(all(...strat_gatherers.map(t => t.move_forward(TURN_MOVE_TIME)), bugline().end(0.40, TURN_MOVE_TIME)), map().wait_for_next_tick());
    strat_gatherers[2].look_in_dir(Origin.Top);
    strat_gatherers[0].look_in_dir(Origin.TopRight);
    strat_gatherers[1].look_in_dir(Origin.Left);
    yield* chain(all(...strat_gatherers.map(t => t.move_forward(TURN_MOVE_TIME)), bugline().end(0.15, TURN_MOVE_TIME)), map().wait_for_next_tick());
    yield* chain(all(strat_gatherers[1].do_action(Origin.Left), bugline().end(0, TURN_MOVE_TIME), bugline().opacity(0, 0.4),
        strat_cheese().x(() => strat_gatherers[1].x(), 0.8),
        strat_cheese().y(() => strat_gatherers[1].y(), 0.8),
        strat_cheese().scale(0.5, 0.5)
    ), map().wait_for_next_tick());

    yield* waitUntil('returnofkings')
    bugline().points([
        map().get_tile_anchor(3,5), map().get_tile_anchor(4,5), map().get_tile_anchor(5,6), map().get_tile_anchor(6,7),
    ]).start(0).end(0).opacity(1);
    yield* loop(3, function*(i) { yield* bugline().start(0.33 + i * 0.33, 0.4); });
    strat_gatherers[1].look_in_dir(Origin.Right);
    yield* chain(all(...strat_gatherers.map(t => t.move_forward(TURN_MOVE_TIME)), bugline().end(0.30, TURN_MOVE_TIME)), map().wait_for_next_tick());
    strat_gatherers[1].look_in_dir(Origin.BottomRight);
    yield* chain(all(...strat_gatherers.map(t => t.move_forward(TURN_MOVE_TIME)), bugline().end(0.65, TURN_MOVE_TIME)), map().wait_for_next_tick());

    yield* chain(all(strat_gatherers[1].do_action(Origin.BottomRight), bugline().end(1, TURN_MOVE_TIME), bugline().opacity(0, 0.4),
        strat_cheese().x(() => strat_king().x(), 0.8),
        strat_cheese().y(() => strat_king().y(), 0.8),
        strat_cheese().scale(1.5, 0.5),
        strat_cheese().opacity(0, 1.5)
    ), map().wait_for_next_tick());
    yield* waitFor(1);
    yield* map().wait_for_next_tick();
    strat_gatherers[1].look_in_dir(Origin.BottomLeft);
    yield map().restore(0.8);
    yield* chain(all(...strat_gatherers.map(t => t.move_forward(TURN_MOVE_TIME)), bugline().end(0.65, TURN_MOVE_TIME)), map().wait_for_next_tick());
    yield* chain(all(...strat_gatherers.map(t => t.move_forward(TURN_MOVE_TIME)), bugline().end(0.65, TURN_MOVE_TIME)), map().wait_for_next_tick());
    yield* chain(all(...strat_gatherers.map(t => t.move_forward(TURN_MOVE_TIME)), bugline().end(0.65, TURN_MOVE_TIME)), map().wait_for_next_tick());
    strat_gatherers[0].look_in_dir(Origin.Left);
    yield map().y(-1200, 1.2);
    yield* chain(all(...strat_gatherers.map(t => t.move_forward(TURN_MOVE_TIME)), bugline().end(0.65, TURN_MOVE_TIME)), map().wait_for_next_tick());
    yield* chain(all(...strat_gatherers.map(t => t.move_forward(TURN_MOVE_TIME)), bugline().end(0.65, TURN_MOVE_TIME)), map().wait_for_next_tick());
    strat_gatherers[1].look_in_dir(Origin.Right);
    yield* chain(all(...strat_gatherers.map(t => t.move_forward(TURN_MOVE_TIME)), bugline().end(0.65, TURN_MOVE_TIME)), map().wait_for_next_tick());

    

    yield* waitUntil("end");
});