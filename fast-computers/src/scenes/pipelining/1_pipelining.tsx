import { Gradient, Layout, Line, makeScene2D, Node, Rect, Txt } from "@motion-canvas/2d";
import { all, cancel, chain, Color, createRef, createRefArray, createSignal, easeInBack, easeInCirc, easeInSine, easeOutBack, easeOutCirc, easeOutSine, linear, loopFor, PossibleVector2, range, Reference, run, sequence, Vector2, waitFor, waitUntil } from "@motion-canvas/core";
import { RoboticText, ThinRoboticText } from "../../components/defaults";
import { cosmic_analogues, cosmic_grad, cosmic_grad_ramps } from "../../components/palette";
import { wiggle } from "../../components/misc";

enum ControlIndices {
    clk = 0,
    ram = 1,
    ir = 2,
    alu = 3,
    temp_y = 4,
    temp_z = 5,
    regs = 6,
    mdr = 7,
    mar = 8,
    pc = 9,
}

const get_diag_positioner = (x: number, y: number): PossibleVector2 => [-359 + x * 130, -243 + y * 80];

type PipelineStage = { name: string; color: string; }
let stages: PipelineStage[] = [
    { name: "F", color: cosmic_grad_ramps[3][0] },
    { name: "E", color: cosmic_grad_ramps[3][1] },
    { name: "D", color: cosmic_grad_ramps[3][1] }, // Updates later
]

