import { Code, Icon, Img, Line, Node, Rect, Txt, makeScene2D, replace, word } from "@motion-canvas/2d";
import { DEFAULT, Origin, Vector2, all, cancel, chain, createRef, createRefArray, easeOutBack, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { MonoTxt, RoboticTxt, wiggle } from "../../components/helpers";
import { BattlecodeMap } from "../../battlecode/map";
import { CheddarBabyRat, Cheese, PlumBabyRat, RatTrap, TileType, TileTypeInfo } from "../../battlecode/mit26/prefabs";
import { BattlecodeBot } from "../../battlecode/bot";


const TURN_TIME = 0.5
const TURN_MOVE_TIME = 0.2
const TURN_WAIT_TIME = TURN_TIME - TURN_MOVE_TIME

export default makeScene2D(function* (view) {
    yield* waitUntil("simpleattack");
    const titleA = createRef<Txt>();
    const titleblockA = createRef<Rect>();
    const titleB = createRef<Txt>();
    const titleblockB = createRef<Rect>();
    const titleC = createRef<Txt>();
    const titleblockC = createRef<Rect>();
    const static_map = range(5 * 5).map(t => TileType.Empty);

    const mapA = createRef<BattlecodeMap>();
    const mapB = createRef<BattlecodeMap>();
    const mapC = createRef<BattlecodeMap>();
    view.add(<>
        <Rect ref={titleblockA}
            fill={"#100a0b"} stroke={"#a36c37"} lineWidth={4}
            size={[600, 150]}
            position={[-1400-40, -465-20]}
        >
            <RoboticTxt ref={titleA}
                text={"1. Scratch"} position={[20, 10]}
                fill={"#a36c37"}
                fontSize={80}
            />
        </Rect>
        <Rect ref={titleblockB}
            fill={"#100a0b"} stroke={"#a36c37"} lineWidth={4}
            size={[700, 150]}
            position={[-1400-40, -465-20]}
        >
            <RoboticTxt ref={titleB}
                text={"2. Rat Traps"} position={[20, 10]}
                fill={"#a36c37"}
                fontSize={80}
            />
        </Rect>
        <Rect ref={titleblockC}
            fill={"#100a0b"} stroke={"#a36c37"} lineWidth={4}
            size={[700, 150]}
            position={[-1400-40, -465-20]}
        >
            <RoboticTxt ref={titleC}
                text={"3. Ratnapping"} position={[20, 10]}
                fill={"#a36c37"}
                fontSize={80}
            />
        </Rect>
        <BattlecodeMap
            ref={mapA}
            x={-400} y={1200} faded_bounds={false}
            map_bounds={[3, 3]}
            tile_size={120} tile_gap={12}
            radius={3} show_pct={1}
            base_colors={static_map.map(t => TileTypeInfo[t].color)}
        ></BattlecodeMap>
        <BattlecodeMap
            ref={mapB}
            x={0} y={1200} faded_bounds={false}
            map_bounds={[3, 3]}
            tile_size={120} tile_gap={12}
            radius={3} show_pct={1}
            base_colors={static_map.map(t => TileTypeInfo[t].color)}
        ></BattlecodeMap>
        <BattlecodeMap
            ref={mapC}
            x={-400} y={1200} faded_bounds={false}
            map_bounds={[5, 5]}
            tile_size={120} tile_gap={12}
            radius={3} show_pct={1}
            base_colors={static_map.map(t => TileTypeInfo[t].color)}
        ></BattlecodeMap>
    </>);
    yield* titleblockA().x(-700, 0.8);
    yield* mapA().y(0, 1.2);
    const mapAticker = yield mapA().run_ticks(TURN_MOVE_TIME, TURN_WAIT_TIME);

    const mapAratA = createRef<BattlecodeBot>();
    const mapAratB = createRef<BattlecodeBot>();
    mapA().add(<>
        <CheddarBabyRat ref={mapAratA} map={mapA()}
            pos={new Vector2(-1, 1)} dir={Origin.Right}
        />
        <PlumBabyRat ref={mapAratB} map={mapA()}
            pos={new Vector2(3, 1)} dir={Origin.Left}
        />
    </>);
    yield* mapA().wait_for_next_tick();
    yield* chain(all(mapAratA().move_forward(TURN_MOVE_TIME), mapAratB().move_forward(TURN_MOVE_TIME)), mapA().wait_for_next_tick());
    yield* chain(all(mapAratA().move_forward(TURN_MOVE_TIME)), mapA().wait_for_next_tick());
    yield* chain(all(mapAratA().do_action(Origin.Right), mapAratB().show_healthbar(TURN_MOVE_TIME/2), mapAratB().damage_and_sync(0.1, TURN_MOVE_TIME)), mapA().wait_for_next_tick());
    yield* waitUntil("usecheese");
    const mapAcheese = createRef<Img>();
    mapA().add_item(1, 2, <Cheese ref={mapAcheese} scale={0}/>);
    yield* mapAcheese().scale(1, 0.5, easeOutBack);
    yield* mapA().wait_for_next_tick();
    mapAratA().look_in_dir(Origin.Bottom);
    
    yield* chain(all(mapAratA().do_action(Origin.Bottom),
        mapAcheese().position(mapAratA().position(), 0.5),
        mapAcheese().scale(0, 0.5)), mapA().wait_for_next_tick());
    mapAratA().look_in_dir(Origin.Right);
    yield* chain(all(mapAratA().do_action(Origin.Right), mapAratB().damage_and_sync(0.1 + (10 + Math.ceil(Math.log(10))) / 100, TURN_MOVE_TIME)), mapA().wait_for_next_tick());
    
    const formulablock = createRef<Rect>();
    const formula = createRef<Code>();
    view.add(<>
        <Rect ref={formulablock}
            fill={"#100a0b"} stroke={"#a36c37"} lineWidth={4}
            position={[1450, 0]}
            layout padding={30}
        >
            <Code ref={formula}
                code={"damage = 10 + ceil(log(cheese))"}
            />
        </Rect>
    </>);
    yield* formulablock().x(400, 1.2);

    yield* waitUntil("buff");
    yield* all(
        formula().code.replace(formula().findFirstRange('log'), 'sqrt', 0.6),
        formula().selection(word(0, 19, 4), 0.5)
    );
    yield* waitFor(2);
    yield* formula().selection(DEFAULT, 0.5);

    yield* waitUntil("fadeeverything");
    yield* all(formulablock().x(1450, 1.2), mapA().x(mapA().x() - 900, 0.8), mapA().scale(0.8, 0.8));
    yield* waitUntil("rattrapping");
    
    cancel(mapAticker);
    yield* chain(titleblockA().x(-1400-40, 0.8), titleblockB().x(-650, 0.8));
    yield* mapB().y(0, 1.2);
    const mapBticker = yield mapB().run_ticks(TURN_MOVE_TIME, TURN_WAIT_TIME);

    
    const mapBratA = createRef<BattlecodeBot>();
    const mapBratB = createRef<BattlecodeBot>();
    const mapBtrap = createRef<Img>();
    mapB().add_item(1, 1, <RatTrap ref={mapBtrap} scale={0}/>);
    mapB().add(<>
        <CheddarBabyRat ref={mapBratA} map={mapB()}
            pos={new Vector2(-1, 1)} dir={Origin.Right}
        />
        <PlumBabyRat ref={mapBratB} map={mapB()}
            pos={new Vector2(3, 0)} dir={Origin.Left}
        >
            <MonoTxt
                y={-60} fill={"#fff"}
                fontSize={50} text={"?"}
            />
        </PlumBabyRat>
    </>);
    yield* mapB().wait_for_next_tick();
    yield* chain(all(mapBratA().move_forward(TURN_MOVE_TIME)), mapB().wait_for_next_tick());
    yield* chain(all(mapBratA().do_action(Origin.Right), mapBtrap().scale(1, 0.5, easeOutBack)), mapB().wait_for_next_tick());
    yield* chain(all(mapBratB().move_forward(TURN_MOVE_TIME)), mapB().wait_for_next_tick());

    yield* waitUntil("withinradius");
    yield* mapB().wait_for_next_tick();
    yield* chain(all(mapBratB().move_forward(TURN_MOVE_TIME)), waitFor(0.1));
    yield* chain(all(mapBratB().show_healthbar(TURN_MOVE_TIME), mapBratB().damage_and_sync(0.5, TURN_MOVE_TIME), mapBtrap().scale(2, 0.25), mapBtrap().opacity(0, 0.25)), mapB().wait_for_next_tick());

    yield* waitUntil("almostalwaysbetter");
    yield* all(mapBtrap().scale(1.1, 1.2), mapBtrap().opacity(0.4, 1.2));
    cancel(mapBticker);

    yield* waitUntil("mostcool");
    yield* all(mapB().x(mapB().x() + 1200, 1.2))
    yield* chain(titleblockB().x(-1400-40, 0.8), titleblockC().x(-650, 0.8));

    yield* waitUntil("threeconditions");
    const mapCtrap = createRef<Icon>();
    mapC().add_item(3, 2, <RatTrap ref={mapCtrap} />)
    yield* mapC().y(0, 1.2);
    const conditionparent = createRef<Node>();
    const theconditions = createRefArray<Rect>();
    const theconditiontexts = createRefArray<Txt>();
    const conditiontexts = [ "- They are facing away", "- or They have lower health", "- or They are an ally"];

    const conditioncolors = [ "#9e37a3", "#a33774", "#a3373e" ];
    const conditioncolorbgs = [ "#250c26", "#2e0d20", "#330d10" ];
    view.add(<Node ref={conditionparent}>
        {...range(3).map(i => <Rect ref={theconditions} layout
            offsetX={-1} x={1300} y={-120 + 120*i}
            padding={12} paddingRight={20}
            lineWidth={2} stroke={conditioncolors[i]}
            fill={conditioncolorbgs[i]}
        >
            <RoboticTxt ref={theconditiontexts}
                text={conditiontexts[i]} fill={conditioncolors[i]}
            />
        </Rect>)}
    </Node>);

    yield* sequence(0.1, ...range(3).map(i => theconditions[i].x(100+i*50, 1.2)));
    const mapCratA = createRef<BattlecodeBot>();
    const mapCratB = createRef<BattlecodeBot>();
    const mapCratC = createRef<BattlecodeBot>();
    const mapCticker = yield mapC().run_ticks(TURN_MOVE_TIME, TURN_WAIT_TIME);
    mapC().add(<>
        <CheddarBabyRat ref={mapCratA} map={mapC()}
            pos={new Vector2(-1, 1)} dir={Origin.Right}
        />
        <PlumBabyRat ref={mapCratB} map={mapC()}
            pos={new Vector2(5, 1)} dir={Origin.Left}
            zIndex={2}
        />
        <PlumBabyRat ref={mapCratC} map={mapC()}
            pos={new Vector2(5, 3)} dir={Origin.Left}
        />
    </>);
    
    yield* mapC().wait_for_next_tick();
    yield* chain(all(mapCratA().move_forward(TURN_MOVE_TIME), mapCratB().move_forward(TURN_MOVE_TIME)), mapC().wait_for_next_tick());
    yield* chain(all(
        mapCratA().move_forward(TURN_MOVE_TIME), mapCratB().move_forward(TURN_MOVE_TIME),
        mapCtrap().scale(2, 0.2), mapCtrap().opacity(0, 0.2), mapCratB().show_healthbar(0.05), mapCratB().damage_and_sync(0.5, TURN_MOVE_TIME),
    ), mapC().wait_for_next_tick());
    yield* chain(all(mapCratB().move_forward(TURN_MOVE_TIME)), mapC().wait_for_next_tick());
    yield* chain(all(
        mapCratA().do_action(Origin.Right), mapCratB().position(mapCratA().position, TURN_MOVE_TIME), mapCratB().scale(0.5, TURN_MOVE_TIME),
    ), mapC().wait_for_next_tick());

    yield* chain(all(mapCratA().look_and_move(Origin.Right, TURN_MOVE_TIME)), mapC().wait_for_next_tick());
    yield* chain(all(mapCratA().look_and_move(Origin.Top, TURN_MOVE_TIME), mapCratC().move_forward(TURN_MOVE_TIME)), mapC().wait_for_next_tick());
    yield* chain(all(mapCratA().look_in_dir_gen(Origin.Bottom), mapCratC().move_forward(TURN_MOVE_TIME)), mapC().wait_for_next_tick());
    yield* chain(all(
        mapCratA().do_action(Origin.Bottom), mapCratC().move_forward(TURN_MOVE_TIME),
        mapCratB().move_to_pos(new Vector2(2,2), TURN_MOVE_TIME), mapCratB().scale(1, TURN_MOVE_TIME*0.5),
        mapCratB().damage_and_sync(0.45, TURN_MOVE_TIME), mapCratC().show_healthbar(0.05), mapCratC().damage_and_sync(0.45, TURN_MOVE_TIME),
    ), mapC().wait_for_next_tick());

    yield* waitUntil("nuanceskipped");
    yield* sequence(0.1, conditionparent().x(1200, 1.2), mapC().x(-1400, 1.2), titleblockC().x(-1400-40, 0.8));
    const prioritytxts = createRefArray<Txt>();
    const prioritytxtrect = createRef<Rect>();
    const priorityelementstxtrect = createRef<Rect>();
    const conditioncolors2 = [ "#d44a58", "#d44a58", "#d44a58", "#d44a58" ];
    const conditiontexts2 = [ "1. Throw", "2. Ratnap", "3. Trap", "4. Scratch" ];
    view.add(<>
        <Rect ref={prioritytxtrect}
            layout direction={"column"}
            padding={10} width={400} height={425}
            fill={"#250c26"} lineWidth={4} stroke={"#9e37a3"}
            scale={1.4} y={-1200}
            clip
        >
            <RoboticTxt ref={prioritytxts}
                text={"The Plan"} fill={"#d94c8c"}
                alignSelf={"center"} marginTop={10} fontSize={66}
            />
            <Line
                lineWidth={4} stroke={"#9e37a3"}
                marginTop={20}
                points={[[0, 0], [380, 0]]}
            />
            <Rect ref={priorityelementstxtrect}
                layout direction={"column"}
                padding={30} paddingTop={40}
            >
                {...range(4).map(i => <RoboticTxt ref={prioritytxts}
                    fill={conditioncolors2[i]}
                />)}
            </Rect>
        </Rect>
    </>);
    yield* prioritytxtrect().y(0, 1.2);
    yield* waitUntil("thefour");
    yield* sequence(2, ...range(4).map(i => prioritytxts[i+1].text(conditiontexts2[i], 1.6)));

    yield* waitUntil("end");
    yield* prioritytxtrect().y(1200, 1.2);
});