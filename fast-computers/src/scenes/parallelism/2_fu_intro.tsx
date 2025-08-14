import { Code, CubicBezier, Curve, Layout, Line, makeScene2D, Node, Rect, Txt } from "@motion-canvas/2d";
import { all, chain, Color, createRef, createRefArray, createSignal, easeInCirc, easeOutCirc, linear, loopFor, range, run, sequence, Vector2, waitFor, waitUntil } from "@motion-canvas/core";
import { RoboticText, ThinRoboticText, write_code } from "../../components/defaults";
import { cosmic_grad_ramps, cosmic_analogues } from "../../components/palette";
import { wiggle } from "../../components/misc";


const wave_computer_block = function* (obj: Rect, half_time: number = 0.5, scale_up: number = 1.3) {
    yield* chain(
        run(function* () { obj.zIndex(10); }),
        all(
            obj.scale(scale_up, half_time).back(half_time),
            wiggle(obj.rotation, obj.rotation() + 10, obj.rotation() - 10, half_time * 2),
            obj.stroke("yellow", half_time).back(half_time),
            obj.childAs<Txt>(0).fill("yellow", half_time).back(half_time),
            obj.fill("#5c6b32", half_time).back(half_time),
        ),
        run(function* () { obj.zIndex(0); }),
    )
}

