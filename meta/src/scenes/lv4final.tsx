import { Circle, Code, Gradient, Icon, Img, LezerHighlighter, Line, Node, Rect, Txt, lines, makeScene2D } from "@motion-canvas/2d";
import { Color, DEFAULT, Origin, all, createRef, createRefArray, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { fade_in_up, fade_out_up } from "../utils/anims";


import { parser } from '@lezer/cpp';
Code.defaultHighlighter = new LezerHighlighter(parser);

import img_callingconv from "../extern/callingconv.png"
import { by_palette, shadow_color, softgreen } from "../utils/colors";
import { RegularText } from "../utils/defaults";

export default makeScene2D(function* (view) {
  yield* waitFor(2);

  
  const callingconv_img = createRef<Img>();
  const highlight_rect = createRef<Rect>();
  view.add(<>
    <Img
      ref={callingconv_img}
      src={img_callingconv}
      width={900} height={900}
      y={40} opacity={0}
    />
    <Rect
      ref={highlight_rect}
      width={0} height={0}
      x={-75} y={250}
      lineWidth={6} radius={8}
      stroke={by_palette[4]}
    />
  </>);
  yield* fade_in_up(callingconv_img());
  yield* waitFor(5);
  yield highlight_rect().width(680, 0.5);
  yield* highlight_rect().height(50, 0.5);
  yield* waitFor(2);
  yield* highlight_rect().y(195, 0.5);
  yield* waitFor(3);
  yield* sequence(0.1, fade_out_up(highlight_rect()), fade_out_up(callingconv_img()));

  const example_code = createRef<Code>();
  view.add(<>
    <Code
      ref={example_code}
      x={-1800}
      code={`\
char* buffer = VirtualAlloc(NULL, 100, MEM_RESERVE|MEM_COMMIT,
                            PAGE_EXECUTE_READWRITE);
// Cursed C alert
int (*fn)(int) = (int (*)(int)) buffer;

// mov eax, ecx
buffer[0] = 0x89;
buffer[1] = 0xC8;
// ret
buffer[2] = 0xC2;

int answer = fn(10);
VirtualFree(buffer, 100, MEM_DECOMMIT|MEM_RELEASE);`}
      fontSize={45}
    />
  </>);
  yield* example_code().x(0, 0.5);
  yield* waitFor(1);
  yield* example_code().selection(lines(5,7), 0.5);
  yield* waitFor(8);
  yield* example_code().selection(DEFAULT, 0.5);

  yield* waitFor(4);
  const itsdonepkg = createRef<Rect>();
  const itsdonepkg_lbl = createRef<Rect>();
  const itsdonepkg_lbl_txt = createRef<Rect>();
  const dependency_containers = createRefArray<Rect>();
  const dependency_mains = createRefArray<Txt>();
  const dependency_subs = createRefArray<Txt>();
  const dependency_connectors = createRefArray<Line>();
  view.add(<>
    <Rect
      ref={itsdonepkg}
      width={1300} height={700}
      lineWidth={12} radius={8}
      stroke={by_palette[3]}
      end={0}
    >
      <Line
          ref={itsdonepkg_lbl}
          x={-(1300/2)-6} y={-(700/2)}
          points={[[5, 0], [0, 20], [0, 0], [0, -100], [500, -100], [600, 0]]}
          closed radius={5} end={0}
          fill={by_palette[3]}
          lineWidth={15}
      />
      <RegularText
          ref={itsdonepkg_lbl_txt}
          text={"Execution Engine"}
          x={-(1300/2)+20} y={-(700/2)-45+40} opacity={0}
          offset={[-1, 0]}
          fill={"#ffffff"} shadowOffsetY={0}
      />
    </Rect>

    <Rect
      ref={dependency_containers}
      width={400} height={200}
      x={-500} y={250+40} opacity={0}
      stroke={by_palette[2]}
      lineWidth={8} radius={8}
      fill={new Gradient({
        type: "linear",
        from: [0, -100],
        to:   [0,  100],
        stops: [
          { offset: 0, color: shadow_color(by_palette[1]).darken().alpha(0.25) },
          { offset: 0.5, color: shadow_color(by_palette[1]).darken().alpha(0.25) },
          { offset: 0.5, color: shadow_color(by_palette[1]).darken(2).alpha(0.25) },
          { offset: 1, color: shadow_color(by_palette[1]).darken(2).alpha(0.25) },
        ]
      })}
      shadowOffsetY={4}
      shadowColor={shadow_color(by_palette[2])}
    >
      <Line
        points={[[-200, 0], [200, 0]]}
        stroke={by_palette[2]}
        lineWidth={8}
      />
      <RegularText
        ref={dependency_mains}
        text={"Buffer Allocation"}
        fill={by_palette[3]}
        y={-50}
        fontSize={45}
        shadowOffsetY={2}
      />
      <RegularText
        ref={dependency_subs}
        text={"OS"}
        fill={by_palette[3]}
        y={50}
        fontSize={50}
        shadowOffsetY={2}
      />
    </Rect>

    <Rect
      ref={dependency_containers}
      width={400} height={200}
      x={0} y={250+40} opacity={0}
      stroke={by_palette[2]}
      lineWidth={8} radius={8}
      fill={new Gradient({
        type: "linear",
        from: [0, -100],
        to:   [0,  100],
        stops: [
          { offset: 0, color: shadow_color(by_palette[1]).darken().alpha(0.25) },
          { offset: 0.5, color: shadow_color(by_palette[1]).darken().alpha(0.25) },
          { offset: 0.5, color: shadow_color(by_palette[1]).darken(2).alpha(0.25) },
          { offset: 1, color: shadow_color(by_palette[1]).darken(2).alpha(0.25) },
        ]
      })}
      shadowOffsetY={4}
      shadowColor={shadow_color(by_palette[2])}
    >
      <Line
        points={[[-200, 0], [200, 0]]}
        stroke={by_palette[2]}
        lineWidth={8}
      />
      <RegularText
        ref={dependency_mains}
        text={"Instruction Encoding"}
        fill={by_palette[3]}
        y={-50}
        fontSize={45}
        shadowOffsetY={2}
      />
      <RegularText
        ref={dependency_subs}
        text={"Processor"}
        fill={by_palette[3]}
        y={50}
        fontSize={50}
        shadowOffsetY={2}
      />
    </Rect>
    
    <Rect
      ref={dependency_containers}
      width={400} height={200}
      x={500} y={250+40} opacity={0}
      stroke={by_palette[2]}
      lineWidth={8} radius={8}
      fill={new Gradient({
        type: "linear",
        from: [0, -100],
        to:   [0,  100],
        stops: [
          { offset: 0, color: shadow_color(by_palette[1]).darken().alpha(0.25) },
          { offset: 0.5, color: shadow_color(by_palette[1]).darken().alpha(0.25) },
          { offset: 0.5, color: shadow_color(by_palette[1]).darken(2).alpha(0.25) },
          { offset: 1, color: shadow_color(by_palette[1]).darken(2).alpha(0.25) },
        ]
      })}
      shadowOffsetY={4}
      shadowColor={shadow_color(by_palette[2])}
    >
      <Line
        points={[[-200, 0], [200, 0]]}
        stroke={by_palette[2]}
        lineWidth={8}
      />
      <RegularText
        ref={dependency_mains}
        text={"Calling Convention"}
        fill={by_palette[3]}
        y={-50}
        fontSize={45}
        shadowOffsetY={2}
      />
      <RegularText
        ref={dependency_subs}
        text={"OS + Language"}
        fill={by_palette[3]}
        y={50}
        fontSize={50}
        shadowOffsetY={2}
      />
    </Rect>
    
    <Line
      ref={dependency_connectors} end={0}
      points={[ [-357, -35], [-500, 151] ]}
      stroke={new Gradient({
        type: "linear",
        from: [-357, -35],
        to:   [-500, 151],
        stops: [
          { offset: 0, color: by_palette[3] },
          { offset: 1, color: by_palette[2] },
        ]
      })}
      lineWidth={8}
    />
    <Line
      ref={dependency_connectors} end={0}
      points={[ [0, -35], [0, 151] ]}
      stroke={new Gradient({
        type: "linear",
        from: [0, -35],
        to:   [0, 151],
        stops: [
          { offset: 0, color: by_palette[3] },
          { offset: 1, color: by_palette[2] },
        ]
      })}
      lineWidth={8}
    />
    <Line
      ref={dependency_connectors} end={0}
      points={[ [357, -35], [500, 151] ]}
      stroke={new Gradient({
        type: "linear",
        from: [357, -35],
        to:   [500, 151],
        stops: [
          { offset: 0, color: by_palette[3] },
          { offset: 1, color: by_palette[2] },
        ]
      })}
      lineWidth={8}
    />
  </>);
  yield* example_code().fontSize(35, 0.5)
  yield* itsdonepkg().end(1, 0.5);
  yield* itsdonepkg_lbl().end(1, 0.5);
  yield* fade_in_up(itsdonepkg_lbl_txt());
  yield* waitUntil("drawbacks");
  yield* all(
    example_code().fontSize(20, 0.5),
    itsdonepkg().scale(0.55, 0.5),
    example_code().y(example_code().y()-225, 0.5),
    itsdonepkg().y(itsdonepkg().y()-225, 0.5),
  );
  
  yield* waitUntil("dep1");
  yield* sequence(0.1,
    fade_in_up(dependency_containers[0]),
    dependency_connectors[0].end(1, 0.5),
  );
  yield* waitUntil("dep2");
  yield* sequence(0.1,
    fade_in_up(dependency_containers[2]),
    dependency_connectors[2].end(1, 0.5),
  );
  yield* waitUntil("dep3");
  yield* sequence(0.1,
    fade_in_up(dependency_containers[1]),
    dependency_connectors[1].end(1, 0.5),
  );

  yield* waitUntil("nichecases");
  yield* all(
    example_code().x(example_code().x()-1800, 0.75),
    itsdonepkg().x(itsdonepkg().x()-1800, 0.75),
    ...dependency_containers.map(v => v.x(v.x()-1800, 0.75)),
    ...dependency_connectors.map(v => v.x(v.x()-1800, 0.75)),
  );
  view.removeChildren();

  yield* waitUntil("regularcompilers");
  const compiler_package = createRef<Node>()
  const compiler = createRef<Rect>();
  const compiler_container = createRef<Rect>();
  const compiler_txt = createRef<Txt>();
  const c_source = createRef<Icon>();
  const source_to_compiler = createRef<Line>();
  const compiler_to_out = createRef<Line>();
  const output_exe = createRef<Icon>();

  
  const interp_package = createRef<Node>()
  const interp = createRef<Rect>();
  const interp_container = createRef<Rect>();
  const interp_txt = createRef<Txt>();
  const interp_vm_txt = createRef<Txt>();
  const py_source = createRef<Icon>();
  const source_to_interp = createRef<Line>();
  const interp_to_out = createRef<Line>();
  const output_lines = createRef<Icon>();

  const JIT_package = createRef<Node>()
  const JIT = createRef<Rect>();
  const JIT_container = createRef<Rect>();
  const JIT_txt = createRef<Txt>();
  const JIT_vm_txt = createRef<Txt>();
  const js_source = createRef<Icon>();
  const source_to_JIT = createRef<Line>();
  const JIT_to_out = createRef<Line>();
  const output_lines_for_jit = createRef<Icon>();
  view.add(<>
    <Node ref={compiler_package}>
      <Rect
        ref={compiler_container}
        width={600} height={850}
        radius={12} end={0}
        stroke={by_palette[0]}
        lineWidth={12} fill={"#222222"}
        shadowOffsetY={10}
        shadowColor={shadow_color(by_palette[0])}
      />
      <Rect
        ref={compiler}
        width={400} height={150} radius={12}
        stroke={by_palette[0]} y={40} opacity={0}
        lineWidth={12} fill={"#222222"}
        shadowOffsetY={2}
        shadowColor={shadow_color(by_palette[0])}
      >
        <RegularText
          ref={compiler_txt}
          text={"Compiler"}
          fill={by_palette[0]}
          fontSize={80} shadowOffsetY={2}
          shadowColor={shadow_color(by_palette[0])}
        />
      </Rect>
      <Icon
        ref={c_source}
        icon={"ph:file-c"}
        size={200} y={-300+40} opacity={0}
        color={by_palette[0]}
        shadowOffsetY={2}
        shadowColor={shadow_color(by_palette[0])}
      />
      <Line
        ref={source_to_compiler}
        points={[[0, -160], [0, -80]]}
        stroke={by_palette[0]}
        end={0}
        lineWidth={40}
        shadowOffsetY={2}
        shadowColor={shadow_color(by_palette[0])}
      />
      <Line
        ref={compiler_to_out}
        points={[[0, 80], [0, 180]]}
        stroke={by_palette[0]}
        lineWidth={40}
        arrowSize={120}
        end={0}
        endArrow
        shadowOffsetY={2}
        shadowColor={shadow_color(by_palette[0])}
      />
      <Icon
        ref={output_exe}
        icon={"bi:filetype-exe"}
        size={160} y={300+40} opacity={0}
        color={by_palette[0]}
        shadowOffsetY={2}
        shadowColor={shadow_color(by_palette[0])}
      />
    </Node>



    <Node ref={interp_package}>
      <Rect
        ref={interp_container}
        width={600} height={850}
        radius={12} end={0}
        stroke={by_palette[4]}
        lineWidth={12} fill={"#222222"}
        shadowOffsetY={10}
        shadowColor={shadow_color(by_palette[4])}
      />
      <Rect
        ref={interp}
        width={400} height={150} radius={12}
        stroke={by_palette[4]} y={40} opacity={0}
        lineWidth={12} fill={"#222222"}
        shadowOffsetY={2}
        shadowColor={shadow_color(by_palette[4])}
      >
        <RegularText
          ref={interp_txt}
          text={"Interpreter"}
          fill={by_palette[4]}
          fontSize={80} shadowOffsetY={2}
          shadowColor={shadow_color(by_palette[4])}
        />
        <RegularText
          ref={interp_vm_txt}
          text={"VM"} x={190} y={-120+40}
          fill={by_palette[4]} opacity={0}
          fontSize={60} shadowOffsetY={2}
          shadowColor={shadow_color(by_palette[4])}
          offset={[1, 0]}
        />
        
      </Rect>
      <Icon
        ref={py_source}
        icon={"ph:file-py"}
        size={200} y={-300+40} opacity={0}
        color={by_palette[4]}
        shadowOffsetY={2}
        shadowColor={shadow_color(by_palette[4])}
      />
      <Line
        ref={source_to_interp}
        points={[[0, -160], [0, -80]]}
        stroke={by_palette[4]}
        end={0}
        lineWidth={40}
        shadowOffsetY={2}
        shadowColor={shadow_color(by_palette[4])}
      />
      <Line
        ref={interp_to_out}
        points={[[0, 80], [0, 180]]}
        stroke={by_palette[4]}
        lineWidth={40}
        arrowSize={120}
        end={0}
        endArrow
        shadowOffsetY={2}
        shadowColor={shadow_color(by_palette[4])}
      />
      <Icon
        ref={output_lines}
        icon={"streamline:interface-setting-menu-2-button-parallel-horizontal-lines-menu-navigation-staggered-three-hamburger"}
        size={160} y={300+40} opacity={0}
        color={by_palette[4]}
        shadowOffsetY={2}
        shadowColor={shadow_color(by_palette[4])}
      />
    </Node>

    
    <Node ref={JIT_package}>
      <Rect
        ref={JIT_container}
        width={600} height={850}
        radius={12} end={0}
        stroke={by_palette[2]}
        lineWidth={12} fill={"#222222"}
        shadowOffsetY={10}
        shadowColor={shadow_color(by_palette[2])}
      />
      <Rect
        ref={JIT}
        width={400} height={150} radius={12}
        stroke={by_palette[2]} y={40} opacity={0}
        lineWidth={12} fill={"#222222"}
        shadowOffsetY={2}
        shadowColor={shadow_color(by_palette[2])}
      >
        <RegularText
          ref={JIT_txt}
          text={"JIT compiler"}
          fill={by_palette[2]}
          fontSize={60} shadowOffsetY={2}
          shadowColor={shadow_color(by_palette[2])}
        />
        <RegularText
          ref={JIT_vm_txt}
          text={"Native"} x={190} y={-120+40}
          fill={by_palette[2]} opacity={0}
          fontSize={60} shadowOffsetY={2}
          shadowColor={shadow_color(by_palette[2])}
          offset={[1, 0]}
        />
        
      </Rect>
      <Icon
        ref={js_source}
        icon={"ph:file-py"}
        size={200} y={-300+40} opacity={0}
        color={by_palette[2]}
        shadowOffsetY={2}
        shadowColor={shadow_color(by_palette[2])}
      />
      <Line
        ref={source_to_JIT}
        points={[[0, -160], [0, -80]]}
        stroke={by_palette[2]}
        end={0}
        lineWidth={40}
        shadowOffsetY={2}
        shadowColor={shadow_color(by_palette[2])}
      />
      <Line
        ref={JIT_to_out}
        points={[[0, 80], [0, 180]]}
        stroke={by_palette[2]}
        lineWidth={40}
        arrowSize={120}
        end={0}
        endArrow
        shadowOffsetY={2}
        shadowColor={shadow_color(by_palette[2])}
      />
      <Icon
        ref={output_lines_for_jit}
        icon={"streamline:interface-setting-menu-2-button-parallel-horizontal-lines-menu-navigation-staggered-three-hamburger"}
        size={160} y={300+40} opacity={0}
        color={by_palette[2]}
        shadowOffsetY={2}
        shadowColor={shadow_color(by_palette[2])}
      />
    </Node>
  </>);
  yield* fade_in_up(compiler());
  yield* waitFor(1);
  yield* fade_in_up(c_source());
  yield* source_to_compiler().end(1, 0.5);
  yield* waitFor(0.5);
  yield* compiler_to_out().end(1, 0.5);
  yield* fade_in_up(output_exe());

  yield* waitUntil("place_compiler");
  yield* compiler_package().scale(0.5, 0.5);
  yield* compiler_package().x(-600, 0.5);
  yield* compiler_container().end(1, 0.5);
  
  yield* fade_in_up(interp());
  yield* waitFor(1);
  yield* fade_in_up(py_source());
  yield* source_to_interp().end(1, 0.5);
  yield* waitFor(0.5);
  yield* interp_to_out().end(1, 0.5);
  yield* fade_in_up(output_lines());
  yield* waitFor(2.5);
  yield* fade_in_up(interp_vm_txt());

  yield* waitUntil("place_interp");
  yield* interp_package().scale(0.5, 0.5);
  yield* interp_package().x(600, 0.5);
  yield* interp_container().end(1, 0.5);

  yield* waitFor(1);
  yield* fade_in_up(JIT());
  yield* waitFor(1);
  yield* fade_in_up(js_source());
  yield* source_to_JIT().end(1, 0.5);
  yield* waitFor(0.5);
  yield* JIT_to_out().end(1, 0.5);
  yield* fade_in_up(output_lines_for_jit());
  yield* waitFor(2.5);
  yield* fade_in_up(JIT_vm_txt());

  yield* waitUntil("place_JIT");
  yield* JIT_package().scale(0.5, 0.5);
  yield* JIT_container().end(1, 0.5);

  yield* waitUntil("hideeverything");
  yield* sequence(0.2,
    JIT_package().y(-1000, 0.5),
    all(
      compiler_package().y(-1000, 0.5),
      interp_package().y(-1000, 0.5),
    )
  );
  view.removeChildren();

  yield* waitUntil("js_mentioned");
  const js_logo = createRef<Icon>();
  const v8_logo = createRef<Icon>();

  view.add(<>
    <Icon
      ref={js_logo}
      icon={"logos:javascript"}
      size={300} y={40} opacity={0}
    />
    <Icon
      ref={v8_logo}
      icon={"logos:v8"}
      x={400}
      size={300} y={40} opacity={0}
    />
  </>)
  yield* fade_in_up(js_logo());
  yield* waitUntil("v8_metioned");
  yield* js_logo().x(-400, 0.5);
  yield* fade_in_up(v8_logo());
  yield* waitUntil("unshow_jit_examp");
  yield* sequence(0.1,
    fade_out_up(js_logo()),
    fade_out_up(v8_logo()),
  );


  
  yield* waitUntil("finishedstack");
  const stack_elements = createRefArray<Line>();
  const stack = createRef<Node>();
  const checkmark = createRef<Icon>();
  
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
      <Icon
        ref={checkmark}
        icon={"hugeicons:checkmark-circle-04"}
        color={softgreen}
        shadowOffsetY={10} shadowColor={shadow_color(softgreen).darken(2)}
        size={700} y={40} opacity={0}
      />
    </Node>
  </>);
  yield* sequence(0.2,
    ...stack_elements.map(v => fade_in_up(v, -40)),
  );
  yield* fade_in_up(checkmark());

  yield* waitUntil("PSA");
  yield* sequence(0.2,
    fade_out_up(checkmark()),
    ...stack_elements.reverse().map(v => fade_out_up(v, 40)),
  );
  const psa = createRefArray<Txt>();
  view.add(<>
    <RegularText
      ref={psa}
      text={""}
      y={-200}
      fontSize={128}
    />
    <RegularText
      ref={psa} fontStyle={"italic"}
      text={""}
      y={-50} fill={by_palette[1]}
      shadowColor={shadow_color(by_palette[1])}
      fontSize={100}
    />
  </>);
  yield* waitFor(3);
  yield* psa[0].text("Metaprogramming is powerful", 0.5);
  yield* waitFor(15);
  yield* psa[1].text("try not to overuse it", 0.5);

  yield* waitUntil("end");
});