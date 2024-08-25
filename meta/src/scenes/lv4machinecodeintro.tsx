import { Code, Gradient, Icon, LezerHighlighter, Line, Node, Rect, Txt, lines, makeScene2D } from "@motion-canvas/2d";
import { Color, DEFAULT, Origin, Vector2, all, cancel, chain, createRef, createRefArray, easeInOutSine, easeOutSine, linear, loop, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { by_palette, shadow_color } from "../utils/colors";
import { RegularText } from "../utils/defaults";
import { fade_in_up, fade_out_up } from "../utils/anims";

import { parser } from '@lezer/cpp';
Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeScene2D(function* (view) {
  yield* waitUntil("codedatadiff");
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

  yield* sequence(1.,
    all(
      bg_hex().position([ 550,  300], 0.75, easeOutSine),
      data_label().position([ 550,  300], 0.75, easeOutSine),
    ),
    all(
      bg_rect().position([-550, -300], 0.75, easeOutSine),
      code_label().position([-550, -300], 0.75, easeOutSine),
    )
  );
  
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
  const c_file = createRef<Icon>();
  const xlsx_file = createRef<Icon>();

  view.add(<>
    <Icon
      ref={c_file}
      icon={"ph:file-c"}
      x={-300} y={40} opacity={0}
      width={350} height={400}
      color={by_palette[1]}
      shadowOffsetY={10}
      shadowColor={shadow_color(by_palette[1])}
    />
    <Icon
      ref={xlsx_file}
      icon={"ph:file-xls"}
      x={300} y={40} opacity={0}
      width={350} height={400}
      color={by_palette[3]}
      shadowOffsetY={10}
      shadowColor={shadow_color(by_palette[3])}
    />
  </>);
  yield* waitFor(2);
  yield* fade_in_up(c_file());
  yield* waitFor(2);
  yield* fade_in_up(xlsx_file());
  yield* waitFor(2);
  yield* sequence(0.1,
    fade_out_up(c_file()),
    fade_out_up(xlsx_file()),
  );

  yield* waitUntil("onlybinary");
  view.removeChildren();
  const zoom_view = createRef<Rect>();
  const ram_txt = createRef<Txt>();
  const code0 = createRef<Code>();
  const code1 = createRef<Code>();
  const addresses = createRefArray<Txt>();
  const addr_sep = createRef<Line>();
  const number_in_ram = createRefArray<Txt>();
  const instruction_in_ram = createRefArray<Txt>();
  view.add(<>
    <Rect
      ref={zoom_view}
      x={(700+75)/2} y={0 } opacity={0}
      width={700} height={3*275}
      radius={15}
      fill={"#222222"}
      lineWidth={12}
      stroke={new Color(by_palette[1]).brighten()}
    >
      {...range(5).map(i => <RegularText
        ref={addresses}
        fontSize={40} x={-260} y={-340+i*75}
        text={(0x2f0000+i*4).toString(16)}
        shadowOffsetY={0}
      />)}
      <RegularText
        ref={addresses}
        fontSize={40} x={-260} y={35}
        text={"⋮"}
        shadowOffsetY={0}
      />
      {...range(4).map(i => <RegularText
        ref={addresses}
        fontSize={40} x={-260} y={110+i*75}
        text={(0x3f0000+i*4).toString(16)}
        shadowOffsetY={0}
      />)}
      <Line
        ref={addr_sep}
        points={[[-170, -410], [-170, 410]]}
        lineWidth={12}
        stroke={new Color(by_palette[1]).brighten()}
      />
      {...range(4).map(i => <RegularText
        ref={number_in_ram}
        x={-100+i*125} y={-340} opacity={0} fontSize={45}
        fill={"#b48ead"}
        text={"0023af20".substring(i*2, (i+1)*2)}
        shadowOffsetY={0}
      />)}
      {...range(4).map(i => <RegularText
        ref={instruction_in_ram}
        x={-100+i*125} y={110} opacity={0} fontSize={45}
        fill={"#8fbcbb"}
        text={"4889d800".substring(i*2, (i+1)*2)}
        shadowOffsetY={0}
      />)}
    </Rect>
    <RegularText
      ref={ram_txt}
      text={"RAM"}
      x={() => zoom_view().x()} y={() => 480 + zoom_view().y()}
      fontSize={100} opacity={() => zoom_view().opacity()}
    />
    <Code
      ref={code0}
      code={`int A = 0x23af20;`}
      fontSize={70}
      x={-450} y={-250+40} opacity={0}  
    />
    <Code
      ref={code1}
      code={`mov rax, rbx`}
      fontSize={80}
      x={-450} y={250+40} opacity={0}
    />
  </>);
  yield* fade_in_up(zoom_view());
  yield* fade_in_up(code0());
  yield* waitFor(1);
  yield* sequence(0.1, ...number_in_ram.map(t => t.opacity(1, 0.5)));
  yield* waitFor(4);
  yield* fade_in_up(code1());
  yield* waitFor(1);
  yield* sequence(0.1, ...instruction_in_ram.map(t => t.opacity(1, 0.5)));

  yield* waitUntil("highlightboth");
  yield* chain(
    code0().scale(1.5, 0.45, easeInOutSine),
    code0().scale(1.0, 0.45, easeInOutSine),
  );
  yield* chain(
    code1().scale(1.5, 0.45, easeInOutSine),
    code1().scale(1.0, 0.45, easeInOutSine),
  );

  yield* waitFor(3.5);
  yield* chain(
    code1().scale(1.5, 0.45, easeInOutSine),
    code1().scale(1.0, 0.45, easeInOutSine),
  );

  yield* waitFor(1);
  yield* chain(
    code0().scale(1.5, 0.45, easeInOutSine),
    code0().scale(1.0, 0.45, easeInOutSine),
  );

  yield* waitUntil("absolutely");
  yield* sequence(0.1,
    zoom_view().x(zoom_view().x() + 1000, 0.5),
    code0().x(code0().x() - 1000, 0.5),
    code1().x(code1().x() - 1000, 0.5),
  );
  yield* waitFor(1.2);
  const YES = createRef<Txt>();
  view.add(<>
    <RegularText
      ref={YES}
      text={"YES"}
      fill={"#65FE08"}
      fontSize={512} y={40} opacity={0}
      shadowOffsetY={20}
      shadowColor={shadow_color("#65FE08")}
    />
  </>);
  yield* fade_in_up(YES());
  yield* waitUntil("outyes");
  yield* fade_out_up(YES());

  yield* waitUntil("examplecode_start");
  const example_code = createRef<Code>();
  view.add(<>
    <Code
      ref={example_code}
      code={`\
char* buffer = malloc(100);
buffer[0] = ; // Instruction 0
buffer[1] = ; // Instruction 1
buffer[2] = ; // Instruction 2

execute(buffer);
free(buffer);`}
      y={40} opacity={0}
      fontSize={80}
    />
  </>);
  yield* fade_in_up(example_code());
  yield* waitUntil("step0");
  yield* example_code().selection(lines(0), 0.5);
  yield* waitUntil("step1");
  yield* example_code().selection(lines(1, 3), 0.5);
  yield* waitUntil("step2");
  yield* example_code().selection(lines(5), 0.5);
  yield* waitUntil("step3");
  yield* example_code().selection(lines(6), 0.5);
  yield* waitUntil("stepdone");
  yield* loop(3, function* () {
    yield* example_code().selection(lines(0), 0.3);
    yield* example_code().selection(lines(1, 3), 0.3);
    yield* example_code().selection(lines(5), 0.3);
    yield* example_code().selection(lines(6), 0.3);
  });
  yield* example_code().selection(DEFAULT, 0.5);

  yield* waitUntil("end");
  yield* fade_out_up(example_code());
});