import { Node, Layout, Line, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
import { all, chain, clamp, Color, createEaseOutBack, createRef, createRefArray, createSignal, easeInBack, easeOutBack, linear, loopFor, range, run, sequence, Vector2, waitFor, waitUntil } from "@motion-canvas/core";
import { RoboticText } from "../../components/defaults";
import { cosmic_grad_ramps, cosmic_analogues } from "../../components/palette";

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
    yield* sequence(0.4,
        blob_indicators[0].scale(1, 0.8),
        blob_indicators[1].scale(1, 0.8),
        blob_indicators[2].scale(1, 0.8),
    );
    yield* waitUntil("splitonce");
    blob_indicators[4].x(blob_indicators[2].x());
    yield* sequence(0.2,
        sequence(0.1,
            ...blob_indicators.map((t, i) => t.x(-600 + clamp(0, 3, i) * 400, 1.2)),
        ),
        blob_indicators[4].scale(1, 1, createEaseOutBack(10)),
    )

    yield* waitUntil("splittwice");
    blob_indicators[3].x(blob_indicators[4].x());
    yield* sequence(0.2,
        sequence(0.1,
            ...blob_indicators.map((t, i) => t.x((-150 * 4) + i * 300, 1.2)),
        ),
        blob_indicators[3].scale(1, 1, createEaseOutBack(10)),
    );

    yield* waitUntil("hyperpipeline");
    
    const hyperpipeline_blob_indicators_parent = createRef<Node>();
    view.add(<Node ref={hyperpipeline_blob_indicators_parent}
        y={300}
    ></Node>);

    const hyper_blob_indicators = createRefArray<Node>();
    const hyper_blob_labels = createRefArray<Txt>();
    const hyper_blob_lines = createRefArray<Line>();
    const hyper_vcached = new Vector2(0, 80); const hyper_vscached = new Vector2(0, 40);
    const hyper_blob_label_strs = [ "F1", "F2", "F3", "D1", "D2", "D3", "D4", "E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "M1", "M2", "M3", "W1", "W2", "W3", ];
    hyperpipeline_blob_indicators_parent().add(<>
        {range(hyper_blob_label_strs.length).map(i => <Node ref={hyper_blob_indicators}
            position={[-(100/2 * (hyper_blob_label_strs.length-1)) + i * 100, 0]}
            scale={0}
        >
            <Line ref={hyper_blob_lines}
                radius={20}
                points={() => [
                    hyper_vcached.scale(1 + Math.sin(time() + 20) * 0.2),
                    hyper_vscached.rotate(45).scale(1 + Math.sin(time() + 80) * 0.2),
                    hyper_vcached.rotate(90).scale(1 + Math.sin(time() + 20) * 0.2),
                    hyper_vscached.rotate(135).scale(1 + Math.sin(time() + 80) * 0.2),
                    hyper_vcached.rotate(180).scale(1 + Math.sin(time() + 20) * 0.2),
                    hyper_vscached.rotate(225).scale(1 + Math.sin(time() + 80) * 0.2),
                    hyper_vcached.rotate(270).scale(1 + Math.sin(time() + 20) * 0.2),
                    hyper_vscached.rotate(315).scale(1 + Math.sin(time() + 80) * 0.2),
                ]}
                closed
                fill={Color.lerp(cosmic_grad_ramps[1][0], cosmic_grad_ramps[1][3], i / hyper_blob_label_strs.length).alpha(0.5)} //d65db155
                rotation={() => (time() + i * 10) * 50}
            >
            </Line>
            
            <RoboticText ref={hyper_blob_labels}
                text={hyper_blob_label_strs[i]} x={-3} y={3}
                fontSize={40}
                fill={Color.lerp(cosmic_grad_ramps[1][0], cosmic_grad_ramps[1][3], i / hyper_blob_label_strs.length)}
            />
        </Node>)}
    </>);
    yield* sequence(0.1,
        ...hyper_blob_indicators.map(t => 
            t.scale(1, 0.8).wait(0.5).back(0.8),
        )
    )

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
                text={"Stage 3"} fill={cosmic_grad_ramps[1][0]}
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
        ram().y(ram().y() + 8, 0.5),
    );
    
//#endregion ComputerDefn
    
    yield* waitUntil("fivemajorstages");
    yield* sequence(0.1,
        ...blob_indicators.map(t => all(
            t.y(1000, 1.2, easeInBack),
            t.scale(0.6, 1.2, easeInBack),
        ))
    )
    yield* all(
        computer().x(0, 1.2),
        computer_panel_highlight_in().x(0, 1.2),
        computer_panel_highlight_out().x(0, 1.2),
    );

    
    const stage4_presenter = createRef<Line>();
    computer().add(<Line ref={stage4_presenter}
        position={[-1200, 432]}
        points={[[-200, 50], [160, 50], [200, -50], [-160, -50]]}
        closed fill={"#d65db1"}
    >
    </Line>)
    yield chain(
        stage4_presenter().x(-700, 0.5),
        all(comp_title().text("Stage 4", 0.2), comp_title().left(comp_title().left(), 0.2)),
        stage4_presenter().x(-1200, 0.5),
    );


    yield* sequence(0.1,
        ...[
            mdr_ram_data_wire,
            mar_ram_data_wire,
            alu_pc_data_wire,
            alu_mdr_data_wire,
            alu_regfile_data_wire,
            control_buffer_mar_data_wire,
            control_buffer_mdr_data_wire,
        ].map(t => chain(
            t().start(1, 0.5),
            run(function* () {
                t().remove();
            })
        )),
        mar().y(mar().y() + 300, 0.5),
        mdr().y(mdr().y() + 300, 0.5),
        control_buffer().size([450, 65], 0.5),
        all(
            pc().x(pc().x() - 30, 0.5),
            pc_ram_data_wire().points([[-575-30, -248], [-575-30, 154]], 0.5),
            ram().x(ram().x() - 30, 0.5),
            prefetch_buffer().x(prefetch_buffer().x() - 50, 0.5),
            ram_prefetch_data_wire().points([[-525-30, 154], [-525-30, 120], [-452-30, 120]], 0.5),
            prefetch_ir_data_wire().points([[-386-30, -281], [-306-30, -281]], 0.5),
            ir().x(ir().x() - 70, 0.5),
            instruction_tri_fill().x(instruction_tri_fill().x() - 70, 0.5),
            ir_ctrl_data_wire().points([[-173-30, -281], [-97-40, -281]], 0.5),
            control_unit().x(control_unit().x() - 105, 0.5),
            control_unit().size(control_unit().size().scale(0.8), 0.5),
            control_unit_label().fontSize(control_unit_label().fontSize() - 10, 0.5),
            register_file().x(register_file().x() - 90, 0.5),
            flags_ctrl_data_wire().points([[-30, -166], [-30, -227]], 0.5),
            control_buffer().x(control_buffer().x() - 180, 0.5),
            regfile_control_buffer_data_wire().points([[11, -30], [197-60, -30]], 0.5),
            control_unit_buffer_data_wire().points([[76, -281], [197-60, -281]], 0.5),
            alu().x(alu().x() - 240, 0.5),
            control_buffer_alu_data_wire_1().points([[384-180, -230], [529-240, -230]], 0.5),
            control_buffer_alu_data_wire_2().points([[384-180, -110], [529-240, -110]], 0.5),
        )
    )
    // yield* internals().x(internals().x() - 60, 0.5);

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

    yield* waitFor(0.5);
    yield* all(output_buffer().size([450, 65], 0.5), output_buffer().rotation(90, 0.5));
    yield* sequence(0.1,
        alu_outputbuffer_data_wire().end(1, 0.5),
        controlbuffer_outputbuffer_data_wire().end(1, 0.5),
        outputbuffer_pc_data_wire().end(1, 0.5),
    )

    yield* waitFor(2.5);
    yield* internals().x(-120, 0.5);
    yield* sequence(0.05,
        mdr().scale(0.8, 0.5),
        mar().scale(0.8, 0.5),
        mdr().position([700, 0], 0.5),
        mar().position([630, 100], 0.5),
    );
    yield* sequence(0.1,
        outputbuffer_mdr_data_wire().end(1, 0.5),
        outputbuffer_mar_data_wire().end(1, 0.5),
        mdr_ram_data_wire().end(1, 0.5),
        mar_ram_data_wire().end(1, 0.5),
        mdr_finalbuffer_data_wire().end(1, 0.5),
        outputbuffer_finalbuffer_data_wire().end(1, 0.5),
    );
    
    yield* all(final_buffer().size([450, 65], 0.5), final_buffer().rotation(90, 0.5));

    yield* waitFor(1);
    yield* all(internals().scale(0.95, 1), internals().x(internals().x()-60, 1));
    yield* finalbuffer_regfile_data_wire().end(1, 0.5);

    yield* waitUntil("end");
})