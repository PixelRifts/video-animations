import { Gradient, Layout, Line, makeScene2D, Node, PossibleCanvasStyle, Rect, Txt } from "@motion-canvas/2d";
import { all, chain, Color, createEaseOutBack, createRef, createRefArray, createSignal, Direction, easeInBack, easeInOutBack, easeInSine, easeOutBack, easeOutSine, linear, loopFor, PossibleVector2, range, Reference, ReferenceArray, sequence, slideTransition, waitFor, waitUntil } from "@motion-canvas/core";
import { RoboticText, ThinRoboticText } from "../../components/defaults";
import { cosmic_grad_ramps, cosmic_analogues } from "../../components/palette";


export default makeScene2D(function* (view) {
    yield* slideTransition(Direction.Top);

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
    </>);

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
    const register_file_clone = createRef<Rect>();
    const register_file_label_clone = createRef<Txt>();
    const simple_register_container_clone = createRef<Layout>();
    const simple_registers_clone = createRefArray<Rect>();
    const simple_register_labels_clone = createRefArray<Txt>();

    const ram_clone = createRef<Rect>();          const ram_label_clone = createRef<Txt>();

    view.add(<>
        <Rect ref={register_file_clone}
            fill={"#492b61"}
            position={[400, 300 - 35]}
            size={[250, 300]}
            lineWidth={4}
            stroke={"#ae56c5"}
        >
            <RoboticText ref={register_file_label_clone}
                x={-80}
                fill={cosmic_analogues[1][0]}
                fontSize={50} rotation={-90}
                text={"Register File"}
            />
            <Layout ref={simple_register_container_clone}
                direction={"column"}
                x={40}
            >
                {range(8).reverse().map(i => <Rect ref={simple_registers_clone}
                    fill={"#492b61"}
                    size={[130, 65]}
                    lineWidth={4} y={-100+(i%4)*65}
                    stroke={"#ae56c5"} clip
                >
                    <RoboticText ref={simple_register_labels_clone}
                        y={4}
                        fill={cosmic_analogues[1][0]}
                        fontSize={50} fontStyle={""}
                        text={i < 4 ? "R" + i : ""}
                    />
                </Rect>)}
            </Layout>
        </Rect>
        
        <Rect ref={ram_clone}
            fill={"#532d5a"} zIndex={2}
            position={[-1450, -240]}
            size={[130, 185]}
            lineWidth={4} scale={2}
            stroke={"#c457a5"} clip
        >
            <RoboticText
                ref={ram_label_clone} y={4}
                fill={cosmic_grad_ramps[1][0]}
                fontSize={50} fontStyle={""}
                text={"RAM"}
            />
        </Rect>
    </>);
    yield* all(
        sequence(0.1,
            register_file_clone().scale(2, 0.8, createEaseOutBack(3)),
            register_file_clone().position([0, 0], 0.8),
        ),
        computer().x(-2000, 1.2),
        computer_panel_highlight_in().x(-2000, 1.2),
        computer_panel_highlight_out().x(-2000, 1.2),
    );

    yield* waitUntil("expand_regs");
    yield* sequence(0.8,
        all(
            register_file_clone().size([380, 300], 0.8),
            register_file_label_clone().x(-150, 0.8),
        ),
        sequence(0.1,
            ...range(4).map(i => all(
                simple_registers_clone[i].x(simple_registers_clone[i].x() + 65, 0.5, easeOutBack),
                simple_registers_clone[4+i].x(simple_registers_clone[4+i].x() - 65, 0.5, easeOutBack),
                simple_register_labels_clone[i].text("R"+(7-i), 1.2),
            ))
        )
    );
    simple_registers_clone.slice(0, 4).map(t => t.zIndex(1));

    yield* waitUntil("algo_example");
    yield* sequence(0.1,
        register_file_clone().scale(1.4, 0.8),
        register_file_clone().x(-450, 0.8)
    );
    
    const algo_txt = createRef<Node>();
    const algo_parts = createRefArray<Txt>();
    const algo_txt_mk2 = createRef<Node>();
    const algo_parts_mk2 = createRefArray<Txt>();

    const algo_part_strs   = ["algo", "(", "a", ",", "b", ",", "c", ",", "d", ",", "e", ",", "f", ")", ];
    const algo_part_colors = ["#ae56c5", "#61367a", "#ae56c5", "#61367a", "#ae56c5", "#61367a", "#ae56c5", "#61367a", "#ae56c5", "#61367a", "#ae56c5", "#61367a", "#ae56c5", "#61367a"];
    let m = 0;
    let k = 0;
    view.add(<Node ref={algo_txt}>
        {...algo_part_strs.map((t, i) => <RoboticText ref={algo_parts}
            x={(k = m, m += Math.max(t.length * 30, 50), k)}
            fill={algo_part_colors[i]}
            fontSize={100}
        />)}
    </Node>)
    k = m = 0;
    view.add(<Node ref={algo_txt_mk2}>
        {...algo_part_strs.map((t, i) => <RoboticText ref={algo_parts_mk2}
            x={(k = m, m += Math.max(t.length * 30, 50), k)}
            fill={algo_part_colors[i]}
            fontSize={100}
        />)}
    </Node>)

    yield* sequence(0.1,
        ...algo_parts.map((t, i) => all(
            t.text(algo_part_strs[i], 0.5),
            algo_parts_mk2[i].text(algo_part_strs[i], 0.5),
        )),
    );
    yield* sequence(0.1,
        ...simple_registers_clone.slice(0, 4).map((t, i) => t.stroke("#d42849", 0.4)),
        ...simple_register_labels_clone.slice(0, 4).map((t, i) => all(
            t.fill("#d42849", 0.4),
            t.text("L", 0.1).to("D", 0.1).to("X", 0.2),
        )),
    );
    const varrefs = []
    yield* sequence(0.05,
        ...simple_register_labels_clone.slice(4, 8).map((l, i) => sequence(0.5,
            l.x(100, 0.3).to(-100, 0),
            all(
                l.y(-15, 0),
                l.fontSize(30, 0),
            ),
            l.x(-45, 0.3),
            // simple_register_values[i].text("" + reg_inits[i], 0.3),
        )),
    );
    yield* waitUntil("regalloc");
    yield* sequence(0.1,
        ...[2, 4, 6, 8].map((i, k) => all(
            algo_parts    [i].fill(cosmic_grad_ramps[1][1], 0.8),
            algo_parts_mk2[i].fill(cosmic_grad_ramps[1][1], 0.8),
            algo_parts_mk2[i].position([-490, -131 + k * 90], 0.8),
        )),
        ...[10, 12].map((i, k) => all(
            algo_parts    [i].fill("#d65d74", 0.8),
            algo_parts_mk2[i].fill("#d65d74", 0.8),
            algo_parts_mk2[i].y(-200, 0.8)
        ))
    );
    yield* waitFor(0.5);
    yield* all(
        register_file_clone().y(200, 0.5),
        ...[2, 4, 6, 8].map((i, k) => all(
            algo_parts_mk2[i].y(algo_parts_mk2[i].y() + 200, 0.5),
        )),
    );
    yield* ram_clone().x(-450, 1.2);
    yield* sequence(0.4,
        ...[10, 12].map((i, k) => chain(
            algo_parts_mk2[i].x(-400, 0.8, easeInBack),
            all(
                ram_clone().rotation(((-1) ** k) * 15, 0.2, easeOutSine).to(0, 0.2, easeInSine),
                ram_clone().scale(2.2, 0.2, easeOutSine).to(2, 0.2, easeInSine),
            )
        ))
    );

    yield* waitUntil("issuewiththis");
    yield* sequence(0.05,
        ...algo_parts.reverse().map((t, i) => all(
            t.text("", 0.3),
            algo_parts_mk2[i].text("", 0.3),
        )),
        all(
            ram_clone().rotation(90, 0.3),
            ram_clone().size(0, 0.3),
        ),
        ...simple_register_labels_clone.slice(4, 8).map((l, i) => sequence(0.3,
            l.x(-100, 0.3).to(100, 0),
            all(
                l.y(4, 0),
                l.fontSize(50, 0),
            ),
            l.x(0, 0.3),
        )),
        ...simple_register_labels_clone.slice(0, 4).map((t, i) => sequence(0.1,
            simple_registers_clone[i].stroke(cosmic_analogues[1][0], 0.5),
            t.fill(cosmic_analogues[1][0], 0.5),
            t.text("R" + (7-i), 0.5),
        ))
    );
    yield* register_file_clone().y(0, 0.5);

    yield* waitUntil("isa_namedrop");
    const isa_lay = createRef<Layout>();
    const inner_layouts = createRefArray<Layout>();
    const inner_texts = [createRefArray<Txt>(),createRefArray<Txt>(),createRefArray<Txt>()];
    const text_strings = [ "Instruction", "Set", "Architecture" ];
    view.add(<Layout ref={isa_lay}
        x={400}
    >
        {...range(3).map(i => <Layout ref={inner_layouts}
            layout gap={4} x={i == 2 ? 18 : i == 0 ? 10 : 0}
            y={-120 + i * 120}
            direction={"row"}
        >
            {...text_strings[i].split("").map((c, k) => <RoboticText ref={inner_texts[i]}
                fontSize={160} fontStyle={""}
                fill={k == 0 ? "#ae56c5" : "#61367a"}
            />)}
        </Layout>)}
    </Layout>);

    yield* sequence(0.1,
        ...inner_texts.map((t, i) => t[0].text(text_strings[i][0], 0.2)),
    );
    yield* waitFor(1);
    yield* sequence(0.1,
        ...inner_texts.map((IT, i) => sequence(0.03,
            ...IT.map((t, j) => t.text(text_strings[i][j], 0.2)),
        )),
    );
    yield* waitFor(2);
    const x_locs = [-50, 0, 108]
    yield* sequence(0.1,
        register_file_clone().x(-2000, 0.8),
        ...inner_texts.map((IT, i) => sequence(0.03,
            ...IT.slice(1).map((t, j) => t.text("", 0.2)),
        )),
        ...inner_layouts.map((t, i) => t.position([x_locs[i],0], 0.5)),
        isa_lay().position([-465,10], 0.5),
    );
    const back_nodes = createRefArray<Node>();
    const back_rects = createRefArray<Rect>();
    const back_rect_out_highlights = createRefArray<Rect>();
    const back_positions: PossibleVector2[] = [ [-450,0] ];
    view.add(<>
        {...back_positions.map((t, i) => <Node ref={back_nodes}
            position={t}
            zIndex={-5}
        >
            <Rect ref={back_rects}
                // size={[150, 150]}
                fill={"#492b61"}
                // rotation={45}
            />
            <Rect ref={back_rect_out_highlights}
                // size={[160, 160]}
                stroke={"#ae56c5"}
                fill={"#1d1a36"}
                zIndex={-4}
                lineWidth={2}
                // rotation={45}
            />
        </Node>)}
    </>);
    yield* sequence(0.1,
        all(back_rect_out_highlights[0].size(200, 0.8), back_rect_out_highlights[0].rotation(45, 0.8)),
        all(back_rects[0].size(180, 0.8), back_rects[0].rotation(45, 0.8)),
    );
    const isabackloop = yield loopFor(Infinity, function* () {
        yield* all(
            back_rects[0].rotation(back_rects[0].rotation() + 360, 4),
            back_rect_out_highlights[0].rotation(back_rect_out_highlights[0].rotation() - 360, 4),
        )
    })

    yield* waitUntil("isa_lister");
    const lister_lines = createRefArray<Line>();
    const lister_strings = createRefArray<Txt>();
    
    const line_heights = [ -350, -175, 0, 175, 350 ];
    const listed_strs  = [ "Native Types", "Memory Model", "Registers", "Instructions", "Binary Encodings" ]
    view.add(<>
        {...line_heights.map((h, i) => <Node zIndex={-10}>
            <Line ref={lister_lines}
                points={[ [-465, 0], [-200, line_heights[i]], [100, line_heights[i]] ]}
                lineWidth={20} radius={10}
                lineDash={[100, 20]} lineDashOffset={() => -time() * 100}
                stroke={new Gradient({
                    type:  "linear",
                    from:  [-465, 0],
                    to:    [10, line_heights[i]],
                    stops: [
                        { offset: 0, color: cosmic_grad_ramps[0][0] },
                        { offset: 0.5, color: cosmic_grad_ramps[0][0] },
                        { offset: 1, color: cosmic_grad_ramps[0][1] },
                    ]
                })} end={0}
            />
            <RoboticText ref={lister_strings}
                offset={[-1, 0]} fontStyle={""}
                fontSize={100}
                position={[150, line_heights[i]]}
                fill={cosmic_grad_ramps[0][1]}
            />
        </Node>)}
    </>);
    yield* sequence(0.4,
        ...range(3).map(i => sequence(0.5,
            lister_lines[i].end(1, 0.8),
            lister_strings[i].text(listed_strs[i], 0.8),
        )),
    )
    yield* waitUntil("finalshout")
    yield* sequence(3,
        ...range(3, 5).map(i => sequence(0.5,
            lister_lines[i].end(1, 0.8),
            lister_strings[i].text(listed_strs[i], 0.8),
        )),
    );

    yield* waitUntil("unshow_lister");
    yield* sequence(0.1,
        ...range(5).map(i => sequence(0.5,
            lister_lines[i].start(1, 0.8),
            lister_strings[i].text("", 0.8),
        )),
    );
    
    yield* waitUntil("historymatters");
    const compat_matters = createRef<Txt>();
    view.add(<>
        <ThinRoboticText ref={compat_matters}
            x={300}
            // text={"Compatibility\nMatters"}
            fill={"#ae56c5"}
            fontStyle={""} fontSize={120}
        />
    </>);
    yield* compat_matters().text("Compatibility  Matters", 1.2);
    
    yield* waitUntil("x86example");
    yield* all(
        compat_matters().text("", 1.2),
        isa_lay().x(isa_lay().x() - 200, 0.8),
        back_nodes[0].x(back_nodes[0].x() - 200, 0.8),
    );

    const inc_reg_text = createRefArray<Txt>();
    const bin_inc_reg_texts = createRefArray<Txt>();
    const bin_texts_parent = createRef<Layout>();

    const inc_reg_strs =      [ "ax",   "bx",   "cx",   "dx",   "sp",   "bp",   "si",   "di"   ];
    const inc_reg_encodings = [ 0x6640, 0x6643, 0x6641, 0x6642, 0x6644, 0x6645, 0x6646, 0x6647 ];
    view.add(<>
        <Layout layout
            x={300} y={-100}
            gap={50}
        >
            <RoboticText ref={inc_reg_text}
                text={""}
                fill={cosmic_grad_ramps[1][1]}
                fontStyle={""} fontSize={120}
            />
            <RoboticText ref={inc_reg_text}
                text={""}
                fill={cosmic_grad_ramps[1][1]}
                fontStyle={""} fontSize={120}
            />
        </Layout>
        <Layout ref={bin_texts_parent}
            x={300} y={100}
        >
            {...range(17).map(i => <ThinRoboticText ref={bin_inc_reg_texts}
                x={-400 + i*50 + (Math.floor(i/8))*50}
                fill={cosmic_grad_ramps[1][1]}
                fontStyle={""} fontSize={120}
                text={" "}
            />)}
        </Layout>
    </>);

    yield* sequence(0.1,
        inc_reg_text[0].text("inc ", 0.8),
        inc_reg_text[1].text(inc_reg_strs[0], 0.8),
    );
    yield* waitFor(3);
    yield* sequence(0.05,
        ...bin_inc_reg_texts.slice(0,16).map((t, i) => t.text(inc_reg_encodings[0].toString(2).padStart(16, "0")[i], 0.1))
    );

    yield* waitUntil("x868gprs");
    yield* sequence(0.8,
        ...range(1, 8).map(k => all(
            inc_reg_text[1].fill("yellow", 0.2).to(cosmic_grad_ramps[1][1], 0.2),
            inc_reg_text[1].text(inc_reg_strs[k], 0.1),
            ...bin_inc_reg_texts.slice(0,16).map((t, i) => all(
                t.text(inc_reg_encodings[k].toString(2).padStart(16, "0")[i], 0.1)
            )),
            ...bin_inc_reg_texts.slice(13).map(t => t.fill("yellow", 0.2).to(cosmic_grad_ramps[1][1], 0.2)),
        ))
    );

    yield* waitUntil("last3bits");
    yield* sequence(0.1,
        ...bin_inc_reg_texts.slice(13).map(t => all(
            t.scale(1.5, 0.5, easeOutSine).to(1, 0.5, easeInSine),
            t.fill("#ff90ff", 0.8),
        ))
    );

    yield* waitUntil("addingonegpr");
    yield* sequence(1,
        all(
            inc_reg_text[1].scale(1.2, 0.8).to(1, 0.8),
            inc_reg_text[1].text("R8", 0.8),
        ),
        all(
            bin_inc_reg_texts[16].scale(1.2, 0.8).to(1, 0.8),
            bin_inc_reg_texts[16].text("0", 0.8),
        )
    );

    yield* waitUntil("lilguy");
    yield* all(
        isa_lay().y(isa_lay().y() - 200, 0.8),
        back_nodes[0].y(back_nodes[0].y() - 200, 0.8),
    );
    yield* waitUntil("newregs");
    yield* sequence(0.05,
        ...inc_reg_text.map(t => t.text("", 0.2)),
        ...bin_inc_reg_texts.map(t => t.text("", 0.2)),
    );

    const new_txt_parts = createRefArray<Txt>();
    const new_txt_strs = [ "x86", "-", "1978", "x64", "-", "2003" ]
    view.add(<>
        {...new_txt_strs.map((t,i) => <ThinRoboticText
            ref={new_txt_parts}
            fontSize={150}
            x={200 + (i%3) * 150} y={-75 + Math.floor(i/3) * 150}
            fill={i < 3 ? "#9270d3" : "#ff90ff"}
        />)}
    </>);

    yield* waitUntil("extensionyrs");

    yield* sequence(0.1,
        ...new_txt_parts.slice(0, 3).map((r, i) => r.text(new_txt_strs[i], 0.4)),
    )
    yield* sequence(0.1,
        ...new_txt_parts.slice(3, 6).map((r, i) => r.text(new_txt_strs[i+3], 0.4)),
    );

    yield* waitUntil("finalnogo");
    yield* sequence(0.1,
        ...new_txt_parts.map(r => r.text("", 0.4)),
        all(
            isa_lay().rotation(90, 0.5),
            isa_lay().scale(0, 0.5),
        ),
        all(
            back_nodes().rotation(90, 0.5),
            back_nodes().scale(0, 0.5),
        )
    );
    
    yield* waitUntil("end");
})