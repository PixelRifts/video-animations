import { Circle, Code, Curve, insert, Layout, Line, lines, makeScene2D, Node, Rect, remove, replace, Txt, word } from "@motion-canvas/2d";
import { all, any, chain, Color, createRef, createRefArray, createSignal, easeInCirc, easeInQuart, easeOutCirc, easeOutQuart, linear, loopFor, range, run, sequence, Vector2, waitFor, waitUntil } from "@motion-canvas/core";
import { cosmic_analogues, cosmic_grad, cosmic_grad_ramps } from "../../components/palette";
import { RoboticText, write, write_code } from "../../components/defaults";
import { ShikiHighlighter } from "../../components/shiki";
import { wiggle } from "../../components/misc";

const asm_highlighter = new ShikiHighlighter({
    highlighter: {
      lang: "asm",
      theme: "vitesse-dark",
    }
  });


export default makeScene2D(function* (view) {
    const time = createSignal(0);
    const time_loop = yield loopFor(Infinity, function*() {
        yield* time(time() + 10, 10, linear);
    });

    yield* waitUntil("theoperation");
    const operation_stuff = createRef<Node>();
    view.add(<Node ref={operation_stuff}></Node>);

    const operation_symbol = createRef<Node>();
    const operation_parts = createRefArray<Curve>();
    const input_set_rect = createRef<Rect>();
    const output_set_rect = createRef<Rect>();
    const input_set_elems = createRefArray<Rect>();
    operation_stuff().add(<>
        <Node ref={operation_symbol}>
            <Line ref={operation_parts}
                points={[[0, 120], [0, -120]]}
                lineWidth={20} lineCap={"round"}
                stroke={cosmic_grad_ramps[1][3]}
                end={0} opacity={0}
            />
            <Line ref={operation_parts}
                points={[[-120, 0], [120, 0]]}
                lineWidth={20} lineCap={"round"}
                stroke={cosmic_grad_ramps[1][3]}
                end={0} opacity={0}
            />
            <Circle ref={operation_parts}
                size={180} zIndex={-1}
                lineWidth={20} lineCap={"round"}
                stroke={cosmic_grad_ramps[1][3]}
                end={0} opacity={0}
            />
        </Node>
        <Rect ref={input_set_rect}
            size={[300, 900]}
            position={[-400, -1200]}
            lineWidth={10} lineCap={"round"}
            stroke={cosmic_grad_ramps[1][2]}
            layout direction={"column"}
            padding={15} gap={10}
        >
            {...range(16).map(i => <Rect ref={input_set_elems}
                size={[270, 45]}
                lineWidth={10} lineCap={"round"}
                fill={"#084a82"}
                radius={10}
            />)}
        </Rect>
        <Rect ref={output_set_rect}
            size={[300, 900]}
            position={[400, -1200]}
            lineWidth={10} lineCap={"round"}
            stroke={cosmic_grad_ramps[1][4]}
        >
        </Rect>
    </>);
    yield* sequence(0.1,
        ...operation_parts.map(t => all(t.opacity(1, 0.1), t.end(1, 0.5))),
        operation_parts[2].fill("#0a456c", 0.5),
    );
    const operation_loop = yield loopFor(Infinity, function* () {
        yield* operation_symbol().rotation(operation_symbol().rotation() + 180+45, 2);
    });

    yield* waitUntil("awholesetinput");
    yield* input_set_rect().y(0, 1.2);

    yield* waitUntil("awholesetoutput");
    yield* output_set_rect().y(0, 1.2);

    const output_set_elems: Rect[] = [];
    input_set_elems.forEach((t, i) => {
        const cl = t.clone();
        cl.position(t.position().addX(-800));

        output_set_elems.push(cl);
        output_set_rect().add(cl);
    });
    
    yield* waitUntil("loopoverdata");
    yield* sequence(0.2,
        ...output_set_elems.map((t, i) => chain(
            all(
                input_set_elems[i].scale(1.2, 0.2).back(0.2),
                input_set_elems[i].fill("#6e8d30", 0.2).back(0.2),
                t.position(operation_symbol().position().addX(-400), 0.2),
                t.scale(0, 0.2),
            ),
            t.fill("#007f9344", 0),
            all(
                t.position(input_set_elems[i].position(), 0.2),
                t.scale(1, 0.2),
            ),
        ))
    );
    yield* sequence(0.1,
        operation_symbol().y(1200, 1.2),
        all(
            input_set_rect().y(1200, 1.2),
            output_set_rect().y(1200, 1.2),
        )
    );
    
    const simple_vec_addition_code = createRef<Code>();
    const simple_vec_addition_asm_form = createRef<Code>();
    view.add(<>
        <Code ref={simple_vec_addition_code}
            code={""}
        />
        <Code ref={simple_vec_addition_asm_form}
            position={[300, 200]}
            // highlighter={asm_highlighter}
            code={""}
        />
    </>);
    
    yield* write_code(simple_vec_addition_code(), `\
void vector_add(float* arr_a, float* arr_b,
                float* arr_sum, int n) {
    for (int i = 0; i < n; i++) {
        arr_sum[i]  = arr_a[i] + arr_b[i];
    }
}`, 1.2);
    yield* waitUntil("asmform");
    yield* simple_vec_addition_code().position([-300, -200], 0.5);
    yield* write_code(simple_vec_addition_asm_form(), `\
; Loop stuff
        mov     r8d, dword ptr [rsi + 4*rcx]
        add     r8d, dword ptr [rdi + 4*rcx]
        mov     dword ptr [rdx + 4*rcx], r8d
; Loop back`, 1.2);
    yield* waitFor(1);
    yield* all(
        simple_vec_addition_code().selection(lines(3), 0.8),
        simple_vec_addition_asm_form().selection(lines(1, 3), 0.8),
    );

    yield* waitUntil("ihavenelems");
    yield* all(
        simple_vec_addition_code().selection([word(0, 16, 12), word(0, 30, 12), word(1, 32, 5)], 0.8),
        simple_vec_addition_asm_form().selection([], 0.8),
    );
    yield* waitFor(2);
    yield simple_vec_addition_code().selection(lines(3), 0.8);
    const ntimeslabel = createRef<Txt>();
    view.add(<>
        <RoboticText ref={ntimeslabel}
            text={"n"}
            position={[-500, 200+40]}
            fontSize={150} fontStyle={""}
            fill={"#8fbcbb"}
            opacity={0}
        />
    </>);

    yield all(
        ntimeslabel().y(ntimeslabel().y() - 40, 0.5),
        ntimeslabel().opacity(1, 0.5),
    )
    yield* loopFor(3, function* () {
        yield* simple_vec_addition_asm_form().selection(lines(1, 3), 0.3).back(0.3);
    })
    yield* simple_vec_addition_asm_form().selection(lines(1, 3), 0.3);

    yield* waitUntil("onetypeofparallelism");
    yield* all(
        simple_vec_addition_code().y(simple_vec_addition_code().y() - 1200, 1.2),
        simple_vec_addition_asm_form().y(simple_vec_addition_asm_form().y() - 1200, 1.2),
        ntimeslabel().y(ntimeslabel().y() - 1200, 1.2),
    );
    
    yield* sequence(0.1,
        all(
            input_set_rect().y(0, 1.2),
            output_set_rect().y(0, 1.2),
        ),
        operation_symbol().y(0, 1.2),
    );
    yield* sequence(0.01,
        ...output_set_elems.map(t => t.size(0, 0.2)),
    )
    output_set_rect().removeChildren();

    const simd_sets = createRefArray<Rect>();
    output_set_rect().add(<>
        {...range(4).map(i => <Rect ref={simd_sets}
            position={Vector2.lerp(input_set_elems[i*4+1].position(), input_set_elems[i*4+2].position(), 0.5).addX(-800)}
            size={[280, 55 * 4]}
            lineWidth={2}
        ></Rect>)}
    </>)
    input_set_elems.forEach((t, i) => {
        output_set_elems[i].position([0, -(55*1.5) + 55 * (i % 4)]);
        output_set_elems[i].size([270, 45]);
        output_set_elems[i].fill("#084a82");

        simd_sets[Math.floor(i / 4)].add(output_set_elems[i]);
    });
    yield* waitUntil("wholesetop");
    yield* simd_sets[0].stroke("yellow", 0.8);
    yield* chain(
        all(
            ...range(4).map(i => all(
                input_set_elems[i].scale(1.2, 1.2).back(1.2),
                input_set_elems[i].fill("#6e8d30", 1.2).back(1.2),
            )),
            simd_sets[0].position(operation_symbol().position().addX(-400), 1.2),
            simd_sets[0].scale(0, 1.2),
        ),
        all(
            ...range(4).map(i => output_set_elems[i].fill("#007f9344", 0)),
        ),
        all(
            simd_sets[0].position(Vector2.lerp(input_set_elems[1].position(), input_set_elems[2].position(), 0.5), 1.2),
            simd_sets[0].scale(1, 1.2),
        ),
    )
    yield* simd_sets[0].stroke("#00000000", 0.8);
    yield sequence(0.4,
        ...range(1, 4).map(s => chain(
            any(
                ...range(4).map(i => all(
                    input_set_elems[s*4+i].scale(1.2, 0.4).back(0.4),
                    input_set_elems[s*4+i].fill("#6e8d30", 0.4).back(0.4),
                )),
                simd_sets[s].position(operation_symbol().position().addX(-400), 0.4),
                simd_sets[s].scale(0, 0.4),
            ),
            all(
                ...range(4).map(i => output_set_elems[s*4+i].fill("#007f9344", 0)),
            ),
            all(
                simd_sets[s].position(Vector2.lerp(input_set_elems[s*4+1].position(), input_set_elems[s*4+2].position(), 0.5), 0.4),
                simd_sets[s].scale(1, 0.4),
            ),
        ))
    );

    yield* waitUntil("simdtitledrop");
    const simd_title = createRef<Txt>();
    const back_node = createRef<Node>();
    const back_rect = createRef<Rect>();
    const back_rect_out_highlight = createRef<Rect>();
    const spotlight_parent = createRef<Node>();
    const extension_backing = createRefArray<Line>();
    view.add(<>
        <Node ref={back_node}
            position={[0, -800]}
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
            <RoboticText ref={simd_title}
                text={"SIMD"} fontStyle={""}
                fill={"#007f93"}
                fontSize={200}
                position={[0, 6]}
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
    yield* back_node().y(-400, 0.8);
    yield* waitFor(0.5);
    yield* all(
        input_set_rect().position(input_set_rect().position().add([-800, 800]), 0.4),
        output_set_rect().position(output_set_rect().position().add([800, 800]), 0.4),
        operation_symbol().position(operation_symbol().position().add([0, 800]), 0.4),
        back_node().position([0,0], 0.8).wait(0.8).back(0.8),
        simd_title().text("Single\nInstruction\nMultiple\nData", 0.8).wait(0.8).back(0.8),
    );
    yield* all(
        simd_title().fontSize(120, 0.4),
        back_rect().size(180, 0.4),
        back_rect_out_highlight().size(200, 0.4),
        sequence(0.05,
            ...extension_backing.map((t, i) => all(
                t.start(0, 0.4),
                t.end(1, 0.4),
            )),
        ),
    )

    const simdback_loop = yield loopFor(Infinity, function* () {
        yield* all(
            back_rect().rotation(back_rect().rotation() + 360, 4),
            back_rect_out_highlight().rotation(back_rect_out_highlight().rotation() - 360, 4),
        )
    });
    
    yield* waitUntil("newsetofregisters");
    const reg_examples = createRef<Node>();
    view.add(<Node ref={reg_examples}></Node>)
    const simple_reg_label = createRef<Txt>();
    const simd_reg_label = createRef<Txt>();
    const simple_reg = createRef<Rect>();
    const simd_reg = createRef<Rect>();
    const simple_reg_content = createRefArray<Rect>();
    const simd_reg_content = createRefArray<Rect>();
    const simd_instr_set = createRefArray<Txt>();
    reg_examples().add(<>
        <RoboticText ref={simple_reg_label}
            text={"R1 (8) = "}
            position={[-465, 0 + 1000]}
            fontSize={120}
            fontStyle={""}
            fill={cosmic_grad_ramps[1][2]}
        />
        <RoboticText ref={simd_reg_label}
            text={"S1 (32) = "}
            position={[-490, 150 + 1000]}
            fontSize={120}
            fontStyle={""}
            fill={cosmic_grad_ramps[1][3]}
        />
        <Rect ref={simple_reg}
            position={[-250, -10 + 1000]}
            size={[250, 100]} offset={[-1, 0]}
            lineWidth={8} radius={10}
            stroke={cosmic_grad_ramps[1][2]}
            layout padding={15} gap={15}
        >
            <Rect ref={simple_reg_content}
                size={["100%", "100%"]} offset={[-1, 0]}
                lineWidth={8} radius={10}
                fill={cosmic_grad_ramps[1][2] + "55"}
            />
        </Rect>
        <Rect ref={simd_reg}
            position={[-250, 140 + 1000]}
            size={[959, 100]} offset={[-1, 0]}
            lineWidth={8} radius={10}
            stroke={cosmic_grad_ramps[1][3]}
            layout padding={15} gap={15}
        >
            <Rect ref={simd_reg_content}
                size={["25%", "100%"]}
                lineWidth={8} radius={10}
                fill={cosmic_grad_ramps[1][3] + "55"}
            />
            <Rect ref={simd_reg_content}
                size={["25%", "100%"]}
                lineWidth={8} radius={10}
                fill={cosmic_grad_ramps[1][3] + "55"}
            />
            <Rect ref={simd_reg_content}
                size={["25%", "100%"]}
                lineWidth={8} radius={10}
                fill={cosmic_grad_ramps[1][3] + "55"}
            />
            <Rect ref={simd_reg_content}
                size={["25%", "100%"]}
                lineWidth={8} radius={10}
                fill={cosmic_grad_ramps[1][3] + "55"}
            />
        </Rect>
        
        <RoboticText ref={simd_instr_set}
            text={"add4x"}
            position={[-490, 400 + 1000]}
            fontSize={120}
            fontStyle={""}
            fill={cosmic_grad_ramps[1][3]}
        />
        <RoboticText ref={simd_instr_set}
            text={"sub4x"}
            position={[0, 400 + 1000]}
            fontSize={120}
            fontStyle={""}
            fill={cosmic_grad_ramps[1][3]}
        />
        <RoboticText ref={simd_instr_set}
            text={"rot4x"}
            position={[490, 400 + 1000]}
            fontSize={120}
            fontStyle={""}
            fill={cosmic_grad_ramps[1][3]}
        />
    </>);
    yield* sequence(1,
        sequence(0.1,
            simple_reg_label().y(simple_reg_label().y() - 1000, 1.2),
            simple_reg().y(simple_reg().y() - 1000, 1.2),
        ),
        sequence(0.1,
            simd_reg_label().y(simd_reg_label().y() - 1000, 1.2),
            simd_reg().y(simd_reg().y() - 1000, 1.2),
        ),
    );

    yield* waitUntil("newinstructions");
    yield* sequence(0.4,
        ...simd_instr_set.map(t => t.y(t.y() - 1000, 2, easeOutQuart).back(2, easeInQuart))
    );

    yield* waitUntil("interpretation");
    yield* sequence(0.1,
        ...simd_reg_content.map(t => all(
            wiggle(t.rotation, -10, 10, 0.8),
            t.fill("yellow", 0.4).back(0.4),
            t.scale(1.2, 0.4).back(0.4),
        ))
    );

    yield* waitUntil("addtomicroarch");
    yield* sequence(0.1,
        sequence(0.1,
            simd_reg_label().y(simd_reg_label().y() + 1000, 1.2),
            simd_reg().y(simd_reg().y() + 1000, 1.2),
        ),
        sequence(0.1,
            simple_reg_label().y(simple_reg_label().y() + 1000, 1.2),
            simple_reg().y(simple_reg().y() + 1000, 1.2),
        ),
        sequence(0.05,
            ...extension_backing.map((t, i) => all(
                t.start(0.5, 0.4),
                t.end(0.5, 0.4),
            )),
        ),
        back_node().y(-1000, 0.6),
    );

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
    
    // #endregion Computer Stuff
    
    yield* waitUntil("add_simd_regs");
    yield* computer_stuff().x(0, 1.2);
    
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

    yield* sequence(0.1,
        ...simd_registers.map(t => all(t.size([130, 65], 0.8), t.rotation(0, 0.8))),
    );
    
    yield* waitUntil("add_vecexec_unit");
    yield* all(
        alu().scale(0.8, 0.5),
        alu().y(alu().y() + 150, 0.5),
        control_buffer_alu_data_wire_1().points([[384-180+100, -230+150], [529-240+112, -230+150]], 0.5),
        control_buffer_alu_data_wire_2().points([[384-180+100, -110+150], [529-240+112, -110+150]], 0.5),
        alu_outputbuffer_data_wire().points([[400+86, -170+150], [466+100, -170+150]], 0.5),
        controlbuffer_outputbuffer_data_wire().points([[203+100, 40+60], [466+100, 40+60]], 0.5),
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
        vec_exec_unit.y(vec_exec_unit.y() - 200, 0.5),
        vec_exec_unit.childAs<Txt>(0).text("VEC", 0.5),
    );
    yield* sequence(0.1,
        control_buffer_vecunit_data_wire_1().end(1, 0.5),
        control_buffer_vecunit_data_wire_2().end(1, 0.5),
        vecunit_outputbuffer_data_wire().end(1, 0.5),
    );

    yield* waitUntil("widenmdr");
    yield* chain(
        run(function* () { mdr().zIndex(10); }),
        all(
            mdr().scale(1.8, 1.2).back(1.2),
            mdr().stroke("yellow", 1.2).back(1.2),
            mdr_label().fill("yellow", 1.2).back(1.2),
            wiggle(mdr().rotation, -10, 10, 2.4),
            mdr().fill("#76692e", 1.2).back(1.2),
        ),
        run(function* () { mdr().zIndex(0); }),
    );
    yield* waitFor(1);
    yield* internals().y(internals().y() + 50, 0.5);
    
    yield* waitUntil("withsimd");
    yield* computer_stuff().x(-2000, 1.2);

    yield* all(
        simple_vec_addition_code().y(simple_vec_addition_code().y() + 1200, 1.2),
        simple_vec_addition_asm_form().y(simple_vec_addition_asm_form().y() + 1200, 1.2),
    );
    yield* waitFor(0.5);
    yield  simple_vec_addition_asm_form().x(simple_vec_addition_asm_form().x() - 100, 1.2);
    yield* simple_vec_addition_asm_form().code.edit(0.8)`\
; Loop stuff
        ${replace("mov     r8d, dword ptr [rsi + 4*rcx]", "vmovdqu xmm0, xmmword ptr [rsi + r9]")}
        add     r8d, dword ptr [rdi + 4*rcx]
        mov     dword ptr [rdx + 4*rcx], r8d
; Loop back`;
    yield* simple_vec_addition_asm_form().code.edit(0.8)`\
; Loop stuff
        vmovdqu xmm0, xmmword ptr [rsi + r9]
        ${replace("add     r8d, dword ptr [rdi + 4*rcx]", "vpaddd  xmm0, xmm0, xmmword ptr [rdi + r9]")}
        mov     dword ptr [rdx + 4*rcx], r8d
; Loop back`;
    yield* simple_vec_addition_asm_form().code.edit(0.8)`\
; Loop stuff
        vmovdqu xmm0, xmmword ptr [rsi + r9]
        vpaddd  xmm0, xmm0, xmmword ptr [rdi + r9]
        ${replace("mov     dword ptr [rdx + 4*rcx], r8d", "vmovdqu xmmword ptr [rdx + r9], xmm0")}
; Loop back`;

    yield* waitUntil("usingxmm");
    yield* simple_vec_addition_asm_form().selection([
        word(1, 16, 4),  //word(1, 22, 22),
        word(2, 16, 4),  word(2, 22, 4), //word(2, 28, 22),
        word(3, 40, 4),  //word(3, 16, 22),
    ], 0.5);
    yield* waitFor(1);
    yield* simple_vec_addition_asm_form().selection([
        word(1, 22, 22),
        word(2, 28, 22),
        word(3, 16, 22),
    ], 0.5);
    yield* waitUntil("numberoftimes");
    yield* simple_vec_addition_asm_form().selection(lines(1, 3), 0.5);
    yield* waitFor(2.5)
    view.add(<>
        <RoboticText ref={ntimeslabel}
            text={"n / 4"}
            position={[-700, 200+40]}
            fontSize={150} fontStyle={""}
            fill={"#8fbcbb"}
            opacity={0}
        />
    </>);

    yield all(
        ntimeslabel().y(ntimeslabel().y() - 40, 0.5),
        ntimeslabel().opacity(1, 0.5),
    );

    yield* waitUntil("gobackyouknow");
    yield* all(
        simple_vec_addition_code().y(simple_vec_addition_code().y() + 1200, 1.2),
        simple_vec_addition_asm_form().y(simple_vec_addition_asm_form().y() + 1200, 1.2),
        ntimeslabel().y(ntimeslabel().y() + 1200, 1.2),
    );

    yield* waitUntil("yapping");
    const biglabels = createRefArray<Txt>();
    view.add(<>
        <RoboticText ref={biglabels}
            // text={"DATA"}
            fontSize={250} fontStyle={""}
            fill={cosmic_grad_ramps[1][3]}
        />
        <RoboticText ref={biglabels}
            // text={"DATA"}
            y={100}
            fontSize={180} fontStyle={""}
            fill={cosmic_grad_ramps[1][4]}
        />
    </>);
    yield* biglabels[0].text("DATA", 1.2);
    yield* waitFor(1);
    yield* all(biglabels[0].y(-200, 1.2), biglabels[1].text("1 Instruction Per Cycle", 1.2).wait(1).to("1 IPC", 0.8));
    
    yield* waitUntil("however");
    yield* all(biglabels[0].y(-900, 1.2), biglabels[1].y(0, 1.2));
    yield* waitFor(3);
    yield* biglabels[1].text("> 1 IPC ?", 1.2);

    yield* waitUntil("thereasons");
    yield* biglabels[1].y(-900, 1.2);

    yield* waitUntil("reason1");
    const reasons = createRefArray<Layout>();
    const reason_numbers = createRefArray<Txt>();
    const reason_titles = createRefArray<Txt>();
    view.add(<>
        <Layout ref={reasons}
            position={[-900, -400]}
            offset={[-1, 0]}
            layout alignItems={"center"}
            gap={40}
        >
            <RoboticText ref={reason_numbers}
                fontSize={120} fontStyle={""}
                fill={cosmic_grad_ramps[1][4]}
                // text={"#1"}
            />
            <RoboticText ref={reason_titles}
                fontSize={100}
                fill={"#065797"}
                // text={"We have a single"}
            />
            <RoboticText ref={reason_titles}
                fontSize={120}
                fill={cosmic_grad_ramps[1][2]}
                // text={"Execution Unit"}
            />
        </Layout>
        <Layout ref={reasons}
            position={[-900, -400]}
            offset={[-1, 0]}
            layout alignItems={"center"}
            gap={40}
        >
            <RoboticText ref={reason_numbers}
                fontSize={100} fontStyle={""}
                fill={cosmic_grad_ramps[1][4]}
                // text={"#2"}
            />
            <RoboticText ref={reason_titles}
                fontSize={80}
                fill={"#065797"}
                // text={"Programs are"}
            />
            <RoboticText ref={reason_titles}
                fontSize={100}
                fill={cosmic_grad_ramps[1][2]}
                // text={"SEQUENTIAL"}
            />
            <RoboticText ref={reason_titles}
                fontSize={80}
                fill={"#065797"}
                // text={"sets of Instructions"}
            />
        </Layout>
    </>);
    yield* reason_numbers[0].text("#1", 0.8);
    yield* sequence(0.1,
        reason_titles[0].text("We have a single", 0.8),
        reason_titles[1].text("Execution Unit", 0.8),
    );

    yield* waitFor(2);
    const ten_add_parent = createRef<Node>();
    const ten_adds = createRefArray<Rect>();
    const ten_add_labels = createRefArray<Txt>();
    view.add(<>
        <Node ref={ten_add_parent}>
            {range(10).map(i => <Rect ref={ten_adds}
                x={-300} y={-220 + i*75 + 900}
                size={[300, 70]} radius={6}
                fill={"#007f9344"} 
                lineWidth={5} stroke={"#007f93"}
            >
                <RoboticText ref={ten_add_labels}
                    fill={"#007f93"} fontStyle={""}
                    y={4} fontSize={70}
                    text={"add"}
                />
            </Rect>)}
        </Node>
    </>);
    yield* sequence(0.1,
        ...ten_adds.map(t => t.y(t.y() - 900, 0.8)),
    );
    const alu_clone = alu().clone();
    alu_clone.x(-1800)
    view.add(alu_clone)
    yield* all(
        alu_clone.position([200, 120], 1.2),
        alu_clone.scale(2, 1.2),
    );
    yield* sequence(0.3,
        ...ten_adds.map(t => all(
            t.scale(0, 0.8),
            t.position(alu_clone.position(), 0.8),
        )),
    );
    yield* waitUntil("reason2");
    yield* all(
        reasons[0].y(-1200, 0.8),
        alu_clone.y(1200, 0.8),
    );

    yield* reason_numbers[1].text("#2", 0.8);
    yield* sequence(0.1,
        reason_titles[2].text("Programs are", 0.8),
        reason_titles[3].text("SEQUENTIAL", 0.8),
        reason_titles[4].text("sets of Instructions", 0.8),
    );

    yield* waitUntil("waitamin");
    yield* all(
        reasons[1].y(-1200, 0.8),
        reasons[0].y(-100, 0.8),
    );
    yield* waitFor(3);
    yield* all(
        reasons[1].y(-100, 0.8),
        reasons[0].y(-1200, 0.8),
    );

    const questionmark = createRef<Txt>();
    view.add(<>
        <RoboticText ref={questionmark}
            text={"?"}
            fill={"red"}
            fontSize={200} opacity={0}
            position={[870, -100+40]}
        />
    </>);
    yield* all(questionmark().opacity(1, 0.5), questionmark().y(questionmark().y() - 40, 0.5))
    
    yield* waitUntil("exampleprogram");
    yield* sequence(0.1,
        reasons[1].y(-1200, 0.8),
        questionmark().y(-1200, 0.8),
    );
    yield* waitFor(0.5);
    
    const example_OoO = createRef<Code>();
    const equivalence = createRef<Txt>();
    view.add(<>
        <Code ref={example_OoO}
            code={""}
        />
        <RoboticText ref={equivalence}
            fontSize={200} fontStyle={""}
            y={40} opacity={0}
            text={"="}
            fill={"#8fbcbb"}
        />
    </>);

yield* write_code(example_OoO(), `\
add     r0, r2, r3
imul    r1, r4, r5
add     r2, r0, r1

sub     r0, r2, r3
idiv    r1, r4, r5
mul     r2, r0, r1`, 1.2);
    yield* waitUntil("foisttwoinstructions");
    yield* all(
        example_OoO().selection(lines(0, 1), 0.8),
    )

    yield* waitUntil("equivalence");
    const example_OoO_too = example_OoO().clone();
    view.add(example_OoO_too);
    
    yield* all(example_OoO().x(-400, 0.5), example_OoO_too.x(400, 0.5));
    yield* waitFor(2);
    yield* example_OoO_too.code.edit(0.8)`\
${remove(`add     r0, r2, r3
`)}imul    r1, r4, r5
add     r2, r0, r1

sub     r0, r2, r3
idiv    r1, r4, r5
mul     r2, r0, r1`;
    yield* example_OoO_too.code.edit(0.8)`\
imul    r1, r4, r5${insert(`
add     r0, r2, r3`)}
add     r2, r0, r1

sub     r0, r2, r3
idiv    r1, r4, r5
mul     r2, r0, r1`;
    yield* all(equivalence().opacity(1, 0.5), equivalence().y(equivalence().y() - 40, 0.5));

    yield* waitUntil("turnsout");
    yield* sequence(0.1,
        example_OoO().y(example_OoO().y() + 1000, 1.2),
        equivalence().y(equivalence().y() + 1000, 1.2),
        example_OoO_too.y(example_OoO_too.y() + 1000, 1.2),
    );
    
    yield* waitUntil("instructionlevelparallel");
    const ilp_parent = createRef<Layout>();
    const ilp_txts = createRefArray<Txt>();
    const ilp_txt_strs = [ "Instruction", "Level", "Parallelism" ];
    extension_backing.splice(0, extension_backing.length);
    view.add(<>
        <Node ref={back_node}
            position={[0, 0]}
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
            
            <Layout ref={ilp_parent}
                layout gap={30}
                x={-6} y={6}
            >
                {...ilp_txt_strs.map((s, i) => <RoboticText ref={ilp_txts}
                    fontSize={140}
                    fill={cosmic_grad_ramps[1][i+2]}
                    // text={s}
                />)}
            </Layout>
        </Node>
        <Node ref={spotlight_parent}
            position={[0, -300]}
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
    const cachesback_loop = yield loopFor(Infinity, function* () {
        yield* all(
            back_rect().rotation(back_rect().rotation() + 360, 4),
            back_rect_out_highlight().rotation(back_rect_out_highlight().rotation() - 360, 4),
        )
    });
    yield* sequence(0.1,
        ...ilp_txts.map((t, i) => t.text(ilp_txt_strs[i], 0.8)),
    );
    yield* waitFor(0.5);
    yield* sequence(0.2,
        all(
            ilp_parent().gap(5, 0.8),
            sequence(0.1,
                ...ilp_txts.map((t, i) => t.text(ilp_txt_strs[i][0], 0.8)),
            )
        ),
        back_node().y(-300, 1.2),
        sequence(0.05,
            back_rect().size(180, 0.5),
            back_rect_out_highlight().size(200, 0.5),
            ...extension_backing.map((t, i) => all(
                t.start(0, 0.4),
                t.end(1, 0.4),
            )),
        )
    );
    yield* waitUntil("achievethis");
    
    yield* sequence(0.05,
        ...extension_backing.map((t, i) => all(
            t.start(0.5, 0.4),
            t.end(0.5, 0.4),
        )),
        back_node().y(-1000, 1.2),
    );

    yield* waitUntil("end");
});