import { Circle, Code, Gradient, Img, Line, Node, Rect, Txt, Video, makeScene2D, replace } from "@motion-canvas/2d";
import { DEFAULT, Origin, Vector2, all, chain, createRef, createRefArray, easeInBack, map, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { BattlecodeMap } from "../../battlecode/map";
import { BattlecodeBot } from "../../battlecode/bot";
import { Cat, CheddarBabyRat, CheddarRatKing, PlumBabyRat, PlumRatKing, TileType, TileTypeInfo } from "../../battlecode/mit26/prefabs";
import { MonoTxt, RoboticTxt, append_to_code, get_rect_tournament_line } from "../../components/helpers";

import winconpng from "../../video/wincon.png";
import groupingmp4 from "../../video/grouping.mp4";
import toomuchgroupingmp4 from "../../video/toomuchgrouping.mp4";
import notdoingwellmp4 from "../../video/notdoingwell.mp4";
import outpostmp4 from "../../video/Outpost.mp4";
import purerushmp4 from "../../video/purerush.mp4";
import yikesmp4 from "../../video/yikes.mp4";

const TURN_TIME = 0.5;
const TURN_MOVE_TIME = 0.2;
const TURN_WAIT_TIME = TURN_TIME - TURN_MOVE_TIME;

export default makeScene2D(function* (view) {
    yield* waitUntil("takecatdirintoacc");
    const map = createRef<BattlecodeMap>();
    const static_map = range(11 * 11).map(t => TileType.Empty);
    view.add(<>
        <BattlecodeMap
            ref={map}
            x={0} y={1200} faded_bounds={false}
            map_bounds={[7, 7]}
            tile_size={120} tile_gap={12}
            radius={3} show_pct={1}
            base_colors={static_map.map(t => TileTypeInfo[t].color)}
        ></BattlecodeMap>
    </>);
    yield map().run_ticks(TURN_MOVE_TIME, TURN_WAIT_TIME);

    const mapbby = createRef<BattlecodeBot>();
    const mapbbyfear = createRef<Txt>();
    const mapcat = createRef<BattlecodeBot>();
    map().add(<>
        <PlumBabyRat ref={mapbby} map={map()}
            pos={new Vector2(-1, 3)} dir={Origin.Right}
        >
            <MonoTxt ref={mapbbyfear}
                y={-10} text={"yikes"}
                fontSize={50} fontWeight={700}
                opacity={0} fill={"#8d2d52"}
            />
        </PlumBabyRat>
        <Cat ref={mapcat} map={map()}
            pos={new Vector2(-1, 2)} dir={Origin.Right}
        />
    </>);
    yield* map().y(0, 1.2);

    yield* map().wait_for_next_tick();
    yield* chain(all(mapcat().move_forward(TURN_MOVE_TIME)), map().wait_for_next_tick());
    yield* chain(all(mapcat().move_forward(TURN_MOVE_TIME)), map().wait_for_next_tick());
    yield* chain(all(mapcat().move_forward(TURN_MOVE_TIME)), map().wait_for_next_tick());
    yield* chain(all(mapbby().move_forward(TURN_MOVE_TIME), mapcat().move_forward(TURN_MOVE_TIME)), map().wait_for_next_tick());
    yield* chain(all(mapbby().move_forward(TURN_MOVE_TIME), mapcat().move_forward(TURN_MOVE_TIME)), map().wait_for_next_tick());
    yield* chain(all(mapbby().move_forward(TURN_MOVE_TIME), mapbbyfear().y(-90, 0.4), mapbbyfear().opacity(1, TURN_MOVE_TIME), mapcat().look_in_dir_gen(Origin.Left)), map().wait_for_next_tick());
    yield* chain(all(mapbby().look_and_move(Origin.Left, TURN_MOVE_TIME)), map().wait_for_next_tick());
    yield* chain(all(mapbby().move_forward(TURN_MOVE_TIME), mapcat().move_forward(TURN_MOVE_TIME)), map().wait_for_next_tick());
    yield* chain(all(mapbby().move_forward(TURN_MOVE_TIME), mapcat().move_forward(TURN_MOVE_TIME)), map().wait_for_next_tick());
    yield* chain(all(mapcat().move_forward(TURN_MOVE_TIME)), map().wait_for_next_tick());
    yield* chain(all(mapcat().move_forward(TURN_MOVE_TIME)), map().wait_for_next_tick());
    yield* chain(all(mapcat().move_forward(TURN_MOVE_TIME)), map().wait_for_next_tick());

    yield* waitFor(2);
    yield* map().y(-1400, 1.2);

    yield* waitUntil("toomuchgrouping")
    const toomuchgroupingvideo = createRef<Video>();
    view.add(<Video ref={toomuchgroupingvideo}
        src={toomuchgroupingmp4}
        scale={1.2} radius={5}
        x={2000} lineWidth={8}
        time={2}
        stroke={"#4e345a"}
        playbackRate={1.5}
    />);
    yield* all(toomuchgroupingvideo().x(0, 1.2));
    toomuchgroupingvideo().play();

    yield* waitUntil("unexploredspace");
    yield* toomuchgroupingvideo().playbackRate(0.1, 1);
    toomuchgroupingvideo().pause();
    
    yield* waitUntil("toomuchgrouping_away");
    yield* toomuchgroupingvideo().x(-2000, 1.2);

    
    yield* waitUntil("sprint2docket");
    const docketcontainer = createRef<Rect>();
    const dockettopleft = createRef<Line>();
    const docketheader = createRef<Txt>();
    const docketnode = createRef<Rect>();
    view.add(<Rect ref={docketcontainer}
        width={1600} height={800} y={-1400}
        fill={"#090909"} clip
        stroke={"#4e345a"} lineWidth={8}
    >
        <Line ref={dockettopleft}
            points={[[-800, -300], [-450, -300], [-400, -400]]}
            stroke={"#4e345a"} lineWidth={8}
        />
        <RoboticTxt ref={docketheader}
            text={"Sprint 2"}
            fill={"#a37db5"} fontSize={60}
            position={[-630, -350]}
        />
        <Node ref={docketnode} x={-300}/>
    </Rect>);
    const docketA = createRef<Rect>();
    const docketAtext = createRef<Txt>();
    const docketAoutcome = createRef<Txt>();
    const docketB = createRef<Rect>();
    const docketBtext = createRef<Txt>();
    const docketBoutcome = createRef<Txt>();
    const docketLineA = createRef<Line>();
    const docketLineB = createRef<Line>();

    const docketC = createRef<Rect>();
    const docketCtext = createRef<Txt>();
    const docketCoutcome = createRef<Txt>();
    const docketD = createRef<Rect>();
    const docketDtext = createRef<Txt>();
    const docketDoutcome = createRef<Txt>();
    const docketLineC = createRef<Line>();
    const docketLineD = createRef<Line>();

    const docketE = createRef<Rect>();
    const docketEtext = createRef<Txt>();
    const docketEoutcome = createRef<Txt>();
    const docketF = createRef<Rect>();
    const docketFtext = createRef<Txt>();
    const docketFoutcome = createRef<Txt>();
    const docketLineE = createRef<Line>();
    const docketLineF = createRef<Line>();
    const docketG = createRef<Rect>();
    const docketGtext = createRef<Txt>();
    const docketGoutcome = createRef<Txt>();
    docketnode().add(<>
        <Rect ref={docketA}
            layout direction={"row"} alignItems={"center"}
            width={0} y={-100} scale={0}
            padding={20} gap={20}
            fill={"#111111"}
            lineWidth={8} stroke={"#2B2B2B"}
        >
            <MonoTxt ref={docketAtext}
                // text={"OurLuckyDay"}
                textAlign={"center"} width={350}
                fill={"#B56985"}
            />
            <Line points={[[0, -40], [0, 40]]} lineWidth={4} stroke={"#2b2b2b"} />
            <MonoTxt ref={docketAoutcome}
                text={"1"} paddingLeft={20}
                textAlign={"center"} scale={0}
                fill={"#b57469"}
            />
        </Rect>
        <Rect ref={docketB}
            layout direction={"row"} alignItems={"center"}
            width={0} y={100} scale={0}
            padding={20} gap={20}
            fill={"#111111"}
            lineWidth={8} stroke={"#2B2B2B"}
        >
            <MonoTxt ref={docketBtext}
                // text={"Mushakraj"}
                textAlign={"center"} width={350}
                fill={"#BE9F86"}
            />
            <Line points={[[0, -40], [0, 40]]} lineWidth={4} stroke={"#2b2b2b"} />
            <MonoTxt ref={docketBoutcome}
                text={"4"} paddingLeft={20}
                textAlign={"center"} scale={0}
                fill={"#6db569"}
            />
        </Rect>
        <Rect ref={docketC}
            layout direction={"row"} alignItems={"center"}
            width={500} x={700} scale={0}
            padding={20} gap={20}
            fill={"#111111"}
            lineWidth={8} stroke={"#2B2B2B"}
        >
            <MonoTxt ref={docketCtext}
                // text={"Mushakraj"}
                textAlign={"center"} width={350}
                fill={"#fff"}
            />
            <Line points={[[0, -40], [0, 40]]} lineWidth={4} stroke={"#2b2b2b"}/>
            <MonoTxt ref={docketCoutcome}
                text={"4"} paddingLeft={20}
                textAlign={"center"} scale={0}
                fill={"#6db569"}
            />
        </Rect>
        <Rect ref={docketD}
            layout direction={"row"} alignItems={"center"}
            width={500} x={700} y={-200} scale={0}
            padding={20} gap={20}
            fill={"#111111"}
            lineWidth={8} stroke={"#2B2B2B"}
        >
            <MonoTxt ref={docketDtext}
                // text={"Mushakraj"}
                fontSize={44}
                textAlign={"center"} width={350}
                fill={"#B56985"}
            />
            <Line points={[[0, -40], [0, 40]]} lineWidth={4} stroke={"#2b2b2b"}/>
            <MonoTxt ref={docketDoutcome}
                text={"1"} paddingLeft={20}
                textAlign={"center"} scale={0}
                fill={"#b57469"}
            />
        </Rect>
        <Rect ref={docketE}
            layout direction={"row"} alignItems={"center"}
            width={500} x={1500} y={-100} scale={0}
            padding={20} gap={20}
            fill={"#111111"}
            lineWidth={8} stroke={"#2B2B2B"}
        >
            <MonoTxt ref={docketEtext}
                // text={"Mushakraj"}
                textAlign={"center"} width={350}
                fill={"#fff"}
            />
            <Line points={[[0, -40], [0, 40]]} lineWidth={4} stroke={"#2b2b2b"}/>
            <MonoTxt ref={docketEoutcome}
                text={"0"} paddingLeft={20}
                textAlign={"center"} scale={0}
                fill={"#b57469"}
            />
        </Rect>
        <Rect ref={docketF}
            layout direction={"row"} alignItems={"center"}
            width={500} x={1500} y={100} scale={0}
            padding={20} gap={20}
            fill={"#111111"}
            lineWidth={8} stroke={"#2B2B2B"}
        >
            <MonoTxt ref={docketFtext}
                // text={"Mushakraj"}
                textAlign={"center"} width={350}
                fill={"#BE9F86"}
            />
            <Line points={[[0, -40], [0, 40]]} lineWidth={4} stroke={"#2b2b2b"}/>
            <MonoTxt ref={docketFoutcome}
                text={"5"} paddingLeft={20}
                textAlign={"center"} scale={0}
                fill={"#6db569"}
            />
        </Rect>
        <Rect ref={docketG}
            layout direction={"row"} alignItems={"center"}
            width={500} x={2300} y={0} scale={0}
            padding={20} gap={20}
            fill={"#111111"}
            lineWidth={8} stroke={"#2B2B2B"}
        >
            <MonoTxt ref={docketGtext}
                // text={"Mushakraj"}
                textAlign={"center"} width={350}
                fill={"#fff"}
            />
            <Line points={[[0, -40], [0, 40]]} lineWidth={4} stroke={"#2b2b2b"}/>
            <MonoTxt ref={docketGoutcome}
                text={"4"} paddingLeft={20}
                textAlign={"center"} scale={0}
                fill={"#6db569"}
            />
        </Rect>
    </>);
    docketnode().add(<>
        <Line ref={docketLineA}
            points={get_rect_tournament_line(docketA(), docketC())}
            radius={8}
            end={0}
            lineWidth={6} stroke={"#2b2b2b"}
        />
        <Line ref={docketLineB}
            points={get_rect_tournament_line(docketB(), docketC())}
            radius={8}
            end={0}
            lineWidth={6} stroke={"#2b2b2b"}
        />
        <Line ref={docketLineD}
            points={get_rect_tournament_line(docketD(), docketE())}
            radius={8}
            end={0}
            lineWidth={6} stroke={"#2b2b2b"}
        />
        <Line ref={docketLineC}
            points={get_rect_tournament_line(docketC(), docketE())}
            radius={8}
            end={0}
            lineWidth={6} stroke={"#2b2b2b"}
        />
        <Line ref={docketLineE}
            points={get_rect_tournament_line(docketE(), docketG())}
            radius={8}
            end={0}
            lineWidth={6} stroke={"#2b2b2b"}
        />
        <Line ref={docketLineF}
            points={get_rect_tournament_line(docketF(), docketG())}
            radius={8}
            end={0}
            lineWidth={6} stroke={"#2b2b2b"}
        />
    </>);
    yield* docketcontainer().y(0, 1.2);
    yield* sequence(0.2, all(docketB().width(500, 0.8), docketB().scale(1, 0.4)), all(docketA().width(500, 0.8), docketA().scale(1, 0.4)));
    yield* sequence(0.2, all(docketLineA().end(1, 0.5), docketLineB().end(1, 0.5)), all(docketC().width(500, 0.8), docketC().scale(1, 0.4)));
    yield* sequence(0.1, docketBtext().text("Mushakraj", 0.8), docketCtext().text("???", 0.8));
    yield* waitFor(0.5);
    yield* docketAtext().text("OurLuckyDay", 0.8);
    yield* waitFor(0.5);


    yield* waitUntil("notdoingsowell")
    const notdoingsowellvideo = createRef<Video>();
    view.add(<Video ref={notdoingsowellvideo}
        src={notdoingwellmp4}
        scale={1.2} radius={5}
        x={2000} lineWidth={8}
        time={2}
        stroke={"#4e345a"}
        playbackRate={2}
    />);
    yield* all(docketcontainer().x(-2000, 1.2), notdoingsowellvideo().x(0, 1.2));
    notdoingsowellvideo().play();
    
    yield* waitUntil("notdoingsowell_away");
    docketcontainer().x(2000);
    yield* all(docketcontainer().x(0, 1.2), notdoingsowellvideo().x(-2000, 1.2));
    yield* sequence(0.1, docketAoutcome().scale(1, 0.5), docketBoutcome().scale(1, 0.5));
    yield* sequence(0.2, docketB().stroke("#6db569", 0.5), docketLineB().stroke("#6db569", 0.5));
    yield* all(
        docketnode().x(docketnode().x() - 800, 1.2), docketnode().y(docketnode().y() + 100, 1.2), all(docketD().width(500, 0.8), docketD().scale(1, 0.4)),
        sequence(0.2, all(docketLineC().end(1, 0.5), docketLineD().end(1, 0.5)), all(docketE().width(500, 0.8), docketE().scale(1, 0.4))),
        sequence(0.1, docketCtext().text("Mushakraj", 0.8), docketCtext().fill("#BE9F86", 0.4), docketEtext().text("???", 0.8))
    );
    yield* docketDtext().text("Rat's Dilemma", 0.8);

    yield* waitUntil("purerush")
    const purerushvideo = createRef<Video>();
    view.add(<Video ref={purerushvideo}
        src={purerushmp4}
        scale={1.2} radius={5}
        x={2000} lineWidth={8}
        time={2}
        stroke={"#4e345a"}
        playbackRate={1.5}
    />);
    yield* all(docketcontainer().x(-2000, 1.2), purerushvideo().x(0, 1.2));
    purerushvideo().play();

    yield* waitUntil("purerush_away");
    docketcontainer().x(2000)
    yield* all(purerushvideo().x(-2000, 1.2), docketcontainer().x(0, 1.2));


    yield* sequence(0.1, docketCoutcome().scale(1, 0.5), docketDoutcome().scale(1, 0.5));
    yield* sequence(0.2, docketC().stroke("#6db569", 0.5), docketLineC().stroke("#6db569", 0.5));
    yield* all(
        docketnode().x(docketnode().x() - 800, 1.2), docketnode().y(docketnode().y() - 100, 1.2), all(docketF().width(500, 0.8), docketF().scale(1, 0.4)),
        sequence(0.2, all(docketLineE().end(1, 0.5), docketLineF().end(1, 0.5)), all(docketG().width(500, 0.8), docketG().scale(1, 0.4))),
        sequence(0.1, docketEtext().text("Mushakraj", 0.8), docketEtext().fill("#B56985", 0.4), docketGtext().text("???", 0.8))
    );
    yield* waitFor(1);
    yield* docketFtext().text("muscallonge", 0.8);

    yield* waitUntil("yikes")
    const yikesvideo = createRef<Video>();
    view.add(<Video ref={yikesvideo}
        src={yikesmp4}
        scale={1.2} radius={5}
        x={2000} lineWidth={8}
        time={2}
        stroke={"#4e345a"}
        playbackRate={1.5}
    />);
    yield* all(docketcontainer().x(-2000, 1.2), yikesvideo().x(0, 1.2));
    yikesvideo().play();

    yield* waitUntil("yikes_away");
    docketcontainer().x(2000)
    yield* all(yikesvideo().x(-2000, 1.2), docketcontainer().x(0, 1.2));

    yield* sequence(0.1, docketEoutcome().scale(1, 0.5), docketFoutcome().scale(1, 0.5));
    yield* sequence(0.2, docketF().stroke("#6db569", 0.5), docketLineF().stroke("#6db569", 0.5));
    yield* all(
        sequence(0.1, docketGtext().text("muscallonge", 0.8), docketGtext().fill("#fff", 0.4))
    );
    yield* waitFor(1);
    yield* docketFtext().text("muscallonge", 0.8);


    yield* waitUntil("lastshot");
    yield* docketcontainer().y(1800, 1.2);

    yield* waitUntil("kingexplanation");
    const kingrat = createRef<BattlecodeBot>();
    const comborats = createRefArray<BattlecodeBot>();
    const promomap = createRef<BattlecodeMap>();
    view.add(<>
        <BattlecodeMap
            ref={promomap}
            x={0} y={1200} faded_bounds={false}
            map_bounds={[7, 7]}
            tile_size={120} tile_gap={12}
            radius={3} show_pct={1}
            base_colors={static_map.map(t => TileTypeInfo[t].color)}
        ></BattlecodeMap>
    </>);
    yield promomap().run_ticks(TURN_MOVE_TIME, TURN_WAIT_TIME);
    promomap().add(<>
        <CheddarRatKing ref={kingrat} map={promomap()} pos={new Vector2(3, 3)} dir={Origin.Left} scale={0}/>

        <CheddarBabyRat ref={comborats} map={promomap()} pos={new Vector2(-1, 3)} dir={Origin.Right}/>
        <CheddarBabyRat ref={comborats} map={promomap()} pos={new Vector2(-1, 7)} dir={Origin.TopRight}/>
        <CheddarBabyRat ref={comborats} map={promomap()} pos={new Vector2(3, 7)} dir={Origin.Top}/>
        <CheddarBabyRat ref={comborats} map={promomap()} pos={new Vector2(7, 7)} dir={Origin.TopLeft} />
        <CheddarBabyRat ref={comborats} map={promomap()} pos={new Vector2(7, 3)} dir={Origin.Left}/>
        <CheddarBabyRat ref={comborats} map={promomap()} pos={new Vector2(7, -1)} dir={Origin.BottomLeft}/>
        <CheddarBabyRat ref={comborats} map={promomap()} pos={new Vector2(3, -1)} dir={Origin.Bottom}/>
        <CheddarBabyRat ref={comborats} map={promomap()} pos={new Vector2(-1, -1)} dir={Origin.BottomRight}/>
    </>);

    yield* promomap().y(0, 1.2);

    yield* promomap().wait_for_next_tick();
    yield* chain(all(...comborats.map(t => t.move_forward(TURN_MOVE_TIME))), promomap().wait_for_next_tick());
    yield* chain(all(...comborats.map(t => t.move_forward(TURN_MOVE_TIME))), promomap().wait_for_next_tick());
    yield* chain(all(...comborats.map(t => t.move_forward(TURN_MOVE_TIME))), promomap().wait_for_next_tick());
    yield* chain(all(comborats[0].move_forward(TURN_MOVE_TIME)), promomap().wait_for_next_tick());

    yield* waitFor(2);
    yield* sequence(0.05, ...comborats.slice(1).map(t => all(t.opacity(0, 0.6), t.position(comborats[0].position(), 0.4, easeInBack))));
    yield* sequence(0.3, comborats[0].scale(0, 0.5), kingrat().scale(1, 0.5));

    yield* waitUntil("whydothis");
    const winconimg = createRef<Img>();
    view.add(<>
        <Img ref={winconimg}
            src={winconpng}
            x={2000} scale={1.8}
        />
    </>)
    yield* all(promomap().x(-1800, 1.2), winconimg().x(0, 1.2));
    
    yield* waitUntil("nomoreimg");
    yield* all(winconimg().x(-2000, 1.2));

    yield* waitUntil("squeaktohit");
    const squeakpromomap = createRef<BattlecodeMap>();
    view.add(<>
        <BattlecodeMap
            ref={squeakpromomap}
            x={0} y={1200} faded_bounds={false}
            map_bounds={[7, 7]}
            tile_size={120} tile_gap={12}
            radius={3} show_pct={1}
            base_colors={static_map.map(t => TileTypeInfo[t].color)}
        ></BattlecodeMap>
    </>);
    yield squeakpromomap().run_ticks(TURN_MOVE_TIME, TURN_WAIT_TIME);

    const squeaktocallrats = createRefArray<BattlecodeBot>();
    const callsqueak = createRef<Circle>();
    const squeakking = createRef<BattlecodeBot>();
    const locs: [number, number][] = [ [1, 7], [3, 7], [4, 8], [6, 8], [0, 8], [3, 9], [4, 10], [3, 10]];
    squeakpromomap().add(<>
        {...locs.map(l => <PlumBabyRat ref={squeaktocallrats} map={squeakpromomap()}
            pos={new Vector2(l)} dir={Origin.Top}
        />)}
        <PlumRatKing ref={squeakking} map={squeakpromomap()}
            pos={new Vector2(3, 3)} dir={Origin.Left} scale={0}
        />
    </>);
    squeaktocallrats[1].add(<Circle ref={callsqueak}
        zIndex={-1}// size={50}
        stroke={new Gradient({
            type: "radial",
            fromRadius: 0,
            toRadius: 430,
            stops: [
                { offset: 0, color: "#5437b3", },
                { offset: 1, color: "#221725", },
            ]
        })} lineWidth={30}
    />);

    yield* squeakpromomap().y(0, 1.2);
    yield* squeakpromomap().wait_for_next_tick();
    yield* chain(all(...squeaktocallrats.map(t => t.move_forward(TURN_MOVE_TIME))), squeakpromomap().wait_for_next_tick());
    yield* chain(all(...squeaktocallrats.map(t => t.move_forward(TURN_MOVE_TIME))), squeakpromomap().wait_for_next_tick());
    yield* chain(all(...squeaktocallrats.map(t => t.move_forward(TURN_MOVE_TIME))), squeakpromomap().wait_for_next_tick());
    yield* chain(all(...squeaktocallrats.map(t => t.move_forward(TURN_MOVE_TIME))), squeakpromomap().wait_for_next_tick());
    yield* all(callsqueak().size(440*2, 1.2), callsqueak().lineWidth(0, 1.8));
    yield* chain(all(
        squeaktocallrats[0].look_and_move(Origin.TopRight, TURN_MOVE_TIME),
        squeaktocallrats[2].look_and_move(Origin.Top, TURN_MOVE_TIME),
        squeaktocallrats[3].look_and_move(Origin.TopLeft, TURN_MOVE_TIME),
        squeaktocallrats[4].look_and_move(Origin.TopRight, TURN_MOVE_TIME),
        squeaktocallrats[5].look_and_move(Origin.Top, TURN_MOVE_TIME),
        squeaktocallrats[6].look_and_move(Origin.Top, TURN_MOVE_TIME),
        squeaktocallrats[7].look_and_move(Origin.Top, TURN_MOVE_TIME),
    ), squeakpromomap().wait_for_next_tick());
    yield* chain(all(
        squeaktocallrats[3].look_and_move(Origin.TopLeft, TURN_MOVE_TIME),
        squeaktocallrats[4].look_and_move(Origin.Right, TURN_MOVE_TIME),
        squeaktocallrats[6].look_and_move(Origin.Top, TURN_MOVE_TIME),
        squeaktocallrats[7].look_and_move(Origin.TopLeft, TURN_MOVE_TIME),
    ), squeakpromomap().wait_for_next_tick());

    yield* sequence(0.05, ...squeaktocallrats.filter((v, i) => i != 1).map(t => all(t.opacity(0, 0.6), t.position(comborats[0].position(), 0.4, easeInBack))));
    yield* sequence(0.3, squeaktocallrats[1].scale(0, 0.5), squeakking().scale(1, 0.5));

    yield* waitUntil("reusestate");
    const groupingvideo = createRef<Video>();
    view.add(<Video ref={groupingvideo}
        src={groupingmp4}
        scale={1.8} radius={5}
        x={1600} lineWidth={12}
        stroke={"#4e345a"}
    />);
    yield* all(squeakpromomap().x(-1600, 1.2), groupingvideo().x(0, 1.2));
    groupingvideo().play();
    
    yield* waitUntil("outpostforming");
    yield* groupingvideo().x(-1600, 1.2);
    const outpostingvideo = createRef<Video>();
    view.add(<Video ref={outpostingvideo}
        src={outpostmp4}
        radius={5} scale={1.2}
        x={1600} lineWidth={12}
        stroke={"#4e345a"}
    />);
    yield* all(groupingvideo().x(-1600, 1.2), outpostingvideo().x(0, 1.2));
    outpostingvideo().play();
    
    

    yield* waitUntil("trypromoconditions");
    yield* outpostingvideo().x(-2000, 1.2);
    const codewindow = createRef<Rect>();
    const promocondcode = createRef<Code>();
    view.add(<>
        <Rect ref={codewindow}
            layout padding={30}
            fill={"#1F1F1F"}
            lineWidth={2} stroke={"#2B2B2B"}
        >
            <Code ref={promocondcode}
                fontSize={32}
                // code={}
            />
        </Rect>
    </>);
    yield* append_to_code(promocondcode(), `\
boolean baseCondition = rcLoc.distanceSq(mineLoc) < 25 && rc.canBecomeRatKing();
boolean requiredCondition = rc.getGlobalCheese() > 1500;
boolean oneOfOptionals = rc.getGlobalCheese() > 2500 || Helpers.getCheeseTrend() > 50;

if (baseCondition && requiredCondition && oneOfOptionals) {
    rc.becomeRatKing();
}`, 2);
    yield* waitFor(0.5);
    yield* promocondcode().code.edit(1.2)`\
boolean baseCondition = ${replace("rcLoc.distanceSq(mineLoc) < 25", "navvingDone")} && rc.canBecomeRatKing();
boolean requiredCondition = rc.getGlobalCheese() > ${replace("1500", "500")};
boolean oneOfOptionals = rc.getGlobalCheese() > 2500 || Helpers.getCheeseTrend() > 50;

if (baseCondition && requiredCondition && oneOfOptionals) {
    rc.becomeRatKing();
}`;

    yield* waitFor(0.1);
    yield* promocondcode().code.edit(1.2)`\
boolean baseCondition = ${replace("navvingDone", "rcLoc.distanceSq(mineLoc) < 25")} && rc.canBecomeRatKing();
boolean requiredCondition = rc.getGlobalCheese() > 500;
boolean oneOfOptionals = rc.getGlobalCheese() > ${replace("2500", "2000")} || Helpers.getCheeseTrend() > ${replace("50", "100")};

if (baseCondition && requiredCondition && oneOfOptionals) {
    rc.becomeRatKing();
}`;

    yield* waitFor(0.1);
    yield* promocondcode().code.edit(1.2)`\
boolean baseCondition = ${replace("rcLoc.distanceSq(mineLoc) < 25", "navvingDone")} && rc.canBecomeRatKing();
boolean requiredCondition = rc.getGlobalCheese() > 500;
boolean oneOfOptionals = rc.getGlobalCheese() > ${replace("2500", "2000")} || Helpers.getCheeseTrend() > ${replace("50", "100")};

if (baseCondition && requiredCondition && oneOfOptionals) {
    rc.becomeRatKing();
}`;
    yield* promocondcode().selection(DEFAULT, 0.4);

    yield* waitFor(2);
    yield* codewindow().y(1400, 1.2)

    
    yield* waitUntil("end");
});