export default makeScene2D(function* (view) {
    const time = createSignal(0);
    const time_loop = yield loopFor(Infinity, function*() {
        yield* time(time() + 10, 10, linear);
    });
    
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
        internals().y(internals().y() + 80, 0),
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

    
    yield* all(
        all(
            ram().scale(0, 0),
            ram().rotation(90, 0),
        ),
        mar_ram_data_wire().end(0, 0),
        mdr_ram_data_wire().end(0, 0),
        pc_ram_data_wire().points([[-575-30, -248], [-575-30, 54]], 0),
        ram_prefetch_data_wire().points([[-539, 120], [-452-30, 120]], 0),
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
    yield* all(
        finalbuffer_regfile_data_wire().points([[883+100, -80], [940+100, -80], [940+100, 250], [-140, 250], [-140, 105]], 0),
        outputbuffer_finalbuffer_data_wire().points([[534+100, -120-150], [817+100, -120-150]], 0),
        all(
            mdr().x(mdr().x() + 25, 0), mdr().y(mdr().y() + 25, 0),
            outputbuffer_mdr_data_wire().points([[533+100, 25], [648+100+25, 25]], 0),
            mdr_finalbuffer_data_wire().points([[752+100+25, 25], [817+100, 25]], 0),
        ),
    );
    yield* all(
        icache().scale(1, 0),
        icache().rotation(0, 0),
    )
    yield* all(
        all(
            dcache().scale(1, 0),
            dcache().rotation(0, 0),
        ),
        mdr_dcache_data_wire().end(1, 0),
        mar_dcache_data_wire().end(1, 0),
    );
    
    const simd_register_container = createRef<Layout>();
    const simd_registers = createRefArray<Rect>();
    const simd_register_labels = createRefArray<Txt>();
    register_file().add(<>
        <Layout ref={simd_register_container}
            direction={"column"}
            x={111} y={130} scale={0.98}
        >
            {range(2).map(i => <Rect ref={simd_registers}
                fill={"#492b61"}
                // size={[130, 65]}
                lineWidth={4} y={-100+i*65}
                rotation={90}
                stroke={"#ae56c5"} clip
            >
                <RoboticText ref={simd_register_labels}
                    y={4}
                    fill={cosmic_analogues[1][0]}
                    fontSize={50} fontStyle={""}
                    text={"S" + i}
                />
            </Rect>)}
        </Layout>
    </>);

    yield* all(
        ...simd_registers.map(t => all(t.size([130, 65], 0), t.rotation(0, 0))),
    );
    
    yield* all(
        alu().scale(0.8, 0),
        alu().y(alu().y() + 150, 0),
        control_buffer_alu_data_wire_1().points([[384-180+100, -230+150], [529-240+112, -230+150]], 0),
        control_buffer_alu_data_wire_2().points([[384-180+100, -110+150], [529-240+112, -110+150]], 0),
        alu_outputbuffer_data_wire().points([[400+86, -170+150], [466+100, -170+150]], 0),
        controlbuffer_outputbuffer_data_wire().points([[203+100, 40+60], [466+100, 40+60]], 0),
    );
    const vec_exec_unit = alu().snapshotClone();
    const control_buffer_vecunit_data_wire_1 = createRef<Line>();
    const control_buffer_vecunit_data_wire_2 = createRef<Line>();
    const vecunit_outputbuffer_data_wire = createRef<Line>();
    blocks().add(vec_exec_unit);
    wires().add(<>
        <Line ref={control_buffer_vecunit_data_wire_1}
            points={[[384-180+100+30, -230+150], [384-180+100+30, -230+150-200], [529-240+112, -230+150-200]]}
            lineWidth={10} stroke={"#ff6f91"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={control_buffer_vecunit_data_wire_2}
            points={[[384-180+100+50, -110+150], [384-180+100+50, -110+150-200], [529-240+112, -110+150-200]]}
            lineWidth={10} stroke={"#ff6f91"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <Line ref={vecunit_outputbuffer_data_wire}
            points={[[400+86, -170+150-200], [466+100, -170+150-200]]}
            lineWidth={10} stroke={"#ff6f91"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
    </>)
    yield* all(
        vec_exec_unit.y(vec_exec_unit.y() - 200, 0),
        vec_exec_unit.childAs<Txt>(0).text("VEC", 0),
    );
    yield* all(
        control_buffer_vecunit_data_wire_1().end(1, 0),
        control_buffer_vecunit_data_wire_2().end(1, 0),
        vecunit_outputbuffer_data_wire().end(1, 0),
    );

    ram().remove();
    instruction_mask().remove();
    // #endregion Computer Stuff

    yield* waitUntil("computer_is_back");
    yield* computer_stuff().x(0, 1.2);
    yield* waitUntil("dupe_everything");
    
    const stage5_presenter = createRef<Line>();
    computer().add(<Line ref={stage5_presenter}
        position={[-1200, 432]}
        points={[[-200, 50], [160, 50], [200, -50], [-160, -50]]}
        closed fill={"#d65db1"}
    >
    </Line>)
    yield chain(
        stage5_presenter().x(-700, 0.5),
        all(comp_title().text("Stage 5", 0.2), comp_title().left(comp_title().left(), 0.2)),
        stage5_presenter().x(-1200, 0.5),
    );

    internals().save();
    yield* all(
        internals().scale(0.55, 1.2),
        internals().x(internals().x() + 40, 1.2),
    );

    const internals_clone = internals().clone();
    computer().add(internals_clone);
    yield* all(
        internals().y(internals().y() - 200, 0.8),
        internals_clone.y(internals_clone.y() + 200, 0.8),
    );
    const cloned_blocks = internals_clone.childAs<Node>(0);
    const cloned_wires = internals_clone.childAs<Node>(1);

    yield* waitUntil("justmostofit");
    yield* sequence(0.01,
        ...[4, 5, 6, 12, 13, 18, 19, 20, 21].map(i => all(
            cloned_blocks.childAs<Node>(i).scale(0, 0.5),
            cloned_blocks.childAs<Node>(i).rotation(90, 0.5),
        )),
        ...[0, 1, 2, 3, 4, 11, 20, 21, 22, 23, 24].map(i => cloned_wires.childAs<Line>(i).end(0, 0.5)),
    );
    yield* all(
        internals().scale(0.65, 1.2),     internals().y(internals().y() + 25, 1.2),
        internals_clone.scale(0.65, 1.2), internals_clone.y(internals_clone.y() + 25, 1.2),
    );
    yield* all(
        cloned_wires.childAs<Line>(5) .points([[197-90+100, -895], [197-90+100, -281], [197-60+100, -281]], 0.5),
        cloned_wires.childAs<Line>(5) .zIndex(-1, 0),
        cloned_wires.childAs<Line>(6) .points([[11+48, -645], [11+48, -30], [197-60, -30]], 0.5),
        cloned_wires.childAs<Line>(6) .zIndex(-1, 0),
        cloned_wires.childAs<Line>(16).points([[883+100, -80], [940+100, -80], [940+100, 250], [-140, 250], [-140, -510]], 0.5),
        cloned_wires.childAs<Line>(16).zIndex(-1, 0),
    );

    computer_stuff().save();

    yield* waitUntil("thefetchpullsinmore");
    yield* all(
        computer_stuff().scale(2.5, 1.2),
        computer_stuff().position([600, 450], 1.2),
    )
    yield* wave_computer_block(prefetch_buffer(), 0.8, 1.3);
    yield* all(
        prefetch_buffer().size([550, 65], 0.8),
        prefetch_buffer().left(prefetch_buffer().left(), 0.8),
    );

    yield* waitUntil("widedecode");
    yield* wave_computer_block(control_unit(), 0.8, 1.3);
    yield* control_unit_label().text("2-Wide\nDecode", 1);

    yield* waitUntil("forwardtocontrol");
    yield* computer_stuff().restore(1.2);
    yield* sequence(0.2,
        wave_computer_block(control_buffer(), 0.8, 1.5),
        wave_computer_block(cloned_blocks.childAs<Rect>(14), 0.8, 1.5),
    );

    yield* waitUntil("thedatapathisskipped");
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
    yield* waitUntil("donedatapath");
    yield* all(
        computer().right(computer().right(), 1.2),
        computer_panel_highlight_in().right(computer_panel_highlight_in().right(), 1.2),
        computer_panel_highlight_out().right(computer_panel_highlight_out().right(), 1.2),
        computer().scale(1, 1.2),
        computer_panel_highlight_in().scale(1, 1.2),
        computer_panel_highlight_out().scale(1, 1.2),
    );

    const wideness = createRef<Layout>();
    const wideness_txts = createRefArray<Txt>();
    const wideness_txt_strs = [ "2-wide ... OK", "3-wide ... UHH", "4-wide ... PAIN" ];
    computer().add(<>
        <Layout ref={wideness}
            position={[-750, 150]}
        >
            {...range(wideness_txt_strs.length).map(i => <RoboticText ref={wideness_txts}
                y={i * 60}
                fontSize={80} offset={[-1, 0]}
                fill={cosmic_grad_ramps[3][i]}
                fontStyle={""}
                // text={wideness_txt_strs[i]}
            />)}
        </Layout>
    </>);

    yield* sequence(1.5,
        ...wideness_txts.map((t, i) => t.text(wideness_txt_strs[i], 0.8)),
    );

    yield* waitUntil("themoreimportantpoint");
    yield* all(
        computer_stuff().x(-2000, 1.2),
    )
    wideness_txts.forEach(t => t.text(""));

    const theprogrammershouldntknow = createRef<Layout>();
    const theprogrammershouldntknow_labels = createRefArray<Txt>();
    const theprogrammershouldntknow_label_strs  = [ "The programmer", "shouldn't", "have to care" ];
    const theprogrammershouldntknow_label_sizes = [ 100, 140, 100 ];
    view.add(<>
        <Layout ref={theprogrammershouldntknow}
            layout direction={"row"}
            alignItems={"center"}
            gap={20}
            position={[0, -100]}
        >
            {...range(wideness_txt_strs.length).map(i => <RoboticText ref={theprogrammershouldntknow_labels}
                fontSize={theprogrammershouldntknow_label_sizes[i]}
                fill={cosmic_grad_ramps[1][i]}
                fontStyle={""}
                // text={theprogrammershouldntknow_label_strs[i]}
            />)}
        </Layout>
    </>);
    yield* waitFor(1);
    yield* sequence(0.6,
        ...theprogrammershouldntknow_labels.map((t, i) => t.text(theprogrammershouldntknow_label_strs[i], 0.8)),
    );

    yield* waitUntil("idealcase");
    yield* theprogrammershouldntknow().y(-1000, 1.2);

    yield* waitUntil("twoindieinstructions");
    const indieinstructions = createRef<Code>();
    const depinstructions = createRef<Code>();
    const indielines = createRefArray<Curve>();
    const indieline_txts = createRefArray<Txt>();
    view.add(<>
        <Code ref={indieinstructions}
            code={""}
            fontSize={60}
        />
        <Code ref={depinstructions}
            code={""}
            fontSize={60}
        />
        <CubicBezier ref={indielines}
            p0={[-204, -147]}
            p1={[-300, -147]}
            p2={[-300, -67]}
            p3={[-204, -67]}
            lineWidth={10} stroke={cosmic_grad_ramps[1][2]}
            startArrow endArrow arrowSize={20} end={0}
        />
        <CubicBezier ref={indielines}
            p0={[-204, 147-4]}
            p1={[-300, 147-4]}
            p2={[-300, 67-4]}
            p3={[-204, 67-4]}
            lineWidth={10} stroke={cosmic_grad_ramps[1][2]}
            startArrow endArrow arrowSize={20} end={0}
        />
        <ThinRoboticText ref={indieline_txts}
            // text={"Independent"}
            position={[-450, -110]}
            fill={cosmic_grad_ramps[1][2]}
            fontSize={80}
        />
        <ThinRoboticText ref={indieline_txts}
            // text={"Independent"}
            position={[-450, 110-4]}
            fill={cosmic_grad_ramps[1][2]}
            fontSize={80}
        />
    </>);
    
    yield* write_code(indieinstructions(), `\
mov r1, 10h
mov r2, 15h

imul r1, 2h
imul r2, 2h`, 1.2);
    yield* sequence(0.1, ...indielines.map(t => t.end(1, 0.5)));
    yield* sequence(0.1, ...indieline_txts.map(t => t.text("Independent", 0.5)));

    yield* waitFor(3);
    yield* sequence(0.1,
        ...indielines.map(t => t.end(0, 0.5)),
        ...indieline_txts.map(t => t.text("", 0.5))
    )
    yield* indieinstructions().x(-600, 0.8);
    yield* write_code(depinstructions(), `\
mov r1, 10h
imul r1, 2h

mov r2, 15h
imul r2, 2h`, 1.2);
    yield* waitUntil("dependents");

    indielines.forEach(t => {
        t.remove();
        t.dispose();
    })
    indieline_txts.forEach(t => {
        t.remove();
        t.dispose();
    })
    indielines.splice(0, indielines.length);
    indieline_txts.splice(0, indieline_txts.length);

    view.add(<>
        <CubicBezier ref={indielines}
            p0={[204, -147]}
            p1={[300, -147]}
            p2={[300, -67]}
            p3={[204, -67]}
            lineWidth={10} stroke={cosmic_grad_ramps[1][2]}
            startArrow endArrow arrowSize={20} end={0}
        />
        <CubicBezier ref={indielines}
            p0={[204, 147-4]}
            p1={[300, 147-4]}
            p2={[300, 67-4]}
            p3={[204, 67-4]}
            lineWidth={10} stroke={cosmic_grad_ramps[1][2]}
            startArrow endArrow arrowSize={20} end={0}
        />
        <ThinRoboticText ref={indieline_txts}
            // text={"Independent"}
            position={[450, -110]}
            fill={cosmic_grad_ramps[1][2]}
            fontSize={80}
        />
        <ThinRoboticText ref={indieline_txts}
            // text={"Independent"}
            position={[450, 110-4]}
            fill={cosmic_grad_ramps[1][2]}
            fontSize={80}
        />
    </>)
    yield* sequence(0.1, ...indielines.map(t => t.end(1, 0.5)));
    yield* sequence(0.1, ...indieline_txts.map(t => t.text("Dependent", 0.5)));

    yield* waitFor(4);
    yield* sequence(0.1,
        ...indielines.map(t => t.end(0, 0.5)),
        ...indieline_txts.map(t => t.text("", 0.5))
    );

    yield* waitUntil("widernet");
    yield* indieinstructions().x(-2000, 1.2);
    indielines.forEach(t => {
        t.remove();
        t.dispose();
    })
    indieline_txts.forEach(t => {
        t.remove();
        t.dispose();
    })
    indielines.splice(0, indielines.length);
    indieline_txts.splice(0, indieline_txts.length);
    view.add(<>
        <CubicBezier ref={indielines}
            p0={[210, -140]}
            p1={[300, -140]}
            p2={[300, 66]}
            p3={[210, 66]}
            lineWidth={10} stroke={cosmic_grad_ramps[1][2]}
            startArrow endArrow arrowSize={20} end={0}
        />
        <CubicBezier ref={indielines}
            p0={[-210, -75]}
            p1={[-300, -75]}
            p2={[-300, 139]}
            p3={[-210, 139]}
            lineWidth={10} stroke={cosmic_grad_ramps[1][2]}
            startArrow endArrow arrowSize={20} end={0}
        />
        <ThinRoboticText ref={indieline_txts}
            // text={"Independent"}
            position={[440, -30]}
            fill={cosmic_grad_ramps[1][2]}
            fontSize={80}
        />
        <ThinRoboticText ref={indieline_txts}
            // text={"Independent"}
            position={[-450, 30]}
            fill={cosmic_grad_ramps[1][2]}
            fontSize={80}
        />
    </>)
    yield* waitFor(2);
    yield* sequence(0.1, ...indielines.map(t => t.end(1, 0.5)));
    yield* sequence(0.1, ...indieline_txts.map(t => t.text("Independent", 0.5)));

    yield* waitUntil("letsdoit");
    yield* all(
        depinstructions().x(2000, 1.2),
        ...indielines.map(t => t.x(2000, 1.2)),
        ...indieline_txts.map(t => t.x(2000, 1.2)),
        computer_stuff().x(0, 1.2),
    );

    yield* sequence(0.01,
        ...cloned_wires.childrenAs<Line>().map(t => all(
            t.end(0, 0.5),
        )),
        ...cloned_blocks.childrenAs<Rect>().map(t => all(
            t.scale(0, 0.5),
            t.rotation(t.rotation() + 90, 0.5),
        )),
    );
    yield* all(
        internals().restore(1.2),
        chain(
            stage5_presenter().x(-700, 0.5),
            all(comp_title().text("Stage 6", 0.2), comp_title().left(comp_title().left(), 0.2)),
            stage5_presenter().x(-1200, 0.5),
        )
    );
    
    yield* wave_computer_block(prefetch_buffer(), 0.8, 1.3);
    yield* all(
        prefetch_buffer().size([600, 65], 0.8),
        prefetch_buffer().left(prefetch_buffer().left(), 0.8),
    );

    yield* wave_computer_block(control_unit(), 0.8, 1.3);
    yield* control_unit_label().text("N-Wide\nDecode", 0.8);

    yield* waitUntil("uop_queue");
    yield* wave_computer_block(control_buffer(), 0.8, 1.3);
    yield* control_buffer_label().text("μ-OP Queue", 0.8);

    yield* waitUntil("cleareverythingafter");
    yield* sequence(0.01,
        ...[
            vec_exec_unit,
            alu(),
            output_buffer(),
            dcache(),
            mar(),
            mdr(),
            final_buffer(),
            selectblock()
        ].map(t => all(
            t.scale(0, 0.5),
            t.rotation(t.rotation() + 90, 0.5),
        )),
        ...[
            control_buffer_alu_data_wire_1(),
            control_buffer_alu_data_wire_2(),
            control_buffer_vecunit_data_wire_1(),
            control_buffer_vecunit_data_wire_2(),
            outputbuffer_mar_data_wire(),
            outputbuffer_mdr_data_wire(),
            mar_dcache_data_wire(),
            mdr_dcache_data_wire(),
            finalbuffer_decode_data_wire(),
            outputbuffer_decode_data_wire(),
            outputbuffer_finalbuffer_data_wire(),
            controlbuffer_outputbuffer_data_wire(),
            vecunit_outputbuffer_data_wire(),
            alu_outputbuffer_data_wire(),
            finalbuffer_regfile_data_wire(),
            mdr_finalbuffer_data_wire(),
            outputbuffer_pc_data_wire(),
            selectblock_controlbuffer_data_wire(),
        ].map(t => t.end(0, 0.5)),
        control_buffer().x(control_buffer().x() - 100, 0.5),
        control_unit_buffer_data_wire().points([[76, -281], [197-60, -281]], 0.5),
    );

    yield* waitUntil("cleanslate");
    const ooo_stuff = createRef<Rect>();
    const ooo = createRef<Rect>();
    const ooo_panel_highlight_in  = createRef<Rect>();
    const ooo_panel_highlight_out = createRef<Rect>();
    const ooo_internals = createRef<Node>();
    const ooo_backsquare = createRef<Rect>();
    const ooo_blocks = createRef<Node>();
    const ooo_wires = createRef<Node>();
    const ooo_title = createRef<Txt>();
    
    view.add(<Rect ref={ooo_stuff} x={2000}>
        <Rect
            ref={ooo}
            fill={cosmic_grad_ramps[1][0] + "22"}
            lineWidth={10}
            stroke={cosmic_grad_ramps[1][0]}
            size={"90%"}
            clip
        >
            <RoboticText ref={ooo_title}
                fontSize={80}  
                offset={[0, 0.5]} position={[-640, 465]}
                text={"CPU Backend"} fill={cosmic_grad_ramps[1][0]}
            />
            <Rect ref={ooo_backsquare}
                size={1700}
                fill={cosmic_analogues[1][1] + "01"}
                zIndex={-3}
            />
            <Node ref={ooo_internals} y={-35}>
                <Node ref={ooo_blocks} zIndex={3}/>
                <Node ref={ooo_wires}/>
            </Node>
        </Rect>
        <Rect
            ref={ooo_panel_highlight_in}
            lineWidth={3}
            size={{"x":1728-20,"y":972-20}}
            stroke={cosmic_grad_ramps[1][0] + "44"}
        />
        <Rect
            ref={ooo_panel_highlight_out}
            lineWidth={3}
            size={{"x":1728+20,"y":972+20}}
            stroke={cosmic_grad_ramps[1][0] + "44"}
        />
    </Rect>);

    yield* all(
        ooo_stuff().x(0, 1.2),
        computer_stuff().x(-2000, 1.2),
    )

    const ooo_looper = yield loopFor(Infinity, function*() {
        yield* ooo_backsquare().rotation(ooo_backsquare().rotation() + 360, 20, linear);
    });

    yield* waitUntil("bringbackthethings");
    const ooo_uop_queue = control_buffer().clone();
    const ooo_register_file = register_file().clone();
    const ooo_dcache = dcache().clone();
    const ooo_alu = alu().clone();

    const bring_in_clone = function* (t: Node, p: [number, number]) {
        yield* chain(
            all(
                t.scale(1.4, 1.6, easeOutCirc).to(1, 1, easeInCirc),
                t.position([p[0], p[1]-35], 2),
            ),
            run(function* () {
                t.remove();
                t.position(p);
                ooo_blocks().add(t);
            })
        );
    }

    ooo_uop_queue.x(-2000).width(ooo_uop_queue.width() + 200);
    ooo_register_file.x(-2000);
    ooo_dcache.x(-2000).rotation(0);
    ooo_alu.x(-2000).rotation(180);
    view.add(ooo_uop_queue);
    view.add(ooo_register_file);
    view.add(ooo_dcache);
    view.add(ooo_alu);
    
    yield* sequence(0.8,
        bring_in_clone(ooo_register_file, [-500, 75]),
        bring_in_clone(ooo_dcache, [500, 188]),
        bring_in_clone(ooo_uop_queue, [-180, 0]),
        bring_in_clone(ooo_alu, [100, 0]),
    );

    yield* waitUntil("dupealu");
    const ooo_alu_clones = [ ooo_alu ];
    for (let i = 1; i < 7; i++) {
        const cl = ooo_alu.clone();
        ooo_alu_clones.push(cl);
        ooo_blocks().add(cl);
    }

    yield* sequence(0.1,
        ...ooo_alu_clones.map((t, i) => all(
            t.scale(0.8, 0.8),
            t.y(-300 + i * 100, 0.8),
        ))
    );

    yield* waitUntil("funcunits");
    const functional_units_parent = createRef<Node>();
    const functional_units = createRefArray<Rect>();
    const functional_unit_labels = createRefArray<Txt>();
    
    const functional_unit_lengths    = createSignal([ 300, 300, 300, 300, 300, 300, 300, 300 ]);
    const functional_unit_label_strs = [ "Integer Mul/Div", "Integer Add/Sub", "Integer Add/Sub", "Vector Ops",
                                         "Logical Ops", "Load/Store", "Branch" ];
    const fu_strokes = [ "#c55656", "#c59156", "#c59156", "#b6c556", "#81c556", "#56c59c", "#568ac5" ];
    const fu_fills   = [ "#4e2b2b", "#4e3a2b", "#4e3a2b", "#4e4b2b", "#3a4e2b", "#2b4e41", "#2b344e" ];

    ooo_blocks().add(<>
        <Node ref={functional_units_parent}>
            {...functional_unit_label_strs.map((s, i) => <Rect ref={functional_units}
                fill={fu_fills[i]}
                position={[0, -300 + i * 100]}
                offset={[-1, 0]} scale={0} rotation={90}
                size={() => [functional_unit_lengths()[i], 65]}
                lineWidth={4} clip
                stroke={fu_strokes[i]}
            >
                <RoboticText
                    ref={functional_unit_labels} y={4}
                    fill={fu_strokes[i]}
                    fontSize={40} fontStyle={""}
                    text={functional_unit_label_strs[i]}
                />
            </Rect>)}
        </Node>
    </>);

    yield* sequence(0.1,
        ...functional_units.map((t, i) => all(
            ooo_alu_clones[i].scale(0, 0.5),
            functional_units[i].scale(1, 0.5),
            functional_units[i].rotation(0, 0.5),
        ))
    )
    

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
    

    yield* waitUntil("clockcyclediff");
    functional_units.forEach(t => t.offset([0, 0]).x(t.x() + 150))
    
    yield* wave_computer_block(functional_units[1], 0.8);
    yield* waitFor(1);
    yield* wave_computer_block(functional_units[0], 0.8);

    yield* waitUntil("thefunpart");
    yield* all(
        ooo().left(ooo().left(), 1.2),
        ooo().scale(0.9, 1.2),
        ooo_panel_highlight_in().left(ooo_panel_highlight_in().left(), 1.2),
        ooo_panel_highlight_in().scale(0.9, 1.2),
        ooo_panel_highlight_out().left(ooo_panel_highlight_out().left(), 1.2),
        ooo_panel_highlight_out().scale(0.9, 1.2),
    );

    yield* waitUntil("runthroughmicroops");
    yield* wave_computer_block(ooo_uop_queue, 0.8);
    yield* waitUntil("runthroughfuncunits");
    yield* sequence(0.1,
        ...functional_units.map(t => wave_computer_block(t, 0.8)),
    );

    yield* waitUntil("end");
    yield* all(
        ooo().left(ooo().left(), 1.2),
        ooo().scale(1, 1.2),
        ooo_panel_highlight_in().left(ooo_panel_highlight_in().left(), 1.2),
        ooo_panel_highlight_in().scale(1, 1.2),
        ooo_panel_highlight_out().left(ooo_panel_highlight_out().left(), 1.2),
        ooo_panel_highlight_out().scale(1, 1.2),
    );
})