export default makeScene2D(function* (view) {
    const time = createSignal(0);
    const time_loop = yield loopFor(Infinity, function*() {
        yield* time(time() + 10, 10, linear);
    });

//#region Background Shenanigans
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


    stage_ref_big_front[1].zIndex(-10);
    stage_ref_backings[1].zIndex(5);
    stage_ref_frontings[1].zIndex(5);
    stage_labels[1].zIndex(5);
    stage_refs[1].zIndex(5);

    const big_front_anims = [];
    const backing_anims = [];
    const fronting_anims = [];

    view.add(
        <RoboticText
            ref={part3_label}
            fontSize={100}
            fill={"white"}
            fontStyle={""}
            position={[-160, -140]}
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
            stage_refs[1].rotation(45, 0),
            stage_refs[1].size([4000, 4000], 0),
            stage_ref_frontings[1].size([4000, 4000], 0),
            stage_ref_backings[1].size([4000, 4000], 0),
            stage_ref_big_front[1].size([4000, 4000], 0),
        ),
    );

    
    yield* waitUntil("transition_section3");
    
    yield* sequence(0.1,
        stage_ref_big_front[1].size([300, 300], 1.2),
        stage_ref_frontings[1].size([170, 170], 1.2),
        stage_refs[1].size([200, 200], 1.2),
        stage_ref_backings[1].size([230, 230], 1.2),
        stage_refs[1].rotation(45, 1.2),
        ...range(4).map(i => stage_labels[i].fontSize(150, 0.2))
    );
    stage_ref_big_front[1].zIndex(-17);
    stage_ref_backings[1].zIndex(-15);
    stage_ref_frontings[1].zIndex(-15);
    stage_labels[1].zIndex(-15);
    stage_refs[1].zIndex(-15);

    stage_ref_big_front[2].zIndex(-10);
    stage_ref_backings[2].zIndex(5);
    stage_ref_frontings[2].zIndex(5);
    stage_labels[2].zIndex(5);
    stage_refs[2].zIndex(5);

    const shot_ray = createRef<Line>();
    view.add(<>
        <Line ref={shot_ray}
            points={[[-162, -302], [ 162, -302]]}
            lineWidth={20} end={0}
            stroke={new Gradient({
                type: "linear",
                from: [-162, -302],
                to:   [ 162, -302],
                stops: [
                    { offset: 0, color: "#9270d3" },
                    { offset: 1, color: "#007ed9" },
                ]
            })}
        />
    </>);

    yield* waitUntil("transition_section3_shoot");
    yield* sequence(0.4,
        shot_ray().end(1, 1.2),
        shot_ray().start(1, 1.2),
    )
    yield* waitFor(2);
    yield* sequence(0.8,
        sequence(0.1,
            stage_refs[2].rotation(45, 1.2),
            stage_refs[2].size([4000, 4000], 1.2),
            stage_ref_frontings[2].size([4000, 4000], 1.2),
            stage_ref_backings[2].size([4000, 4000], 1.2),
            stage_ref_big_front[2].size([4000, 4000], 1.2),
        ),
        sequence(0.4,
            stage_labels[2].position([0, 0], 0.8),
            stage_labels[2].text("Pipelining", 0.8),
            part3_label().text("Part III", 0.8)
        )
    );
//#endregion Background Shenanigans

//#region ComputerDefn
    // START OF THE COMPUTER
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

    view.add(<>
        <Rect
            ref={computer}
            fill={"#2c1e43"}
            lineWidth={10}
            stroke={cosmic_grad_ramps[1][0]}
            size={"90%"}
            clip
            x={-2000}
        >
            <RoboticText ref={comp_title}
                fontSize={100}  
                offset={[0, 0.5]} position={[-710, 460]}
                text={"Stage 1"} fill={cosmic_grad_ramps[1][0]}
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
            x={-2000}
        />
        <Rect
            ref={computer_panel_highlight_out}
            lineWidth={3}
            size={{"x":1728+20,"y":972+20}}
            stroke={cosmic_grad_ramps[1][0] + "44"}
            x={-2000}
        />
    </>);
    
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
                ref={ir_label} y={4}
                fill={cosmic_analogues[1][0]}
                fontSize={50} fontStyle={""}
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

    const clock_cycle = function*(time: number) {
        yield* all(
            clock_sig(1, 0.0344 * time, linear).wait(0.137931034 * time).to(0, 0.137931034 * time, linear).wait(0.689655172 * time),
            chain(
                clock_pulse().size(clock().size(), 0.0),
                clock_pulse().radius(0, 0.0),

                clock_pulse().opacity(1, 0.01),
                all(
                    clock_pulse().size(clock().size().add(40), 0.24137931 * time),
                    clock_pulse().radius(20, 0.24137931 * time),
                    clock_pulse().opacity(0, 0.6 * time),
                ),
            ),
        )
    }
    let clock_loop = yield loopFor(Infinity, function* () { yield* clock_cycle(1); });
//#endregion ComputerDefn
    
    yield* waitUntil("background");
    yield* all(
        computer().x(0, 1.2), computer_panel_highlight_in().x(0, 1.2), computer_panel_highlight_out().x(0, 1.2),
        part3_label().x(2000, 1.2), stage_labels[2].x(2000, 1.2));

    yield* waitUntil("highlightparts");

    const reg_inits = [ 0, 20, 30, 6 ];
    const reg_value_refs: Reference<Txt>[] = [mar_value, mdr_value, temp_y_value, temp_z_value];
    const reg_label_refs: Reference<Txt>[] = [mar_label, mdr_label, temp_y_label, temp_z_label];
    const reg_label_offs = [ [-35, 0], [-35, 0], [-52, 3], [-52, 3] ];
    const reg_label_height_deltas = [ 15, 15, 5, 0 ];
    yield sequence(0.3,
        all(
            pc().top([0, 197.5], 0.8),
            pc().size([180, 90], 0.8),
        ),
        chain(
            pc_label().x(150, 0.5).to(-150, 0),
            all(
                pc_label().y(-25, 0),
                pc_label().fontSize(30, 0),
            ),
            pc_label().x(-70, 0.5),
            pc_value().text("0x1000", 0.3)
        )
    )
    yield* sequence(0.1,
        ...[mar, mdr, temp_y, temp_z].map((l, i) => sequence(0.5,
            reg_label_refs[i]().x(125, 0.3).to(-125, 0),
            all(
                reg_label_refs[i]().y(-20 + reg_label_offs[i][1], 0),
                reg_label_refs[i]().fontSize(30, 0),
            ),
            all(
                l().height(l().height() + reg_label_height_deltas[i], 0.2),
                l().top(l().top(), 0.2),
            ),
            reg_label_refs[i]().x(reg_label_offs[i][0], 0.3),
            reg_value_refs[i]().text("0", 0.3),
        )),
        ...simple_register_labels.map((l, i) => sequence(0.5,
            l.x(100, 0.3).to(-100, 0),
            all(
                l.y(-15, 0),
                l.fontSize(30, 0),
            ),
            l.x(-45, 0.3),
            simple_register_values[i].text("" + reg_inits[i], 0.3),
        )),
    );
    cancel(clock_loop);

    yield* waitUntil("part1");

    const step_indicator_1 = createRef<Node>();
    const step_str_1 = createRef<Txt>();
    const step_blob_1 = createRef<Line>();
    const step_indicator_2 = createRef<Node>();
    const step_str_2 = createRef<Txt>();
    const step_blob_2 = createRef<Line>();
    const vcached = new Vector2(0, 200); const vscached = new Vector2(0, 100);
    internals().add(<>
        <Node ref={step_indicator_1}
            position={[-775, -375]}
            scale={0}
        >
            <Line ref={step_blob_1}
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
                fill={"#d65db155"}
                rotation={() => time() * 50}
            >
            </Line>
            <RoboticText ref={step_str_1}
                text={"1"} x={-10} y={15}
                fontSize={130}
                fill={"#d65db1"}
            />
        </Node>
        <Node ref={step_indicator_2}
            position={[-775, -375]}
            scale={0}
        >
            <Line ref={step_blob_2}
                radius={50}
                points={() => [
                    vcached.scale(1.1 + Math.sin(time() + 20) * 0.2),
                    vscached.rotate(45).scale(1.1 + Math.sin(time() + 80) * 0.2),
                    vcached.rotate(90).scale(1.1 + Math.sin(time() + 20) * 0.2),
                    vscached.rotate(135).scale(1.1 + Math.sin(time() + 80) * 0.2),
                    vcached.rotate(180).scale(1.1 + Math.sin(time() + 20) * 0.2),
                    vscached.rotate(225).scale(1.1 + Math.sin(time() + 80) * 0.2),
                    vcached.rotate(270).scale(1.1 + Math.sin(time() + 20) * 0.2),
                    vscached.rotate(315).scale(1.1 + Math.sin(time() + 80) * 0.2),
                ]}
                closed
                fill={"#ae56c555"}
                rotation={() => time() * 50}
            >
            </Line>
            <RoboticText ref={step_str_2}
                text={"2"} x={-10} y={15}
                fontSize={130}
                fill={"#ae56c5"}
            />
        </Node>
    </>);
    yield* step_indicator_1().scale(1, 0.8);

//#region Tick1
    control_cbus_wires[ControlIndices.pc].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    control_cbus_wires[ControlIndices.mar].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    control_cbus_wires[ControlIndices.ram].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    pc_control_wire().stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    mar_control_wire().stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    ram_control_wire().stroke(() => Color.lerp("#c2566e", "white", clock_sig()));

    control_label().position([-140, 0]); control_label1().position([-160, 0]); control_label2().position([-120, 0])
    yield* all(
        clock_cycle(2),
        control_label().text("PC_out", 0),
        sequence(0.3,
            sequence(0.1,
                control_label().position([120, 0], 0.6),
                control_label1().position([180, 0], 0.6),
                control_label2().position([150, 0], 0.6),
            ),
            sequence(0.2,
                data_label().y(-50, 0.25),
                data_label().x(-220, 0.25),
                all(
                    data_label_mask().height(510, 0),
                    data_label().y(298, 0.25),
                )
            ),
            mar_value().text("0x1000", 0.2),
        )
    )
    pc_value().text("0x1004");
    control_cbus_wires[ControlIndices.pc].stroke("#c2566e")
    control_cbus_wires[ControlIndices.mar].stroke("#c2566e")
    control_cbus_wires[ControlIndices.ram].stroke("#c2566e")
    pc_control_wire().stroke("#c2566e")
    mar_control_wire().stroke("#c2566e")
    ram_control_wire().stroke("#c2566e")
//#endregion Tick1
//#region Tick2
    const instruction_mask = createRef<Layout>();
    const instruction_tri_fill = createRef<Line>();

    const vert_simp = new Vector2(30, 0)
    internals().add(<>
        <Layout ref={instruction_mask}
            position={[-330, 0]}
            size={[300, 600]} zIndex={7}
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

    control_cbus_wires[ControlIndices.mdr].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    control_cbus_wires[ControlIndices.ir].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    ir_control_wire().stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    mdr_control_wire().stroke(() => Color.lerp("#c2566e", "white", clock_sig()));

    control_label_mask().position([-310, 120]).size([80, 60]);
    control_label().position([-400, 0]).text("MDR_out");
    control_label1_mask().position([-431, -90]).size([210, 60]).rotation(-90);
    control_label1().position([-400, 0]).text("IR_in");
    yield* all(
        sequence(0.2,
            instruction_tri_fill().x(-20, 0.4),
            instruction_tri_fill().y(210, 0.4)
        ),
        clock_cycle(2),
        sequence(0.3,
            control_label().position([180, 0], 0.6),
            control_label1().position([160, 0], 0.6),
            instruction_mask().size([400, 600], 0),
            all(
                sequence(0.3,
                    ir_label().x(100, 0.2).to(-100, 0),
                    all(
                        ir_label().y(-15, 0),
                        ir_label().fontSize(30, 0),
                    ),
                    ir_label().x(-45, 0.2),
                ),
                sequence(0.2,
                    instruction_tri_fill().y(-50, 0.25),
                    instruction_tri_fill().x(-140, 0.25),
                    instruction_tri_fill().y(-230, 0.25),
                ),
            )
        )
    )
    control_cbus_wires[ControlIndices.mdr].stroke("#c2566e")
    control_cbus_wires[ControlIndices.ir].stroke("#c2566e")
    ir_control_wire().stroke("#c2566e")
    mdr_control_wire().stroke("#c2566e")
//#endregion Tick2

    yield* waitUntil("part2");
    yield* all(step_indicator_1().scale(0, 0.8), step_indicator_2().scale(1, 0.8));

//#region Tick3
    control_cbus_wires[ControlIndices.regs].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    control_cbus_wires[ControlIndices.temp_y].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    register_file_control_wire().stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    temp_y_control_wire().stroke(() => Color.lerp("#c2566e", "white", clock_sig()));

    control_label_mask().position([440, 115]).size([65, 60]);
    control_label().position([-400, 0]).text("R1_Out");
    control_label1_mask().position([625, -140]).size([320, 60]).rotation(-90);
    control_label1().position([-400, 0]).text("Y_in");
    data_label_mask().y(-78).height(450);
    data_label().position([400, 270]).text("20");
    yield* all(
        clock_cycle(1),
        control_label().position([100, 0], 0.4),
        control_label1().position([260, 0], 0.4),
        sequence(0.1,
            data_label().y(30, 0.18),
            data_label().x(580, 0.18),
            data_label().y(-300, 0.18),
            temp_y_value().text("20", 0.1),
        ),
    )
    control_cbus_wires[ControlIndices.regs].stroke("#c2566e")
    control_cbus_wires[ControlIndices.temp_y].stroke("#c2566e")
    register_file_control_wire().stroke("#c2566e")
    temp_y_control_wire().stroke("#c2566e")
//#endregion Tick3
//#region Tick4
    control_cbus_wires[ControlIndices.regs].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    control_cbus_wires[ControlIndices.alu].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    control_cbus_wires[ControlIndices.temp_z].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    register_file_control_wire().stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    alu_control_wire().stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    
    control_label_mask().position([440, 115]).size([65, 60]);
    control_label().position([-400, 0]).text("R2_Out");
    control_label1_mask().position([358, -110]).size([250, 60]).rotation(-90);
    control_label1().position([-400, 0]).text("ALU_add");
    control_label2_mask().position([225, -90]).size([220, 60]).rotation(-90);
    control_label2().position([-400, 0]).text("Z_in");
    data_label_mask().y(0).x(400).width(350).height(475);
    data_label().position([0, 270]).text("30");
    data_label2_mask().x(345).y(-340).width(350).height(100);
    data_label2().position([200, 4]).text("20");
    data_label3_mask().x(290).y(-240).width(80).height(100);
    data_label3().position([70, 4-20]).text("50");
    yield* all(
        clock_cycle(1),
        control_label().position([100, 0], 0.4),
        control_label1().position([260, 0], 0.4),
        control_label2().position([260, 0], 0.4),
        sequence(0.1,
            data_label().y(-46, 0.18),
            data_label().x(130, 0.18),
            data_label().y(-205, 0.18),
            all(
                sequence(0.1,
                    data_label().x(10, 0.18),
                    data_label().opacity(0, 0.05),
                ),
                sequence(0.1,
                    data_label2().x(60, 0.18),
                    data_label2().opacity(0, 0.05),
                )
            ),
            data_label3().x(0, 0.18),
            data_label3().y(10, 0.18),
            data_label3().x(-70, 0.18),
            temp_z_value().text("50", 0.1),
        ),
    )
    control_cbus_wires[ControlIndices.regs].stroke("#c2566e")
    control_cbus_wires[ControlIndices.alu].stroke("#c2566e")
    control_cbus_wires[ControlIndices.temp_z].stroke("#c2566e")
    register_file_control_wire().stroke("#c2566e")
    alu_control_wire().stroke("#c2566e");
//#endregion Tick4
//#region Tick5
    control_cbus_wires[ControlIndices.temp_z].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    control_cbus_wires[ControlIndices.regs].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    temp_z_control_wire().stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    register_file_control_wire().stroke(() => Color.lerp("#c2566e", "white", clock_sig()));

    control_label2_mask().position([225, -90]).size([220, 60]).rotation(-90);
    control_label2().position([-400, 0]).text("Z_out");
    control_label_mask().position([440, 115]).size([65, 60]);
    control_label().position([-400, 0]).text("R1_in");
    data_label_mask().x(300).y(-25).height(345);
    data_label().position([-115, -200]).text("50").opacity(1);
    yield* all(
        clock_cycle(1),
        control_label2().position([260, 0], 0.4),
        control_label().position([100, 0], 0.4),
        sequence(0.1,
            data_label().y(-20, 0.18),
            data_label().x(100, 0.18),
            data_label().y(200, 0.18),
            simple_register_values[1].text("50", 0.1),
        ),
    )
    control_cbus_wires[ControlIndices.temp_z].stroke("#c2566e")
    control_cbus_wires[ControlIndices.regs].stroke("#c2566e")
    temp_z_control_wire().stroke("#c2566e")
    register_file_control_wire().stroke("#c2566e");
//#endregion

    yield* waitUntil("clearsplit");
    yield* step_indicator_2().scale(0, 0.8);
    const fetch_block = createRef<Line>();
    const exec_block = createRef<Line>();
    internals().add(<>
        <Line ref={fetch_block}
            points={[[-664, 70+35], [155, 70+35], [155, 357+35], [-664, 357+35]]}
            closed zIndex={6} end={0}
            stroke={new Color("#d65d74").brighten(2)} lineWidth={5}
            shadowColor={new Color("#d65d74").brighten(2)} shadowBlur={20}
        />
        <Line ref={exec_block}
            points={[[210, -143+35], [-664, -143+35], [-664, -450+35], [720, -450+35], [720, 433+35], [210, 433+35]]}
            closed zIndex={6} end={0}
            stroke={new Color("magenta").brighten(3)} lineWidth={5}
            shadowColor={new Color("magenta").brighten(3)} shadowBlur={20}
        />
    </>);
    yield* sequence(0.1,
        fetch_block().end(1, 0.8),
        exec_block().end(1, 0.8),
    );
    yield* waitFor(1);
    yield* sequence(0.4,
        all(
            mdr().scale(1.2, 1).to(1, 1),
            wiggle(mdr().rotation, -10, 10, 2),
            mdr().stroke("yellow", 1).back(1),
            mdr().fill("#6c4f37", 1).back(1),
            mdr_label().fill("yellow", 1).back(1),
        ),
        all(
            mar().scale(1.2, 1).to(1, 1),
            wiggle(mar().rotation, -10, 10, 2),
            mar().stroke("yellow", 1).back(1),
            mar().fill("#6c4f37", 1).back(1),
            mar_label().fill("yellow", 1).back(1),
        ),
        all(
            ir().scale(1.2, 1).to(1, 1),
            wiggle(ir().rotation, -10, 10, 2),
            ir().stroke("yellow", 1).back(1),
            ir().fill("#6c4f37", 1).back(1),
            ir_label().fill("yellow", 1).back(1),
        ),
    );
    yield* sequence(0.1,
        fetch_block().end(0, 0.8),
        exec_block().end(0, 0.8),
    );

    yield* waitUntil("wellobviously");
    yield* all(
        computer().scale(0.8, 0.8),
        computer().right(computer().right(), 0.8),
        computer_panel_highlight_in().scale(0.8, 0.8),
        computer_panel_highlight_in().right(computer_panel_highlight_in().right(), 0.8),
        computer_panel_highlight_out().scale(0.8, 0.8),
        computer_panel_highlight_out().right(computer_panel_highlight_out().right(), 0.8),
    );
    instruction_mask().width(2000).height(2000);
    yield* waitFor(2);
    yield* all(
        sequence(0.2,
            instruction_tri_fill().x(instruction_tri_fill().x() - 200, 0.8),
            instruction_tri_fill().y(instruction_tri_fill().y() - 80, 0.8),
        ),
        instruction_tri_fill().scale(3, 0.8),
    );
    
    yield* waitUntil("backtoviz");
    yield* all(
        sequence(0.2,
            instruction_tri_fill().y(instruction_tri_fill().y() + 80, 0.8),
            instruction_tri_fill().x(instruction_tri_fill().x() + 200, 0.8),
        ),
        instruction_tri_fill().scale(1, 0.8),
    );
    yield* all(
        computer().scale(1, 0.8),
        computer().right(computer().right(), 0.8),
        computer_panel_highlight_in().scale(1, 0.8),
        computer_panel_highlight_in().right(computer_panel_highlight_in().right(), 0.8),
        computer_panel_highlight_out().scale(1, 0.8),
        computer_panel_highlight_out().right(computer_panel_highlight_out().right(), 0.8),
    );
    yield* waitFor(1);
    yield* all(
        computer().scale(0.8, 0.8),
        computer().bottom(computer().bottom(), 0.8),
        computer_panel_highlight_in().scale(0.8, 0.8),
        computer_panel_highlight_in().bottom(computer_panel_highlight_in().bottom(), 0.8),
        computer_panel_highlight_out().scale(0.8, 0.8),
        computer_panel_highlight_out().bottom(computer_panel_highlight_out().bottom(), 0.8),
    );
    stage_labels[2].fontStyle("italic")
    stage_labels[2].x(0).y(-2000);
    yield* all(stage_labels[2].y(-400, 1.2));

    
    yield* sequence(0.01,
        ...[mar, mdr, temp_y, temp_z].map((l, i) => sequence(0.1,
            reg_value_refs[i]().text("", 0.1),
            reg_label_refs[i]().x(-125, 0.1).to(125, 0),
            all(
                reg_label_refs[i]().y(4, 0),
                reg_label_refs[i]().fontSize(50, 0),
            ),
            reg_label_refs[i]().x(0, 0.1),
        )),
        ...simple_register_labels.map((l, i) => sequence(0.1,
            simple_register_values[i].text("", 0.1),
            l.x(-100, 0.1).to(100, 0),
            all(
                l.y(4, 0),
                l.fontSize(50, 0),
            ),
            l.x(0, 0.1),
        )),
        sequence(0.1,
            pc_value().text("", 0.1),
            pc_label().x(-150, 0.1).to(150, 0),
            all(
                pc_label().y(4, 0),
                pc_label().fontSize(50, 0),
            ),
            pc_label().x(0, 0.1),
            all(pc().size([130, 65], 0.4), pc().top(pc().top(), 0.4)),
        )
    )
    yield* waitFor(1);
    yield* all(
        stage_labels[2].y(-2000, 1.2),
        computer().scale(1, 0.8),
        computer().bottom(computer().bottom(), 0.8),
        computer_panel_highlight_in().scale(1, 0.8),
        computer_panel_highlight_in().bottom(computer_panel_highlight_in().bottom(), 0.8),
        computer_panel_highlight_out().scale(1, 0.8),
        computer_panel_highlight_out().bottom(computer_panel_highlight_out().bottom(), 0.8),
    );

    yield* waitUntil("rearranging");

    const stage2_presenter = createRef<Line>();
    computer().add(<Line ref={stage2_presenter}
        position={[-1200, 432]}
        points={[[-200, 50], [160, 50], [200, -50], [-160, -50]]}
        closed fill={"#d65db1"}
    >
    </Line>)
    yield* chain(
        stage2_presenter().x(-700, 0.5),
        all(comp_title().text("Stage 2", 0.2), comp_title().left(comp_title().left(), 0.2)),
        stage2_presenter().x(-1200, 0.5),
    );


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
    yield* sequence(0.05,
        ...allthewires.map(t => t().start(1, 0.4)),
        ...control_cbus_wires.map(t => t.end(0.2, 0.4)),
    );
    yield* all(
        control_bus().scale(0, 0.8), control_bus().rotation(45, 0.8),
        clock().scale(0, 0.8), clock().rotation(45, 0.8),
    );
    yield* sequence(0.1,
        internals().x(internals().x() - 50, 0.2),
        all(
            data_bus().size([800, 65], 0.5),
            data_bus().rotation(90, 0.5),
            data_bus().position([300, 0], 0.5),
        ),
        pc().position([-575, -281], 0.5),
        mdr().x(0, 0.5),
        mar().x(0, 0.5),
        ram().y((mdr().y() + mar().y()) / 2, 0.5),
        register_file().position([0, -50], 0.5),
        temp_y().position([645, 300], 0.5),
        all(
            alu().rotation(90, 0.5),
            alu().position([585, 130], 0.5),
        ),
        flags().position([670, -40], 0.5),
        temp_z().position([500, -40], 0.5),
        all(
            control_unit().x(575, 0.5),
            control_cbus_wire_bundle().x(725, 0.5),
        ),
        all(
            ir().position([0, -281], 0.5),
            instruction_tri_fill().position([330, -276], 0.5)
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
    yield* sequence(0.05,
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
        ].map(t => t().end(1, 0.5)),
    );

    yield* waitUntil("prefetchreveal");
    yield* sequence(0.1,
        prefetch_buffer().size([450, 65], 0.5),
        prefetch_buffer().rotation(90, 0.5),
        ...[ram_prefetch_data_wire, prefetch_ir_data_wire,].map(t => t().end(1, 0.5)),
    );

    yield* waitUntil("pipelining_examp");
    yield* all(
        computer().x(-2000, 1.2),
        computer_panel_highlight_in().x(-2000, 1.2),
        computer_panel_highlight_out().x(-2000, 1.2),
    );
    stage_labels[2].zIndex(10)
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
                {/* <Line ref={extension_backing}
                    points={[[0, 0], [-500, 1400], [500, 1400], [0, 0]]} closed
                    fill={"#492b6122"} start={0.5} end={0.5}
                    rotation={() => (i * 90) - time() * 10}
                /> */}
            </>)}
        </Node>
    </>);
    yield* sequence(0.2,
        sequence(0.2, stage_labels[2].y(-400, 1.2), stage_labels[2].fontSize(100, 1.2)),
        back_rect().size(180, 0.5),
        back_rect_out_highlight().size(200, 0.5),
    )

    const isaback_loop = yield loopFor(Infinity, function* () {
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

    const inner_stuff = createRef<Node>();
    view.add(<Node ref={inner_stuff}> </Node>)

    const withpipe = createRefArray<Layout>();
    const withoutpipe = createRefArray<Layout>();
    const sumline = createRefArray<Line>();
    const individual_titles = createRefArray<Txt>();
    const individual_labels = createRefArray<Txt>();
    const individual_times = createRefArray<Txt>();
    const individual_title_txts = [ "With", "Without" ];
    const individual_label_txts = [ "Fetch", "Execute", "Total", "Cycle", "Total" ];
    const individual_times_txts = [ 5, 5, 10, 7, 7 ];
    inner_stuff().add(<Node>
        <Layout ref={withpipe}
            position={[-700, 0]}
            rotation={-90}
        >
            <RoboticText ref={individual_titles}
                fill={"#007ed933"}
                fontSize={300}
                // text={"With"}
            />
        </Layout>
        <Layout ref={withoutpipe}
            position={[700, -40]}
            rotation={90}
        >
            <RoboticText ref={individual_titles}
                fill={"#007ed933"}
                fontSize={300}
                // text={"Without"}
            />
        </Layout>

        <Layout ref={withpipe}
            position={[-300, 0]}
            direction={"row"}
            layout gap={40}
            alignItems={"center"}
        >
            <RoboticText ref={individual_labels}
                fill={cosmic_grad_ramps[0][3]}
                fontSize={100}
                fontStyle={""}
                // text={"Fetch"}
            />
            <RoboticText ref={individual_times}
                fill={cosmic_grad_ramps[0][5]}
                fontSize={60}
                fontStyle={""}
                // text={"(5ns)"}
            />
        </Layout>
        <Layout ref={withpipe}
            position={[-345, 100]}
            direction={"row"}
            layout gap={40}
            alignItems={"center"}
        >
            <RoboticText ref={individual_labels}
                fill={cosmic_grad_ramps[0][3]}
                fontSize={100}
                fontStyle={""}
                // text={"Execute"}
            />
            <RoboticText ref={individual_times}
                fill={cosmic_grad_ramps[0][5]}
                fontSize={60}
                fontStyle={""}
                // text={"(5ns)"}
            />
        </Layout>
        <Line ref={sumline}
            end={0}
            lineWidth={5} stroke={cosmic_grad_ramps[0][5]}
            points={[[-550, 168], [-80, 168]]}
        >
        </Line>
        <Layout ref={withpipe}
            position={[-300, 250]}
            direction={"row"}
            layout gap={40}
            alignItems={"center"}
        >
            <RoboticText ref={individual_labels}
                fill={cosmic_grad_ramps[0][3]}
                fontSize={100}
                fontStyle={""}
                // text={"Total"}
            />
            <RoboticText ref={individual_times}
                fill={cosmic_grad_ramps[0][5]}
                fontSize={60}
                fontStyle={""}
                // text={"(10ns)"}
            />
        </Layout>
        <Layout ref={withoutpipe}
            position={[300, 0]}
            direction={"row"}
            layout gap={40}
            alignItems={"center"}
        >
            <RoboticText ref={individual_labels}
                fill={cosmic_grad_ramps[0][3]}
                fontSize={100}
                fontStyle={""}
                // text={"Cycle"}
            />
            <RoboticText ref={individual_times}
                fill={cosmic_grad_ramps[0][5]}
                fontSize={60}
                fontStyle={""}
                // text={"(8ns)"}
            />
        </Layout>
        <Line ref={sumline}
            end={0}
            lineWidth={5} stroke={cosmic_grad_ramps[0][5]}
            points={[[550, 168], [80, 168]]}
        >
        </Line>
        <Layout ref={withoutpipe}
            position={[310, 250]}
            direction={"row"}
            layout gap={40}
            alignItems={"center"}
        >
            <RoboticText ref={individual_labels}
                fill={cosmic_grad_ramps[0][3]}
                fontSize={100}
                fontStyle={""}
                // text={"Total"}
            />
            <RoboticText ref={individual_times}
                fill={cosmic_grad_ramps[0][5]}
                fontSize={60}
                fontStyle={""}
                // text={"(8ns)"}
            />
        </Layout>
    </Node>);

    
    yield* waitUntil("withreveal");
    yield* individual_titles[0].text(individual_title_txts[0], 0.5);
    yield sequence(0.2,
        ...individual_labels.slice(0, 2).map((t, i) => t.text(individual_label_txts[i], 0.5)),
        ...individual_times.slice(0, 2).map((t, i) => t.text("(" + individual_times_txts[i] + "ns)", 0.5)),
        sumline[0].end(1, 0.5),
        ...individual_labels.slice(2, 3).map((t, i) => t.text(individual_label_txts[i+2], 0.5)),
        ...individual_times.slice(2, 3).map((t, i) => t.text("(" + individual_times_txts[i+2] + "ns)", 0.5)),
    );
    yield* waitUntil("withoutreveal")
    yield* individual_titles[1].text(individual_title_txts[1], 0.5);
    yield* sequence(0.2,
        ...individual_labels.slice(3, 4).map((t, i) => t.text(individual_label_txts[i+3], 0.5)),
        ...individual_times.slice(3, 4).map((t, i) => t.text("(" + individual_times_txts[i+3] + "ns)", 0.5)),
        sumline[1].end(1, 0.5),
        ...individual_labels.slice(4, 5).map((t, i) => t.text(individual_label_txts[i+4], 0.5)),
        ...individual_times.slice(4, 5).map((t, i) => t.text("(" + individual_times_txts[i+4] + "ns)", 0.5)),
    );
    yield* waitUntil("throughputup");
    const throughput_txt = createRef<Txt>();
    const throughput_arrow = createRef<Line>();
    inner_stuff().add(<>
        <ThinRoboticText ref={throughput_txt}
            fill={"#007ed9"}
            // text={"Still higher throughput"}
            fontSize={80} fontStyle={""}
            y={400}
        />
        <Line ref={throughput_arrow}
            end={0} endArrow radius={40}
            lineWidth={5} stroke={"#007ed9"}
            points={[[-270, 390], [-340, 390], [-340, 290], ]}
        />
    </>);
    yield* sequence(0.2,
        throughput_txt().text("Still higher throughput", 0.8),
        throughput_arrow().end(1, 0.5),
    );

    yield* waitUntil("wipefordiagram");
    yield* sequence(0.05,
        throughput_txt().text("", 0.4),
        throughput_arrow().start(1, 0.4),
        ...individual_times.map(t => t.text("", 0.4)),
        ...individual_labels.map(t => t.text("", 0.4)),
        ...individual_titles.map(t => t.text("", 0.4)),
        ...sumline.map(t => t.start(1, 0.4)),
    );
    inner_stuff().remove();
    inner_stuff().dispose();
    yield* sequence(0.05,
        ...extension_backing.map((t, i) => all(
            t.start(0.5, 0.4),
            t.end(0.5, 0.4),
        )),
    );
    yield* waitFor(1.5);
    yield* all(
        back_node().y(-1000, 0.6),
        stage_labels[2].y(-1000, 0.6),
    );

    yield* waitUntil("pipelinediagtime");
    
    const diagram_stuff = createRef<Node>();
    view.add(<Node ref={diagram_stuff}></Node>);
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
    yield* sequence(0.1,
        all(pipeline_diagram_panel_highlight_out().rotation(0, 0.8), pipeline_diagram_panel_highlight_out().size({"x":1728+20,"y":972+20}, 0.8)),
        all(pipeline_diagram().rotation(0, 0.8), pipeline_diagram().size("90%", 0.8)),
        all(pipeline_diagram_panel_highlight_in().rotation(0, 0.8), pipeline_diagram_panel_highlight_in().size({"x":1728-20,"y":972-20}, 0.8)),
    );

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
    </>);

    yield* sequence(0.1,
        ...code_txts.map((t, i) => t.text(flattened_code_txt_strs[i], 0.5)),
    );
    yield* waitUntil("codeinplace");
    yield* sequence(0.03,
        ...code_lines.map(t => t.gap(10, 0.5)),
        ...code_txts.map(t => t.fontSize(50, 0.5)),
        ...code_lines.map(t => t.x(-800, 0.5)),
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
            {...range(63).map(i => <Rect ref={central_blocks}
                position={get_diag_positioner(i % 9, Math.floor(i/9))}
                size={[126, 76]} fill={"#0e2949"}
            />)}
        </Rect>
    </>);
    yield* sequence(0.05,
        sequence(0.1, ...inst_names.map((t, i) => t.text("I" + (i+1), 0.5))),
        sequence(0.1, ...simple_horiz_lines.map((t, i) => t.end(1, 0.5))),
    )
    yield* waitFor(0.5);
    yield* sequence(0.05,
        sequence(0.1, ...timestep_names.map((t, i) => t.text(i == 9 ?"..." : "t" + (i+1), 0.5))),
        sequence(0.1, ...simple_verti_lines.map((t, i) => t.end(1, 0.5))),
    );
    yield* waitUntil("central_highlight");
    yield* sequence(0.1,
        ...range(7).map(i => sequence(0.05,
            ...range(9).map(j => all(
                wiggle(central_blocks[i * 9 + j].rotation, -10, 10, 0.5),
                central_blocks[i * 9 + j].fill("yellow", 0.25).back(0.25),
            ))
        ))
    );
    central_blocks_parent().remove();
    central_blocks_parent().dispose();
    central_blocks.splice(0, central_blocks.length);

    type pipeline_block_init = { i: number, t: number, stage: number };
    const pipeline_blocks: pipeline_block_init[] = [
        { i: 0, t: 0, stage: 0 }, { i: 0, t: 1, stage: 1 },
        { i: 1, t: 2, stage: 0 }, { i: 1, t: 3, stage: 1 },
        { i: 2, t: 4, stage: 0 }, { i: 2, t: 5, stage: 1 },
        { i: 3, t: 6, stage: 0 }, { i: 3, t: 7, stage: 1 },
        { i: 4, t: 8, stage: 0 },
    ]
    pipeline_diagram().add(<>
        <Rect ref={central_blocks_parent}>
            {...pipeline_blocks.map(b => <Rect ref={central_blocks}
                position={get_diag_positioner(b.t, b.i)}
                // size={[116, 66]}
                fill={stages[b.stage].color + "33"} rotation={90}
                lineWidth={4} stroke={cosmic_grad_ramps[3][b.stage]}
                clip
            >
                <RoboticText
                    fill={stages[b.stage].color}
                    fontStyle={""} y={4}
                    text={stages[b.stage].name}
                />
            </Rect>)}
        </Rect>
    </>);
    yield* waitFor(1);
    yield* sequence(0.1, ...central_blocks.slice(0, 2).map(t => all(t.size([116, 66], 0.5), t.rotation(0, 0.5))));
    yield* waitFor(5);
    yield* sequence(0.1, ...central_blocks.slice(2, 4).map(t => all(t.size([116, 66], 0.5), t.rotation(0, 0.5))));
    yield* waitFor(1);
    yield* sequence(0.1, ...central_blocks.slice(4, 6).map(t => all(t.size([116, 66], 0.5), t.rotation(0, 0.5))));
    yield* waitFor(1);
    yield* sequence(0.1, ...central_blocks.slice(6, 8).map(t => all(t.size([116, 66], 0.5), t.rotation(0, 0.5))));
    yield* waitFor(1);
    yield* sequence(0.1, ...central_blocks.slice(8, 9).map(t => all(t.size([116, 66], 0.5), t.rotation(0, 0.5))));

    yield* waitUntil("time_calc");
    const tick_times_1 = createRefArray<Txt>();
    pipeline_diagram().add(<>
        {...range(9).map(i => <RoboticText ref={tick_times_1}
            fontSize={60} fill={i % 2 == 0 ? "#ff9671" : "#f27d88"} opacity={0}
            x={-380 + i * 130 + (i == 9 ? 0 : 15)} y={-300}
            text={i % 2 == 0 ? "2" : "5"}
        />)}
    </>);
    yield* sequence(0.1, ...tick_times_1.filter((t,i) => i%2 == 0).map(t => all(t.opacity(1, 0.5), t.y(-400, 0.8, easeOutBack))))
    yield* waitFor(2);
    yield* sequence(0.1, ...tick_times_1.filter((t,i) => i%2 == 1).map(t => all(t.opacity(1, 0.5), t.y(-400, 0.8, easeOutBack))))

    yield* waitUntil("combinetimes");
    yield* sequence(0.1,
        ...range(4).map(i => sequence(0.3,
            all(
                tick_times_1[i*2+0].opacity(0, 0.3),
                tick_times_1[i*2+1].opacity(0, 0.3),
                tick_times_1[i*2+0].position(tick_times_1[i*2+0].position().add(tick_times_1[i*2+1].position()).scale(0.5), 0.2),
                tick_times_1[i*2+1].position(tick_times_1[i*2+0].position().add(tick_times_1[i*2+1].position()).scale(0.5), 0.2),
            ),
            all(
                tick_times_1[i*2+0].text("7", 0),
                tick_times_1[i*2+0].opacity(1, 0.2),
                tick_times_1[i*2+0].y(tick_times_1[i*2+0].y() - 50, 0.3, easeOutSine).to(tick_times_1[i*2+0].y(), 0.3, easeInSine),
            )
        )),
        all(
            tick_times_1[8].opacity(0, 0.6),
            tick_times_1[8].x(744, 0.5),
        ),
    );
    yield* waitUntil("finalcount_wopipelining");
    yield* chain(
        sequence(0.05, ...tick_times_1.map(t => all(t.x(tick_times_1[0].x(), 0.5), t.opacity(0, 0.8)))),
        all(
            tick_times_1[0].text("49", 0),
            tick_times_1[0].opacity(1, 0.2),
            tick_times_1[0].y(tick_times_1[0].y() - 50, 0.3, easeOutSine).to(tick_times_1[0].y(), 0.3, easeInSine),
        )
    );

    tick_times_1.slice(1).map(t => {
        t.remove();
        t.dispose();
    })
    const wopipeline_label = createRef<Txt>();
    pipeline_diagram().add(<>
        <RoboticText ref={wopipeline_label}
            fontSize={60} fill={new Color("#007ed9").brighten()}
            // text={"Without Pipeline"}
            position={[650, 450]}
        />
    </>);
    yield* sequence(0.2,
        all(tick_times_1[0].position([371, 450], 0.5), tick_times_1[0].text("49 cy", 0.5)),
        wopipeline_label().text("Without Pipeline", 0.4),
    );

    yield* waitUntil("pipelinetime2");
    const additional_pipeline_blocks: pipeline_block_init[] = [
        { i: 4, t: 5, stage: 1 },
        { i: 5, t: 5, stage: 0 }, { i: 5, t: 6, stage: 1 },
        { i: 6, t: 6, stage: 0 }, { i: 6, t: 7, stage: 1 },
    ]
    central_blocks_parent().add(<>
        {...additional_pipeline_blocks.map(b => <Rect ref={central_blocks}
            position={get_diag_positioner(b.t, b.i)}
            // size={[116, 66]}
            fill={stages[b.stage].color + "33"} rotation={90}
            lineWidth={4} stroke={cosmic_grad_ramps[3][b.stage]}
            clip
        >
            <RoboticText
                fill={stages[b.stage].color}
                fontStyle={""} y={4}
                text={stages[b.stage].name}
            />
        </Rect>)}
    </>)
    yield* sequence(0.8,
        all(...central_blocks.slice(2, 4).map((t, i) => all(t.position(get_diag_positioner(1+i, 1), 0.5), ))),
        all(...central_blocks.slice(4, 6).map((t, i) => all(t.position(get_diag_positioner(2+i, 2), 0.5), ))),
        all(...central_blocks.slice(6, 8).map((t, i) => all(t.position(get_diag_positioner(3+i, 3), 0.5), ))),
        all(...central_blocks.slice(8, 9).map((t, i) => all(t.position(get_diag_positioner(4+i, 4), 0.5), ))),
        sequence(0.1, ...central_blocks.slice(9, 14).map(t => all(t.size([116, 66], 0.5), t.rotation(0, 0.5)))),
    );

    yield* waitUntil("p2syncedexec");
    const tick_times_2 = createRefArray<Txt>();
    pipeline_diagram().add(<>
        {...range(8).map(i => <>
            <RoboticText ref={tick_times_2}
                fontSize={60} fill={"#ff9671"} opacity={0}
                x={-380 + i * 130 + (i == 9 ? 0 : 15)} y={-280}
                text={"2"}
            />
            <RoboticText ref={tick_times_2}
                fontSize={60} fill={"#f27d88"} opacity={0}
                x={-380 + i * 130 + (i == 9 ? 0 : 15)} y={-330}
                text={"5"}
            />
        </>)}
    </>);
    yield* sequence(0.1, ...tick_times_2.filter((t, i) => i != 1 && i != 14).map(t => all(t.opacity(1, 0.5), t.y(t.y() - 100, 0.8, easeOutBack))));

    yield* waitUntil("pick5");
    yield* sequence(0.1,
        ...range(7).map(i => all(
            tick_times_2[2 + i*2 + 0].opacity(0, 0.3),
            tick_times_2[2 + i*2 + 1].y(-380, 0.3, easeInBack),
        ))
    )
    tick_times_2[1].opacity(1);
    tick_times_2[1].position(tick_times_2[3].position());
    yield* all(
        tick_times_2[0].opacity(0, 0.3),
        tick_times_2[1].position(tick_times_2[0].position(), 0.3, easeInBack),
    );

    yield* waitUntil("thefirst");
    yield* all(
        inst_names_parent().zIndex(20, 0),
        inst_names[0].zIndex(20, 0).wait(1.6).back(0),
        inst_names[0].fill("yellow", 0.8).back(0.8),
        inst_names[0].scale(2, 0.8).back(0.8),
    );
    yield simple_verti_lines[2].stroke("yellow", 1).back(1);
    yield* all(
        chain(
            all(
                tick_times_2[1].opacity(0, 0.3),
                tick_times_2[1].position(tick_times_2[3].position().add(tick_times_2[5].position()).scale(0.5), 0.2),
                tick_times_2[3].opacity(0, 0.3),
                tick_times_2[3].position(tick_times_2[3].position().add(tick_times_2[5].position()).scale(0.5), 0.2),
            ),
            all(
                tick_times_2[1].text("10", 0),
                tick_times_2[1].opacity(1, 0.2),
                tick_times_2[1].y(tick_times_2[1].y() - 50, 0.3, easeOutSine).to(tick_times_2[1].y(), 0.3, easeInSine),
            ),
        )
    );
    yield* waitUntil("therest");
    yield* sequence(0.3,
        ...range(6).map(i => all(
            tick_times_2[5+i*2].x(tick_times_2[5+i*2].x() + 65, 0.5),
            simple_verti_lines[3+i].stroke("yellow", 1).back(1),
            inst_names[1+i].fill("yellow", 1).back(1),
        ))
    );
    yield* waitFor(2);
    yield* sequence(0.1,
        ...range(6).map(i =>
            tick_times_2[5+i*2].y(tick_times_2[5+i*2].y() - 50, 0.3, easeOutSine).back(0.3, easeInSine),
        ),
    );
    yield* waitFor(1);
    yield* chain(
        all(
            ...range(6).map(i => all(
                tick_times_2[5+i*2].opacity(0, 0.3),
                tick_times_2[5+i*2].position(tick_times_2[9].position().add(tick_times_2[11].position()).scale(0.5), 0.2),
            )),
        ),
        all(
            tick_times_2[5].text("30", 0),
            tick_times_2[5].opacity(1, 0.2),
            tick_times_2[5].y(tick_times_2[5].y() - 50, 0.3, easeOutSine).to(tick_times_2[5].y(), 0.3, easeInSine),
        )
    );

    yield* waitUntil("finaltime");
    yield* chain(
        all(
            tick_times_2[1].opacity(0, 0.3),
            tick_times_2[1].position(tick_times_2[5].position().add(tick_times_2[1].position()).scale(0.5), 0.2),
            tick_times_2[5].opacity(0, 0.3),
            tick_times_2[5].position(tick_times_2[5].position().add(tick_times_2[1].position()).scale(0.5), 0.2),
        ),
        all(
            tick_times_2[1].text("40", 0),
            tick_times_2[1].opacity(1, 0.2),
            tick_times_2[1].y(tick_times_2[1].y() - 50, 0.3, easeOutSine).to(tick_times_2[1].y(), 0.3, easeInSine),
        )
    );
    
    const stage2pipeline_label = createRef<Txt>();
    pipeline_diagram().add(<>
        <RoboticText ref={stage2pipeline_label}
            fontSize={60} fill={new Color("#007ed9").brighten()}
            // text={"2-Stage Pipeline"}
            position={[650, 400]}
        />
    </>);
    yield* waitFor(0.5);
    yield* sequence(0.2,
        all(tick_times_2[1].position([371, 400], 0.5), tick_times_2[1].text("40 cy", 0.5)),
        stage2pipeline_label().text("2-Stage Pipeline", 0.4),
    );

    yield* waitUntil("showcomparison");
    yield* all(
        pipeline_diagram().scale(0.8, 0.8),
        pipeline_diagram().left(pipeline_diagram().left(), 0.8),
        pipeline_diagram_panel_highlight_in().scale(0.8, 0.8),
        pipeline_diagram_panel_highlight_in().left(pipeline_diagram_panel_highlight_in().left(), 0.8),
        pipeline_diagram_panel_highlight_out().scale(0.8, 0.8),
        pipeline_diagram_panel_highlight_out().left(pipeline_diagram_panel_highlight_out().left(), 0.8),
    );
    yield* waitFor(4);
    const timefor1inst = createRef<Txt>();
    const timeformanyinst = createRef<Txt>();
    view.add(<>
        <RoboticText ref={timefor1inst}
            position={[744, -15]}
            fill={"#007ed9"}
            fontSize={70}
            text={""}
        />
        <RoboticText ref={timeformanyinst}
            position={[744, -115]}
            fill={"#5fadff"}
            fontSize={70}
            text={""}
        />
    </>)
    yield* timefor1inst().text("7 cy -> 10 cy", 0.5);
    yield* waitFor(6);
    yield* timeformanyinst().text("49 cy -> 40 cy", 0.5);

    yield* waitUntil("backtodiag");
    yield* all(
        pipeline_diagram().x(pipeline_diagram().x() + 2000, 1.2),
        pipeline_diagram_panel_highlight_in().x(pipeline_diagram_panel_highlight_in().x() + 2000, 1.2),
        pipeline_diagram_panel_highlight_out().x(pipeline_diagram_panel_highlight_out().x() + 2000, 1.2),
        timeformanyinst().x(timeformanyinst().x() + 2000, 1.2),
        timefor1inst().x(timefor1inst().x() + 2000, 1.2),
        computer().x(0, 1.2),
        computer_panel_highlight_in().x(0, 1.2),
        computer_panel_highlight_out().x(0, 1.2),
    );


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
    
    yield* sequence(0.05,
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
        ].map(t => t().start(1, 0.5)),
        ...control_cbus_wires.map(t => t.end(0, 0.5)),
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

    yield* sequence(0.1,
        all(
            ram_prefetch_data_wire().points([[-525, 154], [-525, 120], [-432, 120]], 0.5),
            prefetch_buffer().x(prefetch_buffer().x() - 100, 0.5),
            prefetch_ir_data_wire().points([[-366, -281], [-266, -281]], 0.5),
            ir().x(ir().x() - 200, 0.5),
            instruction_tri_fill().x(instruction_tri_fill().x() - 200, 0.5),
            ir_ctrl_data_wire().points([[-133, -281], [-57, -281]], 0.5),
            control_unit().scale(0.8, 0.5),
            control_unit().x(control_unit().x() - 500, 0.5),
        ),

        all(
            register_file().y(register_file().y() + 20, 0.5),
            register_file().x(register_file().x() - 50, 0.5),
            register_file().scale(0.9, 0.5),
            // register_file_data_wire
        ),
        all(
            register_file().width(400, 0.5),
            register_file_label().x(register_file_label().x() - 75, 0.5),
            simple_register_container().x(simple_register_container().x() - 75, 0.5),
            chain(
                run(function* () {
                    flags().zIndex(10);
                    yield* all(
                        flags().scale(0.9, 0.5),
                        flags().position([50, -120], 0.5)
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
        sequence(0.05,
            ...[data_bus, temp_y, temp_z].map(t => all(
                t().scale(0, 0.8),
                t().rotation(90, 0.8),
            )),
        ),
        all(
            alu().rotation(180, 0.5),
            alu().y(alu().y() - 300, 0.5),
        ),
        all(
            mdr().position([629, 60], 0.5),
            mar().position([514, 155], 0.5),
        ),
    );
    yield* sequence(0.05,
        mar_ram_data_wire().end(1, 0.5),
        mdr_ram_data_wire().end(1, 0.5),
        alu_pc_data_wire().end(1, 0.5),
        alu_regfile_data_wire().end(1, 0.5),
        alu_mdr_data_wire().end(1, 0.5),
        flags_ctrl_data_wire().end(1, 0.5),
    );
    yield* sequence(0.1,
        control_buffer().size([550, 65], 0.5),
        control_buffer().rotation(90, 0.5),
        sequence(0.05,
            control_unit_buffer_data_wire().end(1, 0.5),
            regfile_control_buffer_data_wire().end(1, 0.5),
            control_buffer_alu_data_wire_1().end(1, 0.5),
            control_buffer_alu_data_wire_2().end(1, 0.5),
            control_buffer_mdr_data_wire().end(1, 0.5),
            control_buffer_mar_data_wire().end(1, 0.5),
        )
    );
    
    yield* waitUntil("highlight_decode");
    const decode_block = createRef<Line>();
    internals().add(<>
        <Line ref={decode_block}
            points={[[-320, -370], [250, -370], [250, 150], [-320, 150]]}
            closed zIndex={6} end={0}
            stroke={new Color("#d65d74").brighten(2)} lineWidth={5}
            shadowColor={new Color("#d65d74").brighten(2)} shadowBlur={20}
        />
        <Line ref={exec_block}
            points={[[410, -340], [720, -340], [720, 220], [410, 220]]}
            closed zIndex={6} end={0}
            stroke={new Color("#d65d74").brighten(2)} lineWidth={5}
            shadowColor={new Color("#d65d74").brighten(2)} shadowBlur={20}
        />
    </>);
    yield* chain(
        decode_block().end(1, 1),
        waitFor(2.5),
        decode_block().start(1, 1),
    )
    yield* chain(
        exec_block().end(1, 1),
        waitFor(1),
        exec_block().start(1, 1),
    );

    yield* waitUntil("thecontrolbuffer");
    yield* all(
        control_buffer().scale(1.3, 0.8, easeOutCirc).back(0.8, easeInCirc),
        wiggle(control_buffer().rotation, 100, 80, 1.6),
        control_buffer().stroke("yellow", 0.8).back(0.8),
        control_buffer().fill("#5b4d37", 0.8).back(0.8),
        control_buffer_label().fill("yellow", 0.8).back(0.8),
    );

    yield* waitUntil("topipelinediagagain");
    yield* all(
        pipeline_diagram().scale(1, 0),
        pipeline_diagram().left(pipeline_diagram().left(), 0),
        pipeline_diagram_panel_highlight_in().scale(1, 0),
        pipeline_diagram_panel_highlight_in().left(pipeline_diagram_panel_highlight_in().left(), 0),
        pipeline_diagram_panel_highlight_out().scale(1, 0),
        pipeline_diagram_panel_highlight_out().left(pipeline_diagram_panel_highlight_out().left(), 0),
    )
    yield* all(
        pipeline_diagram().x(pipeline_diagram().x() - 2000, 1.2),
        pipeline_diagram_panel_highlight_in().x(pipeline_diagram_panel_highlight_in().x() - 2000, 1.2),
        pipeline_diagram_panel_highlight_out().x(pipeline_diagram_panel_highlight_out().x() - 2000, 1.2),
        computer().x(-2000, 1.2),
        computer_panel_highlight_in().x(-2000, 1.2),
        computer_panel_highlight_out().x(-2000, 1.2),
    );

    // stages[1].color = cosmic_grad_ramps[3][2];

    const decode_blocks: pipeline_block_init[] = [
        { i: 0, t: 1, stage: 2 },
        { i: 1, t: 2, stage: 2 },
        { i: 2, t: 3, stage: 2 },
        { i: 3, t: 4, stage: 2 },
        { i: 4, t: 5, stage: 2 },
        { i: 5, t: 6, stage: 2 },
        { i: 6, t: 7, stage: 2 },
    ];
    const decode_blocks_ref = createRefArray<Rect>();
    central_blocks_parent().add(<>
        {...decode_blocks.map(b => <Rect ref={decode_blocks_ref}
            position={get_diag_positioner(b.t, b.i)}
            // size={[116, 66]}
            fill={cosmic_grad_ramps[3][1] + "33"} rotation={90}
            lineWidth={4} stroke={cosmic_grad_ramps[3][1]}
            clip
        >
            <RoboticText
                fill={cosmic_grad_ramps[3][1]}
                fontStyle={""} y={4}
                text={stages[b.stage].name}
            />
        </Rect>)}
    </>);
    yield* sequence(0.1,
        ...central_blocks.filter((_, i) => i % 2 == 1).map((t, i) => all(
            t.position(get_diag_positioner(i+2, i), 0.5),
            t.stroke(cosmic_grad_ramps[3][2], 0.5),
            t.fill(cosmic_grad_ramps[3][2] + "33", 0.5),
            t.childAs<Txt>(0).fill(cosmic_grad_ramps[3][2], 0.5),
        )),
        ...decode_blocks_ref.map(t => all(
            t.size([116, 66], 0.5),
            t.rotation(0, 0.5),
        )),
    );
    
    const tick_times_3 = createRefArray<Txt>();
    pipeline_diagram().add(<>
        {...range(9).map(i => <>
            <RoboticText ref={tick_times_3}
                fontSize={40} fill={"#ff9671"} opacity={0}
                x={-360 + i * 130} y={-280}
                text={"2"}
            />
            <RoboticText ref={tick_times_3}
                fontSize={40} fill={"#f27d88"} opacity={0}
                x={-360 + i * 130} y={-310}
                text={"1"}
            />
            <RoboticText ref={tick_times_3}
                fontSize={40} fill={"#d26f9d"} opacity={0}
                x={-360 + i * 130} y={-340}
                text={"4"}
            />
        </>)}
    </>);
    yield* sequence(0.1, ...tick_times_3.filter((t, i) => ![1,2,5,21,24,25].includes(i)).map(t => all(t.opacity(1, 0.5), t.y(t.y() - 100, 0.8, easeOutBack))));

    yield* waitUntil("themaxclocks");
    yield* sequence(0.1,
        ...range(7).map(i => all(
            tick_times_3[6 + i*3 + 0].opacity(0, 0.3),
            tick_times_3[6 + i*3 + 1].opacity(0, 0.3),
            tick_times_3[6 + i*3 + 2].y(-380, 0.3, easeInBack),
        ))
    );
    tick_times_3[2].opacity(1);
    tick_times_3[5].opacity(1);
    tick_times_3[2].position(tick_times_3[8].position());
    tick_times_3[5].position(tick_times_3[8].position());
    yield* sequence(0.1,
        all(
            tick_times_3[2].position(tick_times_3[0].position(), 0.5),
            tick_times_3[0].opacity(0, 0.3),
        ),
        all(
            tick_times_3[5].position(tick_times_3[3].position(), 0.5),
            tick_times_3[3].opacity(0, 0.3),
            tick_times_3[4].opacity(0, 0.3),
        )
    )
    yield* sequence(0.1,
        ...range(9).map(i => tick_times_3[i*3+2].fontSize(60, 0.5))
    );
    yield* waitUntil("total");
    yield* sequence(0.01,
        ...range(9).map(i => all(
            tick_times_3[i*3+2].opacity(0, 1),
            tick_times_3[i*3+2].x(tick_times_3[2].x(), 0.5, easeInBack),
        )),
        tick_times_3[2].opacity(0, 0.8),
    );
    
    yield* all(
        tick_times_3[2].text("36", 0),
        tick_times_3[2].opacity(1, 0.2),
        tick_times_3[2].y(tick_times_3[2].y() - 50, 0.3, easeOutSine).to(tick_times_3[2].y(), 0.3, easeInSine),
    );
    yield* all(
        tick_times_3[2].position(tick_times_2[1].position(), 1.2, easeInBack),
        tick_times_3[2].text("36 cy", 1.2),
        tick_times_2[1].opacity(0, 1.2),
        stage2pipeline_label().text("3-Stage Pipeline", 0.5)
    );

    yield* waitUntil("end");
    yield* all(
        pipeline_diagram().x(2000, 1.2),
        pipeline_diagram_panel_highlight_in().x(2000, 1.2),
        pipeline_diagram_panel_highlight_out().x(2000, 1.2),
    )
});