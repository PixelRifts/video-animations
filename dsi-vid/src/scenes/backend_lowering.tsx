import { CameraView } from "@ksassnowski/motion-canvas-camera";
import { CODE, Code, LezerHighlighter, Node, Rect, blur, brightness, insert, makeScene2D, remove, replace } from "@motion-canvas/2d";
import { Color, SimpleSignal, all, chain, createRef, createSignal, makeRef, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { NeonCode, NeonIcon, NeonLine, NeonRect, NeonText } from "../neon/neon_items";
import { append_to_code, append_to_str, shiftx, shiftx_all, shifty } from "../animations/misc";
import { AST } from "../comps/ast";
import { softpurple } from "../utils/colors";
import { flicker_in, flicker_out } from "../animations/io";
import { notification } from "../animations/items";

import { parser } from '@lezer/cpp';
Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeScene2D(function* (_view) {
    const view = createRef<CameraView>();
    _view.add(<CameraView ref={view} width={"100%"} height={"100%"} />)
    
    const ast_icon = createRef<NeonIcon>();
    const tick_icon = createRef<NeonIcon>();
    const right_arrow = createRef<NeonLine>();
    const asm_icon = createRef<NeonIcon>();
    const graph_icon = createRef<NeonIcon>();
    const schedule_icon = createRef<NeonIcon>();
    const graph_icon_2 = createRef<NeonIcon>();
    const pipe_arrows: NeonLine[] = [];
    view().add(<>
        <NeonIcon
            ref={ast_icon}
            icon={"streamline:interface-hierarchy-2-node-organization-links-structure-link-nodes-network-hierarchy"}
            size={208}
            x={-400} y={0}
            alpha={0} icon_alpha={0}
            glow={new Color("#828")}
        />
        <NeonIcon
            ref={tick_icon}
            icon={"teenyicons:tick-circle-outline"}
            x={-300} y={75} size={100}
            alpha={0} icon_alpha={0}
            glow={new Color("#282")}
        />
        <NeonIcon
            ref={asm_icon}
            icon={"file-icons:assembly-arm"}
            size={208}
            x={400} y={0}
            alpha={0} icon_alpha={0}
            glow={new Color("#828")}
        />
        <NeonLine
            ref={right_arrow}
            points={[[-150, 0], [150, 0]]}
            border={45} endArrow zIndex={-1}
            alpha={0}
            glow={new Color("#382")}
        />
        <NeonIcon
            ref={graph_icon}
            icon={"ph:graph-light"}
            size={258}
            x={-400} y={0}
            alpha={0} icon_alpha={0}
            glow={new Color("#828")}
        />
        <NeonIcon
            ref={schedule_icon}
            icon={"icon-park-outline:schedule"}
            size={258}
            x={0} y={300}
            alpha={0} icon_alpha={0}
            glow={new Color("#828")}
        />
        <NeonIcon
            ref={graph_icon_2}
            icon={"ph:graph-light"}
            size={258}
            x={400} y={0}
            alpha={0} icon_alpha={0}
            glow={new Color("#828")}
        />

        <>
            <NeonLine
                ref={makeRef(pipe_arrows, 0)}
                points={[[-400, -275], [-400, -125]]}
                border={25} endArrow zIndex={-1}
                alpha={0}
                glow={new Color("#283")}
            />
            <NeonLine
                ref={makeRef(pipe_arrows, 1)}
                points={[[-400, 125], [-175, 300]]}
                border={25} endArrow zIndex={-1}
                alpha={0}
                glow={new Color("#283")}
            />
            <NeonLine
                ref={makeRef(pipe_arrows, 2)}
                points={[[175, 300], [400, 125]]}
                border={25} endArrow zIndex={-1}
                alpha={0}
                glow={new Color("#283")}
            />
            
            <NeonLine
                ref={makeRef(pipe_arrows, 3)}
                points={[[400, -125], [400, -275]]}
                border={25} endArrow zIndex={-1}
                alpha={0}
                glow={new Color("#283")}
            />
            
        </>
    </>);


    yield* waitFor(2);
    yield* ast_icon().flicker_in(1);
    yield* waitFor(2);
    yield* tick_icon().flicker_in(1);
    yield* waitFor(2.5);
    yield* right_arrow().flicker_in(1);
    yield* asm_icon().flicker_in(1);

    yield* waitUntil("real_compilers");
    yield* all(
        shifty(ast_icon(), -400, 0.5),
        shifty(tick_icon(), -400, 0.5),
        shifty(asm_icon(), -400, 0.5),
        shifty(right_arrow(), -400, 0.5),
        right_arrow().alpha(0.1, 0.5)
    );
    yield* sequence(0.1,
        pipe_arrows[0].flicker_in(1),
        graph_icon().flicker_in(1),
        pipe_arrows[1].flicker_in(1),
        schedule_icon().flicker_in(1),
        pipe_arrows[2].flicker_in(1),
        graph_icon_2().flicker_in(1),
        pipe_arrows[3].flicker_in(1),
    );

    yield* waitUntil("getmetherealready");
    yield* sequence(0.1,
        pipe_arrows[3].flicker_out(1),
        graph_icon_2().flicker_out(1),
        pipe_arrows[2].flicker_out(1),
        schedule_icon().flicker_out(1),
        pipe_arrows[1].flicker_out(1),
        graph_icon().flicker_out(1),
        pipe_arrows[0].flicker_out(1),
    );
    yield* all(
        shifty(ast_icon(), 400, 0.5),
        shifty(tick_icon(), 400, 0.5),
        shifty(asm_icon(), 400, 0.5),
        shifty(right_arrow(), 400, 0.5),
        right_arrow().alpha(1.0, 0.5)
    );
    pipe_arrows.map(t => t.remove());
    graph_icon().remove();
    schedule_icon().remove();
    graph_icon_2().remove();

    yield* waitUntil("howdoidothat");
    const podft_txt = createRef<NeonText>();
    const ast_ref_b2 = createRef<AST>();
    const ast_ref_b1 = createRef<AST>();
    const ast_ref = createRef<AST>();
    view().add(<>
        <NeonText
            ref={podft_txt}
            size={75}
            txt={""} y={-400}
        />
        <AST
            ref={ast_ref_b2}
            node_contents={["+", ["2", ["*", ["3", "4"]]]]}
            node_size={100} node_thickness={25}
            y_layer_increment={200}
            y={-100}
            inactive_accent={"#333"}
            filters={[blur(10.5)]}
        />
        <AST
            ref={ast_ref_b1}
            node_contents={["+", ["2", ["*", ["3", "4"]]]]}
            node_size={100} node_thickness={25}
            y_layer_increment={200}
            y={-100}
            inactive_accent={"#333"}
            filters={[blur(5.5),brightness(1)]}
        />
        <AST
            ref={ast_ref}
            node_contents={["+", ["2", ["*", ["3", "4"]]]]}
            node_size={100} node_thickness={25}
            y_layer_increment={200}
            y={-100}
            inactive_accent={"#333"}
        />
    </>);
    yield* append_to_str(podft_txt(), "Post-Order", 0.5);
    yield* waitFor(0.5);
    yield* append_to_str(podft_txt(), " Depth-First", 0.5);
    yield* waitFor(0.25);
    yield* append_to_str(podft_txt(), " Traversal", 0.5);
    yield* waitFor(0.5);
    yield* sequence(0.1,
        ast_icon().flicker_out(1),
        tick_icon().flicker_out(1),
        right_arrow().flicker_out(1),
        asm_icon().flicker_out(1),
    );
    yield* all(ast_ref().open(), ast_ref_b1().open(), ast_ref_b2().open());
    
    yield* all(ast_ref().subtrees[0]().select(true),
        ast_ref_b1().subtrees[0]().select(true),
        ast_ref_b2().subtrees[0]().select(true));
    yield* all(ast_ref().subtrees[1]().subtrees[0]().select(true),
        ast_ref_b1().subtrees[1]().subtrees[0]().select(true),
        ast_ref_b2().subtrees[1]().subtrees[0]().select(true));
    yield* all(ast_ref().subtrees[1]().subtrees[1]().select(true),
        ast_ref_b1().subtrees[1]().subtrees[1]().select(true),
        ast_ref_b2().subtrees[1]().subtrees[1]().select(true));
    yield* all(
        ast_ref().subtrees[1]().line_inactive_end(0, 0.5),
        ast_ref_b1().subtrees[1]().line_inactive_end(0, 0.5),
        ast_ref_b2().subtrees[1]().line_inactive_end(0, 0.5),
    );
    yield* all(ast_ref().subtrees[1]().select(true),
        ast_ref_b1().subtrees[1]().select(true),
        ast_ref_b2().subtrees[1]().select(true));
    yield* all(
        ast_ref().line_inactive_end(0, 0.5),
        ast_ref_b1().line_inactive_end(0, 0.5),
        ast_ref_b2().line_inactive_end(0, 0.5),
    );
    yield* all(ast_ref().select(true),
        ast_ref_b1().select(true),
        ast_ref_b2().select(true));

    yield* waitUntil("how2lower");
    yield* all(
        flicker_out(ast_ref(), 1),
        flicker_out(ast_ref_b1(), 1),
        flicker_out(ast_ref_b2(), 1)
    );
    yield* podft_txt().txt("Basic Lowering", 1.2);
    ast_ref().remove();
    ast_ref_b1().remove();
    ast_ref_b2().remove();

    yield* waitUntil("show_cpu_regs");
    const cpu = createRef<NeonRect>();
    const cpu_lbl = createRef<NeonText>();
    const registers_col1: Rect[] = [];
    const registers_col2: Rect[] = [];
    const registers_col1_lbls: NeonText[] = [];
    const registers_col2_lbls: NeonText[] = [];
    const lbls: SimpleSignal<string, void>[] = [];
    for (let i = 0; i < 16; i++) lbls[i] = createSignal(String.fromCharCode(65+i));
    view().add(<>
        <NeonRect
            ref={cpu}
            width={300} height={300}
            border={10}
            glow={"#338"}
            alpha={0}
        >
            <NeonText
                ref={cpu_lbl}
                txt={"CPU"} size={100}
                glow={new Color("#338")}
                alpha={0} text_alpha={0}
            />
        </NeonRect>
        {...range(8).map(i => <>
            <Rect
                ref={makeRef(registers_col1, i)}
                x={-175} width={200} height={40} y={-75 + i*50}
                stroke={new Color("#283").brighten(1)} lineWidth={5}
                filters={[blur(2)]} opacity={0}
                radius={4}
            />
            <Rect
                ref={makeRef(registers_col2, i)}
                x={175} width={200} height={40} y={-75 + i*50}
                stroke={new Color("#283").brighten(1)} lineWidth={5}
                filters={[blur(2)]} opacity={0}
                radius={4}
            />
            <NeonText
                ref={makeRef(registers_col1_lbls, i)}
                x={-175} y={-75 + i*50}
                glow={new Color("#283")} diffusion={0.5}
                txt={()=>lbls[i]()} alpha={0} text_alpha={0}
            />
            <NeonText
                ref={makeRef(registers_col2_lbls, i)}
                x={175} y={-75 + i*50}
                glow={new Color("#283")} diffusion={0.5}
                txt={()=>lbls[i+8]()} alpha={0} text_alpha={0}
            />
        </>)}
    </>);
    yield* all(
        cpu().flicker_in(1),
        cpu_lbl().flicker_in(1),
    );
    yield* waitUntil("expand_to_regs");
    yield* sequence(0.1, cpu_lbl().flicker_out(1), cpu().width(800, 0.5), cpu().height(500, 0.5), cpu().y(100, 0.5));
    cpu_lbl().remove();
    yield* sequence(0.8,
        sequence(0.1,
            ...range(8).map(i => all(
                flicker_in(registers_col1[i], 1),
                registers_col1_lbls[i].flicker_in(1),
            )),
        ),
        sequence(0.1,
            ...range(8).map(i => all(
                flicker_in(registers_col2[i], 1),
                registers_col2_lbls[i].flicker_in(1),
            )),
        ),
    );

    yield* waitFor(4);
    yield* sequence(0.05,
        ...lbls.map((l, i) => l("R"+i, 0.5)),
    );
    yield* waitUntil("regs_anim");
    

    const instructions: NeonText[] = [];
    const values: NeonText[] = [];
    const values2: NeonText[] = [];
    const instr_strs = [
        "mov r0, r1",
        "ldr r2, [r3]",
        "add r4, r0, r2",
        "b 0x12345678"
    ];
    view().add(<>
        {...range(4).map(i => <NeonText
            ref={makeRef(instructions, i)}
            x={500} y={-75 + i*100}
            size={75}
            glow={new Color("#283")} diffusion={0.5}
            txt={instr_strs[i]}
            alpha={0} text_alpha={0}
        />)}
        <NeonText
            ref={makeRef(values, 0)}
            position={()=>registers_col1[1].position()} shadow={false}
            txt={"10"} size={40} diffusion={0.5}
            alpha={0} text_alpha={0}
        />
        <NeonText
            ref={makeRef(values, 1)}
            position={()=>registers_col1[3].position()} shadow={false}
            txt={"0x87654321"} size={38} diffusion={0.35}
            alpha={0} text_alpha={0}
        />
        <NeonText
            ref={makeRef(values, 2)}
            position={[-1200, registers_col1[2].position().y]} shadow={false}
            txt={"40"} size={40} diffusion={0.5}
            alpha={0} text_alpha={0}
        />
        <NeonText
            ref={makeRef(values, 3)}
            position={()=>registers_col1[1].position()} shadow={false}
            txt={"10"} size={38} diffusion={0.35}
            alpha={0} text_alpha={0}
        />
        <NeonText
            ref={makeRef(values2, 0)}
            position={()=>registers_col1[0].position()} shadow={false}
            txt={"10"} size={40} diffusion={0.5}
            alpha={0} text_alpha={0}
        />
        <NeonText
            ref={makeRef(values2, 1)}
            position={()=>registers_col1[2].position()} shadow={false}
            txt={"40"} size={40} diffusion={0.5}
            alpha={0} text_alpha={0}
        />
        <NeonText
            ref={makeRef(values2, 2)}
            position={()=>registers_col2[7].position()} shadow={false}
            txt={"0x12345678"} size={40} diffusion={0.5}
            alpha={0} text_alpha={0}
        />
        
    </>);

    yield* all(
        shiftx_all(-400, 0.25,
            cpu(),
            ...registers_col1, ...registers_col1_lbls,
            ...registers_col2, ...registers_col2_lbls,
        ),
    );
    yield* sequence(0.05,
        ...registers_col1_lbls.map(t => sequence(0.05,t.size(38,0.5),shiftx(t, -145, 0.5))),
        ...registers_col2_lbls.map(t => sequence(0.05,t.size(38,0.5),shiftx(t, 145, 0.5))),
        ...values.map(t=>t.flicker_in(1)),
    );
    yield* sequence(0.3, instructions[0].flicker_in(1), values[3].position(()=>registers_col1[0].position(), 1.2));
    yield* waitFor(1);
    yield* sequence(0.3, instructions[1].flicker_in(1), values[2].position(()=>registers_col1[2].position(), 1.2));
    yield* waitFor(2);
    yield* sequence(0.3, instructions[2].flicker_in(1), all(
        values2[0].alpha(1, 0.5), values2[0].text_alpha(1, 0.5),
        values2[1].alpha(1, 0.5), values2[1].text_alpha(1, 0.5),
        values2[0].position(()=>registers_col1[4].position(), 1.2),
        values2[1].position(()=>registers_col1[4].position(), 1.2),
        chain(waitFor(0.7), all(
            values2[1].alpha(0, 0.5), values2[1].text_alpha(0, 0.5),
            values2[0].txt("50", 0.5),
        )),
    ));
    yield* waitFor(1);
    yield* sequence(0.3, instructions[3].flicker_in(1), values2[2].flicker_in(1));

    yield* waitUntil("exampletime");
    yield* all(
        shiftx_all(-1200, 0.5,
            cpu(),
            ...registers_col1, ...registers_col1_lbls,
            ...registers_col2, ...registers_col2_lbls,
        ),
    );
    yield* sequence(0.1,
        ...instructions.map(t=>t.flicker_out(1))
    );
    
    cpu().remove()
    registers_col1.map(t=>t.remove());
    registers_col1_lbls.map(t=>t.remove());
    registers_col2.map(t=>t.remove());
    registers_col2_lbls.map(t=>t.remove());
    instructions.map(t=>t.remove());

    const simple_tree: AST[] = [];
    const lowered_code = createRef<NeonCode>();
    view().add(<>
        <AST
            ref={makeRef(simple_tree,2)}
            node_contents={["+", ["10", "2"]]}
            node_size={100} node_thickness={25}
            y_layer_increment={200}
            y={0} x={-400}
            inactive_accent={"#333"}
            filters={[blur(10.5)]}
        />
        <AST
            ref={makeRef(simple_tree,1)}
            node_contents={["+", ["10", "2"]]}
            node_size={100} node_thickness={25}
            y_layer_increment={200}
            y={0} x={-400}
            inactive_accent={"#333"}
            filters={[blur(5.5)]}
        />
        <AST
            ref={makeRef(simple_tree,0)}
            node_contents={["+", ["10", "2"]]}
            node_size={100} node_thickness={25}
            y_layer_increment={200}
            y={0} x={-400}
            inactive_accent={"#333"}
        />
        <NeonCode
            ref={lowered_code}
            code={CODE``} size={75}
            x={400} y={100}
        />
    </>);
    yield* all(...simple_tree.map(t=>t.open()));

    yield* waitFor(2);
    yield* sequence(0.3,
        all(...simple_tree.map(t=>t.subtrees[0]().select(true))),
        append_to_code(lowered_code(), "ldr r0, #10   ", 0.5),
    );
    yield* waitFor(1);
    yield* sequence(0.3,
        all(...simple_tree.map(t=>t.subtrees[1]().select(true))),
        append_to_code(lowered_code(), "\nldr r1, #2", 0.5),
    );
    yield* waitFor(1);
    yield* sequence(0.3,
        chain(
            all(...simple_tree.map(t=>t.line_inactive_end(0, 0.4))),
            all(...simple_tree.map(t=>t.select(true))),
        ),
        append_to_code(lowered_code(), "\nadd r0, r0, r1", 0.5),
    );
    yield* waitFor(14);
    yield* lowered_code().selection([
        [[0,4], [0,6]],
        [[1,4], [1,6]],
        [[2,4], [2,6]], [[2,8], [2,10]], [[2,12], [2,14]]], 0.5);

    yield* notification(view(), "allocstrat", "Register Allocation Strategy", -200, 85);
    yield* podft_txt().txt("Stack Machine", 0.5);
    yield* podft_txt().size(90, 0.5);
    yield* lowered_code().flicker_out(1);
    
    yield* all(...simple_tree.map(t=>t.select(false)));
    yield* all(...simple_tree.map(t=>t.line_inactive_end(1, 0.5)));
    yield* all(
        all(...simple_tree.map(t=>t.subtrees[0]().select(false))),
        all(...simple_tree.map(t=>t.subtrees[1]().select(false))),
    );
    
    
    yield* waitUntil("showstack");
    const stack = createRef<Node>();
    const stackleft = createRef<NeonLine>();
    const stackright = createRef<NeonLine>();
    const stackbottom = createRef<NeonLine>();
    const elem10 = createRef<NeonRect>();
    const elem2 = createRef<NeonRect>();
    const elem12 = createRef<NeonRect>();
    view().add(<>
        <Node ref={stack} x={400} y={150} opacity={0}>
            <NeonLine
                ref={stackleft}
                points={[[-200,-300],[-200, 300]]}
                border={10} glow={"#388"}
            />
            <NeonLine
                ref={stackright}
                points={[[200,-300],[200, 300]]}
                border={10} glow={"#388"}
            />
            <NeonLine
                ref={stackbottom}
                points={[[-205,300],[205, 300]]}
                border={10} glow={"#388"}
            />
        </Node>
        <NeonRect
            ref={elem10}
            x={400} y={200}
            width={290} height={100} border={5}
            alpha={0}
        >
            <NeonText
                txt={"10"}
                alpha={()=>elem10().alpha()} text_alpha={()=>elem10().alpha()}
            />
        </NeonRect>
        <NeonRect
            ref={elem2}
            x={400} y={50}
            width={290} height={100} border={5}
            alpha={0}
        >
            <NeonText
                txt={"2"}
                alpha={()=>elem2().alpha()} text_alpha={()=>elem2().alpha()}
            />
        </NeonRect>
        <NeonRect
            ref={elem12}
            x={400} y={200}
            width={290} height={100} border={5}
            alpha={0}
        >
            <NeonText
                txt={"12"}
                alpha={()=>elem12().alpha()} text_alpha={()=>elem12().alpha()}
            />
        </NeonRect>
    </>);
    yield* flicker_in(stack(), 1);
    yield* waitFor(8);
    yield* sequence(0.3,
        all(...simple_tree.map(t=>t.subtrees[0]().select(true))),
        all(elem10().alpha(1, 0.5), shifty(elem10(), 150, 0.5)),
    );
    yield* sequence(0.3,
        all(...simple_tree.map(t=>t.subtrees[1]().select(true))),
        all(elem2().alpha(1, 0.5), shifty(elem2(), 150, 0.5)),
    );
    yield* waitFor(2);
    yield* sequence(0.3,
        chain(
            all(...simple_tree.map(t=>t.line_inactive_end(0, 0.5))),
            all(...simple_tree.map(t=>t.select(true))),
        ),
        chain(
            all(elem2().alpha(0, 0.5), shifty(elem2(), -150, 0.5)),
            all(elem10().alpha(0, 0.5), shifty(elem10(), -150, 0.5)),
            all(elem12().alpha(1, 0.5), shifty(elem12(), 150, 0.5)),
        )
    );
    yield* waitUntil("sp_explain");
    yield* all(...simple_tree.map(t=>flicker_out(t, 1)));
    yield*  elem12().flicker_out(1);
    yield*  flicker_out(stack(), 1);
    simple_tree.map(t=>t.remove());
    view().add(<>
        {cpu()}
        {...registers_col1}
        {...registers_col1_lbls}
        {...registers_col2}
        {...registers_col2_lbls}
        {...instructions}
    </>)
    yield* all(
        shiftx_all(1600, 0.5,
            cpu(),
            ...registers_col1, ...registers_col1_lbls,
            ...registers_col2, ...registers_col2_lbls,
        ),
    );
    yield* waitFor(5);
    yield* lbls[13]("SP", 0.5);
    yield* registers_col2_lbls[5].glow("#838", 0.5);
    yield* waitUntil("pushpop");
    yield* 
        shiftx_all(-400, 0.5,
            cpu(),
            ...registers_col1, ...registers_col1_lbls,
            ...registers_col2, ...registers_col2_lbls,
        );
    
    const functions = createRef<NeonCode>();
    view().add(
        <NeonCode
            ref={functions}
            x={400} y={100}
            code={CODE`\
void push(int reg);
void pop(int reg);`}
            alpha={0}
        />
    );
    yield* functions().flicker_in(1);
    yield* waitFor(18);
    yield* all(
        shiftx(functions(), 100, 0.5),
        functions().code(CODE`\
void push(int reg, Type* t);
void pop(int reg, Type* t);`, 0.5)
    );

    yield* waitUntil("timetolower");
    
    yield* all(
        shiftx_all(-1200, 0.5,
            cpu(),
            ...registers_col1, ...registers_col1_lbls,
            ...registers_col2, ...registers_col2_lbls,
        ),
    );
    yield* functions().flicker_out(1);
    
    cpu().remove()
    registers_col1.map(t=>t.remove());
    registers_col1_lbls.map(t=>t.remove());
    registers_col2.map(t=>t.remove());
    registers_col2_lbls.map(t=>t.remove());
    instructions.map(t=>t.remove());
    yield* waitFor(2);

    yield* podft_txt().txt("Lower(ASTNode* node) implementation", 0.5);
    yield* waitFor(7);
    yield* podft_txt().txt("Lower(Expr) implementation", 0.5);
    const lower_expr = createRef<NeonCode>();
    view().add(
        <NeonCode
            ref={lower_expr}
            code={CODE``}
            y={100}
        />
    );
    yield* append_to_code(lower_expr(), "case NT_Add:", 0.5);
    yield* append_to_code(lower_expr(), "\n\tLower(node->binary_op.left);", 1.0);
    yield* append_to_code(lower_expr(), "\n\tLower(node->binary_op.right);", 1.0);
    yield* waitFor(1);
    yield* append_to_code(lower_expr(), "\n\n\tpop(1, node->binary_op.right->type);", 1.0);
    yield* append_to_code(lower_expr(), "\n\tpop(0, node->binary_op.left->type);", 1.0);
    yield* waitFor(2);
    yield* append_to_code(lower_expr(), "\n\n\tinstr(\"add r0, r0, r1\");", 0.5);
    yield* append_to_code(lower_expr(), "\n\tpush(0, node->type);", 0.5);

    yield* waitFor(4);
    yield* lower_expr().flicker_out(1);
    yield* lower_expr().code(CODE``, 0);
    yield* waitFor(0.5);
    yield* podft_txt().txt("Lower(Stmt) implementation", 1.5);

    yield* waitUntil("ifstmttime");
    yield* lower_expr().alpha(1,0);
    yield* append_to_code(lower_expr(), "case NT_If:                     ", 0.5);
    yield* waitFor(5);
    yield* append_to_code(lower_expr(), "\n\tLower(node->if_s.cond);", 1.0);
    yield* waitFor(2);
    yield* append_to_code(lower_expr(), "\n\tpop(0, node->if_s.cond->type);", 1.0);
    yield* waitFor(2);
    yield* append_to_code(lower_expr(), "\n\tinstr(\"cmp r0, #0\");", 1.0);
    yield* append_to_code(lower_expr(), "\n\tinstr(\"beq label_1\");", 1.0);

    yield* append_to_code(lower_expr(), "\n\n\t// Write then block under label_0", 0.5);
    yield* append_to_code(lower_expr(), "\n\n\t// Write else block under label_1", 0.5);
    
    
    yield* waitUntil("whileloops");
    yield* lower_expr().code.edit(1.2)`\
case NT_${replace("If", "While")}:                     
\tLower(node->${replace("if", "while")}_s.cond);
\tpop(0, node->${replace("if", "while")}_s.cond->type);
\tinstr("cmp r0, #0");
\tinstr("beq label_1");

\t// Write ${replace("then", "loop")} block under label_0

\t// Write ${remove("else block under ")}label_1 ${insert("without extra code")}
`;
    
    yield* waitUntil("unshowme");
    yield* lower_expr().flicker_out(1);
    yield* podft_txt().flicker_out(1);
    

    
    yield* waitUntil("end");
    const title_me = createRef<NeonText>();
    view().add(<NeonText
        ref={title_me}
        size={200}
        glow={new Color("#388")}
        alpha={0} text_alpha={0}
        txt={"Functions"}
    />);
    yield* title_me().flicker_in(1);
    yield* waitFor(3);
});