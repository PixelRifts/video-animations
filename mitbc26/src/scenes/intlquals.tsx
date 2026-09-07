import { Line, Node, Rect, Txt, Video, makeScene2D } from "@motion-canvas/2d";
import { all, createRef, sequence, waitFor, waitUntil } from "@motion-canvas/core";

import intlmatch1mp4 from "../video/intlmatch1.mp4";
import { RoboticTxt } from "../components/helpers";
import { bracket_data, add_bracket, grow_in, pop_in, reveal_name, create_bracket_player } from "../components/tournament";

export default makeScene2D(function* (view) {

    const our_run: bracket_data = {
        top: { name: 'cattleboat', score: '1', won: false, x: 0, y: -100 },
        bottom: { name: 'Mushakraj', score: '4', won: true, x: 0, y: 100 },
        first_result_pos: [700, 0],
        rounds: [
            { opponent: { name: 'Raclette', score: '1', won: false, x: 700, y: -200, side: 'top', font_size: 44 }, result_pos: [1500, -100] },
            { opponent: { name: 'Kryssinyy korol', score: '5', won: true, x: 1500, y: 100, side: 'bottom' }, result_pos: [2300, 0] },
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
    yield* bracket.next_round();
    yield* bracket.next_round();

    yield* waitUntil("intlmatch1")
    const intlmatch1video = createRef<Video>();
    view.add(<Video ref={intlmatch1video}
        src={intlmatch1mp4}
        scale={1.2} radius={5}
        x={2000} lineWidth={8}
        time={2}
        stroke={"#4e345a"}
        playbackRate={1.2}
    />);
    yield* all(intlmatch1video().x(0, 1.2));
    intlmatch1video().play();

    yield* waitUntil("catploughedthrough");
    yield* intlmatch1video().playbackRate(1, 1);
    intlmatch1video().pause();

    yield* waitUntil("end");
});