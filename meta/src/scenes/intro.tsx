import { Circle, Code, Gradient, LezerHighlighter, Line, Node, Rect, Shape, Txt, makeScene2D } from '@motion-canvas/2d';
import { Color, DEFAULT, Vector2, all, cancel, chain, createRef, createRefArray, createSignal, easeInOutSine, easeInSine, easeOutSine, finishScene, linear, loop, makeRef, makeRefs, range, sequence, waitFor, waitUntil } from '@motion-canvas/core';
import { by_palette, shadow_color } from '../utils/colors';
import { RegularText } from '../utils/defaults';
import { fade_in_up, fade_out_up, run_simple } from '../utils/anims';

import { parser } from '@lezer/cpp';
Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeScene2D(function* (view) {
  yield* waitUntil("paradigms");
  
  const oop_icon = createRef<Node>();
  const oop_icon_bobbing = createSignal(0.0);
  const oop_label = createRef<Txt>();
  const oop_circles_meta = createRef<Node>();
  const oop_circles = createRefArray<Circle>();
  const oop_circle_dist_from_center = createSignal(0.0);

  const func_icon = createRef<Node>();
  const func_icon_bobbing = createSignal(0.0);
  const func_label = createRef<Txt>();
  const func_rects_meta = createRef<Node>();
  const func_rects = createRefArray<Rect>();

  const proc_icon = createRef<Node>();
  const proc_icon_bobbing = createSignal(0.0);
  const proc_label = createRef<Txt>();
  const proc_rects_meta = createRef<Node>();
  const proc_rects = createRefArray<Rect>();
  view.add(
    <>
      <Node ref={oop_icon} y={() => oop_icon_bobbing()} x={-550}>
        <Node ref={oop_circles_meta} y={-100}>
          {...range(3).map((v, i) => <Circle
            ref={oop_circles}
            size={0}
            x={() => Math.cos((2*Math.PI/3)*i)*oop_circle_dist_from_center()}
            y={() => Math.sin((2*Math.PI/3)*i)*oop_circle_dist_from_center()}
            stroke={by_palette[1]}
            fill={by_palette[0]}
            lineWidth={15}

            shadowOffsetY={10}
            shadowBlur={0}
            shadowColor={shadow_color(by_palette[0])}
          />)}
        </Node>

        <RegularText
          ref={oop_label}
          y={190} opacity={0}
          text={"Object-Oriented"}
        />
      </Node>

      <Node ref={func_icon} x={0} y={() => func_icon_bobbing()}>
        <Node ref={func_rects_meta} y={() => -50}>
          {...range(3).map((v, i) => <Rect
            ref={func_rects}
            width={0} height={0}
            stroke={by_palette[1]} y={-5*i}
            fill={new Color(by_palette[0]).darken(i)}
            lineWidth={5} radius={4}

            shadowOffsetY={10}
            shadowBlur={0}
            shadowColor={shadow_color(by_palette[0])}
          />)}
        </Node>

        <RegularText
          ref={func_label}
          text={"Functional"}
          y={190} opacity={0}
        />
      </Node>

      <Node ref={proc_icon} x={550} y={() => proc_icon_bobbing()}>
        <Node ref={proc_rects_meta} y={() => -105}>
          {...range(3).map((v, i) => <Rect
            ref={proc_rects}
            width={0} height={50}
            x={-40-100+20*i} y={60*i} stroke={by_palette[1]}
            fill={by_palette[0]}
            lineWidth={5} radius={4} opacity={0}
            
            shadowOffsetY={10}
            shadowBlur={0}
            shadowColor={shadow_color(by_palette[0])}
          />)}
        </Node>

        <RegularText
          ref={proc_label}
          text={"Procedural"}
          y={190} opacity={0}
        />
      </Node>
    </>
  );
  
  const oop_icon_task = yield loop(Infinity, function* () {
    yield* oop_icon_bobbing(-5, 0.5, easeInOutSine);
    yield* oop_icon_bobbing(0,   0.5, easeInOutSine);
  });
  yield* sequence(0.1,
    all(...oop_circles.map(r => r.size(80, 0.5))),
    oop_circles_meta().rotation(90, 1),
    oop_circle_dist_from_center(80, 0.5),
    fade_in_up(oop_label()),
  );
  
  yield* waitFor(0.5);
  const func_icon_task = yield loop(Infinity, function* () {
    yield* func_icon_bobbing(-5, 0.5, easeInOutSine);
    yield* func_icon_bobbing(0,   0.5, easeInOutSine);
  });
  yield* sequence(0.1,
    ...func_rects.map((r, i) => r.size(200-60*i, 0.5)),
    fade_in_up(func_label()),
  );

  yield* waitFor(0.5);
  const proc_icon_task = yield loop(Infinity, function* () {
    yield* proc_icon_bobbing(-5, 0.5, easeInOutSine);
    yield* proc_icon_bobbing(0,   0.5, easeInOutSine);
  });
  yield* sequence(0.1,
    ...proc_rects.map(r => sequence(0.05, r.opacity(1, 0.5), all(
      r.width(200, 0.5),
      r.x(r.x()+100, 0.5),
    ))),
    fade_in_up(proc_label()),
  );

  yield* waitUntil("procedural_exp");
  const procedures = createRef<Code>();
  const formA = createRef<Code>();
  const formB = createRef<Code>();
  
  view.add(<>
    <Code
      ref={procedures}
      fontSize={38}
      code={`\
BitmapImage to_bitmap(PNGImage png,
            BitmapFormat format) {
  // ...
}`}
      x={-325} y={20} // Final 300
      opacity={0}
    />
    <Code
      ref={formA}
      fontSize={38}
      code={`\
typedef struct PNGImage {
  string filename;
  string data;
} PNGImage;`}
      x={-600} y={-250+20}
      opacity={0}
    />
    <Code
      ref={formB}
      fontSize={38}
      code={`\
typedef struct BitmapImage {
  BitmapFormat format;
  union {
    u8* raw_data;
    f32* float_data;
    vec4* rgba_data;
    vec3* rgb_data;
  }
} BitmapImage;`}
      x={0} y={-150+20}
      opacity={0}
    />
  </>);
  yield* sequence(0.05,
    oop_icon().y(oop_icon().y() - 800, 0.5),
    func_icon().y(func_icon().y() + 800, 0.5),
  );
  yield* waitFor(3);
  yield* fade_in_up(procedures(), 20);
  yield* waitFor(1);
  yield* procedures().selection([[[0, 22], [0, 34]]], 0.5)
  yield* waitFor(0.5);
  yield* procedures().selection([[[0, 0], [0, 11]]], 0.5)
  yield* waitFor(0.5);
  yield* procedures().selection(DEFAULT, 0.5);

  yield* waitFor(2);
  yield* sequence(0.5,
    procedures().y(procedures().y() + 300, 0.5),
    sequence(0.2,
      fade_in_up(formA(), 20),
      fade_in_up(formB(), 20),
    ),
  );

  yield* waitUntil("oop");
  yield* sequence(0.1,
    proc_icon().y(proc_icon().y() + 800, 0.5),
    procedures().x(procedures().x() + 600, 0.5),
    formA().x(formA().x() + 600, 0.5),
    formB().x(formB().x() + 600, 0.5),
  );
  yield* waitFor(1);
  yield* oop_icon().y(() => oop_icon_bobbing(), 0.5);

  yield* waitFor(1);
  yield* sequence(0.1,
    all(
      procedures().code(`
BitmapImage to_bitmap(BitmapFormat format) {
  // ...
}`, 0.5),
      procedures().y(procedures().y() - 235, 0.5),
    ),
    all(
      formA().code(`
class PNGImage {
private:
  string filename;
  string data;

public:




};`, 0.5),
      formA().y(formA().y() + 200, 0.5),
      formA().x(formA().x() - 50, 0.5),
    ),
    fade_out_up(formB()),
  );

  yield* waitUntil("comparison");
  yield* sequence(0.2,
    all(
      formA().y(formA().y() - 800, 0.5),
      procedures().y(procedures().y() - 800, 0.5),
    ),
    proc_icon().y(() => proc_icon_bobbing(), 0.5),
  );

  yield* waitUntil("both_highlight");
  yield* sequence(0.3,
    chain(
      proc_icon().y(-100, 0.5, easeInOutSine),
      proc_icon().y(() => proc_icon_bobbing(), 0.5, easeInOutSine),
    ),
    chain(
      oop_icon().y(-100, 0.5, easeInOutSine),
      oop_icon().y(() => oop_icon_bobbing(), 0.5, easeInOutSine),
    ),
  );

  yield* waitUntil("code_data_separation");
  yield* all(
    oop_icon().x(oop_icon().x() - 800, 0.5),
    proc_icon().x(proc_icon().x() + 800, 0.5),
  );

  // CLEAR PASS 0
  view.removeChildren();
  cancel(oop_icon_task, func_icon_task, proc_icon_task);

  yield* waitFor(1);
  const code_label = createRef<Txt>();
  const data_label = createRef<Txt>();
  const bg_rect = createRef<Line>();
  const bg_hex = createRef<Line>();
  const code_sector = createRef<Node>();
  const data_sector = createRef<Node>();
  const cut_line = createRef<Rect>();
  
  view.add(<>
    <Node ref={code_sector}>
      <Line
        ref={bg_rect}
        x={-1700} y={-900-50}
        rotation={-30}
        points={[
          new Vector2([600, 0]).rotate(45),
          new Vector2([600, 0]).rotate(45+90),
          new Vector2([600, 0]).rotate(45+180),
          new Vector2([600, 0]).rotate(-45),
        ]}
        closed radius={100}
        fill={new Color(by_palette[1]).brighten(1).alpha(0.25)}
        width={800} height={800} zIndex={-1}
      />
      <RegularText
        ref={code_label}
        x={-1700} y={-900}
        text={"CODE"}
        fill={by_palette[0]}
        fontSize={256}
        shadowOffsetY={10}
        shadowBlur={0}
        shadowColor={shadow_color(by_palette[0])}
      />
    </Node>

    <Node ref={data_sector}>
      <Line
        ref={bg_hex}
        rotation={-15} x={1700} y={900}
        points={[
          [700, 0],
          new Vector2([700, 0]).rotate(120),
          new Vector2([700, 0]).rotate(-120),
        ]}
        closed radius={100}
        fill={new Color(by_palette[3]).brighten(1).alpha(0.25)}
        width={800} height={800} zIndex={-1}
      />
      <RegularText
        ref={data_label}
        x={1700} y={900}
        text={"DATA"}
        fill={by_palette[4]}
        fontSize={256}
        shadowOffsetY={10}
        shadowBlur={0}
        shadowColor={shadow_color(by_palette[4])}
      />
    </Node>

    <Rect
      ref={cut_line}
      rotation={60}
      width={0} height={2250}
      fill={new Gradient({
        type: "linear",
        from: new Vector2([-200, 0]),
        to: new Vector2([200, 0]),
        stops: [
          { offset: 0, color: Color.lerp("#414a4d", "#4d462b", 0.15) },
          { offset: 0.25, color: Color.lerp("#414a4d", "#4d462b", 0.15) },
          { offset: 0.25, color: Color.lerp("#414a4d", "#4d462b", 0.25) },
          { offset: 0.50, color: Color.lerp("#414a4d", "#4d462b", 0.25) },
          { offset: 0.50, color: Color.lerp("#414a4d", "#4d462b", 0.50) },
          { offset: 0.75, color: Color.lerp("#414a4d", "#4d462b", 0.50) },
          { offset: 0.75, color: Color.lerp("#414a4d", "#4d462b", 0.75) },
          { offset: 1, color: Color.lerp("#414a4d", "#4d462b", 0.75) },
          { offset: 1, color: "#4d462b" },
        ]
      })}
    />
  </>);

  const data_sector_task = yield loop(Infinity, function*() {
    yield* bg_hex().rotation(-15-360, 8, linear);
    bg_hex().rotation(-15);
  });

  const code_sector_task = yield loop(Infinity, function*() {
    yield* bg_rect().rotation(-30+360, 8, linear);
    bg_rect().rotation(-30);
  });

  yield* sequence(3.8,
    all(
      bg_hex().position([ 550,  300], 0.75, easeOutSine),
      data_label().position([ 550,  300], 0.75, easeOutSine),
    ),
    all(
      bg_rect().position([-550, -300], 0.75, easeOutSine),
      code_label().position([-550, -300], 0.75, easeOutSine),
    )
  );

  yield* waitUntil("data_callout");
  yield* chain(
    all(
      bg_hex().scale(1.5, 0.45, easeInOutSine),
      data_label().scale(1.5, 0.45, easeInOutSine),
    ),
    all(
      bg_hex().scale(1.0, 0.45, easeInOutSine),
      data_label().scale(1.0, 0.45, easeInOutSine),
    ),
  );
  yield* waitUntil("code_callout");
  yield* chain(
    all(
      bg_rect().scale(1.5, 0.45, easeInOutSine),
      code_label().scale(1.5, 0.45, easeInOutSine),
    ),
    all(
      bg_rect().scale(1.0, 0.45, easeInOutSine),
      code_label().scale(1.0, 0.45, easeInOutSine),
    ),
  );
  
  yield* waitUntil("mergedees");

  // Half extents: 960 540
  cancel(code_sector_task);
  yield all(
    bg_rect().scale(2, 0.75),
    bg_rect().position([0,0], 0.75),
    bg_rect().radius(0, 0.75),
    bg_rect().rotation(0, 0.75),
    bg_rect().points([
      [-960, 540 - 1200],
      [960, -540],
      [-960, 540],
    ], 0.75),
  );
  
  cancel(data_sector_task);
  yield* sequence(0.45,
    all(
      bg_hex().scale(2, 0.75),
      bg_hex().position([0,0], 0.75),
      bg_hex().radius(0, 0.75),
      bg_hex().rotation(0, 0.75),
      bg_hex().points([
        [960, -540 + 1200],
        [-960, 540],
        [960, -540],
      ], 0.75),
    ),
    cut_line().width(400, 0.75),
  );

  yield* waitUntil("fade_all");
  yield* all(
    cut_line().opacity(0, 0.35),
    data_sector().opacity(0, 0.5),
    code_sector().opacity(0, 0.5),
  );

  // CLEAR PASS 1
  view.removeChildren();
  yield* waitUntil("code_rep_stack");
  const stack_elements = createRefArray<Line>();
  const stack = createRef<Node>();
  const focus_reticle = createRef<Line>();
  const focus_line = createRef<Line>();
  const part_1_title = createRef<Rect>();
  const part_1_l1 = createRef<Txt>();
  const part_1_l2 = createRef<Txt>();
  
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
      x={-400} y={-200}
      lineWidth={10} closed
      lineDash={[50*1.2, 50*0.21]}
      stroke={new Color(by_palette[4]).brighten(2)}      
      shadowOffsetY={5}
      shadowColor={shadow_color(by_palette[4])}
    />
    <Line
      ref={focus_line}
      x={-400} y={-200}
      points={[[50, 0], [600, 0]]}
      end={0} lineWidth={10}
      stroke={new Color(by_palette[4]).brighten(2)}
      
      shadowOffsetY={5}
      shadowColor={shadow_color(by_palette[4])}
    />
    <Rect ref={part_1_title} x={450} y={-200} height={200} width={500}>
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
    </Rect>
  </>);
  yield* sequence(0.2,
    ...stack_elements.map(v => fade_in_up(v, -40)),
  );
    
  yield* waitUntil("focus_on_strings");
  const reticle_task = yield loop(Infinity, function* () {
    yield* focus_reticle().lineDashOffset(focus_reticle().lineDashOffset() + 100, 1, linear)
  });
  yield* focus_reticle().points([[50, 0], [0, 50], [-50, 0], [0, -50]], 0.5);
  yield* focus_line().end(1, 0.5);
  yield* part_1_l1().text("PART 1", 0.5);
  yield* waitFor(1);
  yield* part_1_l2().text("STRINGS", 0.5);

  yield* waitUntil("end");
  yield* sequence(0.1,
    focus_line().start(1, 0.5),
    focus_reticle().points([[0, 0]], 0.5),
    ...stack_elements.reverse().map(v => fade_out_up(v)),
    fade_out_up(part_1_title()),
  );

  yield* waitUntil("final");
  const r = createRef<Txt>();
  view.add(<>
    <RegularText
      ref={r}
      text={"FIN"}
    />
  </>)
  yield* waitFor(1);
});
