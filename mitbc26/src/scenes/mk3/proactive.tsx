import { Circle, Gradient, Img, Line, Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import { Origin, Vector2, all, cancel, chain, createRef, createRefArray, easeInBack, easeInSine, easeOutBack, easeOutSine, loop, noop, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { BattlecodeMap } from "../../battlecode/map";
import { CheddarRatKing, PlumBabyRat, PlumRatKing, TileType, TileTypeInfo, Wall } from "../../battlecode/mit26/prefabs";
import { BattlecodeBot } from "../../battlecode/bot";

import babyexampleimg from "../../battlecode/mit26/img/robots/cheddar/rat_2_64x64.png";
import babykingexampleimg from "../../battlecode/mit26/img/robots/cheddar/rat_king_64x64.png";
import { RoboticTxt } from "../../components/helpers";

const TURN_TIME = 0.5
const TURN_MOVE_TIME = 0.2
const TURN_WAIT_TIME = TURN_TIME - TURN_MOVE_TIME

export default makeScene2D(function* (view) {
    yield* waitUntil("mainsym");
    const map = createRef<BattlecodeMap>();
    const static_map = range(11 * 11).map(t => TileType.Empty);
    view.add(<>
        <BattlecodeMap
            ref={map}
            x={0} y={1200} faded_bounds={false}
            map_bounds={[11, 11]}
            tile_size={80} tile_gap={8}
            radius={3} show_pct={1}
            base_colors={static_map.map(t => TileTypeInfo[t].color)}
        ></BattlecodeMap>
    </>);
    yield map().run_ticks(TURN_MOVE_TIME, TURN_WAIT_TIME);
    yield* map().y(0, 1.2);

    const verticalwalls = createRefArray<Rect>();
    const horizontalwalls = createRefArray<Rect>();
    const rotationalwalls = createRefArray<Rect>();
    
    const vertwallmap = `\
00000000000\
00000000000\
00111111100\
00000000000\
00000000000\
00000000000\
00000000000\
00000000000\
00111111100\
00000000000\
00000000000`;
    const horizwallmap = `\
00000000000\
00000000000\
00100000100\
00100000100\
00100000100\
00100000100\
00100000100\
00100000100\
00100000100\
00000000000\
00000000000`;
    const rotawallmap = `\
00001000000\
00011111000\
00100000000\
01000000000\
10000000000\
00000000000\
00000000001\
00000000010\
00000000100\
00011111000\
00000010000`;
    for (let i = 0; i < vertwallmap.length; i++) {
        if (vertwallmap.charAt(i) === '1') {
           map().add_item(i % 11, Math.floor(i / 11), <Wall ref={verticalwalls} scale={0}/>);
        } if (horizwallmap.charAt(i) === '1') {
            map().add_item(i % 11, Math.floor(i / 11), <Wall ref={horizontalwalls} scale={0}/>);
        } if (rotawallmap.charAt(i) === '1') {
            map().add_item(i % 11, Math.floor(i / 11), <Wall ref={rotationalwalls} scale={0}/>);
        }
    }

    yield* waitUntil("vertical");
    yield* sequence(0.01, ...verticalwalls.map(t => t.scale(1, 0.1, easeOutBack)));
    yield* waitUntil("horizontal");
    yield* all(
        sequence(0.01, ...verticalwalls.map(t => t.scale(0, 0.1, easeInBack))),
        sequence(0.01, ...horizontalwalls.map(t => t.scale(1, 0.1, easeOutBack))),
    );
    yield* waitUntil("rotational");
    yield* all(
        sequence(0.01, ...horizontalwalls.map(t => t.scale(0, 0.1, easeInBack))),
        sequence(0.01, ...rotationalwalls.map(t => t.scale(1, 0.1, easeOutBack))),
    );
    yield* waitUntil("wherewestart");
    yield* sequence(0.01, ...rotationalwalls.map(t => t.scale(0, 0.1, easeInBack)));

    const myratking = createRef<BattlecodeBot>();
    const notmyratking = createRef<BattlecodeBot>();
    map().add(<>
        <PlumRatKing ref={myratking} map={map()}
            pos={new Vector2(9,9)} dir={Origin.Left}
            scale={0}
        />
        <CheddarRatKing ref={notmyratking} map={map()}
            pos={new Vector2(1,9)} dir={Origin.Left}
            scale={0}
        />
    </>);
    const threeoptions = createRefArray<Circle>();
    map().add_item(1, 1, <Circle ref={threeoptions} scale={0} lineWidth={10} stroke={"#a36c37"} />);
    map().add_item(9, 1, <Circle ref={threeoptions} scale={0} lineWidth={10} stroke={"#a36c37"} />);
    map().add_item(1, 9, <Circle ref={threeoptions} scale={0} lineWidth={10} stroke={"#a36c37"} />);
    yield* sequence(0.1, myratking().scale(1, 0.8, easeOutBack), notmyratking().scale(1, 0.8, easeOutBack));

    yield* waitUntil("thethree");
    yield* notmyratking().opacity(0.2, 0.5);
    yield* sequence(0.4, ...threeoptions.map(t => all(t.scale(2, 1.8), t.lineWidth(0, 2))));
    yield* notmyratking().opacity(1, 0.5);
    yield* waitUntil("sendscouts");
    const scouts = createRefArray<BattlecodeBot>();
    map().add(<>
        <PlumBabyRat ref={scouts} map={map()}
            pos={new Vector2(9, 7)} dir={Origin.Top}
            scale={0}
        />
        <PlumBabyRat ref={scouts} map={map()}
            pos={new Vector2(7, 7)} dir={Origin.TopLeft}
            scale={0}
        />
        <PlumBabyRat ref={scouts} map={map()}
            pos={new Vector2(7, 9)} dir={Origin.Left}
            scale={0}
        />
    </>);
    yield* map().wait_for_next_tick();
    yield* chain(all(scouts[0].scale(1, TURN_MOVE_TIME)), map().wait_for_next_tick());
    yield* chain(all(
        scouts[0].move_forward(TURN_MOVE_TIME),
        scouts[1].scale(1, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    yield* chain(all(
        scouts[0].move_forward(TURN_MOVE_TIME),
        scouts[1].move_forward(TURN_MOVE_TIME),
        scouts[2].scale(1, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    yield* chain(all(
        scouts[0].move_forward(TURN_MOVE_TIME),
        scouts[1].move_forward(TURN_MOVE_TIME),
        scouts[2].move_forward(TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    yield* chain(all(
        scouts[0].move_forward(TURN_MOVE_TIME),
        scouts[1].move_forward(TURN_MOVE_TIME),
        scouts[2].move_forward(TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    yield* chain(all(
        scouts[0].move_forward(TURN_MOVE_TIME),
        scouts[1].move_forward(TURN_MOVE_TIME),
        scouts[2].move_forward(TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    yield* chain(all(
        scouts[0].move_forward(TURN_MOVE_TIME),
        scouts[1].move_forward(TURN_MOVE_TIME),
        scouts[2].jump_up(1.1),
    ), map().wait_for_next_tick());
    yield* chain(all(
        scouts[0].look_in_dir_gen(Origin.TopRight),
        scouts[1].move_forward(TURN_MOVE_TIME),
        scouts[2].look_and_move(Origin.Right, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    yield* chain(all(
        scouts[0].look_in_dir_gen(Origin.Right),
        scouts[1].look_in_dir_gen(Origin.Top),
        scouts[2].move_forward(TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    yield* chain(all(
        scouts[0].look_in_dir_gen(Origin.BottomRight),
        scouts[1].look_in_dir_gen(Origin.TopRight),
        scouts[2].move_forward(TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    const scoutsqueak = createRef<Circle>();
    map().add_item(7, 9, <Circle ref={scoutsqueak} scale={0} zIndex={-1} stroke={new Gradient({
        type: "radial",
        fromRadius: 0,
        toRadius: 430,
        stops: [
            { offset: 0, color: "#5437b3", },
            { offset: 1, color: "#221725", },
        ]
    })} lineWidth={30} />);
    yield* chain(all(
        scouts[0].look_in_dir_gen(Origin.BottomRight),
        scouts[1].look_in_dir_gen(Origin.TopRight),
        scouts[2].jump_up(1.1),
        scoutsqueak().scale(8, 1.2), scoutsqueak().lineWidth(0, 1.2),
    ), map().wait_for_next_tick());

    const scout0beep = yield loop(Infinity, () => chain(
        scouts[0].look_in_dir_gen(Origin.Bottom), map().wait_for_next_tick(),
        scouts[0].look_in_dir_gen(Origin.BottomLeft), map().wait_for_next_tick(),
        scouts[0].look_in_dir_gen(Origin.Left), map().wait_for_next_tick(),
        scouts[0].look_in_dir_gen(Origin.TopLeft), map().wait_for_next_tick(),
        scouts[0].look_in_dir_gen(Origin.Top), map().wait_for_next_tick(),
        scouts[0].look_in_dir_gen(Origin.TopRight), map().wait_for_next_tick(),
        scouts[0].look_in_dir_gen(Origin.Right), map().wait_for_next_tick(),
        scouts[0].look_in_dir_gen(Origin.BottomRight), map().wait_for_next_tick(),
    ));
    const scout1boop = yield loop(Infinity, () => chain(
        scouts[1].look_in_dir_gen(Origin.Right), map().wait_for_next_tick(),
        scouts[1].look_in_dir_gen(Origin.BottomRight), map().wait_for_next_tick(),
        scouts[1].look_in_dir_gen(Origin.Bottom), map().wait_for_next_tick(),
        scouts[1].look_in_dir_gen(Origin.BottomLeft), map().wait_for_next_tick(),
        scouts[1].look_in_dir_gen(Origin.Left), map().wait_for_next_tick(),
        scouts[1].look_in_dir_gen(Origin.TopLeft), map().wait_for_next_tick(),
        scouts[1].look_in_dir_gen(Origin.Top), map().wait_for_next_tick(),
        scouts[1].look_in_dir_gen(Origin.TopRight), map().wait_for_next_tick(),
    ));

    yield* waitUntil("yeeeet");
    yield* map().wait_for_next_tick();
    const newhires = createRefArray<BattlecodeBot>();
    const hirelocs: [number, number][] = [[8, 7], [7, 8], [7, 9], [7, 10]];
    map().add(<>
        {...hirelocs.map(l => <PlumBabyRat ref={newhires} map={map()}
            pos={new Vector2(l)} dir={Origin.Left}
            scale={0}
        />)}
    </>);
    yield* chain(all(
        scouts[2].look_and_move(Origin.Left, TURN_MOVE_TIME),
        newhires[0].scale(1, TURN_MOVE_TIME, easeOutBack),
    ), map().wait_for_next_tick());
    yield* chain(all(
        scouts[2].look_and_move(Origin.Left, TURN_MOVE_TIME),
        newhires[0].look_and_move(Origin.Left, TURN_MOVE_TIME),
        newhires[1].scale(1, TURN_MOVE_TIME, easeOutBack),
    ), map().wait_for_next_tick());
    yield* chain(all(
        scouts[2].look_and_move(Origin.Left, TURN_MOVE_TIME),
        newhires[0].look_and_move(Origin.Left, TURN_MOVE_TIME),
        newhires[1].look_and_move(Origin.Left, TURN_MOVE_TIME),
        newhires[2].scale(1, TURN_MOVE_TIME, easeOutBack),
    ), map().wait_for_next_tick());
    yield* chain(all(
        scouts[2].look_and_move(Origin.Left, TURN_MOVE_TIME),
        newhires[0].look_and_move(Origin.Left, TURN_MOVE_TIME),
        newhires[1].look_and_move(Origin.Left, TURN_MOVE_TIME),
        newhires[2].look_and_move(Origin.Left, TURN_MOVE_TIME),
        newhires[3].scale(1, TURN_MOVE_TIME, easeOutBack),
    ), map().wait_for_next_tick());
    yield* chain(all(
        scouts[2].do_action(Origin.Left),
        newhires[0].look_and_move(Origin.Left, TURN_MOVE_TIME),
        newhires[1].look_and_move(Origin.Left, TURN_MOVE_TIME),
        newhires[2].look_and_move(Origin.Left, TURN_MOVE_TIME),
        newhires[3].look_and_move(Origin.Left, TURN_MOVE_TIME),
        notmyratking().show_healthbar(0.1), notmyratking().damage_and_sync(0.02, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());

    yield* chain(all(
        scouts[2].do_action(Origin.Left),
        newhires[0].look_and_move(Origin.Left, TURN_MOVE_TIME),
        newhires[1].look_and_move(Origin.Left, TURN_MOVE_TIME),
        newhires[2].look_and_move(Origin.Left, TURN_MOVE_TIME),
        newhires[3].look_and_move(Origin.Left, TURN_MOVE_TIME),
        notmyratking().damage_and_sync(0.02, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());

    yield* chain(all(
        scouts[2].do_action(Origin.Left),
        newhires[0].do_action(Origin.BottomLeft),
        newhires[1].do_action(Origin.Left),
        newhires[2].look_and_move(Origin.BottomLeft, TURN_MOVE_TIME),
        newhires[3].look_and_move(Origin.Left, TURN_MOVE_TIME),
        notmyratking().damage_and_sync(0.06, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    yield* chain(all(
        scouts[2].do_action(Origin.Left),
        newhires[0].do_action(Origin.BottomLeft),
        newhires[1].do_action(Origin.Left),
        newhires[2].do_action(Origin.Left),
        newhires[3].look_and_move(Origin.Top, TURN_MOVE_TIME),
        notmyratking().damage_and_sync(0.08, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    yield* chain(all(
        scouts[2].do_action(Origin.Left),
        newhires[0].do_action(Origin.BottomLeft),
        newhires[1].do_action(Origin.Left),
        newhires[2].do_action(Origin.Left),
        newhires[3].look_and_move(Origin.Bottom, TURN_MOVE_TIME),
        notmyratking().damage_and_sync(0.08, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    yield* chain(all(
        scouts[2].do_action(Origin.Left),
        newhires[0].do_action(Origin.BottomLeft),
        newhires[1].do_action(Origin.Left),
        newhires[2].do_action(Origin.Left),
        newhires[3].look_and_move(Origin.Top, TURN_MOVE_TIME),
        notmyratking().damage_and_sync(0.08, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());

    yield* chain(all(
        scouts[2].do_action(Origin.Left),
        newhires[0].do_action(Origin.BottomLeft),
        newhires[1].do_action(Origin.Left),
        newhires[2].do_action(Origin.Left),
        newhires[3].look_and_move(Origin.Bottom, TURN_MOVE_TIME),
        notmyratking().damage_and_sync(0.08, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    yield* chain(all(
        scouts[2].do_action(Origin.Left),
        newhires[0].do_action(Origin.BottomLeft),
        newhires[1].do_action(Origin.Left),
        newhires[2].do_action(Origin.Left),
        newhires[3].look_and_move(Origin.Top, TURN_MOVE_TIME),
        notmyratking().damage_and_sync(0.08, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());


    yield* chain(all(
        scouts[2].do_action(Origin.Left),
        newhires[0].do_action(Origin.BottomLeft),
        newhires[1].do_action(Origin.Left),
        newhires[2].do_action(Origin.Left),
        newhires[3].look_and_move(Origin.Bottom, TURN_MOVE_TIME),
        notmyratking().damage_and_sync(0.08, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    yield* chain(all(
        scouts[2].do_action(Origin.Left),
        newhires[0].do_action(Origin.BottomLeft),
        newhires[1].do_action(Origin.Left),
        newhires[2].do_action(Origin.Left),
        newhires[3].look_and_move(Origin.Top, TURN_MOVE_TIME),
        notmyratking().damage_and_sync(0.08, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());


    yield* chain(all(
        scouts[2].do_action(Origin.Left),
        newhires[0].do_action(Origin.BottomLeft),
        newhires[1].do_action(Origin.Left),
        newhires[2].do_action(Origin.Left),
        newhires[3].look_and_move(Origin.Bottom, TURN_MOVE_TIME),
        notmyratking().damage_and_sync(0.08, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    yield* chain(all(
        scouts[2].do_action(Origin.Left),
        newhires[0].do_action(Origin.BottomLeft),
        newhires[1].do_action(Origin.Left),
        newhires[2].do_action(Origin.Left),
        newhires[3].look_and_move(Origin.Top, TURN_MOVE_TIME),
        notmyratking().damage_and_sync(0.08, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());


    yield* chain(all(
        scouts[2].do_action(Origin.Left),
        newhires[0].do_action(Origin.BottomLeft),
        newhires[1].do_action(Origin.Left),
        newhires[2].do_action(Origin.Left),
        newhires[3].look_and_move(Origin.Bottom, TURN_MOVE_TIME),
        notmyratking().damage_and_sync(0.08, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    yield* chain(all(
        scouts[2].do_action(Origin.Left),
        newhires[0].do_action(Origin.BottomLeft),
        newhires[1].do_action(Origin.Left),
        newhires[2].do_action(Origin.Left),
        newhires[3].look_and_move(Origin.Top, TURN_MOVE_TIME),
        notmyratking().damage_and_sync(0.08, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());


    yield* chain(all(
        scouts[2].do_action(Origin.Left),
        newhires[0].do_action(Origin.BottomLeft),
        newhires[1].do_action(Origin.Left),
        newhires[2].do_action(Origin.Left),
        newhires[3].look_and_move(Origin.Bottom, TURN_MOVE_TIME),
        notmyratking().damage_and_sync(0.08, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    yield* chain(all(
        scouts[2].do_action(Origin.Left),
        newhires[0].do_action(Origin.BottomLeft),
        newhires[1].do_action(Origin.Left),
        newhires[2].do_action(Origin.Left),
        newhires[3].look_and_move(Origin.Top, TURN_MOVE_TIME),
        notmyratking().damage_and_sync(0.08, TURN_MOVE_TIME),
    ), map().wait_for_next_tick());
    cancel(scout0beep);
    cancel(scout1boop);

    yield* waitUntil("crippling");
    yield* map().x(-2000, 1.2)

    yield* waitUntil("babiesrgood");
    const babyimg = createRef<Img>();
    const kingimg = createRef<Img>();
    view.add(<>
        <Img ref={babyimg}
            src={babyexampleimg}
            x={-1400}
            scale={0.2*2}
        />
        <Img ref={kingimg}
            src={babykingexampleimg}
            x={1400}
            scale={0.15*1.5}
        />
    </>);
    yield* sequence(3,
        babyimg().x(-300, 1, easeOutSine).back(1, easeInSine),
        kingimg().x( 300, 1, easeOutSine).back(1, easeInSine),
        
    );
    
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
            scale={1.4} y={1200}
            clip
        >
            <RoboticTxt ref={prioritytxts}
                text={"The King Plan"} fill={"#d94c8c"}
                alignSelf={"center"} marginTop={10} fontSize={48}
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
                    fill={conditioncolors2[i]} text={conditiontexts2[i]}
                />)}
            </Rect>
        </Rect>
    </>);
    yield* waitUntil("simple");
    yield* prioritytxtrect().y(0, 1.2);
    yield* waitUntil("change");
    const conditiontextsfinal = [ "1. Spawn", "", "2. Trap", "3. Scratch" ];
    yield* sequence(0.5,
        prioritytxts[1].text(conditiontextsfinal[0], 1.2),
        noop(),
        noop(),
        noop(),
        noop(),
        noop(),
        noop(),
        noop(),
        noop(),
        noop(),
        noop(),
        prioritytxtrect().height(365, 1.2),
        ...range(3).map(i => prioritytxts[i+2].text(conditiontextsfinal[i+1], 1.2)),
    );

    yield* waitUntil("end");
    yield* prioritytxtrect().y(-1400, 1.2);
})