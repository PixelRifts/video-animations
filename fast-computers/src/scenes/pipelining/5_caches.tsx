import { Gradient, Layout, Line, makeScene2D, Node, Rect, Txt } from "@motion-canvas/2d";
import { all, chain, Color, createRef, createRefArray, createSignal, easeInCirc, easeOutBack, easeOutCirc, linear, loop, loopFor, PossibleVector2, range, run, sequence, Vector2, waitFor, waitUntil } from "@motion-canvas/core";
import { RoboticText } from "../../components/defaults";
import { cosmic_grad_ramps, cosmic_analogues } from "../../components/palette";
import { wiggle } from "../../components/misc";


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

    // #region Pipeline Diagram Stuff
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
        [ "sub", "r1", "r3", "r0", ],
        [ "cmp", "r3", "r1", ],
        [ "jeq", "I2", ],
        [ "and", "r2", "r0", "r3", ],
        [ "cmp", "r1", "r2", ],
    ];
    const flattened_code_txt_strs: string[] = [
        "mov", "r3", "10h",
        "add", "r3", "r1", "r2",
        "sub", "r1", "r3", "r0",
        "cmp", "r3", "r1",
        "jeq", "I2",
        "and", "r2", "r0", "r3",
        "cmp", "r1", "r2",
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
    
    for (let i = 0; i < 5; i++) {
        if (i+0 < 9) pipeline_blocks.push({ i: i, t: i+0, stage: 0 });
        if (i+1 < 9) pipeline_blocks.push({ i: i, t: i+1, stage: 1 });
        if (i+2 < 9) pipeline_blocks.push({ i: i, t: i+2, stage: 2 });
        if (i+3 < 9) pipeline_blocks.push({ i: i, t: i+3, stage: 3 });
        if (i+4 < 9) pipeline_blocks.push({ i: i, t: i+4, stage: 4 });
    }
    for (let i = 1; i < 5; i++) {
        if (i+4 < 9) pipeline_blocks.push({ i: i, t: i+4, stage: 0 });
        if (i+5 < 9) pipeline_blocks.push({ i: i, t: i+5, stage: 1 });
        if (i+6 < 9) pipeline_blocks.push({ i: i, t: i+6, stage: 2 });
        if (i+7 < 9) pipeline_blocks.push({ i: i, t: i+7, stage: 3 });
    }

    const central_block_txts = createRefArray<Txt>();
    const central_block_txt_contents = createRefArray<Txt>();
    pipeline_diagram().add(<>
        <Rect ref={central_blocks_parent}>
            {...pipeline_blocks.map(b => <Rect ref={central_blocks}
                position={get_diag_positioner(b.t, b.i)}
                size={[116, 66]}
                fill={stages[b.stage].color + "33"}// rotation={90}
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
    const highlight_block = function* (i: number) {
        yield* chain(
            run(function* () { central_blocks[i].zIndex(10); }),
            all(
                central_blocks[i].scale(1.3, 1).back(1),
                wiggle(central_blocks[i].rotation, -10, 10, 2),
                central_blocks[i].stroke("yellow", 1).back(1),
                central_blocks[i].childAs<Txt>(0).fill("yellow", 1).back(1),
                central_blocks[i].fill("#5c6b32", 1).back(1),
            ),
            run(function* () { central_blocks[i].zIndex(0); }),
        );
    }

    // #endregion Pipeline Digram Stuff

    yield* waitUntil("bringbackdiagram");
    yield* diagram_stuff().x(0, 1.2);
    diagram_stuff().save();
    yield* all(
        diagram_stuff().scale(1.9, 1.2),
        diagram_stuff().position([1000, 0], 1.2),
    );
    yield* waitUntil("smalltweak");
    yield* all(
        all(
            code_txts[2].scale(1.4, 0.8).back(0.8),
            code_txts[2].fill("yellow", 0.8).back(0.8),
            code_txts[2].text("[10h]", 1),
        ),
        all(
            code_txts[15].scale(1.4, 0.8).back(0.8),
            code_txts[15].fill("yellow", 0.8).back(0.8),
            code_txts[15].text("I1", 1),
        )
    )

    yield* diagram_stuff().restore(1.2);
    yield* sequence(0.01,
        ...central_blocks.slice(25).map(t => t.y(t.y() - 80, 0.5)),
    )

    yield* waitUntil("lookingatcurrentcomp");

    // #region Computer stuff
    
    // START OF THE COMPUTER
    const computer_stuff = createRef<Rect>();
    const computer = createRef<Rect>();
    const internals = createRef<Node>();
    const backsquare = createRef<Rect>();
    const blocks = createRef<Node>();
    const wires = createRef<Node>();
    const comp_title = createRef<Txt>();

    const clock_sig = createSignal<number>(0);
    const clock_pulse = createRef<Rect>();

    const data_bus = createRef<Rect>();     const data_bus_label = createRef<Txt>();
    const control_unit = createRef<Rect>(); const control_unit_label = createRef<Txt>();
    const control_bus = createRef<Rect>();  const control_bus_label = createRef<Txt>();
    const clock = createRef<Rect>();        const clock_label = createRef<Txt>();
    const pc = createRef<Rect>();           const pc_label = createRef<Txt>();           const pc_value = createRef<Txt>();
    const ir = createRef<Rect>();           const ir_label = createRef<Txt>();
    const mdr = createRef<Rect>();          const mdr_label = createRef<Txt>();          const mar_value = createRef<Txt>();
    const mar = createRef<Rect>();          const mar_label = createRef<Txt>();          const mdr_value = createRef<Txt>();
    const ram = createRef<Rect>();          const ram_label = createRef<Txt>();
    const alu = createRef<Line>();          const alu_label = createRef<Txt>();
    const temp_y = createRef<Line>();       const temp_y_label = createRef<Txt>();       const temp_y_value = createRef<Txt>();
    const temp_z = createRef<Line>();       const temp_z_label = createRef<Txt>();       const temp_z_value = createRef<Txt>();
    const flags = createRef<Line>();        const flags_label = createRef<Txt>();
    
    const register_file = createRef<Rect>();
    const register_file_label = createRef<Txt>();
    const simple_register_container = createRef<Layout>();
    const simple_registers = createRefArray<Rect>();
    const simple_register_labels = createRefArray<Txt>();
    const simple_register_values = createRefArray<Txt>();

    const clock_control_wire = createRef<Line>();
    const control_cbus_wire_bundle = createRef<Node>();
    const control_cbus_wires = createRefArray<Line>();
    const ir_control_wire = createRef<Line>();
    const pc_control_wire = createRef<Line>();
    const mar_control_wire = createRef<Line>();
    const mdr_control_wire = createRef<Line>();
    const ram_control_wire = createRef<Line>();
    const alu_control_wire = createRef<Line>();
    const temp_z_control_wire = createRef<Line>();
    const temp_y_control_wire = createRef<Line>();
    const register_file_control_wire = createRef<Line>();

    const pc_data_wire = createRef<Line>();
    const ir_ctrl_data_wire = createRef<Line>();
    const ir_data_wire = createRef<Line>();
    const mdr_data_wire = createRef<Line>();
    const mar_data_wire = createRef<Line>();
    const mdr_ram_data_wire = createRef<Line>();
    const mar_ram_data_wire = createRef<Line>();
    const temp_y_data_wire = createRef<Line>();
    const temp_y_alu_data_wire = createRef<Line>();
    const alu_data_wire = createRef<Line>();
    const alu_temp_z_data_wire = createRef<Line>();
    const alu_flags_data_wire = createRef<Line>();
    const temp_z_data_wire = createRef<Line>();
    const flags_ctrl_data_wire = createRef<Line>();
    const register_file_data_wire = createRef<Line>();

    const computer_panel_highlight_in  = createRef<Rect>();
    const computer_panel_highlight_out = createRef<Rect>();
    const control_label_mask = createRef<Rect>();  const control_label = createRef<Txt>();
    const control_label1_mask = createRef<Rect>(); const control_label1 = createRef<Txt>();
    const control_label2_mask = createRef<Rect>(); const control_label2 = createRef<Txt>();
    const data_label_mask = createRef<Rect>();     const data_label = createRef<Txt>();
    const data_label2_mask = createRef<Rect>();    const data_label2 = createRef<Txt>();
    const data_label3_mask = createRef<Rect>();    const data_label3 = createRef<Txt>();

    view.add(<Rect ref={computer_stuff} x={-2000}>
        <Rect
            ref={computer}
            fill={"#2c1e43"}
            lineWidth={10}
            stroke={cosmic_grad_ramps[1][0]}
            size={"90%"}
            clip
        >
            <RoboticText ref={comp_title}
                fontSize={100}  
                offset={[0, 0.5]} position={[-700, 465]}
                text={"Stage 4"} fill={cosmic_grad_ramps[1][0]}
            />
            <Rect ref={backsquare}
                size={1700}
                fill={cosmic_analogues[1][1] + "08"}
                zIndex={-3}
            />
            <Node ref={internals} y={-35}>
                <Node ref={blocks} zIndex={3}/>
                <Node ref={wires}/>
            </Node>
        </Rect>
        <Rect
            ref={computer_panel_highlight_in}
            lineWidth={3}
            size={{"x":1728-20,"y":972-20}}
            stroke={cosmic_grad_ramps[1][0] + "44"}
        />
        <Rect
            ref={computer_panel_highlight_out}
            lineWidth={3}
            size={{"x":1728+20,"y":972+20}}
            stroke={cosmic_grad_ramps[1][0] + "44"}
        />
    </Rect>);
    
    blocks().add(<>
        <Rect ref={data_bus}
            fill={"#492b61"}
            position={[0, -50]}
            size={[1400, 65]}
            lineWidth={4}
            stroke={"#ae56c5"}
        >
            <RoboticText
                ref={data_bus_label} y={7}
                fill={cosmic_analogues[1][0]}
                fontSize={60}
                text={"DATA"}
            />
        </Rect>
        <Rect ref={control_bus}
            fill={"#4e2b4d"}
            position={[0, 50]}
            size={[1400, 65]}
            lineWidth={4}
            stroke={() => Color.lerp("#c2566e", "#ffffff", clock_sig())}
        >
            <RoboticText
                ref={control_bus_label} y={7}
                fill={cosmic_analogues[1][1]}
                fontSize={60}
                text={"CONTROL"}
            />
        </Rect>

        <Rect ref={clock}
            fill={"#4e2b4d"}
            position={[-472, -331]}
            size={[130, 65]}
            lineWidth={4}
            stroke={() => Color.lerp("#c2566e", "#FFFFFF", clock_sig())}
        >
            <RoboticText
                ref={clock_label} y={4}
                fill={() => Color.lerp("#c2566e", "#FFFFFF", clock_sig())}
                fontSize={50} fontStyle={""}
                text={"CLK"}
            />
        </Rect>
        <Rect ref={clock_pulse}
            fill={"#4e2b4d"}
            position={[-472, -331]}
            lineWidth={2} zIndex={-1}
            stroke={"#FFFFFF"}>
        </Rect>
        <Rect ref={pc}
            fill={"#492b61"}
            position={[0, 230]}
            size={[130, 65]}
            lineWidth={4} clip
            stroke={"#ae56c5"}
        >
            <RoboticText
                ref={pc_label} y={4}
                fill={cosmic_analogues[1][0]}
                fontSize={50} fontStyle={""}
                text={"PC"}
            />
            <RoboticText
                ref={pc_value} y={14}
                fill={"#ffc0ff"}
                fontSize={50} fontStyle={""}
                text={""}
            />
        </Rect>
        <Rect ref={ir}
            fill={"#492b61"}
            position={[-472, -231]}
            size={[130, 65]}
            lineWidth={4} clip
            stroke={"#ae56c5"}
        >
            <RoboticText
                ref={ir_label} x={-45} y={-15}
                fill={cosmic_analogues[1][0]}
                fontSize={30} fontStyle={""}
                text={"IR"}
            />
        </Rect>
        <Rect ref={control_unit}
            fill={"#4e2b4d"}
            position={[-150, -281]}
            size={[330, 165]}
            lineWidth={4}
            stroke={() => Color.lerp("#c2566e", "#ffffff", clock_sig())}
        >
            <RoboticText
                ref={control_unit_label} y={4}
                fill={cosmic_analogues[1][1]}
                fontSize={50} fontStyle={""}
                text={"Control Unit /\nDecoder"}
            />
        </Rect>

        <Rect ref={mdr}
            fill={"#492b61"}
            position={[-350, 190]}
            size={[130, 65]}
            lineWidth={4} clip
            stroke={"#ae56c5"}
        >
            <RoboticText
                ref={mdr_label} y={4}
                fill={cosmic_analogues[1][0]}
                fontSize={50} fontStyle={""}
                text={"MDR"}
            />
            <RoboticText
                ref={mdr_value} y={14}
                fill={"#ffc0ff"}
                fontSize={50} fontStyle={""}
                text={""}
            />
        </Rect>
        <Rect ref={mar}
            fill={"#492b61"}
            position={[-220, 290]}
            size={[130, 65]}
            lineWidth={4} clip
            stroke={"#ae56c5"}
        >
            <RoboticText
                ref={mar_label} y={4}
                fill={cosmic_analogues[1][0]}
                fontSize={50} fontStyle={""}
                text={"MAR"}
            />
            <RoboticText
                ref={mar_value} y={14}
                fill={"#ffc0ff"}
                fontSize={40} fontStyle={""}
                text={""}
            />
        </Rect>
        <Rect ref={ram}
            fill={"#532d5a"}
            position={[-550, 240]}
            size={[130, 185]}
            lineWidth={4}
            stroke={"#c457a5"}
        >
            <RoboticText
                ref={ram_label} y={4}
                fill={cosmic_grad_ramps[1][0]}
                fontSize={50} fontStyle={""}
                text={"RAM"}
            />
        </Rect>

        <Line ref={alu}
            fill={"#4e2b4d"}
            position={[385, -275]}
            points={[[0, 40], [110, 100], [110, 25], [75, 0], [110, -25], [110, -100], [0, -40]].map(t => [t[0] - 55, t[1]])}
            closed
            lineWidth={4}
            stroke={"#c2566e"}
        >
            <RoboticText
                ref={alu_label} x={-5}
                fill={cosmic_analogues[1][1]}
                rotation={-90}
                fontSize={50} fontStyle={""}
                text={"ALU"}
            />
        </Line>
        <Rect ref={flags}
            fill={"#492b61"}
            position={[185, -331]}
            size={[130, 65]}
            lineWidth={4}
            stroke={"#ae56c5"}
        >
            <RoboticText
                ref={flags_label} y={4}
                fill={cosmic_analogues[1][0]}
                fontSize={50} fontStyle={""}
                text={"Flags"}
            />
        </Rect>
        <Rect ref={temp_z}
            fill={"#492b61"}
            position={[185, -231]}
            size={[130, 65]}
            lineWidth={4} clip
            stroke={"#ae56c5"}
        >
            <RoboticText
                ref={temp_z_label} y={4}
                fill={cosmic_analogues[1][0]}
                fontSize={50} fontStyle={""}
                text={"Z"}
            />
            <RoboticText
                ref={temp_z_value} y={14}
                fill={"#ffc0ff"}
                fontSize={50} fontStyle={""}
                text={""}
            />
        </Rect>
        <Rect ref={temp_y}
            fill={"#492b61"}
            position={[475 + 110, -340]}
            size={[130, 65]}
            lineWidth={4} clip
            stroke={"#ae56c5"}
        >
            <RoboticText
                ref={temp_y_label} y={4}
                fill={cosmic_analogues[1][0]}
                fontSize={50} fontStyle={""}
                text={"Y"}
            />
            <RoboticText
                ref={temp_y_value} y={14}
                fill={"#ffc0ff"}
                fontSize={50} fontStyle={""}
                text={""}
            />
        </Rect>

        <Rect ref={register_file}
            fill={"#492b61"}
            position={[400, 300]}
            size={[250, 300]}
            lineWidth={4}
            stroke={"#ae56c5"}
        >
            <RoboticText ref={register_file_label}
                x={-80}
                fill={cosmic_analogues[1][0]}
                fontSize={50} rotation={-90}
                text={"Register File"}
            />
            <Layout ref={simple_register_container}
                direction={"column"}
                x={40}
            >
                {range(4).map(i => <Rect ref={simple_registers}
                    fill={"#492b61"}
                    size={[130, 65]}
                    lineWidth={4} y={-100+i*65}
                    stroke={"#ae56c5"} clip
                >
                    <RoboticText ref={simple_register_labels}
                        y={4}
                        fill={cosmic_analogues[1][0]}
                        fontSize={50} fontStyle={""}
                        text={"R" + i}
                    />
                    <RoboticText ref={simple_register_values}
                        y={4}
                        fill={new Color(cosmic_analogues[1][0]).brighten(2)}
                        fontSize={50} fontStyle={""}
                    />
                </Rect>)}
            </Layout>
        </Rect>
    </>)

    wires().add(<>
        <Line ref={clock_control_wire}
            points={[[-404, -330], [-318, -330]]}
            lineWidth={5} stroke={() => Color.lerp("#c2566e", "#FFFFFF", clock_sig())}
            lineDash={[20, 20]} lineDashOffset={() => time() * -50}
        >
        </Line>
        <Node ref={control_cbus_wire_bundle}>
            {range(10).map(i => <Line ref={control_cbus_wires}
                points={[[-150, -198], [-150, 18]]} x={((10-1) * -5) + i * 10}
                lineWidth={5} stroke={i == 0 ? () => Color.lerp("#c2566e", "#FFFFFF", clock_sig()) : "#c2566e"}
                lineDash={[20, 20]} lineDashOffset={() => time() * -50}
            >
            </Line>)}
        </Node>
        <Line ref={ir_control_wire}
            points={[[-432, -198], [-432, 18]]}
            lineWidth={5} stroke={"#c2566e"}
            lineDash={[20, 20]} lineDashOffset={() => time() * 50}
        >
        </Line>
        <Line ref={pc_control_wire}
            points={[[40, 197], [40, 84]]}
            lineWidth={5} stroke={"#c2566e"}
            lineDash={[20, 20]} lineDashOffset={() => time() * 50}
        >
        </Line>
        <Line ref={mar_control_wire}
            points={[[-180, 259], [-180, 84]]}
            lineWidth={5} stroke={"#c2566e"}
            lineDash={[20, 20]} lineDashOffset={() => time() * 50}
        >
        </Line>
        <Line ref={mdr_control_wire}
            points={[[-310, 157], [-310, 84]]}
            lineWidth={5} stroke={"#c2566e"}
            lineDash={[20, 20]} lineDashOffset={() => time() * 50}
        >
        </Line>
        <Line ref={ram_control_wire}
            points={[[-550, 147], [-550, 84]]}
            lineWidth={5} stroke={"#c2566e"}
            lineDash={[20, 20]} lineDashOffset={() => time() * 50}
        >
        </Line>
        <Line ref={temp_y_control_wire}
            points={[[625, -307], [625, 18]]}
            lineWidth={5} stroke={"#c2566e"}
            lineDash={[20, 20]} lineDashOffset={() => time() * 50}
        >
        </Line>
        <Line ref={temp_z_control_wire}
            points={[[225, -198], [225, 18]]}
            lineWidth={5} stroke={"#c2566e"}
            lineDash={[20, 20]} lineDashOffset={() => time() * 50}
        >
        </Line>
        <Line ref={alu_control_wire}
            points={[[358, -216], [358, 18]]}
            lineWidth={5} stroke={"#c2566e"}
            lineDash={[20, 20]} lineDashOffset={() => time() * 50}
        >
        </Line>
        <Line ref={register_file_control_wire}
            points={[[440, 149], [440, 84]]}
            lineWidth={5} stroke={"#c2566e"}
            lineDash={[20, 20]} lineDashOffset={() => time() * 50}
        >
        </Line>

        <Line ref={pc_data_wire}
            points={[[0, 197], [0, -17]]}
            lineWidth={10} stroke={"#ae56c5"}
            startArrow endArrow arrowSize={15}
        >
        </Line>
        <Line ref={ir_ctrl_data_wire}
            points={[[-406, -231], [-316, -231]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15}
        >
        </Line>
        <Line ref={ir_data_wire}
            points={[[-472, -198], [-472, -83]]}
            lineWidth={10} stroke={"#ae56c5"}
            startArrow arrowSize={15}
        >
        </Line>
        <Line ref={mdr_data_wire}
            points={[[-350, 157], [-350, -17]]}
            lineWidth={10} stroke={"#ae56c5"}
            startArrow endArrow arrowSize={15}
        >
        </Line>
        <Line ref={mar_data_wire}
            points={[[-220, 257], [-220, -17]]}
            lineWidth={10} stroke={"#ae56c5"}
            startArrow arrowSize={15}
        >
        </Line>
        <Line ref={mdr_ram_data_wire}
            points={[[-416, 190], [-485, 190]]}
            lineWidth={10} stroke={"#ae56c5"}
            startArrow endArrow arrowSize={15}
        >
        </Line>
        <Line ref={mar_ram_data_wire}
            points={[[-286, 290], [-485, 290]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15}
        >
        </Line>
        <Line ref={temp_y_data_wire}
            points={[[585, -307], [585, -83]]}
            lineWidth={10} stroke={"#ae56c5"}
            startArrow arrowSize={15}
        >
        </Line>
        <Line ref={alu_data_wire}
            points={[[442, -209], [530, -209], [530, -83]]}
            lineWidth={10} stroke={"#ae56c5"}
            startArrow arrowSize={15}
        >
        </Line>
        <Line ref={temp_y_alu_data_wire}
            points={[[519, -340], [442, -340]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15}
        >
        </Line>
        <Line ref={alu_flags_data_wire}
            points={[[329, -260], [(329+251)/2, -260], [(329+251)/2, -231], [251, -231]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15}
        >
        </Line>
        <Line ref={alu_temp_z_data_wire}
            points={[[119, -331], [16, -331]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15}
        >
        </Line>
        <Line ref={flags_ctrl_data_wire}
            points={[[329, -295], [(329+251)/2, -295], [(329+251)/2, -331], [251, -331]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15}
        >
        </Line>
        <Line ref={temp_z_data_wire}
            points={[[185, -198], [185, -83]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15}
        >
        </Line>
        <Line ref={register_file_data_wire}
            points={[[400, 149], [400, -17]]}
            lineWidth={10} stroke={"#ae56c5"}
            startArrow endArrow arrowSize={15}
        >
        </Line>
    </>)

    internals().add(<>
        <Rect ref={control_label_mask}
            position={[40, 142]}
            rotation={90}
            size={[120, 60]}
            clip
        >
            <RoboticText ref={control_label}
                position={[-120, 0]}
                fontSize={50} fill={new Color("#c2566e").brighten(2)}
                text={"PC_in"}
            />
        </Rect>
        <Rect ref={control_label1_mask}
            position={[-180, 170]}
            rotation={90}
            size={[170, 60]}
            clip
        >
            <RoboticText ref={control_label1}
                position={[-170, 0]}
                fontSize={50} fill={new Color("#c2566e").brighten(2)}
                text={"MAR_in"}
            />
        </Rect>
        <Rect ref={control_label2_mask}
            position={[-550, 100]}
            rotation={90}
            size={[100, 60]}
            clip
        >
            <RoboticText ref={control_label2}
                position={[-160, 0]}
                fontSize={50} fill={new Color("#c2566e").brighten(2)}
                text={"MEM_read"}
            />
        </Rect>
        <Rect ref={data_label_mask}
            size={[1400, 400]}
            clip zIndex={6}
        >
            <RoboticText ref={data_label}
                position={[0, 240]}
                fontSize={50} fontStyle={""}
                fill={new Color("#ae56c5").brighten(1)}
                text={"0x1000"}
            />
        </Rect>
        <Rect ref={data_label2_mask}
            size={[1400, 400]}
            clip zIndex={6}
        >
            <RoboticText ref={data_label2}
                position={[-1400, -46]}
                fontSize={50} fontStyle={""}
                fill={new Color("#ae56c5").brighten(1)}
                text={"0x1000"}
            />
        </Rect>
        <Rect ref={data_label3_mask}
            size={[1400, 400]}
            clip zIndex={6}
        >
            <RoboticText ref={data_label3}
                position={[-1400, -46]}
                fontSize={50} fontStyle={""}
                fill={new Color("#ae56c5").brighten(1)}
                text={"0x1000"}
            />
        </Rect>
    </>)

    const looper = yield loopFor(Infinity, function*() {
        yield* backsquare().rotation(backsquare().rotation() + 360, 20, linear);
    });
    
    const instruction_mask = createRef<Layout>();
    const instruction_tri_fill = createRef<Line>();

    const vert_simp = new Vector2(30, 0)
    internals().add(<>
        <Layout ref={instruction_mask}
            position={[-330, 0]}
            size={[2000, 2000]} zIndex={7}
            clip
        >
            <Line ref={instruction_tri_fill}
                position={[-200, 190]}
                points={[vert_simp, vert_simp.rotate(120), vert_simp.rotate(-120)]}
                closed radius={6}
                fill={"#ffc0ff"} 
            />
        </Layout>
    </>);
    const instr_loop = yield loopFor(Infinity, function* () {
        yield* instruction_tri_fill().rotation(instruction_tri_fill().rotation() + 270, 5);
    })


    // Applying Stage 1
    const allthewires = [
        clock_control_wire,
        ir_control_wire,
        pc_control_wire,
        mar_control_wire,
        mdr_control_wire,
        ram_control_wire,
        alu_control_wire,
        temp_z_control_wire,
        temp_y_control_wire,
        register_file_control_wire,
        pc_data_wire,
        ir_ctrl_data_wire,
        ir_data_wire,
        mdr_data_wire,
        mar_data_wire,
        mdr_ram_data_wire,
        mar_ram_data_wire,
        temp_y_data_wire,
        temp_y_alu_data_wire,
        alu_data_wire,
        alu_temp_z_data_wire,
        alu_flags_data_wire,
        temp_z_data_wire,
        flags_ctrl_data_wire,
        register_file_data_wire,
    ];
    yield* all(
        ...allthewires.map(t => t().start(1, 0)),
        ...control_cbus_wires.map(t => t.end(0.2, 0)),
    );
    yield* all(
        control_bus().scale(0, 0), control_bus().rotation(45, 0),
        clock().scale(0, 0), clock().rotation(45, 0),
    );
    yield* all(
        internals().x(internals().x() - 50, 0),
        all(
            data_bus().size([800, 65], 0),
            data_bus().rotation(90, 0),
            data_bus().position([300, 0], 0),
        ),
        pc().position([-575, -281], 0),
        mdr().x(0, 0),
        mar().x(0, 0),
        ram().y((mdr().y() + mar().y()) / 2, 0),
        register_file().position([0, -50], 0),
        temp_y().position([645, 300], 0),
        all(
            alu().rotation(90, 0),
            alu().position([585, 130], 0),
        ),
        flags().position([670, -40], 0),
        temp_z().position([500, -40], 0),
        all(
            control_unit().x(575, 0),
            control_cbus_wire_bundle().x(725, 0),
        ),
        all(
            ir().position([0, -281], 0),
            instruction_tri_fill().position([330, -276], 0)
        ),
    );
    wires().removeChildren();
    wires().add(control_cbus_wire_bundle());
    
    // flags_ctrl_data_wire
    // temp_z_data_wire
    // alu_temp_z_data_wire
    // alu_flags_data_wire
    // temp_y_alu_data_wire
    // temp_y_data_wire
    // alu_data_wire
    // ir_ctrl_data_wire
    // pc_data_wire
    // register_file_data_wire
    // mdr_data_wire
    // mar_data_wire
    // mdr_ram_data_wire
    // mar_ram_data_wire
    const pc_ram_data_wire = createRef<Line>();
    const ram_prefetch_data_wire = createRef<Line>();
    const prefetch_ir_data_wire = createRef<Line>();

    const prefetch_buffer = createRef<Rect>(); const prefetch_label = createRef<Txt>();

    blocks().add(<>
        <Rect ref={prefetch_buffer}
            fill={"#4e2b4d"}
            position={[-300, -80]}
            // size={[450, 65]}
            lineWidth={4} clip
            stroke={"#d65d74"}
        >
            <RoboticText
                ref={prefetch_label} y={3}
                fill={"#d65d74"}
                fontSize={40}
                text={"Prefetch Buffer"}
            />
        </Rect>
    </>)
    wires().add(<>
        <Line ref={flags_ctrl_data_wire}
            points={[[670, -73], [670, -198]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={temp_z_data_wire}
            points={[[434, -40], [334, -40]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={alu_temp_z_data_wire}
            points={[[570, 74], [570, 34], [500, 34], [500, -6]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={alu_flags_data_wire}
            points={[[600, 74], [600, 34], [670, 34], [670, -6]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={temp_y_alu_data_wire}
            points={[[645, 264], [645, 186]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={temp_y_data_wire}
            points={[[334, 300], [579, 300]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={alu_data_wire}
            points={[[334, 250], [525, 250], [525, 186]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={ir_ctrl_data_wire}
            points={[[66, -281], [409, -281]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={pc_data_wire}
            points={[[267, -350], [-575, -350], [-575, -314]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={register_file_data_wire}
            points={[[126, -50], [267, -50]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={mdr_data_wire}
            points={[[267, 198], [65, 198]]}
            lineWidth={10} stroke={"#ae56c5"}
            startArrow endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={mar_data_wire}
            points={[[267, 298], [65, 298]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={mdr_ram_data_wire}
            points={[[-65, 198], [-485, 198]]}
            lineWidth={10} stroke={"#ae56c5"}
            startArrow endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={mar_ram_data_wire}
            points={[[-65, 298], [-485, 298]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={pc_ram_data_wire}
            points={[[-575, -248], [-575, 154]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={ram_prefetch_data_wire}
            points={[[-525, 154], [-525, 120], [-335, 120]]}
            lineWidth={10} stroke={"#ff6f91"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={prefetch_ir_data_wire}
            points={[[-266, -281], [-66, -281]]}
            lineWidth={10} stroke={"#ff6f91"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
    </>)
    yield* all(
        ...[flags_ctrl_data_wire,
            temp_z_data_wire,
            alu_temp_z_data_wire,
            alu_flags_data_wire,
            temp_y_alu_data_wire,
            temp_y_data_wire,
            alu_data_wire,
            ir_ctrl_data_wire,
            pc_data_wire,
            register_file_data_wire,
            mdr_data_wire,
            mar_data_wire,
            mdr_ram_data_wire,
            mar_ram_data_wire,
            pc_ram_data_wire,
        ].map(t => t().end(1, 0)),
    );
    yield* all(
        prefetch_buffer().size([450, 65], 0),
        prefetch_buffer().rotation(90, 0),
        ...[ram_prefetch_data_wire, prefetch_ir_data_wire,].map(t => t().end(1, 0)),
    );

    // Applying Stage 2

    // temp_z_data_wire
    // alu_temp_z_data_wire
    // alu_flags_data_wire
    // temp_y_alu_data_wire
    // temp_y_data_wire
    // alu_data_wire
    // register_file_data_wire
    // mdr_data_wire
    // mar_data_wire
    // pc_data_wire
    
    yield* all(
        ...[
            flags_ctrl_data_wire,
            temp_z_data_wire,
            alu_temp_z_data_wire,
            alu_flags_data_wire,
            temp_y_alu_data_wire,
            temp_y_data_wire,
            alu_data_wire,
            register_file_data_wire,
            mdr_data_wire,
            mar_data_wire,
            pc_data_wire,
            mdr_ram_data_wire,
            mar_ram_data_wire,
        ].map(t => t().start(1, 0)),
        ...control_cbus_wires.map(t => t.end(0, 0)),
    )
    
    wires().removeChildren();
    
    // ir_ctrl_data_wire
    // pc_ram_data_wire
    // ram_prefetch_data_wire
    // prefetch_ir_data_wire
    // mdr_ram_data_wire
    // mar_ram_data_wire
    // flags_ctrl_data_wire

    const alu_pc_data_wire = createRef<Line>();
    const alu_regfile_data_wire = createRef<Line>();
    const alu_mdr_data_wire = createRef<Line>();
    const control_unit_buffer_data_wire = createRef<Line>();
    const regfile_control_buffer_data_wire = createRef<Line>();
    const control_buffer_alu_data_wire_1 = createRef<Line>();
    const control_buffer_alu_data_wire_2 = createRef<Line>();
    const control_buffer_mdr_data_wire = createRef<Line>();
    const control_buffer_mar_data_wire = createRef<Line>();


    const control_buffer = createRef<Rect>(); const control_buffer_label = createRef<Txt>();

    blocks().add(<>
        <Rect ref={control_buffer}
            fill={"#4e2b4d"}
            position={[350, -80]}
            // size={[450, 65]}
            lineWidth={4} clip
            stroke={"#d65d74"}
        >
            <RoboticText
                ref={control_buffer_label} y={3}
                fill={"#d65d74"}
                fontSize={40}
                text={"Control Buffer"}
            />
        </Rect>
    </>)
    wires().add(<>
        {ir_ctrl_data_wire()}
        {pc_ram_data_wire()}
        {ram_prefetch_data_wire()}
        {prefetch_ir_data_wire()}
        <Line ref={mar_ram_data_wire}
            points={[[514, 195], [514, 248+40], [-485, 248+40]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={mdr_ram_data_wire}
            points={[[629, 99], [629, 248+93/2+40], [-485, 248+93/2+40]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={alu_pc_data_wire}
            points={[[640, -170], [750, -170], [750, -400], [-575, -400], [-575, -315],]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={alu_regfile_data_wire}
            points={[[750, -170], [750, 240], [-50, 240], [-50, 105],]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={alu_mdr_data_wire}
            points={[[750, 60], [695, 60],]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={flags_ctrl_data_wire}
            points={[[75, -166], [75, -214]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={control_unit_buffer_data_wire}
            points={[[206, -281], [317, -281]]}
            lineWidth={10} stroke={"#ff6f91"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={regfile_control_buffer_data_wire}
            points={[[131, -30], [317, -30]]}
            lineWidth={10} stroke={"#ff6f91"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={control_buffer_alu_data_wire_1}
            points={[[384, -230], [529, -230]]}
            lineWidth={10} stroke={"#ff6f91"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={control_buffer_alu_data_wire_2}
            points={[[384, -110], [529, -110]]}
            lineWidth={10} stroke={"#ff6f91"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={control_buffer_mdr_data_wire}
            points={[[384, 60], [563, 60]]}
            lineWidth={10} stroke={"#ff6f91"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={control_buffer_mar_data_wire}
            points={[[384, 155], [449, 155]]}
            lineWidth={10} stroke={"#ff6f91"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
    </>);

    yield* all(
        all(
            ram_prefetch_data_wire().points([[-525, 154], [-525, 120], [-432, 120]], 0),
            prefetch_buffer().x(prefetch_buffer().x() - 100, 0),
            prefetch_ir_data_wire().points([[-366, -281], [-266, -281]], 0),
            ir().x(ir().x() - 200, 0),
            instruction_tri_fill().x(instruction_tri_fill().x() - 200, 0),
            ir_ctrl_data_wire().points([[-133, -281], [-57, -281]], 0),
            control_unit().scale(0.8, 0),
            control_unit().x(control_unit().x() - 500, 0),
        ),

        all(
            register_file().y(register_file().y() + 20, 0),
            register_file().x(register_file().x() - 50, 0),
            register_file().scale(0.9, 0),
            // register_file_data_wire
        ),
        all(
            register_file().width(400, 0),
            register_file_label().x(register_file_label().x() - 75, 0),
            simple_register_container().x(simple_register_container().x() - 75, 0),
            chain(
                run(function* () {
                    flags().zIndex(10);
                    yield* all(
                        flags().scale(0.9, 0),
                        flags().position([50, -120], 0)
                    )
                }),
                
                run(function* () {
                    const cachedpos = flags().absolutePosition();
                    flags().remove();
                    register_file().add(flags());
                    flags().scale(1);
                    flags().absolutePosition(cachedpos);
                }),
            )
        ),
        all(
            ...[data_bus, temp_y, temp_z].map(t => all(
                t().scale(0, 0),
                t().rotation(90, 0),
            )),
        ),
        all(
            alu().rotation(180, 0),
            alu().y(alu().y() - 300, 0),
        ),
        all(
            mdr().position([629, 60], 0),
            mar().position([514, 155], 0),
        ),
    );
    yield* all(
        mar_ram_data_wire().end(1, 0),
        mdr_ram_data_wire().end(1, 0),
        alu_pc_data_wire().end(1, 0),
        alu_regfile_data_wire().end(1, 0),
        alu_mdr_data_wire().end(1, 0),
        flags_ctrl_data_wire().end(1, 0),
    );
    yield* all(
        control_buffer().size([550, 65], 0),
        control_buffer().rotation(90, 0),
        all(
            control_unit_buffer_data_wire().end(1, 0),
            regfile_control_buffer_data_wire().end(1, 0),
            control_buffer_alu_data_wire_1().end(1, 0),
            control_buffer_alu_data_wire_2().end(1, 0),
            control_buffer_mdr_data_wire().end(1, 0),
            control_buffer_mar_data_wire().end(1, 0),
        ),
        ram().y(ram().y() + 8, 0),
    );
    
    
    yield* all(
        ...[
            mdr_ram_data_wire,
            mar_ram_data_wire,
            alu_pc_data_wire,
            alu_mdr_data_wire,
            alu_regfile_data_wire,
            control_buffer_mar_data_wire,
            control_buffer_mdr_data_wire,
        ].map(t => chain(
            t().start(1, 0),
            run(function* () {
                t().remove();
            })
        )),
        mar().y(mar().y() + 300, 0),
        mdr().y(mdr().y() + 300, 0),
        control_buffer().size([450, 65], 0),
        all(
            pc().x(pc().x() - 30, 0),
            pc_ram_data_wire().points([[-575-30, -248], [-575-30, 154]], 0),
            ram().x(ram().x() - 30, 0),
            prefetch_buffer().x(prefetch_buffer().x() - 50, 0),
            ram_prefetch_data_wire().points([[-525-30, 154], [-525-30, 120], [-452-30, 120]], 0),
            prefetch_ir_data_wire().points([[-386-30, -281], [-306-30, -281]], 0),
            ir().x(ir().x() - 70, 0),
            instruction_tri_fill().x(instruction_tri_fill().x() - 70, 0),
            ir_ctrl_data_wire().points([[-173-30, -281], [-97-40, -281]], 0),
            control_unit().x(control_unit().x() - 105, 0),
            control_unit().size(control_unit().size().scale(0.8), 0),
            control_unit_label().fontSize(control_unit_label().fontSize() - 10, 0),
            register_file().x(register_file().x() - 90, 0),
            flags_ctrl_data_wire().points([[-30, -166], [-30, -227]], 0),
            control_buffer().x(control_buffer().x() - 180, 0),
            regfile_control_buffer_data_wire().points([[11, -30], [197-60, -30]], 0),
            control_unit_buffer_data_wire().points([[76, -281], [197-60, -281]], 0),
            alu().x(alu().x() - 240, 0),
            control_buffer_alu_data_wire_1().points([[384-180, -230], [529-240, -230]], 0),
            control_buffer_alu_data_wire_2().points([[384-180, -110], [529-240, -110]], 0),
        )
    )
    // yield* internals().x(internals().x() - 60, 0);

    const alu_outputbuffer_data_wire = createRef<Line>();
    const controlbuffer_outputbuffer_data_wire = createRef<Line>();
    const outputbuffer_pc_data_wire = createRef<Line>();
    const outputbuffer_mar_data_wire = createRef<Line>();
    const outputbuffer_mdr_data_wire = createRef<Line>();
    // mdr_ram_data_wire
    // mar_ram_data_wire
    const mdr_finalbuffer_data_wire = createRef<Line>();
    const outputbuffer_finalbuffer_data_wire = createRef<Line>();
    const finalbuffer_regfile_data_wire = createRef<Line>();

    const output_buffer = createRef<Rect>(); const output_buffer_label = createRef<Txt>();
    const final_buffer = createRef<Rect>(); const final_buffer_label = createRef<Txt>();

    blocks().add(<>
        <Rect ref={output_buffer}
            fill={"#4e2b4d"}
            position={[500, -80]}
            // size={[450, 65]}
            lineWidth={4} clip
            stroke={"#d65d74"}
        >
            <RoboticText
                ref={output_buffer_label} y={3}
                fill={"#d65d74"}
                fontSize={40}
                text={"Output Buffer"}
            />
        </Rect>
        <Rect ref={final_buffer}
            fill={"#4e2b4d"}
            position={[850, -80]}
            // size={[450, 65]}
            lineWidth={4} clip
            stroke={"#d65d74"}
        >
            <RoboticText
                ref={final_buffer_label} y={3}
                fill={"#d65d74"}
                fontSize={40}
                text={"Final Buffer"}
            />
        </Rect>
    </>)
    wires().add(<>
        <Line ref={alu_outputbuffer_data_wire}
            points={[[400, -170], [466, -170]]}
            lineWidth={10} stroke={"#ff6f91"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={controlbuffer_outputbuffer_data_wire}
            points={[[203, 40], [466, 40]]}
            lineWidth={10} stroke={"#ff6f91"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={outputbuffer_pc_data_wire}
            points={[[500, -306], [500, -380], [-605, -380], [-605, -314]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={outputbuffer_mdr_data_wire}
            points={[[533, 0], [648, 0]]}
            lineWidth={10} stroke={"#ff6f91"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={outputbuffer_mar_data_wire}
            points={[[533, 100], [578, 100]]}
            lineWidth={10} stroke={"#ff6f91"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={mdr_ram_data_wire}
            points={[[700, 26], [700, 275], [-515, 275]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={mar_ram_data_wire}
            points={[[630, 126], [630, 225], [-515, 225]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={mdr_finalbuffer_data_wire}
            points={[[752, 0], [817, 0]]}
            lineWidth={10} stroke={"#ff6f91"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={outputbuffer_finalbuffer_data_wire}
            points={[[534, -120], [817, -120]]}
            lineWidth={10} stroke={"#ff6f91"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={finalbuffer_regfile_data_wire}
            points={[[883, -80], [940, -80], [940, 350], [-140, 350], [-140, 105]]}
            lineWidth={10} stroke={"#ff6f91"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
    </>)

    yield* all(output_buffer().size([450, 65], 0), output_buffer().rotation(90, 0));
    yield* all(
        alu_outputbuffer_data_wire().end(1, 0),
        controlbuffer_outputbuffer_data_wire().end(1, 0),
        outputbuffer_pc_data_wire().end(1, 0),
    )

    yield* internals().x(-120, 0);
    yield* all(
        mdr().scale(0.8, 0),
        mar().scale(0.8, 0),
        mdr().position([700, 0], 0),
        mar().position([630, 100], 0),
    );
    yield* all(
        outputbuffer_mdr_data_wire().end(1, 0),
        outputbuffer_mar_data_wire().end(1, 0),
        mdr_ram_data_wire().end(1, 0),
        mar_ram_data_wire().end(1, 0),
        mdr_finalbuffer_data_wire().end(1, 0),
        outputbuffer_finalbuffer_data_wire().end(1, 0),
    );
    
    yield* all(final_buffer().size([450, 65], 0), final_buffer().rotation(90, 0));
    yield* all(internals().scale(0.95, 0), internals().x(internals().x()-60, 0));
    yield* finalbuffer_regfile_data_wire().end(1, 0);




    const outputbuffer_decode_data_wire = createRef<Line>();
    const finalbuffer_decode_data_wire = createRef<Line>();
    wires().add(<>
        <Line ref={outputbuffer_decode_data_wire}
            points={[[600, 146], [600, 225], [80, 225], [80, 40], [136, 40]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={finalbuffer_decode_data_wire}
            points={[[950, 146], [950, 225], [80, 225], [80, 10], [136, 10]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
    </>);

    const shift = 100;
    yield* all(
        final_buffer().x(final_buffer().x()+shift, 0),
        output_buffer().x(output_buffer().x()+shift, 0),
        control_buffer().x(control_buffer().x()+shift, 0),
        mar().x(mar().x()+shift, 0),
        mdr().x(mdr().x()+shift, 0),
        alu().x(alu().x()+shift, 0),
        mdr_ram_data_wire().points([[700+shift, 26], [700+shift, 310], [-515, 310]], 0),
        mar_ram_data_wire().points([[630+shift, 126], [630+shift, 265], [-515, 265]], 0),
        control_unit_buffer_data_wire().points([[76, -281], [197-60+shift, -281]], 0),
        alu_outputbuffer_data_wire().points([[400+shift, -170], [466+shift, -170]], 0),
        control_buffer_alu_data_wire_1().points([[384-180+shift, -230], [529-240+shift, -230]], 0),
        control_buffer_alu_data_wire_2().points([[384-180+shift, -110], [529-240+shift, -110]], 0),
        controlbuffer_outputbuffer_data_wire().points([[203+shift, 40], [466+shift, 40]], 0),
        outputbuffer_pc_data_wire().points([[500+shift, -306], [500+shift, -380], [-605, -380], [-605, -314]], 0),
        outputbuffer_mdr_data_wire().points([[533+shift, 0], [648+shift, 0]], 0),
        outputbuffer_mar_data_wire().points([[533+shift, 100], [578+shift, 100]], 0),
        mdr_finalbuffer_data_wire().points([[752+shift, 0], [817+shift, 0]], 0),
        outputbuffer_finalbuffer_data_wire().points([[534+shift, -120], [817+shift, -120]], 0),
        finalbuffer_regfile_data_wire().points([[883+shift, -80], [940+shift, -80], [940+shift, 350], [-140, 350], [-140, 105]], 0),
        regfile_control_buffer_data_wire().stroke("#ae56c5", 0),
    );
    yield* outputbuffer_decode_data_wire().end(1, 0);
    
    const selectblock = createRef<Rect>(); const selectblock_label = createRef<Txt>();
    const selectblock_controlbuffer_data_wire = createRef<Line>();
    blocks().add(<>
        <Rect ref={selectblock}
            fill={"#492b61"}
            position={[160, 0]}
            // size={[450, 65]}
            lineWidth={4} clip
            stroke={"#ae56c5"}
        >
            <RoboticText
                ref={selectblock_label} y={3}
                fill={"#ae56c5"}
                fontSize={30}
                text={"Select"}
            />
        </Rect>
    </>);
    wires().add(<>
        <Line ref={selectblock_controlbuffer_data_wire}
            points={[[184, 0], [237, 0]]}
            lineWidth={10} stroke={"#d65d74"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
    </>)
    yield* all(selectblock().size([150, 45], 0), selectblock().rotation(90, 0));
    yield* selectblock_controlbuffer_data_wire().end(1, 0);

    yield* all(
        outputbuffer_decode_data_wire().points([[600, 146], [600, 200], [100, 200], [100, 50], [136, 50]], 0),
        finalbuffer_decode_data_wire().end(1, 0),
    );

    const pc_incr_data_wire = createRef<Line>();
    const incr_select_data_wire = createRef<Line>();
    const prefetchbuffer_select_data_wire = createRef<Line>();
    const select_pc_data_wire = createRef<Line>();
    const guess_select_control_wire = createRef<Line>();
    
    const pcselectblock = createRef<Rect>(); const pcselectblock_label = createRef<Txt>();
    const pcincrementblock = createRef<Rect>(); const pcincrementblock_label = createRef<Txt>();
    const guessblock = createRef<Rect>(); const guessblock_label = createRef<Txt>();
    blocks().add(<>
        <Rect ref={pcselectblock}
            fill={"#492b61"}
            position={[-606, -380]}
            // size={[450, 65]}
            lineWidth={4} clip
            stroke={"#ae56c5"}
        >
            <RoboticText
                ref={pcselectblock_label} y={3}
                fill={"#ae56c5"}
                fontSize={30} fontStyle={""}
                text={"Select"}
            />
        </Rect>
        <Rect ref={pcincrementblock}
            fill={"#4e2b4d"}
            position={[-710, -281]}
            // size={[65, 65]}
            lineWidth={4} clip rotation={90}
            stroke={"#d65d74"}
        >
            <RoboticText
                ref={pcincrementblock_label} y={3}
                fill={"#d65d74"} fontStyle={""}
                fontSize={50}
                text={"+"}
            />
        </Rect>
        <Rect ref={guessblock}
            fill={"#4e2b4d"}
            position={[-606, -460]}
            // size={[450, 65]}
            lineWidth={4} clip
            stroke={"#ff6f91"}
        >
            <RoboticText
                ref={guessblock_label} y={3}
                fill={"#ff6f91"}
                fontSize={30} fontStyle={""}
                text={"Guess"}
            />
        </Rect>
    </>);
    wires().add(<>
        <Line ref={pc_incr_data_wire}
            points={[[-605, -220], [-710, -220], [-710, -260]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={incr_select_data_wire}
            points={[[-710, -302], [-710, -380], [-605, -380], [-605, -315]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={prefetchbuffer_select_data_wire}
            points={[[-450, -305], [-450, -360], [-555, -360]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={select_pc_data_wire}
            points={[[-606, -349], [-606, -315]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={guess_select_control_wire}
            points={[[-606, -429], [-606, -411]]}
            lineWidth={10} stroke={"ff6f91"}
            arrowSize={15} end={0}
            lineDash={[10,10]} lineDashOffset={() => time() * -10}
        >
        </Line>
    </>)
    yield* all(
        pcincrementblock().size(40, 0),
        pcincrementblock().rotation(0, 0)
    )
    yield* all(
        pc_incr_data_wire().end(1, 0),
        outputbuffer_pc_data_wire().end(0.9, 0),
        incr_select_data_wire().end(1, 0),
    );

    yield* all(
        internals().scale(0.9, 0),
        internals().x(internals().x() + 30, 0),
        internals().y(internals().y() + 30, 0),
    );
    yield* all(
        pcselectblock().size([100, 60], 0),
        incr_select_data_wire().points([[-710, -302], [-710, -380], [-657, -380], ], 0),
        outputbuffer_pc_data_wire().points([[600, -306], [600, -400], [-555, -400],], 0),
        outputbuffer_pc_data_wire().end(1, 0),
    )
    yield* all(
        prefetchbuffer_select_data_wire().end(1, 0),
        select_pc_data_wire().end(1, 0),
    );
    yield* guessblock().size([100, 60], 0);
    yield* guess_select_control_wire().end(1, 0);

    // #endregion Computer Stuff
    
    yield* all(
        computer_stuff().x(0, 1.2),
        diagram_stuff().x(2000, 1.2),
    );
    yield* waitFor(0.5);
    yield* chain(
        run(function* () { ram().zIndex(10); }),
        all(
            ram().scale(1.8, 1.2).back(1.2),
            ram().stroke("yellow", 1.2).back(1.2),
            ram_label().fill("yellow", 1.2).back(1.2),
            wiggle(ram().rotation, -10, 10, 2.4),
            ram().fill("#76692e", 1.2).back(1.2),
        ),
        run(function* () { ram().zIndex(0); }),
    );


    yield* waitUntil("instructionsanddata");
    const instruction_thing = createRef<Txt>();
    const data_thing = createRef<Txt>();
    view.add(<>
        <RoboticText ref={instruction_thing}
            fill={"#c457a5"}
            fontSize={100} scale={0}
            position={[0, 400]}
            text={"Instruction"}
        />
        <RoboticText ref={data_thing}
            fill={"#c457a5"}
            fontSize={100} scale={0}
            position={[0, 400]}
            text={"Data"}
        />
    </>);
    yield* sequence(0.5,
        all(
            instruction_thing().scale(1, 0.6, easeOutCirc).to(0, 1.2, easeInCirc),
            instruction_thing().position(instruction_thing().position(), 0.6).to(ram().right().addX(-300), 1.8),
        ),
        all(
            data_thing().scale(1, 0.6, easeOutCirc).to(0, 1.2, easeInCirc),
            data_thing().position(data_thing().position(), 0.6).to(ram().right().addX(-300), 1.8),
        ),
    );

    yield* waitUntil("eitheraninstruction");
    pc_ram_data_wire().zIndex(10);
    yield* loop(4, function*() {
        yield* all(
            pc_ram_data_wire().stroke("yellow", 0.6).back(0.6),
            pc_ram_data_wire().lineWidth(pc_ram_data_wire().lineWidth() + 10, 0.6).back(0.6),
            pc_ram_data_wire().arrowSize(pc_ram_data_wire().arrowSize() + 10, 0.6).back(0.6),
        )
    });
    pc_ram_data_wire().zIndex(0);
    
    yield* waitUntil("orsomedata");
    mar_ram_data_wire().zIndex(10);
    yield* loop(2, function*() {
        yield* all(
            mar_ram_data_wire().stroke("yellow", 0.6).back(0.6),
            mar_ram_data_wire().lineWidth(mar_ram_data_wire().lineWidth() + 10, 0.6).back(0.6),
            mar_ram_data_wire().arrowSize(mar_ram_data_wire().arrowSize() + 10, 0.6).back(0.6),
        );
        yield* waitFor(0.5);
    });
    mar_ram_data_wire().zIndex(0);

    yield* waitUntil("topipeline");
    yield* all(
        diagram_stuff().x(0, 1.2),
        computer_stuff().x(-2000, 1.2),
    );

    yield* waitUntil("memoryaccess_coincides");
    const t4_vertigrad = createSignal(0);
    const t9_vertigrad = createSignal(0);
    
    simple_verti_lines[3].stroke(() => new Gradient({
        type: "linear",
        fromY: -365,
        toY:    340,
        stops: [
            { offset: 0, color: "yellow" },
            { offset: t4_vertigrad(), color: "yellow"  },
            { offset: t4_vertigrad(), color: "#0b3a65" },
            { offset: 1, color: "#0b3a65" },
        ]
    }));
    simple_verti_lines[4].stroke(() => new Gradient({
        type: "linear",
        fromY: -365,
        toY:    340,
        stops: [
            { offset: 0, color: "yellow" },
            { offset: t4_vertigrad(), color: "yellow"  },
            { offset: t4_vertigrad(), color: "#0b3a65" },
            { offset: 1, color: "#0b3a65" },
        ]
    }));

    simple_verti_lines[8].stroke(() => new Gradient({
        type: "linear",
        fromY: -365,
        toY:    340,
        stops: [
            { offset: 0, color: "yellow" },
            { offset: t9_vertigrad(), color: "yellow"  },
            { offset: t9_vertigrad(), color: "#0b3a65" },
            { offset: 1, color: "#0b3a65" },
        ]
    }));
    simple_verti_lines[9].stroke(() => new Gradient({
        type: "linear",
        fromY: -365,
        toY:    340,
        stops: [
            { offset: 0, color: "yellow" },
            { offset: t9_vertigrad(), color: "yellow"  },
            { offset: t9_vertigrad(), color: "#0b3a65" },
            { offset: 1, color: "#0b3a65" },
        ]
    }));
    yield* sequence(0.2,
        all(
            timestep_names[3].fill("yellow", 0.8),
            t4_vertigrad(1, 0.8),
        ),
        
        all(
            timestep_names[8].fill("yellow", 0.8),
            t9_vertigrad(1, 0.8),
        )
    );

    yield* waitUntil("fetchingI4");
    yield* sequence(0.4,
        highlight_block(15),
        highlight_block(3),
    );
    yield* waitUntil("unhighlightts");
    yield* sequence(0.2,
        all(
            timestep_names[8].fill("#59b1f4", 0.8),
            t9_vertigrad(0, 0.8),
        ),
        all(
            timestep_names[3].fill("#59b1f4", 0.8),
            t4_vertigrad(0, 0.8),
        ),
    );

    yield* waitUntil("stallinganoption");
    yield* sequence(0.01,
        ...central_blocks.slice(15).toReversed().map(t => t.x(t.x() + 130, 0.8)),
    )
    yield* waitFor(1);
    yield* sequence(0.01,
        ...central_blocks.slice(15).map(t => t.x(t.x() - 130, 0.8)),
    );
    
    yield* waitUntil("usingcaches");
    const caches_title = createRef<Txt>();
    view.add(<RoboticText ref={caches_title}
        fill={"#5fadff"}
        fontSize={120}
        x={-1500}
        text={"Caches"}
    />)
    caches_title().position([-2000, 0]);
    yield* waitFor(0.5);
    yield* all(
        diagram_stuff().x(2000, 1.2),
        sequence(0.3,
            caches_title().x(0, 1.2),
            caches_title().fontSize(200, 1.2),
        )
    );
    yield* waitFor(1);
    yield* internals().y(internals().y() + 30, 0);
    yield* all(
        sequence(0.1,
            caches_title().fontSize(60, 1.2),
            caches_title().x(2000, 1.2),
        ),
        computer_stuff().x(0, 1.2),
    );

    yield* waitUntil("separatecaches");
    yield* sequence(0.05,
        all(
            ram().scale(0, 0.5),
            ram().rotation(90, 0.5),
        ),
        mar_ram_data_wire().end(0, 0.5),
        mdr_ram_data_wire().end(0, 0.5),
        pc_ram_data_wire().points([[-575-30, -248], [-575-30, 54]], 0.5),
        ram_prefetch_data_wire().points([[-539, 120], [-452-30, 120]], 0.5),
    );
    mar_ram_data_wire().remove(); mar_ram_data_wire().dispose();
    mdr_ram_data_wire().remove(); mdr_ram_data_wire().dispose();

    const icache = createRef<Rect>(); const icache_label = createRef<Txt>();
    const dcache = createRef<Rect>(); const dcache_label = createRef<Txt>();
    const mar_dcache_data_wire = createRef<Line>();
    const mdr_dcache_data_wire = createRef<Line>();
    blocks().add(<>
        <Rect ref={icache}
            fill={"#532d5a"}
            position={[-605, 120]}
            size={[130, 130]} scale={0}
            lineWidth={4} rotation={90}
            stroke={"#c457a5"}
        >
            <RoboticText
                ref={icache_label} y={4}
                fill={cosmic_grad_ramps[1][0]}
                fontSize={40} fontStyle={""}
                text={"iCache"}
            />
        </Rect>
        <Rect ref={dcache}
            fill={"#532d5a"}
            position={[775, -150]}
            size={[130, 130]} scale={0}
            lineWidth={4} rotation={90}
            stroke={"#c457a5"}
        >
            <RoboticText
                ref={dcache_label} y={4}
                fill={cosmic_grad_ramps[1][0]}
                fontSize={40} fontStyle={""}
                text={"dCache"}
            />
        </Rect>
    </>);
    wires().add(<>
        <Line ref={mdr_dcache_data_wire}
            points={[[825, -2], [825, -84]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow startArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={mar_dcache_data_wire}
            points={[[730, 73], [730, -84]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
    </>)
    yield* sequence(0.05,
        finalbuffer_regfile_data_wire().points([[883+100, -80], [940+100, -80], [940+100, 250], [-140, 250], [-140, 105]], 0.5),
        outputbuffer_finalbuffer_data_wire().points([[534+100, -120-150], [817+100, -120-150]], 0.5),
        all(
            mdr().x(mdr().x() + 25, 0.5), mdr().y(mdr().y() + 25, 0.5),
            outputbuffer_mdr_data_wire().points([[533+100, 25], [648+100+25, 25]], 0.5),
            mdr_finalbuffer_data_wire().points([[752+100+25, 25], [817+100, 25]], 0.5),
        ),
    );
    yield* all(
        icache().scale(1, 0.5),
        icache().rotation(0, 0.5),
    )
    yield* waitFor(4);
    yield* sequence(0.1,
        all(
            dcache().scale(1, 0.5),
            dcache().rotation(0, 0.5),
        ),
        mdr_dcache_data_wire().end(1, 0.5),
        mar_dcache_data_wire().end(1, 0.5),
    );

    yield* waitUntil("removememarker_in");
    const redremoveme = createRef<Txt>();
    view.add(<>
        <RoboticText ref={redremoveme}
            fontSize={250}
            fill={"red"}
            fontStyle={""}
            text={"REMOVE THIS PART"}
        />
    </>)
    yield* waitUntil("removememarker_out");
    redremoveme().remove();

    yield* waitUntil("workatthesametime");
    yield* sequence(0.1,
        chain(
            run(function* () { icache().zIndex(10) }),
            all(
                icache().scale(1.8, 1.2).back(1.2),
                icache().stroke("yellow", 1.2).back(1.2),
                icache_label().fill("yellow", 1.2).back(1.2),
                wiggle(icache().rotation, -10, 10, 2.4),
                icache().fill("#76692e", 1.2).back(1.2),
            ),
            run(function* () { icache().zIndex(0)  }),
        ),
        chain(
            run(function* () { dcache().zIndex(10) }),
            all(
                dcache().scale(1.8, 1.2).back(1.2),
                dcache().stroke("yellow", 1.2).back(1.2),
                dcache_label().fill("yellow", 1.2).back(1.2),
                wiggle(dcache().rotation, -10, 10, 2.4),
                dcache().fill("#76692e", 1.2).back(1.2),
            ),
            run(function* () { dcache().zIndex(0)  }),
        ),
    );

    yield* waitUntil("reachouttoram");
    ram().position([400, 380])
    yield* all(
        ram().scale(1, 0.5),
        ram().rotation(0, 0.5),
    );
    const beamingthingsin = createRefArray<Line>();
    internals().add(<>
        <Line ref={beamingthingsin}
            points={[
                ram().position().add([-25, 25]),
                Vector2.lerp(ram().position().add([-5,5]), icache().position().add([-5,5]), 0.2),
                Vector2.lerp(ram().position().add([-5,5]), icache().position().add([-5,5]), 0.8),
                icache().position().add([-25, 25]),
            ]}
            lineDash={[100, 20]} lineDashOffset={() => time() * -100 }
            lineWidth={2} zIndex={-1}
            stroke={"red"} shadowBlur={20} shadowColor={"red"} end={(0)}
        ></Line>
        <Line ref={beamingthingsin}
            points={[
                ram().position().add([-0, -0]),
                Vector2.lerp(ram().position(), icache().position(), 0.2),
                Vector2.lerp(ram().position(), icache().position(), 0.8),
                icache().position().add([-0, -0]),
            ]}
            lineDash={[100, 20]} lineDashOffset={() => time() * -100 }
            lineWidth={2}
            stroke={"red"} shadowBlur={20} shadowColor={"red"} end={(0)}
        ></Line>
        <Line ref={beamingthingsin}
            points={[
                ram().position().add([-25, -25]),
                Vector2.lerp(ram().position().add([-5,-5]), icache().position().add([-5,-5]), 0.2),
                Vector2.lerp(ram().position().add([-5,-5]), icache().position().add([-5,-5]), 0.8),
                icache().position().add([-25, -25]),
            ]}
            lineDash={[100, 20]} lineDashOffset={() => time() * -100 }
            lineWidth={2}
            stroke={"red"} shadowBlur={20} shadowColor={"red"} end={(0)}
        ></Line>
        <Line ref={beamingthingsin}
            points={[
                ram().position().add([-25, 25]),
                Vector2.lerp(ram().position().add([-5,5]), dcache().position().add([-5,5]), 0.2),
                Vector2.lerp(ram().position().add([-5,5]), dcache().position().add([-5,5]), 0.8),
                dcache().position().add([-25, 25]),
            ]}
            lineDash={[100, 20]} lineDashOffset={() => time() * -100 }
            lineWidth={2}
            stroke={"red"} shadowBlur={20} shadowColor={"red"} end={(0)}
        ></Line>
        <Line ref={beamingthingsin}
            points={[
                ram().position().add([-0, -0]),
                Vector2.lerp(ram().position(), dcache().position(), 0.2),
                Vector2.lerp(ram().position(), dcache().position(), 0.8),
                dcache().position().add([-0, -0]),
            ]}
            lineDash={[100, 20]} lineDashOffset={() => time() * -100 }
            lineWidth={2}
            stroke={"red"} shadowBlur={20} shadowColor={"red"} end={(0)}
        ></Line>
        <Line ref={beamingthingsin}
            points={[
                ram().position().add([-25, -25]),
                Vector2.lerp(ram().position().add([-5,-5]), dcache().position().add([-5,-5]), 0.2),
                Vector2.lerp(ram().position().add([-5,-5]), dcache().position().add([-5,-5]), 0.8),
                dcache().position().add([-25, -25]),
            ]}
            lineDash={[100, 20]} lineDashOffset={() => time() * -100}
            lineWidth={2}
            stroke={"red"} shadowBlur={20} shadowColor={"red"} end={(0)}
        ></Line>
    </>);
    yield* sequence(0.1,
        all(
            ...beamingthingsin.slice(0, 3).map(t => chain(
                t.end(1, 0.5).wait(0.8),
                t.start(1, 0.5),
            ))
        ),
        all(
            ...beamingthingsin.slice(3, 6).map(t => chain(
                t.end(1, 0.5).wait(0.8),
                t.start(1, 0.5),
            ))
        )
    )
    yield* waitFor(0.5);
    beamingthingsin.forEach(t => t.lineDashOffset(() => time() * 100))
    yield* sequence(0.1,
        all(
            ...beamingthingsin.slice(0, 3).map(t => chain(
                t.start(0, 0.5).wait(0.8),
                t.end(0, 0.5),
            ))
        ),
        all(
            ...beamingthingsin.slice(3, 6).map(t => chain(
                t.start(0, 0.5).wait(0.8),
                t.end(0, 0.5),
            ))
        )
    );
    yield* waitUntil("severallevels");
    yield* all(
        ram().scale(0, 0.5),
        ram().rotation(90, 0.5),
        
        computer().right(computer().right(), 1.2),
        computer_panel_highlight_in().right(computer_panel_highlight_in().right(), 1.2),
        computer_panel_highlight_out().right(computer_panel_highlight_out().right(), 1.2),
        computer().scale(0.9, 1.2),
        computer_panel_highlight_in().scale(0.9, 1.2),
        computer_panel_highlight_out().scale(0.9, 1.2),
    );
    yield* waitUntil("doneseverallevels");
    yield* all(
        computer().right(computer().right(), 1.2),
        computer_panel_highlight_in().right(computer_panel_highlight_in().right(), 1.2),
        computer_panel_highlight_out().right(computer_panel_highlight_out().right(), 1.2),
        computer().scale(1, 1.2),
        computer_panel_highlight_in().scale(1, 1.2),
        computer_panel_highlight_out().scale(1, 1.2),
    );

    yield* waitUntil("cachesuseful");
    yield* computer_stuff().x(-2000, 1.2);
    const caches_txt = createRef<Txt>();
    
    const back_node = createRef<Node>();
    const back_rect = createRef<Rect>();
    const back_rect_out_highlight = createRef<Rect>();
    const spotlight_parent = createRef<Node>();
    const extension_backing = createRefArray<Line>();
    view.add(<>
        <Node ref={back_node}
            position={[0, -400]}
            zIndex={0}
        >
            <Rect ref={back_rect}
                // size={180}
                zIndex={-1}
                fill={"#0b3c6c"}
                rotation={45}
            />
            <Rect ref={back_rect_out_highlight}
                // size={200}
                stroke={"#007ed9"}
                fill={"#101b37"}
                zIndex={-2}
                lineWidth={2}
                rotation={45}
            />
            <RoboticText ref={caches_txt}
                fontSize={140} fontStyle={""}
                fill={"#007ed9"} x={4} y={10}
                // text={"Cache"}
            />
        </Node>
        <Node ref={spotlight_parent}
            position={[0, -400]}
            zIndex={-10}
        >
            {...range(4).map(i => <>
                <Line ref={extension_backing}
                    points={[[0, 0], [-900, 1400], [900, 1400], [0, 0]]} closed
                    fill={"#0b3c6c22"} start={0.5} end={0.5} zIndex={10}
                    rotation={() => (i * 90) + time() * 10}
                />
            </>)}
        </Node>
    </>);
    yield* sequence(0.2,
        caches_txt().text("Cache", 0.5),
        back_rect().size(180, 0.5),
        back_rect_out_highlight().size(200, 0.5),
    )

    const cachesback_loop = yield loopFor(Infinity, function* () {
        yield* all(
            back_rect().rotation(back_rect().rotation() + 360, 4),
            back_rect_out_highlight().rotation(back_rect_out_highlight().rotation() - 360, 4),
        )
    });
    
    yield sequence(0.1,
        ...extension_backing.map((t, i) => all(
            t.start(0, 0.4),
            t.end(1, 0.4),
        )),
    );
    yield* waitUntil("decoupleiandd");
    const use_0 = createRef<Layout>();
    const use_0_txts = createRefArray<Txt>();
    const use_0_txt_strs   = [ "1.", "Decouple", "Instructions", "and", "Data" ];
    const use_0_txt_sizes  = [ 120, 100, 120, 90, 120 ];
    const use_0_txt_colors = [ "#007ed9", new Color("#007ed9").brighten(2), "#007ed9", "#08508d", "#007ed9", ];
    const use_1 = createRef<Layout>();
    const use_1_txts = createRefArray<Txt>();
    const use_1_txt_strs   = [ "2.", "Speed", "Up", "Functional", "Blocks" ];
    const use_1_txt_sizes  = [ 120, 100, 100, 120, 120 ];
    const use_1_txt_colors = [ "#007ed9", new Color("#007ed9").brighten(2), new Color("#007ed9").brighten(2), "#007ed9", "#007ed9", ];
    view.add(<>
        <Layout ref={use_0}
            layout alignItems={"center"}
            x={-100}
            gap={20}
        >
            {...use_0_txt_strs.map((s,i) => <RoboticText ref={use_0_txts}
                // text={s}
                fontSize={use_0_txt_sizes[i]}
                fill={use_0_txt_colors[i]}
            />)}
        </Layout>
        <Layout ref={use_1}
            layout alignItems={"center"}
            x={0} y={200}
            gap={20}
        >
            {...use_1_txt_strs.map((s,i) => <RoboticText ref={use_1_txts}
                // text={s}
                fontSize={use_1_txt_sizes[i]}
                fill={use_1_txt_colors[i]}
            />)}
        </Layout>
    </>);
    yield* sequence(0.1,
        ...use_0_txts.map((t, i) => t.text(use_0_txt_strs[i], 0.5)),
    );
    yield* waitFor(2);
    yield* sequence(0.1,
        ...use_1_txts.map((t, i) => t.text(use_1_txt_strs[i], 0.5)),
    );
    yield* waitUntil("forexample");
    yield* sequence(0.05,
        ...use_0_txts.map((t, i) => t.text("", 0.5)),
        ...use_1_txts.map((t, i) => t.text("", 0.5)),
    );


    const control_unit_clone = control_unit().clone();
    control_unit_clone.scale(1).position([-2000, -200]);
    
    const branchpred_clone = guessblock().clone();
    branchpred_clone.scale(1).position([-2000, -200]).lineWidth(4);

    view.add(control_unit_clone);
    view.add(branchpred_clone);
    yield* all(
        control_unit_clone.position([-500, -75], 1.2, easeOutBack),
        control_unit_clone.scale(2, 1.2, easeOutBack),
    );
    
    const uop_cache = createRef<Rect>(); const uop_cache_label = createRef<Txt>();
    const btb_cache = createRef<Rect>(); const btb_cache_label = createRef<Txt>();
    const pht_cache = createRef<Rect>(); const pht_cache_label = createRef<Txt>();
    const control_unit_uop_cache_data_wire = createRef<Line>();
    const branchpred_btb_data_wire = createRef<Line>();
    const branchpred_pht_data_wire = createRef<Line>();
    view.add(<>
        <Rect ref={uop_cache}
            fill={"#4e2b4d"}
            position={[-500, 400-75]}
            size={[250, 200]} scale={0}
            lineWidth={8} rotation={90}
            stroke={"#d65d74"}
        >
            <RoboticText
                ref={uop_cache_label} y={4}
                fill={"#d65d74"}
                fontSize={48} fontStyle={""}
                text={"uopCache"}
            />
        </Rect>
        <Rect ref={btb_cache}
            fill={"#4e2b4d"}
            position={[350, 400-75]}
            size={[250, 200]} scale={0}
            lineWidth={8} rotation={90}
            stroke={"#d65d74"}
        >
            <RoboticText
                ref={btb_cache_label} y={4}
                fill={"#d65d74"}
                fontSize={88} fontStyle={""}
                text={"BTB"}
            />
        </Rect>
        <Rect ref={pht_cache}
            fill={"#4e2b4d"}
            position={[650, 400-75]}
            size={[250, 200]} scale={0}
            lineWidth={8} rotation={90}
            stroke={"#d65d74"}
        >
            <RoboticText
                ref={pht_cache_label} y={4}
                fill={"#d65d74"}
                fontSize={88} fontStyle={""}
                text={"PHT"}
            />
        </Rect>
        <Line ref={control_unit_uop_cache_data_wire}
            points={() => [control_unit_clone.bottom(), uop_cache().top()]}
            lineWidth={20} stroke={"#c2566e"}
            endArrow startArrow arrowSize={30} end={0}
        >
        </Line>
        <Line ref={branchpred_btb_data_wire}
            points={() => [[btb_cache().top().x, branchpred_clone.bottom().y], btb_cache().top()]}
            lineWidth={20} stroke={"#c2566e"}
            endArrow startArrow arrowSize={30} end={0}
        >
        </Line>
        <Line ref={branchpred_pht_data_wire}
            points={() => [[pht_cache().top().x, branchpred_clone.bottom().y], pht_cache().top()]}
            lineWidth={20} stroke={"#c2566e"}
            endArrow startArrow arrowSize={30} end={0}
        >
        </Line>
    </>);
    yield* waitFor(1);
    yield* all(
        uop_cache().scale(1, 0.5),
        uop_cache().rotation(0, 0.5),
    );
    yield* control_unit_uop_cache_data_wire().end(1, 0.5);

    yield* waitUntil("branchpred");
    yield* all(
        branchpred_clone.position([500, -75], 1.2, easeOutBack),
        branchpred_clone.scale(2, 1.2, easeOutBack),
        branchpred_clone.size(branchpred_clone.size().scale(2), 1.2, easeOutBack),
        branchpred_clone.childAs<Txt>(0).fontSize(60, 1.2, easeOutBack),
    );
    yield* sequence(0.1,
        all(
            btb_cache().scale(1, 0.5),
            btb_cache().rotation(0, 0.5),
        ),
        branchpred_btb_data_wire().end(1, 0.5),
        all(
            pht_cache().scale(1, 0.5),
            pht_cache().rotation(0, 0.5),
        ),
        branchpred_pht_data_wire().end(1, 0.5),
    );

    yield* waitUntil("diagramhighlights");
    yield* sequence(0.1,
        control_unit_uop_cache_data_wire().end(0, 0.5),
        all(
            control_unit_clone.scale(0, 0.5),
            control_unit_clone.rotation(90, 0.5),
        ),
        all(
            uop_cache().scale(0, 0.5),
            uop_cache().rotation(90, 0.5),
        ),
        branchpred_btb_data_wire().end(0, 0.5),
        branchpred_pht_data_wire().end(0, 0.5),
        all(
            btb_cache().scale(0, 0.5),
            btb_cache().rotation(90, 0.5),
        ),
        all(
            pht_cache().scale(0, 0.5),
            pht_cache().rotation(90, 0.5),
        ),
        all(
            branchpred_clone.scale(0, 0.5),
            branchpred_clone.rotation(90, 0.5),
        ),
    );
    yield* sequence(0.05,
        ...extension_backing.map((t, i) => all(
            t.start(0.5, 0.4),
            t.end(0.5, 0.4),
        )),
    );
    yield* all(
        back_node().y(-1000, 0.6),
        caches_txt().y(-1000, 0.6),
    );
    yield* computer_stuff().x(0, 1.2);
    
    yield* waitUntil("opforward");
    yield* sequence(0.1,
        all(
            outputbuffer_decode_data_wire().stroke("yellow", 0.6).back(0.6),
            outputbuffer_decode_data_wire().lineWidth(outputbuffer_decode_data_wire().lineWidth() + 10, 0.6).back(0.6),
            outputbuffer_decode_data_wire().arrowSize(outputbuffer_decode_data_wire().arrowSize() + 10, 0.6).back(0.6),
        ),
        all(
            finalbuffer_decode_data_wire().stroke("yellow", 0.6).back(0.6),
            finalbuffer_decode_data_wire().lineWidth(finalbuffer_decode_data_wire().lineWidth() + 10, 0.6).back(0.6),
            finalbuffer_decode_data_wire().arrowSize(finalbuffer_decode_data_wire().arrowSize() + 10, 0.6).back(0.6),
        ),
        all(
            regfile_control_buffer_data_wire().stroke("yellow", 0.6).back(0.6),
            regfile_control_buffer_data_wire().lineWidth(regfile_control_buffer_data_wire().lineWidth() + 10, 0.6).back(0.6),
            regfile_control_buffer_data_wire().arrowSize(regfile_control_buffer_data_wire().arrowSize() + 10, 0.6).back(0.6),
        ),
        chain(
            run(function* () { selectblock().zIndex(10); }),
            all(
                selectblock().scale(1.3, 0.5).back(0.5),
                wiggle(selectblock().rotation, 100, 80, 1),
                selectblock().stroke("yellow", 0.5).back(0.5),
                selectblock().childAs<Txt>(0).fill("yellow", 0.5).back(0.5),
                selectblock().fill("#5c6b32", 0.5).back(0.5),
            ),
            run(function* () { selectblock().zIndex(0); }),
        ),
        all(
            selectblock_controlbuffer_data_wire().stroke("yellow", 0.6).back(0.6),
            selectblock_controlbuffer_data_wire().lineWidth(selectblock_controlbuffer_data_wire().lineWidth() + 10, 0.6).back(0.6),
            selectblock_controlbuffer_data_wire().arrowSize(selectblock_controlbuffer_data_wire().arrowSize() + 10, 0.6).back(0.6),
        ),
    );

    yield* waitUntil("stallsandflushes");
    const wave_block = function* (obj: Rect, half_time: number = 0.5) {
        yield* chain(
            run(function* () { obj.zIndex(10); }),
            all(
                obj.scale(1.3, half_time).back(half_time),
                wiggle(obj.rotation, obj.rotation() + 10, obj.rotation() - 10, half_time * 2),
                obj.stroke("yellow", half_time).back(half_time),
                obj.childAs<Txt>(0).fill("yellow", half_time).back(half_time),
                obj.fill("#5c6b32", half_time).back(half_time),
            ),
            run(function* () { obj.zIndex(0); }),
        )
    }
    yield* sequence(0.1,
        wave_block(prefetch_buffer()),
        wave_block(control_buffer()),
        wave_block(output_buffer()),
        wave_block(final_buffer()),
    );

    yield* waitUntil("bpandcaches");
    yield* sequence(0.1,
        wave_block(guessblock()),
        wave_block(icache()),
        wave_block(dcache()),
    );

    yield* waitUntil("end");
    yield* computer_stuff().x(-2000, 1.2);
})