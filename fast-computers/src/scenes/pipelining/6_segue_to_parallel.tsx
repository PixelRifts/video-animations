import { Gradient, Layout, Line, makeScene2D, Node, Rect, Txt } from "@motion-canvas/2d";
import { all, createRef, createRefArray, createSignal, linear, loopFor, range, sequence, useTime, waitFor, waitUntil } from "@motion-canvas/core";
import { RoboticText } from "../../components/defaults";
import { cosmic_grad_ramps } from "../../components/palette";


export default makeScene2D(function* (view) {
    const time = createSignal(0);
    const time_loop = yield loopFor(Infinity, function*() {
        yield* time(time() + 10, 10, linear);
    });

    yield* waitUntil("itsfaster");
    const faster_txt = createRef<Txt>();
    const finish_one_at_a_time = createRef<Txt>();
    view.add(<>
        <RoboticText ref={faster_txt}
            // text={"Faster"}
            y={-300} fill={"#007ed9"}
            fontSize={300}
        />
        <RoboticText ref={finish_one_at_a_time}
            // text={"1 IPC"}
            fill={"#c2566e"}
            fontSize={125}
        />
    </>)
    yield* faster_txt().text("Faster", 0.8);
    yield* waitFor(1);
    yield* finish_one_at_a_time().text("1 Instruction Per Clock", 0.8);

    yield* waitUntil("multipleinstructions");
    yield* all(
        faster_txt().text("EVEN Faster", 1.2),
        finish_one_at_a_time().text("More than 1 Instruction Per Clock", 1.2),
    );

    yield* waitUntil("whatdoimean");
    yield* sequence(0.1,
        faster_txt().y(faster_txt().y() - 800, 0.8),
        finish_one_at_a_time().y(finish_one_at_a_time().y() - 800, 0.8),
    );

    const codeset_stuff = createRef<Node>();
    view.add(<Node ref={codeset_stuff}></Node>);

    const codeset = createRef<Rect>();
    const codeset_lines = createRefArray<Line>();
    const lines_widths: [number, number, string][] = [
        [-163, 30, cosmic_grad_ramps[1][1]],
        [-163+20, 30+50, cosmic_grad_ramps[1][1]],
        [-163+40, 30+100, cosmic_grad_ramps[1][1]],
        [-163+40, 30+50, cosmic_grad_ramps[1][1]],
        [-163+40, 30+20, cosmic_grad_ramps[1][1]],
        [-163, 0, cosmic_grad_ramps[1][1]],
        [-163+20, 100, cosmic_grad_ramps[1][1]],
        [-163+20, 140, cosmic_grad_ramps[1][1]],
        [-163+40, 50, cosmic_grad_ramps[1][1]],
        [-163, -50, cosmic_grad_ramps[1][1]],
        [0,0, cosmic_grad_ramps[1][1]],
        [-163, 30, cosmic_grad_ramps[1][2]],
        [-163+20, 30+50, cosmic_grad_ramps[1][2]],
        [-163+40, 30+100, cosmic_grad_ramps[1][2]],
        [-163+40, 30+50, cosmic_grad_ramps[1][2]],
        [-163+40, 30+20, cosmic_grad_ramps[1][2]],
        [-163, 0, cosmic_grad_ramps[1][2]],
        [-163+20, 100, cosmic_grad_ramps[1][2]],
        [-163+20, 140, cosmic_grad_ramps[1][2]],
        [-163+40, 50, cosmic_grad_ramps[1][2]],
        [-163, -50, cosmic_grad_ramps[1][2]],
        [0,0, cosmic_grad_ramps[1][2]],
        [-163, 30, cosmic_grad_ramps[1][3]],
        [-163+20, 30+50, cosmic_grad_ramps[1][3]],
        [-163+40, 30+100, cosmic_grad_ramps[1][3]],
        [-163+40, 30+50, cosmic_grad_ramps[1][3]],
        [-163+40, 30+20, cosmic_grad_ramps[1][3]],
        [-163, 0, cosmic_grad_ramps[1][3]],
        [-163+20, 100, cosmic_grad_ramps[1][3]],
        [-163+20, 140, cosmic_grad_ramps[1][3]],
        [-163+40, 50, cosmic_grad_ramps[1][3]],
        [-163, -50, cosmic_grad_ramps[1][3]],
        [0,0, cosmic_grad_ramps[1][2]],
    ];
    const to_core_lines = createRefArray<Line>();
    const cores = createRefArray<Node>();
    const core_blocks = createRefArray<Rect>();
    const core_backs = createRefArray<Rect>();
    const core_txts = createRefArray<Txt>();
    const alphcolors = ["#3b376b", "#0b3c6c", "#0b3d65"]
    codeset_stuff().add(<>
        <Rect ref={codeset}
            size={[350, 500]}
            y={-800}
            stroke={cosmic_grad_ramps[0][1]}
            fill={"#14274b"}
            lineWidth={5}
            radius={10}
        >
            {...lines_widths.map((s, i) => <Line ref={codeset_lines}
                x={5} y={-233 + i * 15}
                lineWidth={10} stroke={s[2]}
                points={[[s[0], 0], [s[1], 0]]} lineCap={"round"}
            />)}
        </Rect>
        {...range(3).map(i => <Node ref={cores}
            rotation={90} scale={0}
            x={-500 + 500*i} y={350}
        >
            <Rect ref={core_backs}
                rotation={45}
                size={150}
                stroke={cosmic_grad_ramps[1][1+i]}
                fill={"#101b37"}
                lineWidth={2}
            >
            </Rect>
            <Rect ref={core_blocks}
                rotation={45}
                size={135}
                fill={alphcolors[i]}
                lineWidth={2}
            >
            </Rect>
            <RoboticText ref={core_txts}
                fontStyle={""}
                fill={cosmic_grad_ramps[1][1+i]}
                text={"Core #" + (i+1)}
                fontSize={80}
            />
        </Node>)}
        {...range(3).map(i => <Line ref={to_core_lines}
            points={[[0, -250], [-500+i*500, 0], cores[i].position()]}
            lineWidth={32} zIndex={-2} end={0}
            radius={20}
            lineDash={[200, 20]} lineDashOffset={() => time() * -100}
            stroke={cosmic_grad_ramps[1][1+i]}
        />)}
    </>)

    yield* sequence(0.3,
        codeset().y(-250, 0.5),
        sequence(0.1,
            ...cores.map(t => all(
                t.rotation(0, 0.8),
                t.scale(1, 0.8),
            ))
        )
    );

    const wee_loop = yield loopFor(Infinity, function*() {
        yield* all(
            ...core_backs.map(t => t.rotation(t.rotation() + 360, 4)),
            ...core_blocks.map(t => t.rotation(t.rotation() - 360, 4)),
        )
    });

    yield* sequence(0.8,
        ...range(3).map(i => sequence(0.1,
            all(
                ...codeset_lines.slice(i * 11, (i+1)*11).map(t => t.stroke("yellow", 0.5).back(0.5))
            ),
            to_core_lines[i].end(1, 1.2),
        ))
    );
    yield* waitUntil("withinasingleinstructionstream");
    yield* all(
        codeset_stuff().scale(2, 1.2),
        codeset_stuff().y(-300, 1.2),
    );
    yield* loopFor(1, function* () {
        yield* to_core_lines[1].stroke("yellow", 0.5).back(0.5);
    });
    yield* waitUntil("dipout");
    yield* all(
        codeset_stuff().scale(1, 1.2),
        codeset_stuff().y(1200, 1.2),
    );


    const therealbackground = createRef<Rect>();
    view.add(<>
        <Rect ref={therealbackground}
            size={"100%"}
            fill={"rgb(18,18,36)"}
            zIndex={-100}
        />
    </>)

//#region Background Shenanigans
    // HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
    const stage_refs = createRefArray<Rect>();
    const stage_labels = createRefArray<Txt>();
    const stage_ref_backings = createRefArray<Rect>();
    const stage_ref_frontings = createRefArray<Rect>();
    const stage_ref_big_front = createRefArray<Rect>();
    const part3_label = createRef<Txt>();

    const stage_posns: [number,number][] = [ [-700, 200], [-300, -300], [300, -300], [700, 200] ];
    const stage_lbl_strs: string[] = [ "1", "2", "3", "4" ]
    const stage_back_colors = [ "#231833ff", "#1d1a36ff", "#101b37ff", "#101c34ff" ]
    view.add(<>
        {range(4).map(i => <>
            <Rect
                ref={stage_refs}
                size={[200, 200]}
                position={stage_posns[i]}
                rotation={45} zIndex={-11}
                lineWidth={20}
                stroke={cosmic_grad_ramps[1][i]}
            />
            <Rect
                ref={stage_ref_backings}
                size={[230, 230]}
                position={stage_posns[i]}
                rotation={45} zIndex={-11}
                lineWidth={2}
                stroke={cosmic_grad_ramps[1][i]}
            />
            <Rect
                ref={stage_ref_frontings}
                size={[170, 170]}
                position={stage_posns[i]}
                rotation={45} zIndex={-11}
                lineWidth={2}
                stroke={cosmic_grad_ramps[1][i]}
            />
            <Rect
                ref={stage_ref_big_front}
                size={[300, 300]}
                position={stage_posns[i]}
                rotation={45} zIndex={-12}
                fill={stage_back_colors[i]}
            />
            <RoboticText
                ref={stage_labels}
                position={[stage_posns[i][0], stage_posns[i][1] + 10]}
                fontStyle={""} zIndex={-11}
                fontSize={0}
                text={stage_lbl_strs[i]}
                fill={cosmic_grad_ramps[1][i]}
            />
        </>)}
    </>);

    stage_ref_big_front[2].zIndex(-10);
    stage_ref_backings[2].zIndex(5);
    stage_ref_frontings[2].zIndex(5);
    stage_labels[2].zIndex(5);
    stage_refs[2].zIndex(5);

    const big_front_anims = [];
    const backing_anims = [];
    const fronting_anims = [];

    view.add(
        <RoboticText
            ref={part3_label}
            fontSize={100}
            fill={"white"}
            fontStyle={""}
            position={[-200, -140]}
            // text={"Part I"}
            zIndex={5}
    />)
    for (let i = 0; i < 4; i++) {
        yield sequence(0.2,
            sequence(0.1,
                all(
                    stage_ref_big_front[i].rotation(45, 0.2)
                ),
                (big_front_anims[i] = loopFor(Infinity, function* () { yield* stage_ref_big_front[i].rotation(stage_ref_big_front[i].rotation() + 180, 5, linear) }))
            ),
            sequence(0.1,
                all(
                    stage_ref_backings [i].rotation(-45, 0.2),
                ),
                (backing_anims[i] = loopFor(Infinity, function* () { yield* stage_ref_backings[i].rotation(stage_ref_backings[i].rotation() - 180, 5, linear) }))
            ),
            all(
                stage_refs         [i].rotation(45, 0.2),
                // stage_labels       [i].fontSize(150, 0.2)
            ),
            sequence(0.1,
                all(
                    stage_ref_frontings[i].rotation(45, 0.2),
                ),
                (fronting_anims[i] = loopFor(Infinity, function* () { yield* stage_ref_frontings[i].rotation(stage_ref_frontings[i].rotation() + 180, 5, linear) }))
            ),
        );
    }
    yield* sequence(0,
        sequence(0,
            stage_refs[2].rotation(45, 0),
            stage_refs[2].size([4000, 4000], 0),
            stage_ref_frontings[2].size([4000, 4000], 0),
            stage_ref_backings[2].size([4000, 4000], 0),
            stage_ref_big_front[2].size([4000, 4000], 0),
        ),
    );

    
    yield* sequence(0.1,
        stage_ref_big_front[2].size([300, 300], 0.8),
        stage_ref_frontings[2].size([170, 170], 0.8),
        stage_refs[2].size([200, 200], 0.8),
        stage_ref_backings[2].size([230, 230], 0.8),
        stage_refs[2].rotation(45, 0.8),
        ...range(4).map(i => stage_labels[i].fontSize(150, 0.2))
    );
    stage_ref_big_front[2].zIndex(-17);
    stage_ref_backings[2].zIndex(-15);
    stage_ref_frontings[2].zIndex(-15);
    stage_labels[2].zIndex(-15);
    stage_refs[2].zIndex(-15);

    stage_ref_big_front[3].zIndex(-10);
    stage_ref_backings[3].zIndex(5);
    stage_ref_frontings[3].zIndex(5);
    stage_labels[3].zIndex(5);
    stage_refs[3].zIndex(5);

    const shot_ray = createRef<Line>();
    view.add(<>
        <Line ref={shot_ray}
            points={[[374, -227], [706, 208]]}
            lineWidth={20} end={0}
            zIndex={-20}
            stroke={new Gradient({
                type: "linear",
                from: [374, -227],
                to:   [ 706, 208 ],
                stops: [
                    { offset: 0, color: "#007ed9" },
                    { offset: 1, color: "#0082c1" },
                ]
            })}
        />
    </>);

    yield* sequence(0.2,
        shot_ray().end(1, 0.8),
        shot_ray().start(1, 0.8),
    )
    yield* sequence(0.4,
        sequence(0.1,
            stage_refs[3].rotation(45, 0.8),
            stage_refs[3].size([4000, 4000], 0.8),
            stage_ref_frontings[3].size([4000, 4000], 0.8),
            stage_ref_backings[3].size([4000, 4000], 0.8),
            stage_ref_big_front[3].size([4000, 4000], 0.8),
        ),
        sequence(0.4,
            stage_labels[3].position([0, 0], 0.8),
            stage_labels[3].text("Parallelism", 0.8),
            part3_label().text("Part IV", 0.8)
        )
    );
//#endregion Background Shenanigans

    
    yield* waitUntil("end");
    yield* all(
        stage_labels[3].y(-1000, 1.2),
        part3_label().y(-1200, 1.2),
    )
});