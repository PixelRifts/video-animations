import { Circle, CubicBezier, Curve, Icon, Layout, Line, makeScene2D, Node, Rect, Txt } from "@motion-canvas/2d";
import { all, cancel, chain, Color, createRef, createRefArray, createSignal, debug, easeInCirc, easeInSine, easeOutCirc, easeOutSine, linear, loop, loopFor, noop, PossibleColor, range, run, sequence, Vector2, waitFor, waitUntil } from "@motion-canvas/core";
import { RoboticText, ThinRoboticText } from "../../components/defaults";
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

const flash_computer_block = function* (obj: Rect, half_time: number = 0.5, scale_up: number = 1.3) {
    yield* all(
        obj.stroke("yellow", half_time).back(half_time),
        obj.childAs<Txt>(0).fill("yellow", half_time).back(half_time),
        obj.fill("#5c6b32", half_time).back(half_time),
        obj.scale(scale_up, half_time).back(half_time),
    )
}

const finished_computer_block = function* (obj: Rect, half_time: number = 0.5, scale_up: number = 1.3) {
    yield* all(
        obj.scale(scale_up, half_time).back(half_time),
        obj.stroke("#81c556", half_time).back(half_time),
        obj.childAs<Txt>(0).fill("#81c556", half_time).back(half_time),
        obj.fill("#3a4e2b", half_time).back(half_time),
    )
}
const errored_computer_block = function* (obj: Rect, half_time: number = 0.5, scale_up: number = 1.3) {
    yield* all(
        obj.scale(scale_up, half_time).back(half_time),
        obj.stroke("#c55656", half_time).back(half_time),
        obj.childAs<Txt>(0).fill("#c55656", half_time).back(half_time),
        obj.fill("#3a4e2b", half_time).back(half_time),
        wiggle(obj.rotation, obj.rotation() + 10, obj.rotation() - 10, half_time * 2)
    )
}

const DEBUG = false;
const show_mask = function (obj: Rect) { if (DEBUG) obj.lineWidth(5).stroke("red"); }
const hide_mask = function (obj: Rect) { if (DEBUG) obj.lineWidth(0); }

const STATUS_GREEN = "#81c556";
const STATUS_RED   = "#c55656";

