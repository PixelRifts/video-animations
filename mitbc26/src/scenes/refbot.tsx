import { Img, Rect, makeScene2D } from "@motion-canvas/2d";
import { all, createRef, createRefArray, createSignal, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { Cheese, CheeseMine, TileType, TileTypeInfo } from "../battlecode/mit26/prefabs";
import { BattlecodeMap } from "../battlecode/map";


export default makeScene2D(function* (view) {

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
    yield* map().y(0, 1.2);

    const cheese_mines = createRefArray<Img>();
    map().add_item( 3, 3,  <CheeseMine ref={cheese_mines} scale={0}/>);
    map().add_item( 6, 10, <CheeseMine ref={cheese_mines} scale={0}/>);
    map().add_item(12, 5,  <CheeseMine ref={cheese_mines} scale={0}/>);
    yield* sequence(0.1, ...cheese_mines.map(t => t.scale(1, 0.5)));

    const cheeses = createRefArray<Img>();
    map().add_item( 2, 1, <Cheese ref={cheeses} scale={0}/>);
    map().add_item(12, 4, <Cheese ref={cheeses} scale={0}/>);
    yield* waitUntil("end");
});