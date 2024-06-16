import { CODE, Code, LezerHighlighter, Node, Rect, blur, insert, lines, makeScene2D, remove, replace, word } from "@motion-canvas/2d";
import { Color, DEFAULT, SimpleSignal, all, createRef, createSignal, debug, makeRef, range, sequence, waitFor, waitTransition, waitUntil } from "@motion-canvas/core";
import { NeonCode, NeonCubicBezier, NeonIcon, NeonLine, NeonRect, NeonText, NeonVideo } from "../neon/neon_items";
import { append_to_code, shiftx, shiftx_all, shifty, shifty_all } from "../animations/misc";
import { CameraView } from "@ksassnowski/motion-canvas-camera";

import { parser } from '@lezer/cpp';
import { flicker_in, flicker_out } from "../animations/io";
Code.defaultHighlighter = new LezerHighlighter(parser);

import division_vid from '../extern/divbetter.mp4';
import divport_vid from '../extern/divport.mp4';
import gbatek_vid from '../extern/gbatek.mp4';
import { notification } from "../animations/items";

export default makeScene2D(function* (_view) {
  const view = createRef<CameraView>();
  _view.add(<CameraView ref={view} width={"100%"} height={"100%"} />);


  const title_me = createRef<NeonText>();
  view().add(<NeonText
    ref={title_me}
    size={200}
    glow={new Color("#388")}
    txt={"Functions"}
  />);

  yield* waitUntil("jump_to_and_back");
  const function_example = createRef<NeonCode>();
  const to_func = createRef<NeonCubicBezier>();
  const from_func = createRef<NeonCubicBezier>();
  view().add(<>
    <NeonCode
      ref={function_example}
      code={CODE`\
C :: func() {
    return;
}

A :: func() {
    C();
}`}
      alpha={0}
    />
    <NeonCubicBezier
      ref={to_func}
      p0={[-147, 112]} p1={[-450, 112]}
      p2={[-450, -112]} p3={[-248, -173]}
      endArrow border={10} alpha={0}
    />
    <NeonCubicBezier
      ref={from_func}
      p0={[110, -117]} p1={[450, -117]}
      p2={[450, 115]} p3={[82, 115]}
      endArrow border={10} alpha={0}
    />
  </>);
  yield* sequence(0.1, title_me().size(100, 0.5), title_me().y(-400, 0.5));
  yield* function_example().flicker_in(1);
  yield* waitFor(1.5);
  yield* to_func().flicker_in(1);
  yield* waitFor(0.5);
  yield* from_func().flicker_in(1);

  yield* waitUntil("lowered_call_code");
  yield* shiftx_all(-500, 0.5,
    function_example(),
    to_func(), from_func(),
  );
  const lowered_call = createRef<NeonCode>();
  view().add(<>
    <NeonCode
      ref={lowered_call}
      code={CODE`\
C_fn:
  ; Code for C func
  
A_fn:
  ; Code for A func`}
      x={500}
      alpha={0}
    />
  </>);
  yield* lowered_call().flicker_in(1);
  yield* lowered_call().code.edit(1.2)`\
C_fn:
  ; Code for C func
    
A_fn:
  ${replace("; Code for A func", "b C_fn")}`;
  yield* waitFor(2);
  yield* lowered_call().code.edit(1.2)`\
C_fn:
  ${replace("; Code for C func", "b A_fn  ; Bad")}
    
A_fn:
  b C_fn`;

  yield* waitFor(2);
  yield* all(
    append_to_code(function_example(), "\n\nB :: func() {\n  C();\n}", 0.5),
    shifty(function_example(), 48 * 2 + 12, 0.5),
  )
  yield* waitFor(2);
  yield* lowered_call().code.edit(1.2)`\
C_fn:
  ${replace("b A_fn  ; Bad", "; b A_fn OR C_fn ???")}
    
A_fn:
  b C_fn${insert(`

B_fn:
  b C_fn`)}`;

  yield* waitUntil("reserve_reg");
  yield* all(function_example().flicker_out(1), to_func().flicker_out(1), from_func().flicker_out(1));
  const cpu = createRef<NeonRect>();
  const registers_col1: Rect[] = [];
  const registers_col2: Rect[] = [];
  const registers_col1_lbls: NeonText[] = [];
  const registers_col2_lbls: NeonText[] = [];
  const lbls: SimpleSignal<string, void>[] = [];
  for (let i = 0; i < 16; i++) lbls[i] = createSignal("R" + i);
  yield* lbls[13]("SP", 0);
  view().add(<>
    <NeonRect
      ref={cpu}
      width={800} height={500} y={100}
      border={10}
      glow={"#338"}
    />
    {...range(8).map(i => <>
      <Rect
        ref={makeRef(registers_col1, i)}
        x={-175} width={200} height={40} y={-75 + i * 50}
        stroke={new Color("#283").brighten(1)} lineWidth={5}
        filters={[blur(2)]}
        radius={4}
      />
      <Rect
        ref={makeRef(registers_col2, i)}
        x={175} width={200} height={40} y={-75 + i * 50}
        stroke={new Color("#283").brighten(1)} lineWidth={5}
        filters={[blur(2)]}
        radius={4}
      />
      <NeonText
        ref={makeRef(registers_col1_lbls, i)}
        size={38}
        x={-175 - 145} y={-75 + i * 50}
        glow={new Color("#283")} diffusion={0.5}
        txt={() => lbls[i]()}
      />
      <NeonText
        ref={makeRef(registers_col2_lbls, i)}
        size={38}
        x={175 + 145} y={-75 + i * 50}
        glow={new Color("#283")} diffusion={0.5}
        txt={() => lbls[i + 8]()}
      />
    </>)}
  </>);
  yield* shiftx_all(-1600, 0,
    cpu(),
    ...registers_col1, ...registers_col2,
    ...registers_col1_lbls, ...registers_col2_lbls,
  );
  yield* registers_col2_lbls[5].glow("#838", 0);
  yield* waitFor(1);
  yield* shiftx_all(1200, 0.5,
    cpu(),
    ...registers_col1, ...registers_col2,
    ...registers_col1_lbls, ...registers_col2_lbls,
  );
  yield* waitFor(2);
  yield* registers_col2_lbls[6].glow("#838", 0.5);
  yield* lbls[14]("LR", 1.0);

  yield* waitFor(5);
  yield* shifty(lowered_call(), 100, 0.5);
  yield* lowered_call().code.edit(1.2)`\
C_fn:
  ; b A_fn OR C_fn ???

A_fn:${insert(`
  mov lr, r15`)}
  b C_fn

B_fn:${insert(`
  mov lr, r15`)}
  b C_fn`;
  yield* waitFor(5);
  yield* lowered_call().code.edit(1.2)`\
C_fn:${insert(`
  ; bx ≃ b (sorry arm nerds)`)}
  ${replace("; b A_fn OR C_fn ???", "bx lr")}

A_fn:
  mov lr, r15
  b C_fn

B_fn:
  mov lr, r15
  b C_fn`;
  yield* waitUntil("jump_cut");
  yield* lowered_call().code.edit(0.8)`\
C_fn:
  ; bx ≃ b (sorry arm nerds)
  bx lr

A_fn:
  mov lr, pc
  b C_fn

B_fn:
  mov lr, pc
  b C_fn`;
  yield* registers_col2_lbls[7].glow("#838", 0.5);
  yield* lbls[15]("PC", 0.5);
  yield* notification(view(), "r15ispc", "R15 is also called the Program Counter (PC)", 500, 38);

  yield* waitUntil("chained_call");
  yield* lowered_call().code(CODE`\
C_fn:
  ; bx ≃ b (sorry arm nerds)
  bx lr

B_fn:
  mov lr, pc
  b C_fn
  bx lr

A_fn:
  mov lr, pc
  b B_fn`, 1.2);

  yield* waitUntil("show_chain_call_arrows");
  const call_arrows: NeonCubicBezier[] = [];
  const stack = createRef<Node>();
  const stackleft = createRef<NeonLine>();
  const stackright = createRef<NeonLine>();
  const stackbottom = createRef<NeonLine>();
  const lr_thing = createRef<NeonRect>();
  const lr_thing_2 = createRef<NeonRect>();
  const lr_thing_3 = createRef<NeonRect>();
  view().add(<>
    <NeonCubicBezier
      ref={makeRef(call_arrows, 0)}
      p0={[500, 423]} p3={[500, 17]} p1={[700, 423]} p2={[700, 17]}
      endArrow
      border={10} alpha={0}
    />
    <NeonCubicBezier
      ref={makeRef(call_arrows, 1)}
      p0={[500, 130]} p3={[500, -230]} p1={[700, 130]} p2={[700, -230]}
      endArrow
      border={10} alpha={0}
    />
    <NeonCubicBezier
      ref={makeRef(call_arrows, 2)}
      p0={[450, -100]} p3={[450, 185]} p1={[650, -100]} p2={[650, 185]}
      endArrow glow={new Color("#328")}
      border={10} alpha={0}
    />
    <NeonCubicBezier
      ref={makeRef(call_arrows, 3)}
      p0={[450, 185]} p3={[450, 185]} p1={[650, 0]} p2={[650, 360]}
      endArrow glow={new Color("#328")}
      border={10} alpha={0}
    />

    <Node ref={stack} x={-400} y={150} opacity={0}>
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
      ref={lr_thing}
      x={-400} y={200}
      width={290} height={100} border={5}
      alpha={0}
    >
      <NeonText
        txt={"LR (for B)"}
        alpha={()=>lr_thing().alpha()} text_alpha={()=>lr_thing().alpha()}
      />
    </NeonRect>
    <NeonRect
      ref={lr_thing_2}
      x={-400} y={50}
      width={290} height={100} border={5}
      alpha={0}
    >
      <NeonText
        txt={"LR (for C)"}
        alpha={()=>lr_thing_2().alpha()} text_alpha={()=>lr_thing_2().alpha()}
      />
    </NeonRect>
    <NeonRect
      ref={lr_thing_3}
      x={-400} y={-150}
      width={290} height={200} border={5}
      alpha={0}
    >
      <NeonText
        txt={"Local space"}
        alpha={()=>lr_thing_3().alpha()} text_alpha={()=>lr_thing_3().alpha()}
      />
    </NeonRect>
  </>);
  yield* sequence(3, ...call_arrows.map(t => t.flicker_in(1)));

  yield* waitUntil("counteract");
  yield* all(
    shiftx_all(-1200, 0.5,
      cpu(),
      ...registers_col1, ...registers_col2,
      ...registers_col1_lbls, ...registers_col2_lbls,
    ),
    ...call_arrows.map(t=>t.flicker_out(1)),
  );
  yield* flicker_in(stack(), 1);
  yield* sequence(0.1,
    lowered_call().size(40, 0.5),
    lowered_call().code.edit(0.8)`
C_fn:
  ${remove(`; bx ≃ b (sorry arm nerds)
  `)}bx lr

B_fn:
  mov lr, pc
  b C_fn
  bx lr

A_fn:
  mov lr, pc
  b B_fn
`,
  );
  yield* waitFor(2);
  yield* all(lr_thing().alpha(1, 0.5), shifty(lr_thing(), 150, 0.5));
  yield* lowered_call().code.edit(0.8)`
C_fn:${insert(`
  push {lr}`)}
  bx lr

B_fn:${insert(`
  push {lr}`)}
  mov lr, pc
  b C_fn
  bx lr

A_fn:
  mov lr, pc
  b B_fn
`;
  yield* all(lr_thing_2().alpha(1, 0.5), shifty(lr_thing_2(), 150, 0.5));
  yield* waitFor(4);
  yield* lowered_call().code.edit(0.8)`
C_fn:
  push {lr}${insert(`
  pop {lr}`)}
  bx lr

B_fn:
  push {lr}
  mov lr, pc
  b C_fn${insert(`
  pop {lr}`)}
  bx lr

A_fn:
  mov lr, pc
  b B_fn
`;
  yield* all(lr_thing_2().alpha(0, 0.5), shifty(lr_thing_2(), -150, 0.5));
  yield* all(lr_thing().alpha(0, 0.5), shifty(lr_thing(), -150, 0.5));

  yield* waitUntil("fun_args");
  yield* flicker_out(stack(), 1);
  yield* function_example().code(CODE`\
foo :: func(a: i32) {
  b: i32;
  c: i32;
}

main :: func() {
  foo(1);
}`, 0);
  yield* function_example().flicker_in(1);
  yield* sequence(0.1, lowered_call().code(CODE`
foo_fn:
  push {lr}
  ; use params
  pop {lr}
  bx lr

main_fn:
  ; shorthand for mov lr, pc + b
  bl foo_fn
`, 0.8));
  
  yield* waitUntil("args_time");
  yield* all(function_example().selection(lines(6), 0.5),
  lowered_call().code.edit(0.8)`
foo_fn:
  push {lr}
  ; use params
  pop {lr}
  bx lr

main_fn:
  ${replace("; shorthand for mov lr, pc + b", `ldr r0, #1
  push {r0}`)}
  bl foo_fn
`);
  yield* waitFor(2);
  
  yield* all(lowered_call().code.edit(0.8)`
foo_fn:
  push {lr}
  ; use params
  pop {lr}
  bx lr

main_fn:
  ldr r0, #1
  push {r0}
  bl foo_fn${insert(`
  pop {r0}`)}
`);
  yield* waitFor(2);
  yield* function_example().selection(lines(1,2), 0.5);

  yield* waitUntil("locals_on_stack");
  yield* shiftx(function_example(), -800, 0.5);
  yield* flicker_in(stack(), 1);
  yield* (lr_thing().peekChildren()[0] as NeonText).txt("Args",0);
  yield* (lr_thing_2().peekChildren()[0] as NeonText).txt("LR",0);
  yield* all(lr_thing().alpha(1, 0.5), shifty(lr_thing(), 150, 0.5));
  yield* all(lr_thing_2().alpha(1, 0.5), shifty(lr_thing_2(), 150, 0.5));
  yield* waitFor(2);
  yield* all(lr_thing_3().alpha(1, 0.5), shifty(lr_thing_3(), 150, 0.5));
  
  yield* all(lowered_call().code.edit(0.8)`
foo_fn:
  push {lr}${insert(`
  add sp, sp, #8 ; required size`)}
  ; use params
  pop {lr}
  bx lr

main_fn:
  ldr r0, #1
  push {r0}
  bl foo_fn
  pop {r0}
`);

  yield* waitUntil("not_comptime");
  yield* function_example().selection(DEFAULT, 0);
  yield* sequence(0.1,
    lowered_call().flicker_out(1),
    stack().scale(0.5, 0.5),
    all(lr_thing().scale(0.5,0.5), shifty(lr_thing(), -95, 0.5)),
    all(lr_thing_2().scale(0.5,0.5), shifty(lr_thing_2(), -20, 0.5)),
    all(lr_thing_3().scale(0.5,0.5), shifty(lr_thing_3(), 75, 0.5)),
    function_example().size(35, 0.5),
    function_example().position([-600,-150], 0.5),
  );
  yield* all(
    stack().position([-670, 306],0.5),
    lr_thing().position([-670, 306+75+20],0.5),
    lr_thing_2().position([-670, 306+20],0.5),
    lr_thing_3().position([-670, 306-95+20],0.5),
  );

  const stack_mid = stack().clone();
  const stack_right = stack().clone();
  const mid_code = createRef<NeonCode>();
  const right_code = createRef<NeonCode>();
  const question_icon_mid = createRef<NeonIcon>();
  const question_icon_right = createRef<NeonIcon>();

  view().add(<>
    <NeonCode
      ref={mid_code}
      size={35}
      position={[-600,-150]} opacity={0}
      code={CODE`\
foo :: func(a: i32) {
  b: i32;
  c: i32;
}

main :: func() {
  hi: i8;
  foo(1);
}`}
    />
    {stack_mid}
    <NeonCode
      ref={right_code}
      size={35}
      position={[-600,-150]} opacity={0}
      code={CODE`\
foo :: func(a: i32) {
  b: i32;
  c: i32;
}

bar :: func() { foo(2); }

main :: func() {
  bar();
}`}
    />
    {stack_right}
    <NeonIcon
      ref={question_icon_mid}
      icon={"ic:outline-help-center"}
      size={100}
      x={0} y={306}
      alpha={0} icon_alpha={0}
      glow={new Color("#388")}
    />
    <NeonIcon
      ref={question_icon_right}
      icon={"ic:outline-help-center"}
      size={100}
      x={670} y={306}
      alpha={0} icon_alpha={0}
      glow={new Color("#388")}
    />
  </>);
  yield* mid_code().opacity(0,0);
  yield* stack_mid.opacity(0,0);
  yield* right_code().opacity(0,0);
  yield* stack_right.opacity(0,0);
  yield* shifty(mid_code(), 25, 0);
  yield* shifty(right_code(), 50, 0);

  yield* waitFor(3);
  yield* all(
    mid_code().x(0, 0.5), mid_code().opacity(1, 0.5),
    stack_mid.x(0, 0.5), stack_mid.opacity(1, 0.5),
    right_code().x(0, 0.5),
    stack_right.x(0, 0.5),
  );
  yield* question_icon_mid().flicker_in(1);
  yield* waitFor(1);
  yield* all(
    right_code().x(670, 0.5), right_code().opacity(1, 0.5),
    stack_right.x(670, 0.5), stack_right.opacity(1, 0.5),
  );
  yield* question_icon_right().flicker_in(1);

  yield* waitUntil("show_symmetry");
  yield* sequence(0.1,
    function_example().flicker_out(1),
    mid_code().flicker_out(1),
    right_code().flicker_out(1),
  );
  view().removeChildren();
  view().add(<>
    {stack()} {lr_thing()} {lr_thing_2()} {lr_thing_3()}
    {stack_mid} {question_icon_mid()}
    {stack_right} {question_icon_right()}
    {title_me()}
  </>)
  
  yield* sequence(0.1,
    shifty_all(-200, 0.5, stack(), lr_thing(), lr_thing_2(), lr_thing_3()),
    shifty_all(-200, 0.5, stack_mid, question_icon_mid()),
    shifty_all(-200, 0.5, stack_right, question_icon_right()),
  );
  yield* sequence(0.1,
    all(
      stack().scale(1, 0.5),
      all(lr_thing().scale(1,0.5), shifty(lr_thing(), 95, 0.5)),
      all(lr_thing_2().scale(1,0.5), shifty(lr_thing_2(), 20, 0.5)),
      all(lr_thing_3().scale(1,0.5), shifty(lr_thing_3(), -75, 0.5)),
    ),
    all(
      stack_mid.scale(1, 0.5),
      question_icon_mid().flicker_out(1),
    ),
    all(
      stack_right.scale(1, 0.5),
      question_icon_right().flicker_out(1),
    ),
  );
  const lr_thing_mids = [lr_thing().snapshotClone({opacity:0}), lr_thing_2().snapshotClone({opacity:0}), lr_thing_3().snapshotClone({opacity:0})]
  const lr_thing_rights = [lr_thing().snapshotClone({opacity:0}), lr_thing_2().snapshotClone({opacity:0}), lr_thing_3().snapshotClone({opacity:0})]
  view().add(<>
    {...lr_thing_mids}
    {...lr_thing_rights}
  </>);
  yield* all(
    ...lr_thing_mids.map(t=>all(t.x(0, 0.5), shifty(t, -100, 0.5), t.opacity(1, 0.5))),
    ...lr_thing_rights.map(t=>all(t.x(0, 0.5), shifty(t, -100, 0.5))),
  );
  yield* all(
    ...lr_thing_rights.map(t=>all(t.x(670, 0.5), shifty(t, -100, 0.5), t.opacity(1, 0.5))),
  );
  yield* waitFor(2);
  yield* sequence(0.1, lr_thing_2().glow("#238", 0.5), lr_thing_mids[1].glow("#238", 0.5), lr_thing_rights[1].glow("#238", 0.5));
  
  yield* waitUntil("for_example");
  yield* all(
    flicker_out(stack(), 1), lr_thing().flicker_out(1), lr_thing_2().flicker_out(1), lr_thing_3().flicker_out(1),
    flicker_out(stack_mid, 1), ...lr_thing_mids.map(t=>flicker_out(t, 1)),
  );
  yield* function_example().code(CODE`\
main :: func() {
  a: i32;
  foo(3);
}

foo :: func(a: i32) {
  c: i32;
  b: i32;
}`, 0);
  yield* shifty(title_me(), -50, 0.5);
  yield* all(stack_right.x(350, 0.5), ...lr_thing_rights.map(t => flicker_out(t,1)));
  yield* function_example().position([-350,100],0);
  view().add(function_example());
  yield* all(
    function_example().flicker_in(1)
  );

  const pushes: NeonRect[] = [];
  const pushes_strs = ["local a", "arg a", "main -> foo LR", "local c", "local b"];
  const newpush = createRef<NeonRect>();
  const marker_arrow = createRef<NeonIcon>();
  const off_minus4 = createRef<NeonIcon>();
  const off_plus8 = createRef<NeonIcon>();
  const marker_lbl = createRef<NeonText>();
  view().add(<>
    {...range(5).map(i => <NeonRect
      ref={makeRef(pushes, i)}
      x={350} y={200-i*110}
      width={290} height={95} border={5}
      alpha={0}
    >
      <NeonText
        txt={pushes_strs[i]} size={38}
        alpha={()=>pushes[i].alpha()} text_alpha={()=>pushes[i].alpha()}
      />
    </NeonRect>)}
    <NeonRect
      ref={newpush}
      x={350} y={200-2*110}
      width={290} height={95} border={5}
      alpha={0}
    />
    <NeonIcon
      ref={marker_arrow}
      icon={"material-symbols:arrow-left-alt-rounded"}
      size={128}
      x={600} y={130}
      alpha={0} icon_alpha={0}
      glow={new Color("#823")}
    />
    <NeonText
      ref={marker_lbl}
      txt={"BP"}
      x={700} y={130}
      alpha={0} text_alpha={0}
      glow={new Color("#823")}
    />
    <NeonIcon
      ref={off_minus4}
      icon={"material-symbols:arrow-left-alt-rounded"}
      size={128}
      x={600} y={250}
      alpha={0} icon_alpha={0}
      glow={new Color("#838")}
    />
    <NeonIcon
      ref={off_plus8}
      icon={"material-symbols:arrow-left-alt-rounded"}
      size={128}
      x={600} y={-80}
      alpha={0} icon_alpha={0}
      glow={new Color("#838")}
    />
  </>);
  yield* sequence(0.1,
    ...pushes.map(t => all(
      t.alpha(1, 0.5),
      shifty(t, 100, 0.5),
    ))
  );
  yield* waitUntil("markme");
  yield* marker_arrow().flicker_in(1);
  yield* waitFor(2);
  yield* function_example().selection(word(5,12,6), 0.5);
  yield* off_minus4().flicker_in(1);
  yield* waitFor(4);
  yield* function_example().selection(word(7,2,6), 0.5);
  yield* off_plus8().flicker_in(1);
  yield* waitUntil("push_bp");
  yield* marker_lbl().flicker_in(1);
  yield* waitFor(2);
  yield* sequence(0.1,
    ...pushes
      .reverse()
      .filter((v,i) => i<3)
      .map(t=>all(
        // t.alpha(1, 0.5),
        shifty(t, -105, 0.5),
      )),
  );
  yield* all(
    newpush().alpha(1, 0.5), shifty(newpush(), 100, 0.5),
    marker_lbl().position(()=>newpush().position(), 0.5),
  );

  yield* waitUntil("functions_done");
  yield* sequence(0.05,
    function_example().flicker_out(1),
    title_me().flicker_out(1),
    flicker_out(stack_right, 1),
    ...pushes.map(t=>t.flicker_out(1)),
    newpush().flicker_out(1),
    marker_lbl().flicker_out(1),
    marker_arrow().flicker_out(1),
    off_minus4().flicker_out(1),
    off_plus8().flicker_out(1),
  );
  view().removeChildren();

  yield* waitUntil("division_reveal");
  


  const division_title = createRef<NeonText>();
  view().add(<NeonText
    ref={division_title}
    size={200} alpha={0} text_alpha={0}
    glow={new Color("#388")}
    txt={"Division"}
  />);
  yield* division_title().flicker_in(1);
  yield* waitFor(7);
  yield* sequence(0.1, division_title().size(100, 0.5), division_title().y(-400, 0.5));

  yield* waitFor(2);
  const godboltvideo = createRef<NeonVideo>();
  const instrs: NeonText[] = [];
  const instrs_strs = ["Write numerator to 0x4000290", "Write denominator to 0x4000298", "Set DIVCNT (0x4000280) to 0", "Wait 18 cycles", "Read 0x40002A0 for result"];
  view().add(<>
    <NeonVideo
      ref={godboltvideo}
      video_source={division_vid}
      x={0} y={100}
      width={1440} height={730}
      intensity={1.0} alpha={0} video_alpha={0}
      glow={new Color("#823")}
    />
    {...instrs_strs.map((s,i) => <NeonText
      ref={makeRef(instrs, i)}
      txt={s} y={-200+i*100} size={75}
      glow={new Color("#238")}
      alpha={0} text_alpha={0}
    />)}
  </>);
  godboltvideo().seek_and_play(0);
  yield* all(godboltvideo().alpha(1, 0.5), godboltvideo().video_alpha(1, 0.5));
  yield* waitFor(9);
  yield* all(godboltvideo().alpha(0, 0.5), godboltvideo().video_alpha(0, 0.5));
  yield* waitFor(2);
  yield* godboltvideo().video_source(divport_vid,0);
  godboltvideo().seek_and_play(0);
  yield* all(godboltvideo().alpha(1, 0.5), godboltvideo().video_alpha(1, 0.5));
  yield* waitUntil("go_to_hit");
  yield* all(godboltvideo().alpha(0, 0.5), godboltvideo().video_alpha(0, 0.5));
  yield* waitFor(2);
  yield* godboltvideo().video_source(gbatek_vid,0);
  godboltvideo().seek_and_play(5);
  yield* all(godboltvideo().alpha(1, 0.5), godboltvideo().video_alpha(1, 0.5));

  yield* waitUntil("using_this_shit");
  yield* all(godboltvideo().alpha(0, 0.5), godboltvideo().video_alpha(0, 0.5));
  yield* waitUntil("instructions");
  const timings = [0.5, 2, 1, 2, 0];
  for (let i = 0; i < timings.length; i++) {
    yield* instrs[i].flicker_in(1);
    yield* waitFor(timings[i]);
  }
  
  yield* waitUntil("end");
  yield* sequence(0.1,
    division_title().flicker_out(1),
    ...instrs.map(t=>t.flicker_out(1)),
  )
});