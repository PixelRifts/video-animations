import { Line, Node, Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import { Color, all, cancel, createRef, createRefArray, easeOutBounce, easeOutElastic, linear, loop, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { RegularText } from "../utils/defaults";
import { fade_in_up, fade_out_up } from "../utils/anims";
import { by_palette, shadow_color } from "../utils/colors";


export default makeScene2D(function* (view) {
    yield* waitFor(2);
    const asm_txt = createRef<Txt>();
    view.add(<>
        <RegularText
            ref={asm_txt}
            text={"Assembly"}
            fontSize={200}
            x={-400}
            offset={[-1, 0]}
            y={-700}
        />
    </>);
    yield* asm_txt().y(0, 1, easeOutBounce);
    yield* waitUntil("asmfail");
    yield* sequence(0.8,
        asm_txt().rotation(90, 2, easeOutElastic),
        asm_txt().y(700, 0.5),
    );

    yield* waitUntil("blah");
    const stack_elements = createRefArray<Line>();
  const stack = createRef<Node>();
  const focus_reticle = createRef<Line>();
  const focus_line = createRef<Line>();
  const part_1_title = createRef<Rect>();
  const part_1_l1 = createRef<Txt>();
  const part_1_l2 = createRef<Txt>();
  const part_1_l3 = createRef<Txt>();
  
  view.add(<>
    <Node ref={stack} x={-400}>
      {...range(4).reverse().map(i => <Line
        ref={stack_elements}
        y={-200 + i * (400)/3 - 40}
        points={[[400, 0], [0, 100], [-400, 0], [0, -100]]}
        closed radius={20} lineWidth={20}
        fill={new Color(by_palette[i]).brighten()} stroke={by_palette[i]}
        opacity={0}
        shadowOffsetY={15}
        shadowBlur={0}
        shadowColor={new Color(by_palette[i]).darken(1)}
      />)}
    </Node>
    <Line
      ref={focus_reticle}
      points={[[0, 0], [0, 0], [0, 0], [0, 0]]}
      x={-400} y={200}
      lineWidth={10} closed
      lineDash={[50*1.2, 50*0.21]}
      stroke={new Color(by_palette[4])}      
      shadowOffsetY={5}
      shadowColor={shadow_color(by_palette[4])}
    />
    <Line
      ref={focus_line}
      x={-400} y={-75}
      points={[[0, 225], [0, 0], [600, 0]]}
      end={0} lineWidth={10}
      stroke={new Color(by_palette[4])}
      
      shadowOffsetY={5}
      shadowColor={shadow_color(by_palette[4])}
    />
    <Rect ref={part_1_title} x={450} y={-75} height={200} width={500}>
      <RegularText
        ref={part_1_l1}
        fontSize={150}
        text={""}
        shadowOffsetY={10}
      />
      <RegularText
        ref={part_1_l2}
        fontSize={225}
        text={""}
        y={200}
        fill={by_palette[0]}

        shadowOffsetY={10}
        shadowColor={shadow_color(by_palette[0])}
      />
      <RegularText
        ref={part_1_l3}
        fontSize={225}
        text={""}
        y={400}
        fill={by_palette[0]}

        shadowOffsetY={10}
        shadowColor={shadow_color(by_palette[0])}
      />
    </Rect>
  </>);
  
  yield* sequence(0.2,
    ...stack_elements.filter((v,i) => i < 1).map(v => fade_in_up(v, -40)),
  );
  yield* sequence(0.2,
    ...stack_elements.filter((v,i) => i >= 1).reverse().map(v => all(
      v.opacity(0.25, 0.5),
      v.y(v.y()-40, 0.5)
    )),
  );
    
  const reticle_task = yield loop(Infinity, function* () {
    yield* focus_reticle().lineDashOffset(focus_reticle().lineDashOffset() + 100, 1, linear)
  });
  yield* focus_reticle().points([[50, 0], [0, 50], [-50, 0], [0, -50]], 0.5);
  yield* focus_line().end(1, 0.5);
  yield* part_1_l1().text("PART 4", 0.5);
  yield* waitFor(1);
  yield* sequence (0.2,
    part_1_l2().text("MACHINE", 0.5),
    part_1_l3().text("CODE", 0.5)
  );
  yield* waitFor(1);
  yield* sequence(0.1,
    focus_line().start(1, 0.5),
    focus_reticle().points([[0, 0]], 0.5),
    ...stack_elements.reverse().map(v => fade_out_up(v)),
    fade_out_up(part_1_title()),
  );
  yield* waitUntil("end");

  cancel(reticle_task);
});