import { Bezier, Circle, Code, Gradient, Icon, Img, Node, Path, Rect, Spline, Txt, makeScene2D } from "@motion-canvas/2d";
import { all, createRef, createRefArray, noop, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { MonoTxt, RoboticTxt, append_to_code, living_wire } from "../../components/helpers";

export default makeScene2D(function* (view) {
    yield* waitUntil("microstrat");
    const microset = createRef<Node>();
    const microtitle = createRef<Txt>();
    const microsubtitle = createRef<Txt>();
    const macroset = createRef<Node>();
    const macrotitle = createRef<Txt>();
    const macrosubtitle = createRef<Txt>();
    view.add(<>
        <Node ref={microset} y={-1030}>
            <RoboticTxt ref={microtitle}
                text={"Microstrategy"} fill={"#a35937"}
            />
            <RoboticTxt ref={microsubtitle}
                // text={"Turn-by-turn decisions"}
                fill={"#a34737"}
                x={-120} y={110} fontSize={60}
            />
        </Node>
        <Node ref={macroset} y={1030}>
            <RoboticTxt ref={macrotitle}
                text={"Macrostrategy"} fill={"#3c9eb4"}
            />
            <RoboticTxt ref={macrosubtitle}
                // text={"Overarching goal"}
                fill={"#3783a3"}
                x={-240} y={110} fontSize={60}
            />
        </Node>
    </>);
    yield* sequence(0.1, microset().y(0, 1.2), microtitle().fontSize(150, 1.2));
    yield* waitFor(1);
    yield* sequence(0.1, microset().y(-325, 1.2), microset().x(300, 1.2), microtitle().fontSize(130, 1.2));
    yield* sequence(0.1, macroset().y(0, 1.2), macrotitle().fontSize(150, 1.2));
    yield* waitFor(0.5);
    yield* macrosubtitle().text("Overarching goals", 1.2);
    yield* waitUntil("backtomicro")
    yield* sequence(0.1, macroset().x(-300, 1.2), macroset().y(325, 1.2), macrotitle().fontSize(130, 1.2));

    yield* sequence(0.1, microset().y(0, 1.2), microset().x(0, 1.2), microtitle().fontSize(150, 1.2));
    yield* microsubtitle().text("Turn-by-turn decisions", 1.2);
    yield* waitFor(4);
    yield* sequence(0.1, microset().y(-325, 1.2), microset().x(300, 1.2), microtitle().fontSize(130, 1.2));

    yield* waitUntil("xsquaremicro");
    yield* all(microset().x(microset().x() + 1400, 1.2), macroset().x(macroset().x() - 1400, 1.2));
    
    yield* waitUntil("heuristicbased");
    const codewindow = createRef<Rect>();
    const heucode = createRef<Code>();
    view.add(<>
        <Rect ref={codewindow}
            layout padding={30}
            fill={"#1F1F1F"}
            lineWidth={2} stroke={"#2B2B2B"}
        >
            <Code ref={heucode}
                fontSize={32}
            // code={}
            />
        </Rect>
    </>);
    yield* append_to_code(heucode(), `\
// Conciseness
Act[] possibleActions = new Act[] {
    // All Permutations of actions possible
};

Act best = null;
int score = -Infinity;
for (Act a : allActs) {
    int actScore = scoreAction(a);
    if (actScore > score) {
        best = a;
        score = actScore;
    }
}

performAction(best);`, 2);

    yield* waitUntil("individualopts");
    yield* codewindow().y(1400, 0.5);
    const iconcircles = createRefArray<Circle>();
    const icons = createRefArray<Icon>();



    const myicons: Record<string, string> = {
        "move": "tabler:arrow-move-right-filled",
        "turn": "mdi:arrow-decision-outline",
        "attack": "game-icons:triple-scratches",
        "trap": "game-icons:wolf-trap",
        "cheese": "ph:cheese",
        "transfer": "icon-park-outline:transfer-data",
        "squeak": "material-symbols:volume-up",
        "wait": "mdi:clock-outline",
    }
    const iconkeys = Object.keys(myicons);
    const iconcolors: Record<string, string[]> = {
        "move": ["#3783a3", "#0d1f26"],
        "turn": ["#3783a3", "#0d1f26"],
        "attack": ["#a34737", "#26120d"],
        "trap": ["#a34737", "#26120d"],
        "cheese": ["#a37637", "#261d0d"],
        "transfer": ["#a37637", "#261d0d"],
        "squeak": ["#7837a3", "#1d0d26"],
        "wait": ["#3783a3", "#0d1f26"],
    }

    view.add(<>
        {...iconkeys.map((t, i) => <Circle ref={iconcircles}
            lineWidth={12} stroke={iconcolors[t][0]}
            fill={iconcolors[t][1]} size={200}
            position={[-600 + i % 4 * 400, -200 + Math.floor(i / 4) * 400 + Math.sign(i * 1.2 - 4.2) * 500]}
        >
            <Icon ref={icons}
                icon={myicons[t]}
                size={150} color={iconcolors[t][0]}
            />
        </Circle>)}
    </>);
    yield* sequence(0.6,
        ...iconcircles.slice(0, 4).map(t => t.y(t.y() + 500, 0.5)),
        ...iconcircles.slice(4).map(t => t.y(t.y() - 500, 0.5)),
    );

    yield* waitUntil("compose");
    const compositionarrows = createRefArray<Spline>();
    const connections: [number, number][] = [
        [0, 1],
        [1, 0],
        [1, 5],
        [5, 1],
        [1, 2],
        [2, 1],
        [2, 6],
        [6, 2],
        [0, 2],
        [2, 0],
        [1, 3],
        [3, 1],
        [3, 2],
        [2, 3],
        [0, 5],
        [5, 0],
        [6, 5],
        [5, 6],
        [6, 7],
        [4, 0],
        [0, 4],
        [4, 7],
        [7, 4],
    ];

    const wires = connections.map(([a, b], i) =>
        living_wire(iconcircles[a], iconcircles[b], iconcircles, {
            speedA: 0.9 + i * 0.20,
            speedB: 1.4 + i * 0.26,
            amplitude: 20
        }),
    );

    view.add(<>
        {wires.map((wire, i) => (
            <Spline
                ref={compositionarrows}
                lineWidth={12}
                stroke={new Gradient({
                    type: "linear",
                    from: iconcircles[connections[i][0]].position(),
                    to: iconcircles[connections[i][1]].position(),
                    stops: [
                        { offset: 0, color: iconcircles[connections[i][0]].stroke() as unknown as string },
                        { offset: 0.15, color: iconcircles[connections[i][0]].stroke() as unknown as string },
                        { offset: 0.85, color: iconcircles[connections[i][1]].stroke() as unknown as string },
                        { offset: 1, color: iconcircles[connections[i][1]].stroke() as unknown as string },
                    ]
                })}
                smoothness={0.4}
                endArrow
                arrowSize={16}
                end={0}
                points={wire.points}
            />
        ))}
    </>);

    yield* sequence(0.3, ...compositionarrows.map(a => a.end(1, 0.6)));

    yield* waitUntil("localminima");
    yield* all(...iconcircles.map(t => t.y(t.y() + 1400, 1.2)));

    const curve = createRef<Spline>();
    const local_dot = createRef<Circle>();
    const global_dot = createRef<Circle>();
    const local_mintext = createRef<Txt>();
    const global_mintext = createRef<Txt>();

    const local_min: [number, number] = [-350, 160];
    const global_min: [number, number] = [350, 320];
    const local_min_label: [number, number] = [-350, 160 + 50];
    const global_min_label: [number, number] = [350, 320 + 50];

    view.add(<>
        <Path
            ref={curve}
            lineWidth={8}
            stroke={'#3498db'}
            end={0}
            data={`
            M -1000 -200
            L -600 -200
            C -500 -200, -500 160, -350 160
            C -200 160, -200 -200, -100 -200
            L 100 -200
            C 200 -200, 200 320, 350 320
            C 500 320, 500 0, 600 -200
            L 1000 -200
            `}
        />

        <Circle ref={local_dot} size={20} fill={'#f1c40f'} position={local_min} scale={0} />
        <Circle ref={global_dot} size={20} fill={'#e74c3c'} position={global_min} scale={0} />
        <MonoTxt ref={local_mintext} text={"We are here"} fill={'#f1c40f'} position={local_min_label} scale={0} />
        <MonoTxt ref={global_mintext} text={"Every good team"} fill={'#e74c3c'} position={global_min_label} scale={0} />
    </>);

    yield* curve().end(1, 1.5);
    yield* all(
        local_dot().scale(1, 0.3),
        global_dot().scale(1, 0.3),
    );
    yield* waitFor(0.5);
    yield* local_mintext().scale(1, 0.5);
    yield* global_mintext().scale(1, 0.5);

    yield* waitUntil("goodbyeminimae");
    yield* sequence(0.33,
        curve().start(1, 2),
        noop(),
        all(local_dot().scale(0, 0.5), local_mintext().scale(0, 0.5)),
        all(global_dot().scale(0, 0.5), global_mintext().scale(0, 0.5)),
    );


    yield* waitUntil("end");
});