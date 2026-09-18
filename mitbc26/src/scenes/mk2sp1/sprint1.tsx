import { Circle, Img, Layout, Line, Node, Rect, Txt, Video, makeScene2D } from "@motion-canvas/2d";
import { all, createRef, createRefArray, createSignal, easeOutBack, linear, loop, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { RoboticTxt } from "../../components/helpers";

import howdthathappenpng from "../../video/howdthathappen.png";
import ripperoniesmp4 from "../../video/ripperonies.mp4";
import sprint1mp4 from "../../video/sprint1.mp4";
import whydidwewinmp4 from "../../video/whydidwewin.mp4";
import websitemp4 from "../../video/website.mp4";

export default makeScene2D(function* (view) {
    const time = createSignal(0);
    yield loop(Infinity, () => time(time() + 10, 10, linear));

    const calendarbox = createRef<Rect>();
    const calendar = createRef<Rect>();
    const calendar_rows = createRefArray<Rect>();
    const calendar_blocks = createRefArray<Rect>();
    const calendar_labels = createRefArray<Txt>();
    const calendar_highlight = createRef<Node>();
    const calendar_highlight_rows = createRefArray<Rect>();
    const caltxtvals = [
        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        ["", "", "", "", "1", "2", "3"],
        ["4", "5", "6", "7", "8", "9", "10"],
        ["11", "12", "13", "14", "15", "16", "17"],
        ["18", "19", "20", "21", "22", "23", "24"],
        ["25", "26", "27", "28", "29", "30", "31"],
    ]
    const calpalette = ["#C3B7C4", "#C2536D"]
    const calpalettevals = [
        [1, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0],
    ]
    view.add(<Rect ref={calendarbox}></Rect>);
    calendarbox().add(
        <Rect ref={calendar}
            fill={"#100a0b"}
            stroke={"#533E59"} lineWidth={8}
            radius={5} scale={0}
            layout direction={"column"}
            padding={5}
        // justifyContent={"space-evenly"}
        >
            {...range(6).map(i => <Rect ref={calendar_rows}
                fill={"#100a0b"} zIndex={-i}
                stroke={i == 0 ? "#533E59" : "#2F2133"} lineWidth={8}
                height={i == 0 ? 80 : 100}
                layout direction={"row"}
            >
                {...range(7).map(d => <Rect ref={calendar_blocks}
                    fill={"#100a0b"}
                    // stroke={i == 0 ? "#533E59" : "#2F2133"} lineWidth={4}
                    width={100} height={"100%"}
                    layout justifyContent={"center"}
                    textAlign={"center"} alignItems={"center"}
                >
                    <RoboticTxt ref={calendar_labels}
                        fill={calpalette[calpalettevals[i][d]]}
                        text={`${caltxtvals[i][d]}`} scale={0}
                        fontSize={i == 0 ? 30 : 40}
                    />
                </Rect>)}
            </Rect>)}
        </Rect>);
    calendarbox().add(
        <Node ref={calendar_highlight}>
            {...range(4).map(i => <Rect ref={calendar_highlight_rows}
                position={[i == 0 ? 65 : 0, -85 + 140 * i]}
                size={[0, 100]}
                fill={"#C9C85F28"}
            />)}
        </Node>);

    yield* waitUntil("showcalendar");
    yield* calendar().scale(1.4, 0.8);
    yield* sequence(0.01, ...calendar_labels.map((t, i) => t.scale(1, 0.6, easeOutBack)))

    yield* waitUntil("highlightduration");
    yield* sequence(0.1, ...calendar_highlight_rows.map((t, i) => t.width(i == 0 ? 820 : 950, 0.5)));

    yield* waitUntil("highlighttourneys");
    const colordiff = [22, 29, 34, 36, 37, 41];
    yield* sequence(0.1, ...colordiff.map(t => sequence(0.4,
        calendar_labels[t].scale(1.4, 0.8),
        calendar_labels[t].fill("#CC922F", 0.8),
    )));

    yield* waitUntil("eligibility");
    yield* sequence(0.1, ...colordiff.map((t, i) => sequence(0.4,
        calendar_labels[t].fill(i < 3 ? "#73CC2F" : "#C4BAB3", 0.8),
        calendar_labels[t].scale(i < 3 ? 1.4 : 1, 0.8),
    )));

    yield* waitUntil("labeltourneys");
    const highlightcircles = createRefArray<Circle>();
    const highlightlegs = createRefArray<Line>();
    const highlighttxts = createRefArray<Txt>();
    calendarbox().add(<>
        <Circle ref={highlightcircles}
            lineWidth={10} stroke={"#649e26"}
            position={[-200 * 1.4, 55]} // size={140}
            lineDash={[199.911485, 20]} lineDashOffset={() => time() * 200}
        />
        <Line ref={highlightlegs}
            lineWidth={10} stroke={"#4a751d"}
            points={[[(-200 - 50) * 1.4, 20], [(-200 - 50 - 50) * 1.4, -12], [-400 * 1.4, -12]]}
            lineDash={[199.911485, 20]} lineDashOffset={() => -time() * 200}
            end={0}
        />
        <RoboticTxt ref={highlighttxts}
            x={-740} y={-10} fontSize={72}
            // text={"Sprint 1"}
            fill={"#2bbd68"}
        />
        <Circle ref={highlightcircles}
            lineWidth={10} stroke={"#649e26"}
            position={[-200 * 1.4, 195]} // size={140}
            lineDash={[199.911485, 20]} lineDashOffset={() => time() * 200}
        />
        <Line ref={highlightlegs}
            lineWidth={10} stroke={"#4a751d"}
            points={[[(-200 - 50) * 1.4, 195 + 35], [(-200 - 50 - 50) * 1.4, 195 + 67], [-400 * 1.4, 195 + 67]]}
            lineDash={[199.911485, 20]} lineDashOffset={() => -time() * 200}
            end={0}
        />
        <RoboticTxt ref={highlighttxts}
            x={-740} y={260} fontSize={72}
            // text={"Sprint 2"}
            fill={"#2bbd68"}
        />
        <Circle ref={highlightcircles}
            lineWidth={10} stroke={"#649e26"}
            position={[300 * 1.4, 195]} // size={140}
            lineDash={[199.911485, 20]} lineDashOffset={() => time() * 200}
        />
        <Line ref={highlightlegs}
            lineWidth={10} stroke={"#4a751d"}
            points={[[(300 + 50) * 1.4, 195 + 35], [(300 + 50 + 50) * 1.4, 195 + 67], [450 * 1.4, 195 + 67]]}
            lineDash={[199.911485, 20]} lineDashOffset={() => -time() * 200}
            end={0}
        />
        <RoboticTxt ref={highlighttxts}
            x={780} y={260} fontSize={72}
            // text={"Quals"}
            fill={"#2bbd68"}
        />
    </>);
    yield* sequence(1, ...range(3).map(i => sequence(0.3,
        highlightcircles[i].size(140, 0.5),
        highlightlegs[i].end(1, 0.5),
        highlighttxts[i].text(["Sprint 1", "Sprint 2", "Quals"][i], 0.5),
    )));

    yield* waitUntil("uploadbot");
    yield* calendarbox().x(2000, 1.2);

    yield* waitUntil("wbsite");
    const websitevideo = createRef<Video>();
    yield view.add(<Video ref={websitevideo}
        src={websitemp4}
        scale={1} radius={5}
        x={2000} lineWidth={8}
        stroke={"#4e345a"}
        playbackRate={1}
        time={4}
    />);
    yield* all(websitevideo().x(0, 1.2));
    websitevideo().play();
    
    yield* waitUntil("websiteover");
    yield* websitevideo().x(-2000, 1.2);
    
    yield* waitUntil("howdthathappen");

    const howdthathappenimg = createRef<Img>();
    view.add(<Img ref={howdthathappenimg}
        src={howdthathappenpng}
        scale={1.2}
        x={-300} y={-2000} // lineWidth={8}
        // stroke={"#4e345a"} 
        zIndex={2} shadowOffset={[10, 10]}
        shadowColor={"#000"}
    />);
    yield* howdthathappenimg().y(-450, 1.2, easeOutBack);
    const ripperoniesvideo = createRef<Video>();
    view.add(<Video ref={ripperoniesvideo}
        src={ripperoniesmp4}
        scale={1.2} radius={5}
        y={2000} lineWidth={8}
        stroke={"#4e345a"}
        playbackRate={1.2}
    />);
    yield* all(ripperoniesvideo().y(0, 1.2));
    ripperoniesvideo().play();

    yield* waitUntil("nomoresadness");
    yield* all(howdthathappenimg().y(-1000, 1.2), ripperoniesvideo().y(-2000, 1.2));

    yield* waitUntil("sprint1hell");
    const sprint1video = createRef<Video>();
    view.add(<Video ref={sprint1video}
        src={sprint1mp4}
        scale={1.2} radius={5}
        y={2000} lineWidth={8}
        stroke={"#4e345a"}
        playbackRate={1.2}
    />);
    yield* all(sprint1video().y(0, 1.2));
    sprint1video().play();

    yield* waitUntil("nomorehell");
    yield* all(sprint1video().y(-2000, 1.2));

    yield* waitUntil("whydidwewinfrtho");
    const whydidwewinvideo = createRef<Video>();
    view.add(<Video ref={whydidwewinvideo}
        src={whydidwewinmp4}
        scale={1.2} radius={5}
        y={2000} lineWidth={8}
        stroke={"#4e345a"}
        playbackRate={1.2}
    />);
    yield* all(whydidwewinvideo().y(0, 1.2));
    whydidwewinvideo().play();

    yield* waitUntil("wellneverknow");
    yield* all(whydidwewinvideo().y(-2000, 1.2));

    yield* waitUntil("end");
});