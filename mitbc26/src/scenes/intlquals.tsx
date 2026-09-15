import { Line, Node, Rect, Txt, Video, makeScene2D } from "@motion-canvas/2d";
import { all, createRef, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { RoboticTxt } from "../components/helpers";
import { bracket_data, add_bracket, grow_in, pop_in, reveal_name, create_bracket_player } from "../components/tournament";

import intlmatch1mp4 from "../video/intlmatch1.mp4";
import damnthatsucksmp4 from "../video/damnthatsucks.mp4";
import racletteBetterStratmp4 from "../video/racletteBetterStrat.mp4";
import racletteQuestionablemp4 from "../video/racletteQuestionable.mp4";
import KKRushDefencemp4 from "../video/KKRushDefence.mp4";
import HomelessCookedmp4 from "../video/HomelessCooked.mp4";
import HomelessPathfindingmp4 from "../video/HomelessPathfinding.mp4";

export default makeScene2D(function* (view) {

    const our_run: bracket_data = {
        top: { name: 'cattleboat', score: '5', won: false, x: 0, y: -100 },
        bottom: { name: 'Mushakraj', score: '0', won: true, x: 0, y: 100 },
        first_result_pos: [700, 0],
        rounds: [
            { opponent: { name: 'Raclette', score: '0', won: false, x: 700, y: -200, side: 'top', font_size: 44 }, self_score: '5', result_pos: [1500, -100], advance: "self" },
            { opponent: { name: 'Kryssinyy korol', score: '0', won: false, x: 1500, y: 100, side: 'bottom', font_size: 38 }, self_score: '5', result_pos: [2300, 0], advance: "self" },
            { opponent: { name: 'Homeless', score: '5', won: true, x: 2300, y: 200, side: 'bottom' }, self_score: '0', result_pos: [3000, 100], advance: "opponent" },
        ],
    };

    yield* waitUntil('intlqualsdocket');
    const docket_container = createRef<Rect>();
    const docket_top_left = createRef<Line>();
    const docket_header = createRef<Txt>();
    const docket_node = createRef<Node>();
    view.add(
        <Rect ref={docket_container} width={1600} height={800} y={-1400} fill={'#090909'} clip stroke={'#4e345a'} lineWidth={8}>
            <Line ref={docket_top_left} points={[[-800, -300], [-450, -300], [-400, -400]]} stroke={'#4e345a'} lineWidth={8} />
            <RoboticTxt ref={docket_header} text={'Intl Quals'} fill={'#a37db5'} fontSize={60} position={[-620, -350]} />
            <Node ref={docket_node} x={-300} />
        </Rect>,
    );

    yield* docket_container().y(0, 1.2);

    const bracket = create_bracket_player(docket_node(), our_run);
    yield* bracket.next_round();
    
    yield* waitUntil("intlmatch1")
    const intlmatch1video = createRef<Video>();
    yield view.add(<Video ref={intlmatch1video}
        src={intlmatch1mp4}
        scale={1.2} radius={5}
        x={2000} lineWidth={8}
        stroke={"#4e345a"}
        playbackRate={1.5}
    />);
    yield* all(docket_container().x(-2000, 1.2), intlmatch1video().x(0, 1.2));
    intlmatch1video().play();
    
    yield* waitUntil("catploughedthrough");
    yield* intlmatch1video().playbackRate(1, 1);
    intlmatch1video().pause();
    
    const damnthatsucksvideo = createRef<Video>();
    yield view.add(<Video ref={damnthatsucksvideo}
        src={damnthatsucksmp4}
        scale={1.35} radius={5}
        x={2000} lineWidth={8}
        stroke={"#4e345a"}
        playbackRate={1.5}
    />);
    yield* all(intlmatch1video().x(-2000, 1.2), damnthatsucksvideo().x(0, 1.2));
    damnthatsucksvideo().play();
    
    yield* waitUntil("sucksvideodone");
    yield* damnthatsucksvideo().playbackRate(1, 1);
    damnthatsucksvideo().pause();
    
    yield* waitUntil("thisisntover");
    yield* all(damnthatsucksvideo().x(2000, 1.2));
    yield* waitUntil("losersbracket");
    yield* all(docket_container().x(0, 1.2));
    yield* bracket.reveal_winner();
    yield* bracket.next_round();
    //damnthatsucksmp4

    
    yield* waitUntil("racletteMatch1")
    const racletteBetterStratvideo = createRef<Video>();
    yield view.add(<Video ref={racletteBetterStratvideo}
        src={racletteBetterStratmp4}
        scale={1.3} radius={5}
        x={2000} lineWidth={8}
        stroke={"#4e345a"}
        playbackRate={1.5}
    />);
    yield* all(docket_container().x(-2000, 1.2), racletteBetterStratvideo().x(0, 1.2));
    racletteBetterStratvideo().play();
    
    yield* waitUntil("raclettematch1done");
    yield* racletteBetterStratvideo().playbackRate(1, 1);
    racletteBetterStratvideo().pause();
    
    yield* waitUntil("racletteMatch2")
    const racletteQuestionablevideo = createRef<Video>();
    yield view.add(<Video ref={racletteQuestionablevideo}
        src={racletteQuestionablemp4}
        scale={1.3} radius={5}
        x={2000} lineWidth={8}
        stroke={"#4e345a"}
        playbackRate={1.5}
    />);
    yield* all(racletteBetterStratvideo().x(-2000, 1.2), racletteQuestionablevideo().x(0, 1.2));
    racletteQuestionablevideo().play();
    
    yield* waitUntil("raclettematch2done");
    yield* racletteQuestionablevideo().playbackRate(1, 1);
    racletteQuestionablevideo().pause();
    
    yield* all(docket_container().x(0, 1.2), racletteQuestionablevideo().x(2000, 1.2));
    yield* bracket.reveal_winner();
    yield* bracket.next_round();



    
    yield* waitUntil("krykorolMatch1")
    const KKRushDefencevideo = createRef<Video>();
    yield view.add(<Video ref={KKRushDefencevideo}
        src={KKRushDefencemp4}
        scale={1.2} radius={5}
        x={2000} lineWidth={8}
        stroke={"#4e345a"}
        playbackRate={1.5}
    />);
    yield* all(docket_container().x(-2000, 1.2), KKRushDefencevideo().x(0, 1.2));
    KKRushDefencevideo().play();
    
    yield* waitUntil("krykorolmatch1done");
    yield* KKRushDefencevideo().playbackRate(1, 1);
    KKRushDefencevideo().pause();
    
    yield* waitUntil("krykorolMatch2")
    yield* all(KKRushDefencevideo().x(2000, 1.2), docket_container().x(0, 1.2));
    yield* bracket.reveal_winner();
    yield* bracket.next_round();


    yield* waitUntil("HomelessMatch1")
    const HomelessCookedvideo = createRef<Video>();
    yield view.add(<Video ref={HomelessCookedvideo}
        src={HomelessCookedmp4}
        scale={1.3} radius={5}
        x={2000} lineWidth={8}
        stroke={"#4e345a"}
        playbackRate={1.5}
    />);
    yield* all(docket_container().x(-2000, 1.2), HomelessCookedvideo().x(0, 1.2));
    HomelessCookedvideo().play();
    
    yield* waitUntil("Homelessmatch1done");
    yield* HomelessCookedvideo().playbackRate(1, 1);
    HomelessCookedvideo().pause();
    
    yield* waitUntil("HomelessMatch2")
    const HomelessPathfindingvideo = createRef<Video>();
    yield view.add(<Video ref={HomelessPathfindingvideo}
        src={HomelessPathfindingmp4}
        scale={1.3} radius={5}
        x={2000} lineWidth={8}
        stroke={"#4e345a"}
        playbackRate={1.5}
    />);
    yield* all(HomelessCookedvideo().x(-2000, 1.2), HomelessPathfindingvideo().x(0, 1.2));
    HomelessPathfindingvideo().play();
    
    yield* waitUntil("Homelessmatch2done");
    yield* HomelessPathfindingvideo().playbackRate(1, 1);
    HomelessPathfindingvideo().pause();
    
    yield* all(docket_container().x(0, 1.2), HomelessPathfindingvideo().x(2000, 1.2));
    yield* bracket.reveal_winner();

    yield* waitUntil("firsttry");
    yield* docket_container().x(-2000, 1.2);

    yield* waitUntil("end");
});