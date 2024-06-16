import { CameraView } from "@ksassnowski/motion-canvas-camera";
import { CODE, Code, LezerHighlighter, Node, blur, brightness, makeScene2D } from "@motion-canvas/2d";
import { Color, Vector2, all, createRef, linear, makeRef, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { shiftx, shifty } from "../animations/misc";
import { NeonText } from "../neon/neon_items";
import { flicker_in, flicker_out } from "../animations/io";

import { parser } from '@lezer/cpp';

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeScene2D(function* (_view) {
    const view = createRef<CameraView>();
    _view.add(<CameraView ref={view} width={"100%"} height={"100%"}/>);

    const consistency_title = createRef<NeonText>();
    const declarations_code_container = createRef<Node>();
    const declarations_code = createRef<Code>();
    const declarations_notype_code_container = createRef<Node>();
    const declarations_notype_code = createRef<Code>();
    const declarations_noval_code_container = createRef<Node>();
    const declarations_noval_code = createRef<Code>();
    const declarations_const_code_container = createRef<Node>();
    const declarations_const_code = createRef<Code>();
    const declarations_const_notype_code_container = createRef<Node>();
    const declarations_const_notype_code = createRef<Code>();

    const function_decl_container = createRef<Node>();
    const function_decl = createRef<Code>();
    const types_decl_container = createRef<Node>();
    const types_decl = createRef<Code>();
    const value_decl_container = createRef<Node>();
    const value_decl = createRef<Code>();
  
    const declarations_code_str = Code.createSignal(CODE`name: Type = Value;`);
    const declarations_notype_code_str = Code.createSignal(CODE`name := Value;`);
    const declarations_noval_code_str = Code.createSignal(CODE`name: Type;`);
    const declarations_const_code_str = Code.createSignal(CODE`name: Type : Value;`);
    const declarations_const_notype_code_str = Code.createSignal(CODE`name :: Value;`);

    const function_decl_code_str = Code.createSignal(CODE`main :: func(argc: i32, argv: ^^u8) {\n  return 0;\n};`);
    const types_decl_code_str = Code.createSignal(CODE`foo :: struct {\n  a: i32;\n  b: f64;\n};`);
    const value_decl_code_str = Code.createSignal(CODE`A := 10;\nB :: 20;\nC: i32;`);
    view().add(<>
      <NeonText
        ref={consistency_title}
        txt={"Declaration Consistency"}
        size={105} y={-400} glow={new Color("#838")}
      />
      <Node ref={declarations_code_container} y={-100}>
        <Code
          code={()=>declarations_code_str()}
          fontFamily={"Fira Code"}
          fontSize={48}
          filters={[blur(10)]}
        />
        <Code
          code={()=>declarations_code_str()}
          fontFamily={"Fira Code"}
          fontSize={48}
          filters={[blur(5),brightness(0.5)]}
        />
        <Code
          ref={declarations_code}
          code={()=>declarations_code_str()}
          fontFamily={"Fira Code"}
          fontSize={48}
          filters={[brightness(1)]}
        />
      </Node>
      <Node ref={declarations_notype_code_container} y={-25}>
        <Code
          code={()=>declarations_notype_code_str()}
          fontFamily={"Fira Code"}
          fontSize={48}
          filters={[blur(10)]}
        />
        <Code
          code={()=>declarations_notype_code_str()}
          fontFamily={"Fira Code"}
          fontSize={48}
          filters={[blur(5),brightness(0.5)]}
        />
        <Code
          ref={declarations_notype_code}
          code={()=>declarations_notype_code_str()}
          fontFamily={"Fira Code"}
          fontSize={48}
          filters={[brightness(1)]}
        />
      </Node>
      <Node ref={declarations_noval_code_container} y={50}>
        <Code
          code={()=>declarations_noval_code_str()}
          fontFamily={"Fira Code"}
          fontSize={48}
          filters={[blur(10)]}
        />
        <Code
          code={()=>declarations_noval_code_str()}
          fontFamily={"Fira Code"}
          fontSize={48}
          filters={[blur(5),brightness(0.5)]}
        />
        <Code
          ref={declarations_noval_code}
          code={()=>declarations_noval_code_str()}
          fontFamily={"Fira Code"}
          fontSize={48}
          filters={[brightness(1)]}
        />
      </Node>
      <Node ref={declarations_const_code_container} y={125}>
        <Code
          code={()=>declarations_const_code_str()}
          fontFamily={"Fira Code"}
          fontSize={48}
          filters={[blur(10)]}
        />
        <Code
          code={()=>declarations_const_code_str()}
          fontFamily={"Fira Code"}
          fontSize={48}
          filters={[blur(5),brightness(0.5)]}
        />
        <Code
          ref={declarations_const_code}
          code={()=>declarations_const_code_str()}
          fontFamily={"Fira Code"}
          fontSize={48}
          filters={[brightness(1)]}
        />
      </Node>
      <Node ref={declarations_const_notype_code_container} y={200}>
        <Code
          code={()=>declarations_const_notype_code_str()}
          fontFamily={"Fira Code"}
          fontSize={48}
          filters={[blur(10)]}
        />
        <Code
          code={()=>declarations_const_notype_code_str()}
          fontFamily={"Fira Code"}
          fontSize={48}
          filters={[blur(5),brightness(0.5)]}
        />
        <Code
          ref={declarations_const_notype_code}
          code={()=>declarations_const_notype_code_str()}
          fontFamily={"Fira Code"}
          fontSize={48}
          filters={[brightness(1)]}
        />
      </Node>
      <Node ref={function_decl_container} x={400} y={-100} opacity={0}>
        <Code
          code={()=>function_decl_code_str()}
          fontFamily={"Fira Code"}
          fontSize={34}
          filters={[blur(10)]}
        />
        <Code
          code={()=>function_decl_code_str()}
          fontFamily={"Fira Code"}
          fontSize={34}
          filters={[blur(5),brightness(0.5)]}
        />
        <Code
          ref={function_decl}
          code={()=>function_decl_code_str()}
          fontFamily={"Fira Code"}
          fontSize={34}
          filters={[brightness(1)]}
        />
      </Node>
      <Node ref={types_decl_container} x={175} y={100} opacity={0}>
        <Code
          code={()=>types_decl_code_str()}
          fontFamily={"Fira Code"}
          fontSize={34}
          filters={[blur(10)]}
        />
        <Code
          code={()=>types_decl_code_str()}
          fontFamily={"Fira Code"}
          fontSize={34}
          filters={[blur(5),brightness(0.5)]}
        />
        <Code
          ref={types_decl}
          code={()=>types_decl_code_str()}
          fontFamily={"Fira Code"}
          fontSize={34}
          filters={[brightness(1)]}
        />
      </Node>
      <Node ref={value_decl_container} x={105} y={290} opacity={0}>
        <Code
          code={()=>value_decl_code_str()}
          fontFamily={"Fira Code"}
          fontSize={34}
          filters={[blur(10)]}
        />
        <Code
          code={()=>value_decl_code_str()}
          fontFamily={"Fira Code"}
          fontSize={34}
          filters={[blur(5),brightness(0.5)]}
        />
        <Code
          ref={value_decl}
          code={()=>value_decl_code_str()}
          fontFamily={"Fira Code"}
          fontSize={34}
          filters={[brightness(1)]}
        />
      </Node>
    </>);

    yield* waitUntil("show_examples");
    yield* sequence(0.1,
        shiftx(declarations_code_container(), -450, 0.5),
        shiftx(declarations_notype_code_container(), -450, 0.5),
        shiftx(declarations_noval_code_container(), -450, 0.5),
        shiftx(declarations_const_code_container(), -450, 0.5),
        shiftx(declarations_const_notype_code_container(), -450, 0.5),
    );
    yield* flicker_in(function_decl_container(), 1);
    yield* flicker_in(types_decl_container(), 1);
    yield* flicker_in(value_decl_container(), 1);

    yield* waitUntil("spiral_modifiers");
    const types: NeonText[] = [];
    const consistent_modifiers_title = createRef<NeonText>();
    const consistent_modifiers_code = createRef<Code>();
    const consistent_modifiers_container = createRef<Node>();
    const consistent_modifiers_code_str = Code.createSignal(CODE`\
a: (modifiers)(base type);`);
    view().add(<>
        <NeonText
          ref={consistent_modifiers_title}
          txt={"Type Modifier Consistency"}
          size={105} y={-400} x={2000} glow={new Color("#838")}
        />
        <Node ref={consistent_modifiers_container} x={0} y={0} opacity={0}>
            <Code
                code={()=>consistent_modifiers_code_str()}
                fontFamily={"Fira Code"}
                fontSize={45}
                filters={[blur(10)]}
            />
            <Code
                code={()=>consistent_modifiers_code_str()}
                fontFamily={"Fira Code"}
                fontSize={45}
                filters={[blur(5),brightness(0.5)]}
            />
            <Code
                ref={consistent_modifiers_code}
                code={()=>consistent_modifiers_code_str()}
                fontFamily={"Fira Code"}
                fontSize={45}
                filters={[brightness(1)]}
            />
        </Node>
        <NeonText
            ref={makeRef(types, 0)}
            txt={"i8"} size={70}
            y={275-30} x={-100} glow={new Color("#288")}
            diffusion={0.75} alpha={0} text_alpha={0}
        />
        <NeonText
            ref={makeRef(types, 1)}
            txt={"u8"} size={70}
            y={275-30} x={100} glow={new Color("#288")}
            diffusion={0.75} alpha={0} text_alpha={0}
        />
        <NeonText
            ref={makeRef(types, 2)}
            txt={"i16"} size={70}
            y={375-30} x={-100} glow={new Color("#288")}
            diffusion={0.75} alpha={0} text_alpha={0}
        />
        <NeonText
            ref={makeRef(types, 3)}
            txt={"u16"} size={70}
            y={375-30} x={100} glow={new Color("#288")}
            diffusion={0.75} alpha={0} text_alpha={0}
        />
        <NeonText
            ref={makeRef(types, 4)}
            txt={"i32"} size={70}
            y={475-30} x={-100} glow={new Color("#288")}
            diffusion={0.75} alpha={0} text_alpha={0}
        />
        <NeonText
            ref={makeRef(types, 5)}
            txt={"u32"} size={70}
            y={475-30} x={100} glow={new Color("#288")}
            diffusion={0.75} alpha={0} text_alpha={0}
        />
    </>);

    yield* all(
        shiftx(consistency_title(), -2000, 1),
        shiftx(function_decl_container(), -2000, 1),
        shiftx(declarations_code_container(), -2000, 1),
        shiftx(declarations_notype_code_container(), -2000, 1),
        shiftx(declarations_noval_code_container(), -2000, 1),
        shiftx(declarations_const_code_container(), -2000, 1),
        shiftx(declarations_const_notype_code_container(), -2000, 1),
        shiftx(function_decl_container(), -2000, 1),
        shiftx(types_decl_container(), -2000, 1),
        shiftx(value_decl_container(), -2000, 1),
        shiftx(consistent_modifiers_title(), -2000, 1),
    );
    
    consistency_title().remove();
    function_decl_container().remove();
    declarations_code_container().remove();
    declarations_notype_code_container().remove();
    declarations_noval_code_container().remove();
    declarations_const_code_container().remove();
    declarations_const_notype_code_container().remove();
    function_decl_container().remove();
    types_decl_container().remove();
    value_decl_container().remove();

    yield* waitFor(3);
    yield* flicker_in(consistent_modifiers_container(), 1);


    yield* waitFor(4);
    yield* sequence(0.5,
        ...types.map(t => t.flicker_in(1)),
    );

    yield* waitFor(2);
    yield* sequence(0.1,
        ...types.map(t => t.flicker_out(1)),
    );
    yield* consistent_modifiers_code_str.append(CODE`\nfoo:`, 0.5);
    yield* consistent_modifiers_code_str.append(CODE` []`, 0.5);
    yield* consistent_modifiers_code_str.insert([1,6], CODE`6`, 0.5);
    yield* consistent_modifiers_code_str.append(CODE` ^`, 0.5);
    yield* consistent_modifiers_code_str.append(CODE`u32;`, 0.5);

    yield* waitFor(2.5);
    yield* consistent_modifiers_code_str.append(CODE`\nbar:`, 0.5);
    yield* consistent_modifiers_code_str.append(CODE` ^`, 0.5);
    yield* consistent_modifiers_code_str.append(CODE`[]`, 0.5);
    yield* consistent_modifiers_code_str.insert([2,7], CODE`6`, 0.5);
    yield* consistent_modifiers_code_str.append(CODE` i16;`, 0.5);


    yield* waitUntil("clearAll");
    yield* sequence(0.1,
        consistent_modifiers_title().flicker_out(1),
        flicker_out(consistent_modifiers_container(), 1),
    );
    
    yield* waitUntil("typechecking");
    const typechecking_title = createRef<NeonText>();
    view().add(
        <NeonText
            ref={typechecking_title}
            size={128}
            glow={new Color("#838")}
            alpha={0} text_alpha={0}
            txt={"Semantic Analysis"}
        />
    );
    yield* typechecking_title().flicker_in(1);
    yield* waitFor(1);
    yield* typechecking_title().txt("Typechecking", 0.5);
    yield* waitFor(5);
    yield* sequence(0.1,
        typechecking_title().size(105, 0.5),
        shifty(typechecking_title(), -400, 0.5),
    );


    yield* waitUntil("end");
});