export default makeScene2D(function* (view) {
    const time = createSignal(0);
    const time_loop = yield loopFor(Infinity, function*() {
        yield* time(time() + 10, 10, linear);
    });

    //#region Computer stuff
    
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
                text={"Stage 6"} fill={cosmic_grad_ramps[1][0]}
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
    
    yield* control_unit_label().text("N-Wide\nDecode", 0);
    yield* control_buffer_label().text("μ-OP Queue", 0);

    yield* all(
        ...[
            vec_exec_unit,
            alu(),
            output_buffer(),
            mar(),
            mdr(),
            final_buffer(),
            selectblock()
        ].map(t => all(
            t.scale(0, 0),
            t.rotation(t.rotation() + 90, 0),
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
        ].map(t => t.end(0, 0)),
        control_buffer().x(control_buffer().x() - 100, 0),
        control_unit_buffer_data_wire().points([[76, -281], [197-60, -281]], 0),
    );
    //#endregion Computer Stuff

    //#region OoO Stuff

    const ooo_stuff = createRef<Rect>();
    const ooo = createRef<Rect>();
    const ooo_panel_highlight_in  = createRef<Rect>();
    const ooo_panel_highlight_out = createRef<Rect>();
    const ooo_internals = createRef<Node>();
    const ooo_backsquare = createRef<Rect>();
    const ooo_blocks = createRef<Node>();
    const ooo_wires = createRef<Node>();
    const ooo_title = createRef<Txt>();
    
    view.add(<Rect ref={ooo_stuff} x={0}>
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

    const ooo_looper = yield loopFor(Infinity, function*() {
        yield* ooo_backsquare().rotation(ooo_backsquare().rotation() + 360, 20, linear);
    });

    const ooo_uop_queue = control_buffer().clone();
    const ooo_register_file = register_file().clone();
    const ooo_dcache = dcache().clone();
    const ooo_alu = alu().clone();

    const bring_in_clone = function* (t: Node, p: [number, number]) {
        yield* chain(
            all(
                t.position([p[0], p[1]-35], 0),
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
    
    yield* all(
        bring_in_clone(ooo_register_file, [-500, 75]),
        bring_in_clone(ooo_dcache, [500, 188]),
        bring_in_clone(ooo_uop_queue, [-180, 0]),
        bring_in_clone(ooo_alu, [100, 0]),
    );

    const ooo_alu_clones = [ ooo_alu ];
    for (let i = 1; i < 7; i++) {
        const cl = ooo_alu.clone();
        ooo_alu_clones.push(cl);
        ooo_blocks().add(cl);
    }

    yield* all(
        ...ooo_alu_clones.map((t, i) => all(
            t.scale(0.8, 0),
            t.y(-300 + i * 100, 0),
        ))
    );

    const functional_units_parent = createRef<Node>();
    const functional_units = createRefArray<Rect>();
    const functional_unit_labels = createRefArray<Txt>();
    const functional_unit_statuses = createRefArray<Rect>();
    
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
                lineWidth={4}
                stroke={fu_strokes[i]}
            >
                <RoboticText
                    ref={functional_unit_labels} y={4}
                    fill={fu_strokes[i]}
                    fontSize={40} fontStyle={""}
                    text={functional_unit_label_strs[i]}
                />
                <Rect ref={functional_unit_statuses}
                    position={[150, -65/2]}
                    rotation={45}
                    fill={"#c55656"}
                    layout={false}
                />
            </Rect>)}
        </Node>
    </>);

    yield* all(
        ...functional_units.map((t, i) => all(
            ooo_alu_clones[i].scale(0, 0),
            functional_units[i].scale(1, 0),
            functional_units[i].rotation(0, 0),
        ))
    )
    
    functional_units.forEach(t => t.offset([0, 0]).x(t.x() + 150))

    //#endregion OoO Stuff

    yield* waitUntil("minify_and_enqueue");

    const stage1_presenter = createRef<Line>();
    ooo().add(<Line ref={stage1_presenter}
        position={[-1200, 432]}
        points={[[-600, 50], [160, 50], [200, -50], [-560, -50]]}
        closed fill={"#d65db1"}
    >
    </Line>)
    yield chain(
        stage1_presenter().x(-550, 0.5),
        all(ooo_title().text("CPU Backend 1", 0.2), ooo_title().left(ooo_title().left(), 0.2)),
        stage1_presenter().x(-1200, 0.5),
    );

    yield* ooo_internals().scale(1.1, 0.5);
    yield* sequence(0.05,
        all(
            ooo_register_file.scale(0.7, 0.5),
            // ooo_register_file.x(ooo_register_file.x() - 50, 0.5)
        ),
        all(
            ooo_uop_queue.top(ooo_uop_queue.top(), 0.5),
            ooo_uop_queue.size([650, 130], 0.5),
            ooo_uop_queue.childAs<Txt>(0).y(40, 0.5),
        )
    );
    const queue_slot_parent = createRef<Layout>();
    const queue_slots = createRefArray<Rect>();
    const queue_slot_statuses = createRefArray<Rect>();
    ooo_uop_queue.add(<>
        <Layout ref={queue_slot_parent}
            y={-30}
            layout
        >
            {...range(11).map(i => <Rect ref={queue_slots}
                size={55}
                lineWidth={3} stroke={"#d65d7455"}
                scale={0} rotation={90}
            >
                <Rect ref={queue_slot_statuses}
                    position={[-28, 28]}
                    // size={8}
                    rotation={45}
                    fill={i == 10 ? STATUS_GREEN : "#c55656"}
                    layout={false}
                />
            </Rect>)}
        </Layout>
    </>);

    const ooo_decoder_to_uop_queue_wire = createRef<Line>();
    const ooo_decoder_to_uop_queue_wire_label = createRef<Txt>();
    ooo_wires().add(<>
        <Line ref={ooo_decoder_to_uop_queue_wire}
            points={[[-500, -275], [-277, -275]]}
            lineWidth={10} stroke={"#ff6f91"}
            endArrow arrowSize={15} end={0}
        >
        </Line>
        <ThinRoboticText ref={ooo_decoder_to_uop_queue_wire_label}
            fill={"#ff6f91"}
            position={[-400, -305]}
            // text={"From Decode"}
        >
        </ThinRoboticText>
    </>);
    yield* sequence(0.02,
        ...queue_slots.map(t => all(t.scale(1, 0.5), t.rotation(0, 0.5))),
        ooo_decoder_to_uop_queue_wire().end(1, 0.5),
        ooo_decoder_to_uop_queue_wire_label().text("From Decode", 0.5),
    );

    yield* waitUntil("add_uops");

    const ooo_uop_entry_parent = createRef<Node>();
    const ooo_uop_entry_masks  = createRefArray<Rect>();
    const ooo_uop_entries      = createRefArray<Line>();
    const ooo_uop_fus          = [ 0, 1, 2, 0, 0 ];
    ooo_internals().add(<>
        <Node ref={ooo_uop_entry_parent} zIndex={10}>
            {...range(5).map(i => <Rect ref={ooo_uop_entry_masks}
                // stroke={"red"} lineWidth={10}
                position={[-400,0]}
                size={[700, 800]}
                zIndex={5-i}
                clip
            >
                <Line ref={ooo_uop_entries}
                    position={[-560+400, -275]}
                    closed radius={5}
                    lineWidth={3}
                    rotation={() => time() * 20}
                    stroke={fu_strokes[ooo_uop_fus[i]]}
                    fill={fu_fills[ooo_uop_fus[i]]}
                    opacity={0}
                    points={[
                        new Vector2(0, 25),
                        new Vector2(0, 25).rotate(120),
                        new Vector2(0, 25).rotate(240),
                    ]}
                >
                </Line>
            </Rect>)}
        </Node>
    </>);
    yield* sequence(0.1,
        ...ooo_uop_entries.map((t, i) => sequence(0.2,
            t.opacity(1, 0.3),
            t.x(-182 + 400, 0.5),
            t.y(276 - i * 55, 0.5),
        ))
    );

    yield* waitUntil("firstuop");
    ooo_uop_queue.clip(false)
    yield ooo_uop_entries[0].scale(4, 0.8).wait(6).back(0.8);
    yield* waitFor(2);
    yield* wave_computer_block(functional_units[0], 0.8);

    yield* waitUntil("issue_the_microop");
    const ooo_uop_queue_fu_wires = createRefArray<Line>();
    ooo_wires().add(<>
        {...range(7).map(i => <Line ref={ooo_uop_queue_fu_wires}
            points={[[-147, functional_units[i].left().y], functional_units[i].left()]}
            lineWidth={10} stroke={"#ff6f91"}
            endArrow arrowSize={15} end={0}
        >
        </Line>)}
    </>);

    yield* sequence(0.01,
        ...ooo_uop_queue_fu_wires.map(t => t.end(1, 0.5)),
    )


    show_mask(ooo_uop_entry_masks[0]);
    ooo_uop_entry_masks[0].size([500, 800]);
    yield* ooo_uop_entries[0].x(ooo_uop_entries[0].x() + 100, 0.8);
    yield sequence(0.1,
        ...ooo_uop_entries.slice(1).map(t => t.y(t.y() + 55, 0.5)),
    )
    
    ooo_uop_entry_masks[0].position(ooo_uop_queue_fu_wires[0].getPointAtPercentage(0.5).position).size(140)
    ooo_uop_entries[0].x(-150).y(0).scale(2);
    yield* ooo_uop_entries[0].x(150, 1.2);

    let fu_one_loop = yield loopFor(Infinity, function* () {
        yield* functional_units[0].rotation(5, 0.5, easeOutSine)
            .back(0.5, easeInSine)
            .to(-5, 0.5, easeOutSine)
            .back(0.5, easeInSine);
    })
    hide_mask(ooo_uop_entry_masks[0]);



    yield* waitUntil("goondoingthis");
    show_mask(ooo_uop_entry_masks[1]);
    ooo_uop_entry_masks[1].size([500, 800]);
    yield* ooo_uop_entries[1].x(ooo_uop_entries[1].x() + 100, 0.5);
    yield sequence(0.05,
        ...ooo_uop_entries.slice(2).map(t => t.y(t.y() + 55, 0.3)),
    )
    ooo_uop_entry_masks[1].position(ooo_uop_queue_fu_wires[1].getPointAtPercentage(0.5).position).size(140)
    ooo_uop_entries[1].x(-150).y(0).scale(2);
    yield* ooo_uop_entries[1].x(150, 0.8);
    let fu_two_loop = yield loopFor(Infinity, function* () {
        yield* functional_units[1].rotation(5, 0.5, easeOutSine)
            .back(0.5, easeInSine)
            .to(-5, 0.5, easeOutSine)
            .back(0.5, easeInSine);
    })
    hide_mask(ooo_uop_entry_masks[1]);
    
    show_mask(ooo_uop_entry_masks[2]);
    ooo_uop_entry_masks[2].size([500, 800]);
    yield* ooo_uop_entries[2].x(ooo_uop_entries[2].x() + 100, 0.5);
    yield sequence(0.05,
        ...ooo_uop_entries.slice(3).map(t => t.y(t.y() + 55, 0.3)),
    )
    ooo_uop_entry_masks[2].position(ooo_uop_queue_fu_wires[2].getPointAtPercentage(0.5).position).size(140)
    ooo_uop_entries[2].x(-150).y(0).scale(2);
    yield* ooo_uop_entries[2].x(150, 0.8);
    const fu_three_loop = yield loopFor(Infinity, function* () {
        yield* functional_units[2].rotation(5, 0.5, easeOutSine)
            .back(0.5, easeInSine)
            .to(-5, 0.5, easeOutSine)
            .back(0.5, easeInSine);
    })
    hide_mask(ooo_uop_entry_masks[2]);

    yield ooo_uop_entries[3].scale(4, 0.8).wait(6).back(0.8);

    yield* waitUntil("anotheruopallocated");
    yield* flash_computer_block(functional_units[0]);

    yield* waitUntil("fus_ready");
    cancel(fu_two_loop);   yield* all(functional_units[1].rotation(0, 0.5), finished_computer_block(functional_units[1]));
    cancel(fu_three_loop); yield* all(functional_units[2].rotation(0, 0.5), finished_computer_block(functional_units[2]));
    cancel(fu_one_loop);   yield* all(functional_units[0].rotation(0, 0.5), finished_computer_block(functional_units[0]));

    const ooo_fu_cdb_wires = createRefArray<Line>();
    const ooo_regfile_uop_queue_wire = createRef<Line>();
    const ooo_cdb = createRef<Line>();
    ooo_wires().add(<>
        {...range(6).map(i => <Line ref={ooo_fu_cdb_wires}
            points={[functional_units[i].right(), [550, functional_units[i].right().y],]}
            lineWidth={10} stroke={"#bf5dd6"}
            end={0}
            //endArrow arrowSize={15}
        >
        </Line>)}
        <Line ref={ooo_cdb}
            points={[[550, functional_units[0].right().y-5], [550, 375], [ooo_register_file.bottom().x, 375], ooo_register_file.bottom()]}
            lineWidth={10} stroke={"#bf5dd6"}
            end={0}
            endArrow arrowSize={15}
        >
        </Line>
        <Line ref={ooo_regfile_uop_queue_wire}
            points={[ooo_register_file.right(), [ooo_uop_queue.bottom().x, ooo_register_file.right().y]]}
            lineWidth={10} stroke={"#bf5dd6"}
            end={0}
            endArrow arrowSize={15}
        >
        </Line>
    </>);
    yield* all(ooo_dcache.size([155, 65], 0.5),
               ooo_dcache.y(functional_units[5].y(), 0.5),
               ooo_dcache.x(ooo_dcache.x()-80, 0.5),);
    yield* sequence(0.05,
        ...ooo_fu_cdb_wires.map(t => t.end(1, 0.5)),
        ooo_cdb().end(1, 0.5),
        ooo_regfile_uop_queue_wire().end(1, 0.5),
    );
    
    
    show_mask(ooo_uop_entry_masks[3]);
    ooo_uop_entry_masks[3].size([500, 800]);
    yield* ooo_uop_entries[3].x(ooo_uop_entries[3].x() + 100, 0.5);
    yield* sequence(0.05,
        ...ooo_uop_entries.slice(3).map(t => t.y(t.y() + 55, 0.3)),
    )
    ooo_uop_entry_masks[3].position(ooo_uop_queue_fu_wires[0].getPointAtPercentage(0.5).position).size(140)
    ooo_uop_entries[3].position([-150,0]).scale(2);
    yield* ooo_uop_entries[3].x(150, 0.8);
    fu_one_loop = yield loopFor(Infinity, function* () {
        yield* functional_units[0].rotation(5, 0.5, easeOutSine)
            .back(0.5, easeInSine)
            .to(-5, 0.5, easeOutSine)
            .back(0.5, easeInSine);
    })
    hide_mask(ooo_uop_entry_masks[3]);


    yield* waitUntil("implement_in_arch");
    cancel(fu_one_loop); yield* all(functional_units[0].rotation(0, 0.5), finished_computer_block(functional_units[0]));
    yield* ooo_internals().y(ooo_internals().y() - 15, 0.5);
    yield* ooo_internals().x(ooo_internals().x() + 25, 0.5);
    
    yield* waitUntil("uop_statuses");
    yield* sequence(0.05,
        ...queue_slot_statuses.map(t => t.size(20, 0.5)),
    );
    yield* waitUntil("FU_statuses");
    yield* sequence(0.05,
        ...functional_unit_statuses.map(t => t.size(25, 0.5)),
    );
    
    yield* waitUntil("Regfile_statuses");
    ooo_stuff().save();
    yield* all(
        ooo_stuff().scale(2, 1.2),
        ooo_stuff().position([800,0], 1.2),
    )
    yield* sequence(0.1,
        ...ooo_register_file.childAs<Layout>(1).childrenAs<Rect>().map(t => chain(
            t.childAs<Txt>(0).x(100, 0.5),
            all(
                t.childAs<Txt>(0).x(-100, 0),
                t.childAs<Txt>(0).y(-15, 0),
                t.childAs<Txt>(0).fontSize(30, 0),
            ),
            t.childAs<Txt>(0).x(-45, 0.5),
            t.childAs<Txt>(1).fontSize(30, 0),
            t.childAs<Txt>(1).y(10, 0),
            t.childAs<Txt>(1).text("<NONE>", 0.5),
        )),
    );
    yield* waitFor(0.5);
    yield* ooo_stuff().restore(1.2);
    yield* all(
        ooo_register_file.scale(0.9, 0.5),
        ooo_register_file.bottomRight(ooo_register_file.bottomRight(), 0.5),
    );

    yield* waitUntil("issueuopcomb");
    yield* ooo_uop_entries[4].scale(4, 0.8).wait(4).back(0.8);

    yield* waitUntil("issueuop?");
    ooo_register_file.childAs<Layout>(1).zIndex(15);
    yield* sequence(0.1,
        ...ooo_register_file.childAs<Layout>(1).childrenAs<Rect>().map(t => all(
            wave_computer_block(t, 1.2),
        )),
    )
    ooo_register_file.childAs<Layout>(1).zIndex(0);

    yield* waitFor(3);
    yield* all(
        functional_unit_statuses[0].scale(4, 1.2).back(1.2),
        wiggle(functional_unit_statuses[0].rotation, functional_unit_statuses[0].rotation() + 10, functional_unit_statuses[0].rotation() - 10, 1.2 * 2),
        functional_unit_statuses[0].fill("yellow", 1.2).back(1.2),
    );

    yield* waitUntil("senduopthrough");

    show_mask(ooo_uop_entry_masks[4]);
    ooo_uop_entry_masks[4].size([500, 800]);
    yield* all(
        queue_slot_statuses[10].fill("#c55656", 0.5),
        ooo_uop_entries[4].x(ooo_uop_entries[4].x() + 100, 0.5)
    );
    yield* sequence(0.05,
        ...ooo_uop_entries.slice(3).map(t => t.y(t.y() + 55, 0.3)),
    )
    ooo_uop_entry_masks[4].position(ooo_uop_queue_fu_wires[0].getPointAtPercentage(0.5).position).size(140)
    ooo_uop_entries[4].position([-150,0]).scale(2);
    yield* ooo_uop_entries[4].x(150, 0.8);
    yield functional_unit_statuses[0].fill(STATUS_GREEN, 0.5);
    fu_one_loop = yield loopFor(Infinity, function* () {
        yield* functional_units[0].rotation(5, 0.5, easeOutSine)
            .back(0.5, easeInSine)
            .to(-5, 0.5, easeOutSine)
            .back(0.5, easeInSine);
    })
    hide_mask(ooo_uop_entry_masks[4]);

    yield* waitUntil("exampletime");
    cancel(fu_one_loop);
    yield* all(
        functional_units[0].rotation(0, 0.5),
        finished_computer_block(functional_units[0]),
        functional_unit_statuses[0].fill("#c55656", 0.5)
    );

    const ooo_regfile_additional_regs = ooo_register_file.childAs<Layout>(1).clone();
    ooo_register_file.childAs<Rect>(2).zIndex(-1);
    ooo_register_file.add(ooo_regfile_additional_regs);
    yield* all(
        ooo_cdb().points([[550+150, functional_units[0].right().y-5], [550+150, 375], [ooo_register_file.bottom().x, 375], ooo_register_file.bottom()], 0.5),
        ...functional_units.map(t => t.x(t.x() + 150, 0.5)),
        ...ooo_fu_cdb_wires.map((t, i) => t.points([functional_units[i].right().addX(150), [550+150, functional_units[i].right().y]], 0.5)),
        ooo_dcache.x(ooo_dcache.x() + 150, 0.5),
        all(
            ooo_uop_queue.bottom(ooo_uop_queue.bottom(), 0.5),
            ooo_uop_queue.size([650, 130+150], 0.5),
            ooo_uop_queue.childAs<Txt>(0).y(115, 0.5)
        ),
        ...ooo_uop_queue_fu_wires.map((t, i) => t.points([[-147+150, functional_units[i].left().y], functional_units[i].left().addX(150)], 0.5)),
        ...queue_slots.map(t => t.size([55, 200], 0.5)),
        ...queue_slot_statuses.map(t => t.position([-28, 100], 0.5)),
        queue_slot_parent().y(-20, 0.5),
        ooo_regfile_additional_regs.x(ooo_register_file.childAs<Rect>(2).x(), 0.5),
        
    );
    yield* sequence(0.1,
        ...ooo_regfile_additional_regs.childrenAs<Rect>().map((t, i) => t.childAs<Txt>(0).text("R" + (4 + i), 0.5))
    );
    
    const example_instruction_parent = createRef<Node>();
    const example_instruction_masks = createRefArray<Rect>();
    const example_instructions = createRefArray<Rect>();
    const example_instruction_labels = createRefArray<Txt>();

    const example_instruction_strs = [
        ["mov",  "r0", "[r1]"],
        ["add",  "r2", "r3", "r4" ],
        ["sub",  "r5", "r2", "r6" ],
        ["imul", "r1", "r1", "r7" ],
        ["add",  "r1", "r3", "r5" ],
        ["mov",  "r3", "r7"],
    ];
    const example_instruction_fills = [ 5, 1, 2, 0, 1, 5, ];
    const fu_lighter_fills = [ "#3d2837", "#3d3037", "#3d3037", "#3d3937", "#333a37", "#2b3a42", "#2b2d49" ];
    
    const ooo_register_rects = [
        ...ooo_register_file.childAs<Layout>(1).childrenAs<Rect>(),
        ...ooo_register_file.childAs<Layout>(4).childrenAs<Rect>(),
    ]
    const ooo_register_statuses = [
        ...ooo_register_file.childAs<Layout>(1).childrenAs<Rect>().map(t => t.childAs<Txt>(1)),
        ...ooo_register_file.childAs<Layout>(4).childrenAs<Rect>().map(t => t.childAs<Txt>(1)),
    ]

    const update_reg_status = function* (i: number, txt: string, scale: boolean = true) {
        const old_reg_fill = ooo_register_rects[i].fill();
        const old_reg_stroke = ooo_register_rects[i].stroke();
        const old_reg_text_fill = ooo_register_rects[i].childAs<Txt>(0).fill();
        const size = txt == "<NONE>" ? 30 : 42;
        const new_scale = scale ? 2 : 1;
        yield* chain(
            all(
                ooo_register_rects[i].zIndex(10, 0),
                ooo_register_file.childAs<Layout>(i <= 3 ? 1 : 4).zIndex(20, 0),
            ),
            all(
                ooo_register_rects[i].scale(new_scale, 0.5),
                ooo_register_rects[i].fill("#5c6b32", 0.5),
                ooo_register_rects[i].stroke("yellow", 0.5),
                ooo_register_rects[i].childAs<Txt>(0).fill("yellow", 0.5),
            ),
            chain(
                ooo_register_statuses[i].text(txt, 0.8),
                ooo_register_statuses[i].fontSize(size, 0.8),
            ),
            all(
                ooo_register_rects[i].fill(old_reg_fill, 0.5),
                ooo_register_rects[i].stroke(old_reg_stroke, 0.5),
                ooo_register_rects[i].childAs<Txt>(0).fill(old_reg_text_fill, 0.5),
                ooo_register_rects[i].scale(1, 0.5),
            ),
            all(
                ooo_register_rects[i].zIndex(0, 0),
                ooo_register_file.childAs<Layout>(i <= 3 ? 1 : 4).zIndex(0, 0),
            )
        );
    }

    const update_fu_status = function* (i: number, stat: PossibleColor, scale: boolean = true) {
        const new_scale = scale ? 3 : 1;
        yield* chain(
            functional_unit_statuses[i].scale(new_scale, 0.5),
            functional_unit_statuses[i].fill(stat, 0.5),
            functional_unit_statuses[i].scale(1, 0.5),
        )
    }

    ooo_internals().add(<>
        <Node ref={example_instruction_parent} zIndex={10}>
            {...example_instruction_strs.map((a, i) => <Rect ref={example_instruction_masks}
                // stroke={"red"} lineWidth={10}
                position={[-350,0]}
                size={[700, 800]}
                zIndex={5-i}
                clip
            >
                <Rect ref={example_instructions}
                    position={[-560+350, -275]}
                    opacity={0} size={[175, 50]}
                    radius={5} lineWidth={5}
                    // stroke={"red"} lineWidth={10}
                    alignItems={"end"}
                    justifyContent={"center"}
                    layout gap={5}
                >
                    {...a.map(s => <RoboticText ref={example_instruction_labels}
                        text={s} fontStyle={""}
                        fontSize={36}
                        fill={fu_strokes[example_instruction_fills[i]]}
                    >
                    </RoboticText>)}
                </Rect>
            </Rect>)}
        </Node>
    </>);
    yield* sequence(0.1,
        ...example_instructions.map((t, i) => sequence(0.2,
            t.opacity(1, 0.3),
            t.x(-120 + 350, 0.5),
            t.y(276 - i * 55, 0.5),
        ))
    );

    yield* waitUntil("init_statuses");
    yield* sequence(0.1,
        ...queue_slot_statuses.slice(5).map(t => all(
            t.scale(2, 0.5).wait(0.5).back(0.5),
            t.fill(STATUS_GREEN, 1.0)
        )),
    );

    yield* waitUntil("first_uop");
    example_instruction_masks[0].save();
    example_instruction_masks[0].size([850, 800])
    yield* all(
        example_instructions[0].fill(fu_lighter_fills[example_instruction_fills[0]], 0.5),
        example_instructions[0].stroke(fu_strokes[example_instruction_fills[0]], 0.5),
        example_instructions[0].scale(2, 0.5),
    )
    
    yield* waitUntil("tick0_statuscheck");
    ooo_register_file.childAs<Layout>(1).zIndex(2);
    ooo_register_file.childAs<Layout>(1).childAs<Rect>(0).zIndex(2);
    yield* sequence(2.5,
        sequence(0.5,
            all(
                example_instructions[0].childAs<Txt>(1).scale(2, 1).wait(0.5).back(1),
                wiggle(example_instructions[0].childAs<Txt>(1).rotation, -10, 10, 2),
                example_instructions[0].childAs<Txt>(1).fill("yellow", 1).wait(0.5).back(1),
            ),
            wave_computer_block(ooo_register_file.childAs<Layout>(1).childAs<Rect>(0), 1.2),
        ),
        wave_computer_block(functional_units[5], 0.8),
    )
    ooo_register_file.childAs<Layout>(1).childAs<Rect>(0).zIndex(0);
    ooo_register_file.childAs<Layout>(1).zIndex(0);
    example_instructions[0].childAs<Txt>(1).zIndex(0);
    
    yield* waitUntil("tick0_issueandmark");
    yield* chain(
        sequence(0.2,
            example_instructions[0].scale(1, 0.6),
            example_instruction_masks[0].restore(0.3),
            example_instructions[0].x(example_instructions[0].x() + 250, 0.5),
        )
    );
    example_instruction_masks[0].position(ooo_uop_queue_fu_wires[5].getPointAtPercentage(0.5).position).size(142)
    example_instructions[0].x(-250).y(0);
    yield* example_instructions[0].x(250, 1.2);
    let fu_six_loop = yield loopFor(Infinity, function* () {
        yield* functional_units[5].rotation(4, 0.5, easeOutSine)
            .back(0.5, easeInSine)
            .to(-4, 0.5, easeOutSine)
            .back(0.5, easeInSine);
    })

    yield* waitUntil("tick0_statusupdate");
    ooo_register_statuses[0].save();
    
    yield* update_reg_status(0, "FU 5");
    yield* waitFor(1);
    yield* update_fu_status(5, STATUS_GREEN);
    yield* waitFor(1);
    yield* sequence(0.1,
        ...example_instructions.slice(1).map(t => t.y(t.y() + 55, 0.3)),
        queue_slot_statuses[5].fill(STATUS_RED, 0.5),
    );
    
    yield* waitUntil("second_uop");
    example_instruction_masks[1].save();
    example_instruction_masks[1].size([850, 800])
    yield* all(
        example_instructions[1].fill(fu_lighter_fills[example_instruction_fills[1]], 0.5),
        example_instructions[1].stroke(fu_strokes[example_instruction_fills[1]], 0.5),
        example_instructions[1].scale(2, 0.5),
    )
    
    yield* waitUntil("tick1_statuscheck");
    ooo_register_file.childAs<Layout>(1).zIndex(2);
    ooo_register_file.childAs<Layout>(1).childAs<Rect>(0).zIndex(2);
    yield* sequence(3,
        sequence(0.5,
            all(
                example_instructions[1].childAs<Txt>(2).scale(2, 1).wait(0.5).back(1),
                wiggle(example_instructions[1].childAs<Txt>(2).rotation, -10, 10, 2),
                example_instructions[1].childAs<Txt>(2).fill("yellow", 1).wait(0.5).back(1),
            ),
            all(
                example_instructions[1].childAs<Txt>(3).scale(2, 1).wait(0.5).back(1),
                wiggle(example_instructions[1].childAs<Txt>(3).rotation, -10, 10, 2),
                example_instructions[1].childAs<Txt>(3).fill("yellow", 1).wait(0.5).back(1),
            ),
        ),
        wave_computer_block(functional_units[1], 0.8),
    )
    ooo_register_file.childAs<Layout>(1).childAs<Rect>(0).zIndex(0);
    ooo_register_file.childAs<Layout>(1).zIndex(0);
    example_instructions[1].childAs<Txt>(1).zIndex(0);

    yield* waitUntil("tick1_issueandmark");
    yield* chain(
        sequence(0.2,
            example_instructions[1].scale(1, 0.6),
            example_instruction_masks[1].restore(0.3),
            example_instructions[1].x(example_instructions[1].x() + 250, 0.5),
        )
    );
    example_instruction_masks[1].position(ooo_uop_queue_fu_wires[1].getPointAtPercentage(0.5).position).size(142)
    example_instructions[1].x(-250).y(0);
    yield* example_instructions[1].x(250, 1.2);
    fu_two_loop = yield loopFor(Infinity, function* () {
        yield* functional_units[1].rotation(4, 0.5, easeOutSine)
            .back(0.5, easeInSine)
            .to(-4, 0.5, easeOutSine)
            .back(0.5, easeInSine);
    });
    
    ooo_register_statuses[2].save();
    yield* all(
        update_reg_status(2, "FU 1"),
        update_fu_status(1, STATUS_GREEN)
    );

    yield* waitFor(1);
    yield* sequence(0.1,
        ...example_instructions.slice(2).map(t => t.y(t.y() + 55, 0.3)),
        queue_slot_statuses[6].fill(STATUS_RED, 0.5),
    );

    
    yield* waitUntil("third_uop");
    cancel(fu_six_loop); yield* all(functional_units[5].rotation(0, 0.5), finished_computer_block(functional_units[5], 0.8, 1), update_fu_status(5, STATUS_RED, false), update_reg_status(0, "<NONE>", false),);
    example_instruction_masks[2].save();
    example_instruction_masks[2].size([850, 800])
    yield* all(
        example_instructions[2].fill(fu_lighter_fills[example_instruction_fills[2]], 0.5),
        example_instructions[2].stroke(fu_strokes[example_instruction_fills[2]], 0.5),
        example_instructions[2].scale(2, 0.5),
    );

    yield* waitUntil("tick2_statuscheck");
    ooo_register_file.childAs<Layout>(1).zIndex(2);
    ooo_register_file.childAs<Layout>(1).childAs<Rect>(0).zIndex(2);
    yield* sequence(3,
        sequence(0.5,
            all(
                example_instructions[2].childAs<Txt>(2).scale(2, 1).wait(0.5).back(1),
                wiggle(example_instructions[2].childAs<Txt>(2).rotation, -10, 10, 2),
                example_instructions[2].childAs<Txt>(2).fill("yellow", 1).wait(0.5).back(1),
            ),
            wave_computer_block(ooo_register_file.childAs<Layout>(1).childAs<Rect>(2), 1.2),
        ),
    )
    ooo_register_file.childAs<Layout>(1).zIndex(0);
    ooo_register_file.childAs<Layout>(1).childAs<Rect>(0).zIndex(0);
    example_instructions[2].childAs<Txt>(1).zIndex(0);
    
    yield* waitUntil("tick2_finishedblocks");
    cancel(fu_two_loop);   yield* all(functional_units[1].rotation(0, 0.5), finished_computer_block(functional_units[1], 0.8, 1.5), update_fu_status(1, STATUS_RED));
    yield* waitFor(2);
    yield* update_reg_status(2, "<NONE>");

    yield* waitUntil("tick2_issueandmark");
    yield* chain(
        sequence(0.2,
            example_instructions[2].scale(1, 0.6),
            example_instruction_masks[2].restore(0.3),
            example_instructions[2].x(example_instructions[2].x() + 250, 0.5),
        )
    );
    example_instruction_masks[2].position(ooo_uop_queue_fu_wires[1].getPointAtPercentage(0.5).position).size(142)
    example_instructions[2].x(-250).y(0);
    yield* example_instructions[2].x(250, 1.2);
    fu_two_loop = yield loopFor(Infinity, function* () {
        yield* functional_units[1].rotation(4, 0.5, easeOutSine)
            .back(0.5, easeInSine)
            .to(-4, 0.5, easeOutSine)
            .back(0.5, easeInSine);
    });
    
    ooo_register_statuses[2].save();
    yield* all(
        update_reg_status(5, "FU 1"),
        update_fu_status(1, STATUS_GREEN),
        sequence(0.1,
            ...example_instructions.slice(3).map(t => t.y(t.y() + 55, 0.3)),
            queue_slot_statuses[7].fill(STATUS_RED, 0.5),
        )
    );

    yield* waitUntil("tick3");
    example_instruction_masks[3].save();
    example_instruction_masks[3].size([850, 800])
    yield* all(
        example_instructions[3].fill(fu_lighter_fills[example_instruction_fills[3]], 0.5),
        example_instructions[3].stroke(fu_strokes[example_instruction_fills[3]], 0.5),
        example_instructions[3].scale(2, 0.5),
    );
    yield* waitFor(1);
    yield* chain(
        sequence(0.2,
            example_instructions[3].scale(1, 0.6),
            example_instruction_masks[3].restore(0.3),
            example_instructions[3].x(example_instructions[3].x() + 250, 0.5),
        )
    );
    example_instruction_masks[3].position(ooo_uop_queue_fu_wires[0].getPointAtPercentage(0.5).position).size(142)
    example_instructions[3].x(-250).y(0);
    yield* example_instructions[3].x(250, 1.2);
    fu_one_loop = yield loopFor(Infinity, function* () {
        yield* functional_units[0].rotation(4, 0.5, easeOutSine)
            .back(0.5, easeInSine)
            .to(-4, 0.5, easeOutSine)
            .back(0.5, easeInSine);
    });
    yield all(
        update_reg_status(1, "FU 0", false),
        update_fu_status(0, STATUS_GREEN),
        sequence(0.1,
            ...example_instructions.slice(4).map(t => t.y(t.y() + 55, 0.3)),
            queue_slot_statuses[8].fill(STATUS_RED, 0.5),
        )
    )
    
    cancel(fu_two_loop);
    yield* all(functional_units[1].rotation(0, 0.5), finished_computer_block(functional_units[1], 0.8, 1), update_fu_status(1, STATUS_RED, false), update_reg_status(5, "<NONE>", false));

    yield* waitUntil("tick4");
    example_instruction_masks[4].save();
    example_instruction_masks[4].size([850, 800])
    yield* all(
        example_instructions[4].fill(fu_lighter_fills[example_instruction_fills[4]], 0.5),
        example_instructions[4].stroke(fu_strokes[example_instruction_fills[4]], 0.5),
        example_instructions[4].scale(2, 0.5),
    );

    yield* waitUntil("tick4_r1done");
    cancel(fu_one_loop);   yield all(functional_units[0].rotation(0, 0.5), finished_computer_block(functional_units[0], 0.8, 1.5), update_fu_status(0, STATUS_RED, false));
    yield* update_reg_status(1, "<NONE>");

    yield* chain(
        sequence(0.1,
            example_instructions[4].scale(1, 0.6),
            example_instruction_masks[4].restore(0.3),
            example_instructions[4].x(example_instructions[4].x() + 250, 0.5),
        )
    );
    example_instruction_masks[4].position(ooo_uop_queue_fu_wires[1].getPointAtPercentage(0.5).position).size(142)
    example_instructions[4].x(-250).y(0);
    yield* example_instructions[4].x(250, 1.2);
    fu_two_loop = yield loopFor(Infinity, function* () {
        yield* functional_units[1].rotation(4, 0.5, easeOutSine)
            .back(0.5, easeInSine)
            .to(-4, 0.5, easeOutSine)
            .back(0.5, easeInSine);
    });
    yield all(
        update_reg_status(1, "FU 1", false),
        update_fu_status(1, STATUS_GREEN),
        sequence(0.1,
            ...example_instructions.slice(5).map(t => t.y(t.y() + 55, 0.3)),
            queue_slot_statuses[9].fill(STATUS_RED, 0.5),
        )
    );

    yield* waitUntil("tick5");
    example_instruction_masks[5].save();
    example_instruction_masks[5].size([850, 800])
    yield* all(
        example_instructions[5].fill(fu_lighter_fills[example_instruction_fills[5]], 0.5),
        example_instructions[5].stroke(fu_strokes[example_instruction_fills[5]], 0.5),
        example_instructions[5].scale(2, 0.5),
    );

    yield* chain(
        sequence(0.1,
            example_instructions[5].scale(1, 0.6),
            example_instruction_masks[5].restore(0.3),
            example_instructions[5].x(example_instructions[5].x() + 250, 0.5),
        )
    );
    example_instruction_masks[5].position(ooo_uop_queue_fu_wires[5].getPointAtPercentage(0.5).position).size(142)
    example_instructions[5].x(-250).y(0);
    yield* example_instructions[5].x(250, 1.2);
    fu_six_loop = yield loopFor(Infinity, function* () {
        yield* functional_units[5].rotation(4, 0.5, easeOutSine)
            .back(0.5, easeInSine)
            .to(-4, 0.5, easeOutSine)
            .back(0.5, easeInSine);
    });
    yield all(
        update_reg_status(3, "FU 5", false),
        update_fu_status(5, STATUS_GREEN),
        queue_slot_statuses[10].fill(STATUS_RED, 0.5),
    );
    
    yield* waitUntil("completeone");
    cancel(fu_two_loop);   yield* all(functional_units[1].rotation(0, 0.5), finished_computer_block(functional_units[1], 0.8, 1.5), update_fu_status(1, STATUS_RED, false), update_reg_status(1, "<NONE>", false));

    yield* waitUntil("completetwo");
    cancel(fu_six_loop);   yield* all(functional_units[5].rotation(0, 0.5), finished_computer_block(functional_units[5], 0.8, 1.5), update_fu_status(5, STATUS_RED, false), update_reg_status(3, "<NONE>", false));

    yield* waitUntil("whathavewedone");
    yield* ooo_stuff().x(2000, 1.2);

    yield* waitUntil("inorderissue");
    const issuing_ops_parent = createRef<Node>();
    const issuing_ops = createRef<Layout>();
    const issuing_op_txts = createRefArray<Txt>();
    const issuing_op_time = createRef<Layout>();
    const issuing_op_backing = createRefArray<Rect>();
    const issuing_op_circles = createRefArray<Circle>();
    const issuing_op_timelines = createRefArray<Line>();
    view.add(<Node ref={issuing_ops_parent} scale={1.4}>
        <Layout ref={issuing_ops}
            position={[-500, 0]}
            // layout direction={"column-reverse"}
        >
            {range(5).map(i => <RoboticText ref={issuing_op_txts}
                // text={"µop " + i}
                y={192 - 96 * i}
                fontSize={80}
                fill={fu_strokes[i+2]}
            />)}
        </Layout>
    </Node>);
    yield* sequence(0.1,
        ...issuing_op_txts.map((t, i) => t.text("µop " + i, 0.5)),
    )
    const timeline_starts = [0, 100, 200, 400, 500];
    const timeline_widths = [700, 300, 200, 400, 200];
    const timeline_wiper = createRef<Line>();
    issuing_ops_parent().add(<>
        <Layout ref={issuing_op_time}
            zIndex={-1}
        >
            {range(5).map(i => <Rect ref={issuing_op_backing}
                position={[0, issuing_op_txts[i].position().y]}
                // size={[1300, 80]}
                radius={20}
                fill={fu_lighter_fills[i+2] + "88"}
            />)}
            {range(5).map(i => <Circle ref={issuing_op_circles}
                position={[-200 + timeline_starts[i], issuing_op_txts[i].position().y]}
                // size={80}
                lineWidth={10} lineCap={"round"}
                stroke={fu_strokes[i+2]} opacity={0}
            />)}
            {range(5).map(i => <Line ref={issuing_op_timelines}
                points={[[-200 + timeline_starts[i], 0], [-200 + timeline_starts[i] + timeline_widths[i], 0]]}
                position={[0, issuing_op_txts[i].position().y]}
                lineWidth={30} lineCap={"round"} lineDash={[70, 30]}
                stroke={fu_strokes[i+2]} end={0} opacity={0}
            />)}
        </Layout>
        <Line ref={timeline_wiper}
            position={[-200 + timeline_starts[0], 0]}
            points={[[0, -300], [0, 300]]} end={0} opacity={0}
            lineWidth={10} lineCap={"round"}
            stroke={cosmic_grad_ramps[1][4] + "77"}
        >
        </Line>
    </>);
    yield all(timeline_wiper().opacity(1, 0.1), timeline_wiper().end(1, 0.5));
    yield* sequence(0.1,
        ...issuing_op_backing.map(t => t.size([1300, 80], 0.8)),
    );

    yield timeline_wiper().x(timeline_wiper().x() + 800, 0.5 * 8, linear)
    yield* sequence(0.5,
        all(
            issuing_op_circles[0].opacity(1, 0.05),
            issuing_op_circles[0].size(80, 0.3),
            issuing_op_timelines[0].opacity(1, 0.1, linear),
            issuing_op_timelines[0].end(1, 7 * 0.5, linear),
        ),
        all(
            issuing_op_circles[1].opacity(1, 0.05),
            issuing_op_circles[1].size(80, 0.3),
            issuing_op_timelines[1].opacity(1, 0.1, linear),
            issuing_op_timelines[1].end(1, 3 * 0.5, linear),
        ),
        all(
            issuing_op_circles[2].opacity(1, 0.05),
            issuing_op_circles[2].size(80, 0.3),
            issuing_op_timelines[2].opacity(1, 0.1, linear),
            issuing_op_timelines[2].end(1, 2 * 0.5, linear),
        ),
        noop(),
        all(
            issuing_op_circles[3].opacity(1, 0.05),
            issuing_op_circles[3].size(80, 0.3),
            issuing_op_timelines[3].opacity(1, 0.1, linear),
            issuing_op_timelines[3].end(1, 4 * 0.5, linear),
        ),
        all(
            issuing_op_circles[4].opacity(1, 0.05),
            issuing_op_circles[4].size(80, 0.3),
            issuing_op_timelines[4].opacity(1, 0.1, linear),
            issuing_op_timelines[4].end(1, 2 * 0.5, linear),
        ),
    );
    yield all(timeline_wiper().opacity(1, 0).wait(0.4).to(0, 0.1), timeline_wiper().start(1, 0.5));

    yield* waitUntil("stillnotoptimal");
    yield* sequence(0.1,
        ...range(5).map(i => all(
            issuing_op_backing[i].x(2000, 1.2),
            issuing_op_circles[i].x(2000, 1.2),
            issuing_op_timelines[i].x(2000, 1.2),
            issuing_op_txts[i].x(2000, 1.2),
        )),
    );

    yield* waitUntil("whereouralgstalls");
    const example_instructions_again_parent = createRef<Node>();
    const example_instructions_again = createRefArray<Rect>();
    const example_instructions_again_labels = createRefArray<Txt>();
    const example_instruction_stalls = createRefArray<Rect>();
    const example_instruction_stall_locations = createRefArray<Icon>();
    const example_instruction_stall_locations_ys = [ 2, 4, 5 ];
    view.add(<>
        <Node ref={example_instructions_again_parent} zIndex={10}>
            {...example_instruction_strs.map((a, i) => <Rect ref={example_instructions_again}
                position={[0, -200 + i * 100 + 40]}
                opacity={0} size={[175, 50]}
                radius={5} lineWidth={5}
                // stroke={"red"} lineWidth={10}
                alignItems={"end"}
                justifyContent={"center"}
                layout gap={30}
            >
                {...a.map(s => <RoboticText ref={example_instructions_again_labels}
                    text={s} fontStyle={""}
                    fontSize={80}
                    fill={fu_strokes[example_instruction_fills[i]]}
                >
                </RoboticText>)}
            </Rect>)}
            {...example_instruction_stall_locations_ys.map((t, i) => <Rect ref={example_instruction_stalls}
                y={-200 + t * 100 - 30}
                fill={"#c5565622"}
                size={[0, 90]}
                radius={20}
            >
                <Icon ref={example_instruction_stall_locations}
                    icon={"solar:danger-triangle-bold"}
                    x={-300} 
                    rotation={90} scale={0}
                    color={"#c55656"}
                    size={100}
                >
                </Icon>
            </Rect>)}
        </Node>
    </>);
    yield* sequence(0.1,
        ...example_instructions_again.map((t, i) => all(
            t.opacity(1, 0.5),
            t.y(t.y() - 40, 0.5),
        ))
    );
    yield* waitFor(1);
    yield* sequence(0.1,
        ...example_instruction_stall_locations.map((l, i) => all(
            example_instruction_stalls[i].size([500, 90], 0.5),
            l.rotation(0, 0.5),
            l.scale(1, 0.5),
        ))
    );

    yield* waitUntil("highlight_deps_highlevel");
    yield* sequence(0.5,
        all(
            example_instructions_again_labels[4].fill("red", 0.5),
            example_instructions_again_labels[9].fill("red", 0.5),
            example_instructions_again_labels[4].scale(1.5, 0.5),
            example_instructions_again_labels[9].scale(1.5, 0.5),
        ),
        all(
            example_instructions_again_labels[12].fill("yellow", 0.5),
            example_instructions_again_labels[13].fill("yellow", 0.5),
            example_instructions_again_labels[16].fill("yellow", 0.5),
            example_instructions_again_labels[12].scale(1.5, 0.5),
            example_instructions_again_labels[13].scale(1.5, 0.5),
            example_instructions_again_labels[16].scale(1.5, 0.5),
        ),
        all(
            example_instructions_again_labels[17].fill("red", 0.5),
            example_instructions_again_labels[20].fill("red", 0.5),
            example_instructions_again_labels[17].scale(1.5, 0.5),
            example_instructions_again_labels[20].scale(1.5, 0.5),
        ),
    );

    yield* waitUntil("removethesestalls");
    yield* sequence(0.1,
        ...example_instruction_stall_locations.map(t => all(
            t.scale(1.6, 0.4).wait(0.4).back(0.4),
            wiggle(t.rotation, -10, 10, 1.2),
        )),
    )

    yield* waitUntil("WAWdependencies");
    yield* all(
        ...example_instructions_again.map(t => t.x(-500, 0.8)),
        ...example_instruction_stalls.map(t => t.x(-500, 0.8)),
    )
    yield* sequence(0.4,
        all(
            all(
                ...example_instructions_again.slice(0, 3).map(t => all(
                    t.y(t.y() - 300, 0.8),
                    t.opacity(0.2, 0.8),
                )),
                ...example_instruction_stalls.slice(0, 1).map(t => all(
                    t.y(t.y() - 300, 0.8),
                    t.opacity(0.2, 0.8),
                ))
            ),
            all(
                ...example_instructions_again.slice(5).map(t => all(
                    t.y(t.y() + 100, 0.8),
                    t.opacity(0.2, 0.8),
                )),
                ...example_instruction_stalls.slice(2).map(t => all(
                    t.y(t.y() + 100, 0.8),
                    t.opacity(0.2, 0.8),
                ))
            ),
        ),
        
        all(
            ...example_instructions_again.slice(3, 5).map(t => sequence(0.1,
                t.y(t.y() - 100, 0.5),
                t.scale(1.1, 0.5),
            )),
            ...example_instruction_stalls.slice(1, 2).map(t => sequence(0.1,
                t.y(t.y() - 100, 0.5),
                t.scale(1.1, 0.5),
            ))
        ),
    );

    const dep_title = createRef<Txt>();
    const dep_subtitle_0 = createRef<Txt>();
    const dep_subtitle_1 = createRef<Txt>();
    view.add(<>
        <RoboticText ref={dep_title}
            text={"WAW"}
            position={[1500, -300,]}
            fontSize={300}
            fill={cosmic_grad_ramps[1][0] + "88"}
        />
        <ThinRoboticText ref={dep_subtitle_0}
            text={"R1 <- add output"}
            position={[1500, -25,]}
            fontSize={100}
            fill={cosmic_grad_ramps[1][1] + "CC"}
        />
        <ThinRoboticText ref={dep_subtitle_1}
            text={"R1 </- imul output"}
            position={[1500, 75,]}
            fontSize={100}
            fill={cosmic_grad_ramps[1][1] + "CC"}
        />
    </>);

    yield* dep_title().x(300, 1.2);
    yield* waitFor(6);
    yield* dep_subtitle_0().x(300, 1.2);
    yield* waitFor(1);
    yield* dep_subtitle_1().x(300, 1.2);

    yield* waitUntil("naivenostall");
    yield* sequence(0.1,
        dep_subtitle_0().text("", 0.5),
        dep_subtitle_1().text("", 0.5),
    );
    // yield* 
    
    issuing_op_backing.splice(0);
    issuing_op_circles.splice(0);
    issuing_op_timelines.splice(0);
    view.add(<>
        <Layout ref={issuing_op_time}
            x={25}
            zIndex={-1}
        >
            {range(2).map(i => <Rect ref={issuing_op_backing}
                position={[300, example_instructions_again[i+3].position().y - 30]}
                // size={[500, 80]}
                radius={20}
                fill={fu_lighter_fills[i] + "88"}
            />)}
            {range(2).map(i => <Circle ref={issuing_op_circles}
                position={[-200 - 75 + timeline_starts[i+3], example_instructions_again[i+3].position().y - 30]}
                lineWidth={10} lineCap={"round"}
                stroke={fu_strokes[i]} opacity={0}
            />)}
            {range(2).map(i => <Line ref={issuing_op_timelines}
                points={[[-200 + timeline_starts[i+3], 0], [-200 + timeline_starts[i+3] + timeline_widths[i+3], 0]]}
                position={[0 - 75, example_instructions_again[i+3].position().y - 30]}
                lineWidth={30} lineCap={"round"} lineDash={[70, 30]}
                stroke={fu_strokes[i]} end={0} opacity={0}
            />)}
        </Layout>
    </>)
    yield* sequence(0.1,
        ...issuing_op_backing.map(t => t.size([500, 80], 0.5)),
    )
    yield* sequence(0.5,
        all(
            issuing_op_circles[0].opacity(1, 0.05),
            issuing_op_circles[0].size(80, 0.5),
            issuing_op_timelines[0].opacity(1, 0.1, linear),
            issuing_op_timelines[0].end(0.5, 2 * 0.5, linear),
        ),
        all(
            issuing_op_circles[1].opacity(1, 0.05),
            issuing_op_circles[1].size(80, 0.5),
            issuing_op_timelines[1].opacity(1, 0.1, linear),
            issuing_op_timelines[1].end(0.5, 1 * 0.5, linear),
        ),
    );
    yield* waitFor(2);
    yield* all(
        all(
            issuing_op_timelines[0].opacity(1, 0.1, linear),
            issuing_op_timelines[0].end(1, 2 * 0.5, linear),
        ),
        all(
            issuing_op_timelines[1].opacity(1, 0.1, linear),
            issuing_op_timelines[1].end(1, 1 * 0.5, linear),
        ),
    );

    yield* waitUntil("WARdependencies");
    yield* all(
        dep_title().x(1500, 1.2).back(1.2),
        dep_title().text(dep_title().text(), 0).wait(1.2).to("WAR", 0),
        issuing_op_time().x(1500, 1.2),
        sequence(0.4,
            all(
                all(
                    ...example_instructions_again.slice(0, 3).map(t => all(
                        t.y(t.y() - 200, 0.8),
                        t.opacity(0.2, 0.8),
                    )),
                    ...example_instruction_stalls.slice(0, 1).map(t => all(
                        t.y(t.y() - 200, 0.8),
                        t.opacity(0.2, 0.8),
                    ))
                ),
                all(
                    ...example_instructions_again.slice(3, 4).map(t => all(
                        t.y(t.y() - 400, 0.8),
                        t.opacity(0.2, 0.8),
                        t.scale(1, 0.8),
                    )),
                    ...example_instruction_stalls.slice(1, 1).map(t => all(
                        t.y(t.y() - 400, 0.8),
                        t.opacity(0.2, 0.8),
                        t.scale(1, 0.8),
                    ))
                ),
            ),
            
            all(
                ...example_instructions_again.slice(4,5).map(t => sequence(0.1,
                    t.y(t.y() - 150, 0.5),
                    t.scale(1.1, 0.5),
                    t.opacity(1, 0.8),
                )),
                ...example_instruction_stalls.slice(1,2).map(t => sequence(0.1,
                    t.y(t.y() - 150, 0.5),
                    t.scale(1.1, 0.5),
                    t.opacity(1, 0.8),
                )),
                ...example_instructions_again.slice(5).map(t => sequence(0.1,
                    t.y(t.y() - 350, 0.5),
                    t.scale(1.1, 0.5),
                    t.opacity(1, 0.8),
                )),
                ...example_instruction_stalls.slice(2).map(t => sequence(0.1,
                    t.y(t.y() - 350, 0.5),
                    t.scale(1.1, 0.5),
                    t.opacity(1, 0.8),
                ))
            ),
        )
    );
    dep_subtitle_0().remove();
    dep_subtitle_0().dispose();
    view.add(
        <ThinRoboticText ref={dep_subtitle_0}
            text={"Note: This doesn't actually\nalways cause a stall\nfor our example system"}
            position={[1700, 25,]}
            fontSize={80}
            fill={"#c55656CC"}
        />
    );
    yield* dep_subtitle_0().x(300, 1.2);

    yield* waitUntil("RAWdependencies");
    yield* all(
        dep_title().x(1500, 1.2).back(1.2),
        dep_title().text(dep_title().text(), 0).wait(1.2).to("RAW", 0),
        dep_subtitle_0().x(1500, 1.2),
        sequence(0.2,
            all(
                all(
                    ...example_instructions_again.slice(3, 4).map(t => all(
                        t.y(t.y() + 750, 0.8),
                        t.opacity(0.2, 0.8),
                        t.scale(1, 0.8),
                    )),
                    ...example_instructions_again.slice(4).map(t => all(
                        t.y(t.y() + 500, 0.8),
                        t.opacity(0.2, 0.8),
                        t.scale(1, 0.8),
                    )),
                    ...example_instruction_stalls.slice(1).map(t => all(
                        t.y(t.y() + 500, 0.8),
                        t.opacity(0.2, 0.8),
                        t.scale(1, 0.8),
                    ))
                ),
            ),
            
            all(
                all(
                    ...example_instructions_again.slice(0, 1).map(t => all(
                        t.y(t.y() + 400, 0.8),
                        t.opacity(0.2, 0.8),
                    )),
                ),
                all(
                    ...example_instructions_again.slice(1, 3).map(t => all(
                        t.y(t.y() + 600, 0.8),
                        t.opacity(1, 0.8),
                        t.scale(1.1, 0.8),
                    )),
                    ...example_instruction_stalls.slice(0, 1).map(t => all(
                        t.y(t.y() + 600, 0.8),
                        t.opacity(1, 0.8),
                        t.scale(1.1, 0.8),
                    ))
                ),
            ),
        )
    );

    yield* waitUntil("futuredependsonpresent");
    yield* sequence(2,
        wiggle(example_instructions_again[2].rotation, -10, 10, 1.2),
        wiggle(example_instructions_again[1].rotation, -10, 10, 1.2),
    );

    yield* waitUntil("wecandoonething");
    yield* all(
        all(
            ...example_instructions_again.slice(0, 1).map(t => all(
                t.y(t.y() + 350, 0.8),
                t.opacity(0.2, 0.8),
            )),
            ...example_instructions_again.slice(1, 3).map(t => all(
                t.y(t.y() + 150, 0.8),
                t.opacity(0.2, 0.8),
                t.scale(1, 0.8),
            )),
            ...example_instruction_stalls.slice(0, 1).map(t => all(
                t.y(t.y() + 150, 0.8),
                t.opacity(0.2, 0.8),
                t.scale(1, 0.8),
            ))
        ),
        example_instructions_again_parent().y(800, 1.2),
        dep_title().x(1500, 1.2),
    );
    yield* ooo_stuff().x(0, 1.2);

    yield* waitUntil("reservation_station");
    yield* all(
        ooo_internals().scale(0.95, 0.8),
        ...ooo_register_file.childAs<Layout>(1).childrenAs<Rect>().map(t => chain(
            all(
                t.childAs<Txt>(1).text("", 0.5),
                t.childAs<Txt>(0).x(-100, 0.5),
            ),
            all(
                t.childAs<Txt>(0).x(100, 0),
                t.childAs<Txt>(0).y(4, 0),
                t.childAs<Txt>(0).fontSize(48, 0),
            ),
            t.childAs<Txt>(0).x(0, 0.5),
        )),
        ...ooo_register_file.childAs<Layout>(4).childrenAs<Rect>().map(t => all(
            t.rotation(90, 0.5),
            t.scale(0, 0.5),
        )),
        ...functional_unit_statuses.map(t => all(
            t.scale(0, 0.5),
            t.rotation(t.rotation() + 90, 0.5)
        )),
        ...queue_slot_statuses.map(t => all(
            t.scale(0, 0.5),
            t.rotation(t.rotation() + 90, 0.5)
        )),
    );
    yield* waitFor(1);
    yield* all(
        chain(
            stage1_presenter().x(-550, 0.5),
            all(ooo_title().text("CPU Backend 2", 0.2), ooo_title().left(ooo_title().left(), 0.2)),
            stage1_presenter().x(-1200, 0.5),
        ),
        ooo_register_file.x(ooo_register_file.x() - 100, 0.5),
        ooo_uop_queue.x(ooo_uop_queue.x() - 100, 0.5),
        ...functional_units.map(t => t.x(t.x() + 100, 0.5)),
        ooo_dcache.x(ooo_dcache.x() + 100, 0.5),
        ooo_decoder_to_uop_queue_wire().points([[-500-100, -275], [-277-100, -275]], 0.5),
        ooo_decoder_to_uop_queue_wire_label().x(ooo_decoder_to_uop_queue_wire_label().x() - 100, 0.5),
        ooo_cdb().points([[550+250, functional_units[0].right().y-5], [550+250, 375], [ooo_register_file.bottom().x - 100, 375], ooo_register_file.bottom().addX(-100)], 0.5),
        ...ooo_uop_queue_fu_wires.map((t, i) => t.points([[-147+50, functional_units[i].left().y], functional_units[i].left().addX(-100)], 0.5)),
        ...ooo_fu_cdb_wires.map((t, i) => t.points([functional_units[i].right().addX(100), [550+250, functional_units[i].right().y]], 0.5)),
        ooo_regfile_uop_queue_wire().points([ooo_register_file.right().addX(-100), [ooo_uop_queue.bottom().x-100, ooo_register_file.right().y]], 0.5)
    );
    
    const ooo_reservation_stations = createRefArray<Rect>();
    const ooo_reservation_station_labels = createRefArray<Rect>();
    const ooo_resv_fu_wires = createRefArray<Line>();
    ooo_blocks().add(<>
        {range(7).map(i => <Rect ref={ooo_reservation_stations}
            fill={"#492b61"}
            position={[100, -300 + i * 100]}
            scale={0} rotation={90}
            size={[100, 65]}
            lineWidth={4}
            stroke={"#bf5dd6"}
        >
            <RoboticText
                ref={ooo_reservation_station_labels} y={4}
                fill={"#bf5dd6"}
                fontSize={40} fontStyle={""}
                text={"RESV"}
            />
        </Rect>)}
    </>);
    ooo_wires().add(<>
        {...range(7).map(i => <Line ref={ooo_resv_fu_wires}
            points={[ooo_reservation_stations[i].right().addX(50), functional_units[i].left(),]}
            lineWidth={10} stroke={"#bf5dd6"}
            end={0}
            endArrow arrowSize={15}
        ></Line>)}
    </>)
    yield* waitFor(4.5);
    yield* sequence(0.1,
        ...ooo_reservation_stations.map(t => all(
            t.scale(1, 0.5),
            t.rotation(0, 0.5),
        )),
        ...ooo_resv_fu_wires.map(t => t.end(1, 0.5)),
    );

    yield* waitUntil("holdwithtags");
    ooo_stuff().save();
    yield* all(
        ooo_stuff().scale(10, 1.8),
        ooo_stuff().position([-1200, 450+950*2], 1.8)
    );

    const whatisstored = createRef<Txt>();
    ooo_reservation_stations[1].add(<>
        <ThinRoboticText ref={whatisstored}
            fontSize={18} y={5}
            // text={"µOP + tags"}
            fill={"#bf5dd6"}
        />
    </>)

    yield* all(
        ooo_reservation_station_labels[1].fontSize(20, 0.5),
        ooo_reservation_station_labels[1].y(-20, 0.5),
        whatisstored().text("µOP + tags", 0.8),
    );

    yield* waitFor(2);
    yield* all(
        ooo_reservation_station_labels[1].fontSize(40, 0.5),
        ooo_reservation_station_labels[1].y(4, 0.5),
        whatisstored().opacity(0, 0.8),
        ooo_stuff().restore(1.8)
    );

    yield* waitUntil("loopback");
    const ooo_cdb_resv_main_wire = createRef<Line>();
    const ooo_cdb_resv_wires = createRefArray<Line>();
    ooo_wires().add(<>
        <Line ref={ooo_cdb_resv_main_wire}
            points={[[-50, 375], [-50, -290]]}
            lineWidth={10} stroke={"#bf5dd6"}
            end={0}
        ></Line>
        {...range(7).map(i => <Line ref={ooo_cdb_resv_wires}
            points={[[-50, ooo_reservation_stations[i].left().y+15], ooo_reservation_stations[i].left().addY(15),]}
            lineWidth={10} stroke={"#bf5dd6"}
            end={0}
            endArrow arrowSize={15}
        ></Line>)}
    </>);
    yield* sequence(0.05,
        ooo_cdb_resv_main_wire().end(1, 0.5),
        ...range(7).map(i => all(
            ooo_cdb_resv_wires[7-i-1].end(1, 0.5),
            ooo_uop_queue_fu_wires[7-i-1].points([[-147+50, ooo_reservation_stations[7-i-1].left().y-15], ooo_reservation_stations[7-i-1].left().addY(-15)], 0.5),
        )),
    );

    yield* waitUntil("fu_complete_uop");
    yield* sequence(0.1,
        ...functional_units.map(t => wave_computer_block(t, 0.8)),
    );
    yield* waitFor(1);
    yield* sequence(0.4,
        all(
            ...ooo_fu_cdb_wires.map(t => all(
                t.stroke("yellow", 0.8).wait(1.5).back(0.8),
                t.lineWidth(18, 0.8).wait(1.5).back(0.8),
            )),
        ),
        all(
            ooo_cdb().stroke("yellow", 0.8).wait(1.5).back(0.8),
            ooo_cdb().lineWidth(18, 0.8).wait(1.5).back(0.8),
        ),
        all(
            ooo_cdb_resv_main_wire().stroke("yellow", 0.8).wait(1.5).back(0.8),
            ooo_cdb_resv_main_wire().lineWidth(18, 0.8).wait(1.5).back(0.8),
        ),
        all(
            ...ooo_cdb_resv_wires.map(t => all(
                t.stroke("yellow", 0.8).wait(1.5).back(0.8),
                t.lineWidth(18, 0.8).wait(1.5).back(0.8),
            )),
        ),
    );
    yield* sequence(0.1,
        ...ooo_reservation_stations.map((t, i) => wave_computer_block(t, i == 1 ? 1.4 : 0.8))
    );
    yield* waitFor(2);
    yield* all(
        ooo_resv_fu_wires[1].stroke("yellow", 0.8).wait(1.5).back(0.8),
        ooo_resv_fu_wires[1].lineWidth(18, 0.8).wait(1.5).back(0.8),
    );

    ooo_stuff().save();
    yield* all(
        ooo_stuff().scale(10, 1.8),
        ooo_stuff().position([-1200, 450+950+950], 1.8)
    );
    yield* all(
        ooo_reservation_station_labels[1].fontSize(20, 0.5),
        ooo_reservation_station_labels[1].y(-20, 0.5),
        whatisstored().opacity(1, 0.8),
    );
    yield* whatisstored().text("tags?", 0.5).wait(1).to("regnames??", 0.8);

    yield* waitUntil("showexampleuop");
    const example_regname_uop = createRef<Txt>();
    ooo_reservation_stations[1].add(<>
        <RoboticText ref={example_regname_uop}
            fontSize={15} y={2} fontStyle={""}
            // text={"add r1 r3 r5"}
            fill={"#ff6f91"}
        />
    </>);
    yield* all(whatisstored().y(whatisstored().y() + 15, 0.5), example_regname_uop().text("add r1 r3 r5", 0.8));
    yield* waitFor(1);
    yield* whatisstored().text("T0 = 3 -- T1 = 5", 0.8);
    yield* waitFor(5);
    yield* whatisstored().text("T_out = 1", 0.8);

    yield* waitUntil("heresanexample");
    yield* all(
        ooo_reservation_station_labels[1].fontSize(40, 0.5),
        ooo_reservation_station_labels[1].y(4, 0.5),
        whatisstored().opacity(0, 0.8),
        example_regname_uop().opacity(0, 0.8),
        ooo_stuff().restore(1.8),
    );


    const new_example_instructions_parent = createRef<Node>();
    const new_example_instructions = createRefArray<Rect>();
    const new_example_instruction_labels = createRefArray<Txt>();
    const new_example_metastuff = createRefArray<Rect>();
    const new_example_metastuff_labels = createRefArray<Txt>();

    const new_example_instruction_strs = [
        ["add",  "r1", "r2", "r3" ],
        ["idiv", "r1", "r2", "r3" ],
        ["sub",  "r0", "r1", "r2" ],
    ];
    const new_example_metastuff_strs = [
        ["issued to", "FU 1" ],
        ["issued to", "FU 0" ],
        ["in RESV of", "FU 2" ],
    ];
    const new_example_metastuff_strs_flat = [ "issued to", "FU 1", "issued to", "FU 0", "in RESV of", "FU 2", ];
    yield* ooo_stuff().x(2000, 1.2);
    const new_example_instruction_fills = [ 1, 0, 2 ];
    view.add(<>
        <Node ref={new_example_instructions_parent} zIndex={10}>
            {...new_example_instruction_strs.map((a, i) => <Rect ref={new_example_instructions}
                position={[-300, -100 + i * 100 + 40]}
                opacity={0} size={[500, 80]}
                radius={5} lineWidth={5}
                // fill={fu_lighter_fills[new_example_instruction_fills[i]]}
                alignItems={"baseline"}
                justifyContent={"center"}
                layout gap={30}
            >
                {...a.map(s => <RoboticText ref={new_example_instruction_labels}
                    text={s} fontStyle={""}
                    fontSize={80}
                    fill={fu_strokes[new_example_instruction_fills[i]]}
                >
                </RoboticText>)}
            </Rect>)}

            {...new_example_metastuff_strs.map((a, i) => <Rect ref={new_example_metastuff}
                position={[300, -100 + i * 100]}
                size={[500, 80]}
                radius={5} lineWidth={5}
                // fill={fu_lighter_fills[new_example_instruction_fills[i]]}
                alignItems={"baseline"}
                justifyContent={"start"}
                layout gap={30}
            >
                {...a.map((s, j) => <RoboticText ref={new_example_metastuff_labels}
                    fontStyle={""}
                    fontSize={80}
                    fill={fu_strokes[new_example_instruction_fills[i]] + (j == 0 ? "77" : "")}
                >
                </RoboticText>)}
            </Rect>)}
        </Node>
    </>);
    yield* sequence(0.1,
        ...new_example_instructions.map((t, i) => all(
            t.opacity(1, 0.5),
            t.y(t.y() - 40, 0.5),
        ))
    );

    yield* waitUntil("add_and_idiv");
    yield* sequence(0.5,
        ...new_example_instructions.slice(0, 2).map((t, i) => t.fill(fu_lighter_fills[new_example_instruction_fills[i]], 0.5)),
    )
    yield* sequence(0.2,
        ...new_example_metastuff_strs_flat.slice(0, 4).map((s, i) => new_example_metastuff_labels[i].text(s, 0.5)),
    )
    yield* waitFor(2);
    yield* sequence(0.2,
        ...new_example_metastuff_strs_flat.slice(4).map((s, i) => new_example_metastuff_labels[4+i].text(s, 0.5)),
    )

    yield* waitUntil("highlightr1");
    yield* sequence(0.1,
        all(
            new_example_instruction_labels[1].scale(1.3, 0.5).wait(1).back(0.5),
            new_example_instruction_labels[1].fill("yellow", 0.5).wait(1).back(0.5),
        ),
        all(
            new_example_instruction_labels[5].scale(1.3, 0.5).wait(1).back(0.5),
            new_example_instruction_labels[5].fill("yellow", 0.5).wait(1).back(0.5),
        ),
        all(
            new_example_instruction_labels[10].scale(1.3, 0.5).wait(1).back(0.5),
            new_example_instruction_labels[10].fill("yellow", 0.5).wait(1).back(0.5),
        )
    );

    yield* waitUntil("exampletimelinesagain");
    yield* new_example_instructions_parent().x(-300, 0.8);
    issuing_op_backing.splice(0);
    issuing_op_circles.splice(0);
    issuing_op_timelines.splice(0);

    const new_timeline_starts = [ 400, 500 ];
    const new_timeline_widths = [ 200, 300 ];
    view.add(<>
        <Layout ref={issuing_op_time}
            x={200}
            zIndex={-1}
        >
            {range(2).map(i => <Rect ref={issuing_op_backing}
                position={[300, -100 + i * 100]}
                // size={[500, 80]}
                radius={20}
                fill={fu_lighter_fills[1-i] + "88"}
            />)}
            {range(2).map(i => <Circle ref={issuing_op_circles}
                position={[-200 - 75 + new_timeline_starts[i], -100 + i * 100]}
                lineWidth={10} lineCap={"round"}
                stroke={fu_strokes[1-i]} opacity={0}
            />)}
            {range(2).map(i => <Line ref={issuing_op_timelines}
                points={[[-200 + new_timeline_starts[i], 0], [-200 + new_timeline_starts[i] + new_timeline_widths[i], 0]]}
                position={[0 - 75, -100 + i * 100]}
                lineWidth={30} lineCap={"round"} lineDash={[70, 30]}
                stroke={fu_strokes[1-i]} end={0} opacity={0}
            />)}
        </Layout>
    </>)
    yield* sequence(0.1,
        ...issuing_op_backing.map(t => t.size([500, 80], 0.5)),
    )
    yield* sequence(0.5,
        all(
            issuing_op_circles[0].opacity(1, 0.05),
            issuing_op_circles[0].size(80, 0.5),
            issuing_op_timelines[0].opacity(1, 0.1, linear),
            issuing_op_timelines[0].end(1, 2 * 0.5, linear),
        ),
        all(
            issuing_op_circles[1].opacity(1, 0.05),
            issuing_op_circles[1].size(80, 0.5),
            issuing_op_timelines[1].opacity(1, 0.1, linear),
            issuing_op_timelines[1].end(0.3333, 1 * 0.5, linear),
        ),
    );
    yield* waitFor(1);
    const broadcast_lines = createRefArray<Line>();
    view.add(<>
        {range(3).map(i => <Line ref={broadcast_lines}
            position={[-376, -124]}
            lineWidth={10} stroke={"#c59156"}
            lineCap={"round"} end={0} opacity={0}
            points={[
                new Vector2(40, 0).rotate(-i*30),
                new Vector2(80, 0).rotate(-i*30),
            ]}
        />)}
    </>)

    yield* wiggle(new_example_instructions[0].rotation, -10, 10, 0.8);
    yield* loop(3, function*() {
        yield* all(
            ...broadcast_lines.map(t => chain(
                all(
                    t.opacity(1, 0.1).wait(0.5).back(0.1),
                    t.end(1, 0.5),
                    t.start(0, 0).wait(0.2).to(1, 0.5),
                ),
                all(
                    t.end(0, 0),
                    t.start(0, 0)
                )
            ))
        );
    })

    yield* waitUntil("subwillmatchthat");
    yield* all(
        wiggle(new_example_instructions[2].rotation, -10, 10, 0.8),
        new_example_metastuff_labels[4].text("got a new", 0.8),
        new_example_metastuff_labels[5].text("R1!!", 0.8),
    );

    yield* waitUntil("tagsreflecttimeandreg");
    yield* sequence(0.4,
        ...[1, 5].map(i => all(
            new_example_instruction_labels[i].scale(1.8, 0.8).back(0.8),
            new_example_instruction_labels[i].fill("yellow", 0.8).back(0.8),
            wiggle(new_example_instruction_labels[i].rotation, -5, 5, 1.6),
        )),
        noop(),
        noop(),
        noop(),
        noop(),
        noop(),
        ...[10].map(i => all(
            new_example_instruction_labels[i].scale(1.8, 0.8).back(0.8),
            new_example_instruction_labels[i].fill("yellow", 0.8).back(0.8),
            wiggle(new_example_instruction_labels[i].rotation, -5, 5, 1.6),
        )),
    );

    yield* waitUntil("simplesoln");
    yield* sequence(0.1,
        ...new_example_metastuff_labels.map(t => t.text("", 0.8)),
        all(
            ...issuing_op_backing.map(t => t.size([0, 0], 0.8)),
            ...issuing_op_circles.map(t => all(t.end(0, 0.8), t.opacity(0, 0.8))),
            ...issuing_op_timelines.map(t => all(t.end(0, 0.8), t.opacity(0, 0.8))),
        ),
    );

    yield* waitUntil("addissue");
    yield* sequence(0.1,
        new_example_metastuff_labels[0].text("issued to", 0.8),
        new_example_metastuff_labels[1].text("RESV_1", 0.8),
    )
    const mappings = createRef<Txt>();
    view.add(<>
        <RoboticText ref={mappings}
            // text={"R1 -> RESV_1"}
            y={-400} fontStyle={""}
            fill={cosmic_grad_ramps[1][1]}
            fontSize={80}
        />
    </>)
    yield* waitFor(1);
    yield* mappings().text("R1 -> RESV_1", 0.8);

    yield* waitUntil("idivissue");
    yield* sequence(0.1,
        new_example_metastuff_labels[2].text("issued to", 0.8),
        new_example_metastuff_labels[3].text("RESV_0", 0.8),
    );
    yield* all(
        all(
            mappings().fill("yellow", 0.8).wait(0.8).back(0.8),
            mappings().scale(1.4, 0.8).wait(0.8).back(0.8),
        ),
        mappings().text("R1 -> RESV_0", 0.8),
    );

    yield* waitUntil("uselatest");
    yield* sequence(0.1,
        new_example_metastuff_labels[4].text("waiting on", 0.8),
        new_example_metastuff_labels[5].text("RESV_0", 0.8),
    );

    yield* waitUntil("registerrename");
    yield* all(
        mappings().x(-1600, 1.2),
        issuing_op_time().x(-1600, 1.2),
        new_example_instructions_parent().x(-2000, 1.2),
    );

    const regrename_title = createRef<Txt>();

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
                fill={"#085066"}
                rotation={45}
            />
            <Rect ref={back_rect_out_highlight}
                // size={200}
                stroke={"#007f93"}
                fill={"#101c34"}
                zIndex={-2}
                lineWidth={2}
                rotation={45}
            />
            <RoboticText ref={regrename_title}
                fontSize={100} x={-20}
                y={800+400}
                fill={cosmic_grad_ramps[1][4]}
                text={"REGISTER RENAMING"}
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
    const booploop = yield loopFor(Infinity, function* () {
        yield* all(
            back_rect().rotation(back_rect().rotation() + 360, 4),
            back_rect_out_highlight().rotation(back_rect_out_highlight().rotation() - 360, 4),
        )
    });

    yield* sequence(0.2,
        regrename_title().y(400, 0.8),
        regrename_title().fontSize(200, 0.8),
    );
    yield* waitFor(1);
    yield* sequence(0.2,
        regrename_title().fontSize(100, 0.8),
        regrename_title().y(6, 0.8),
    );
    yield* all(
        regrename_title().text("REG RENAME", 0.8),
        back_rect().size(180, 0.4),
        back_rect_out_highlight().size(200, 0.4),
        sequence(0.05,
            ...extension_backing.map((t, i) => all(
                t.start(0, 0.4),
                t.end(1, 0.4),
            )),
        ),
    );

    yield* waitUntil("isaregisters");
    const isa_title_big = createRef<Txt>();
    const isa_regs = createRefArray<Txt>();
    const internal_title_big = createRef<Txt>();
    const internal_regs = createRefArray<Txt>();
    view.add(<>
        <RoboticText ref={isa_title_big}
            position={[-700, 120]}
            // text={"ISA"}
            fill={cosmic_grad_ramps[1][3] + "77"}
            fontSize={350}
        />
        <RoboticText ref={internal_title_big}
            position={[730, 120]}
            // text={"CPU"}
            fill={cosmic_grad_ramps[1][4] + "77"}
            fontSize={350}
        />
        {range(8).map(i => <RoboticText ref={isa_regs}
            position={[-400, 120 - (7 * 40) + i * 80]}
            // text={"R" + i}
            fill={cosmic_grad_ramps[1][3] + "DD"}
            fontSize={100}
        />)}
        {range(8).map(i => <RoboticText ref={internal_regs}
            position={[300, 120 - (7 * 40) + i * 80]}
            // text={"RESV_" + i}
            fill={cosmic_grad_ramps[1][4] + "DD"}
            fontSize={100}
        />)}
    </>);
    yield* sequence(0.1,
        ...isa_regs.map((t, i) => t.text("R" + i, 0.8)),
        isa_title_big().text("ISA", 0.8),
    );

    yield* waitUntil("conversion");
    yield* sequence(0.1,
        ...internal_regs.map((t, i) => t.text("RESV_" + i, 0.8)),
        internal_title_big().text("CPU", 0.8),
    );

    yield* waitUntil("outwarwaw");
    yield* all(
        sequence(0.05,
            ...extension_backing.map((t, i) => all(
                t.start(0.5, 0.4),
                t.end(0.5, 0.4),
            )),
            back_node().y(-1000, 1.2),
        ),
        isa_title_big().x(-2000, 1.2),
        ...isa_regs.map((t, i) => t.x(-1600, 1.2)),
        internal_title_big().x(2000, 1.2),
        ...internal_regs.map((t, i) => t.x(1600, 1.2)),
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
    
    yield* waitUntil("preciseexceptions")
    const twoproblems_titles = createRefArray<Txt>();
    view.add(<>
        <RoboticText ref={twoproblems_titles}
            x={-120} y={-430} fontSize={200}
            fill={cosmic_grad_ramps[1][3] + "CC"}
        />
    </>);
    yield* twoproblems_titles().text("1. Precise Exceptions", 1.2);

    yield* waitUntil("idivdivd0");
    yield* all(
        new_example_instructions_parent().x(0, 1.2),
    );
    
    yield* waitFor(1);
    yield* all(
        new_example_instruction_labels[5].text("r3", 0.8),
        new_example_instruction_labels[7].fill("red", 0.8),
        new_example_instruction_labels[7].scale(1.2, 0.8),
        new_example_instruction_labels[7].text("0", 0.8),
        new_example_metastuff_labels[2].text("Divided By", 0.8),
        new_example_metastuff_labels[3].text("0!!!", 0.8),
    );

    yield* waitFor(2);
    yield* all(
        new_example_metastuff_labels[4].text("Already issued", 0.8),
        new_example_metastuff_labels[5].text("this...", 0.8),
    );

    yield* waitUntil("biggerissue");
    yield* all(
        new_example_instructions_parent().x(2000, 1.2),
        twoproblems_titles().text("2. Branching????", 1.2),
        twoproblems_titles().x(twoproblems_titles().x() - 140, 1.2),
    );



    
    const another_new_example_instructions_parent = createRef<Node>();
    const another_new_example_instructions = createRefArray<Rect>();
    const another_new_example_instruction_labels = createRefArray<Txt>();
    const another_new_example_metastuff = createRefArray<Rect>();
    const another_new_example_metastuff_labels = createRefArray<Txt>();

    const another_new_example_instruction_strs = [
        [ "mov", "r3", "10h", ],
        [ "add", "r3", "r1", "r2", ],
        [ "sub", "r1", "r3", "r0", ],
        [ "cmp", "r3", "r1", ],
        [ "jeq", "I2", ],
        [ "and", "r2", "r0", "r3", ],
        [ "or" , "r0", "r3", "r2", ],
    ];

    const another_new_example_metastuff_strs = [
        ["issued to", "FU 1" ],
        ["issued to", "FU 0" ],
        ["in RESV of", "FU 2" ],
    ];
    const another_new_example_metastuff_strs_flat = [ "issued to", "FU 1", "issued to", "FU 0", "in RESV of", "FU 2", ];
    yield* ooo_stuff().x(2000, 1.2);
    const another_new_example_instruction_fills = [ 5, 1, 2, 1, 6, 4, 4 ];
    view.add(<>
        <Node ref={another_new_example_instructions_parent} zIndex={10}>
            {...another_new_example_instruction_strs.map((a, i) => <Rect ref={another_new_example_instructions}
                position={[-300, -100 + i * 80 + 40]}
                opacity={0} size={[500, 80]}
                radius={5} lineWidth={5}
                // fill={fu_lighter_fills[new_example_instruction_fills[i]]}
                alignItems={"baseline"}
                justifyContent={"start"}
                layout gap={30}
            >
                {...a.map(s => <RoboticText ref={another_new_example_instruction_labels}
                    text={s} fontStyle={""}
                    fontSize={80}
                    fill={fu_strokes[another_new_example_instruction_fills[i]]}
                >
                </RoboticText>)}
            </Rect>)}

            {...another_new_example_metastuff_strs.map((a, i) => <Rect ref={another_new_example_metastuff}
                position={[300, -100 + i * 80]}
                size={[500, 80]}
                radius={5} lineWidth={5}
                // fill={fu_lighter_fills[new_example_instruction_fills[i]]}
                alignItems={"baseline"}
                justifyContent={"start"}
                layout gap={30}
            >
                {...a.map((s, j) => <RoboticText ref={another_new_example_metastuff_labels}
                    fontStyle={""}
                    fontSize={80}
                    fill={fu_strokes[another_new_example_instruction_fills[i]] + (j == 0 ? "77" : "")}
                >
                </RoboticText>)}
            </Rect>)}
        </Node>
    </>);
    yield* waitFor(4);
    yield* sequence(0.1,
        ...another_new_example_instructions.map((t, i) => all(
            t.opacity(1, 0.5),
            t.y(t.y() - 40, 0.5),
        ))
    );

    yield* waitUntil("jump_mispredict?");
    yield* sequence(0.1,
        ...another_new_example_instructions.filter((_, i) => i != 4).map(t => all(
            t.opacity(0.4, 0.8),
            t.scale(0.9, 0.8),
        )),
    );

    const prediction_lines = createRefArray<Curve>();
    view.add(<>
        <CubicBezier ref={prediction_lines}
            p0={[-588, 225]}
            p1={[-700, 225]}
            p2={[-700, -15]}
            p3={[-550, -15]}
            lineWidth={8} end={0}
            stroke={cosmic_grad_ramps[1][3]}
            endArrow
        />
        <CubicBezier ref={prediction_lines}
            p0={[-588, 225]}
            p1={[-700, 225]}
            p2={[-700, 300]}
            p3={[-550, 300]}
            lineWidth={8} end={0}
            stroke={cosmic_grad_ramps[1][3]}
            endArrow
        />
    </>);
    yield* sequence(0.1,
        ...prediction_lines.map(t => t.end(1, 0.8)),
    );
    yield* waitFor(2);
    
    yield* sequence(0.1,
        prediction_lines[0].stroke(STATUS_RED, 0.8),
        prediction_lines[1].stroke(STATUS_GREEN, 0.8),
    );

    yield* waitUntil("fortunately");
    yield* all(...prediction_lines.map(t => t.end(0, 0.5)));
    yield* all(
        another_new_example_instructions_parent().x(-2000, 1.2),
        twoproblems_titles().x(-2000, 1.2),
    );

    yield* waitUntil("commenceupgrade");
    yield* ooo_stuff().x(0, 1.2);
    
    ooo_stuff().save();
    yield* all(
        ooo_stuff().scale(2.8, 1.2),
        ooo_stuff().position([150, -500], 1.2),
        ooo_stuff().rotation(-90, 1.2),
    );
    yield* all(
        ooo_uop_queue.height(ooo_uop_queue.height() - 150, 1.2),
        ...queue_slots.map(t => t.height(55, 1.2)),
        ooo_uop_queue.childAs<Txt>(0).y(ooo_uop_queue.childAs<Txt>(0).y() - 70, 1.2),
    );
    yield* ooo_uop_queue.childAs<Txt>(0).text("Reorder Buffer (ROB)", 1.2),
    yield* waitFor(2);
    yield* ooo_stuff().restore(1.2);

    yield chain(
        stage1_presenter().x(-550, 0.5),
        all(ooo_title().text("CPU Backend 3", 0.2), ooo_title().left(ooo_title().left(), 0.2)),
        stage1_presenter().x(-1200, 0.5),
    );
    yield* all(
        ...ooo_uop_queue_fu_wires.map((t, i) => t.points([[-175, ooo_reservation_stations[i].left().y-15], ooo_reservation_stations[i].left().addY(-15)], 0.5)),
        ooo_decoder_to_uop_queue_wire().points([[-500-25, -275], [-277-25, -275]], 0.5),
        ooo_decoder_to_uop_queue_wire_label().x(ooo_decoder_to_uop_queue_wire_label().x() + 80, 0.5),
        ooo_regfile_uop_queue_wire().points([ooo_register_file.right().addX(-100), [ooo_uop_queue.bottom().x, ooo_register_file.right().y]], 0.5)
    )


    yield* waitUntil("pushinguopsagain");
    const ooo_new_uop_entry_parent = createRef<Node>();
    const ooo_new_uop_entry_masks  = createRefArray<Rect>();
    const ooo_new_uop_entries      = createRefArray<Line>();
    const ooo_new_uop_fus          = [ 4, 1, 2, 3, 0 ];
    ooo_internals().add(<>
        <Node ref={ooo_new_uop_entry_parent} zIndex={10}>
            {...range(5).map(i => <Rect ref={ooo_new_uop_entry_masks}
                // stroke={"red"} lineWidth={10}
                position={[-400,0]}
                size={[700, 800]}
                zIndex={5-i}
                clip
            >
                <Line ref={ooo_new_uop_entries}
                    position={[-560+400, -275]}
                    closed radius={5}
                    lineWidth={3}
                    rotation={() => time() * 20}
                    stroke={fu_strokes[ooo_new_uop_fus[i]]}
                    fill={fu_fills[ooo_new_uop_fus[i]]}
                    opacity={0}
                    points={[
                        new Vector2(0, 25),
                        new Vector2(0, 25).rotate(120),
                        new Vector2(0, 25).rotate(240),
                    ]}
                >
                </Line>
            </Rect>)}
        </Node>
    </>);
    yield* sequence(0.1,
        ...ooo_new_uop_entries.map((t, i) => sequence(0.2,
            t.opacity(1, 0.3),
            t.x(-182 + 365, 0.5),
            t.y(276 - i * 55, 0.5),
        ))
    );

    yield* waitUntil("issueduopsfromrob");
    const new_entry_clones = ooo_new_uop_entry_masks.map(t => t.clone())
    ooo_new_uop_entry_parent().add(<>{...new_entry_clones}</>);
    
    new_entry_clones.forEach(t => show_mask(t));
    new_entry_clones.forEach(t => t.width(450));
    yield* sequence(0.1,
        ...new_entry_clones.map(t => t.childAs<Line>(0).x(t.childAs<Line>(0).x() + 200, 1.2)),
    )

    yield* waitUntil("issuedtoRESVs");
    new_entry_clones.forEach((t,i) =>
        t.position(ooo_uop_queue_fu_wires[ooo_new_uop_fus[i]].getPointAtPercentage(0.5).position)
         .width(220).height(90)
    );
    yield* all(
        ...new_entry_clones.map(t => all(
            t.childAs<Line>(0).x(-200, 0),
            t.childAs<Line>(0).y(0, 0),
            t.childAs<Line>(0).scale(2, 0),
        )),
    )

    yield* sequence(0.1,
        ...new_entry_clones.map(t => all(
            t.childAs<Line>(0).x(200, 1.2),
        )),
    );


    yield* waitUntil("issuedtofus");
    new_entry_clones.forEach((t,i) =>
        t.position(ooo_resv_fu_wires[ooo_new_uop_fus[i]].getPointAtPercentage(0.5).position)
         .width(90).height(90)
    );
    yield* all(
        ...new_entry_clones.map(t => all(
            t.childAs<Line>(0).x(-80, 0),
            t.childAs<Line>(0).y(0, 0),
            t.childAs<Line>(0).scale(1, 0),
        )),
    )

    yield* sequence(0.1,
        ...new_entry_clones.map(t => all(
            t.childAs<Line>(0).x(80, 1.2),
        )),
    );
    const workingloops: any[] = [];
    for (let i = 0; i < 5; i++) {
        workingloops[i] = yield loopFor(Infinity, function* () {
            yield* functional_units[i].rotation(4, 0.5, easeOutSine)
                .back(0.5, easeInSine)
                .to(-4, 0.5, easeOutSine)
                .back(0.5, easeInSine);
        });
    }

    yield* waitUntil("execfinished");
    [4, 1, 2, 3, 0].forEach(i => cancel(workingloops[i]));
    yield* sequence(0.1,
        ...[4, 1, 2, 3, 0].map((i, j) => chain(
            all(
                functional_units[i].rotation(0, 0.5),
                finished_computer_block(functional_units[i], 0.8, 1.5),
            ),
        )),
    );

    yield* waitUntil("finalhighlightregfiles");
    yield* wave_computer_block(ooo_register_file, 0.8);

    yield* waitUntil("rewirecdb");
    yield* ooo_cdb().points([[550+250, functional_units[0].right().y-5], [550+250, 375], [ooo_uop_queue.right().x, 375], ooo_uop_queue.right()], 0.5);

    
    new_entry_clones.forEach((t,i) =>
        t.position([200,0])
         .width(1400).height(900)
    );
    yield* all(
        ...new_entry_clones.map((t,i) => all(
            t.childAs<Line>(0).x(350, 0),
            t.childAs<Line>(0).y(functional_units[i].y(), 0),
            t.childAs<Line>(0).scale(1.5, 0),
            t.childAs<Line>(0).opacity(0, 0),
        )),
    )

    yield* sequence(0.1,
        ...new_entry_clones.map((t,i) => all(
            t.childAs<Line>(0).opacity(1, 0.1).wait(0.7+0.8+0.8+0.1).to(0, 0.05),
            t.childAs<Line>(0).x(t.childAs<Line>(0).x() + 270, 0.8)
                .wait(0.8).to(-440, 0.8),
            t.childAs<Line>(0).y(functional_units[i].y(), 0).wait(0.8).to(380, 0.8).wait(0.8).to(300, 0.2),
            t.childAs<Line>(0).scale(1.5, 0),
        )),
    )
    yield* waitFor(4);
    new_entry_clones.forEach(t => hide_mask(t));
    const ooo_rob_regfile_wire = createRef<Line>();
    ooo_wires().add(<>
        <Line ref={ooo_rob_regfile_wire}
            points={[[ooo_uop_queue.bottom().x, ooo_register_file.right().y + 20], ooo_register_file.right().addY(20)]}
            lineWidth={10} stroke={"#bf5dd6"}
            end={0}
            endArrow arrowSize={15}
        >
        </Line>
    </>);
    
    yield* waitUntil("retirementstepping");
    yield* all(
        ooo_regfile_uop_queue_wire().y(ooo_regfile_uop_queue_wire().y() - 20, 0.8),
        ooo_rob_regfile_wire().end(1, 0.8),
    );
    ooo_new_uop_entry_masks.forEach(t => show_mask(t));
    yield* chain(
        ...ooo_new_uop_entries.map((t,i) => chain(
            t.scale(3, 0.5, easeOutCirc).to(1, 0.5, easeInCirc),
            all(
                t.position([-50,50], 0.8),
                t.opacity(1, 0).wait(0.4).to(0, 0.4),
                t.scale(0.1, 0.8),
            ),
            run(function*() {
                yield* sequence(0.05,
                    ...ooo_new_uop_entries.slice(i+1).map(s => all(
                        s.y(s.y() + 55, 0.3),
                    )),
                );
            }),
        )),
    );
    ooo_new_uop_entry_masks.forEach(t => hide_mask(t));

    yield* waitUntil("uopretirementreveal");
    const retirementtitle = createRef<Txt>();
    view.add(<>
        <RoboticText ref={retirementtitle}
            fill={cosmic_grad_ramps[1][3]}
            fontSize={100}
            y={-650}
            text={"µop Retirement"}
        />
    </>);

    yield* all(
        ooo().scale(0.9, 1.2).wait(2.5).back(1.2),
        ooo_panel_highlight_in().scale(0.9, 1.2).wait(2.5).back(1.2),
        ooo_panel_highlight_out().scale(0.9, 1.2).wait(2.5).back(1.2),
        ooo().bottom(ooo().bottom(), 1.2).wait(2.5).back(1.2),
        ooo_panel_highlight_in().bottom(ooo_panel_highlight_in().bottom(), 1.2).wait(2.5).back(1.2),
        ooo_panel_highlight_out().bottom(ooo_panel_highlight_out().bottom(), 1.2).wait(2.5).back(1.2),
        retirementtitle().y(-450, 1.2).wait(2.5).back(1.2),
    );

    yield* waitUntil("whathappenedhere");
    yield* ooo_stuff().x(2000, 1.2);


    const FINAL_issuing_ops_parent = createRef<Node>();
    const FINAL_issuing_ops = createRef<Layout>();
    const FINAL_issuing_op_txts = createRefArray<Txt>();
    const FINAL_issuing_op_time = createRef<Layout>();
    const FINAL_issuing_op_backing = createRefArray<Rect>();
    const FINAL_issuing_op_circles = createRefArray<Circle>();
    const FINAL_issuing_op_circles_ending = createRefArray<Circle>();
    const FINAL_issuing_op_timelines = createRefArray<Line>();
    const FINAL_issuing_op_timelines_padding = createRefArray<Line>();
    view.add(<Node ref={FINAL_issuing_ops_parent} x={0} scale={1.4}>
        <Layout ref={FINAL_issuing_ops}
            position={[-500, 0]}
            // layout direction={"column-reverse"}
        >
            {range(5).map(i => <RoboticText ref={FINAL_issuing_op_txts}
                // text={"µop " + i}
                y={192 - 96 * i}
                fontSize={80}
                fill={fu_strokes[i+2]}
            />)}
        </Layout>
    </Node>);
    yield* sequence(0.1,
        ...FINAL_issuing_op_txts.map((t, i) => t.text("µop " + i, 0.5)),
    )
    const FINAL_timeline_starts = [0, 100, 200, 400, 500];
    const FINAL_timeline_widths = [700, 300, 200, 400, 200];
    const FINAL_timeline_padding_widths = [0, 300, 300, 0, 100];
    const FINAL_timeline_wiper = createRef<Line>();
    FINAL_issuing_ops_parent().add(<>
        {range(5).map(i => <Rect ref={FINAL_issuing_op_backing}
            position={[0, FINAL_issuing_op_txts[i].position().y]}
            zIndex={-2}
            // size={[1300, 80]}
            radius={20}
            fill={fu_lighter_fills[i+2] + "88"}
        />)}
        <Layout ref={FINAL_issuing_op_time}
            zIndex={-1}
        >
            {range(5).map(i => <Circle ref={FINAL_issuing_op_circles}
                position={[-200 + FINAL_timeline_starts[i], FINAL_issuing_op_txts[i].position().y]}
                // size={80}
                lineWidth={10} lineCap={"round"}
                stroke={fu_strokes[i+2]} opacity={0}
            />)}
            {range(5).map(i => <Circle ref={FINAL_issuing_op_circles_ending}
                position={[-200 + FINAL_timeline_starts[i] + FINAL_timeline_widths[i]-20, FINAL_issuing_op_txts[i].position().y]}
                // size={80}
                lineWidth={10} lineCap={"round"}
                stroke={fu_strokes[i+2]} opacity={0}
            />)}
            {range(5).map(i => <Line ref={FINAL_issuing_op_timelines}
                points={[[-200 + FINAL_timeline_starts[i], 0], [-200 + FINAL_timeline_starts[i] + FINAL_timeline_widths[i], 0]]}
                position={[0, FINAL_issuing_op_txts[i].position().y]}
                lineWidth={30} lineCap={"round"} lineDash={[70, 30]}
                stroke={fu_strokes[i+2]} end={0} opacity={0}
            />)}
            {range(5).map(i => <Line ref={FINAL_issuing_op_timelines_padding}
                points={[[-200 + FINAL_timeline_starts[i] + FINAL_timeline_widths[i]-10, 0],
                         [-200 + FINAL_timeline_starts[i] + FINAL_timeline_widths[i] + FINAL_timeline_padding_widths[i]-10, 0]]}
                position={[0, FINAL_issuing_op_txts[i].position().y]}
                lineWidth={15} lineCap={"round"} lineDash={[85, 15]}
                stroke={fu_strokes[i+2]} end={0} opacity={0}
            />)}
        </Layout>
        <Line ref={FINAL_timeline_wiper}
            position={[-200 + FINAL_timeline_starts[0], 0]}
            points={[[0, -300], [0, 300]]} end={0} opacity={0}
            lineWidth={10} lineCap={"round"}
            stroke={cosmic_grad_ramps[1][4] + "77"}
        >
        </Line>
    </>);
    yield all(FINAL_timeline_wiper().opacity(1, 0.1), FINAL_timeline_wiper().end(1, 0.5));
    yield* sequence(0.1,
        ...FINAL_issuing_op_backing.map(t => t.size([1300, 80], 0.8)),
    );

    yield FINAL_timeline_wiper().x(FINAL_timeline_wiper().x() + 800, 0.5 * 8, linear)
    yield* sequence(0.5,
        all(
            FINAL_issuing_op_circles[0].opacity(1, 0.05),
            FINAL_issuing_op_circles[0].size(80, 0.3),
            FINAL_issuing_op_timelines[0].opacity(1, 0.1, linear),
            FINAL_issuing_op_timelines[0].end(1, 7 * 0.5, linear),
        ),
        all(
            FINAL_issuing_op_circles[1].opacity(1, 0.05),
            FINAL_issuing_op_circles[1].size(80, 0.3),
            FINAL_issuing_op_timelines[1].opacity(1, 0.1, linear),
            FINAL_issuing_op_timelines[1].end(1, 3 * 0.5, linear),
        ),
        all(
            FINAL_issuing_op_circles[2].opacity(1, 0.05),
            FINAL_issuing_op_circles[2].size(80, 0.3),
            FINAL_issuing_op_timelines[2].opacity(1, 0.1, linear),
            FINAL_issuing_op_timelines[2].end(1, 2 * 0.5, linear),
        ),
        noop(),
        all(
            FINAL_issuing_op_circles[3].opacity(1, 0.05),
            FINAL_issuing_op_circles[3].size(80, 0.3),
            FINAL_issuing_op_timelines[3].opacity(1, 0.1, linear),
            FINAL_issuing_op_timelines[3].end(1, 4 * 0.5, linear),
        ),
        all(
            FINAL_issuing_op_circles[4].opacity(1, 0.05),
            FINAL_issuing_op_circles[4].size(80, 0.3),
            FINAL_issuing_op_timelines[4].opacity(1, 0.1, linear),
            FINAL_issuing_op_timelines[4].end(1, 2 * 0.5, linear),
        ),
    );

    yield* waitUntil("ooocompletionwastheproblem");
    yield* sequence(0.1,
        ...range(5).map(i => all(
            FINAL_issuing_op_circles_ending[i].opacity(1, 0.05),
            FINAL_issuing_op_circles_ending[i].size(80, 0.3),
        ))
    );

    yield* waitUntil("in_order_completion");
    yield* all(
    //     FINAL_issuing_ops_parent().scale(1, 1.2),
    //     ...FINAL_issuing_op_backing.map(t => t.size([1800, 80], 1.2)),
    //     FINAL_issuing_ops().x(-750, 1.2),
    //     FINAL_issuing_op_time().x(-250, 1.2),
        FINAL_timeline_wiper().x(FINAL_timeline_wiper().x() - 420, 1.2),
    );
    yield* waitFor(1);
    yield FINAL_timeline_wiper().x(FINAL_timeline_wiper().x() + 400, 0.5 * 4, linear)
    yield* sequence(0.5,
        all(
            all(
                FINAL_issuing_op_circles_ending[1].x(FINAL_issuing_op_circles_ending[1].x() + 300, 3 * 0.5, linear),
                FINAL_issuing_op_timelines_padding[1].opacity(0.5, 0.1, linear),
                FINAL_issuing_op_timelines_padding[1].end(1, 3 * 0.5, linear),
            ),
            all(
                FINAL_issuing_op_circles_ending[2].x(FINAL_issuing_op_circles_ending[2].x() + 300, 3 * 0.5, linear),
                FINAL_issuing_op_timelines_padding[2].opacity(0.5, 0.1, linear),
                FINAL_issuing_op_timelines_padding[2].end(1, 3 * 0.5, linear),
            ),
        ),
        noop(),
        noop(),
        all(
            FINAL_issuing_op_circles_ending[4].x(FINAL_issuing_op_circles_ending[4].x() + 100, 1 * 0.5, linear),
            FINAL_issuing_op_timelines_padding[4].opacity(0.5, 0.1, linear),
            FINAL_issuing_op_timelines_padding[4].end(1, 1 * 0.5, linear),
        ),
    );

    yield* waitFor(2);
    yield* sequence(0.1,
        ...range(5).map(i => all(
            all(FINAL_timeline_wiper().opacity(1, 0.3).to(0, 0.2), FINAL_timeline_wiper().start(1, 0.5)),
            FINAL_issuing_op_backing[i].x(2000, 1.2),
            FINAL_issuing_op_circles[i].x(2000, 1.2),
            FINAL_issuing_op_circles_ending[i].x(2000, 1.2),
            FINAL_issuing_op_timelines[i].x(2000, 1.2),
            FINAL_issuing_op_timelines_padding[i].x(2000, 1.2),
            FINAL_issuing_op_txts[i].x(2000, 1.2),
        )),
    );

    yield* waitUntil("bringemin");
    yield* ooo_stuff().x(0, 1.2);

    yield* waitUntil("illeffects");
    {
        const ooo_new_uop_entry_parent = createRef<Node>();
        const ooo_new_uop_entry_masks  = createRefArray<Rect>();
        const ooo_new_uop_entries      = createRefArray<Line>();
        const ooo_new_uop_fus          = [ 0, 1, 3, 4, 2 ];
        const another_danger_sign      = createRef<Icon>();
        ooo_internals().add(<>
            <Node ref={ooo_new_uop_entry_parent} zIndex={10}>
                {...range(5).map(i => <Rect ref={ooo_new_uop_entry_masks}
                    // stroke={"red"} lineWidth={10}
                    position={[-400,0]}
                    size={[700, 800]}
                    zIndex={5-i}
                    clip
                >
                    <Line ref={ooo_new_uop_entries}
                        position={[-560+400, -275]}
                        closed radius={5}
                        lineWidth={3}
                        rotation={() => time() * 20}
                        stroke={fu_strokes[ooo_new_uop_fus[i]]}
                        fill={fu_fills[ooo_new_uop_fus[i]]}
                        opacity={0}
                        points={[
                            new Vector2(0, 25),
                            new Vector2(0, 25).rotate(120),
                            new Vector2(0, 25).rotate(240),
                        ]}
                    >
                    </Line>
                </Rect>)}
            </Node>
        </>);
        yield* sequence(0.1,
            ...ooo_new_uop_entries.map((t, i) => sequence(0.2,
                t.opacity(1, 0.3),
                t.x(-182 + 365, 0.5),
                t.y(276 - i * 55, 0.5),
            ))
        );
    
        const new_entry_clones = ooo_new_uop_entry_masks.map(t => t.clone())
        ooo_new_uop_entry_parent().add(<>{...new_entry_clones}</>);
        
        new_entry_clones.forEach(t => show_mask(t));
        new_entry_clones.forEach(t => t.width(450));
        yield* sequence(0.1,
            ...new_entry_clones.map(t => t.childAs<Line>(0).x(t.childAs<Line>(0).x() + 200, 1.2)),
        )
    
        new_entry_clones.forEach((t,i) =>
            t.position(ooo_uop_queue_fu_wires[ooo_new_uop_fus[i]].getPointAtPercentage(0.5).position)
             .width(220).height(90)
        );
        yield* all(
            ...new_entry_clones.map(t => all(
                t.childAs<Line>(0).x(-200, 0),
                t.childAs<Line>(0).y(0, 0),
                t.childAs<Line>(0).scale(2, 0),
            )),
        )
    
        yield* sequence(0.1,
            ...new_entry_clones.map(t => all(
                t.childAs<Line>(0).x(200, 1.2),
            )),
        );
    
    
        new_entry_clones.forEach((t,i) =>
            t.position(ooo_resv_fu_wires[ooo_new_uop_fus[i]].getPointAtPercentage(0.5).position)
             .width(90).height(90)
        );
        yield* all(
            ...new_entry_clones.map(t => all(
                t.childAs<Line>(0).x(-80, 0),
                t.childAs<Line>(0).y(0, 0),
                t.childAs<Line>(0).scale(1, 0),
            )),
        )
    
        yield* sequence(0.1,
            ...new_entry_clones.map(t => all(
                t.childAs<Line>(0).x(80, 1.2),
            )),
        );

        yield* sequence(0.1,
            all(
                errored_computer_block(functional_units[4], 1, 1.5),
            ),
            ...[1, 2, 3, 0].map((i, j) => chain(
                all(
                    finished_computer_block(functional_units[i], 0.8, 1.5),
                ),
            )),
        );
    
        new_entry_clones.forEach((t,i) =>
            t.position([200,0])
             .width(1400).height(900)
        );
        yield* all(
            ...new_entry_clones.map((t,i) => all(
                t.childAs<Line>(0).x(350, 0),
                t.childAs<Line>(0).y(functional_units[i].y(), 0),
                t.childAs<Line>(0).scale(1.5, 0),
                t.childAs<Line>(0).opacity(0, 0),
            )),
        )
    
        yield* sequence(0.1,
            ...new_entry_clones.map((t,i) => all(
                t.childAs<Line>(0).opacity(1, 0.1).wait(0.7+0.8+0.8+0.1).to(0, 0.05),
                t.childAs<Line>(0).x(t.childAs<Line>(0).x() + 270, 0.8)
                    .wait(0.8).to(-440, 0.8),
                t.childAs<Line>(0).y(functional_units[i].y(), 0).wait(0.8).to(380, 0.8).wait(0.8).to(300, 0.2),
                t.childAs<Line>(0).scale(1.5, 0),
            )),
        )
        ooo_new_uop_entry_masks[3].add(<>
            <Icon ref={another_danger_sign}
                icon={"solar:danger-triangle-bold"}
                position={ooo_new_uop_entries[3].position()}
                rotation={90} scale={0}
                color={"#c55656"}
                size={50}
            >
            </Icon>
        </>)
        yield* all(
            ooo_new_uop_entries[3].scale(0, 0.8),
            another_danger_sign().rotation(0, 0.8),
            another_danger_sign().scale(1, 0.8),
        );
        new_entry_clones.forEach(t => hide_mask(t));
        
        yield* waitUntil("retirementstepping_AGAIN"); // @HERE
        ooo_new_uop_entry_masks.forEach(t => show_mask(t));
        yield* chain(
            ...ooo_new_uop_entries.slice(0, 3).map((t,i) => chain(
                t.scale(3, 0.5, easeOutCirc).to(1, 0.5, easeInCirc),
                all(
                    t.position([-50,50], 0.8),
                    t.opacity(1, 0).wait(0.4).to(0, 0.4),
                    t.scale(0.1, 0.8),
                ),
                run(function*() {
                    yield* sequence(0.05,
                        another_danger_sign().y(another_danger_sign().y() + 55, 0.3),
                        ...ooo_new_uop_entries.slice(i+1).map(s => all(
                            s.y(s.y() + 55, 0.3),
                        )),
                    );
                }),
            )),
            another_danger_sign().scale(3, 0.5),
        );
        
        ooo_new_uop_entry_masks.forEach(t => hide_mask(t));
        
        yield* waitUntil("OKTHATSDONE");
        yield* all(
            ooo_new_uop_entry_parent().y(ooo_new_uop_entry_parent().y() - 40, 0.5),
            ooo_new_uop_entry_parent().opacity(0, 0.5),
        )
    }
    yield* waitUntil("memory_refs");
    yield* all(
        ooo().scale(0.9, 1.2).wait(4).back(1.2),
        ooo_panel_highlight_in().scale(0.9, 1.2).wait(4).back(1.2),
        ooo_panel_highlight_out().scale(0.9, 1.2).wait(4).back(1.2),
        ooo().left(ooo().left(), 1.2).wait(4).back(1.2),
        ooo_panel_highlight_in().left(ooo_panel_highlight_in().left(), 1.2).wait(4).back(1.2),
        ooo_panel_highlight_out().left(ooo_panel_highlight_out().left(), 1.2).wait(4).back(1.2),
    );

    yield* waitUntil("highlight_dcache_loadstore");

    ooo_stuff().save();
    yield* all(
        ooo_stuff().scale(2, 1.2),
        ooo_stuff().position([-700, -400], 1.2),
    );
    
    yield* chain(
        wave_computer_block(functional_units[5]),
        wave_computer_block(ooo_dcache),
    );

    yield* waitUntil("add_loadstorequeues");
    yield* ooo_internals().y(ooo_internals().y() - 40, 0.8);

    const load_queue = createRef<Rect>(); const load_queue_title = createRef<Txt>();
    const store_queue = createRef<Rect>(); const store_queue_title = createRef<Txt>();
    const fu_load_queue_wire = createRef<Line>();
    const fu_store_queue_wire = createRef<Line>();
    const load_queue_dcache_wire = createRef<Line>();
    const store_queue_dcache_wire = createRef<Line>();
    ooo_blocks().add(<>
        <Rect ref={load_queue}
            fill={"#2b4e41"}
            position={[300, 450]}
            // scale={0} rotation={90}
            size={[200, 65]}
            lineWidth={4}
            stroke={"#56c59c"}
        >
            <RoboticText
                ref={load_queue_title} y={4}
                fill={"#56c59c"}
                fontSize={40} fontStyle={""}
                text={"Load Queue"}
            />
        </Rect>
        <Rect ref={store_queue}
            fill={"#2b4e41"}
            position={[500, 525]}
            // scale={0} rotation={90}
            size={[200, 65]}
            lineWidth={4}
            stroke={"#56c59c"}
        >
            <RoboticText
                ref={store_queue_title} y={4}
                fill={"#56c59c"}
                fontSize={40} fontStyle={""}
                text={"Store Queue"}
            />
        </Rect>
    </>);
    ooo_wires().add(<>
        <Line ref={fu_load_queue_wire}
            points={[load_queue().top(), [load_queue().top().x, functional_units[5].bottom().y]]}
            lineWidth={10} stroke={"#56c59c"}
            end={0}
            startArrow endArrow arrowSize={15}
        >
        </Line>
        <Line ref={fu_store_queue_wire}
            points={[store_queue().top(), [store_queue().top().x, functional_units[5].bottom().y]]}
            lineWidth={10} stroke={"#56c59c"}
            end={0}
            startArrow endArrow arrowSize={15}
        >
        </Line>
        <Line ref={store_queue_dcache_wire}
            points={[store_queue().left(), [95, 525]]}
            lineWidth={10} stroke={"#c457a5"}
            end={0}
            endArrow arrowSize={15}
        >
        </Line>
        <Line ref={load_queue_dcache_wire}
            points={[load_queue().left(), [95, 450]]}
            lineWidth={10} stroke={"#c457a5"}
            end={0}
            startArrow arrowSize={15}
        >
        </Line>
    </>);
    load_queue().scale(0).rotation(90);
    store_queue().scale(0).rotation(90);
    yield* sequence(0.1,
        all(
            load_queue().scale(1, 0.5),
            load_queue().rotation(0, 0.5),
        ),
        all(
            store_queue().scale(1, 0.5),
            store_queue().rotation(0, 0.5),
        ),
        fu_load_queue_wire().end(1, 0.5),
        fu_store_queue_wire().end(1, 0.5),
        all(
            ooo_dcache.x(ooo_dcache.x() - 650, 0.5),
            ooo_dcache.y(485, 0.5),
            ooo_dcache.size([150, 150], 0.5),
        ),
        load_queue_dcache_wire().end(1, 0.5),
        store_queue_dcache_wire().end(1, 0.5),
    );

    yield* waitUntil("zoomingbackout");
    yield* ooo_stuff().restore(1.2);

    yield* waitUntil("reservationstationshighlight");
    yield* sequence(0.1,
        ...ooo_reservation_stations.map(t => wave_computer_block(t)),
    );
    yield* waitUntil("responsibility");
    ooo_stuff().save();
    yield* all(
        ooo_stuff().scale(10, 1.8),
        ooo_stuff().position([-1200, 450+950+950+450], 1.8)
    );
    whatisstored().y(10).text("");
    yield* all(
        ooo_reservation_station_labels[1].fontSize(20, 0.5),
        ooo_reservation_station_labels[1].y(-20, 0.5),
        whatisstored().opacity(1, 0.8),
    );
    yield* whatisstored().text("holding µops?", 0.5).wait(2).to("holding µops? +\nstoring values", 0.8);
    
    
    yield* waitUntil("addphysicalregfile");
    yield* all(
        ooo_reservation_station_labels[1].fontSize(40, 0.5),
        ooo_reservation_station_labels[1].y(4, 0.5),
        whatisstored().opacity(0, 0.8),
        ooo_stuff().restore(1.8),
    );
    yield chain(
        stage1_presenter().x(-550, 0.5),
        all(ooo_title().text("CPU Backend 4", 0.2), ooo_title().left(ooo_title().left(), 0.2)),
        stage1_presenter().x(-1200, 0.5),
    );
    
    const physical_reg_file = ooo_register_file.clone();
    const phyregfile_rob_wire = createRef<Line>();
    const cdb_phyregfile_wire = createRef<Line>();
    ooo_blocks().add(physical_reg_file);
    // ooo_cdb().points([[550+250, functional_units[0].right().y-5], [550+250, 375], [ooo_uop_queue.right().x, 375], ooo_uop_queue.right()], 0.5);
    yield* all(
        ooo_register_file.y(ooo_register_file.y() - 150, 0.5),
        ooo_regfile_uop_queue_wire().y(ooo_regfile_uop_queue_wire().y() - 150, 0.5),
        ooo_rob_regfile_wire().y(ooo_rob_regfile_wire().y() - 150, 0.5),
        physical_reg_file.y(physical_reg_file.y() + 150, 0.5),
        physical_reg_file.childAs<Txt>(0).text("Physical Regfile", 0.5),
        physical_reg_file.childAs<Txt>(0).scale(0.9, 0.5),
    );
    yield* sequence(0.1,
        ...[2,3].map(i => all(
            physical_reg_file.childAs<Node>(i).rotation(90, 0.5),
            physical_reg_file.childAs<Node>(i).scale(0, 0.5),
        ))
    );
    [2,3].forEach(i => physical_reg_file.childAs<Node>(i).remove());
    yield* all(
        physical_reg_file.size([275, 300], 0.5),
        physical_reg_file.x(physical_reg_file.x() + 55, 0.5),
        physical_reg_file.childAs<Txt>(0).x(physical_reg_file.childAs<Txt>(0).x() + 60, 0.5),
        physical_reg_file.childAs<Layout>(1).x(physical_reg_file.childAs<Layout>(1).x() + 75, 0.5),
    )

    ooo_wires().add(<>
        <Line ref={cdb_phyregfile_wire}
            points={[[ooo_uop_queue.right().x, 375], [physical_reg_file.bottom().x, 375], physical_reg_file.bottom()]}
            lineWidth={10} stroke={"#bf5dd6"}
            end={0}
            endArrow arrowSize={15}
        >
        </Line>
        <Line ref={phyregfile_rob_wire}
            points={[physical_reg_file.right(), [ooo_uop_queue.bottom().x, physical_reg_file.right().y]]}
            lineWidth={10} stroke={"#bf5dd6"}
            end={0}
            endArrow arrowSize={15}
        >
        </Line>
    </>);
    ooo_stuff().save();
    yield* all(
        ooo_stuff().scale(3.2, 1.2),
        ooo_stuff().position([1500, -300], 1.2),
    );
    yield* waitFor(4);
    const regvals = [ "0", "1", "...", "512" ];
    yield* sequence(0.1,
        ...physical_reg_file.childAs<Layout>(1).childrenAs<Rect>().map((t, i) => t.childAs<Txt>(0).text(regvals[i], 0.5))
    );
    yield* waitFor(2);
    yield* ooo_stuff().restore(1.2);
    yield* sequence(0.1,
        cdb_phyregfile_wire().end(1, 0.5),
        phyregfile_rob_wire().end(1, 0.5),
    );

    yield* waitUntil("rename_step");
    const rename_block = createRef<Rect>(); const rename_block_label = createRef<Txt>();
    const rename_uop_queue_wire = createRef<Line>();
    ooo_blocks().add(<>
        <Rect ref={rename_block}
            fill={"#4e2b4d"}
            position={[-558, -300]}
            scale={0} rotation={90}
            size={[200, 65]}
            lineWidth={4}
            stroke={"#ff6f91"}
        >
            <RoboticText
                ref={rename_block_label} y={4}
                fill={"#ff6f91"}
                fontSize={40} fontStyle={""}
                text={"Rename"}
            />
        </Rect>
    </>);
    yield* sequence(0.1,
        all(
            ooo_decoder_to_uop_queue_wire().x(ooo_decoder_to_uop_queue_wire().x() - 358, 0.5),
            ooo_decoder_to_uop_queue_wire().y(ooo_decoder_to_uop_queue_wire().y() - 25, 0.5),
        ),
        all(
            ooo_decoder_to_uop_queue_wire_label().x(ooo_decoder_to_uop_queue_wire_label().x() - 358, 0.5),
            ooo_decoder_to_uop_queue_wire_label().y(ooo_decoder_to_uop_queue_wire_label().y() - 25, 0.5),
        ),
        all(
            rename_block().rotation(0, 0.5),
            rename_block().scale(1, 0.5),
        )
    );
    ooo_wires().add(<>
        <Line ref={rename_uop_queue_wire}
            points={[rename_block().right(), [ooo_uop_queue.bottom().x, rename_block().right().y]]}
            lineWidth={10} stroke={"#ff6f91"}
            end={0}
            endArrow arrowSize={15}
        >
        </Line>
    </>);
    yield* waitFor(4);
    yield* rename_uop_queue_wire().end(1, 0.5);
    
    yield* waitUntil("regfileindexes");
    yield* sequence(0.1,
        ...ooo_register_file.childAs<Layout>(1).childrenAs<Rect>().map((t, i) => all(
            t.childAs<Txt>(0).scale(2, 0.8, easeOutCirc).back(0.8, easeInCirc),
            t.childAs<Txt>(0).fill("yellow", 0.8, easeOutCirc).back(0.8, easeInCirc),
        ))
    )
    yield* sequence(0.1,
        ...physical_reg_file.childAs<Layout>(1).childrenAs<Rect>().map((t, i) => all(
            t.childAs<Txt>(0).scale(2, 0.8, easeOutCirc).back(0.8, easeInCirc),
            t.childAs<Txt>(0).fill("yellow", 0.8, easeOutCirc).back(0.8, easeInCirc),
        ))
    );

    yield* waitUntil("simplifyresv");
    yield* sequence(0.1,
        ...ooo_reservation_stations.map(t => all(
            t.scale(2, 0.8).back(0.8),
            t.stroke("yellow", 0.8).back(0.8),
            t.fill("#4e4b2b", 0.8).back(0.8),
            t.childAs<Txt>(0).text("SCH", 0.8),
            t.childAs<Txt>(0).fill("yellow", 0.8).back(0.8),
            wiggle(t.rotation, -5, 5, 1.6),
        ))
    );

    yield* waitUntil("indicesagain")
    yield* sequence(0.1,
        ...physical_reg_file.childAs<Layout>(1).childrenAs<Rect>().map((t, i) => all(
            t.childAs<Txt>(0).scale(2, 0.8, easeOutCirc).back(0.8, easeInCirc),
            t.childAs<Txt>(0).fill("yellow", 0.8, easeOutCirc).back(0.8, easeInCirc),
        ))
    );

    yield* waitUntil("derived");
    yield* ooo_stuff().x(2000, 1.2);
    ooo_decoder_to_uop_queue_wire_label().remove();
    register_file().scale(0); control_buffer().scale(0); dcache().scale(0);
    flags_ctrl_data_wire().scale(0); regfile_control_buffer_data_wire().scale(0);

    yield* computer_stuff().x(0, 1.2);
    yield* all(
        control_unit().x(control_unit().x() - 200, 0.5),
        control_unit().y(control_unit().y() - 155, 0.5),
        ir().x(ir().x() + 40, 0.5),
    )
    yield* all(
        ir_ctrl_data_wire().points([ir().top(), control_unit().bottom()], 0.5),
        control_unit_buffer_data_wire().end(0, 0.5),
        prefetch_ir_data_wire().points([[-386-30, -281], [-306+10, -281]], 0.5),
    );
    yield* all(
        internals().x(internals().x(), 0.5),
        internals().y(internals().y() - 60, 0.5),
        internals().scale(internals().scale().sub(0.05), 0.5),
    );
    

    
    ooo_register_file.x(ooo_register_file.x() + 100);
    ooo_rob_regfile_wire().x(ooo_rob_regfile_wire().x() + 100)
    physical_reg_file.x(physical_reg_file.x() + 100);
    cdb_phyregfile_wire().points([[ooo_uop_queue.right().x, 375], [physical_reg_file.bottom().x, 375], physical_reg_file.bottom()])
    rename_block().x(rename_block().x() + 315).y(rename_block().y() - 155)
    ooo_decoder_to_uop_queue_wire().points([[-120, -430], [15, -430]]);
    rename_uop_queue_wire().points([rename_block().bottom(), [rename_block().bottom().x, ooo_uop_queue.left().y]]);
    const THEBIGONE = ooo_internals().clone();
    // THEBIGONE.scale(0.8).x(125).y(-20);
    THEBIGONE.x(2000);

    view.add(THEBIGONE);
    yield* all(
        THEBIGONE.scale(0.8, 1.2),
        THEBIGONE.x(125, 1.2),
        THEBIGONE.y(-20, 1.2),
    );

    yield* waitUntil("end");
    yield* all(
        computer_stuff().x(-2000, 1.2),
        THEBIGONE.x(THEBIGONE.x()-2000, 1.2),
    )
});