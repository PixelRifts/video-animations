import { Circle, Curve, Gradient, Layout, Line, makeScene2D, Node, QuadBezier, Rect, Txt } from "@motion-canvas/2d";
import { all, cancel, chain, Color, createEaseOutBack, createRef, createRefArray, createSignal, Direction, easeInOutQuint, easeOutBack, linear, loopFor, PossibleVector2, range, sequence, SignalValue, SimpleSignal, slideTransition, Vector2, waitFor, waitUntil } from "@motion-canvas/core";
import { RoboticText, ThinRoboticText } from "../../components/defaults";
import { cosmic_grad_ramps, cosmic_analogues } from "../../components/palette";

export default makeScene2D(function* (view) {
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
    const pc = createRef<Rect>();           const pc_label = createRef<Txt>();
    const ir = createRef<Rect>();           const ir_label = createRef<Txt>();
    const mdr = createRef<Rect>();          const mdr_label = createRef<Txt>();
    const mar = createRef<Rect>();          const mar_label = createRef<Txt>();
    const ram = createRef<Rect>();          const ram_label = createRef<Txt>();
    const alu = createRef<Line>();          const alu_label = createRef<Txt>();
    const temp_y = createRef<Line>();       const temp_y_label = createRef<Txt>();
    const temp_z = createRef<Line>();       const temp_z_label = createRef<Txt>();
    const flags = createRef<Line>();        const flags_label = createRef<Txt>();
    
    const register_file = createRef<Rect>();
    const register_file_label = createRef<Txt>();
    const simple_register_container = createRef<Layout>();
    const simple_registers = createRefArray<Rect>();
    const simple_register_labels = createRefArray<Txt>();

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

    const time_loop = yield loopFor(Infinity, function* () {
        yield* time(time() + 10, 10, linear);
    })
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
        <Node>
            {range(10).map(i => <Line ref={control_cbus_wires}
                points={[[-150, -198], [-150, 18]]} x={((8-1) * -5) + i * 10}
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
            points={[[329, -295], [(329+251)/2, -295], [(329+251)/2, -331], [251, -331]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15}
        >
        </Line>
        <Line ref={alu_temp_z_data_wire}
            points={[[329, -260], [(329+251)/2, -260], [(329+251)/2, -231], [251, -231]]}
            lineWidth={10} stroke={"#ae56c5"}
            endArrow arrowSize={15}
        >
        </Line>
        <Line ref={flags_ctrl_data_wire}
            points={[[119, -331], [16, -331]]}
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
    
    yield* waitUntil("bringitback");
    yield* all(
        computer().x(0, 1.2),
        computer_panel_highlight_in().x(0, 1.2),
        computer_panel_highlight_out().x(0, 1.2),
    );


    const simple_clock = function*(pulse: Rect, pulse2: Rect, sig: SimpleSignal<number, void>, time: number) {
        yield* all(
            sig(1, 0.0344 * time, linear).wait(0.137931034 * time).to(0, 0.137931034 * time, linear).wait(0.689655172 * time),
            chain(
                all(pulse.size(clock().size(), 0.0), pulse2.size(clock().size(), 0.0)),
                all(pulse.radius(0, 0.0), pulse2.radius(0, 0.0)),

                all(pulse.opacity(1, 0.01), pulse2.opacity(1, 0.01)),
                all(
                    all(pulse.size(clock().size().add(30), 0.24137931 * time), pulse2.size(clock().size().add(30), 0.24137931 * time)),
                    all(pulse.radius(20, 0.24137931 * time), pulse2.radius(20, 0.24137931 * time)),
                    all(pulse.opacity(0, 0.6 * time), pulse2.opacity(0, 0.6 * time)),
                ),
            ),
        )
    }
    const clock_speed = createSignal(1);
    const clock_parent_1 = createRef<Node>();
    const clock_clone_1 = createRef<Rect>(); const clock_txt_clone_1 = createRef<Txt>();
    const clock_pulse_clone_1 = createRef<Rect>();
    const clock_clone_2 = createRef<Rect>(); const clock_txt_clone_2 = createRef<Txt>();
    const clock_pulse_clone_2 = createRef<Rect>();
    const wipe_rect = createRef<Rect>();
    const circle_mask = createRef<Circle>();
    const topic_name = createRef<Txt>();
    const circle_cover = createRef<Circle>();
    view.add(<>
        <Circle ref={circle_mask}
            position={[-900, 454]}
            clip// size={300}
        >
            <RoboticText ref={topic_name}
                fill={"#ff90b6"}
                fontSize={120} fontStyle={""}
                text={"#1 CLOCK SPEED"}
                x={300}
            />
        </Circle>
        <Circle ref={circle_cover}
            position={[-900, 454]}
            fill={"#1d1a36"} //size={300}
        />
        <Node ref={clock_parent_1}
            position={[-472, -331-35]}
        >

            <Rect ref={clock_clone_1}
                fill={"#4e2b4d"}
                size={[130, 65]}
                lineWidth={4}
                stroke={() => Color.lerp("#c2566e", "#FFFFFF", slow_clock_sig())}
            >
                <RoboticText
                    ref={clock_txt_clone_1} y={4}
                    fill={() => Color.lerp("#c2566e", "#D58AA2", slow_clock_sig())}
                    fontSize={50} fontStyle={""}
                    text={"CLK"}
                    
                />
            </Rect>
            <Rect ref={clock_pulse_clone_1}
                fill={"#4e2b4d"}
                lineWidth={2} zIndex={-1}
                stroke={"#FFFFFF"}>
            </Rect>
            
            <Rect ref={wipe_rect}
                // rotation={45}
                clip>
                <Rect ref={clock_clone_2}
                    fill={"#492b61"}
                    size={[130, 65]}
                    lineWidth={4}
                    stroke={() => Color.lerp("#ae56c5", "#FFFFFF", slow_clock_sig())}
                >
                    <RoboticText
                        ref={clock_txt_clone_2} y={4}
                        fill={() => Color.lerp("#ae56c5", "#d28fe3", slow_clock_sig())}
                        fontSize={50} fontStyle={""}
                        text={"CLK"}
                        
                    />
                </Rect>
                <Rect ref={clock_pulse_clone_2}
                    fill={"#4e2b4d"}
                    lineWidth={2} zIndex={-1}
                    stroke={"#FFFFFF"}>
                </Rect>
            </Rect>
        </Node>
    </>);

    const slow_clock_sig = createSignal(0);
    let slow_clock_loop = yield loopFor(Infinity, function* () { yield* simple_clock(clock_pulse_clone_1(), clock_pulse_clone_2(), slow_clock_sig, clock_speed()); });
    
    yield* all(
        sequence(0.1,
            clock_parent_1().scale(3, 0.8, createEaseOutBack(3)),
            clock_parent_1().position([0, 0], 0.8),
        ),
        computer().x(-2000, 1.2),
        computer_panel_highlight_in().x(-2000, 1.2),
        computer_panel_highlight_out().x(-2000, 1.2),
    );
    yield* circle_mask().size(1800, 0.8);
    yield* circle_cover().size(1800, 0.8);
    yield* all(circle_mask().size(0, 0), circle_cover().size(0, 0));

    yield* waitUntil("speedup");
    yield* clock_speed(0.9, 0.8);

    yield* waitUntil("first_barrier");

    const problems_parent = createRef<Node>();
    const heat_title = createRef<Layout>();
    const heat_numeric = createRef<Layout>();
    const heat_numeric_parts = createRefArray<Txt>();
    const heat_txt = createRef<Layout>();
    const heat_txt_parts = createRefArray<Txt>();

    const time_title = createRef<Layout>();
    const time_numeric = createRef<Layout>();
    const time_numeric_parts = createRefArray<Txt>();
    const time_txt = createRef<Layout>();
    const time_txt_parts = createRefArray<Txt>();

    view.add(<>
        <Node ref={problems_parent}>
            <Layout ref={heat_title}
                position={[-1510, -388]}
                layout direction={"row"}
                gap={70}
            >
                <Layout ref={heat_numeric}
                    layout direction={"row"}
                    // gap={100}
                >
                    {..."#1".split('').map((t, i) => <RoboticText ref={heat_numeric_parts}
                        fontSize={250}
                        text={t}
                        fill={cosmic_analogues[1][1] + "55"}
                    />)}
                </Layout>
                <Layout ref={heat_txt}
                    layout direction={"row"}
                    // gap={100}
                >
                    {..."HEAT".split('').map((t, i) => <RoboticText ref={heat_txt_parts}
                        fontSize={250}
                        text={t}
                        fill={cosmic_analogues[1][1] + "ff"}
                    />)}
                </Layout>
            </Layout>
            <Layout ref={time_title}
                position={[1510, 388]} rotation={180}
                layout direction={"row"}
                gap={70}
            >
                <Layout ref={time_numeric}
                    layout direction={"row"}
                    // gap={100}
                >
                    {..."#2".split('').map((t, i) => <RoboticText ref={time_numeric_parts}
                        fontSize={250}
                        text={t}
                        fill={cosmic_analogues[1][0] + "55"}
                    />)}
                </Layout>
                <Layout ref={time_txt}
                    layout direction={"row"}
                    // gap={100}
                >
                    {..."TIME".split('').map((t, i) => <RoboticText ref={time_txt_parts}
                        fontSize={250}
                        text={t}
                        fill={cosmic_analogues[1][0] + "ff"}
                    />)}
                </Layout>
            </Layout>
        </Node>
    </>);

    const power_line_parent = createRef<Node>();
    const power_lines = createRefArray<Line>();
    const power_points: PossibleVector2[][] = [
        [[-666, 611], [-155, 400], [-155, 103]],
        [[ 666, 611], [ 155, 400], [ 155, 103]],
    ]
    const powerdraw = createSignal(100);
    view.add(<>
        <Node ref={power_line_parent}>
            {...power_points.map((t, i) => <Line ref={power_lines}
                points={t}
                lineWidth={40}
                lineDash={[100, 100]}
                lineDashOffset={() => time() * powerdraw() * Math.pow(-1, i+1)}
                radius={40}
                stroke={new Gradient({
                    type: "linear",
                    from: t[0],
                    to:   t[2],
                    stops: [
                        { offset: 0, color: "#c2566e" },
                        { offset: 0.6, color: "#c2566e" },
                        { offset: 1, color: () => Color.lerp("#c2566e", "#D58AA2", slow_clock_sig()) },
                    ]
                })}
                end={0}
            >
            </Line>)}
        </Node>
    </>);

    clock_clone_1().stroke(() => Color.lerp("#c2566e", "#D58AA2", slow_clock_sig()))
    clock_txt_clone_1().stroke(() => Color.lerp("#c2566e", "#D58AA2", slow_clock_sig()))
    clock_pulse_clone_1().stroke("#D58AA2")
    
    clock_clone_2().stroke(() => Color.lerp("#ae56c5", "#d28fe3", slow_clock_sig()))
    clock_txt_clone_2().stroke(() => Color.lerp("#ae56c5", "#d28fe3", slow_clock_sig()))
    clock_pulse_clone_2().stroke("#d28fe3")

    yield* sequence(0.1,
        heat_title().x(-640, 0.8),
        ...power_lines.map(t => t.end(1, 0.6)),
    );

    yield* waitUntil("power_draw");
    yield* clock_speed(0.5, 1);

    yield* all(
        powerdraw(500, 0.8),
        ...power_lines.map(t => all(
            t.lineWidth(60, 0.5),
        )),
    );

    yield* waitUntil("FIRE");
    
    const wave_signal = createSignal(() => time() * 4);
    const fire = createRefArray<Line>();
    const fire_count = 8;

    const fire_points: SignalValue<SignalValue<PossibleVector2>[]>[] = [];
    for (let i = 0; i < fire_count; i++) {
        const start = new Vector2(new Vector2(100, 0).rotate(i * -(180 / (fire_count-1))).x, 0);
        const end   = new Vector2(300, 0).rotate(i * -(180 / (fire_count-1)));
        fire_points[i] = () => [
            start,
            Vector2.lerp(start, end, 0.25).add(Vector2.lerp(start, end, 0.25).perpendicular.normalized.scale(Math.sin(wave_signal()        + (i * 0.25)) * 25)),
            Vector2.lerp(start, end, 0.50).add(Vector2.lerp(start, end, 0.50).perpendicular.normalized.scale(Math.sin(wave_signal() + 0.25 + (i * 0.25)) * 50)),
            Vector2.lerp(start, end, 0.75).add(Vector2.lerp(start, end, 0.75).perpendicular.normalized.scale(Math.sin(wave_signal() + 0.5  + (i * 0.25)) * 25)),
            end.add(end.perpendicular.normalized.scale(Math.sin(wave_signal()) * -20))
        ];
    }
    view.add(<>
        {...range(fire_count).map(i => <Line ref={fire}
            points={fire_points[i]} zIndex={-1}
            lineWidth={40} stroke={"#d58aa2"}
            lineCap={"round"}
            radius={10} shadowBlur={60} shadowColor={"#F2869e"}
            end={0}
        >
        </Line>)}
    </>);
    clock_clone_1().shadowColor("#F2869e");
    
    const radiation_loop = yield loopFor(Infinity, function*() {
        yield* all(
            ...fire.map(t => all(
                sequence(0.3,
                    t.end(1, 0.8, linear),
                    t.start(1, 0.8, linear),
                ),
                chain(
                    waitFor(0.8),
                    t.opacity(0, 0.2, linear),
                )
            )),
            clock_clone_1().shadowBlur(60, 0.8).to(0, 0.2),
        );
            
        fire.forEach(t => {
            t.end(0).start(0).opacity(1);
        })
    });

    yield* waitUntil("second_barrier");
    cancel(radiation_loop);
    fire.forEach(t => { t.remove(); t.dispose() })
    yield* sequence(0.1,
        ...power_lines.map(t => t.end(0, 1.2)),
        clock_speed(1, 2),
    );
    yield* sequence(1,
        time_title().x(640, 0.8),
        all(
            wipe_rect().size(400, 0.6),
            chain(
                problems_parent().rotation(-30,  0.2, easeInOutQuint),
                problems_parent().rotation(-60,  0.2, easeInOutQuint),
                problems_parent().rotation(-90,  0.2, easeInOutQuint),
                problems_parent().rotation(-120, 0.2, easeInOutQuint),
                problems_parent().rotation(-150, 0.2, easeInOutQuint),
                problems_parent().rotation(-180, 0.2, easeInOutQuint),
            ),
        )
    );
    cancel(slow_clock_loop);
    yield* heat_title().x(-1440, 0.8);
    
    yield* waitUntil("logic_yk");

    yield* sequence(0.1,
        clock_parent_1().x( 633, 0.8),
        clock_parent_1().y(-380, 0.8),
    );

    const logic_stuff = createRef<Node>();
    const logic_and = createRef<Node>();
    const logic_or = createRef<Node>();
    const logic_xor = createRef<Node>();
    const animatable_lines = createRefArray<Curve>();
    const note0 = createRef<Txt>();
    view.add(<Node ref={logic_stuff} x={175} scale={1.4}>
        <Line ref={animatable_lines} position={[-200, 0]}
            points={[[-200, -30], [-50, -30]]}
            lineWidth={10} stroke={"#52306a"}
            end={0} opacity={0}
        />
        <Line ref={animatable_lines} position={[-200, 0]}
            points={[[-200, 30], [-50, 30]]}
            lineWidth={10} stroke={"#52306a"}
            end={0} opacity={0}
        />
        <Line ref={animatable_lines} position={[-200, 0]}
            points={[[-200, 170], [-55, 170]]}
            lineWidth={10} stroke={"#52306a"}
            end={0} opacity={0}
        />
        <Line ref={animatable_lines} position={[-200, 0]}
            points={[[-200, 230], [-55, 230]]}
            lineWidth={10} stroke={"#52306a"}
            end={0} opacity={0}
        />
        <Line ref={animatable_lines} position={[-200, 0]}
            points={[[50, 0], [125, 0], [125, 80], [220, 80]]}
            lineWidth={10} stroke={"#52306a"}
            end={0} opacity={0}
        />
        <Line ref={animatable_lines} position={[-200, 0]}
            points={[[50, 200-0], [125, 200-0], [125, 200-80], [220, 200-80]]}
            lineWidth={10} stroke={"#52306a"}
            end={0} opacity={0}
        />
        <Line ref={animatable_lines} position={[50, 100]}
            points={[[50, 0], [150, 0]]}
            lineWidth={10} stroke={"#52306a"}
            end={0} opacity={0}
        />
        <Node ref={logic_and} position={[-200, 0]}>
            <Line ref={animatable_lines}
                points={[[-50, -50], [-50, 50]]}
                lineWidth={10} stroke={"#bf5dd6"}
                end={0} opacity={0}
            />
            <QuadBezier ref={animatable_lines}
                p0={[-50, -50]}
                p1={[ 50, -50]}
                p2={[ 50,   0]} lineCap={"round"}
                lineWidth={10} stroke={"#bf5dd6"}
                end={0} opacity={0}
            />
            <QuadBezier ref={animatable_lines}
                p0={[-50, 50]}
                p1={[ 50, 50]}
                p2={[ 50,  0]} lineCap={"round"}
                lineWidth={10} stroke={"#bf5dd6"}
                end={0} opacity={0}
            />
        </Node>
        <Node ref={logic_or} position={[50, 100]}>
            <QuadBezier ref={animatable_lines}
                p0={[-50, -50]}
                p1={[0, 0]}
                p2={[-50,  50]}
                lineWidth={10} stroke={"#bf5dd6"}
                end={0} opacity={0}
            />
            <QuadBezier ref={animatable_lines}
                p0={[-50, -50]}
                p1={[ 50, -50]}
                p2={[ 50,   0]} lineCap={"round"}
                lineWidth={10} stroke={"#bf5dd6"}
                end={0} opacity={0}
            />
            <QuadBezier ref={animatable_lines}
                p0={[-50, 50]}
                p1={[ 50, 50]}
                p2={[ 50,  0]} lineCap={"round"}
                lineWidth={10} stroke={"#bf5dd6"}
                end={0} opacity={0}
            />
        </Node>
        <Node ref={logic_xor} position={[-200, 200]}>
            <QuadBezier ref={animatable_lines}
                p0={[-50, -50]}
                p1={[0, 0]}
                p2={[-50,  50]}
                lineWidth={10} stroke={"#bf5dd6"}
                end={0} opacity={0}
            />
            <QuadBezier ref={animatable_lines}
                p0={[-25+-50, -50]}
                p1={[-25+0, 0]}
                p2={[-25+-50,  50]} lineCap={"round"}
                lineWidth={10} stroke={"#bf5dd6"}
                end={0} opacity={0}
            />
            <QuadBezier ref={animatable_lines}
                p0={[-50, -50]}
                p1={[ 50, -50]}
                p2={[ 50,   0]} lineCap={"round"}
                lineWidth={10} stroke={"#bf5dd6"}
                end={0} opacity={0}
            />
            <QuadBezier ref={animatable_lines}
                p0={[-50, 50]}
                p1={[ 50, 50]}
                p2={[ 50,  0]} lineCap={"round"}
                lineWidth={10} stroke={"#bf5dd6"}
                end={0} opacity={0}
            />
        </Node>
    </Node>);
    view.add(<>
        <RoboticText ref={note0}
            fontSize={60}
            position={[0, 600]}
            fill={cosmic_analogues[1][1]}
            text={"exaggerated for effect"}
        />
    </>)

    yield* sequence(0.05,
        ...animatable_lines.map(t => all(t.opacity(1, 0.1), t.end(1, 0.5))),
    );

    yield* waitUntil("show_delay");
    yield* sequence(0.5,
        all(
            animatable_lines[0].stroke("#bf5dd6", 0.3),
            animatable_lines[1].stroke("#bf5dd6", 0.3),
            animatable_lines[2].stroke("#bf5dd6", 0.3),
            animatable_lines[3].stroke("#bf5dd6", 0.3),
        ),
        
        all(
            animatable_lines[4].stroke("#bf5dd6", 0.3),
        ),
        all(
            animatable_lines[6].stroke("#bf5dd6", 0.3),
        ),
    );

    yield* note0().y(500, 0.8).wait(1);
    yield* all(
        note0().y(1000, 0.8),
        ...animatable_lines.slice(1).map(t => t.y(t.y() + 500, 0.8))
    );
    animatable_lines.slice(1).forEach(t => { t.remove(); t.dispose(); })
    yield* all(
        animatable_lines().scale(2, 0.9),
        clock_parent_1().position([-623, 50], 0.8),
        clock_parent_1().scale(2.5, 0.8),
        clock_speed(2.4, 0.3),
        animatable_lines().position([-50, 100], 0.8),
    );
    animatable_lines().stroke(() => Color.lerp("#ae56c5", "#d28fe3", slow_clock_sig()))
    
    const graphparent = createRef<Node>();
    const thegraph = createRefArray<Line>();
    const thegraphlabels = createRefArray<Txt>();
    const themainline = createRef<Line>();
    const thegraphranges = createRefArray<Line>();
    const propagationdelay = createRef<Txt>();
    view.add(<Node ref={graphparent} x={400}>
        <Line ref={thegraph}
            points={[[-200, 205], [-200, -200]]}
            lineWidth={10} endArrow arrowSize={20}
            stroke={"#ae56c5"} end={0}
        />
        <Line ref={thegraph}
            points={[[-205, 200], [500, 200]]}
            lineWidth={10} endArrow arrowSize={20}
            stroke={"#ae56c5"} end={0}
        />
        <Line ref={themainline}
            points={[[-205, 200], [-100, 200], [-50, -100], [230, -100], [280, 200], [460, 200]].map(t => [t[0]+10, t[1]-10])}
            lineWidth={5}
            stroke={"#52306a"} end={0}
        />
        <RoboticText ref={thegraphlabels}
            position={[-250, -100]}
            fill={"#ae56c5"}
            fontSize={60} scale={0}
            text={"1"}
        />
        <RoboticText ref={thegraphlabels}
            position={[-250, 200]}
            fill={"#ae56c5"}
            fontSize={60} scale={0}
            text={"0"}
        />

        <Line ref={thegraphranges}
            points={[[-90, 220], [-40, 220], ]}
            lineWidth={5}
            stroke={"#ae56c5"} end={0}
        />
        <Line ref={thegraphranges}
            points={[[-90, 220-10], [-90, 220+10], ]}
            lineWidth={5}
            stroke={"#ae56c5"} end={0}
        />
        <Line ref={thegraphranges}
            points={[[-40, 220-10], [-40, 220+10], ]}
            lineWidth={5}
            stroke={"#ae56c5"} end={0}
        />
        <Line ref={thegraphranges}
            points={[[240, 220], [290, 220], ]}
            lineWidth={5}
            stroke={"#ae56c5"} end={0}
        />
        <Line ref={thegraphranges}
            points={[[240, 220-10], [240, 220+10], ]}
            lineWidth={5}
            stroke={"#ae56c5"} end={0}
        />
        <Line ref={thegraphranges}
            points={[[290, 220-10], [290, 220+10], ]}
            lineWidth={5}
            stroke={"#ae56c5"} end={0}
        />
        <RoboticText ref={propagationdelay}
            position={[90, 300]}
            fill={"#ae56c5AA"}
            fontSize={60}
            // text={"Propagation Delay"}
        />
    </Node>);

    yield* sequence(0.05,
        ...thegraph.map(t => t.end(1, 0.8)),
        ...thegraphlabels.map(t => t.scale(1, 0.8))
    );

    yield* sequence(1,
        all(
            simple_clock(clock_pulse_clone_1(), clock_pulse_clone_2(), slow_clock_sig, clock_speed()),
            themainline().end(1, 0.7, linear),
        ),
        sequence(0.05,
            ...thegraphranges.map(t => t.end(1, 0.3)),
            propagationdelay().text("Propagation Delay", 0.8),
        ),
    );

    yield* waitUntil("end");
})