import { Code, Gradient, Icon, Img, LezerHighlighter, Line, Node, Rect, SVG, Txt, Video, lines, makeScene2D } from "@motion-canvas/2d";
import { Color, all, chain, createRef, createRefArray, easeInOutSine, linear, loop, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { by_palette, shadow_color } from "../utils/colors";
import { RegularText } from "../utils/defaults";
import { fade_in_up, fade_out_up } from "../utils/anims";

import vid_gen_hash_table from "../extern/gen_hash_table_revised.mp4";
import vid_glad from "../extern/glad_showcase.mp4";
import vid_gen_param_hash_table from "../extern/param_hash_table_gen.mp4";
import svg_opengl_logo from "../extern/opengl-logo.svg?raw";
import svg_vulkan_logo from "../extern/vulkan-logo.svg?raw";
import png_metal_logo from "../extern/metal-logo.png";

import { parser } from '@lezer/cpp';
Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeScene2D(function* (view) {
  yield* waitUntil("prog_generating_progs");
  const my_program = createRef<Node>();
  const my_program_icon = createRef<Icon>();
  const my_program_title = createRef<Txt>();
  const my_exe = createRef<Node>();
  const my_exe_icon = createRef<Icon>();
  const my_exe_title = createRef<Txt>();
  const genned_program = createRef<Node>();
  const genned_program_icon = createRef<Icon>();
  const genned_program_title = createRef<Txt>();
  const line0 = createRef<Line>();
  const line1 = createRef<Line>();

  view.add(<>
    <Node ref={my_program} x={-600} y={40} opacity={0}>
      <Icon
        ref={my_program_icon}
        y={-50}
        icon={"material-symbols-light:code-blocks-outline"}
        size={325}
        color={by_palette[0]}

        shadowOffsetY={5}
        shadowColor={shadow_color(by_palette[0])}
      />
      <RegularText
        ref={my_program_title}
        y={150}
        fontSize={75}
        text={"Program"}

        fill={by_palette[0]}
        shadowColor={shadow_color(by_palette[0])}
      />
    </Node>

    <Node ref={my_exe} x={0} y={40} opacity={0}>
      <Icon
        ref={my_exe_icon}
        y={-50}
        icon={"bi:filetype-exe"}
        size={225}
        color={by_palette[2]}
        
        shadowOffsetY={5}
        shadowColor={shadow_color(by_palette[2])}
      />
      <RegularText
        ref={my_exe_title}
        y={200}
        fontSize={75} textAlign={"center"}
        text={"Generator\nExe"}
        
        fill={by_palette[2]}
        shadowColor={shadow_color(by_palette[2])}
      />
    </Node>

    <Node ref={genned_program} x={600} y={40} opacity={0}>
      <Icon
        ref={genned_program_icon}
        y={-50}
        icon={"material-symbols-light:code-blocks-outline"}
        size={325}
        color={by_palette[4]}

        shadowOffsetY={5}
        shadowColor={shadow_color(by_palette[4])}
      />
      <RegularText
        ref={genned_program_title}
        y={200}
        fontSize={75} textAlign={"center"}
        text={"Generated\nProgram"}

        fill={by_palette[4]}
        shadowColor={shadow_color(by_palette[4])}
      />
    </Node>

    <Line
      ref={line0}
      x={-300} y={-50}
      points={[[-100, 0], [100, 0]]}
      endArrow arrowSize={40}
      lineWidth={20} end={0}
      stroke={new Gradient({
        type: "linear",
        from: [-100, 0],
        to: [100, 0],
        stops: [
          { offset: 0, color: by_palette[0] },
          { offset: 1, color: by_palette[2] },
        ]
      })}
      shadowColor={Color.lerp(by_palette[0], by_palette[2], 0.5).brighten().alpha(0.5)}
      shadowOffsetY={5}
    />
    <Line
      ref={line1}
      x={300} y={-50}
      points={[[-100, 0], [100, 0]]}
      endArrow arrowSize={40}
      lineWidth={20} end={0}
      stroke={new Gradient({
        type: "linear",
        from: [-100, 0],
        to: [100, 0],
        stops: [
          { offset: 0, color: by_palette[2] },
          { offset: 1, color: by_palette[4] },
        ]
      })}
      shadowColor={Color.lerp(by_palette[2], by_palette[4], 0.5).brighten().alpha(0.5)}
      shadowOffsetY={5}
    />
  </>);
  yield* fade_in_up(my_program());
  yield* waitFor(0.2);
  yield* line0().end(1, 0.5);
  yield* fade_in_up(my_exe());
  yield* waitFor(0.2);
  yield* line1().end(1, 0.5);
  yield* fade_in_up(genned_program());
  
  yield* waitUntil("hello_world_gen");
  yield* all(
    my_exe().y(-400, 0.5),
    my_exe_icon().size(my_exe_icon().size().div(2), 0.5),
    my_exe_title().y(my_exe_title().y() - 125, 0.5),
    my_exe_title().fontSize(my_exe_title().fontSize() / 2, 0.5),
    my_exe_title().shadowOffset([0, 3], 0.5),

    my_program().x(-400, 0.5), my_program().y(-400, 0.5),
    my_program_icon().size(my_program_icon().size().div(2), 0.5),
    my_program_title().y(my_program_title().y() - 100, 0.5),
    my_program_title().fontSize(my_program_title().fontSize() / 2, 0.5),
    my_program_title().shadowOffset([0, 3], 0.5),

    genned_program().x(400, 0.5), genned_program().y(-400, 0.5),
    genned_program_icon().size(genned_program_icon().size().div(2), 0.5),
    genned_program_title().y(genned_program_title().y() - 125, 0.5),
    genned_program_title().fontSize(genned_program_title().fontSize() / 2, 0.5),
    genned_program_title().shadowOffset([0, 3], 0.5),

    line0().x(-200, 0.5), line0().y(-450, 0.5),
    line0().arrowSize(25, 0.5), line0().lineWidth(15, 0.5),
    line0().points([[-80, 0], [80, 0]], 0.5),

    line1().x(200, 0.5), line1().y(-450, 0.5),
    line1().arrowSize(25, 0.5), line1().lineWidth(15, 0.5),
    line1().points([[-80, 0], [80, 0]], 0.5),
  );

  const hello_world_gen = createRef<Code>();
  const hello_world_gen_rect = createRef<Rect>();
  const generated_bad_fn = createRef<Code>();
  const generated_bad_fn_rect = createRef<Rect>();
  view.add(<>
    <Code
      ref={hello_world_gen}
      fontSize={32}
      code={`\
// Includes

int main() {
  string str = str_lit("#include <stdio.h>\\n"
    "\\n"
    "int main() {\\n"
    "  printf(\\"Hello, World!\\\\n\\\");\\n"
    "}\\n");
  create_and_write_file("prog.c", str);
}`}
      y={140}
      opacity={0}
    />
    <Rect
      ref={hello_world_gen_rect}
      width={() => hello_world_gen().width() + 80} height={() => hello_world_gen().height() + 80}
      zIndex={-1}
      position={() => hello_world_gen().position()} lineWidth={15} radius={5}
      stroke={by_palette[0]}
      opacity={0}
    />

    <Code
      ref={generated_bad_fn}
      fontSize={38}
      code={`\
bool is_even(int value) {
  if (value == 0) return true;
  if (value == 1) return false;
  if (value == 2) return true;
  if (value == 3) return false;
  if (value == 4) return true;
  //...
`}
      y={100} x={1700}
    />
    <Rect
      ref={generated_bad_fn_rect}
      width={() => generated_bad_fn().width() + 80} height={() => generated_bad_fn().height() + 80}
      zIndex={-1}
      position={() => generated_bad_fn().position()} lineWidth={15} radius={5}
      stroke={by_palette[0]}
    />
  </>);
  yield* all(fade_in_up(hello_world_gen()), hello_world_gen_rect().opacity(1, 0.5));

  yield* waitUntil("is_even_program");
  yield* hello_world_gen().code(`\
// Includes

int main() {
  Arena arena = make_arena();
  string_list str = {.arena=arena};
  
  string_list_push(&str, "bool is_even(int value) {")
  for (int i = 0; i < 100; i++) {
    string_list_push(&str, "if (value == i) return %s;",
      i % 2 == 0 ? true : false);
  }
  string_list_push(&str, "}")

  create_and_write_file_strings("prog.c", str);
}`, 1.2);

  yield* waitUntil("highlight_loop");
  yield* hello_world_gen().selection(lines(7, 10), 0.7);

  yield* waitUntil("show_output_is_even");
  yield* all(
    hello_world_gen().x(hello_world_gen().x() - 1700, 0.5),
    generated_bad_fn().x(generated_bad_fn().x() - 1700, 0.5),
  );

  yield* waitUntil("unshow_bad_fn");
  yield* generated_bad_fn().x(generated_bad_fn().x() - 1700, 0.5);

  yield* waitUntil("datastructures");
  yield* all(
    my_exe().y(my_exe().y() - 500, 0.5),
    my_program().y(my_program().y() - 500, 0.5),
    genned_program().y(genned_program().y() - 500, 0.5),
    line0().y(line0().y() - 500, 0.5),
    line1().y(line1().y() - 500, 0.5),
  );
  const datastructures_title = createRef<Txt>();
  const title_backing = createRef<Line>();
  const dynarray_gen = createRef<Code>();
  const dynarray_gen_rect = createRef<Rect>();

  view.add(<>
    <Line
      ref={title_backing}
      points={[
        [-1450, -600],
        [ -250, -600],
        [ -330, -360],
        [-1450, -360],
      ]} closed
      x={-700}
      fill={shadow_color(by_palette[4])}
    />
    <RegularText
      ref={datastructures_title}
      text={""}
      x={-650} y={-450} fontSize={80}
    />
    <Code
      ref={dynarray_gen}
      fontSize={45}
      code={`\
string generate_dynamic_array() {
  // Generate code
}`}
      y={140}
      opacity={0}
    />
    <Rect
      ref={dynarray_gen_rect}
      width={() => dynarray_gen().width() + 80} height={() => dynarray_gen().height() + 80}
      zIndex={-1}
      position={() => dynarray_gen().position()} lineWidth={15} radius={5}
      stroke={by_palette[0]}
      opacity={0}
    />
  </>);
  yield* chain(title_backing().x(0, 0.5), datastructures_title().text("Data Structures", 0.5));
  yield* waitFor(2);
  yield* all(fade_in_up(dynarray_gen()), dynarray_gen_rect().opacity(1, 0.5));
  yield* waitFor(6);
  yield* all(dynarray_gen().code(`\
string generate_dynamic_array(string type) {
  // Generate code
}`, 0.7), dynarray_gen().selection([[[0, 30], [0, 41]]], 0.5));

  yield* waitUntil("show_hash_table_gen");
  const hash_table_gen_vid = createRef<Video>();
  const hash_table_gen_rect = createRef<Rect>();
  view.add(<>
    <Video
      ref={hash_table_gen_vid}
      src={vid_gen_hash_table}
      y={140} opacity={0}
      size={[1200, 700]}
    />
    <Rect
      ref={hash_table_gen_rect}
      width={() => hash_table_gen_vid().width()} height={() => hash_table_gen_vid().height()}
      zIndex={-1}
      position={() => hash_table_gen_vid().position()} lineWidth={15} radius={5}
      stroke={by_palette[0]}
      opacity={0}
    />
  </>);
  yield* dynarray_gen().x(dynarray_gen().x() - 1700, 0.5);
  hash_table_gen_vid().play();
  yield* all(fade_in_up(hash_table_gen_vid()), hash_table_gen_rect().opacity(1, 0.5));

  yield* waitUntil("parameterized_metaprogram");
  yield* all(fade_out_up(hash_table_gen_vid()), hash_table_gen_rect().opacity(0, 0.5));
  hash_table_gen_vid().src(vid_gen_param_hash_table);
  hash_table_gen_vid().seek(0); hash_table_gen_vid().play();
  yield* all(fade_in_up(hash_table_gen_vid(), -40), hash_table_gen_rect().opacity(1, 0.5));

  yield* waitUntil("templates_mentioned");
  yield* all(fade_out_up(hash_table_gen_vid()), hash_table_gen_rect().opacity(0, 0.5));

  yield* waitUntil("opengl_func_loading");
  yield* all(
    datastructures_title().text("OpenGL Function Loading", 0.5),
    datastructures_title().x(datastructures_title().x()+175, 0.5),
    datastructures_title().fill(by_palette[0], 0.5),
    title_backing().x(300, 0.5), title_backing().fill(shadow_color(by_palette[0]), 0.5),
    datastructures_title().shadowColor(shadow_color(by_palette[0]), 0.5),
  );
  view.removeChildren();
  view.add(datastructures_title());
  view.add(title_backing());
  
  const opengl_logo = createRef<SVG>();
  const vulkan_logo = createRef<SVG>();
  const metal_logo  = createRef<SVG>();
  const api_binding_rect = createRef<Line>();
  const dll_binding_rect = createRef<Line>();
  const graphics_api_title = createRef<Txt>();
  const dll_title = createRef<Txt>();
  const static_link = createRef<Txt>();
  const cpu_icon = createRef<Icon>(); // gravity-ui:cpu
  const gpu_icon = createRef<Icon>(); // gravity-ui:gpu
  const no_entry = createRef<Icon>(); // pepicons-pop:no-entry
  const line_in = createRef<Line>();
  const line_out = createRef<Line>();
  view.add(<>
    <SVG
      ref={opengl_logo}
      svg={svg_opengl_logo}
      scale={0.75}
      shadowOffsetY={10}
      shadowColor={shadow_color("#5586a4")}
      y={40} opacity={0}
    />
    <SVG
      ref={vulkan_logo}
      svg={svg_vulkan_logo}
      scale={0.25}
      shadowOffsetY={5}
      shadowColor={shadow_color("#a8192e")}
      x={-500+425} y={90} opacity={0}
    />
    <Img
      ref={metal_logo}
      src={png_metal_logo}
      scale={0.65}
      shadowOffsetY={5}
      shadowColor={shadow_color("#4e0ac9")}
      x={-270+425} y={140} opacity={0}
    />
    <Line
      ref={api_binding_rect}
      points={[
        [ 250,  200],
        [-250,  200],
        [-250, -150],
        [ 250, -150],
      ]} closed
      radius={10} lineWidth={25}
      stroke={by_palette[2]}
      shadowOffsetY={7}
      shadowColor={shadow_color(by_palette[2])}
      start={0.5} end={0.5}
    />
    <Line
      ref={dll_binding_rect}
      points={[
        [-150,  200],
        [-150, -200],
        [ 150, -200],
        [ 150,  200],
      ]} closed
      radius={10} lineWidth={15}
      stroke={by_palette[1]}
      shadowOffsetY={7}
      shadowColor={shadow_color(by_palette[1])}
      start={0.5} end={0.5}
    />
    <RegularText
      ref={dll_title}
      text={"opengl32.dll"}
      y={320}
      fill={by_palette[1]}
      opacity={0}
      shadowColor={shadow_color(by_palette[1])}
    />
    <RegularText
      ref={static_link}
      text={"-lopengl32"}
      fill={by_palette[1]}
      y={40} opacity={0}
      shadowColor={shadow_color(by_palette[1])}
    />
    <RegularText
      ref={graphics_api_title}
      text={"Graphics API"}
      y={320}
      fill={by_palette[2]}
      opacity={0}
    />
    <Icon
      ref={cpu_icon}
      icon={"gravity-ui:cpu"}
      size={300} x={-700} y={25+40}
      color={by_palette[4]} opacity={0}
      shadowOffsetY={5}
      shadowColor={shadow_color(by_palette[4])}
    />
    <Icon
      ref={gpu_icon}
      icon={"gravity-ui:gpu"}
      size={300} x={700} y={25+40}
      color={by_palette[4]} opacity={0}
      shadowOffsetY={5}
      shadowColor={shadow_color(by_palette[4])}
    />
    <Icon
      ref={no_entry}
      icon={"pepicons-pop:no-entry"}
      size={200} y={40}
      color={by_palette[4]} opacity={0}
      shadowOffsetY={5}
      shadowColor={shadow_color(by_palette[4])}
    />
    <Line
      ref={line_in}
      points={[[-150, 0], [100, 0]]}
      lineWidth={50} startArrow arrowSize={100}
      end={0}
      stroke={by_palette[2]}
      x={-350} y={25}
    />
    <Line
      ref={line_out}
      points={[[-100, 0], [150, 0]]}
      lineWidth={50} endArrow arrowSize={100}
      end={0}
      stroke={by_palette[2]}
      x={350} y={25}
    />
  </>);
  yield* waitUntil("ogllogo");
  yield* fade_in_up(opengl_logo());
  yield* waitFor(0.25);
  yield* sequence(0.3,
    all(
      opengl_logo().position([-400+425, -50], 0.5),
      opengl_logo().scale(0.25, 0.5),
      opengl_logo().shadowOffset([0, 5], 0.5),
    ),
    fade_in_up(vulkan_logo()),
    fade_in_up(metal_logo()),
    sequence(0.4,
      line_in().end(1, 0.5),
      all(api_binding_rect().start(0, 0.5), api_binding_rect().end(1, 0.5)),
      line_out().end(1, 0.5),
    ),
    fade_in_up(graphics_api_title()),
    fade_in_up(cpu_icon()),
    fade_in_up(gpu_icon())
  );

  yield* waitUntil("dll_file");
  yield* sequence(0.3,
    sequence(0.4,
      line_out().end(0, 0.5),
      all(api_binding_rect().start(0.5, 0.5), api_binding_rect().end(0.5, 0.5)),
      line_in().end(0, 0.5),
    ),
    fade_out_up(cpu_icon()),
    fade_out_up(gpu_icon()),
    fade_out_up(graphics_api_title()),
    fade_out_up(vulkan_logo()),
    fade_out_up(metal_logo()),
  );
  yield* all(opengl_logo().x(0, 0.5), dll_binding_rect().start(0, 0.5), dll_binding_rect().end(1, 0.5));
  yield* waitFor(2);
  yield* fade_in_up(dll_title());

  yield* waitFor(5);
  yield* all(
    dll_binding_rect().x(dll_binding_rect().x() - 400, 0.5),
    dll_title().x(dll_title().x() - 400, 0.5),
    opengl_logo().x(opengl_logo().x() - 400, 0.5),
  );
  yield* waitFor(0.5);
  yield* fade_in_up(static_link());
  yield* fade_in_up(no_entry());
  yield* waitFor(2.0);
  yield* all(
    no_entry().x(no_entry().x() + 1200, 0.5),
    static_link().x(static_link().x() + 1200, 0.5),
  );

  const memory = createRef<Rect>();
  const memory_txt = createRef<Txt>();
  const glgenbuffers_name = createRef<Txt>();
  const glgenbuffers_address = createRef<Txt>();
  const glcreateshader_name = createRef<Txt>();
  const glcreateshader_address = createRef<Txt>();
  const gluniform2f_name = createRef<Txt>();
  const gluniform2f_address = createRef<Txt>();
  view.add(<>
    <Rect
      ref={memory}
      x={300} y={40} opacity={0}
      width={400} height={500}
      lineWidth={15} radius={5}
      stroke={by_palette[4]}
      shadowOffsetY={10}
      shadowColor={shadow_color(by_palette[4])}
    />
    <RegularText
      ref={memory_txt}
      text={"RAM"}
      fill={by_palette[4]}
      x={300} y={380} opacity={0}
      shadowColor={shadow_color(by_palette[4])}
    />
    <RegularText
      ref={glgenbuffers_name}
      text={"\"glGenBuffers\""}
      fill={by_palette[2]}
      x={-1200} y={-140}
      shadowColor={shadow_color(by_palette[2])}
    />
    <RegularText
      ref={glgenbuffers_address}
      text={"= 0x2002a5f0"}
      fill={by_palette[3]}
      fontSize={50}
      x={-150} y={-100} opacity={0}
      shadowColor={shadow_color(by_palette[3])}
    />
    <RegularText
      ref={glcreateshader_name}
      text={"\"glCreateShader\""}
      fill={by_palette[2]}
      x={-1200} y={-40+75}
      shadowColor={shadow_color(by_palette[2])}
    />
    <RegularText
      ref={glcreateshader_address}
      text={"= 0x20035000"}
      fill={by_palette[3]}
      fontSize={50}
      x={-150} y={0+75} opacity={0}
      shadowColor={shadow_color(by_palette[3])}
    />
    <RegularText
      ref={gluniform2f_name}
      text={"\"glUniform2f\""}
      fill={by_palette[2]}
      x={-1200} y={60+150}
      shadowColor={shadow_color(by_palette[2])}
    />
    <RegularText
      ref={gluniform2f_address}
      text={"= 0x20055f20"}
      fill={by_palette[3]}
      fontSize={50}
      x={-150} y={100+150} opacity={0}
      shadowColor={shadow_color(by_palette[3])}
    />
  </>);
  yield* all( fade_in_up(memory()), fade_in_up(memory_txt()) );
  yield* all( fade_out_up(opengl_logo()), fade_out_up(dll_binding_rect()),
              dll_title().position([300, -150], 0.5), dll_title().fill(by_palette[4], 0.5),
              dll_title().shadowColor(shadow_color(by_palette[4]), 0.5) );
  yield* waitFor(1);
  yield* sequence(0.1,
    glgenbuffers_name().x(-500, 0.5),
    glcreateshader_name().x(-530, 0.5),
    gluniform2f_name().x(-475, 0.5),
  );
  yield* waitFor(2);
  yield* all(
    fade_in_up(glgenbuffers_address()),
    fade_in_up(glcreateshader_address()),
    fade_in_up(gluniform2f_address()),
  );

  yield* waitUntil("unshow_garbage");
  yield* sequence(0.05,
    fade_out_up(dll_title()),
    fade_out_up(memory()),
    fade_out_up(memory_txt()),
    fade_out_up(glgenbuffers_name()),
    fade_out_up(glgenbuffers_address()),
    fade_out_up(glcreateshader_name()),
    fade_out_up(glcreateshader_address()),
    fade_out_up(gluniform2f_name()),
    fade_out_up(gluniform2f_address()),
  );
  view.removeChildren();
  view.add(datastructures_title());
  view.add(title_backing());
  
  yield* waitUntil("show_steps_fn_loading");
  const steps = createRefArray<Txt>();
  const code_stuff = createRef<Code>();
  const steps_strings = [
    "1. Define Function Type",
    "2. Create variable of that type",
    "3. Define a macro for simple access",
    "4. Load the function pointer",
  ];
  const step_x_offs = [
     30,
    -45,
    -120,
    -20
  ];
  view.add(<>
    {...steps_strings.map((s, i) => <RegularText
      ref={steps} fontSize={60}
      text={s} fill={by_palette[i+1]}
      x={0} y={-200} opacity={0}
      shadowColor={shadow_color(by_palette[i+1])}
    />)}
    <Code
      ref={code_stuff}
      x={-100} y={-100}
      fontSize={40}
      code={`\
`}
    />
  </>);

  yield* fade_in_up(steps[0]);
  yield* code_stuff().code.append(1.2)`\
typedef void type_glGenBuffers(GLsizei n, GLuint* buffers);`;
  yield* waitUntil("step2");
  yield* all(fade_out_up(steps[0]), fade_in_up(steps[1]));
  yield code_stuff().y(code_stuff().y()+25, 1.2);
  yield* code_stuff().code.append(1.2)`
type_glGenBuffers* v_glGenBuffers = 0;`;
  
  yield* waitUntil("step3");
  yield* all(fade_out_up(steps[1]), fade_in_up(steps[2]));
  yield code_stuff().y(code_stuff().y()+25, 1.2);
  yield* code_stuff().code.append(1.2)`
#define glGenBuffers(n, bufs) v_glGenBuffers(n, bufs)`;
  
  yield* waitUntil("step4");
  yield* all(fade_out_up(steps[2]), fade_in_up(steps[3]));
  yield code_stuff().y(code_stuff().y()+170, 1.2);
  yield* code_stuff().code.append(1.2)`

void load_gl_functions(HMODULE dll_handle) {
  // ...
  v_glGenBuffers = (type_glGenBuffers*)
                  GetProcAddress(dll_handle, "glGenBuffers")
  // ...
}`;
  
  yield* waitUntil("show_glad_pre");
  yield* fade_out_up(steps[3]);
  
  yield* waitUntil("show_glad");
  yield* code_stuff().x(-1800, 0.75);
  const glad_vid = createRef<Video>();
  const glad_rect = createRef<Rect>();
  view.add(<>
    <Video
      ref={glad_vid}
      src={vid_glad}
      y={140} opacity={0}
      size={[1200, 700]}
    />
    <Rect
      ref={glad_rect}
      width={() => glad_vid().width()} height={() => glad_vid().height()}
      zIndex={-1}
      position={() => glad_vid().position()} lineWidth={15} radius={5}
      stroke={by_palette[0]}
      opacity={0}
    />
  </>);
  glad_vid().playbackRate(2.0);
  glad_vid().play();
  yield* all(fade_in_up(glad_vid()), glad_rect().opacity(1, 0.5));

  yield* waitUntil("glad_end");
  yield* all(fade_out_up(glad_vid()), glad_rect().opacity(0, 0.5));
  yield* all(title_backing().x(-1500, 0.5), datastructures_title().x(-1500, 0.35));
  view.removeChildren();

  yield* waitUntil("generative");
  const gen_meta = createRef<Txt>();
  const gen_backing = createRef<Line>();
  const ins_meta = createRef<Txt>();
  const ins_backing = createRef<Line>();
  const wipe = createRef<Line>();
  view.add(<>
    <Line
      ref={wipe}
      points={[[-1000, -600], [1000, -600], [1000, 600], [-1000, 600]]}
      closed clip
      stroke={"#FFFFFF"}
      lineWidth={40}
    >
      <Line
        ref={gen_backing}
        points={[[-1000, -600], [-1000, -600], [-1000, -600]]}
        closed clip
        lineWidth={30} fill={new Color(by_palette[1]).darken(3.5)} stroke={new Color(by_palette[1]).darken(1.5)}
      >
        <RegularText
          ref={gen_meta}
          fontSize={300}
          fill={by_palette[0]}
          text={"Generation"}
          shadowColor={shadow_color(by_palette[0])}
        />
      </Line>
      <Line
        ref={ins_backing}
        points={[[1000, 600], [1000, 600], [1000, 600]]}
        closed clip
        lineWidth={30} fill={new Color(by_palette[3]).darken(3.5)} stroke={new Color(by_palette[3]).darken(1.5)}
      >
        <RegularText
          ref={ins_meta}
          fontSize={300}
          fill={by_palette[4]}
          text={"Inspection"}
          shadowColor={shadow_color(by_palette[4])}
        />
      </Line>
    </Line>
  </>);
  yield* gen_backing().points([[-1000, -600], [-1000, 1500], [3500, -600]], 0.75);
  yield* waitUntil("inspection");
  yield* all(
    gen_backing().points([[-1000, -600], [-1000,  600], [ 1000, -600]], 0.75),
    ins_backing().points([[ 1000,  600], [ 1000, -1500], [-3500,  600]], 0.75),
  );
  yield* waitUntil("wipe_away");
  yield* wipe().points([[-1000, -600], [1000, -600], [1000, -600], [-1000, -600]], 0.5);
  view.removeChildren();

  yield* waitUntil("end");
  
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
      x={-400} y={-75}
      lineWidth={10} closed
      lineDash={[50*1.2, 50*0.21]}
      stroke={new Color(by_palette[4])}      
      shadowOffsetY={5}
      shadowColor={shadow_color(by_palette[4])}
    />
    <Line
      ref={focus_line}
      x={-400} y={-75}
      points={[[50, 0], [600, 0]]}
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
    </Rect>
  </>);
  
  yield* sequence(0.2,
    ...stack_elements.filter((v,i) => i != 3).map(v => fade_in_up(v, -40)),
  );
  yield* sequence(0.2,
    ...stack_elements.filter((v,i) => i == 3).map(v => all(
      v.opacity(0.25, 0.5),
      v.y(v.y()-40, 0.5)
    )),
  );
    
  const reticle_task = yield loop(Infinity, function* () {
    yield* focus_reticle().lineDashOffset(focus_reticle().lineDashOffset() + 100, 1, linear)
  });
  yield* focus_reticle().points([[50, 0], [0, 50], [-50, 0], [0, -50]], 0.5);
  yield* focus_line().end(1, 0.5);
  yield* part_1_l1().text("PART 2", 0.5);
  yield* waitFor(1);
  yield* part_1_l2().text("THE AST", 0.5);

  yield* waitFor(1);
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
  yield* waitFor(5);
});