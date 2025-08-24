import { Circle, Code, Curve, Gradient, insert, Layout, Line, lines, makeScene2D, Node, QuadBezier, Rect, replace, Txt } from "@motion-canvas/2d";
import { all, cancel, chain, Color, createEaseOutBack, createRef, createRefArray, createSignal, DEFAULT, easeInBack, easeOutBack, easeOutQuint, linear, loopFor, PossibleVector2, range, Reference, ReferenceArray, sequence, tween, Vector2, waitFor, waitUntil } from "@motion-canvas/core";
import { RoboticText } from "../../components/defaults";
import { cosmic_analogues, cosmic_grad_ramps } from "../../components/palette";
import { get_perp, wiggle } from "../../components/misc";

export default makeScene2D(function* (view) {
    const time = createSignal(0);
    const time_loop = yield loopFor(Infinity, function*() {
        yield* time(time() + 10, 10, linear);
    });

    const circle_mask = createRef<Circle>();
    const topic_name = createRef<Txt>();
    const circle_cover = createRef<Circle>();
    view.add(<>
        <Circle ref={circle_mask}
            position={[-900, 454]}
            clip zIndex={-100} // size={300}
        >
            <RoboticText ref={topic_name}
                fill={"#ff90b6"}
                fontSize={120} fontStyle={""}
                text={"#3 ISA EXTENSION"}
                x={300}
            />
        </Circle>
        <Circle ref={circle_cover}
            position={[-900, 454]}
            fill={"#1d1a36"} zIndex={-100} //size={300}
        />
    </>)
    
    const isa_txt = createRef<Txt>();
    const back_node = createRef<Node>();
    const back_rect = createRef<Rect>();
    const back_rect_out_highlight = createRef<Rect>();
    view.add(<>
        <Node ref={back_node}
            position={[0,-800]}
            zIndex={-5}
        >
            <Rect ref={back_rect}
                size={180}
                fill={"#492b61"}
                rotation={45}
            />
            <Rect ref={back_rect_out_highlight}
                size={200}
                stroke={"#ae56c5"}
                fill={"#1d1a36"}
                zIndex={-4}
                lineWidth={2}
                rotation={45}
            />
            <RoboticText ref={isa_txt}
                fontSize={160} fontStyle={""}
                fill={"#ae56c5"} x={4} y={10}
                text={"ISA"}
            />
        </Node>)
    </>);
    yield* back_node().y(0, 1.2);
    
    const isaback_loop = yield loopFor(Infinity, function* () {
        yield* all(
            back_rect().rotation(back_rect().rotation() + 360, 4),
            back_rect_out_highlight().rotation(back_rect_out_highlight().rotation() - 360, 4),
        )
    });

    yield* waitUntil("thebeginning");
    yield isa_txt().text("ISA++", 1.2);
    yield chain(
        circle_mask().size(1800, 0.8),
        circle_cover().size(1800, 0.8),
        all(circle_mask().size(0, 0), circle_cover().size(0, 0))
    );

    yield* waitUntil("popcntexamp");
    yield* sequence(0.2,
        back_node().y(-400, 0.8),
        back_node().scale(1.2, 0.8),
    );

    const examp_instructions = [
        [ "POPCNT", "Count number of 1 bits" ],
        [ "BSF",    "Find first 1 bit"       ],
        [ "CLZ",    "Count leading zeroes"   ],
        [ "BSWAP",  "Reverse byte order"     ],
    ];
    const instr_nodes = createRef<Node>();
    const instr_line_nodes = createRefArray<Node>();
    const instr_txts = createRefArray<Txt>();
    const extension_backing = createRefArray<Line>();

    const spotlight_parent = createRef<Node>();
    view.add(<>
        <Node ref={instr_nodes}>
            {...examp_instructions.map((d, i) => <Node ref={instr_line_nodes}
                y={-50 + 140 * i}
            >
                <RoboticText ref={instr_txts}
                    // text={d[0]}
                    fontSize={80}
                    x={-450} offsetX={-1}
                    fill={"#ae56c5"}
                />
                <RoboticText ref={instr_txts}
                    // text={d[1]}
                    fontSize={80}
                    x={-150} offsetX={-1} fontStyle={""}
                    fill={cosmic_grad_ramps[1][1] + "99"}
                />
            </Node>)}
        </Node>
        <Node ref={spotlight_parent}
            position={[0, -400]}
            zIndex={-11}
        >
            {...range(4).map(i => <>
                <Line ref={extension_backing}
                    points={[[0, 0], [-900, 1400], [900, 1400], [0, 0]]} closed
                    fill={"#492b6122"} start={0.5} end={0.5}
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

    yield* sequence(0.1,
        ...extension_backing.map((t, i) => all(
            t.start(0, 0.4),
            t.end(1, 0.4),
        )),
        ...examp_instructions.map((d, i) => sequence(0.1,
            instr_txts[i*2].text(d[0], 1.2),
            instr_txts[i*2+1].text(d[1], 1.2),
        ))
    );

    yield* waitUntil("turingcompletealgo");
    yield* sequence(0.1,
        ...examp_instructions.slice(1).map((d, i) => sequence(0.1,
            instr_txts[(i+1)*2].text("", 1.2),
            instr_txts[(i+1)*2+1].text("", 1.2),
        )),
        instr_txts[0].position(instr_txts[0].position().add([-400, 100]), 0.5),
        instr_txts[0].scale(1.2, 0.8),
        instr_txts[1].position(instr_txts[0].position().add([-400, 200]), 0.5),
    );

    const firstcodenodelmao = createRef<Code>();
    view.add(<>
        <Code ref={firstcodenodelmao}
            position={[400, -200]}
            code={``}
            offsetY={-1}
        />
    </>)
    const code_lines = [
        "int popcnt(uint32_t x) {",
        "  int count = 0;",
        "  while (x) {",
        "    count += x & 1;",
        "    x >>= 1;",
        "  }",
        "  return count;",
        "}",
    ];
    for (let i = 0; i < code_lines.length; i++) {
        yield* firstcodenodelmao().code.edit(0.2)`\
${firstcodenodelmao().code()}
${insert(code_lines[i])}`;
    };

    yield* waitUntil("iterate_exec");
    const exec_order = [ 1, 2, 3, 4, 5, 2, 3, 4, 5, 2, 3, 4, 5, 2, 3, 4, 5, 2, 3, 4, 5, 2, 3, 4, 5, 2, 3, 4, 5, 2, 3, 4, 5, 6 ].map(t => t+1);
    for (let i = 0; i < exec_order.length; i++) {
        yield* firstcodenodelmao().selection(lines(exec_order[i]), 0.1);
        yield* waitFor(0.05);
    }

    yield* waitUntil("use_intrinsic");
    yield* firstcodenodelmao().selection(DEFAULT, 0.5);
    yield* firstcodenodelmao().y(firstcodenodelmao().y() + 130, 0.5);
    yield* firstcodenodelmao().code.edit(1.2)`\

int popcnt(uint32_t x) {
${replace(`  int count = 0;
  while (x) {
    count += x & 1;
    x >>= 1;
  }
  return count;`, `  return __builtin_popcount(x);`)}
}`;
    yield* firstcodenodelmao().selection(lines(2), 0.5);

    yield* waitUntil("oldermultdiv");
    yield* all(
        instr_txts[0].x(instr_txts[0].x() - 800, 0.8),
        instr_txts[1].x(instr_txts[1].x() - 800, 0.8),
        firstcodenodelmao().x(firstcodenodelmao().x() + 1000, 0.8),
    );
    yield* waitFor(1.5);
    const muldivtxts = createRefArray<Txt>();
    view.add(<>
        <RoboticText ref={muldivtxts}
            // x={-200}
             y={50}
            fontSize={120}
            fill={"#ae56c5"}
        />
        <RoboticText ref={muldivtxts}
            // x={-200}
             y={200}
            fontSize={120}
            fill={"#ae56c5"}
        />
        <RoboticText ref={muldivtxts}
            // x={-200}
             y={100} rotation={-45}
            fontSize={120}
            fill={cosmic_analogues[1][1]}
        />
    </>);
    yield* sequence(0.1,
        muldivtxts[0].text("MUL", 0.8),
        muldivtxts[1].text("DIV", 0.8),
    );
    yield* waitFor(1);
    yield* muldivtxts[2].text("Too Complex!", 1);

    yield* waitUntil("clearforuops");
    yield* sequence(0.05,
        ...muldivtxts.map(t => t.text("", 0.8)),
        ...extension_backing.map((t, i) => all(
            t.start(0.5, 0.4),
            t.end(0.5, 0.4),
        )),
        all(
            back_node().rotation(90, 0.5),
            back_node().scale(0, 0.5),
        )
    );

    yield* waitUntil("recreate_computer");
    cancel(isaback_loop);
    view.removeChildren();

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
//#endregion ComputerDefn
    
    yield* waitUntil("microops");
    
    const microops_title = createRef<Txt>();
    const microops_back = createRef<Rect>();
    const microops_highlight = createRef<Rect>();
    const microops_parent = createRef<Node>();
    view.add(<>
        <Node ref={microops_parent}
            zIndex={-100}
        >
            <Rect ref={microops_back}
                // size={200}
                fill={"#133e61"}
            />
            <Rect ref={microops_highlight}
                // size={220} rotation={45+90}
                zIndex={-4}
                lineWidth={2}
                stroke={"#0089ba"}
            />
            <RoboticText ref={microops_title}
                fontSize={120}
                fill={cosmic_grad_ramps[0][3]}
            />
        </Node>
    </>);

    yield* microops_title().text("MICRO-OPERATIONS", 1.2);

    yield* waitFor(2);
    yield* all(
        microops_title().text("μops", 1.2),
        sequence(0.1,
            microops_back().size(200, 0.8),
            microops_back().rotation(90+45, 0.8),
            microops_highlight().size(220, 0.8),
            microops_highlight().rotation(90+45, 0.8),
        )
    );
    const uopsback_loop = yield loopFor(Infinity, function* () {
        yield* all(
            microops_back().rotation(microops_back().rotation() + 360, 4),
            microops_highlight().rotation(microops_highlight().rotation() - 360, 4),
        )
    });


    yield* waitUntil("bringitback");
    yield* all(
        computer().x(0, 1.2),
        computer_panel_highlight_in().x(0, 1.2),
        computer_panel_highlight_out().x(0, 1.2),
    );
    

    const control_unit_clone = createRef<Rect>(); const control_unit_label_clone = createRef<Txt>();
    view.add(<>
        <Rect ref={control_unit_clone}
            fill={"#4e2b4d"}
            position={[-150, -281 - 35]}
            size={[330, 165]}
            lineWidth={4}
            stroke={() => Color.lerp("#c2566e", "#ffffff", clock_sig())}
        >
            <RoboticText
                ref={control_unit_label_clone} y={4}
                fill={cosmic_analogues[1][1]}
                fontSize={50} fontStyle={""}
                text={"Control Unit /\nDecoder"}
            />
        </Rect>
    </>)
    yield* all(
        sequence(0.1,
            control_unit_clone().scale(2, 0.8, createEaseOutBack(3)),
            control_unit_clone().position([0, 0], 0.8),
        ),
        computer().x(-2000, 1.2),
        computer_panel_highlight_in().x(-2000, 1.2),
        computer_panel_highlight_out().x(-2000, 1.2),
    );
    control_unit_clone().stroke("#c2566e");

    yield* waitUntil("expand_control");
    yield* all(
        chain(microops_parent().opacity(0,0), microops_parent().y(-1000, 0)),
        control_unit_label_clone().text("Hardwired Control Unit", 1.2),
        control_unit_label_clone().position([-260, -460], 1.2),
        control_unit_clone().scale(1, 1.2),
        control_unit_clone().size([1000, 1000], 1.2),
    );


    const hardwired_major_blocks = createRefArray<Rect>();
    const hardwired_outer_blocks = createRefArray<Rect>();
    const hardwired_outer_block_labels = createRefArray<Txt>();
    const hardwired_major_block_labels = createRefArray<Txt>();
    const hardwired_block_label_strs = ["Counter", "Time Decoder", "Instr Decoder"]
    const hardwired_outer_block_label_strs = [ "CLK", "IR", "FLAGS" ]
    const hardwired_block_wires = createRefArray<Line>();
    const hardwired_logic_gates = createRefArray<Node>();
    const hardwired_logic_gate_paths = createRefArray<Curve>();
    const hardwired_logic_gate_connectors = createRefArray<Line>();
    const hardwired_labels = createRefArray<Txt>();
    const hardwired_wire_label_strs = [ "T1", "R1_Out", "mov", "add", "sub", "Src01" ]
    const hardwired_additional_wires = createRefArray<Line>();

    const control_unit_outwires = createRefArray<Line>();
    const wire_positions = [-360, -340, -320, -140, 140, 320, 340, 360];
    
    control_unit_clone().add(<>
        // Outbound wires
        <Node
            y={400}
        >
            {wire_positions.map((p, i) => <Line ref={control_unit_outwires}
                points={[[0, 0], [0, 400]]} x={p}
                lineWidth={5} stroke={"#c2566e"}
                lineDash={[20, 20]} lineDashOffset={() => time() * -50} zIndex={10} end={0}
            >
            </Line>)}
        </Node>

        // Simple wires
        <Node>
            <Line ref={hardwired_block_wires}
                points={[[-570, -300], [-440, -300]]}
                lineWidth={40} stroke={"#c2566e"}
                lineDash={[100, 20]} lineDashOffset={() => time() * -50} zIndex={10} end={0}
            >
            </Line>
            <Line ref={hardwired_block_wires}
                points={[[-570, 0], [-440, 0]]}
                lineWidth={40}
                lineDash={[100, 20]} lineDashOffset={() => time() * -50} zIndex={10} end={0}
                stroke={new Gradient({
                    type: "linear",
                    from: [-570, 0],
                    to:   [-440, 0],
                    stops: [
                        { offset: 0, color: "#bf5dd6" },
                        { offset: 1, color: "#c2566e" },
                    ]
                })}
            >
            </Line>
            <Line ref={hardwired_block_wires}
                points={[{"x":-340,"y":-300}, {"x":-300,"y":-300}]}
                lineWidth={40} stroke={"#c2566e"}
                lineDash={[100, 20]} lineDashOffset={() => time() * -50} zIndex={10} end={0}
            >
            </Line>
            {range(6).map(i => <Line ref={hardwired_block_wires}
                points={[new Vector2({"x":-200,"y":-300}).addY(5 * -15 + i * 30), new Vector2({"x":-100,"y":-300}).addY(5 * -15 + i * 30)]}
                lineWidth={5} stroke={"#c2566e"}
                lineDash={[60, 5]} lineDashOffset={() => time() * -50} zIndex={10} end={0}
            >
            </Line>)}
            {range(6).map(i => <Line ref={hardwired_block_wires}
                points={[new Vector2({"x":-340,"y":0}).addY(5 * -15 + i * 30), new Vector2({"x":-240,"y":0}).addY(5 * -15 + i * 30)]}
                lineWidth={5} stroke={"#c2566e"}
                lineDash={[60, 5]} lineDashOffset={() => time() * -50} zIndex={10} end={0}
            >
            </Line>)}
            {range(8).map(i => <Line ref={hardwired_block_wires}
                points={[new Vector2({"x":570,"y":-300}).addY(7 * -10 + i * 20), new Vector2({"x":370,"y":-300}).addY(7 * -10 + i * 20)]}
                lineWidth={5}
                lineDash={[60, 5]} lineDashOffset={() => time() * -50} zIndex={10} end={0}
                stroke={new Gradient({
                    type: "linear",
                    from: {"x":570,"y":-300},
                    to: {"x":370,"y":-300},
                    stops: [
                        { offset: 0, color: "#bf5dd6" },
                        { offset: 1, color: "#c2566e" },
                    ]
                })}
            >
            </Line>)}
        </Node>

        // Blocks
        <Node>
            <Rect ref={hardwired_major_blocks}
                fill={"#4e2b4d"}
                position={[-390, -300]}
                // size={[100, 200]}
                lineWidth={4}
                stroke={"#c2566e"}
            >
                <RoboticText ref={hardwired_major_block_labels}
                    fill={"#c2566e"} fontSize={30} rotation={-90}
                    // text={"Counter"}
                />
            </Rect>
            <Rect ref={hardwired_major_blocks}
                fill={"#4e2b4d"}
                position={[-250, -300]}
                // size={[100, 200]}
                lineWidth={4}
                stroke={"#c2566e"}
            >
                <RoboticText ref={hardwired_major_block_labels}
                    fill={"#c2566e"} fontSize={30} rotation={-90}
                    // text={"Time Decoder"}
                />
            </Rect>
            <Rect ref={hardwired_outer_blocks}
                fill={"#4e2b4d"}
                position={[-620, -300]}
                // size={[100, 200]}
                lineWidth={4}
                stroke={"#c2566e"}
            >
                <RoboticText ref={hardwired_outer_block_labels}
                    x={6} y={4}
                    fill={"#c2566e"} fontSize={60} rotation={-90}
                    // text={"Counter"}
                />
            </Rect>
            <Rect ref={hardwired_major_blocks}
                fill={"#4e2b4d"}
                position={[-390, 0]}
                // size={[100, 200]}
                lineWidth={4}
                stroke={"#c2566e"}
            >
                <RoboticText ref={hardwired_major_block_labels}
                    fill={"#c2566e"} fontSize={30} rotation={-90}
                    // text={"Counter"}
                />
            </Rect>
            <Rect ref={hardwired_outer_blocks}
                fill={"#492b61"}
                position={[-620, 0]}
                // size={[100, 200]}
                lineWidth={4}
                stroke={"#bf5dd6"}
            >
                <RoboticText ref={hardwired_outer_block_labels}
                    x={6} y={4}
                    fill={"#bf5dd6"} fontSize={60} rotation={-90}
                    // text={"Counter"}
                />
            </Rect>
            <Rect ref={hardwired_outer_blocks}
                fill={"#492b61"}
                position={[620, -300]}
                // size={[100, 200]}
                lineWidth={4}
                stroke={"#bf5dd6"}
            >
                <RoboticText ref={hardwired_outer_block_labels}
                    x={-6} y={-4}
                    fill={"#bf5dd6"} fontSize={60} rotation={90}
                    // text={"Counter"}
                />
            </Rect>
        </Node>

        // Logic Gates
        <Node>
            <Node ref={hardwired_logic_gates}
                position={[-140, 365]}
            >
                <QuadBezier ref={hardwired_logic_gate_paths}
                    p0={[-75, -50]}
                    p1={[-75,  35]}
                    p2={[ 0,   35]} lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
                <QuadBezier ref={hardwired_logic_gate_paths}
                    p0={[ 75, -50]}
                    p1={[ 75,  35]}
                    p2={[ 0,   35]} lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
                <QuadBezier ref={hardwired_logic_gate_paths}
                    p0={[-75, -50]}
                    p1={[  0,   0]}
                    p2={[ 75, -50]} lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
            </Node>
            <Node ref={hardwired_logic_gates}
                position={[140, 365]}
            >
                <QuadBezier ref={hardwired_logic_gate_paths}
                    p0={[-75, -50]}
                    p1={[-75,  35]}
                    p2={[ 0,   35]} lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
                <QuadBezier ref={hardwired_logic_gate_paths}
                    p0={[ 75, -50]}
                    p1={[ 75,  35]}
                    p2={[ 0,   35]} lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
                <QuadBezier ref={hardwired_logic_gate_paths}
                    p0={[-75, -50]}
                    p1={[  0,   0]}
                    p2={[ 75, -50]} lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
            </Node>
            <Node ref={hardwired_logic_gates}
                position={[-225, 220]}
            >
                <QuadBezier ref={hardwired_logic_gate_paths}
                    p0={[-30, -25]}
                    p1={[-30,  30]}
                    p2={[ 0,   30]} lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
                <QuadBezier ref={hardwired_logic_gate_paths}
                    p0={[ 30, -25]}
                    p1={[ 30,  30]}
                    p2={[ 0,   30]} lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
                <Line ref={hardwired_logic_gate_paths}
                    points={[[-30, -25], [ 30, -25]]}
                    lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
            </Node>
            <Node ref={hardwired_logic_gates}
                position={[-140, 220]}
            >
                <QuadBezier ref={hardwired_logic_gate_paths}
                    p0={[-30, -25]}
                    p1={[-30,  30]}
                    p2={[ 0,   30]} lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
                <QuadBezier ref={hardwired_logic_gate_paths}
                    p0={[ 30, -25]}
                    p1={[ 30,  30]}
                    p2={[ 0,   30]} lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
                <Line ref={hardwired_logic_gate_paths}
                    points={[[-30, -25], [ 30, -25]]}
                    lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
            </Node>
            <Node ref={hardwired_logic_gates}
                position={[-55, 220]}
            >
                <QuadBezier ref={hardwired_logic_gate_paths}
                    p0={[-30, -25]}
                    p1={[-30,  30]}
                    p2={[ 0,   30]} lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
                <QuadBezier ref={hardwired_logic_gate_paths}
                    p0={[ 30, -25]}
                    p1={[ 30,  30]}
                    p2={[ 0,   30]} lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
                <Line ref={hardwired_logic_gate_paths}
                    points={[[-30, -25], [ 30, -25]]}
                    lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
            </Node>
            <Node ref={hardwired_logic_gates}
                position={[225, 220]}
            >
                <QuadBezier ref={hardwired_logic_gate_paths}
                    p0={[-30, -25]}
                    p1={[-30,  30]}
                    p2={[ 0,   30]} lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
                <QuadBezier ref={hardwired_logic_gate_paths}
                    p0={[ 30, -25]}
                    p1={[ 30,  30]}
                    p2={[ 0,   30]} lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
                <Line ref={hardwired_logic_gate_paths}
                    points={[[-30, -25], [ 30, -25]]}
                    lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
            </Node>
            <Node ref={hardwired_logic_gates}
                position={[140, 220]}
            >
                <QuadBezier ref={hardwired_logic_gate_paths}
                    p0={[-30, -25]}
                    p1={[-30,  30]}
                    p2={[ 0,   30]} lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
                <QuadBezier ref={hardwired_logic_gate_paths}
                    p0={[ 30, -25]}
                    p1={[ 30,  30]}
                    p2={[ 0,   30]} lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
                <Line ref={hardwired_logic_gate_paths}
                    points={[[-30, -25], [ 30, -25]]}
                    lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
            </Node>
            <Node ref={hardwired_logic_gates}
                position={[55, 220]}
            >
                <QuadBezier ref={hardwired_logic_gate_paths}
                    p0={[-30, -25]}
                    p1={[-30,  30]}
                    p2={[ 0,   30]} lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
                <QuadBezier ref={hardwired_logic_gate_paths}
                    p0={[ 30, -25]}
                    p1={[ 30,  30]}
                    p2={[ 0,   30]} lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
                <Line ref={hardwired_logic_gate_paths}
                    points={[[-30, -25], [ 30, -25]]}
                    lineCap={"round"}
                    lineWidth={5} stroke={"#c2566e"}
                    end={0} opacity={0}
                />
            </Node>
        </Node>

        // Logic connectors
        <Node>
            <Line ref={hardwired_logic_gate_connectors}
                points={[[-225, 250], [-225, 290], [-184, 290], [-184, 331]]}
                lineWidth={5} stroke={"#c2566e"}
                lineDash={[60, 10]} lineDashOffset={() => time() * -50} end={0}
            >
            </Line>
            <Line ref={hardwired_logic_gate_connectors}
                points={[[-140, 250], [-140, 340]]}
                lineWidth={5} stroke={"#c2566e"}
                lineDash={[60, 10]} lineDashOffset={() => time() * -50} end={0}
            >
            </Line>
            <Line ref={hardwired_logic_gate_connectors}
                points={[[-55, 250], [-55, 290], [-96, 290], [-96, 331]]}
                lineWidth={5} stroke={"#c2566e"}
                lineDash={[60, 10]} lineDashOffset={() => time() * -50} end={0}
            >
            </Line>
            <Line ref={hardwired_logic_gate_connectors}
                points={[[225, 250], [225, 290], [184, 290], [184, 331]]}
                lineWidth={5} stroke={"#c2566e"}
                lineDash={[60, 10]} lineDashOffset={() => time() * -50} end={0}
            >
            </Line>
            <Line ref={hardwired_logic_gate_connectors}
                points={[[140, 250], [140, 340]]}
                lineWidth={5} stroke={"#c2566e"}
                lineDash={[60, 10]} lineDashOffset={() => time() * -50} end={0}
            >
            </Line>
            <Line ref={hardwired_logic_gate_connectors}
                points={[[55, 250], [55, 290], [96, 290], [96, 331]]}
                lineWidth={5} stroke={"#c2566e"}
                lineDash={[60, 10]} lineDashOffset={() => time() * -50} end={0}
            >
            </Line>
        </Node>

        // Wire labels
        <Node>
            {...hardwired_wire_label_strs.map((t, i) => <RoboticText ref={hardwired_labels}
                fill={new Color(cosmic_grad_ramps[2][1]).brighten()} fontSize={30}
                text={t} scale={0}
            />)}
        </Node>
        
        // Additional Wires
        <Node>
            <Line ref={hardwired_additional_wires}
                points={[[-81, 135], [-163, 135], [-163, 193]]}
                lineWidth={5}  stroke={cosmic_grad_ramps[2][1]}
                lineDash={[60, 5]} lineDashOffset={() => time() * -50} end={0}
            >
            </Line>
            <Line ref={hardwired_additional_wires}
                points={[[-165, 135], [-250, 135], [-250, 193]]}
                lineWidth={5}  stroke={cosmic_grad_ramps[2][1]}
                lineDash={[60, 5]} lineDashOffset={() => time() * -50} end={0}
            >
            </Line>
            <Line ref={hardwired_additional_wires}
                points={[[-198, -75], [-115, -75], [-115, 193]]}
                lineWidth={5}  stroke={new Color(cosmic_grad_ramps[2][1]).brighten(2)}
                lineDash={[60, 5]} lineDashOffset={() => time() * -50} end={0}
            >
            </Line>
            <Line ref={hardwired_additional_wires}
                points={[[-113, -75], [-30, -75], [-30, 193]]}
                lineWidth={5}  stroke={new Color(cosmic_grad_ramps[2][1]).brighten(2)}
                lineDash={[60, 5]} lineDashOffset={() => time() * -50} end={0}
            >
            </Line>
        </Node>
    </>);

    yield* sequence(0.1,
        ...control_unit_outwires.map(t => t.end(1, 0.8)),
    );

    yield* waitUntil("hardwired_reveal");
    yield* sequence(0.05,
        ...hardwired_major_blocks.map(t => t.size([100, 200], 0.8)),
        ...hardwired_outer_blocks.map(t => t.size([100, 200], 0.8)),
        ...hardwired_major_block_labels.map((t, i) => t.text(hardwired_block_label_strs[i], 0.8)),
        ...hardwired_outer_block_labels.map((t, i) => t.text(hardwired_outer_block_label_strs[i], 0.8)),
        ...hardwired_block_wires.map(t => t.end(1, 0.8)),
    );
    yield* waitUntil("combinatorial_logic");
    yield* sequence(0.04,
        ...hardwired_logic_gate_paths.map(t => all(t.end(1, 0.8), t.opacity(1, 0.2))),
        ...hardwired_logic_gate_connectors.map(t => t.end(1, 0.8)),
    );

    yield* waitUntil("first_exec");
    yield* sequence(0.8,
        hardwired_labels[0].scale(4, 0.9, easeOutBack).to(1, 0.7, linear),
        all(
            hardwired_labels[0].position([-149, -204], 0.9),
        ),
        sequence(0.1,
            hardwired_block_wires[8].stroke(cosmic_grad_ramps[2][1], 0.3),
            hardwired_block_wires[8].points([
                new Vector2({"x":-200,"y":-300}).addY(5 * -15 + 5 * 30),
                new Vector2({"x":-100,"y":-300}).addY(5 * -15 + 5 * 30),
                new Vector2({"x":-80 ,"y":-300}).addY(5 * -15 + 5 * 30),
                new Vector2({"x":-80 ,"y": 120}).addY(5 * -15 + 5 * 30),
            ], 0.4),
            ...hardwired_additional_wires.slice(0, 2).map(t => t.end(1, 0.4)),
        )
    );
    yield* waitUntil("r1outenable");
    yield* sequence(0.8,
        hardwired_labels[1].scale(4, 0.9, easeOutBack).to(1, 0.7, linear),
        all(
            hardwired_labels[1].position([-160, 455], 0.9),
            hardwired_labels[1].rotation(-90, 0.9),
        ),
        sequence(0.1,
            hardwired_block_wires[8].stroke(cosmic_grad_ramps[2][1], 0.3),
            hardwired_block_wires[8].points([
                new Vector2({"x":-200,"y":-300}).addY(5 * -15 + 5 * 30),
                new Vector2({"x":-100,"y":-300}).addY(5 * -15 + 5 * 30),
                new Vector2({"x":-80 ,"y":-300}).addY(5 * -15 + 5 * 30),
                new Vector2({"x":-80 ,"y": 120}).addY(5 * -15 + 5 * 30),
            ], 0.4),
            ...hardwired_additional_wires.slice(0, 2).map(t => t.end(1, 0.4)),
        )
    );

    yield* waitUntil("possibleopcodes");
    const locations: PossibleVector2[] = [[-285, 88], [-285, 58], [-285, 28]];
    yield* sequence(0.1,
        ...range(2, 5).map(i => sequence(0.5,
            hardwired_labels[i].scale(4, 0.9, easeOutBack).to(0.8, 0.7, linear),
            all(
                hardwired_labels[i].position(locations[i-2], 0.9),
            ),
        ))
    );
    // 14,13,12
    yield* sequence(0.05,
        all(
            hardwired_block_wires[14].stroke(new Color(cosmic_grad_ramps[2][1]).brighten(1), 0.3),
            hardwired_block_wires[14].points([
                new Vector2({"x":-340,"y":0}).addY(5 * -15 + 5 * 30),
                new Vector2({"x":-240,"y":0}).addY(5 * -15 + 5 * 30),
                new Vector2({"x":-225,"y":0}).addY(5 * -15 + 5 * 30),
                new Vector2({"x":-225,"y":120}).addY(5 * -15 + 5 * 30),
            ], 0.4)
        ),
        all(
            hardwired_block_wires[13].stroke(new Color(cosmic_grad_ramps[2][1]).brighten(1), 0.3),
            hardwired_block_wires[13].points([
                new Vector2({"x":-340,"y":0}).addY(5 * -15 + 4 * 30),
                new Vector2({"x":-240,"y":0}).addY(5 * -15 + 4 * 30),
                new Vector2({"x":-140,"y":0}).addY(5 * -15 + 4 * 30),
                new Vector2({"x":-140,"y":150}).addY(5 * -15 + 4 * 30),
            ], 0.4)
        ),
        all(
            hardwired_block_wires[12].stroke(new Color(cosmic_grad_ramps[2][1]).brighten(1), 0.3),
            hardwired_block_wires[12].points([
                new Vector2({"x":-340,"y":0}).addY(5 * -15 + 3 * 30),
                new Vector2({"x":-240,"y":0}).addY(5 * -15 + 3 * 30),
                new Vector2({"x":-55,"y":0}).addY(5 * -15 + 3 * 30),
                new Vector2({"x":-55,"y":180}).addY(5 * -15 + 3 * 30),
            ], 0.4)
        ),
    );

    yield* waitUntil("checksrc01");
    yield* sequence(0.8,
        hardwired_labels[5].scale(4, 0.9, easeOutBack).to(0.8, 0.7, linear),
        all(
            hardwired_labels[5].position([-285, -60], 0.9),
        ),
    );
    yield* all(
        hardwired_block_wires[9].stroke(new Color(cosmic_grad_ramps[2][1]).brighten(2), 0.3),
        hardwired_block_wires[9].points([
            new Vector2({"x":-340,"y":0}).addY(5 * -15 + 0 * 30),
            new Vector2({"x":-240,"y":0}).addY(5 * -15 + 0 * 30),
            new Vector2({"x":-200,"y":0}).addY(5 * -15 + 0 * 30),
            new Vector2({"x":-200,"y":268}).addY(5 * -15 + 0 * 30),
        ], 0.4),
        ...hardwired_additional_wires.slice(2).map(t => t.end(1, 0.4)),
    );

    yield* waitUntil("withmicroops");
    yield* control_unit_clone().x(-2000, 1.2);
    const instruction_triangle_parent = createRef<Node>();
    const instruction_triangle = createRefArray<Line>();
    const instruction_triangle_inner = createRef<Line>();

    view.add(<>
        <Node ref={spotlight_parent}
            position={[0, -400]}
            zIndex={-11}
        >
            {...range(4).map(i => <>
                <Line ref={extension_backing}
                    points={[[0, 0], [-900, 1400], [900, 1400], [0, 0]]} closed
                    fill={"#133e6122"} start={0.5} end={0.5}
                    rotation={() => (i * 90) + time() * 10}
                />
            </>)}
        </Node>

        <Node ref={instruction_triangle_parent}
            position={[-400, 800]}
        >
            <Line ref={instruction_triangle}
                points={[
                    new Vector2(0, -200).rotate(0),
                    new Vector2(0, -200).rotate(120),
                ]} lineCap={"round"}
                rotation={() => time() * 30}
                lineWidth={15} stroke={"#0089ba"}
                // end={0}
            />
            <Line ref={instruction_triangle}
                points={[
                    new Vector2(0, -200).rotate(120),
                    new Vector2(0, -200).rotate(240),
                ]} lineCap={"round"}
                rotation={() => time() * 30}
                lineWidth={15} stroke={"#0089ba"}
                // end={0}
            />
            <Line ref={instruction_triangle}
                points={[
                    new Vector2(0, -200).rotate(240),
                    new Vector2(0, -200).rotate(0),
                ]} lineCap={"round"}
                rotation={() => time() * 30}
                lineWidth={15} stroke={"#0089ba"}
                // end={0}
            />
            <Line ref={instruction_triangle_inner}
                points={[
                    new Vector2(0, -180).rotate(0),
                    new Vector2(0, -180).rotate(120),
                    new Vector2(0, -180).rotate(240),
                ]} lineCap={"round"}
                rotation={() => time() * 30}
                fill={"#133e61"}
                // end={0}
            />
            
        </Node>
    </>);
    yield* sequence(0.05,
        chain(microops_parent().opacity(1,0), microops_parent().y(-450, 1.3)),
        ...extension_backing.map((t, i) => all(
            t.start(0, 0.4),
            t.end(1, 0.4),
        )),
    );
    yield* instruction_triangle_parent().position([-400, 100], 1.8, easeOutQuint);

    yield* waitUntil("break_into_uops");
    const microop_parts_triangle = instruction_triangle_parent().clone();
    view.add(microop_parts_triangle);
    yield* microop_parts_triangle.x(-microop_parts_triangle.x(), 0.8)
    yield* sequence(0.05,
        microop_parts_triangle.childAs<Line>(3).opacity(0, 1.2),
        
        microop_parts_triangle.childAs<Line>(0).points(
            //@ts-expect-error
            microop_parts_triangle.childAs<Line>(0).points().map(t => t.add(get_perp(microop_parts_triangle.childAs<Line>(0)))), 0.8
        ),
        microop_parts_triangle.childAs<Line>(1).points(
            //@ts-expect-error
            microop_parts_triangle.childAs<Line>(1).points().map(t => t.add(get_perp(microop_parts_triangle.childAs<Line>(1)))), 0.8
        ),
        microop_parts_triangle.childAs<Line>(2).points(
            //@ts-expect-error
            microop_parts_triangle.childAs<Line>(2).points().map(t => t.add(get_perp(microop_parts_triangle.childAs<Line>(2)))), 0.8
        ),
    )

    yield* waitUntil("muop_example");
    yield* all(
        microop_parts_triangle.x(2000, 1.2),
        instruction_triangle_parent().x(-2000, 1.2),
    );
    const microprogram_parent = createRef<Node>();
    const microprogram_name = createRef<Txt>();
    const microprogram_encloser = createRef<Rect>();
    const microprogram_highlight = createRef<Rect>();
    const microprogram_lay = createRef<Layout>();
    const instruction_txt = createRef<Txt>();
    const microop_txt_lines = createRefArray<Txt>();
    
    const mul_microprogram = [
        "TMP ← 0",
        "CNT ← 0",
        "LOOP:",
        "CMPNZ (R2 & (1 << CNT))",
        "COND TMP ← TMP + (R1 << CNT)",
        "CNT ← CNT + 1",
        "CMPLE CNT, 4",
        "COND GOTO LOOP",
        "R1 ← TMP",
    ]
    view.add(<>
        <RoboticText ref={instruction_txt}
            fontSize={80} fontStyle={""}
            fill={"#027faf"} x={-300} y={10}
        />
        <Node ref={microprogram_parent}
            x={50} y={-40}
        >
            <Rect ref={microprogram_encloser}
                // size={[850, 750]}
                position={[405, 220]}
                rotation={90}
                fill={"#133e61"} clip
            >
                <RoboticText ref={microprogram_name}
                    position={[700, -270]}
                    fontSize={100}
                    text={"Microprogram"}
                    fill={"#027faf"}
                />
            </Rect>
            <Rect ref={microprogram_highlight}
                // size={[870, 770]}
                position={[405, 220]}
                rotation={90}
                lineWidth={5} stroke={"#027faf"}
            />
            <Layout ref={microprogram_lay}
                layout
                offset={[-1,-1]}
                direction={"column"}
            >
                {...mul_microprogram.map((t,i) => <RoboticText ref={microop_txt_lines}
                    fontSize={80} fontStyle={""}
                    fill={cosmic_grad_ramps[0][4]}
                />)}
            </Layout>
        </Node>
    </>);
    yield* instruction_txt().text("mov R1, R2", 0.8);
    yield* microop_txt_lines[0].text("R1 ← R2", 0.8);

    yield* waitUntil("mulexamp");
    yield* instruction_txt().text("mul R1, R2", 0.8);
    yield* sequence(0.05,
        microprogram_parent().y(-100, 0.8),
        ...microop_txt_lines.map((t, i) => sequence(0.05,
            t.fontSize(50, 0.2),
            t.text(mul_microprogram[i], 0.8),
        )),
    );
    yield* waitUntil("microprogram");
    yield* sequence(0.1,
        all(
            microprogram_encloser().rotation(0, 0.8),
            microprogram_encloser().size([850, 650], 0.8),
        ),
        all(
            microprogram_highlight().rotation(0, 0.8),
            microprogram_highlight().size([870, 670], 0.8),
        ),
    );
    yield* waitFor(1);
    yield* microprogram_name().x(160, 0.8);

    yield* waitUntil("uoprom");
    yield* instruction_txt().y(instruction_txt().y() + 1000, 0.8)
    const microoprom_parent = createRef<Node>();
    const microoprom_name = createRef<Txt>();
    const microoprom_encloser = createRef<Rect>();
    const microoprom_highlight = createRef<Rect>();
    view.add(<>
        <Node ref={microoprom_parent}
            x={-500}
        >
            <Rect ref={microoprom_encloser}
                // size={[850, 750]}
                rotation={90}
                fill={"#492b61"} clip
                lineWidth={5} stroke={"#bf5dd6"}
            >
                <RoboticText ref={microoprom_name}
                    fontSize={100}
                    text={"μop ROM"}
                    fill={"#bf5dd6"}
                />
            </Rect>
            <Rect ref={microoprom_highlight}
                // size={[870, 770]}
                rotation={90}
                
            />
        </Node>
    </>)
    yield* sequence(0.1,
        all(
            microoprom_encloser().rotation(0, 0.8),
            microoprom_encloser().size([400,200], 0.8),
        ),
    );
    yield* all(
        microprogram_parent().scale(0, 0.8, easeInBack),
        microprogram_parent().position([-290, -3], 0.8, easeInBack),
    );
    yield* waitUntil("backtocircuit");
    yield* all(
        microops_parent().y(-1500, 0.8),
        ...extension_backing.map((t, i) => all(
            t.start(0.5, 0.4),
            t.end(0.5, 0.4),
        )),
    )
    
    yield* all(
        microoprom_parent().x(250, 1.2),
        control_unit_clone().x(0, 1.2),
    );
    yield* sequence(0.01,
        ...hardwired_major_blocks.map(t => t.scale(0, 0.4)),
        ...hardwired_major_block_labels.map((t, i) => t.text("", 0.4)),
        ...hardwired_labels.map(t => t.text("", 0.4)),
        ...hardwired_block_wires.map(t => t.start(1, 0.4)),
        ...hardwired_logic_gate_paths.map(t => all(t.start(1, 0.4), t.opacity(0, 0.2))),
        ...hardwired_logic_gate_connectors.map(t => t.start(1, 0.4)),
        ...hardwired_additional_wires.map(t => t.start(1, 0.4)),
        ...control_unit_outwires.map((t, i) => t.x(7 * -10 + i * 20, 0.4))
    );
    yield* all(
        control_unit_label_clone().text("Microprogram Control Unit", 0.8),
        control_unit_label_clone().x(control_unit_label_clone().x() + 30, 0.8),
        microoprom_parent().scale(0.6, 0.8),
        microoprom_parent().position([0,150], 0.8)
    );
    
    const microprogrammed_blocks = createRefArray<Rect>();
    const microprogrammed_block_labels = createRefArray<Txt>();
    const microprogrammed_block_sizes: PossibleVector2[] = [
        [250, 120], [250, 120], [250, 120],
    ];

    const microprogrammed_wires = createRefArray<Line>();
    const data_mask_1 = createRef<Rect>();
    const data_instruction = createRef<Line>();
    const data_mask_2 = createRef<Rect>();
    const data_startaddr = createRef<Txt>();
    const uop_addr_value = createRef<Txt>();
    const white_sig = createSignal(0);

    control_unit_clone().add(<>
        <Node y={75} zIndex={3}>
            <Rect ref={microprogrammed_blocks}
                // size={[850, 750]}
                position={[-200,-200]}
                fill={"#4e2b4d"} clip
                lineWidth={5} stroke={"#c2566e"}
            >
                <RoboticText ref={microprogrammed_block_labels}
                    fontSize={40}
                    text={"Starting Addr\nGenerator"}
                    fill={"#c2566e"}
                />
            </Rect>
            <Rect ref={microprogrammed_blocks}
                // size={[850, 750]}
                position={[200,-200]}
                fill={"#4e2b4d"} clip
                lineWidth={5} stroke={"#c2566e"}
            >
                <RoboticText ref={microprogrammed_block_labels}
                    fontSize={60}
                    text={"μop Addr"}
                    fill={"#c2566e"}
                />
                <RoboticText ref={uop_addr_value}
                    fontSize={60} y={20}
                    text={""} fontStyle={""}
                    fill={"#c059a1"}
                />
            </Rect>
            <Rect ref={microprogrammed_blocks}
                // size={[850, 750]}
                position={[0,275]}
                fill={"#4e2b4d"} clip
                lineWidth={5} stroke={"#c2566e"}
            >
                <RoboticText ref={microprogrammed_block_labels}
                    fontSize={50}
                    text={"μop Decode"}
                    fill={"#c2566e"}
                />
            </Rect>
        </Node>

        <Node>
            <Line ref={microprogrammed_wires}
                points={[[-570, -300], [-300, -300], [-300, -350], [200, -350], [200, -260+75]]}
                lineWidth={10} stroke={"#c2566e"} radius={20}
                lineDash={[100, 20]} lineDashOffset={() => time() * -50} zIndex={10}
                end={0}
            >
            </Line>
            <Line ref={microprogrammed_wires}
                points={[[-570, 0], [-200, 0], [-200, -140+75]]}
                lineWidth={20} stroke={new Gradient({
                    type: "linear",
                    from: [-570, 0],
                    to:   [-200, -140+75],
                    stops: [
                        { offset: 0, color: "#bf5dd6" },
                        { offset: 1, color: "#c2566e" },
                    ]
                })} radius={20}
                lineDash={[100, 20]} lineDashOffset={() => time() * -50} zIndex={10}
                end={0}
            >
            </Line>
            <Line ref={microprogrammed_wires}
                points={[[570, -300], [-200, -300], [-200, -260+75]]}
                lineWidth={20} stroke={new Gradient({
                    type: "linear",
                    from: [570, -300],
                    to:   [-200, -260+75],
                    stops: [
                        { offset: 0, color: "#bf5dd6" },
                        { offset: 1, color: "#c2566e" },
                    ]
                })} radius={20}
                lineDash={[100, 20]} lineDashOffset={() => time() * -50} zIndex={10}
                end={0}
            >
            </Line>
            <Line ref={microprogrammed_wires}
                points={[[-75, -200+75], [75, -200+75]]}
                lineWidth={10} stroke={"#c2566e"} radius={20}
                lineDash={[100, 20]} lineDashOffset={() => time() * -50} zIndex={10}
                end={0}
            >
            </Line>
            <Line ref={microprogrammed_wires}
                points={[[200, -140+75], [200, 25], [0, 25], [0, -100+200]]}
                lineWidth={20} stroke={new Gradient({
                    type: "linear",
                    from: [200, -140+75],
                    to:   [0, -100+75+50],
                    stops: [
                        { offset: 0, color: () => Color.lerp("#c2566e", "#fff", white_sig()) },
                        { offset: 1, color: () => Color.lerp("#bf5dd6", "#fff", white_sig()) },
                    ]
                })} radius={20}
                lineDash={[100, 20]} lineDashOffset={() => time() * -50} zIndex={10}
                end={0}
            >
            </Line>
            <Line ref={microprogrammed_wires}
                points={[[0, 135+75], [0, 290]]}
                lineWidth={20} stroke={new Gradient({
                    type: "linear",
                    from: [0, 135+75],
                    to:   [0, 290],
                    stops: [
                        { offset: 0, color: () => Color.lerp("#bf5dd6", "#fff", white_sig()) },
                        { offset: 1, color: () => Color.lerp("#c2566e", "#fff", white_sig()) },
                    ]
                })} radius={20}
                lineDash={[100, 20]} lineDashOffset={() => time() * -50} zIndex={10}
                end={0}
            >
            </Line>
        </Node>

        <Rect ref={data_mask_1}
            position={[-360, 0]}
            size={[420, 120]}
            // fill={"#fff"}
            clip
        >
            <Line ref={data_instruction}
                position={[-300, 0]}
                points={[
                    new Vector2(0, -40).rotate(0),
                    new Vector2(0, -40).rotate(120),
                    new Vector2(0, -40).rotate(240)
                ]}
                lineWidth={5} stroke={"white"}
                closed radius={5}
                fill={"#d65d74"}
            />
        </Rect>
        <Rect ref={data_mask_2}
            position={[0, -125]}
            size={[145, 120]}
            // fill={"#fff"}
            clip
        >
            <RoboticText ref={data_startaddr}
                position={[-150, 0]}
                lineWidth={2} stroke={"white"}
                text={"0x1000"}
                fill={"#bf5dd6"}
            />
        </Rect>
    </>);

    yield* sequence(0.1,
        ...microprogrammed_blocks.map((t, i) => t.size(microprogrammed_block_sizes[i], 0.5)),
        microprogrammed_wires[1].end(1, 0.5),
        microprogrammed_wires[2].end(1, 0.5),
    );
    yield* sequence(0.1,
        microprogrammed_wires[0].end(1, 0.5),
        microprogrammed_wires[3].end(1, 0.5),
        microprogrammed_wires[4].end(1, 0.5),
        microprogrammed_wires[5].end(1, 0.5),
    );
    yield* sequence(0.5,
        all(
            hardwired_outer_block_labels[1].fill("white", 0.4).back(0.4),
            hardwired_outer_blocks[1].stroke("white", 0.4).back(0.4),
        ),
        data_instruction().x(150, 1),
        data_instruction().y(-100, 1),
        sequence(0.5,
            microprogrammed_block_labels[1].x(250, 0.3).to(-300, 0),
            all(
                microprogrammed_block_labels[1].y(-30, 0),
                microprogrammed_block_labels[1].fontSize(40, 0),
            ),
            microprogrammed_block_labels[1].x(-45, 0.3),
        ),
        sequence(0.1,
            data_startaddr().x(150, 0.6),
            uop_addr_value().text("0x1000", 0.5)
        )
    );

    let addr = 0x1000;
    const bit_strings: number[][] = [
        [1,6],
        [1,6],
        [],
        [0,1,6,7],
        [1,2,3,4,5,6],
    ];
    const microop_clock_cycle = yield loopFor(6, function* (i) {
        addr += 0x4;
        yield* all(
            hardwired_outer_blocks[0].stroke("white", 0.2).back(0.2),
            hardwired_outer_block_labels[0].fill("white", 0.2).back(0.2),
            microprogrammed_wires[0].stroke("white", 0.2).back(0.2),
            uop_addr_value().text("0x" + addr.toString(16), 0.1),
            white_sig(1, 0.2).back(0.2),
            ...bit_strings[i].map(i => control_unit_outwires[i].stroke("white", 0.2).back(0.2))
        );
        yield* waitFor(0.8);
    });

    yield* waitUntil("highlight_startaddrgen");
    yield* all(
        wiggle(microprogrammed_blocks[0].rotation, -10, 10, 1),
        microprogrammed_blocks[0].scale(1.2, 0.6).back(0.6),
        microprogrammed_blocks[0].stroke("yellow", 0.6).back(0.6),
    );
    yield* waitUntil("highlight_uoprom");
    yield* all(
        wiggle(microoprom_parent().rotation, -10, 10, 1),
        microoprom_parent().scale(0.8, 0.6).back(0.6),
        microoprom_encloser().stroke("yellow", 0.6).back(0.6),
    );

    yield* waitUntil("goaway");
    yield* all(
        control_unit_clone().x(-2500, 1.2),
        microoprom_parent().x(-2500, 1.2),
    );

    yield* waitUntil("pclmulqdq")
    const example_ctrl = createRefArray<Node>();
    const example_ctrl_backs = createRefArray<Line>();
    const example_ctrl_highlights = createRefArray<Line>();
    const example_ctrl_labels = createRefArray<Txt>();
    const example_hwd = createRefArray<Node>();
    const example_hwd_backs = createRefArray<Line>();
    const example_hwd_highlights = createRefArray<Line>();
    const example_hwd_labels = createRefArray<Txt>();
    type ctrl_popup = { pos: [number, number]; txt: string; width: number };
    const ctrl_positions: (ctrl_popup)[] = [
        { pos: [-604, -132], txt: "CPUID",     width: 50, },
        { pos: [-834, 419],  txt: "RDMSR",     width: 50, },
        { pos: [-439, 174],  txt: "XGETBV",    width: 75, },
        { pos: [-105, -197], txt: "MONITOR",   width: 75, },
        { pos: [-713, -377], txt: "PCLMULQDQ", width: 80, },
    ];
    const hwd_positions: (ctrl_popup)[] = [
        { pos: [604, -132], txt: "MUL/IMUL",  width: 70, },
        { pos: [834, 419],  txt: "POPCNT",    width: 55, },
        { pos: [439, 174],  txt: "BSWAP",     width: 50, },
        { pos: [105, -197], txt: "BSF/BSR",   width: 60, },
        { pos: [713, -377], txt: "DIV/IDIV",  width: 70, },
    ];
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
                zIndex={2} y={4}
                fill={cosmic_grad_ramps[1][1]}
                fontSize={60} fontStyle={""}
                // text={"PC_out"}
            />
        </Node>)}
        {...hwd_positions.map(t => <Node ref={example_hwd} position={t.pos} scale={1.3}>
            <Line ref={example_hwd_backs}
                points={[[-50, -50], [-50, -50], [50, -50], [50, 50], [50, 50], [-50, 50]]}
                closed fill={"#133e61"} scale={0}
                // rotation={45}
            />
            <Line ref={example_hwd_highlights}
                points={[[-55, -55], [-55, -55], [55, -55], [55, 55], [55, 55], [-55, 55]]}
                closed lineWidth={2} zIndex={-1}
                stroke={cosmic_grad_ramps[0][4]} scale={0}
                // rotation={45}
            />
            <RoboticText ref={example_hwd_labels}
                zIndex={2} y={4}
                fill={cosmic_grad_ramps[1][4]}
                fontSize={60} fontStyle={""}
                // text={"PC_out"}
            />
        </Node>)}
    </>);
    const show_popup = function* (r: ReferenceArray<Node>, rh: ReferenceArray<Line>, rb: ReferenceArray<Line>, rl: ReferenceArray<Txt>, i: number, lab: string, winc: number = 50, time: number, compress: number = 13) {
        yield* sequence(0.7,
            sequence(0.1,
                all(
                    rh[i].rotation(45, 0.8),
                    rh[i].scale(1, 0.8),
                ),
                all(
                    rb[i].rotation(45, 0.8),
                    rb[i].scale(1, 0.8),
                ),
            ),
            chain(waitFor(time), r[i].scale(0, 2.2)),
            all(
                rb[i].points([[-50-winc+compress, -50+winc+compress], [-50+winc+compress, -50-winc+compress], [50+winc, -50-winc], [50+winc-compress, 50-winc-compress], [50-winc-compress, 50+winc-compress], [-50-winc, 50+winc]], 0.8),
                rh[i].points([[-55-winc+compress, -55+winc+compress], [-55+winc+compress, -55-winc+compress], [55+winc, -55-winc], [55+winc-compress, 55-winc-compress], [55-winc-compress, 55+winc-compress], [-55-winc, 55+winc]], 0.8),
                rl[i].text(lab, 0.8),
            ),
        );
    }

    yield* sequence(0.4,
        ...ctrl_positions.map((t, i) => show_popup(example_ctrl, example_ctrl_highlights, example_ctrl_backs, example_ctrl_labels, i, t.txt, t.width, 4)),
    );
    yield* waitUntil("hwdform");
    yield* sequence(0.4,
        ...hwd_positions.map((t, i) => show_popup(example_hwd, example_hwd_highlights, example_hwd_backs, example_hwd_labels, i, t.txt, t.width, 3, 15)),
    );

    yield* waitUntil("end")
});