import { CODE, Circle, Code, Gradient, LezerHighlighter, Node, Txt, blur, brightness, lines, makeScene2D, word } from "@motion-canvas/2d";
import { Color, DEFAULT, Reference, all, chain, createRef, createRefArray, makeRef, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { NeonCircle, NeonCode, NeonCubicBezier, NeonImage, NeonLine, NeonRect, NeonText, NeonVideo } from "../neon/neon_items";
import { CameraView } from "@ksassnowski/motion-canvas-camera";
import { flicker_in, flicker_out } from "../animations/io";
import { correction, notification, notification_placed } from "../animations/items";
import { code_get_token, shiftx, shiftx_all, shifty_all } from "../animations/misc";

import { parser } from '@lezer/cpp';

import taggingsubplotvid from "../extern/taggingsubplot.mp4"
import cuikvid from "../extern/cuik.mp4"
import negateimg from "../extern/negate.png"

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeScene2D(function* (_view) {
    const view = createRef<CameraView>();
    _view.add(<CameraView ref={view} width={"100%"} height={"100%"}/>);

    const typechecking_title = createRef<NeonText>();
    const typecheck_code = createRef<NeonCode>();
    const tagging_vid = createRef<NeonVideo>();
    
    view().add(<>
        <NeonText
            ref={typechecking_title}
            size={105} y={-400}
            glow={new Color("#838")}
            txt={"Typechecking"}
        />
        <NeonCode
            ref={typecheck_code}
            y={100}
            code={CODE`\
main :: func() {
  a := 10 + 20;
  printf("Hello, World!\\n");
  b := 30 * 40;
  c := 40.0 + 2 * 3;
  printf(10);
};`}
            alpha={0}
            glow={new Color("#fff")}
        />
        <NeonVideo
            ref={tagging_vid}
            video_source={taggingsubplotvid}
            x={350} y={100}
            width={500} height={500}
            intensity={1.0} alpha={0} video_alpha={0}
            glow={new Color("#823")}
        />
    </>);
    yield* waitFor(3);
    yield* typecheck_code().flicker_in(1);

    yield* waitUntil("substitute_numbers");
    yield* sequence(0.1,
        typecheck_code().code.replace(word(1,7,2), CODE`i32`, 0.5),
        typecheck_code().code.replace(word(1,12,2), CODE`i32`, 0.5),
        typecheck_code().code.replace(word(3,7,2), CODE`i32`, 0.5),
        typecheck_code().code.replace(word(3,12,2), CODE`i32`, 0.5),
        typecheck_code().code.replace(word(4,14,1), CODE`i32`, 0.5),
        typecheck_code().code.replace(word(4,18,1), CODE`i32`, 0.5),
        typecheck_code().code.replace(word(4,7,4), CODE`f32`, 0.5),
        typecheck_code().code.replace(word(5,9,2), CODE`i32`, 0.5),
    );
    yield* typecheck_code().code.replace(word(2,9,17), CODE`str`, 0.5),

    yield* waitUntil("substitute_lv1");
    yield* sequence(0.1,
        typecheck_code().code.replace(word(1,5,11), CODE` i32`, 0.5),
        typecheck_code().code.replace(word(3,5,11), CODE` i32`, 0.5),
        typecheck_code().code.replace(word(4,5,2), CODE` `, 0.5),
        typecheck_code().code.replace(word(4,13,9), CODE`i32`, 0.5),
    );
    yield* waitUntil("substitute_lv2");
    yield* typecheck_code().code.replace(word(4,6,9), CODE`f32`, 0.5);

    yield* waitFor(3);
    yield* typecheck_code().selection(lines(5), 0.5);
    yield* waitFor(3);
    yield* typecheck_code().code.insert([4, 10], CODE`\n  // Error: Expected str, got i32`, 0.5);
    yield* typecheck_code().selection([[5, 0], [6, Infinity]], 0.5);
    yield* waitFor(2);
    yield* sequence(0.1,
        typecheck_code().size(40, 0.5),
        shiftx(typecheck_code(), -400, 0.5),
        typecheck_code().selection(DEFAULT, 0.5),
    );
    yield* waitFor(0.5);
    tagging_vid().seek_and_play(5);
    yield* all(tagging_vid().alpha(1, 0.5), tagging_vid().video_alpha(1, 0.5));
    
    yield* waitUntil("well_not_really");
    yield* all(tagging_vid().alpha(0, 0.5), tagging_vid().video_alpha(0, 0.5));
    yield* sequence(0.1,
        shiftx(typecheck_code(), 400, 0.5),
        typecheck_code().size(48, 0.5),
    );
    yield* waitFor(2);
    yield* typecheck_code().code(CODE`\
main :: func() {
  a := 10 + 20;
  printf("Hello, World!\\n");
  b := 30 * 40;
  c := 40.0 + 2 * 3;
  printf(10);
};`, 0.5);
    yield* typecheck_code().selection([
        [[1,7],[1,9]], [[1,12],[1,14]],
        [[3,7],[3,9]], [[3,12],[3,14]],
        [[4,7],[4,11]], [[4,14],[4,15]], [[4,18],[4,19]],
        [[5,9],[5,11]], [[2,9],[2,26]],
    ], 0.5);

    yield* waitFor(3);
    yield* typecheck_code().selection(DEFAULT, 0.5);
    yield* typecheck_code().code.replace([[3,7], [3,9]], CODE`a`, 0.5);
    yield* typecheck_code().code.replace([[4,14], [4,15]], CODE`a`, 0.5);
    yield* typecheck_code().code.replace([[4,18], [4,19]], CODE`b`, 0.5);

    yield* waitUntil("solution_1");
    yield* sequence(0.1,
        typecheck_code().size(40, 0.5),
        shiftx(typecheck_code(), -400, 0.5),
    );
    yield* waitFor(5.4);
    yield* typecheck_code().selection(lines(1), 0.5);
    yield* typecheck_code().code.replace([[1,5],[1,15]], CODE` i32;`, 0.5);

    const token_strings = [
        "a",
        "i32",
    ];
    const tokens = [
        code_get_token(typecheck_code().code_ref(), "a",1),
        code_get_token(typecheck_code().code_ref(), "i32"),
    ];
    const token_colors_list = [
        "#81a1c1",
        "#8cb8b7",
    ];
    const token_copies: Txt[] = [];
    const token_copies_b1: Txt[] = [];
    const token_copies_b2: Txt[] = [];
    const symtable_txt = createRef<NeonText>();
    const symtable_rect = createRef<NeonRect>();
    const globals_txt = createRef<NeonText>();
    view().add(<>
        {...tokens.map((s,i) => <>
            <Txt
                ref={makeRef(token_copies_b2, i)}
                fontFamily={"monospace"}
                fontSize={38}
                text={token_strings[i]} fill={token_colors_list[i]}
                position={() => s().position.add(s().size.div(2))
                                .add(typecheck_code().position())
                                .addY(4)}
                filters={[blur(10)]}
                opacity={0}
            />
            <Txt
                ref={makeRef(token_copies_b1, i)}
                fontFamily={"monospace"}
                fontSize={38}
                text={token_strings[i]} fill={token_colors_list[i]}
                position={() => s().position.add(s().size.div(2))
                                .add(typecheck_code().position())
                                .addY(4)}
                filters={[blur(5),brightness(0.5)]}
                opacity={0}
            />
            <Txt
                ref={makeRef(token_copies, i)}
                fontFamily={"monospace"}
                fontSize={38}
                text={token_strings[i]} fill={token_colors_list[i]}
                position={() => s().position.add(s().size.div(2))
                                .add(typecheck_code().position())
                                .addY(4)}
                filters={[brightness(1)]}
                opacity={0}
            />
        </>)}
        <NeonText
            ref={symtable_txt}
            txt={"Symbol Table"}
            x={600} y={-100}
            size={70} glow={new Color("#388")}
            alpha={0} text_alpha={0}
        />
        <NeonText
            ref={globals_txt}
            txt={"GLOBAL DECLARATIONS"}
            rotation={-15}
            size={205} glow={new Color("#823")}
            alpha={0} text_alpha={0}
        />
        <NeonRect
          ref={symtable_rect}
          x={600} y={75}
          width={500} height={500}
          glow={new Color("#388")} alpha={0} border={15}
          zIndex={-1}
        />
    </>);
    yield* all(token_copies[0].opacity(1,0),token_copies_b1[0].opacity(1,0),token_copies_b2[0].opacity(1,0));
    yield* all(token_copies[1].opacity(1,0),token_copies_b1[1].opacity(1,0),token_copies_b2[1].opacity(1,0));
    yield* waitFor(2);
    yield* sequence(0.1,
        shiftx_all(1200, 0.8, token_copies[0], token_copies[1]),
        shiftx_all(1200, 0.8, token_copies_b1[0], token_copies_b1[1]),
        shiftx_all(1200, 0.8, token_copies_b2[0], token_copies_b2[1]),
        
        all(token_copies[0].fontSize(55, 0.5), token_copies[1].fontSize(55, 0.5)),
        all(token_copies_b1[0].fontSize(55, 0.5), token_copies_b1[1].fontSize(55, 0.5)),
        all(token_copies_b2[0].fontSize(55, 0.5), token_copies_b2[1].fontSize(55, 0.5)),
    );
    yield* waitFor(2);
    yield* symtable_txt().flicker_in(1);
    yield* symtable_rect().flicker_in(1);
    yield* waitFor(1);

    yield* typecheck_code().selection(lines(3), 0.25);
    yield* typecheck_code().code.replace([[3, 5], [3, 14]], CODE` i32;`, 0.25);
    
    const token_strings2 = [
        "b",
        "i32",
    ];
    const tokens2 = [
        code_get_token(typecheck_code().code_ref(), "b"),
        code_get_token(typecheck_code().code_ref(), "i32", 1),
    ];
    const token_colors_list2 = [
        "#7f9ebe",
        "#8fbcbb",
    ];
    view().add(<>
        {...tokens2.map((s,i) => <>
            <Txt
                ref={makeRef(token_copies_b2, i+2)}
                fontFamily={"monospace"}
                fontSize={38}
                text={token_strings2[i]} fill={token_colors_list2[i]}
                position={() => s().position.add(s().size.div(2))
                                .add(typecheck_code().position())
                                .addY(4)}
                filters={[blur(10)]}
                opacity={0}
            />
            <Txt
                ref={makeRef(token_copies_b1, i+2)}
                fontFamily={"monospace"}
                fontSize={38}
                text={token_strings2[i]} fill={token_colors_list2[i]}
                position={() => s().position.add(s().size.div(2))
                                .add(typecheck_code().position())
                                .addY(4)}
                filters={[blur(5),brightness(0.5)]}
                opacity={0}
            />
            <Txt
                ref={makeRef(token_copies, i+2)}
                fontFamily={"monospace"}
                fontSize={38}
                text={token_strings2[i]} fill={token_colors_list2[i]}
                position={() => s().position.add(s().size.div(2))
                                .add(typecheck_code().position())
                                .addY(4)}
                filters={[brightness(1)]}
                opacity={0}
            />
        </>)}
    </>);
    yield* all(token_copies[2].opacity(1,0),token_copies_b1[2].opacity(1,0),token_copies_b2[2].opacity(1,0));
    yield* all(token_copies[3].opacity(1,0),token_copies_b1[3].opacity(1,0),token_copies_b2[3].opacity(1,0));
    
    yield* sequence(0.1,
        shiftx_all(1200, 0.3, token_copies[2], token_copies[3]),
        shiftx_all(1200, 0.3, token_copies_b1[2], token_copies_b1[3]),
        shiftx_all(1200, 0.3, token_copies_b2[2], token_copies_b2[3]),
        
        all(token_copies[2].fontSize(55, 0.25), token_copies[3].fontSize(55, 0.25)),
        all(token_copies_b1[2].fontSize(55, 0.25), token_copies_b1[3].fontSize(55, 0.25)),
        all(token_copies_b2[2].fontSize(55, 0.25), token_copies_b2[3].fontSize(55, 0.25)),
    );

    yield* waitFor(0.25);
    yield* typecheck_code().selection(lines(4), 0.25);
    yield* typecheck_code().code.replace([[4, 5], [4, 20]], CODE` f32;`, 0.25);
    const token_strings3 = [
        "c",
        "f32",
    ];
    const tokens3 = [
        code_get_token(typecheck_code().code_ref(), "c", 1),
        code_get_token(typecheck_code().code_ref(), "f32"),
    ];
    const token_colors_list3 = [
        "#7f9ebe",
        "#8fbcbb",
    ];
    view().add(<>
        {...tokens3.map((s,i) => <>
            <Txt
                ref={makeRef(token_copies_b2, i+4)}
                fontFamily={"monospace"}
                fontSize={38}
                text={token_strings3[i]} fill={token_colors_list3[i]}
                position={() => s().position.add(s().size.div(2))
                                .add(typecheck_code().position())
                                .addY(4)}
                filters={[blur(10)]}
                opacity={0}
            />
            <Txt
                ref={makeRef(token_copies_b1, i+4)}
                fontFamily={"monospace"}
                fontSize={38}
                text={token_strings3[i]} fill={token_colors_list3[i]}
                position={() => s().position.add(s().size.div(2))
                                .add(typecheck_code().position())
                                .addY(4)}
                filters={[blur(5),brightness(0.5)]}
                opacity={0}
            />
            <Txt
                ref={makeRef(token_copies, i+4)}
                fontFamily={"monospace"}
                fontSize={38}
                text={token_strings3[i]} fill={token_colors_list3[i]}
                position={() => s().position.add(s().size.div(2))
                                .add(typecheck_code().position())
                                .addY(4)}
                filters={[brightness(1)]}
                opacity={0}
            />
        </>)}
    </>);
    yield* all(token_copies[4].opacity(1,0),token_copies_b1[4].opacity(1,0),token_copies_b2[4].opacity(1,0));
    yield* all(token_copies[5].opacity(1,0),token_copies_b1[5].opacity(1,0),token_copies_b2[5].opacity(1,0));
    
    yield* sequence(0.1,
        shiftx_all(1200, 0.3, token_copies[4], token_copies[5]),
        shifty_all(46, 0.3, token_copies[4], token_copies[5]),
        shiftx_all(1200, 0.3, token_copies_b1[4], token_copies_b1[5]),
        shifty_all(46, 0.3, token_copies_b1[4], token_copies_b1[5]),
        shiftx_all(1200, 0.3, token_copies_b2[4], token_copies_b2[5]),
        shifty_all(46, 0.3, token_copies_b2[4], token_copies_b2[5]),
        
        all(token_copies[4].fontSize(55, 0.25), token_copies[5].fontSize(55, 0.25)),
        all(token_copies_b1[4].fontSize(55, 0.25), token_copies_b1[5].fontSize(55, 0.25)),
        all(token_copies_b2[4].fontSize(55, 0.25), token_copies_b2[5].fontSize(55, 0.25)),
    );


    yield* waitUntil("globals_jumpscare");
    yield* all(globals_txt().alpha(1, 0), globals_txt().text_alpha(1, 0));
    yield* waitFor(2);
    yield* sequence(0.1,
        sequence(0.01,
            ...token_copies.map(t => flicker_out(t,1)),
            ...token_copies_b1.map(t => flicker_out(t,1)),
            ...token_copies_b2.map(t => flicker_out(t,1)),
        ),
        typechecking_title().flicker_out(1),
        typecheck_code().flicker_out(1),
        symtable_txt().flicker_out(1),
        symtable_rect().flicker_out(1),
    );
    yield* waitUntil("fix_globals_title");
    yield* sequence(0.1,
        globals_txt().rotation(0, 0.5),
        globals_txt().size(128, 0.5),
        globals_txt().position.y(-400, 0.5),
    );

    const cycle_calls_code = createRef<NeonCode>();
    const cyclic_types = createRef<NeonCode>();
    view().add(<>
        <NeonCode
            ref={cycle_calls_code}
            code={CODE`\
// Imagine some exit condition :P
A :: func(c: i32) {
  B();
};

B :: func() {
  A();
};`}
            x={-300}
            alpha={0}
        />
        <NeonCode
            ref={cyclic_types}
            code={CODE`\
X :: struct {
  y: Y;
};

Y :: struct {
  x: ^X; // Has to be a pointer
};`}
            x={350} y={200}
            alpha={0}
        />
    </>);
    yield* cycle_calls_code().flicker_in(1);
    yield* waitFor(5);
    yield* cyclic_types().flicker_in(1);
    yield* waitFor(5.5);
    yield* sequence(0.1,
        cycle_calls_code().flicker_out(1),
        cyclic_types().flicker_out(1),
    );
    yield* globals_txt().flicker_out();

    yield* waitUntil("cuikgamer");
    const negate = createRef<NeonImage>();
    const cuik = createRef<NeonVideo>();
    view().add(<>
      <NeonVideo
        ref={cuik}
        video_source={cuikvid}
        x={-300} y={-150}
        width={940} height={530}
        intensity={1.0} alpha={0} video_alpha={0}
        glow={new Color("#823")}
      />
      <NeonImage
        ref={negate}
        image_source={negateimg}
        x={350} y={0}
        width={600} height={400}
        intensity={1.0} alpha={0} image_alpha={0}
        glow={new Color("#238")}
      />
    </>);
    yield* all(negate().alpha(1, 0.5), negate().image_alpha(1, 0.5));
    yield* waitFor(4);
    cuik().seek_and_play(1);
    yield* all(cuik().alpha(1, 0.5), cuik().video_alpha(1, 0.5));
    yield* notification(view(), "link_in_desc", "∨ Link in the description ∨", 450, 60, new Color("#283"));
    yield* all(
        all(cuik().alpha(0, 0.5), cuik().video_alpha(0, 0.5)),
        all(negate().alpha(0, 0.5), negate().image_alpha(0, 0.5))
    );
    view().removeChildren();

    yield* waitUntil("DECLGRAPHME");
    const example_code = createRef<NeonCode>();

    const graph = createRef<Node>();
    const node_circles: NeonCircle[] = [];
    const node_labels: NeonText[] = [];
    const edges: NeonLine[] = [];
    const color_left = Color.createSignal("#585");
    const color_right = Color.createSignal("#585");

    view().add(<>
        <NeonCode
            ref={example_code}
            code={CODE`\
Ty :: struct { a: f32; b: f32; };

A :: func(a: i32) {
  B();
};

B :: func(x: i32) -> Ty {
  C();
  A(0);
};

C :: func() {
  A(0);
};`}
            x={-450}
            size={40}
            alpha={0}
        />
        <Node ref={graph} x={450} y={0}>
            <NeonCircle
                ref={makeRef(node_circles, 0)}
                x={0} y={0}
                width={100} height={100} border={8}
                glow={new Gradient({
                    type: "linear",
                    from: [-100, 0], to: [100, 0],
                    stops: [
                        {offset:0, color:()=>color_left()},
                        {offset:0.499, color:()=>color_left()},
                        {offset:0.501, color:()=>color_right()},
                        {offset:1, color:()=>color_right()},
                    ]
                })} alpha={0}
            >
                <NeonText
                    ref={makeRef(node_labels, 0)}
                    txt={"B"} size={60} text_alpha={()=>node_circles[0].alpha()}
                    glow={new Color("#595")}
                />
            </NeonCircle>


            <NeonCircle
                ref={makeRef(node_circles, 1)}
                x={-200} y={-200}
                width={100} height={100} border={8}
                glow={"#585"} alpha={0}
            >
                <NeonText
                    ref={makeRef(node_labels, 1)}
                    txt={"i32"} size={48} text_alpha={()=>node_circles[1].alpha()}
                    glow={new Color("#595")}
                />
            </NeonCircle>


            <NeonCircle
                ref={makeRef(node_circles, 2)}
                x={-200} y={0}
                width={100} height={100} border={8}
                glow={new Gradient({
                    type: "linear",
                    from: [-100, 0], to: [100, 0],
                    stops: [
                        {offset:0, color:()=>color_left()},
                        {offset:0.499, color:()=>color_left()},
                        {offset:0.501, color:()=>color_right()},
                        {offset:1, color:()=>color_right()},
                    ]
                })} alpha={0}
            >
                <NeonText
                    ref={makeRef(node_labels, 2)}
                    txt={"A"} size={60} text_alpha={()=>node_circles[2].alpha()}
                    glow={new Color("#595")}
                />
            </NeonCircle>

            <NeonCircle
                ref={makeRef(node_circles, 3)}
                x={-200} y={200}
                width={100} height={100} border={8}
                glow={new Gradient({
                    type: "linear",
                    from: [-100, 0], to: [100, 0],
                    stops: [
                        {offset:0, color:()=>color_left()},
                        {offset:0.499, color:()=>color_left()},
                        {offset:0.501, color:()=>color_right()},
                        {offset:1, color:()=>color_right()},
                    ]
                })} alpha={0}
            >
                <NeonText
                    ref={makeRef(node_labels, 3)}
                    txt={"C"} size={60} text_alpha={()=>node_circles[3].alpha()}
                    glow={new Color("#595")}
                />
            </NeonCircle>

            <NeonCircle
                ref={makeRef(node_circles, 4)}
                x={200} y={0}
                width={100} height={100} border={8}
                glow={"#585"} alpha={0}
            >
                <NeonText
                    ref={makeRef(node_labels, 4)}
                    txt={"Ty"} size={48} text_alpha={()=>node_circles[4].alpha()}
                    glow={new Color("#595")}
                />
            </NeonCircle>

            <NeonCircle
                ref={makeRef(node_circles, 5)}
                x={200} y={-200}
                width={100} height={100} border={8}
                glow={"#585"} alpha={0}
            >
                <NeonText
                    ref={makeRef(node_labels, 5)}
                    txt={"f32"} size={48} text_alpha={()=>node_circles[5].alpha()}
                    glow={new Color("#595")}
                />
            </NeonCircle>

            <NeonLine
                ref={makeRef(edges, 0)}
                points={[[0, -50], [0, -200], [-145, -200]]}
                border={10} endArrow 
                zIndex={-1} alpha={0}
            />
            <NeonLine
                ref={makeRef(edges, 1)}
                points={[[-55, 0], [-145, 0]]}
                border={10} endArrow startArrow
                zIndex={-1} alpha={0}
            />
            <NeonLine
                ref={makeRef(edges, 2)}
                points={[[0, 50], [0, 200], [-145, 200]]}
                border={10} endArrow 
                zIndex={-1} alpha={0}
            />
            <NeonLine
                ref={makeRef(edges, 3)}
                points={[[55, 0], [145, 0]]}
                border={10} endArrow
                zIndex={-1} alpha={0}
            />
            <NeonLine
                ref={makeRef(edges, 4)}
                points={[[200, -50], [200, -135]]}
                border={10} endArrow
                zIndex={-1} alpha={0}
            />
            <NeonLine
                ref={makeRef(edges, 5)}
                points={[[-200, -45], [-200, -135]]}
                border={10} endArrow
                zIndex={-1} alpha={0}
            />
            <NeonLine
                ref={makeRef(edges, 6)}
                points={[[-200, 145], [-200, 65]]}
                border={10} endArrow
                zIndex={-1} alpha={0}
            />
            <NeonLine
                ref={makeRef(edges, 7)}
                points={[[-215, -55], [-215, -85], [15, -85], [15, -55]]}
                border={10} endArrow
                zIndex={-1} alpha={0}
            />
        </Node>
    </>);
    
    yield* example_code().flicker_in(1);
    yield* waitFor(2);
    yield* sequence(0.5,
        sequence(0.05,
            ...node_circles.map(c => c.flicker_in(1)),
        ),
        sequence(0.05,
            ...edges.filter((k,i)=>i<7).map(c => c.flicker_in(1)),
        ),
    );
    yield* waitUntil("nodes_are_decls");
    yield* example_code().selection([[[0, 0], [0, Infinity]], [[2, 0], [2, Infinity]], [[6, 0], [6, Infinity]], [[11, 0], [11, Infinity]]], 0.5);
    yield* waitFor(3);
    yield* example_code().selection(DEFAULT, 0.5);

    yield* waitUntil("split_funcs");
    yield* edges[1].startArrow(false, 0);
    yield* color_right("#258", 0.5);
    yield* sequence(0.05,
        edges[0].points([[25, -50], [25, -200], [-145, -200]], 0.5),
        edges[6].points([[-215, 145], [-215, 100], [-185, 100], [-185, 65]], 0.5),
        edges[5].points([[-185, -45], [-185, -135]], 0.5),
        edges[2].points([[-25, 50], [-25, 200], [-145, 200]], 0.5),
        ...edges.filter((k,i)=>i>=7).map(c => c.flicker_in(1)),
    );
    
    yield* waitUntil("edit_struct");
    yield* example_code().code.insert([0, 18], CODE`^`, 0.5);
    yield* example_code().code.insert([0, 27], CODE`^`, 0.5);
    yield* waitFor(4);
    yield* edges[4].flicker_out(1);
    yield* waitFor(4);
    yield* edges[4].line_dash([10], 0);
    yield* edges[4].flicker_in(1);
    
    yield* notification_placed(view(), "dependency_meaning", "^^ Here, We want A's prototype\n to be checked before C's body", 550, 350, 48, new Color("#383"));
    yield* flicker_out(graph(), 1);
    yield* example_code().flicker_out(1);
    yield* waitFor(1);
    view().removeChildren();
    node_circles.splice(0, node_circles.length);
    node_labels.splice(0, node_labels.length);
    view().add(example_code());
    yield* example_code().code(CODE`\
A :: struct { a: A; };

B1 :: struct { b2: B2; };
B2 :: struct { b1: B1; };

C1 :: struct { c2: C2; };
C2 :: struct { c3: C3; };
C3 :: struct { c1: C1; };`, 0);
    view().add(<>
        <Node ref={graph} x={450} y={0}>
            <NeonCircle
                ref={makeRef(node_circles, 0)}
                x={0} y={-200}
                width={100} height={100} border={8}
                glow={"#585"} alpha={0}
            >
                <NeonText
                    ref={makeRef(node_labels, 0)}
                    txt={"A"} size={48} text_alpha={()=>node_circles[0].alpha()}
                    glow={new Color("#595")}
                />
            </NeonCircle>

            <NeonCircle
                ref={makeRef(node_circles, 1)}
                x={-200} y={0}
                width={100} height={100} border={8}
                glow={"#585"} alpha={0}
            >
                <NeonText
                    ref={makeRef(node_labels, 1)}
                    txt={"B1"} size={48} text_alpha={()=>node_circles[1].alpha()}
                    glow={new Color("#595")}
                />
            </NeonCircle>

            <NeonCircle
                ref={makeRef(node_circles, 2)}
                x={-200} y={200}
                width={100} height={100} border={8}
                glow={"#585"} alpha={0}
            >
                <NeonText
                    ref={makeRef(node_labels, 2)}
                    txt={"B2"} size={48} text_alpha={()=>node_circles[2].alpha()}
                    glow={new Color("#595")}
                />
            </NeonCircle>

            <NeonCircle
                ref={makeRef(node_circles, 3)}
                x={200} y={0}
                width={100} height={100} border={8}
                glow={"#585"} alpha={0}
            >
                <NeonText
                    ref={makeRef(node_labels, 3)}
                    txt={"C1"} size={48} text_alpha={()=>node_circles[3].alpha()}
                    glow={new Color("#595")}
                />
            </NeonCircle>

            <NeonCircle
                ref={makeRef(node_circles, 4)}
                x={100} y={200}
                width={100} height={100} border={8}
                glow={"#585"} alpha={0}
            >
                <NeonText
                    ref={makeRef(node_labels, 4)}
                    txt={"C2"} size={48} text_alpha={()=>node_circles[4].alpha()}
                    glow={new Color("#595")}
                />
            </NeonCircle>

            <NeonCircle
                ref={makeRef(node_circles, 5)}
                x={300} y={200}
                width={100} height={100} border={8}
                glow={"#585"} alpha={0}
            >
                <NeonText
                    ref={makeRef(node_labels, 5)}
                    txt={"C3"} size={48} text_alpha={()=>node_circles[5].alpha()}
                    glow={new Color("#595")}
                />
            </NeonCircle>


            <NeonCubicBezier
                ref={makeRef(edges, 0)}
                p0={[-55,-200]} p1={[-150,-350]} p2={[150,-350]} p3={[55,-200]}
                border={10} endArrow 
                zIndex={-1} alpha={0}
            />
            <NeonCubicBezier
                ref={makeRef(edges, 1)}
                p0={[-200,55]} p1={[-150,55]} p2={[-150,115]} p3={[-190,145]}
                border={10} endArrow 
                zIndex={-1} alpha={0}
            />
            <NeonCubicBezier
                ref={makeRef(edges, 2)}
                p0={[-220,145]} p1={[-250,125]} p2={[-250,95]} p3={[-220,55]}
                border={10} endArrow 
                zIndex={-1} alpha={0}
            />
            <NeonCubicBezier
                ref={makeRef(edges, 3)}
                p0={[160,55]} p1={[140,75]} p2={[120,75]} p3={[110,145]}
                border={10} endArrow 
                zIndex={-1} alpha={0}
            />
            <NeonCubicBezier
                ref={makeRef(edges, 4)}
                p0={[290,145]} p1={[280,75]} p2={[260,75]} p3={[240,55]}
                border={10} endArrow 
                zIndex={-1} alpha={0}
            />
            <NeonCubicBezier
                ref={makeRef(edges, 5)}
                p0={[160,215]} p1={[190,245]} p2={[210,245]} p3={[240,215]}
                border={10} endArrow 
                zIndex={-1} alpha={0}
            />
        </Node>
    </>);
    yield* example_code().flicker_in(1);
    yield* graph().opacity(1, 0);
    yield* waitFor(1);
    yield* sequence(0.05,
        ...node_circles.map(c => c.flicker_in(1)),
        ...edges.map(e => e.flicker_in(1)),
    );
    yield* waitUntil("show__" + "sizes");
    const thetxt = createRef<NeonText>();
    view().add(
        <NeonText
            ref={thetxt}
            size={90}
            glow={new Color("#388")}
            position={[0, -400]}
            alpha={0} text_alpha={0}
            txt={"Size Calculation"}
        />
    );
    yield* thetxt().flicker_in(1);

    yield* waitUntil("animate_cycles_bad");
    yield* shiftx(graph(), 800, 0.6);
    const size_code = createRef<NeonCode>();
    view().add(<>
        <NeonCode
            ref={size_code}
            code={CODE`sizeof(B1) = sizeof(B2)\nsizeof(B2) = sizeof(B1)`}
            x={400}
            alpha={0}
        />
    </>)
    yield* size_code().flicker_in(1);

    yield* waitFor(2);
    yield* size_code().code(CODE`sizeof(B1) = sizeof(B2)\nsizeof(B2) = sizeof(B1)\n\nInfinite Solutions`, 0.5);

    yield* waitFor(8);
    yield* size_code().flicker_out(1);
    yield* shiftx(graph(), -800, 0.6);
    yield* sequence(0.1,
        example_code().code.insert([0, 17], CODE`^`, 0.5),
        example_code().code.insert([2, 19], CODE`^`, 0.5),
        example_code().code.insert([5, 19], CODE`^`, 0.5),
    );
    yield* waitFor(5);
    yield* sequence(0.1,
        edges[0].line_dash([10],0.5),
        edges[1].line_dash([10],0.5),
        edges[3].line_dash([10],0.5),
    );
    yield* notification_placed(view(), "no_more_pain", "No more cycles!!", 450, 350, 48, new Color("#383"));

    
    yield* waitUntil("end");
    yield* thetxt().flicker_out(1);
});