import { Img, Line, Rect, Video, makeScene2D } from "@motion-canvas/2d";
import { Color, Origin, Vector2, all, chain, createRef, createRefArray, easeInBack, easeInCirc, easeOutBack, easeOutCirc, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { BattlecodeMap } from "../../battlecode/map";
import { CheddarBabyRat, Cheese, PlumBabyRat, TileType, TileTypeInfo, Wall } from "../../battlecode/mit26/prefabs";
import { add_dir, directions, dot_dir, dot_dir_vec } from "../../battlecode/helpers";
import { BattlecodeBot } from "../../battlecode/bot";

import tunapatterpng from "../../video/tunapatter.png";
import theirversionmp4 from "../../video/hybriddetail.mp4";

const TURN_TIME = 0.5
const TURN_MOVE_TIME = 0.2
const TURN_WAIT_TIME = TURN_TIME - TURN_MOVE_TIME

export default makeScene2D(function*(view) {
    yield* waitUntil("flowfieldpf");
    const map = createRef<BattlecodeMap>();
    const static_map = range(11 * 11).map(t => TileType.Empty);
    const arrowmap = [
        Origin.Right, Origin.BottomRight, Origin.BottomRight, Origin.BottomRight, Origin.BottomRight, Origin.BottomRight, Origin.Bottom,
        Origin.Bottom, Origin.Right, Origin.Right, Origin.Right, Origin.BottomRight, Origin.BottomRight, Origin.Bottom,
        Origin.BottomRight, Origin.Middle, Origin.Middle, Origin.Middle, Origin.Middle, Origin.BottomRight, Origin.Bottom,
        Origin.BottomRight, Origin.Bottom, Origin.Right, Origin.Right, Origin.Right, Origin.BottomRight, Origin.Bottom,
        Origin.BottomRight, Origin.BottomRight, Origin.Middle, Origin.Middle, Origin.Middle, Origin.Middle, Origin.Bottom,
        Origin.Right, Origin.Right, Origin.Right, Origin.Right, Origin.Right, Origin.Right, Origin.Middle,
        Origin.TopRight, Origin.TopRight, Origin.TopRight, Origin.TopRight, Origin.TopRight, Origin.TopRight, Origin.Top,
    ];
    const wallmap = [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 2,
        0, 0, 0, 0, 0, 0, 0,
    ];
    view.add(<>
        <BattlecodeMap
            ref={map}
            x={0} y={1200} faded_bounds={false}
            map_bounds={[7, 7]}
            tile_size={80} tile_gap={8}
            radius={3} show_pct={1}
            base_colors={static_map.map(t => TileTypeInfo[t].color)}
        ></BattlecodeMap>
    </>);

    const walls = createRefArray<Rect>();
    for (let i = 0; i < wallmap.length; i++) {
        if (wallmap[i] == 1) {
            map().add_item(i % 7, Math.floor(i / 7), <Wall ref={walls} scale={0}/>)
        }
    }
    const arrows = createRefArray<Line>();
    for (let i = 0; i < arrowmap.length; i++) {
        map().add_item(i%7, Math.floor(i/7), <Line ref={arrows}
            points={[[0,0], add_dir(new Vector2(0, 0), arrowmap[i]).normalized.scale(map().tile_size()/2.5)]}
            lineWidth={4} stroke={Color.lerp("#00FF00", "#FF0000", (add_dir(new Vector2(0, 0), arrowmap[i]).normalized.dot(new Vector2(i%7, Math.floor(i/7)).sub([6, 5]).normalized) + 1) / 2)}
            endArrow arrowSize={10} end={0}
        />);
    }
    const flowrat = createRef<BattlecodeBot>();
    map().add(<>
        <CheddarBabyRat ref={flowrat} map={map()}
            pos={new Vector2(1, 1)} dir={Origin.BottomRight}
            scale={0}
        />
    </>);
    const chees = createRef<Img>();
    map().add_item(6, 5, <Cheese ref={chees} scale={0}/>);


    yield map().run_ticks(TURN_MOVE_TIME, TURN_WAIT_TIME);
    yield* map().y(0, 1.2);
    yield* sequence(0.1,
        ...walls.map(t => t.scale(1, 0.5, easeOutBack)),
        chees().scale(1, 0.5, easeOutBack),
        flowrat().scale(1, 0.5, easeOutBack),
    );

    yield* waitUntil("extremearrows");
    yield* sequence(0.05, ...arrows.map(t => t.end(1, 0.4)));
    
    yield* waitUntil("bigredx");
    const bigredx = createRefArray<Line>();
    view.add(<>
        <Line ref={bigredx}
            points={[[-425, -425], [425, 425]]}
            lineWidth={20} stroke={"#CC1133"} lineCap={"round"}
            end={0} opacity={0}
        />
        <Line ref={bigredx}
            points={[[-425, 425], [425, -425]]}
            lineWidth={20} stroke={"#CC1133"} lineCap={"round"}
            end={0} opacity={0}
        />
    </>);

    yield* sequence(0.2, ...bigredx.map(t => all(
        t.opacity(1, 0.2),
        t.end(1, 0.8),
    )));

    yield* waitUntil("lost");
    yield* all(...bigredx.map(t => t.x(1400, 0.8)), map().x(1400, 0.8));

    yield* waitUntil("tunapatter");
    const tunapatterimg = createRef<Img>();
    view.add(<>
        <Img ref={tunapatterimg}
            src={tunapatterpng}
            scale={1.6}
            y={-1800}
        />
    </>);
    yield* tunapatterimg().y(0, 1.2).wait(3).to(1800, 1.2);

    yield* waitUntil('hybridpf');
    const hybridmap = createRef<BattlecodeMap>();
    view.add(<>
        <BattlecodeMap
            ref={hybridmap}
            x={0} y={-1200} faded_bounds={false}
            map_bounds={[7, 7]}
            tile_size={120} tile_gap={8}
            radius={3} show_pct={1}
            base_colors={static_map.map(t => TileTypeInfo[t].color)}
        ></BattlecodeMap>
    </>);
    yield* hybridmap().y(0, 1.2);
    const regularguy = createRef<BattlecodeBot>();
    const regularghost = createRef<BattlecodeBot>();
    const friendguy = createRef<BattlecodeBot>();
    const hybridwalls = createRefArray<Rect>();
    const hybridcheese = createRef<Img>();
    const hybridwallmap = [
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 1, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 0, 1, 0, 0,
    ];
    for (let i = 0; i < hybridwallmap.length; i++) {
        if (hybridwallmap[i] == 1) {
            hybridmap().add_item(i % 7, Math.floor(i / 7), <Wall ref={hybridwalls} scale={0}/>)
        }
    }
    hybridmap().add_item(4, 1, <Cheese ref={hybridcheese} scale={0} />);
    const bugline = createRef<Line>();
    const heuline = createRef<Line>();
    hybridmap().add(<>
        <PlumBabyRat ref={regularguy} map={hybridmap()}
            pos={new Vector2(3, 5)} dir={Origin.Left} scale={0}
        />
        <PlumBabyRat ref={friendguy} map={hybridmap()}
            pos={new Vector2(7, 3)} dir={Origin.Left}
        />
        <Line ref={bugline}
            lineWidth={5} stroke={'#00AA88'} lineCap={"round"}
            points={[hybridmap().get_tile_anchor(3,5), hybridmap().get_tile_anchor(2,5), hybridmap().get_tile_anchor(1,4), hybridmap().get_tile_anchor(2,3), hybridmap().get_tile_anchor(3,3),]}
            zIndex={-2} end={0}
        />
        <PlumBabyRat ref={regularghost} map={hybridmap()}
            pos={new Vector2(3, 5)} dir={Origin.Left} scale={0}
            base_opacity={0.5}
        />
        <Line ref={heuline}
            lineWidth={5} stroke={'#8800AA'} lineCap={"round"}
            points={[hybridmap().get_tile_anchor(3,5), hybridmap().get_tile_anchor(2,5), hybridmap().get_tile_anchor(1,4), hybridmap().get_tile_anchor(2,3), hybridmap().get_tile_anchor(1,3), hybridmap().get_tile_anchor(1,4), hybridmap().get_tile_anchor(2,3), hybridmap().get_tile_anchor(3,3),]}
            zIndex={-2} end={0}
        />
    </>);

    yield* sequence(0.05, ...hybridwalls.map(t => t.scale(1, 0.5, easeOutBack)), hybridcheese().scale(1, 0.5, easeOutBack));
    yield* all(regularguy().scale(1, 0.5), regularghost().scale(1, 0.5));
    
    yield hybridmap().run_ticks(TURN_MOVE_TIME, TURN_WAIT_TIME);
    yield* hybridmap().wait_for_next_tick();
    yield* chain(all(
        regularghost().move_forward(TURN_MOVE_TIME),
        bugline().end(0.20, TURN_MOVE_TIME),
    ), hybridmap().wait_for_next_tick());
    yield* chain(all(
        regularghost().look_and_move(Origin.TopLeft, TURN_MOVE_TIME),
        bugline().end(0.50, TURN_MOVE_TIME),
    ), hybridmap().wait_for_next_tick());
    yield* chain(all(
        regularghost().look_and_move(Origin.TopRight, TURN_MOVE_TIME),
        bugline().end(0.79, TURN_MOVE_TIME),
    ), hybridmap().wait_for_next_tick());
    yield* chain(all(
        regularghost().look_and_move(Origin.Right, TURN_MOVE_TIME),
        bugline().end(1.0, TURN_MOVE_TIME),
    ), hybridmap().wait_for_next_tick());

    yield* waitUntil("diffalg");
    yield* bugline().opacity(0, 1.2);
    yield* hybridmap().wait_for_next_tick();
    yield* chain(all(
        friendguy().move_forward(TURN_MOVE_TIME),
    ), hybridmap().wait_for_next_tick());
    yield* chain(all(
        regularguy().move_forward(TURN_MOVE_TIME),
        heuline().end(0.12, TURN_MOVE_TIME),
        friendguy().move_forward(TURN_MOVE_TIME),
    ), hybridmap().wait_for_next_tick());
    yield* chain(all(
        regularguy().look_and_move(Origin.TopLeft, TURN_MOVE_TIME),
        heuline().end(0.29, TURN_MOVE_TIME),
        friendguy().move_forward(TURN_MOVE_TIME),
    ), hybridmap().wait_for_next_tick());
    yield* chain(all(
        regularguy().look_and_move(Origin.TopRight, TURN_MOVE_TIME),
        heuline().end(0.465, TURN_MOVE_TIME),
        friendguy().move_forward(TURN_MOVE_TIME),
    ), hybridmap().wait_for_next_tick());
    yield* chain(all(
        regularguy().look_and_move(Origin.Left, TURN_MOVE_TIME),
        heuline().end(0.585, TURN_MOVE_TIME),
        friendguy().move_forward(TURN_MOVE_TIME),
    ), hybridmap().wait_for_next_tick());
    yield* chain(all(
        regularguy().look_and_move(Origin.Bottom, TURN_MOVE_TIME),
        heuline().end(0.705, TURN_MOVE_TIME),
        friendguy().move_forward(TURN_MOVE_TIME),
    ), hybridmap().wait_for_next_tick());
    yield* chain(all(
        regularguy().look_and_move(Origin.TopRight, TURN_MOVE_TIME),
        heuline().end(0.805, TURN_MOVE_TIME),
        friendguy().move_forward(TURN_MOVE_TIME),
    ), hybridmap().wait_for_next_tick());
    yield* chain(all(
        regularguy().look_and_move(Origin.Right, TURN_MOVE_TIME),
        heuline().end(1, TURN_MOVE_TIME),
        friendguy().move_forward(TURN_MOVE_TIME),
    ), hybridmap().wait_for_next_tick());
    yield* heuline().opacity(0, 1.2);

    yield* waitUntil("nextmoment");
    yield* hybridmap().y(1400, 1.2);

    yield* waitUntil("theirversion");
    const theirversionvideo = createRef<Video>();
    view.add(<>
        <Video ref={theirversionvideo}
            src={theirversionmp4}
            scale={1.6}
            y={-1200}
        />
    </>);
    theirversionvideo().play();
    yield* theirversionvideo().y(400, 1.8, easeOutCirc).to(0, 1.3, easeInCirc);

    yield* waitUntil("tilloutside");
    yield* theirversionvideo().y(-1400, 1.8, easeInBack);
    // hybridmap().removeChildren();
    hybridmap().children().slice(1).forEach(t => t.remove());
    hybridmap().children()[0].removeChildren();
    yield* hybridmap().y(0, 1.2);
    
    const visionrat = createRef<BattlecodeBot>();
    const visionratghost = createRef<BattlecodeBot>();
    const visionratghost2 = createRef<BattlecodeBot>();
    const visionratghost3 = createRef<BattlecodeBot>();
    const vision = createRef<Line>();
    const tsz = hybridmap().tile_size()+hybridmap().tile_gap()/2+4;
    const htsz = tsz / 2;
    hybridmap().add(<>
        <CheddarBabyRat ref={visionrat} map={hybridmap()}
            pos={new Vector2(-1, 3)} dir={Origin.Right}
        >
            <Line ref={vision}
                points={[[htsz, -(htsz+tsz)], [htsz, htsz+tsz], [htsz+tsz, htsz+tsz], [htsz+tsz, htsz+tsz*2], [htsz+tsz*2, htsz+tsz*2],
                    [htsz+tsz*2, htsz+tsz*3], [htsz+tsz*3, htsz+tsz*3], [htsz+tsz*3, htsz+tsz*2], [htsz+tsz*4, htsz+tsz*2], [htsz+tsz*4, -(htsz+tsz*2)],
                    [htsz+tsz*3, -(htsz+tsz*2)], [htsz+tsz*3, -(htsz+tsz*3)], [htsz+tsz*2, -(htsz+tsz*3)], [htsz+tsz*2, -(htsz+tsz*2)],
                    [htsz+tsz*1, -(htsz+tsz*2)], [htsz+tsz*1, -(htsz+tsz*1)]]}
                closed
                lineWidth={8} stroke={"#0000ff"}
            />
        </CheddarBabyRat>
        <CheddarBabyRat ref={visionratghost} map={hybridmap()}
            pos={new Vector2(-1, 3)} dir={Origin.Right}
            base_opacity={0.25}
        />
        <CheddarBabyRat ref={visionratghost2} map={hybridmap()}
            pos={new Vector2(-1, 3)} dir={Origin.Right}
            base_opacity={0.25}
        />
        <CheddarBabyRat ref={visionratghost3} map={hybridmap()}
            pos={new Vector2(-1, 3)} dir={Origin.Right}
            base_opacity={0.5}
        />
    </>);
    const visionwall = createRefArray<Rect>();
    const visionwallposns: [number, number][] = [[3, 2], [3, 3], [3, 4]];
    for (let i = 0; i < visionwallposns.length; i++)
        hybridmap().add_item(visionwallposns[i][0], visionwallposns[i][1], <Wall ref={visionwall} scale={0} />)
        
    yield* sequence(0.05, ...visionwall.map(t => t.scale(1, 0.5, easeOutBack)));
    yield* hybridmap().wait_for_next_tick();
    yield* chain(all(visionrat().move_forward(TURN_MOVE_TIME),visionratghost().move_forward(TURN_MOVE_TIME), visionratghost2().move_forward(TURN_MOVE_TIME), visionratghost3().move_forward(TURN_MOVE_TIME),), hybridmap().wait_for_next_tick());
    yield* waitFor(3);
    yield* chain(all(visionratghost().move_forward(TURN_MOVE_TIME), visionratghost2().move_forward(TURN_MOVE_TIME),visionratghost3().move_forward(TURN_MOVE_TIME),), hybridmap().wait_for_next_tick());
    yield* chain(all(visionratghost().move_forward(TURN_MOVE_TIME), visionratghost2().move_forward(TURN_MOVE_TIME),visionratghost3().move_forward(TURN_MOVE_TIME),), hybridmap().wait_for_next_tick());
    
    yield* hybridmap().wait_for_next_tick();
    yield* chain(all(visionrat().move_forward(TURN_MOVE_TIME)), hybridmap().wait_for_next_tick());
    yield* chain(all(visionrat().move_forward(TURN_MOVE_TIME)), hybridmap().wait_for_next_tick());

    yield* chain(all(visionratghost().look_and_move(Origin.Top, TURN_MOVE_TIME)), visionratghost().opacity(0, TURN_MOVE_TIME), hybridmap().wait_for_next_tick());
    yield* chain(all(visionratghost2().look_and_move(Origin.Bottom, TURN_MOVE_TIME)), visionratghost2().opacity(0, TURN_MOVE_TIME), hybridmap().wait_for_next_tick());

    yield* waitUntil("instead2steps");
    yield* chain(all(visionratghost3().look_and_move(Origin.Top, TURN_MOVE_TIME)), hybridmap().wait_for_next_tick());
    yield* chain(all(visionratghost3().look_and_move(Origin.TopRight, TURN_MOVE_TIME)), hybridmap().wait_for_next_tick());

    yield* waitUntil("anymore");
    yield* chain(all(visionratghost3().look_and_move(Origin.BottomRight, TURN_MOVE_TIME)), hybridmap().wait_for_next_tick());
    yield* chain(all(visionratghost3().look_and_move(Origin.Bottom, TURN_MOVE_TIME)), hybridmap().wait_for_next_tick());

    yield* waitUntil("trytogo");
    yield* chain(all(visionrat().just_move(Origin.Top, TURN_MOVE_TIME)), hybridmap().wait_for_next_tick());
    yield* hybridmap().wait_for_next_tick();
    yield* chain(all(visionrat().just_move(Origin.Bottom, TURN_MOVE_TIME)), hybridmap().wait_for_next_tick());
    yield* hybridmap().wait_for_next_tick();
    yield* chain(all(visionrat().just_move(Origin.Bottom, TURN_MOVE_TIME)), hybridmap().wait_for_next_tick());
    yield* hybridmap().wait_for_next_tick();
    yield* chain(all(visionrat().just_move(Origin.Top, TURN_MOVE_TIME)), hybridmap().wait_for_next_tick());

    yield* waitUntil("results");
    yield* hybridmap().x(1400, 1.2);

    yield* waitUntil("end");
});