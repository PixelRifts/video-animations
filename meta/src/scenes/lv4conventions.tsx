import { Code, LezerHighlighter, Line, Txt, Video, lines, makeScene2D } from "@motion-canvas/2d";
import { DEFAULT, all, createRef, createRefArray, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { RegularText } from "../utils/defaults";
import { by_palette, shadow_color } from "../utils/colors";
import { fade_in_up, fade_out_up } from "../utils/anims";

import { parser } from '@lezer/cpp';
Code.defaultHighlighter = new LezerHighlighter(parser);

import vid_callingconv from "../extern/callingconv.mp4"

export default makeScene2D(function* (view) {
  const example_code = createRef<Code>();
  view.add(<>
    <Code
      ref={example_code}
      code={`\
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
VirtualFree(buffer, 100, MEM_DECOMMIT|MEM_RELEASE);`}
      fontSize={45}
    />
  </>);
  yield* waitFor(3);
  yield* example_code().selection(lines(5, 7), 0.5);
  yield* waitFor(2);
  yield* example_code().selection(lines(8, 9), 0.5);
  yield* waitFor(2.5);
  yield* example_code().selection([[[6, 12], [6, 16]], [[7, 12], [7, 16]], [[9, 12], [9, 16]]], 0.5);
  yield* waitFor(2.5);
  yield* example_code().selection(DEFAULT, 0.5);


  yield* waitUntil("bridge_the_gap");
  const bridge = createRef<Line>();
  view.add(<>
    <Line
      ref={bridge}
      points={[[-305, -10], [-165, -10], [-165, 255], [-305, 255]]}
      lineWidth={12} startArrow endArrow
      stroke={by_palette[3]} end={0}
    />
  </>);
  yield* bridge().end(1, 0.5);
  
  yield* waitUntil("inputoutput");
  yield* bridge().end(0, 0.5);
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

fn(10);
VirtualFree(buffer, 100, MEM_DECOMMIT|MEM_RELEASE);`, 0.7),
  example_code().selection(lines(11), 0.5));
  yield* waitFor(0.5);
  yield* example_code().code(`\
char* buffer = VirtualAlloc(NULL, 100, MEM_RESERVE|MEM_COMMIT,
                            PAGE_EXECUTE_READWRITE);
// Cursed C alert
void (*fn)(void) = (void (*)(void)) buffer;

// mov eax, ecx
buffer[0] = 0x89;
buffer[1] = 0xC8;
// ret
buffer[2] = 0xC2;

int answer = fn(10);
VirtualFree(buffer, 100, MEM_DECOMMIT|MEM_RELEASE);`, 0.7);
  
  yield* waitUntil("editfnptr");
  yield* example_code().selection(lines(3), 0.5);
  yield* waitFor(2);
  yield* all(example_code().code(`\
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
VirtualFree(buffer, 100, MEM_DECOMMIT|MEM_RELEASE);`, 0.7));

  yield* waitUntil("writerightcode");
  yield* example_code().selection(lines(5, 9), 0.5);

  yield* waitUntil("callingconvstart");
  yield* example_code().x(-1800, 0.7);
  const cc = createRef<Txt>();
  const title_backing = createRef<Line>();
  const differs = createRefArray<Txt>();
  view.add(<>
    <RegularText
      ref={cc}
      text={""}
      fontSize={180}
    />
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
      ref={differs}
      text={""}
      x={-800} y={-200}
      fill={by_palette[1]}
      offset={[-1, 0]}
      shadowColor={shadow_color(by_palette[1])}
    />
    <RegularText
      ref={differs}
      text={""}
      x={-800} y={-100}
      fill={by_palette[1]}
      offset={[-1, 0]}
      shadowColor={shadow_color(by_palette[1])}
    />
    <RegularText
      ref={differs}
      text={""}
      x={-800} y={300}
      fill={by_palette[2]}
      offset={[-1, 0]}
      shadowColor={shadow_color(by_palette[2])}
    />
  </>);
  yield* cc().text("Calling Convention", 0.5);
  yield* waitFor(2);
  yield* sequence(0.1,
    title_backing().x(0, 0.5),
    cc().fontSize(75, 0.5),
    cc().position([-630, -450], 0.5),
  );
  yield* waitFor(0.5);
  yield* differs[0].text("Differs per OS", 0.7);
  yield* differs[1].text("Differs per Language", 0.7);
  yield* waitFor(8);
  yield* differs[2].text("Just match them correctly ¯\\_(ツ)_/¯", 0.7);
  yield* waitFor(2);


  const callingconv_vid = createRef<Video>();
  view.add(<>
    <Video
      ref={callingconv_vid}
      src={vid_callingconv}
      width={1500} height={900}
      y={-40} opacity={0}
      playbackRate={1.5}
    />
  </>);
  yield* sequence(0.1,
    ...differs.reverse().map(t => fade_out_up(t)),
    all(title_backing().x(-800, 0.5), cc().x(cc().x()-800, 0.5)),
  )
  callingconv_vid().play();
  yield* fade_in_up(callingconv_vid(), -40);

  yield* waitUntil("bop");
  yield* fade_out_up(callingconv_vid(), -40);
  
  yield* waitUntil("end");
});