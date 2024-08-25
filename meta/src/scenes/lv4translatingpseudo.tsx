import { Code, LezerHighlighter, Line, Node, Txt, Video, lines, makeScene2D } from "@motion-canvas/2d";
import { Color, DEFAULT, SimpleSignal, all, createComputed, createRef, createRefArray, createSignal, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { by_palette, shadow_color, softgreen, softred } from "../utils/colors";
import { RegularText } from "../utils/defaults";
import { fade_in_up, fade_out_up } from "../utils/anims";

import { parser } from '@lezer/cpp';
Code.defaultHighlighter = new LezerHighlighter(parser);

import vid_nasmhack from "../extern/nasmhack.mp4"

type Permission = [SimpleSignal<number>, SimpleSignal<number>, SimpleSignal<number>];

export default makeScene2D(function* (view) {
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
      fontSize={80}
    />
  </>);
  yield* waitFor(1);
  yield* example_code().selection(lines(0), 0.5);
  yield* waitFor(5);
  yield* example_code().selection([[0, 15], [0, 26]], 0.5);
  
  yield* waitUntil("the_issue");
  yield* example_code().x(example_code().x() - 1800, 0.75)

  const ram_line = createRef<Line>();
  const ram_label = createRef<Txt>();
  const page_lines = createRefArray<Line>();
  const page_labels = createRefArray<Txt>();
  const permissions_parent = createRefArray<Node>();
  const permissions_drawer = createRefArray<Line>();
  const permissions_read = createRefArray<Txt>();
  const permissions_write = createRefArray<Txt>();
  const permissions_exec = createRefArray<Txt>();
  
  const permissions: Permission[] = [
    [ createSignal(0), createSignal(0), createSignal(0) ],
    [ createSignal(1), createSignal(0), createSignal(0) ],
    [ createSignal(0), createSignal(1), createSignal(1) ],
    [ createSignal(1), createSignal(1), createSignal(1) ],
    [ createSignal(1), createSignal(1), createSignal(1) ],
    [ createSignal(0), createSignal(1), createSignal(0) ],
  ];
  view.add(<>
    <Line
      ref={ram_line}
      points={[[300, -550], [300, -550], [900, -550], [900, -550]]}
      closed lineWidth={12}
      stroke={by_palette[0]}
      fill={"#37414d"}
    />
    <RegularText
      ref={ram_label}
      text={"RAM"}
      fontSize={160}
      x={(900+300)/2} y={-1100}
    />
    {...range(6).map(i => <Line
      ref={page_lines}
      points={[[0, 0], [600, 0]]}
      x={300} y={-350+i*150}
      lineWidth={12} end={0}
      stroke={by_palette[0]}
    />)}
    {...range(6).map(i => <RegularText
      ref={page_labels}
      text={"Page " + i} opacity={0}
      x={600} y={-350+80+i*150 + 40}
      fill={by_palette[0]}
      shadowColor={shadow_color(by_palette[0])}
    />)}

    {...range(6).map(i => <Node
      ref={permissions_parent}
      x={300} y={-350+80+i*150-5}
      zIndex={-1} opacity={0}
    >
      <Line
        ref={permissions_drawer}
        radius={20}
        points={[[20, -60], [20, -60], [20, 60], [20, 60]]}
        closed lineWidth={12}
        stroke={by_palette[0]}
        fill={shadow_color(by_palette[0]).alpha(0.25)}
        zIndex={-1}
        shadowColor={shadow_color(by_palette[0]).alpha(0.25)}
        shadowOffset={[-5, 5]}
      />
      <RegularText
        ref={permissions_read}
        text={"Read"}
        x={-575} y={5+40} opacity={0}
        fill={() => Color.lerp(softred, softgreen, permissions[i][0]())}
        shadowColor={() => shadow_color(Color.lerp(softred, softgreen, permissions[i][0]()))}
      />
      <RegularText
        ref={permissions_write}
        text={"Write"}
        x={-350} y={5+40} opacity={0}
        fill={() => Color.lerp(softred, softgreen, permissions[i][1]())}
        shadowColor={() => shadow_color(Color.lerp(softred, softgreen, permissions[i][1]()))}
      />
      <RegularText
        ref={permissions_exec}
        text={"Exec"}
        x={-135} y={5+40} opacity={0}
        fill={() => Color.lerp(softred, softgreen, permissions[i][2]())}
        shadowColor={() => shadow_color(Color.lerp(softred, softgreen, permissions[i][2]()))}
      />
    </Node>)}
  </>);
  yield* all(
    ram_label().y(-430, 0.5),
    ram_line().points([[300, -550], [300, 550], [900, 550], [900, -550]], 0.5),
  );

  yield* waitUntil("split_ram");
  yield* sequence(0.2,
    ...range(6).map(i => sequence(0.1,
      page_lines[i].end(1, 0.5),
      fade_in_up(page_labels[i]),
    )),
  );
  yield* waitUntil("unfold_permissions");
  yield* all(...permissions_parent.map(v => v.opacity(1, 0)));
  yield* sequence(0.1,
    ...permissions_drawer.map(v => v.points([[20, -60], [-700, -60], [-700, 60], [20, 60]], 0.5)),
  );
  yield* waitFor(1.5);
  yield* sequence(0.05,
    ...permissions_write.map(v => fade_in_up(v)),
  );
  yield* sequence(0.05,
    ...permissions_read.map(v => fade_in_up(v)),
  );

  yield* waitFor(4);
  yield* sequence(0.05,
    ...permissions_exec.map(v => fade_in_up(v)),
  );
  yield* waitFor(10);
  yield* sequence(0.1,
    sequence(0.01,
      ...permissions_read .map(v => fade_out_up(v, 40, 0.1)),
      ...permissions_write.map(v => fade_out_up(v, 40, 0.1)),
      ...permissions_exec .map(v => fade_out_up(v, 40, 0.1)),
    ),
    ...permissions_drawer.reverse().map(v => v.points([[20, -60], [20, -60], [20, 60], [20, 60]], 0.5)),
  );
  yield* all(...permissions_parent.map(v => v.opacity(0, 0)));
  yield* all(
    fade_out_up(ram_label()),
    fade_out_up(ram_line()),
    ...page_lines.map(v => fade_out_up(v)),
    ...page_labels.map(v => fade_out_up(v))
  );
  view.removeChildren();
  const windows_code = createRef<Code>();
  const linux_code = createRef<Code>();
  view.add(<>
    <Code
      ref={windows_code}
      code={`\
VirtualAlloc(NULL, 100, MEM_RESERVE|MEM_COMMIT,
             PAGE_EXECUTE_READWRITE);`}
      y={-200+40} opacity={0}
    />
    <Code
      ref={linux_code}
      code={`\
mmap(NULL, 100, PROT_READ | PROT_WRITE | PROT_EXEC,
     MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);`}
      y={200+40} opacity={0}
    />
  </>);
  yield* fade_in_up(windows_code());
  yield* waitFor(1);
  yield* windows_code().selection([[1, 13], [1, 35]], 0.5);
  yield* waitFor(3.5);
  yield* fade_in_up(linux_code());
  yield* linux_code().selection([[0, 16], [0, 50]], 0.5);
  
  yield* waitFor(3);
  yield* sequence(0.1, fade_out_up(windows_code()), fade_out_up(linux_code()));
  view.add(example_code());
  yield* example_code().x(0, 0.5);
  yield* all(
    example_code().fontSize(45, 0.5),
    example_code().selection(DEFAULT, 0.5),
  );
  yield* example_code().code(`\
char* buffer = VirtualAlloc(NULL, 100, MEM_RESERVE|MEM_COMMIT,
                            PAGE_EXECUTE_READWRITE);
buffer[0] = ; // Instruction 0
buffer[1] = ; // Instruction 1
buffer[2] = ; // Instruction 2

execute(buffer);
free(buffer);`, 0.5);
  yield* waitUntil("virtfree");
  yield*  example_code().code(`\
char* buffer = VirtualAlloc(NULL, 100, MEM_RESERVE|MEM_COMMIT,
                            PAGE_EXECUTE_READWRITE);
buffer[0] = ; // Instruction 0
buffer[1] = ; // Instruction 1
buffer[2] = ; // Instruction 2

execute(buffer);
VirtualFree(buffer, 100, MEM_DECOMMIT|MEM_RELEASE);`, 0.5);

  yield* waitUntil("a_talk_about_instructions");
  yield* example_code().selection(lines(2, 4), 0.5);
  yield* waitFor(5);
  yield* example_code().x(example_code().x() - 1800, 0.75);

  const steps_to_know_instrs = createRefArray<Txt>();
  const x64_ver = createRef<Txt>();
  const arm_ver = createRef<Txt>();
  const step_2_deets = createRef<Txt>();
  view.add(<>
    <RegularText
      ref={steps_to_know_instrs}
      text={"1. Know your CPU"}
      x={-600} y={-300+40} opacity={0}
      fontSize={100}
      offset={[-1, 0]}
    />
    <RegularText
      ref={x64_ver}
      text={"x86_64"}
      x={-500} y={-200+40} opacity={0}
      fontSize={80} fill={by_palette[0]} shadowColor={shadow_color(by_palette[0])}
      offset={[-1, 0]}
    />
    <RegularText
      ref={arm_ver}
      text={"or ARM"}
      x={-240} y={-200+40} opacity={0}
      fontSize={80} fill={by_palette[0]} shadowColor={shadow_color(by_palette[0])}
      offset={[-1, 0]}
    />

    
    <RegularText
      ref={steps_to_know_instrs}
      text={"2. Look into Instruction Encoding"}
      x={-600} y={-50+40} opacity={0}
      fill={by_palette[3]}
      fontSize={100}
      offset={[-1, 0]}
    />
    <RegularText
      ref={step_2_deets}
      text={"ASM -> Machine Code is Direct"}
      x={-500} y={50+40} opacity={0}
      fontSize={80} fill={by_palette[0]} shadowColor={shadow_color(by_palette[0])}
      offset={[-1, 0]}
    />

    <RegularText
      ref={steps_to_know_instrs}
      text={"3. Profit"}
      x={-600} y={200+40} opacity={0}
      fill={by_palette[4]}
      fontSize={100}
      offset={[-1, 0]}
    />
  </>);
  yield* fade_in_up(steps_to_know_instrs[0]);
  yield* waitFor(3);
  yield* fade_in_up(x64_ver());
  yield* waitFor(3);
  yield* fade_in_up(arm_ver());
  yield* waitUntil("instr_step2");
  yield* fade_in_up(steps_to_know_instrs[1]);
  yield* waitFor(4);
  yield* fade_in_up(step_2_deets())
  yield* waitFor(6);
  yield* step_2_deets().text("mov eax, ecx", 0.5);
  yield* waitFor(8);
  yield* step_2_deets().text("mov eax, ecx => 0x89 0xC8", 0.5);
  yield* waitFor(3);
  yield* fade_in_up(steps_to_know_instrs[2]);
  yield* waitUntil("wayout");
  yield* sequence(0.1,
    steps_to_know_instrs[0].x(1800, 0.5),
    arm_ver().x(1800, 0.5),
    x64_ver().x(1800, 0.5),
    steps_to_know_instrs[1].x(1800, 0.5),
    step_2_deets().x(1800, 0.5),
    steps_to_know_instrs[2].x(1800, 0.5),
  );

  const nasmhack_vid = createRef<Video>();
  view.add(<>
    <Video
      ref={nasmhack_vid}
      src={vid_nasmhack}
      width={1500} height={900}
      y={-40} opacity={0}
      playbackRate={1.5}
    />
  </>);
  yield* waitFor(2);
  nasmhack_vid().play();
  yield* fade_in_up(nasmhack_vid(), -40);

  yield* waitUntil("got_instructions");
  yield* fade_out_up(nasmhack_vid(), 40);
  yield* waitUntil("back_to_main_example");
  yield* example_code().x(0, 0.75);
  yield* example_code().code(`\
char* buffer = VirtualAlloc(NULL, 100, MEM_RESERVE|MEM_COMMIT,
                            PAGE_EXECUTE_READWRITE);
// mov eax, ecx
buffer[0] = 0x89;
buffer[1] = 0xC8;

execute(buffer);
VirtualFree(buffer, 100, MEM_DECOMMIT|MEM_RELEASE);`, 0.5);
  yield* waitUntil("last_piece");
  yield* example_code().selection(lines(6), 0.5);

  yield* waitUntil("exectracing");
  yield* example_code().selection(DEFAULT, 0.5);
  const execarrow = createRef<Line>();
  view.add(<>
    <Line
      ref={execarrow}
      points={[[0, -40], [0, 0], [40, 0]]}
      lineWidth={8} endArrow
      stroke={by_palette[0]}
      x={-825} y={-190-40} opacity={0}
    />
  </>);
  yield* fade_in_up(execarrow(), -40, 0.5);
  yield* waitFor(0.5);
  yield* execarrow().y(-30, 0.5);
  yield* waitFor(0.5);
  yield* execarrow().y(20, 0.5);
  yield* waitFor(0.5);
  yield* execarrow().y(130, 0.5);
  yield* waitFor(1);
  yield* all(
    execarrow().x(-300, 0.5),
    execarrow().y(-30, 0.5),
    execarrow().rotation(-180, 0.5),
  );
  yield* waitFor(0.5);
  yield* execarrow().y(25, 0.5);
  yield* waitFor(1);
  yield* all(
    execarrow().x(-825, 0.5),
    execarrow().y(130, 0.5),
    execarrow().rotation(0, 0.5),
  );
  yield* waitFor(0.5);
  yield* execarrow().y(187, 0.5);
  yield* waitFor(0.5);
  yield* fade_out_up(execarrow(), -40, 0.5);
  
  yield* waitFor(6);
  yield* example_code().selection([[0, 0], [0, 12]], 0.5)

  yield* waitFor(2);
  yield* example_code().selection(DEFAULT, 0.5);
  yield* all(example_code().code(`\
char* buffer = VirtualAlloc(NULL, 100, MEM_RESERVE|MEM_COMMIT,
                            PAGE_EXECUTE_READWRITE);
// Cursed C alert
void (*fn)(void) = (void (*)(void)) buffer;

// mov eax, ecx
buffer[0] = 0x89;
buffer[1] = 0xC8;

execute(buffer);
VirtualFree(buffer, 100, MEM_DECOMMIT|MEM_RELEASE);`, 0.5),
    example_code().selection(lines(2,3), 0.5),
  );
  yield* waitFor(4);
  yield* all(example_code().code(`\
char* buffer = VirtualAlloc(NULL, 100, MEM_RESERVE|MEM_COMMIT,
                            PAGE_EXECUTE_READWRITE);
// Cursed C alert
void (*fn)(void) = (void (*)(void)) buffer;

// mov eax, ecx
buffer[0] = 0x89;
buffer[1] = 0xC8;

fn();
VirtualFree(buffer, 100, MEM_DECOMMIT|MEM_RELEASE);`, 0.5),
    example_code().selection(lines(9), 0.5),
  );
  yield* waitUntil("atttheend");
  yield* example_code().selection(lines(5, 7), 0.5);
  yield* waitUntil("retinstr");
  yield* all(example_code().code(`\
char* buffer = VirtualAlloc(NULL, 100, MEM_RESERVE|MEM_COMMIT,
                            PAGE_EXECUTE_READWRITE);
// Cursed C alert
void (*fn)(void) = (void (*)(void)) buffer;

// mov eax, ecx
buffer[0] = 0x89;
buffer[1] = 0xC8;
// ret
buffer[2] = 0xC2;

fn();
VirtualFree(buffer, 100, MEM_DECOMMIT|MEM_RELEASE);`, 0.5),
    example_code().selection(lines(8, 9), 0.5),
  );
  

  yield* waitUntil("end");
});

