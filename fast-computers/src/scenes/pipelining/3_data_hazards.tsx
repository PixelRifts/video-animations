import { Layout, Line, makeScene2D, Node, Rect, Txt } from "@motion-canvas/2d";
import { all, chain, clamp, Color, createEaseInBack, createEaseOutBack, createRef, createRefArray, createSignal, easeInBack, easeOutBack, linear, loopFor, PossibleVector2, range, run, sequence, Vector2, waitFor, waitUntil } from "@motion-canvas/core";
import { RoboticText } from "../../components/defaults";
import { wiggle } from "../../components/misc";
import { cosmic_grad_ramps } from "../../components/palette";


const get_diag_positioner = (x: number, y: number): PossibleVector2 => [-359 + x * 130, -243 + y * 80];

type PipelineStage = { name: string; color: string; }
let stages: PipelineStage[] = [
    { name: "F", color: cosmic_grad_ramps[3][0] },
    { name: "D", color: cosmic_grad_ramps[3][1] },
    { name: "E", color: cosmic_grad_ramps[3][2] },
    { name: "MA", color: cosmic_grad_ramps[3][3] },
    { name: "WB", color: cosmic_grad_ramps[3][4] },
]

export default makeScene2D(function* (view) {
    const time = createSignal(0);
    const time_loop = yield loopFor(Infinity, function*() {
        yield* time(time() + 10, 10, linear);
    });

    const blob_indicators_parent = createRef<Node>();
    view.add(<Node ref={blob_indicators_parent}></Node>);
    const blob_indicators = createRefArray<Node>();
    const blob_labels = createRefArray<Txt>();
    const blob_lines = createRefArray<Line>();
    const vcached = new Vector2(0, 200); const vscached = new Vector2(0, 100);
    const blob_label_strs = [ "F", "D", "E", "M", "W", ];
    blob_indicators_parent().add(<>
        {range(5).map(i => <Node ref={blob_indicators}
            position={[-400 + i * 400, 0]}
            scale={0}
        >
            <Line ref={blob_lines}
                radius={50}
                points={() => [
                    vcached.scale(1 + Math.sin(time() + 20) * 0.2),
                    vscached.rotate(45).scale(1 + Math.sin(time() + 80) * 0.2),
                    vcached.rotate(90).scale(1 + Math.sin(time() + 20) * 0.2),
                    vscached.rotate(135).scale(1 + Math.sin(time() + 80) * 0.2),
                    vcached.rotate(180).scale(1 + Math.sin(time() + 20) * 0.2),
                    vscached.rotate(225).scale(1 + Math.sin(time() + 80) * 0.2),
                    vcached.rotate(270).scale(1 + Math.sin(time() + 20) * 0.2),
                    vscached.rotate(315).scale(1 + Math.sin(time() + 80) * 0.2),
                ]}
                closed
                fill={Color.lerp(cosmic_grad_ramps[1][0], cosmic_grad_ramps[1][3], i / 5).alpha(0.5)} //d65db155
                rotation={() => (time() + i * 30) * 50}
            >
            </Line>
            <RoboticText ref={blob_labels}
                text={blob_label_strs[i]} x={-10} y={15}
                fontSize={130}
                fill={Color.lerp(cosmic_grad_ramps[1][0], cosmic_grad_ramps[1][3], i / 5)}
            />
        </Node>)}
    </>);
    yield* all(
        blob_indicators[0].scale(1, 0),
        blob_indicators[1].scale(1, 0),
        blob_indicators[2].scale(1, 0),
    );
    blob_indicators[4].x(blob_indicators[2].x());
    yield* all(
        all(
            ...blob_indicators.map((t, i) => t.x(-600 + clamp(0, 3, i) * 400, 0)),
        ),
        blob_indicators[4].scale(1, 0),
    )

    blob_indicators[3].x(blob_indicators[4].x());
    yield* all(
        all(
            ...blob_indicators.map((t, i) => t.x((-150 * 4) + i * 300, 0)),
        ),
        blob_indicators[3].scale(1, 0),
    );
    yield* all(
        ...blob_indicators.map(t => all(
            t.y(1000, 0, easeInBack),
            t.scale(0.6, 0, easeInBack),
        ))
    )

    yield* sequence(0.2,
        ...blob_indicators.map(t => all(
            t.y(-100, 1, createEaseOutBack(3)),
            t.scale(1, 1, createEaseOutBack(3)),
        ))
    )

    //#region Pipeline Diagram Stuff
    const diagram_stuff = createRef<Rect>();
    view.add(<Rect ref={diagram_stuff} position={[2000, 0]}></Rect>);
    const pipeline_diagram = createRef<Rect>();
    const pipeline_diagram_panel_highlight_in = createRef<Rect>();
    const pipeline_diagram_panel_highlight_out = createRef<Rect>();
    const pipeline_diagram_title = createRef<Txt>();
    diagram_stuff().add(<>
        <Rect
            ref={pipeline_diagram}
            fill={"#0082c122"}
            lineWidth={10}
            stroke={cosmic_grad_ramps[1][3]}
            // size={"90%"}
            clip rotation={90}
            // x={-2000}
        >
            <RoboticText ref={pipeline_diagram_title}
                fill={"#0082c1"} fontSize={100}
                text={"Pipeline Diagram"}
                position={[-515, 430]}
            />
        </Rect>
        <Rect
            ref={pipeline_diagram_panel_highlight_in}
            lineWidth={3}
            rotation={90}
            // size={{"x":1728-20,"y":972-20}}
            stroke={cosmic_grad_ramps[1][3] + "44"}
        />
        <Rect
            ref={pipeline_diagram_panel_highlight_out}
            lineWidth={3}
            rotation={90}
            // size={{"x":1728+20,"y":972+20}}
            stroke={cosmic_grad_ramps[1][3] + "44"}
        />
    </>);
    yield* all(
        all(pipeline_diagram_panel_highlight_out().rotation(0, 0), pipeline_diagram_panel_highlight_out().size({"x":1728+20,"y":972+20}, 0)),
        all(pipeline_diagram().rotation(0, 0), pipeline_diagram().size("90%", 0)),
        all(pipeline_diagram_panel_highlight_in().rotation(0, 0), pipeline_diagram_panel_highlight_in().size({"x":1728-20,"y":972-20}, 0)),
    );

    const code_parent = createRef<Node>();
    const code_lines = createRefArray<Layout>();
    const code_txts = createRefArray<Txt>();
    const code_txt_strs: string[][] = [
        [ "mov", "r3", "10h", ],
        [ "add", "r3", "r1", "r2", ],
        [ "sub", "r3", "r1", "r2", ],
        [ "and", "r3", "r1", "r2", ],
        [ "or",  "r3", "r1", "r2", ],
        [ "xor", "r3", "r1", "r2", ],
        [ "cmp", "r2", "r1", ],
    ];
    const flattened_code_txt_strs: string[] = [
        "mov", "r3", "10h",
        "add", "r3", "r1", "r2",
        "sub", "r3", "r1", "r2",
        "and", "r3", "r1", "r2",
        "or",  "r3", "r1", "r2",
        "xor", "r3", "r1", "r2",
        "cmp", "r2", "r1",
    ];
    pipeline_diagram().add(<>
        <Node ref={code_parent}>
            {...code_txt_strs.map((a, i) => <Layout ref={code_lines}
                layout direction={"row"}
                offset={[-1, 0]}
                gap={30}
                x={-200} alignItems={"center"}
                y={-235 + i * 80}
            >
                {...a.map((s, j) => <RoboticText ref={code_txts}
                    // text={s}
                    fontSize={j == 0 ? 100 : 80} fontStyle={""}
                    fill={j == 0 ? "#007ed9" : s.startsWith("r") ? "#0089ba" : "#008f7a"}
                >
                </RoboticText>)}
            </Layout>)}
        </Node>
    </>);

    yield* all(
        ...code_txts.map((t, i) => t.text(flattened_code_txt_strs[i], 0)),
    );
    yield* all(
        ...code_lines.map(t => t.gap(10, 0)),
        ...code_txts.map(t => t.fontSize(50, 0)),
        ...code_lines.map(t => t.x(-800, 0)),
    );
    const inst_names_parent = createRef<Node>();
    const inst_names = createRefArray<Txt>();
    const timestep_names_parent = createRef<Node>();
    const timestep_names = createRefArray<Txt>();
    const divider_line_parent = createRef<Node>()
    const simple_horiz_lines = createRefArray<Line>()
    const simple_verti_lines = createRefArray<Line>()
    const central_blocks_parent = createRef<Rect>();
    const central_blocks = createRefArray<Rect>();
    pipeline_diagram().add(<>
        <Node ref={inst_names_parent}>
            {range(7).map(i => <RoboticText ref={inst_names}
                // text={"I" + (i+1)}
                fill={new Color(cosmic_grad_ramps[1][2]).brighten()}
                fontSize={100}
                x={-500} y={-235 + i * 80}
            />)}
        </Node>
        <Node ref={divider_line_parent}>
            {range(8).map(i => <Line ref={simple_horiz_lines}
                fontSize={100} lineWidth={4} end={0}
                y={-235-48 + i * 80}
                stroke={"#0b3a65"}
                points={[[-800, 0], [800, 0]]}
            />)}
            {range(10).map(i => <Line ref={simple_verti_lines}
                fontSize={100} lineWidth={4} end={0}
                x={-424 + i * 130}
                stroke={"#0b3a65"}
                points={[[0, -360], [0, 275]]}
            />)}
        </Node>
        <Node ref={timestep_names_parent}>
            {range(10).map(i => <RoboticText ref={timestep_names}
                // text={i == 9 ?"..." : "t" + (i+1)}
                fill={new Color(cosmic_grad_ramps[1][3]).brighten()}
                fontSize={80}
                x={-380 + i * 130 + (i == 9 ? 0 : 15)} y={-320}
            />)}
        </Node>
        <Rect ref={central_blocks_parent}>
        </Rect>
    </>);
    yield* all(
        all(...inst_names.map((t, i) => t.text("I" + (i+1), 0))),
        all(...simple_horiz_lines.map((t, i) => t.end(1, 0))),
    )
    yield* all(
        all(...timestep_names.map((t, i) => t.text(i == 9 ?"..." : "t" + (i+1), 0))),
        all(...simple_verti_lines.map((t, i) => t.end(1, 0))),
    );

    type pipeline_block_init = { i: number, t: number, stage: number };
    const pipeline_blocks: pipeline_block_init[] = [];
    
    for (let i = 0; i < 7; i++) {
        if (i+0 < 9) pipeline_blocks.push({ i: i, t: i+0, stage: 0 });
        if (i+1 < 9) pipeline_blocks.push({ i: i, t: i+1, stage: 1 });
        if (i+2 < 9) pipeline_blocks.push({ i: i, t: i+2, stage: 2 });
        if (i+3 < 9) pipeline_blocks.push({ i: i, t: i+3, stage: 3 });
        if (i+4 < 9) pipeline_blocks.push({ i: i, t: i+4, stage: 4 });
    }

    const central_block_txts = createRefArray<Txt>();
    const central_block_txt_contents = createRefArray<Txt>();
    pipeline_diagram().add(<>
        <Rect ref={central_blocks_parent}>
            {...pipeline_blocks.map(b => <Rect ref={central_blocks}
                position={get_diag_positioner(b.t, b.i)}
                // size={[116, 66]}
                fill={stages[b.stage].color + "33"} rotation={90}
                lineWidth={4} stroke={cosmic_grad_ramps[3][b.stage]}
                clip
            >
                <RoboticText ref={central_block_txts}
                    fill={stages[b.stage].color}
                    fontStyle={""} y={4}
                    text={stages[b.stage].name}
                />
                <RoboticText ref={central_block_txt_contents}
                    fill={stages[b.stage].color} fontSize={30}
                    fontStyle={""} y={14}
                />
            </Rect>)}
        </Rect>
    </>);

    //#endregion Pipeline Digram Stuff


    yield* waitUntil("showpipelineagain");

    yield* sequence(0.05,
        ...blob_indicators.map(t => all(
            t.y(-1200, 1, createEaseInBack(3)),
            t.scale(1, 1, createEaseInBack(3)),
        ))
    )
    yield* diagram_stuff().x(0, 1.2);
    yield* sequence(0.02,
        ...central_blocks.map(t => all(
            t.size([116, 66], 0.5),
            t.rotation(0, 0.5),
        ))
    );
    yield* all(diagram_stuff().scale(1.5, 1), diagram_stuff().position([800,0], 1))

    yield* waitUntil("highlightr3");
    yield sequence(0.1,
        ...[1,4,8,12,16,20].map(i => code_txts[i].fill("yellow", 0.5).wait(3).back(0.5)),
    )
    yield* waitUntil("highlightr1r2");
    yield sequence(0.5,
        sequence(0.1,
            ...[5,9,13,17,21,25].map(i => code_txts[i].fill("red", 0.5).wait(0.5).back(0.5)),
        ),
        sequence(0.1,
            ...[6,10,14,18,22,24].map(i => code_txts[i].fill("red", 0.5).wait(0.5).back(0.5)),
        )
    );

    const flattened_code_txt_strs_updated: string[] = [
        "mov", "r3", "10h",
        "add", "r3", "r1", "r2",
        "sub", "r1", "r3", "r0",
        "and", "r2", "r0", "r3",
        "or",  "r0", "r3", "r2",
        "xor", "r3", "r2", "r2",
        "cmp", "r3", "r1",
    ];
    yield* waitUntil("rewritecode");
    yield* sequence(0.05,
        ...code_txts.map((t, i) => all(
            t.scale(1.4, 0.8).back(0.8),
            t.fill("yellow", 0.8).back(0.8),
            t.text(flattened_code_txt_strs_updated[i], 1),
        ))
    );

    yield* waitUntil("backtofulldiag");
    yield* all(diagram_stuff().scale(1, 1), diagram_stuff().position([0,0], 1));
    yield* waitUntil("flash_decodes");
    yield* sequence(0.1,
        ...central_blocks.filter((_, i) => pipeline_blocks[i].stage == 1).map((t, i) => chain(
            run(function* () { t.zIndex(10); }),
            all(
                t.scale(1.3, 0.5).back(0.5),
                wiggle(t.rotation, -10, 10, 1),
                t.stroke("yellow", 0.5).back(0.5),
                t.childAs<Txt>(0).fill("yellow", 0.5).back(0.5),
                t.fill("#5c6b32", 0.5).back(0.5),
            ),
            run(function* () { t.zIndex(0); }),
        ))
    )
    yield* waitUntil("flash_writebacks");
    yield* sequence(0.1,
        ...central_blocks.filter((_, i) => pipeline_blocks[i].stage == 4).map((t, i) => chain(
            run(function* () { t.zIndex(10); }),
            all(
                t.scale(1.3, 0.5).back(0.5),
                wiggle(t.rotation, -10, 10, 1),
                t.stroke("yellow", 0.5).back(0.5),
                t.childAs<Txt>(0).fill("yellow", 0.5).back(0.5),
                t.fill("#5c6b32", 0.5).back(0.5),
            ),
            run(function* () { t.zIndex(0); }),
        ))
    );

    yield* waitUntil("focusi2i3");
    yield* all(diagram_stuff().scale(1.4, 1.2), diagram_stuff().position([250,100], 1.2))
    
    yield* sequence(0.1,
        ...range(2).map(i => chain(
            central_block_txts[6+i].x(80, 0.8),
            all(
                central_block_txts[6+i].position([-80, -10], 0),
                central_block_txts[6+i].fontSize(40, 0),
            ),
            central_block_txts[6+i].x(-42, 0.8),
        )),
        ...range(2).map(i => chain(
            central_block_txts[8+i].x(90, 0.8),
            all(
                central_block_txts[8+i].position([-90, -12], 0),
                central_block_txts[8+i].fontSize(40, 0),
            ),
            central_block_txts[8+i].x(-28, 0.8),
        )),
    )

    yield* waitUntil("I2T3");
    central_blocks[6].clip(false);
    central_blocks[6].zIndex(10);
    yield* all(
        central_block_txt_contents[6].text("r1,r2", 0.8),
        central_block_txt_contents[6].fill("yellow", 1).back(1),
        central_block_txt_contents[6].scale(5, 1).back(1),
    )
    central_blocks[6].clip(true);
    central_blocks[6].zIndex(0);

    yield* waitUntil("I2T4");
    central_blocks[7].clip(false);
    central_blocks[7].zIndex(10);
    yield* all(
        central_block_txt_contents[7].text("+", 0.8),
        central_block_txt_contents[7].fill("yellow", 1).back(1),
        central_block_txt_contents[7].scale(5, 1).back(1),
    )
    central_blocks[7].clip(true);
    central_blocks[7].zIndex(0);

    yield* waitUntil("I2T6");
    central_blocks[9].clip(false);
    central_blocks[9].zIndex(10);
    yield* all(
        central_block_txt_contents[9].text("r3 =", 0.8),
        central_block_txt_contents[9].fill("yellow", 1).back(1),
        central_block_txt_contents[9].scale(5, 1).back(1),
    )
    central_blocks[9].clip(true);
    central_blocks[9].zIndex(0);

    yield* waitUntil("I3decode");
    yield* chain(
        run(function* () { central_blocks[11].zIndex(10); }),
        all(
            central_blocks[11].scale(2, 1.2).back(1.2),
            wiggle(central_blocks[11].rotation, -10, 10, 2.2),
            central_blocks[11].stroke("yellow", 1.2).back(1.2),
            central_blocks[11].childAs<Txt>(0).fill("yellow", 1.2).back(1.2),
            central_blocks[11].fill("#5c6b32", 1.2).back(1.2),
        ),
        run(function* () { central_blocks[11].zIndex(0); }),
    );
    yield* sequence(0.1,
        ...range(2).map(i => chain(
            central_block_txts[11+i].x(80, 0.8),
            all(
                central_block_txts[11+i].position([-80, -10], 0),
                central_block_txts[11+i].fontSize(40, 0),
            ),
            central_block_txts[11+i].x(-42, 0.8),
        )),
        ...range(2).map(i => chain(
            central_block_txts[13+i].x(90, 0.8),
            all(
                central_block_txts[13+i].position([-90, -12], 0),
                central_block_txts[13+i].fontSize(40, 0),
            ),
            central_block_txts[13+i].x(-28, 0.8),
        )),
    )

    yield* waitUntil("I3T4");


    central_blocks[11].clip(false);
    central_blocks[11].zIndex(10);
    yield* all(
        central_block_txt_contents[11].text("r3,r0", 0.8),
        central_block_txt_contents[11].fill("yellow", 1).back(1),
        central_block_txt_contents[11].scale(5, 1).back(1),
    )
    central_blocks[11].clip(true);
    central_blocks[11].zIndex(0);

    yield* waitUntil("oldvalue");
    const toreset = [6,7,8,9,11,12,13,14];
    yield* sequence(0.05,
        ...toreset.map(i => all(
            central_block_txt_contents[i].text("", 0.5),
            chain(
                central_block_txts[i].x(-100, 0.8),
                all(
                    central_block_txts[i].position([100, 0], 0),
                    central_block_txts[i].fontSize(48, 0),
                ),
                central_block_txts[i].x(0, 0.8),
            )
        ))
    );
    yield* all(
        diagram_stuff().scale(1, 1.2),
        diagram_stuff().position(0, 1.2),
    );

    yield* waitUntil("csterms");
    const inst_names_parent_clone = code_parent().clone();
    view.add(inst_names_parent_clone);
    yield* all(
        diagram_stuff().x(2000, 0.8),
        inst_names_parent_clone.x(400, 0.8).to(100, 1.2),
        inst_names_parent_clone.scale(1.4, 1).back(1),
    )
    yield* sequence(0.1,
        ...inst_names_parent_clone.childrenAs<Layout>().map((l, i) => all(
            l.y(-345 + i * 120, 0.5),
            l.gap(30, 0.5),
            sequence(0.05,
                ...l.childrenAs<Txt>().map(t => all(
                    t.fontSize(100, 0.5),
                    //@ts-expect-error
                    t.fill(new Color(t.fill()).alpha(0.5), 0.5)
                )),
            )
        ))
    );

    const highlight_instr = function* (i: number, b = true) {
        yield* all(
            inst_names_parent_clone.childAs<Layout>(i).scale(b ? 1.4 : 1, 0.4),
            ...inst_names_parent_clone.childAs<Layout>(i).childrenAs<Txt>().map(t =>
                //@ts-expect-error
                t.fill(new Color(t.fill()).alpha(b ? 1 : 0.5), 0.5)
            )
        );    
    }
    yield* highlight_instr(2);
    yield* waitFor(0.5);
    yield* highlight_instr(1);

    yield* waitUntil("raw_dep")
    const readafterwritetitle = createRef<Txt>();
    const writefterwritetitle = createRef<Txt>();
    const writeafterreadtitle = createRef<Txt>();
    const datahazardtitle = createRef<Txt>();
    const nonhazardtitle = createRef<Txt>();
    view.add(<>
        <RoboticText ref={readafterwritetitle}
            position={[400, 0]}
            fontSize={200} fill={"#008f7a"}
        />
        <RoboticText ref={writefterwritetitle}
            position={[400, 200]}
            fontSize={200} fill={"#008f7a"}
        />
        <RoboticText ref={writeafterreadtitle}
            position={[400, 400]}
            fontSize={200} fill={"#008f7a"}
        />
        <RoboticText ref={datahazardtitle}
            position={[450, -320]} fontStyle={""}
            fontSize={225} fill={"#08555844"}
        />
        <RoboticText ref={nonhazardtitle}
            position={[450, 100]} fontStyle={""}
            fontSize={185} fill={"#08555844"}
        />

    </>);
    yield* readafterwritetitle().text("Read\nAfter\nWrite", 1.2);
    yield* waitFor(1);
    yield* all(
        readafterwritetitle().text("RAW", 1.2),
        readafterwritetitle().y(-200, 1.2),
    );
    yield* waitFor(1);
    yield* sequence(0.1,
        inst_names_parent_clone.childAs<Layout>(1).childAs<Txt>(1).fill("red", 0.8).wait(3).back(0.8),
        inst_names_parent_clone.childAs<Layout>(2).childAs<Txt>(2).fill("red", 0.8).wait(3).back(0.8),
    );
    yield* waitFor(2.5);
    yield* datahazardtitle().text("Hazardous", 0.5);

    yield* waitUntil("other_deps");
    yield* all(highlight_instr(2, false), highlight_instr(1, false));
    yield* waitFor(3);
    yield* all(
        highlight_instr(0),
        highlight_instr(1),
    );
    yield* all(
        inst_names_parent_clone.childAs<Layout>(0).childAs<Txt>(1).fill("red", 0.8).wait(1).back(0.8),
        inst_names_parent_clone.childAs<Layout>(1).childAs<Txt>(1).fill("red", 0.8).wait(1).back(0.8),
        writefterwritetitle().text("WAW", 0.8),
    );
    yield* all(
        highlight_instr(0, false),
        highlight_instr(1, false),
    )
    

    yield* all(
        highlight_instr(1),
        highlight_instr(2),
        highlight_instr(4),
        highlight_instr(5),
    );
    yield* all(
        inst_names_parent_clone.childAs<Layout>(1).childAs<Txt>(2).fill("red", 0.8).wait(1).back(0.8),
        inst_names_parent_clone.childAs<Layout>(2).childAs<Txt>(1).fill("red", 0.8).wait(1).back(0.8),
        inst_names_parent_clone.childAs<Layout>(4).childAs<Txt>(2).fill("red", 0.8).wait(1).back(0.8),
        inst_names_parent_clone.childAs<Layout>(5).childAs<Txt>(1).fill("red", 0.8).wait(1).back(0.8),
        writeafterreadtitle().text("WAR", 0.8),
    );
    yield* all(
        highlight_instr(2, false),
        highlight_instr(1, false),
        highlight_instr(5, false),
        highlight_instr(4, false),
    );

    yield* waitUntil("notactuallyhazardous");
    yield* nonhazardtitle().text("Non-Hazardous", 1.2);
    
    yield* waitUntil("doneforeshadowing");
    yield* all(
        inst_names_parent_clone.y(1000, 0.8),
        readafterwritetitle().y(readafterwritetitle().y() + 1000, 0.8),
        writefterwritetitle().y(writefterwritetitle().y() + 1000, 0.8),
        writeafterreadtitle().y(writeafterreadtitle().y() + 1000, 0.8),
        datahazardtitle().y(datahazardtitle().y() + 1000, 0.8),
        nonhazardtitle().y(nonhazardtitle().y() + 1000, 0.8),
    );
    yield* diagram_stuff().x(0, 1);

    diagram_stuff().save();
    yield* all(
        diagram_stuff().scale(2, 1.2),
        diagram_stuff().position([700, 0], 1.2),
    );

    yield* sequence(0.1,
        code_txts[4].fill("red", 0.5),
        code_txts[9].fill("#FF0022", 0.5),
        code_txts[14].fill("#FF0022", 0.5),
        code_txts[17].fill("#FF0022", 0.5),
        // code_txts[4].
    )

    yield* waitFor(1);
    yield* diagram_stuff().restore(1.2);
    yield* waitUntil("I4T5");

    yield* sequence(1,
        chain(
            run(function* () { central_blocks[16].zIndex(10); }),
            all(
                central_blocks[16].scale(1.3, 1).back(1),
                wiggle(central_blocks[16].rotation, -10, 10, 2),
                central_blocks[16].stroke("yellow", 1).back(1),
                central_blocks[16].childAs<Txt>(0).fill("yellow", 1).back(1),
                central_blocks[16].fill("#5c6b32", 1).back(1),
            ),
            run(function* () { central_blocks[16].zIndex(0); }),
        ),
        chain(
            run(function* () { central_blocks[9].zIndex(10); }),
            all(
                central_blocks[9].scale(1.3, 1).back(1),
                wiggle(central_blocks[9].rotation, -10, 10, 2),
                central_blocks[9].stroke("yellow", 1).back(1),
                central_blocks[9].childAs<Txt>(0).fill("yellow", 1).back(1),
                central_blocks[9].fill("#5c6b32", 1).back(1),
            ),
            run(function* () { central_blocks[9].zIndex(0); }),
        ),
    )

    yield* waitUntil("I5T6");
    yield* sequence(1,
        chain(
            run(function* () { central_blocks[21].zIndex(10); }),
            all(
                central_blocks[21].scale(1.3, 1).back(1),
                wiggle(central_blocks[21].rotation, -10, 10, 2),
                central_blocks[21].stroke("yellow", 1).back(1),
                central_blocks[21].childAs<Txt>(0).fill("yellow", 1).back(1),
                central_blocks[21].fill("#5c6b32", 1).back(1),
            ),
            run(function* () { central_blocks[21].zIndex(0); }),
        ),
        chain(
            run(function* () { central_blocks[9].zIndex(10); }),
            all(
                central_blocks[9].scale(1.3, 1).back(1),
                wiggle(central_blocks[9].rotation, -10, 10, 2),
                central_blocks[9].stroke("yellow", 1).back(1),
                central_blocks[9].childAs<Txt>(0).fill("yellow", 1).back(1),
                central_blocks[9].fill("#5c6b32", 1).back(1),
            ),
            run(function* () { central_blocks[9].zIndex(0); }),
        ),
    )

    yield* waitUntil("end");
})