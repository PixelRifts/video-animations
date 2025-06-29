import { Circle, Gradient, Icon, Line, makeScene2D, Node, Rect, Txt } from "@motion-canvas/2d";
import { all, cancel, chain, createEaseOutBack, createRef, createRefArray, easeInBack, easeInBounce, easeOutBack, easeOutBounce, easeOutSine, linear, loop, loopFor, range, sequence, useRandom, Vector2, waitFor, waitUntil } from "@motion-canvas/core";
import { random_rect_point_and_dir, RoboticText, star_coords } from "../../components/defaults";
import { cosmic_grad, cosmic_grad_ramps } from "../../components/palette";


export default makeScene2D(function* (view) {
    const comps_are_fast_refs = createRefArray<Txt>();
    const scrolling_ref = createRef<Node>();
    const nyooom_ref = createRef<Txt>();
    const computer_icon_ref = createRef<Icon>();
    view.add(<>
        <RoboticText
            ref={comps_are_fast_refs}
            text={"COMPUTERS"}
            position={[-200, -275]}
            skewX={-10} opacity={0}
            fontSize={400}
            fill={cosmic_grad_ramps[1][0]}
        />
        <RoboticText
            ref={comps_are_fast_refs}
            text={"ARE"}
            position={[0, 25]}
            skewX={-10} opacity={0}
            fontSize={500}
            fill={cosmic_grad_ramps[1][1]}
        />
        <RoboticText
            ref={comps_are_fast_refs}
            text={"FAST"}
            position={[500, 350]}
            skewX={-10} opacity={0}
            fontSize={500}
            fill={cosmic_grad_ramps[1][3]}
        />
        <Node ref={scrolling_ref} x={100}>
            <Icon
                ref={computer_icon_ref}
                icon={"icon-park-outline:cpu"}
                position={[1500, 25]}
                skewX={20} size={800}
                compositeOperation={"difference"}
            />
            <RoboticText
                ref={nyooom_ref}
                text={"NYOOOOOOOOM"}
                position={[3800, 25]}
                fontSize={600}
                fontStyle={""}
                skewX={18}
                // lineWidth={20}
                fill={"white"}
                compositeOperation={"difference"}
            />
        </Node>
    </>);
    yield* waitUntil("start_show")
    yield* sequence(0.7, ...comps_are_fast_refs.map(t => t.opacity(1, 0)));

    yield* waitUntil("nyoom_past");
    yield* all(scrolling_ref().x(-7000, 1.2, linear));
    yield* waitFor(0.2);
    yield* sequence(0.1, ...comps_are_fast_refs.reverse().map(t => t.opacity(0, 0.1)));

    yield* waitUntil("literal_magic");
    view.add(<>
        <Icon
            ref={computer_icon_ref}
            icon={"icon-park-outline:cpu"}
            position={[0, 1200]}
            skewX={20} size={1000}
            color={"white"}
        />
    </>
    );
    yield* all(
        computer_icon_ref().skew([0,0], 0.4, createEaseOutBack(2)),
        computer_icon_ref().size(500, 0.8, createEaseOutBack(2)),
        computer_icon_ref().y(-100, 0.8, createEaseOutBack(2))
    );
    

    yield* waitUntil("timeline");
    const timeline = createRef<Node>();
    const timeline_main_line = createRef<Line>();
    const timeline_line_years = createRefArray<Line>();
    const timeline_line_thinner_years = createRefArray<Line>();
    const timeline_line_year_labels = createRefArray<Line>();
    const plink_main = createRef<Circle>();
    const plink_highlight = createRef<Circle>();


    const timeline_labels = createRefArray<Node>();
    const timeline_label_enclosers = createRefArray<Line>();
    const timeline_label_pointers = createRefArray<Line>();
    const timeline_label_texts = createRefArray<Txt>();
    const timeline_label_data = [
        { year: 1936, feat: "Turing Machine", len: 320, off: 0 },
        { year: 1945, feat: "ENIAC", len: 175, off: 0 },
        { year: 1958, feat: "Transistor-Based", len: 350, off: -60 },
        { year: 1962, feat: "Pipelining", len: 240, off: -100 },
        { year: 1963, feat: "Scoreboard", len: 260, off: -22 },
        { year: 1967, feat: "Tomasulo's Algorithm", len: 430, off: -60 },
        { year: 1970, feat: "Caches", len: 200, off: -60 },
        { year: 1975, feat: "SIMD", len: 160, off: -40 },
        { year: 1980, feat: "Branch Prediction", len: 360, off: -30 },
        { year: 1985, feat: "Superscalar", len: 280, off: -20 },
        { year: 1995, feat: "Modern OoO", len: 260, off: -10 },
        { year: 2000, feat: "Hyperpipelining", len: 320, off: 0 },
    ];

    const timeline_tag_pad = 50;
    const timeline_tag_count = 20;
    const timeline_len = 4000;
    const timeline_segment_size = ((timeline_len-2*timeline_tag_pad) / timeline_tag_count);
    view.add(<>
        <Node ref={timeline} x={-3400} y={300}>
            <Line
                ref={timeline_main_line}
                points={[[-timeline_len/2, 0], [timeline_len/2, 0]]}
                endArrow startArrow
                lineWidth={10} lineCap={"round"}
                stroke={"white"}
            />
            {range(timeline_tag_count+1).map(i => <Line
                ref={timeline_line_years}
                points={[[0, 0], [0, -50]]}
                x={-(timeline_len/2) + timeline_tag_pad + (timeline_segment_size * i)}
                lineWidth={10} lineCap={"round"}
                stroke={"white"}
            />)}
            {range((timeline_tag_count) * 4).map(i => <Line
                ref={timeline_line_thinner_years}
                points={[[0, 0], [0, -35]]}
                x={-(timeline_len/2) + timeline_tag_pad +
                    timeline_segment_size * Math.floor(i/4) +
                    (timeline_segment_size/5) * ((i%4)+1)}
                lineWidth={10} lineCap={"round"}
                stroke={"#FFFFFF77"}
            />)}
            {range(timeline_tag_count+1).map(i => <RoboticText
                ref={timeline_line_year_labels}
                x={-(timeline_len/2) + timeline_tag_pad + (timeline_segment_size * i)-30}
                y={70} fontSize={50} rotation={-45}
                text={`${1925 + i*5}`}
                fill={"white"}
            />)}
            
            <Node>
                {timeline_label_data.map((t, i) => <Node ref={timeline_labels} zIndex={10}>
                    <Line
                        ref={timeline_label_enclosers}
                        rotation={-45}
                        position={[
                            -(timeline_len/2) + timeline_tag_pad + (timeline_segment_size/5) * (t.year - 1925),
                            t.off - 150 - 20]}
                        lineWidth={8} stroke={cosmic_grad[3]} fill={"rgb(38,38,68)"}
                        points={[[0, 0], [40, 35], [t.len, 35], [t.len, -35], [40, -35]]}
                        closed
                    >
                        <RoboticText
                            ref={timeline_label_texts}
                            x={50} offset={[-1, 0]}
                            text={t.feat}
                            fill={cosmic_grad[3]} fontSize={40}
                        />
                    </Line>
                    <Line
                        ref={timeline_label_pointers}
                        position={[-(timeline_len/2) + timeline_tag_pad + (timeline_segment_size/5) * (t.year - 1925), 0]}
                        lineWidth={10} stroke={new Gradient({
                            type: "linear",
                            from: [0, (t.year % 5 == 0) ? (-60) : (-45)],
                            to: [0, t.off - 150],
                            stops: [
                                { offset: 0, color: cosmic_grad_ramps[3][2] },
                                { offset: 1, color: cosmic_grad_ramps[3][0] },
                            ]
                        })} lineCap={"round"}
                        points={[[0, (t.year % 5 == 0) ? (-70) : (-55)], [0, t.off - 150]]} lineDash={[30, 20]}
                    />
                </Node>)}
            </Node>

            <Circle
                ref={plink_main}
                position={() => timeline_line_years[timeline_tag_count].position()}
                // size={[30, 30]}
                fill={"yellow"}
            />
            <Circle
                ref={plink_highlight}
                position={() => timeline_line_years[timeline_tag_count].position()}
                // size={[30, 30]}
                lineWidth={8}
                stroke={"yellow"}
            />
        </Node>
    </>);
    const ending = yield timeline().x(1500, 10);
    const moving = yield loop(Infinity, function*() {
        yield* all(
            ...timeline_label_pointers.map(t => t.lineDashOffset(1000, 30, linear))
        );
    });
    yield* waitFor(2);
    yield* sequence(0.4,
        all(
            computer_icon_ref().size(0, 0.8, easeInBack),
            computer_icon_ref().position(() => timeline().position().add(timeline_line_years[timeline_tag_count].position()), 0.8, easeInBack),
        ),
        sequence(0.1,
            plink_highlight().size([40, 40], 0.8),
            plink_highlight().lineWidth(0, 0.8),
            plink_main().size([30, 30], 0.8),
        )
    );
    
    yield* waitUntil("70s");
    cancel(ending);
    yield* timeline().x(0, 1.2);

    yield* waitUntil("thediff");
    yield* timeline().y(1200, 0.8);
    // cancel(moving);

    // TODO INSERT THE LATER ANIMATIONS

    const view_splitter = createRef<Node>();
    const splitter_mid_line = createRef<Line>();
    const splitter_left_line = createRef<Line>();
    const splitter_right_line = createRef<Line>();
    view.add(<>
        <Node ref={view_splitter} scaleX={-1}>
            <Line
                ref={splitter_mid_line}
                points={[[80, -800], [-200, 40], [200, -40], [-80, 800]]}
                lineWidth={12} stroke={"white"} end={0}
            />
            <Line
                ref={splitter_left_line}
                x={-18} y={16}
                points={[[80, -800], [-200, 40], [200, -40], [-80, 800]]}
                lineWidth={4} stroke={"white"} end={0}
            />
            <Line
                ref={splitter_right_line}
                x={18} y={-16}
                points={[[80, -800], [-200, 40], [200, -40], [-80, 800]]}
                lineWidth={4} stroke={"white"} end={0}
            />
        </Node>
    </>);
    
    yield* sequence(0.1,
        splitter_mid_line().end(1, 0.8),
        all(
            splitter_left_line().end(1, 0.8),
            splitter_right_line().end(1, 0.8),
        )
    );

    // TODO INSERT THE LATER ANIMATIONS

    yield* waitUntil("peepotalk");
    yield* sequence(0.1,
        splitter_mid_line().start(1, 0.8),
        all(
            splitter_left_line().start(1, 0.8),
            splitter_right_line().start(1, 0.8),
        )
    );

    yield* waitUntil("theplan");
    const stage_refs = createRefArray<Rect>();
    const stage_labels = createRefArray<Txt>();
    const stage_ref_backings = createRefArray<Rect>();
    const stage_ref_frontings = createRefArray<Rect>();
    const stage_ref_big_front = createRefArray<Rect>();
    const part1_label = createRef<Txt>();

    const stage_posns: [number,number][] = [ [-700, 200], [-300, -300], [300, -300], [700, 200] ];
    const stage_lbl_strs: string[] = [ "I", "S", "P", "O" ]
    const stage_back_colors = [ "#231833ff", "#1d1a36ff", "#101b37ff", "#101c34ff" ]
    view.add(<>
        {range(4).map(i => <>
            <Rect
                ref={stage_refs}
                // size={[200, 200]}
                position={stage_posns[i]}
                // rotation={45}
                lineWidth={20}
                stroke={cosmic_grad_ramps[1][i]}
            />
            <Rect
                ref={stage_ref_backings}
                // size={[230, 230]}
                position={stage_posns[i]}
                // rotation={45}
                lineWidth={2}
                stroke={cosmic_grad_ramps[1][i]}
            />
            <Rect
                ref={stage_ref_frontings}
                // size={[170, 170]}
                position={stage_posns[i]}
                // rotation={45}
                lineWidth={2}
                stroke={cosmic_grad_ramps[1][i]}
            />
            <Rect
                ref={stage_ref_big_front}
                // size={[300, 300]}
                position={stage_posns[i]}
                // rotation={45}
                zIndex={-1}
                fill={stage_back_colors[i]}
                // fill={cosmic_grad_ramps[1][i] + "18"}
                
            />
            <RoboticText
                ref={stage_labels}
                position={[stage_posns[i][0], stage_posns[i][1] + 10]}
                fontStyle={""}
                fontSize={0}
                text={stage_lbl_strs[i]}
                fill={cosmic_grad_ramps[1][i]}
            />
        </>)}
    </>);


    const big_front_anims = [];
    const backing_anims = [];
    const fronting_anims = [];
    for (let i = 0; i < 4; i++) {
        yield sequence(0.1,
            sequence(0.3,
                all(
                    stage_ref_big_front[i].size([300, 300], 0.8),
                    stage_ref_big_front[i].rotation(45, 0.8)
                ),
                (big_front_anims[i] = loopFor(Infinity, function* () { yield* stage_ref_big_front[i].rotation(stage_ref_big_front[i].rotation() + 180, 5, linear) }))
            ),
            sequence(0.3,
                all(
                    stage_ref_backings [i].size([230, 230], 0.8),
                    stage_ref_backings [i].rotation(-45, 0.8),
                ),
                (backing_anims[i] = loopFor(Infinity, function* () { yield* stage_ref_backings[i].rotation(stage_ref_backings[i].rotation() - 180, 5, linear) }))
            ),
            all(
                stage_refs         [i].size([200, 200], 0.8),
                stage_refs         [i].rotation(45, 0.8),
                stage_labels       [i].fontSize(150, 0.8)
            ),
            sequence(0.3,
                all(
                    stage_ref_frontings[i].size([170, 170], 0.8),
                    stage_ref_frontings[i].rotation(45, 0.8),
                ),
                (fronting_anims[i] = loopFor(Infinity, function* () { yield* stage_ref_frontings[i].rotation(stage_ref_frontings[i].rotation() + 180, 5, linear) }))
            ),

        );
        yield* waitFor(1.2);
    }

    yield* waitUntil("theplacetostart");
    stage_ref_big_front[0].zIndex(4);
    stage_ref_backings[0].zIndex(5);
    stage_ref_frontings[0].zIndex(5);
    stage_labels[0].zIndex(5);
    stage_refs[0].zIndex(5);
    view.add(
        <RoboticText
            ref={part1_label}
            fontSize={100}
            fill={"white"}
            fontStyle={""}
            position={[-369, -127]}
            // text={"Part I"}
            zIndex={5}
        />)
    yield* sequence(0.8,
        sequence(0.1,
            stage_refs[0].rotation(45, 1.2),
            stage_refs[0].size([4000, 4000], 1.2),
            stage_ref_frontings[0].size([4000, 4000], 1.2),
            stage_ref_backings[0].size([4000, 4000], 1.2),
            stage_ref_big_front[0].size([4000, 4000], 1.2),
        ),
        sequence(0.4,
            stage_labels[0].position([0, 0], 0.8),
            stage_labels[0].text("The Initial Model", 0.8),
            part1_label().text("Part I", 0.8)
        )
    );

    yield* waitUntil("end");
    yield* sequence(0.05,
        part1_label().y(part1_label().y() - 800, 0.8),
        stage_labels[0].y(stage_labels[0].y() - 800, 0.8),
    );
});
