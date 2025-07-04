import { Gradient, Layout, Line, makeScene2D, Node, Polygon, Rect, Txt } from "@motion-canvas/2d";
import { all, cancel, chain, Color, createRef, createRefArray, createSignal, linear, loopFor, range, Reference, sequence, tween, useTime, Vector2, waitFor, waitUntil } from "@motion-canvas/core";
import { cosmic_analogues, cosmic_grad_ramps } from "../../components/palette";
import { RoboticText } from "../../components/defaults";
import { wiggle } from "../../components/misc";

enum control_indices {
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

export default makeScene2D(function* (view) {
    /// BACK TRANSITION STUFF, SAD STUFF
    const stage_refs = createRefArray<Rect>();
    const stage_labels = createRefArray<Txt>();
    const stage_ref_backings = createRefArray<Rect>();
    const stage_ref_frontings = createRefArray<Rect>();
    const stage_ref_big_front = createRefArray<Rect>();
    const part1_label = createRef<Txt>();

    const stage_posns: [number,number][] = [ [-700, 200], [-300, -300], [300, -300], [700, 200] ];
    const stage_lbl_strs: string[] = [ "1", "2", "3", "4" ]
    const stage_back_colors = [ "#231833ff", "#1d1a36ff", "#101b37ff", "#101c34ff" ]
    view.add(<Node>
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
    </Node>);


    stage_ref_big_front[0].zIndex(-10);
    stage_ref_backings[0].zIndex(5);
    stage_ref_frontings[0].zIndex(5);
    stage_labels[0].zIndex(5);
    stage_refs[0].zIndex(5);

    const big_front_anims = [];
    const backing_anims = [];
    const fronting_anims = [];

    view.add(
        <RoboticText
            ref={part1_label}
            fontSize={100}
            fill={"white"}
            fontStyle={""}
            position={[-515, -140]}
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
            stage_refs[0].rotation(45, 0),
            stage_refs[0].size([4000, 4000], 0),
            stage_ref_frontings[0].size([4000, 4000], 0),
            stage_ref_backings[0].size([4000, 4000], 0),
            stage_ref_big_front[0].size([4000, 4000], 0),
        ),
    );


    // START OF THE COMPUTER
    const computer = createRef<Rect>();
    const internals = createRef<Node>();
    const backsquare = createRef<Rect>();
    const blocks = createRef<Node>();
    const wires = createRef<Node>();
    const comp_title = createRef<Txt>();

    const clock_sig = createSignal<number>(0);
    const time = createSignal<number>(0);
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

    const time_loop = yield loopFor(Infinity, function* () {
        yield* time(time() + 10, 10, linear);
    })

    view.add(<>
        <Rect
            ref={computer}
            fill={"#2c1e43"}
            lineWidth={10}
            stroke={cosmic_grad_ramps[1][0]}
            rotation={90}
            clip
        >
            <RoboticText ref={comp_title}
                fontSize={100} 
                offset={[0, 0.5]} position={[-1010, 460]}
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
            stroke={cosmic_grad_ramps[1][0] + "44"}
            rotation={90}
        />
        <Rect
            ref={computer_panel_highlight_out}
            lineWidth={3}
            stroke={cosmic_grad_ramps[1][0] + "44"}
            rotation={90}
        />
    </>);
    
    blocks().add(<>
        <Rect ref={data_bus}
            fill={"#492b61"}
            position={[0, -50]}
            // size={[1200, 60]}
            lineWidth={4}
            stroke={"#ae56c5"}
        >
            <RoboticText
                ref={data_bus_label} y={7}
                fill={cosmic_analogues[1][0]}
                fontSize={60}
            />
        </Rect>
        <Rect ref={control_bus}
            fill={"#4e2b4d"}
            position={[0, 50]}
            // size={[1200, 60]}
            lineWidth={4}
            stroke={"#c2566e"}
        >
            <RoboticText
                ref={control_bus_label} y={7}
                fill={cosmic_analogues[1][1]}
                fontSize={60}
            />
        </Rect>

        <Rect ref={clock}
            fill={"#4e2b4d"}
            position={[-472, -331]}
            lineWidth={4}
            stroke={() => Color.lerp("#c2566e", "#FFFFFF", clock_sig())}
        >
            <RoboticText
                ref={clock_label} y={4}
                fill={() => Color.lerp("#c2566e", "#FFFFFF", clock_sig())}
                fontSize={50} fontStyle={""}
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
            // size={[130, 65]}
            lineWidth={4} clip
            stroke={"#ae56c5"}
        >
            <RoboticText
                ref={pc_label} y={4}
                fill={cosmic_analogues[1][0]}
                fontSize={50} fontStyle={""}
            />
            <RoboticText
                ref={pc_value} y={12}
                fill={new Color(cosmic_analogues[1][0]).brighten(2)}
                fontSize={50} fontStyle={"      "}
            />
        </Rect>
        <Rect ref={ir}
            fill={"#492b61"}
            position={[-472, -231]}
            // size={[130, 65]}
            lineWidth={4} clip
            stroke={"#ae56c5"}
        >
            <RoboticText
                ref={ir_label} y={4}
                fill={cosmic_analogues[1][0]}
                fontSize={50} fontStyle={""}
            />
        </Rect>
        <Rect ref={control_unit}
            fill={"#4e2b4d"}
            position={[-150, -281]}
            // size={[130, 65]}
            lineWidth={4}
            stroke={"#c2566e"}
        >
            <RoboticText
                ref={control_unit_label} y={4}
                fill={cosmic_analogues[1][1]}
                fontSize={50} fontStyle={""}
            />
        </Rect>

        <Rect ref={mdr}
            fill={"#492b61"}
            position={[-350, 190]}
            // size={[130, 65]}
            lineWidth={4} clip
            stroke={"#ae56c5"}
        >
            <RoboticText
                ref={mdr_label} y={4}
                fill={cosmic_analogues[1][0]}
                fontSize={50} fontStyle={""}
            />
            <RoboticText
                ref={mdr_value} y={14}
                fill={new Color(cosmic_analogues[1][0]).brighten(2)}
                fontSize={40} fontStyle={""}
            />
        </Rect>
        <Rect ref={mar}
            fill={"#492b61"}
            position={[-220, 290]}
            // size={[130, 65]}
            lineWidth={4} clip
            stroke={"#ae56c5"}
        >
            <RoboticText
                ref={mar_label} y={4}
                fill={cosmic_analogues[1][0]}
                fontSize={50} fontStyle={""}
            />
            <RoboticText
                ref={mar_value} y={14}
                fill={new Color(cosmic_analogues[1][0]).brighten(2)}
                fontSize={40} fontStyle={""}
            />
        </Rect>
        <Rect ref={ram}
            fill={"#532d5a"}
            position={[-550, 240]}
            // size={[130, 65]}
            lineWidth={4}
            stroke={"#c457a5"}
        >
            <RoboticText
                ref={ram_label} y={4}
                fill={cosmic_grad_ramps[1][0]}
                fontSize={50} fontStyle={""}
            />
        </Rect>

        <Line ref={alu}
            fill={"#4e2b4d"}
            position={[385, -275]}
            scale={0}
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
            />
        </Line>
        <Rect ref={flags}
            fill={"#492b61"}
            position={[185, -331]}
            // size={[130, 65]}
            lineWidth={4}
            stroke={"#ae56c5"}
        >
            <RoboticText
                ref={flags_label} y={4}
                fill={cosmic_analogues[1][0]}
                fontSize={50} fontStyle={""}
            />
        </Rect>
        <Rect ref={temp_z}
            fill={"#492b61"}
            position={[185, -231]}
            // size={[130, 65]}
            lineWidth={4} clip
            stroke={"#ae56c5"}
        >
            <RoboticText
                ref={temp_z_label} y={4}
                fill={cosmic_analogues[1][0]}
                fontSize={50} fontStyle={""}
            />
            <RoboticText
                ref={temp_z_value} y={4}
                fill={new Color(cosmic_analogues[1][0]).brighten(2)}
                fontSize={50} fontStyle={""}
            />
        </Rect>
        <Rect ref={temp_y}
            fill={"#492b61"}
            position={[475 + 110, -340]}
            // size={[130, 65]}
            lineWidth={4} clip
            stroke={"#ae56c5"}
        >
            <RoboticText
                ref={temp_y_label} y={4}
                fill={cosmic_analogues[1][0]}
                fontSize={50} fontStyle={""}
            />
            <RoboticText
                ref={temp_y_value} y={4}
                fill={new Color(cosmic_analogues[1][0]).brighten(2)}
                fontSize={50} fontStyle={""}
            />
        </Rect>

        <Rect ref={register_file}
            fill={"#492b61"}
            position={[400, 300]}
            // size={[400, 300]}
            lineWidth={4}
            stroke={"#ae56c5"}
        >
            <RoboticText ref={register_file_label}
                x={-80}
                fill={cosmic_analogues[1][0]}
                fontSize={50} rotation={-90}
                // text={"Register File"}
            />
            <Layout ref={simple_register_container}
                direction={"column"}
                x={40}
            >
                {range(4).map(i => <Rect ref={simple_registers}
                    fill={"#492b61"}
                    // size={[130, 65]}
                    lineWidth={4} y={-100+i*65}
                    stroke={"#ae56c5"} clip
                >
                    <RoboticText ref={simple_register_labels}
                        y={4}
                        fill={cosmic_analogues[1][0]}
                        fontSize={50} fontStyle={""}
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
            end={0}
        >
        </Line>
        <Node>
            {range(10).map(i => <Line ref={control_cbus_wires}
                points={[[-150, -198], [-150, 18]]} x={((8-1) * -5) + i * 10}
                lineWidth={5} stroke={i == 0 ? () => Color.lerp("#c2566e", "#FFFFFF", clock_sig()) : "#c2566e"}
                lineDash={[20, 20]} lineDashOffset={() => time() * -50}
                end={0}
            >
            </Line>)}
        </Node>
        <Line ref={ir_control_wire}
            points={[[-432, -198], [-432, 18]]}
            lineWidth={5} stroke={"#c2566e"}
            lineDash={[20, 20]} lineDashOffset={() => time() * 50}
            start={1}
        >
        </Line>
        <Line ref={pc_control_wire}
            points={[[40, 197], [40, 84]]}
            lineWidth={5} stroke={"#c2566e"}
            lineDash={[20, 20]} lineDashOffset={() => time() * 50}
            end={0}
        >
        </Line>
        <Line ref={mar_control_wire}
            points={[[-180, 259], [-180, 84]]}
            lineWidth={5} stroke={"#c2566e"}
            lineDash={[20, 20]} lineDashOffset={() => time() * 50}
            end={0}
        >
        </Line>
        <Line ref={mdr_control_wire}
            points={[[-310, 157], [-310, 84]]}
            lineWidth={5} stroke={"#c2566e"}
            lineDash={[20, 20]} lineDashOffset={() => time() * 50}
            end={0}
        >
        </Line>
        <Line ref={ram_control_wire}
            points={[[-550, 147], [-550, 84]]}
            lineWidth={5} stroke={"#c2566e"}
            lineDash={[20, 20]} lineDashOffset={() => time() * 50}
            end={0}
        >
        </Line>
        <Line ref={temp_y_control_wire}
            points={[[625, -307], [625, 18]]}
            lineWidth={5} stroke={"#c2566e"}
            lineDash={[20, 20]} lineDashOffset={() => time() * 50}
            end={0}
        >
        </Line>
        <Line ref={temp_z_control_wire}
            points={[[225, -198], [225, 18]]}
            lineWidth={5} stroke={"#c2566e"}
            lineDash={[20, 20]} lineDashOffset={() => time() * 50}
            end={0}
        >
        </Line>
        <Line ref={alu_control_wire}
            points={[[358, -216], [358, 18]]}
            lineWidth={5} stroke={"#c2566e"}
            lineDash={[20, 20]} lineDashOffset={() => time() * 50}
            end={0}
        >
        </Line>
        <Line ref={register_file_control_wire}
            points={[[440, 149], [440, 84]]}
            lineWidth={5} stroke={"#c2566e"}
            lineDash={[20, 20]} lineDashOffset={() => time() * 50}
            end={0}
        >
        </Line>

        <Line ref={pc_data_wire}
            points={[[0, 197], [0, -17]]}
            lineWidth={10} stroke={"#ae56c5"}
            startArrow endArrow arrowSize={15}
            end={0}
        >
        </Line>
        <Line ref={ir_ctrl_data_wire}
            points={[[-406, -231], [-316, -231]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15}
            end={0}
        >
        </Line>
        <Line ref={ir_data_wire}
            points={[[-472, -198], [-472, -83]]}
            lineWidth={10} stroke={"#ae56c5"}
            startArrow arrowSize={15}
            start={1}
        >
        </Line>
        <Line ref={mdr_data_wire}
            points={[[-350, 157], [-350, -17]]}
            lineWidth={10} stroke={"#ae56c5"}
            startArrow endArrow arrowSize={15}
            end={0}
        >
        </Line>
        <Line ref={mar_data_wire}
            points={[[-220, 257], [-220, -17]]}
            lineWidth={10} stroke={"#ae56c5"}
            startArrow arrowSize={15}
            end={0}
        >
        </Line>
        <Line ref={mdr_ram_data_wire}
            points={[[-416, 190], [-485, 190]]}
            lineWidth={10} stroke={"#ae56c5"}
            startArrow endArrow arrowSize={15}
            end={0}
        >
        </Line>
        <Line ref={mar_ram_data_wire}
            points={[[-286, 290], [-485, 290]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15}
            end={0}
        >
        </Line>
        <Line ref={temp_y_data_wire}
            points={[[585, -307], [585, -83]]}
            lineWidth={10} stroke={"#ae56c5"}
            startArrow arrowSize={15}
            end={0}
        >
        </Line>
        <Line ref={alu_data_wire}
            points={[[442, -209], [530, -209], [530, -83]]}
            lineWidth={10} stroke={"#ae56c5"}
            startArrow arrowSize={15}
            end={0}
        >
        </Line>
        <Line ref={temp_y_alu_data_wire}
            points={[[519, -340], [442, -340]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15}
            end={0}
        >
        </Line>
        <Line ref={alu_flags_data_wire}
            points={[[329, -295], [(329+251)/2, -295], [(329+251)/2, -331], [251, -331]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15}
            end={0}
        >
        </Line>
        <Line ref={alu_temp_z_data_wire}
            points={[[329, -260], [(329+251)/2, -260], [(329+251)/2, -231], [251, -231]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15}
            end={0}
        >
        </Line>
        <Line ref={flags_ctrl_data_wire}
            points={[[119, -331], [16, -331]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15}
            end={0}
        >
        </Line>
        <Line ref={temp_z_data_wire}
            points={[[185, -198], [185, -83]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15}
            end={0}
        >
        </Line>
        <Line ref={register_file_data_wire}
            points={[[400, 149], [400, -17]]}
            lineWidth={10} stroke={"#ae56c5"}
            startArrow endArrow arrowSize={15}
            end={0}
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
                position={[-1400, -46]}
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

    yield* waitUntil("startwiththis");
    yield sequence(0.1,
        sequence(0.05,
            computer_panel_highlight_out().rotation(0, 0.8),
            computer_panel_highlight_out().size({"x":1728+20,"y":972+20}, 0.8),
            // (loopers[0] = loopFor(Infinity, function* () { yield* tween(24, (v, t) => computer_panel_highlight_out().rotation(Math.sin(v * 2 * Math.PI))) }))
        ),
        sequence(0.05,
            computer().rotation(0, 0.8),
            computer().size("90%", 0.8),
        ),
        sequence(0.05,
            computer_panel_highlight_in().rotation(0, 0.8),
            computer_panel_highlight_in().size({"x":1728-20,"y":972-20}, 0.8),
            // (loopers[1] = loopFor(Infinity, function* () { yield* tween(24, (v, t) => computer_panel_highlight_in().rotation(-Math.sin(v * 2 * Math.PI))) }))
        ),
    );
    yield* waitFor(0.1 * 2 + 0.8);
    yield* comp_title().x(-710, 0.8);

    yield* waitUntil("twobuses");
    yield* sequence(0.1,
        data_bus().size([1400, 65], 0.8),
        control_bus().size([1400, 65], 0.8)
    );
    yield* waitFor(1);
    yield* all(
        data_bus_label().text("HFSJ", 0.1, linear).to("BADF", 0.1, linear).to("DATA", 0.1, linear),
        control_bus_label().text("EASTER", 0.1, linear).to("EGGLSF", 0.1, linear).to("CONTROL", 0.1, linear),
    );

    yield* waitUntil("clock");
    yield* clock().size([130, 65], 0.8);
    yield* clock_label().text("ASD", 0.1, linear).to("FAS", 0.1, linear).to("HAD", 0.1, linear).to("CLK", 0.1, linear);

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

    yield* waitUntil("pc");
    yield* pc().size([130, 65], 0.8);
    yield* pc_label().text("LE", 0.1, linear).to("AD", 0.1, linear).to("PK", 0.1, linear).to("PC", 0.1, linear);
    yield* all(
        pc_control_wire().end(1, 0.3),
        pc_data_wire().end(1, 0.3),
    )

    yield* waitUntil("ir");
    yield* ir().size([130, 65], 0.8);
    yield* ir_label().text("AE", 0.1, linear).to("LN", 0.1, linear).to("LR", 0.1, linear).to("IR", 0.1, linear);
    yield* all(
        ir_control_wire().start(0, 0.3),
        ir_data_wire().start(0, 0.3),
    )

    yield* waitUntil("control_unit");
    yield* control_unit().size([330, 165], 0.8),
    yield* control_unit_label().text("Sfnaofr Lsad /\nNothing", 0.1, linear)
            .to("Hajdklr Kasd /\nNsdnrdf", 0.1, linear)
            .to("Cfntfal Usat /\nDedrhar", 0.1, linear)
            .to("Control Unit /\nDecoder", 0.1, linear);
    
    yield* all(
        clock_control_wire().end(1, 0.3),
        ...control_cbus_wires.map(t => t.end(1, 0.3)),
        ir_ctrl_data_wire().end(1, 0.3),
    );
    control_unit().stroke(() => Color.lerp("#c2566e", "#ffffff", clock_sig()))
    control_bus().stroke(() => Color.lerp("#c2566e", "#ffffff", clock_sig()))

    yield* waitUntil("cancel_clock_0");
    cancel(clock_loop);
    

///////
    yield* waitUntil("pc_in");
    control_cbus_wires[control_indices.pc].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    pc_control_wire().stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    yield* all(
        clock_cycle(6),
        control_label().position([0, 0], 1).to([120, 0], 1),
        chain(
            waitFor(0.7),
            sequence(0.3,
                sequence(0.7,
                    data_label().x(0, 0.8),
                    data_label().y(240, 0.8),
                ),
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
        )
    );
    control_cbus_wires[control_indices.pc].stroke("#c2566e")
    pc_control_wire().stroke("#c2566e")
    
    yield* waitUntil("resume_clock_0");
    clock_loop = yield loopFor(Infinity, function* () { yield* clock_cycle(1); });
////////    


    yield* waitUntil("memory_bufs");
    yield* sequence(0.1,
        mdr().size([130, 65], 0.8),
        mar().size([130, 65], 0.8)
    );
    yield* sequence(0.1,
        mdr_label().text("LAD", 0.1, linear).to("SDL", 0.1, linear).to("MDR", 0.1, linear),
        mar_label().text("DAL", 0.1, linear).to("LDS", 0.1, linear).to("MAR", 0.1, linear),
    );
    yield* all(
        mar_control_wire().end(1, 0.3),
        mdr_control_wire().end(1, 0.3),
        mdr_data_wire().end(1, 0.3),
        mar_data_wire().end(1, 0.3),
    )

    yield* waitUntil("ram");
    yield* ram().size([130, 185], 0.8);
    yield* ram_label().text("DAL", 0.1, linear).to("LDS", 0.1, linear).to("RAM", 0.1, linear);
    yield* all(
        ram_control_wire().end(1, 0.3),
        mdr_ram_data_wire().end(1, 0.3),
        mar_ram_data_wire().end(1, 0.3),
    )

    yield* waitUntil("alu");
    yield* sequence(0.4,
        alu().scale(1, 0.8),
        sequence(0.1,
            temp_y().size([130, 65], 0.8),
            temp_z().size([130, 65], 0.8),
            flags().size([130, 65], 0.8),
        ),
    );
    yield* sequence(0.1,
        alu_label().text("BLA", 0.1, linear).to("CUL", 0.1, linear).to("ALA", 0.1, linear).to("ALU", 0.1, linear),
        temp_y_label().text("C", 0.1, linear).to("T", 0.1, linear).to("Y", 0.1, linear),
        temp_z_label().text("B", 0.1, linear).to("X", 0.1, linear).to("Z", 0.1, linear),
        flags_label().text("Sjatk", 0.1, linear).to("Kfhlg", 0.1, linear).to("Flags", 0.1, linear),
    );
    yield* all(
        alu_control_wire().end(1, 0.3),
        temp_y_control_wire().end(1, 0.3),
        temp_z_control_wire().end(1, 0.3),
        
        temp_y_data_wire().end(1, 0.3),
        alu_data_wire().end(1, 0.3),
        temp_y_alu_data_wire().end(1, 0.3),
        alu_flags_data_wire().end(1, 0.3),
        alu_temp_z_data_wire().end(1, 0.3),
        flags_ctrl_data_wire().end(1, 0.3),
        temp_z_data_wire().end(1, 0.3),
    )

    yield* waitUntil("regfile");
    yield* register_file().size([250, 300], 0.8);
    yield* register_file_label().text("Heksiteb Leda", 0.1, linear).to("Yejsstnr Fkae", 0.1, linear).to("Register File", 0.1, linear);
    yield* sequence(0.05,
        ...range(4).map(i => simple_registers[i].size([130, 65], 0.8)),
    );
    yield* sequence(0.05,
        ...range(4).map(i => simple_register_labels[i].text("LP", 0.1, linear).to("RL", 0.1, linear).to("R" + i, 0.1, linear)),
    );
    yield* all(
        register_file_control_wire().end(1, 0.3),
        register_file_data_wire().end(1, 0.3),
    );

    yield* waitUntil("start_example_exec");
    cancel(clock_loop);
    yield* all(
        computer().scale(0.95, 0.3),
        computer().bottom(computer().bottom(), 0.3),
        computer_panel_highlight_in().scale(0.95, 0.3),
        computer_panel_highlight_in().bottom(computer_panel_highlight_in().bottom(), 0.3),
        computer_panel_highlight_out().scale(0.95, 0.3),
        computer_panel_highlight_out().bottom(computer_panel_highlight_out().bottom(), 0.3),
    );

    const sample_instruction = createRef<Layout>();
    const sample_instruction_parts = createRefArray<Txt>();
    const instruction_parts  = ["add", "R1,", "R2"];
    const instruction_colors = ["#c2566e", "#ae56c5", "#ae56c5"];
    view.add(<>
        <Layout ref={sample_instruction}
            position={[0, -480]}
            layout direction={"row"}
            gap={20}
        >
            {instruction_parts.map((t, i) => <RoboticText
                ref={sample_instruction_parts}
                fontSize={80}
                fill={instruction_colors[i]}
            />)}
        </Layout>
    </>);
    yield* sequence(0.1,
        ...sample_instruction_parts.map((t, i) => t.text(instruction_parts[i], 0.3)),
    )


    yield* waitUntil("prep_exec");
    const reg_inits = [ 0, 20, 30, 6 ];
    const reg_value_refs: Reference<Txt>[] = [mar_value, mdr_value, temp_y_value, temp_z_value];
    const reg_label_refs: Reference<Txt>[] = [mar_label, mdr_label, temp_y_label, temp_z_label];
    const reg_label_offs = [ [-35, 0], [-35, 0], [-52, 3], [-52, 3] ];
    const reg_label_height_deltas = [ 15, 15, 5, 0 ];
    yield* sequence(0.1,
        ...simple_register_labels.map((l, i) => sequence(0.5,
            l.x(100, 0.3).to(-100, 0),
            all(
                l.y(-15, 0),
                l.fontSize(30, 0),
            ),
            l.x(-45, 0.3),
            simple_register_values[i].text("" + reg_inits[i], 0.3),
        )),
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
        ))
    );
    
    yield* waitUntil("high_pc_mar");
    yield* sequence(1,
        wiggle(pc().rotation, 20, -20, 1.3),
        wiggle(mar().rotation, 20, -20, 1.3),
    );

    yield* waitUntil("tick_0");
    control_cbus_wires[control_indices.pc].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    control_cbus_wires[control_indices.mar].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    control_cbus_wires[control_indices.ram].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    pc_control_wire().stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    mar_control_wire().stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    ram_control_wire().stroke(() => Color.lerp("#c2566e", "white", clock_sig()));

    control_label().position([-140, 0]); control_label1().position([-160, 0]); control_label2().position([-120, 0])
    yield* all(
        clock_cycle(8),
        control_label().text("PC_out", 0),
        sequence(1,
            control_label().position([120, 0], 1.2),
            control_label1().position([180, 0], 1.2),
            control_label2().position([150, 0], 1.2),
            sequence(0.4,
                data_label().y(-50, 0.5),
                data_label().x(-220, 0.5),
                all(
                    data_label_mask().height(510, 0),
                    data_label().y(298, 0.5),
                )
            ),
            mar_value().text("0x1000", 0.4),
        )
    )
    control_cbus_wires[control_indices.pc].stroke("#c2566e")
    control_cbus_wires[control_indices.mar].stroke("#c2566e")
    control_cbus_wires[control_indices.ram].stroke("#c2566e")
    pc_control_wire().stroke("#c2566e")
    mar_control_wire().stroke("#c2566e")
    ram_control_wire().stroke("#c2566e")

    const ram_processing = yield loopFor(Infinity, function* () {
        yield* wiggle(ram().rotation, -10, 10, 3);
    });

    yield* waitUntil("incr_pc");
    yield* chain(
        pc().scale(1.3, 0.3),
        pc_value().text("0x1004", 0.3),
        pc().scale(1, 0.3),
    );


    yield* waitUntil("got_instruction");
    cancel(ram_processing);
    yield* ram().rotation(0, 0.3);
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
    yield* sequence(0.1,
        sample_instruction().scale(0, 1),
        sample_instruction().position([-458, 167], 0.8),
    )
    yield* sequence(0.2,
        instruction_tri_fill().x(-20, 0.8),
        instruction_tri_fill().y(210, 0.8)
    );
    
    yield* all(
        computer().scale(1, 0.3),
        computer().bottom(computer().bottom(), 0.3),
        computer_panel_highlight_in().scale(1, 0.3),
        computer_panel_highlight_in().bottom(computer_panel_highlight_in().bottom(), 0.3),
        computer_panel_highlight_out().scale(1, 0.3),
        computer_panel_highlight_out().bottom(computer_panel_highlight_out().bottom(), 0.3),
    );



    yield* waitUntil("tick_1");
    control_cbus_wires[control_indices.mdr].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    control_cbus_wires[control_indices.ir].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    ir_control_wire().stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    mdr_control_wire().stroke(() => Color.lerp("#c2566e", "white", clock_sig()));

    control_label_mask().position([-310, 120]).size([80, 60]);
    control_label().position([-400, 0]).text("MDR_out");
    control_label1_mask().position([-431, -90]).size([210, 60]).rotation(-90);
    control_label1().position([-400, 0]).text("IR_in");
    yield* all(
        clock_cycle(8),
        sequence(1,
            control_label().position([180, 0], 1.2),
            control_label1().position([160, 0], 1.2),
            instruction_mask().size([400, 600], 0),
            all(
                sequence(0.5,
                    ir_label().x(100, 0.3).to(-100, 0),
                    all(
                        ir_label().y(-15, 0),
                        ir_label().fontSize(30, 0),
                    ),
                    ir_label().x(-45, 0.3),
                ),
                sequence(0.4,
                    instruction_tri_fill().y(-50, 0.5),
                    instruction_tri_fill().x(-140, 0.5),
                    instruction_tri_fill().y(-230, 0.5),
                ),
            )
        )
    )
    control_cbus_wires[control_indices.mdr].stroke("#c2566e")
    control_cbus_wires[control_indices.ir].stroke("#c2566e")
    ir_control_wire().stroke("#c2566e")
    mdr_control_wire().stroke("#c2566e")

    yield* waitUntil("control_block");
    yield* wiggle(control_unit().rotation, 10, -10, 0.7);


    
    yield* waitUntil("tick_2");
    control_cbus_wires[control_indices.regs].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    control_cbus_wires[control_indices.temp_y].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    register_file_control_wire().stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    temp_y_control_wire().stroke(() => Color.lerp("#c2566e", "white", clock_sig()));

    control_label_mask().position([440, 115]).size([65, 60]);
    control_label().position([-400, 0]).text("R1_Out");
    control_label1_mask().position([625, -140]).size([320, 60]).rotation(-90);
    control_label1().position([-400, 0]).text("Y_in");
    data_label_mask().y(-78).height(450);
    data_label().position([400, 270]).text("20");
    yield* all(
        clock_cycle(3),
        control_label().position([100, 0], 1.2),
        control_label1().position([260, 0], 1.2),
        sequence(0.3,
            data_label().y(30, 0.5),
            data_label().x(580, 0.5),
            data_label().y(-300, 0.5),
            temp_y_value().text("20", 0.3),
        ),
    )
    control_cbus_wires[control_indices.regs].stroke("#c2566e")
    control_cbus_wires[control_indices.temp_y].stroke("#c2566e")
    register_file_control_wire().stroke("#c2566e")
    temp_y_control_wire().stroke("#c2566e")

    
    yield* waitUntil("tick_3");
    control_cbus_wires[control_indices.regs].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    control_cbus_wires[control_indices.alu].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    control_cbus_wires[control_indices.temp_z].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
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
        clock_cycle(3),
        control_label().position([100, 0], 1.2),
        control_label1().position([260, 0], 1.2),
        control_label2().position([260, 0], 1.2),
        sequence(0.3,
            data_label().y(-46, 0.5),
            data_label().x(130, 0.5),
            data_label().y(-205, 0.5),
            all(
                sequence(0.25,
                    data_label().x(10, 0.5),
                    data_label().opacity(0, 0.1),
                ),
                sequence(0.25,
                    data_label2().x(60, 0.5),
                    data_label2().opacity(0, 0.1),
                )
            ),
            data_label3().x(0, 0.5),
            data_label3().y(10, 0.5),
            data_label3().x(-70, 0.5),
            temp_z_value().text("50", 0.3),
        ),
    )
    control_cbus_wires[control_indices.regs].stroke("#c2566e")
    control_cbus_wires[control_indices.alu].stroke("#c2566e")
    control_cbus_wires[control_indices.temp_z].stroke("#c2566e")
    register_file_control_wire().stroke("#c2566e")
    alu_control_wire().stroke("#c2566e");


    
    yield* waitUntil("tick_4");
    control_cbus_wires[control_indices.temp_z].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    control_cbus_wires[control_indices.regs].stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    temp_z_control_wire().stroke(() => Color.lerp("#c2566e", "white", clock_sig()));
    register_file_control_wire().stroke(() => Color.lerp("#c2566e", "white", clock_sig()));

    control_label2_mask().position([225, -90]).size([220, 60]).rotation(-90);
    control_label2().position([-400, 0]).text("Z_out");
    control_label_mask().position([440, 115]).size([65, 60]);
    control_label().position([-400, 0]).text("R1_in");
    data_label_mask().x(300).y(-25).height(345);
    data_label().position([-115, -200]).text("50").opacity(1);
    yield* all(
        clock_cycle(3),
        control_label2().position([260, 0], 1.2),
        control_label().position([100, 0], 1.2),
        sequence(0.3,
            data_label().y(-20, 0.5),
            data_label().x(100, 0.5),
            data_label().y(200, 0.5),
            simple_register_values[1].text("50", 0.3),
        ),
    )
    control_cbus_wires[control_indices.temp_z].stroke("#c2566e")
    control_cbus_wires[control_indices.regs].stroke("#c2566e")
    temp_z_control_wire().stroke("#c2566e")
    register_file_control_wire().stroke("#c2566e");

    yield* waitUntil("note");
    yield* all(
        computer().x(-2000, 1.2),
        computer_panel_highlight_in().x(-2000, 1.2),
        computer_panel_highlight_out().x(-2000, 1.2),
    );

    const example_ctrl = createRefArray<Node>();
    const example_ctrl_backs = createRefArray<Line>();
    const example_ctrl_highlights = createRefArray<Line>();
    const example_ctrl_labels = createRefArray<Txt>();

    type ctrl_popup = { pos: [number, number]; txt: string; width: number };
    const ctrl_positions: (ctrl_popup)[] = [
        { pos: [0, 0],       txt: "PC_out",    width: 50, },
        { pos: [-628, -254], txt: "IR_in",     width: 50, },
        { pos: [461, -256],  txt: "ALU_add",   width: 60, },
        { pos: [-871, 448],  txt: "Subscribe", width: 75, },
        { pos: [-261, 345],  txt: "MEM_read",  width: 75, },
        { pos: [558, 205],   txt: "Z_out",     width: 35, },
        { pos: [-249, -455], txt: "MDR_out",   width: 75, },

        { pos: [-869, 56],   txt: "CLK",       width: 15, },
        { pos: [218, -63],   txt: "R0_in",     width: 45, },
        { pos: [-280, -24],  txt: "PC_inc",    width: 55, },
        { pos: [604, -384],  txt: "ALU_or",    width: 55, },
        { pos: [142, 429],   txt: "R1_out",    width: 50, },
    ]
    view.add(<>
        {...ctrl_positions.map(t => <Node ref={example_ctrl} position={t.pos} scale={1.3}>
            <Line ref={example_ctrl_backs}
                points={[[-50, -50], [-50, -50], [50, -50], [50, 50], [50, 50], [-50, 50]]}
                closed fill={"#563d7f"} scale={0}
                // rotation={45}
            />
            <Line ref={example_ctrl_highlights}
                points={[[-55, -55], [-55, -55], [55, -55], [55, 55], [55, 55], [-55, 55]]}
                closed lineWidth={2} zIndex={-1}
                stroke={cosmic_grad_ramps[0][0]} scale={0}
                // rotation={45}
            />
            <RoboticText ref={example_ctrl_labels}
                zIndex={2}
                fill={cosmic_grad_ramps[1][1]}
                fontSize={60} fontStyle={""}
                // text={"PC_out"}
            />
        </Node>)}
    </>);
    const show_ctrl = function* (i: number, lab: string, winc: number = 50, compress: number = 10) {
        yield* sequence(0.7,
            sequence(0.1,
                all(
                    example_ctrl_highlights[i].rotation(45, 0.8),
                    example_ctrl_highlights[i].scale(1, 0.8),
                ),
                all(
                    example_ctrl_backs[i].rotation(45, 0.8),
                    example_ctrl_backs[i].scale(1, 0.8),
                ),
            ),
            chain(waitFor(1), example_ctrl[i].scale(0, 2.2)),
            all(
                example_ctrl_backs[i].points     ([[-50-winc+compress, -50+winc+compress], [-50+winc+compress, -50-winc+compress], [50+winc, -50-winc], [50+winc-compress, 50-winc-compress], [50-winc-compress, 50+winc-compress], [-50-winc, 50+winc]], 0.8),
                example_ctrl_highlights[i].points([[-55-winc+compress, -55+winc+compress], [-55+winc+compress, -55-winc+compress], [55+winc, -55-winc], [55+winc-compress, 55-winc-compress], [55-winc-compress, 55+winc-compress], [-55-winc, 55+winc]], 0.8),
                example_ctrl_labels[i].text(lab, 0.8),
            ),
        );
    }

    yield* sequence(0.4,
        ...ctrl_positions.map((t, i) => show_ctrl(i, t.txt, t.width)),
    );
    


    yield* waitUntil("transition_out");
    
    yield* sequence(0.1,
        stage_ref_big_front[0].size([300, 300], 1.2),
        stage_ref_frontings[0].size([170, 170], 1.2),
        stage_refs[0].size([200, 200], 1.2),
        stage_ref_backings[0].size([230, 230], 1.2),
        stage_refs[0].rotation(45, 1.2),
        ...range(4).map(i => stage_labels[i].fontSize(150, 0.2))
    );
    stage_ref_big_front[0].zIndex(-17);
    stage_ref_backings[0].zIndex(-15);
    stage_ref_frontings[0].zIndex(-15);
    stage_labels[0].zIndex(-15);
    stage_refs[0].zIndex(-15);

    stage_ref_big_front[1].zIndex(-10);
    stage_ref_backings[1].zIndex(5);
    stage_ref_frontings[1].zIndex(5);
    stage_labels[1].zIndex(5);
    stage_refs[1].zIndex(5);

    const shot_ray = createRef<Line>();
    view.add(<>
        <Line ref={shot_ray}
            points={[[-627, 129], [-372, -229]]}
            lineWidth={20} end={0}
            stroke={new Gradient({
                type: "linear",
                from: [-627,  129],
                to:   [-372, -229],
                stops: [
                    { offset: 0, color: "#d65db1" },
                    { offset: 1, color: "#9270d3" },
                ]
            })}
        />
    </>);


    yield* waitFor(0.5);
    yield* sequence(0.4,
        shot_ray().end(1, 1.2),
        shot_ray().start(1, 1.2),
    )
    yield* sequence(0.8,
        sequence(0.1,
            stage_refs[1].rotation(45, 1.2),
            stage_refs[1].size([4000, 4000], 1.2),
            stage_ref_frontings[1].size([4000, 4000], 1.2),
            stage_ref_backings[1].size([4000, 4000], 1.2),
            stage_ref_big_front[1].size([4000, 4000], 1.2),
        ),
        sequence(0.4,
            stage_labels[1].position([0, 0], 0.8),
            stage_labels[1].text("Simple Improvements", 0.8),
            part1_label().text("Part II", 0.8)
        )
    );

    yield* waitUntil("end");
    yield* sequence(0.05,
        part1_label().y(part1_label().y() - 800, 0.8),
        stage_labels[1].y(stage_labels[1].y() - 800, 0.8),
    );
});