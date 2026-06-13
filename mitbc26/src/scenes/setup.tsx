import { makeScene2D } from "@motion-canvas/2d";
import { Origin, Vector2, all, chain, createRef, createRefArray, easeInBack, loop, loopFor, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { BattlecodeBot } from "../battlecode/bot";
import { BattlecodeMap } from "../battlecode/map";
import { TileType, TileTypeInfo, PlumBabyRat, CheddarRatKing, PlumRatKing, Cat } from "../battlecode/mit26/prefabs";

const TURN_TIME = 0.5
const TURN_MOVE_TIME = 0.2
const TURN_WAIT_TIME = TURN_TIME - TURN_MOVE_TIME

export default makeScene2D(function* (view) {
    const map = createRef<BattlecodeMap>();
    const static_map = range(17*17).map(t => TileType.Empty);
    
    view.add(<BattlecodeMap
      ref={map}
      x={0} y={0}
      map_bounds={[15,15]}
      tile_size={60} tile_gap={4}
      radius={3}
      base_colors={static_map.map(t => TileTypeInfo[t].color)}
    ></BattlecodeMap>);

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
    const cat_move_loop = yield loop(3, function*() {
        for (let i = 0; i < 5; i++) {
            yield* all(
                cats[0].look_and_move(Origin.Bottom, TURN_MOVE_TIME),
                cats[1].look_and_move(Origin.Top, TURN_MOVE_TIME)
            );
            yield* waitFor(TURN_WAIT_TIME);
        }
        for (let i = 0; i < 5; i++) {
            yield* all(
                cats[0].look_and_move(Origin.TopRight, TURN_MOVE_TIME),
                cats[1].look_and_move(Origin.BottomLeft, TURN_MOVE_TIME),
            );
            yield* waitFor(TURN_WAIT_TIME);
        }
        for (let i = 0; i < 5; i++) {
            yield* all(
                cats[0].look_and_move(Origin.Left, TURN_MOVE_TIME),
                cats[1].look_and_move(Origin.Right, TURN_MOVE_TIME),
            );
            yield* waitFor(TURN_WAIT_TIME);
        }
    })
    yield* waitUntil("end");
});