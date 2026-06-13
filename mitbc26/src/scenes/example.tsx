import { Circle, Node, Rect, makeScene2D } from '@motion-canvas/2d';
import { Origin, Vector2, chain, createRef, createRefArray, range, sequence, waitFor, waitUntil } from '@motion-canvas/core';
import { BattlecodeMap } from '../battlecode/map';
import { BattlecodeBot } from '../battlecode/bot';
import { CheddarBabyRat, PlumBabyRat, TileType, TileTypeInfo } from '../battlecode/mit26/prefabs';

const TURN_TIME = 0.8
const TURN_MOVE_TIME = 0.3
const TURN_WAIT_TIME = TURN_TIME - TURN_MOVE_TIME

export default makeScene2D(function* (view) {
  const map = createRef<BattlecodeMap>();
  
  const static_map = [
    TileType.Wall , TileType.Wall , TileType.Wall , TileType.Wall , TileType.Wall , TileType.Wall , TileType.Wall ,
    TileType.Wall , TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty,
    TileType.Wall , TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty,
    TileType.Wall , TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty,
    TileType.Wall , TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty,
    TileType.Wall , TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty,
    TileType.Wall , TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty,
  ];

  view.add(<BattlecodeMap
    ref={map}
    x={0} y={0}
    map_bounds={[5,5]}
    radius={3}
    base_colors={static_map.map(t => TileTypeInfo[t].color)}
  >
  </BattlecodeMap>);

  const rats = createRefArray<BattlecodeBot>();
  map().add(
    <>{
      ...range(5).map(i => <PlumBabyRat
        ref={rats}
        map={map()}
        pos={new Vector2(6, i)}
        dir={Origin.Left}
        opacity={0}
      />)
    }</>
  );

  yield* map().fade_in();
  
  yield* sequence(TURN_TIME,
    ...rats.map(t => chain(
      ...range(6).map(i => chain(t.look_and_move(Origin.Left, TURN_MOVE_TIME), waitFor(TURN_WAIT_TIME))),
      waitFor(TURN_TIME),
      ...range(6).map(i => chain(t.look_and_move(Origin.Right, TURN_MOVE_TIME), waitFor(TURN_WAIT_TIME))),
    ))
  )

  yield* waitUntil("size_change_test");
  yield* map().tile_size(80, 1.2);

  yield* waitFor(5);
});
