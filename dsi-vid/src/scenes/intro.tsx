import { CameraView } from '@ksassnowski/motion-canvas-camera';
import { CODE, Circle, Code, Gradient, LezerHighlighter, Line, Node, Rect, Txt, Video, blur, brightness, makeScene2D } from '@motion-canvas/2d';
import { BBox, Color, Origin, Reference, SimpleSignal, all, chain, createRef, createSignal, linear, makeRef, range, sequence, waitFor, waitUntil } from '@motion-canvas/core';
import { NeonIcon, NeonImage, NeonLine, NeonRect, NeonText, NeonVideo } from '../neon/neon_items';
import { append_to_str, code_get_token, shiftx, shifty, shifty_all } from '../animations/misc';
import { correction } from '../animations/items';
import { fadeInUp, fadeOutDown, flicker_in, flicker_out } from '../animations/io';

import { parser } from '@lezer/cpp';

import polymars from "../extern/polymars.png";
import polymarsvid from "../extern/polymarsvid.mp4";
import fuckingfunctionpointers_vid from "../extern/fuckingfunctionpointers.mp4";

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeScene2D(function* (_view) {
  const view = createRef<CameraView>();
  _view.add(<CameraView ref={view} width={"100%"} height={"100%"}/>);

  const polymars_img = createRef<NeonImage>();
  const polymars_vid = createRef<NeonVideo>();
  const devkitarm_txt = createRef<NeonText>();
  const libnds_txt = createRef<NeonText>();
  const icon_test = createRef<NeonIcon>();
  const libnds_explaination = createRef<NeonText>();
  view().add(
    <>
      <NeonVideo
        ref={polymars_vid}
        video_source={polymarsvid}
        x={300} y={-200}
        width={940} height={530}
        intensity={1.0} alpha={0} video_alpha={0}
        glow={new Color("#823")}
      />
      <NeonImage
        ref={polymars_img}
        image_source={polymars}
        x={-350} y={-285}
        width={500} height={230}
        intensity={1.0} alpha={0} image_alpha={0}
        glow={new Color("#238")}
      />
      <NeonText
        ref={devkitarm_txt}
        txt={"devkitARM"}
        size={98}
        x={-300} y={300}
        alpha={0} text_alpha={0}
        glow={new Color("#238")}
      />
      <NeonText
        ref={libnds_txt}
        txt={"libNDS"}
        size={98}
        x={300} y={300}
        alpha={0} text_alpha={0}
        glow={new Color("#238")}
      />
      <NeonIcon
        ref={icon_test}
        icon={"tabler:arrows-shuffle"}
        size={98}
        x={-725} y={0}
        alpha={0} icon_alpha={0}
        glow={new Color("#828")}
      />
      <NeonText
        ref={libnds_explaination}
        size={50}
        glow={new Color("#238")}
        position={[0, 240]}
        opacity={0}
        txt={"videoSetModeSub(MODE_0_2D)"}
      />
    </>
  );

  yield* waitUntil("other_guys");
  polymars_vid().video_ref().seek(0.5);
  yield* sequence(0.1,
    all(polymars_img().alpha(1, 0.5), polymars_img().image_alpha(1, 0.5)),
    all(polymars_vid().alpha(1, 0.5), polymars_vid().video_alpha(1, 0.5)),
  );
  polymars_vid().video_ref().play();

  yield* waitFor(1.5);
  yield* devkitarm_txt().flicker_in(1);
  yield* libnds_txt().flicker_in(1);

  yield* waitUntil("what_are_those");
  yield* sequence(0.1,
    all(polymars_vid().alpha(0, 0.5), polymars_vid().video_alpha(0, 0.5)),
    all(polymars_img().alpha(0, 0.5), polymars_img().image_alpha(0, 0.5)),
    waitFor(0.1), waitFor(0.1), waitFor(0.1),
    sequence(0.1, shifty(devkitarm_txt(), -600, 0.5), shiftx(devkitarm_txt(), -100, 0.5)),
    sequence(0.1, shifty(libnds_txt(), -600, 0.5), shiftx(libnds_txt(), 100, 0.5)),
    shifty(libnds_txt(), -600, 0.5),
  );

  yield* waitUntil("devkitarm_highlight");
  yield* sequence(0.1,
    devkitarm_txt().position([0, 0], 0.5),
    devkitarm_txt().size(150, 0.5),
  );
  yield* correction(view(), "toolchainmistake", "Compiler Toolchain not just a cross compiler", 200, 50);
  yield* devkitarm_txt().glow(new Color("#823"), 0.5);
  
  yield* waitUntil("libnds_highlight");
  yield* sequence(0.1,
    devkitarm_txt().position([-400, -300], 0.5),
    devkitarm_txt().size(98, 0.5),
    libnds_txt().position([0, 0], 0.5),
    libnds_txt().size(150, 0.5),
  );

  yield* waitUntil("show__libnds_ex");
  yield* fadeInUp(libnds_explaination);
  yield* waitFor(2);
  yield* append_to_str(libnds_explaination(), " => *((u32*) 0x04001000) = 0x10000", 1.5);
  yield* waitFor(4);
  yield* libnds_txt().glow(new Color("#823"), 0.5);
  yield* fadeOutDown(libnds_explaination);
  yield* sequence(0.1,
    libnds_txt().position([400, -300], 0.5),
    libnds_txt().size(98, 0.5),
  );

  yield* all(
    libnds_txt().flicker_out(1),
    devkitarm_txt().flicker_out(1),
  );

  view().removeChildren();

  yield* waitUntil("compiler_frontend_time");
  const frontend_title = createRef<NeonText>();
  const frontend_box = createRef<NeonRect>();
  
  const code_icon = createRef<NeonIcon>();
  const right_dash = createRef<NeonLine>();
  const right_arrow = createRef<NeonLine>();
  const ast_icon = createRef<NeonIcon>();

  view().add(<>
    <NeonText
      ref={frontend_title}
      size={128}
      glow={new Color("#388")}
      alpha={0} text_alpha={0}
      txt={"Compiler Frontend"}
    />
    <NeonRect
      ref={frontend_box}
      width={()=>frontend_title().width()+50}
      height={()=>frontend_title().height()+40}
      glow={new Color("#388")} alpha={0} border={15}
      zIndex={-1}
    />
    <NeonLine
      ref={right_dash}
      points={[
        frontend_box().rect_ref().left().addX(280),
        frontend_box().rect_ref().left().addX(150),
      ]}
      glow={new Color("#388")} alpha={0} border={40}
      zIndex={-2}
    />
    <NeonLine
      ref={right_arrow}
      points={[
        frontend_box().rect_ref().right().addX(-280),
        frontend_box().rect_ref().right().addX(-150),
      ]}
      glow={new Color("#388")} alpha={0} border={40}
      endArrow
      zIndex={-2}
    />
    <NeonIcon
      ref={code_icon}
      icon={"ph:file-code-light"}
      size={208}
      x={-600} y={0}
      alpha={0} icon_alpha={0}
      glow={new Color("#828")}
    />
    <NeonIcon
      ref={ast_icon}
      icon={"streamline:interface-hierarchy-2-node-organization-links-structure-link-nodes-network-hierarchy"}
      size={208}
      x={600} y={0}
      alpha={0} icon_alpha={0}
      glow={new Color("#828")}
    />
  </>);

  yield* frontend_title().flicker_in(1);
  yield* waitFor(3);
  yield* frontend_title().size(60, 0.5);
  yield* frontend_box().flicker_in(1);

  yield* waitUntil("show_frontend_pipeline");
  yield* all(right_dash().flicker_in(1), right_arrow().flicker_in(1));
  yield* code_icon().flicker_in(1);
  yield* ast_icon().flicker_in(1);

  yield* waitUntil("frontend_breakdown");
  yield* shifty_all(-400, 0.5,
    frontend_title(), frontend_box(),
    code_icon(), ast_icon(),
    right_arrow(), right_dash(),
  );

  const example_code = createRef<Node>();
  const example_code_ref = createRef<Code>();
  const the_code = Code.createSignal(CODE`\
main :: func() {
  print("Sum:" + (10 + 20) );
}`);

  view().add(<Node
    ref={example_code}
    y={90}
    opacity={0}>
    <Code
      fontFamily={"Fira Code"}
      code={()=>the_code()}
      fontSize={88}
      filters={[blur(10)]}
    />
    <Code
      fontFamily={"Fira Code"}
      code={()=>the_code()}
      fontSize={88}
      filters={[blur(5),brightness(0.5)]}
    />
    <Code
      ref={example_code_ref}
      fontFamily={"Fira Code"}
      code={()=>the_code()}
      fontSize={88}
      filters={[brightness(1)]}
    />
  </Node>);

  const token_strings = [
    "main",
    "::",
    "func",
    "(",
    ")",
    "{",
    "print",
    "(",
    "\"Sum:\"",
    "+",
    "(",
    "10",
    "+",
    "20",
    ")",
    ")",
    ";",
    "}",
  ];
  const token_colors_list = [
    "#b48ead",
    "#ffffff",
    "#8fbcbb",
    "#ffffff",
    "#ffffff",
    "#8fbcbb",
    "#8fbcbb",
    "#ffffff",
    "#a3be8c", // A
    "#a3be8c",
    "#ffffff",
    "#b48ead",
    "#a3be8c",
    "#b48ead",
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#8fbcbb",
  ];
  const tokens_list = [
    code_get_token(example_code_ref(), "main"),
    code_get_token(example_code_ref(), "::"),
    code_get_token(example_code_ref(), "func"),
    code_get_token(example_code_ref(), "\\("),
    code_get_token(example_code_ref(), "\\)"),
    code_get_token(example_code_ref(), "{"),
    code_get_token(example_code_ref(), "print"),
    code_get_token(example_code_ref(), "\\(", 1),
    code_get_token(example_code_ref(), "\"Sum:\""),
    code_get_token(example_code_ref(), "\\+"),
    code_get_token(example_code_ref(), "\\(", 2),
    code_get_token(example_code_ref(), "10"),
    code_get_token(example_code_ref(), "\\+", 1),
    code_get_token(example_code_ref(), "20"),
    code_get_token(example_code_ref(), "\\)", 1),
    code_get_token(example_code_ref(), "\\)", 2),
    code_get_token(example_code_ref(), ";"),
    code_get_token(example_code_ref(), "}"),
  ];
  const token_rects: Rect[] = [];
  const token_copies: Txt[] = [];
  const token_copies_b1: Txt[] = [];
  const token_copies_b2: Txt[] = [];

  const main_token = 0;
  const func_token = 2;
  const print_token = 6;
  const sum_txt_token = 8;
  const plus_token_1 = 9;
  const ten_token = 11;
  const plus_token_2 = 12;
  const twenty_token = 13;

  view().add(<>
    {...tokens_list.map((s, i) => <>
      <Rect
        ref={makeRef(token_rects, i)}
        radius={4}
        stroke={new Color(token_colors_list[i]).brighten(1)} lineWidth={4}
        position={()=>s().position.add(s().size.div(2)).add(example_code().position())}
        size={()=>s().size} opacity={0}
      />
      <Txt
        ref={makeRef(token_copies_b2, i)}
        fontFamily={"Fira Code"}
        fontSize={88}
        text={token_strings[i]} fill={token_colors_list[i]}
        position={() => s().position.add(s().size.div(2))
                        .add(example_code().position())
                        .addY(8)}
        filters={[blur(10)]}
        opacity={0}
      />
      <Txt
        ref={makeRef(token_copies_b1, i)}
        fontFamily={"Fira Code"}
        fontSize={88}
        text={token_strings[i]} fill={token_colors_list[i]}
        position={() => s().position.add(s().size.div(2))
                        .add(example_code().position())
                        .addY(8)}
        filters={[blur(5),brightness(0.5)]}
        opacity={0}
      />
      <Txt
        ref={makeRef(token_copies, i)}
        fontFamily={"Fira Code"}
        fontSize={88}
        text={token_strings[i]} fill={token_colors_list[i]}
        position={() => s().position.add(s().size.div(2))
                        .add(example_code().position())
                        .addY(8)}
        filters={[brightness(1)]}
        opacity={0}
      />
    </>)}
  </>);




  yield* flicker_in(example_code(), 2);
  yield* sequence(0.1,
    ...token_rects.map((s, i) => flicker_in(s, 1)),
  );

  yield* all(
    ...token_copies.map(r => r.opacity(1, 0)),
    ...token_copies_b1.map(r => r.opacity(1, 0)),
    ...token_copies_b2.map(r => r.opacity(1, 0)),
  );
  yield* example_code().opacity(0, 0);

  yield* waitFor(2);
  const punctuation = [1, 3, 4, 5, 7, 10, 14, 15, 16, 17];
  yield* sequence(0.05,
    ...range(0, 18).filter((v, i, a) => !punctuation.includes(v)).map(i => all(
      token_rects[i].size(token_rects[i].size().mul([0.75, 0.75]), 0.5),
      token_copies[i].fontSize(token_copies[i].fontSize()/1.5, 0.5),
      token_copies_b1[i].fontSize(token_copies_b1[i].fontSize()/1.5, 0.5),
      token_copies_b2[i].fontSize(token_copies_b2[i].fontSize()/1.5, 0.5),
    )),
    ...punctuation.map(i => all(
      flicker_out(token_rects[i], 1),
      flicker_out(token_copies[i], 1),
      flicker_out(token_copies_b1[i], 1),
      flicker_out(token_copies_b2[i], 1),
    )),
    sequence(0.04,
      all(token_rects[func_token].position([0,-100], 0.3),
      token_copies[func_token].position([0,-100], 0.3)),
      token_copies_b1[func_token].position([0,-100], 0.3),
      token_copies_b2[func_token].position([0,-100], 0.3),
    ),
    sequence(0.04,
      all(token_rects[main_token].position([-200,25], 0.3),
      token_copies[main_token].position([-200,25], 0.3)),
      token_copies_b1[main_token].position([-200,25], 0.3),
      token_copies_b2[main_token].position([-200,25], 0.3),
    ),
    sequence(0.04,
      all(token_rects[print_token].position([200,25], 0.3),
      token_copies[print_token].position([200,25], 0.3)),
      token_copies_b1[print_token].position([200,25], 0.3),
      token_copies_b2[print_token].position([200,25], 0.3),
    ),
    sequence(0.04,
      all(token_rects[plus_token_1].position([200,150], 0.3),
      token_copies[plus_token_1].position([200,150], 0.3)),
      token_copies_b1[plus_token_1].position([200,150], 0.3),
      token_copies_b2[plus_token_1].position([200,150], 0.3),
    ),
    sequence(0.04,
      all(token_rects[sum_txt_token].position([25,275], 0.3),
      token_copies[sum_txt_token].position([25,275], 0.3)),
      token_copies_b1[sum_txt_token].position([25,275], 0.3),
      token_copies_b2[sum_txt_token].position([25,275], 0.3),
    ),
    sequence(0.04,
      all(token_rects[plus_token_2].position([300,275], 0.3),
      token_copies[plus_token_2].position([300,275], 0.3)),
      token_copies_b1[plus_token_2].position([300,275], 0.3),
      token_copies_b2[plus_token_2].position([300,275], 0.3),
    ),
    sequence(0.04,
      all(token_rects[ten_token].position([200,400], 0.3),
      token_copies[ten_token].position([200,400], 0.3)),
      token_copies_b1[ten_token].position([200,400], 0.3),
      token_copies_b2[ten_token].position([200,400], 0.3),
    ),
    sequence(0.04,
      all(token_rects[twenty_token].position([400,400], 0.3),
      token_copies[twenty_token].position([400,400], 0.3)),
      token_copies_b1[twenty_token].position([400,400], 0.3),
      token_copies_b2[twenty_token].position([400,400], 0.3),
    ),
  );
  
  punctuation.map(i => {
    token_rects[i].remove();
    token_copies[i].remove();
    token_copies_b1[i].remove();
    token_copies_b2[i].remove();
  });

  const lines: Line[] = [];
  view().add(
    <>
      <Line
        ref={makeRef(lines, 0)}
        points={[
          token_rects[func_token].bottomLeft(),
          token_rects[main_token].topRight(),
        ]}
        lineWidth={5}
        end={0}
        stroke={new Gradient({
          type: 'linear',
          from: token_rects[func_token].bottomLeft(),
          to: token_rects[main_token].topRight(),
          stops: [
            {offset:0, color:new Color(token_colors_list[func_token]).brighten(1)},
            {offset:1, color:new Color(token_colors_list[main_token]).brighten(1)}
          ]
        })}
      />
      <Line
        ref={makeRef(lines, 1)}
        points={[
          token_rects[func_token].bottomRight(),
          token_rects[print_token].topLeft(),
        ]}
        lineWidth={5}
        end={0}
        stroke={new Gradient({
          type: 'linear',
          from: token_rects[func_token].bottomRight(),
          to: token_rects[print_token].topLeft(),
          stops: [
            {offset:0, color:new Color(token_colors_list[func_token]).brighten(1)},
            {offset:1, color:new Color(token_colors_list[print_token]).brighten(1)}
          ]
        })}
      />
      <Line
        ref={makeRef(lines, 2)}
        points={[
          token_rects[print_token].bottom(),
          token_rects[plus_token_1].top(),
        ]}
        lineWidth={5}
        end={0}
        stroke={new Gradient({
          type: 'linear',
          from: token_rects[print_token].bottom(),
          to: token_rects[plus_token_1].top(),
          stops: [
            {offset:0, color:new Color(token_colors_list[print_token]).brighten(1)},
            {offset:1, color:new Color(token_colors_list[plus_token_1]).brighten(1)}
          ]
        })}
      />
      <Line
        ref={makeRef(lines, 3)}
        points={[
          token_rects[plus_token_1].bottomLeft(),
          token_rects[sum_txt_token].topRight(),
        ]}
        lineWidth={5}
        end={0}
        stroke={new Gradient({
          type: 'linear',
          from: token_rects[plus_token_1].bottomLeft(),
          to: token_rects[sum_txt_token].topRight(),
          stops: [
            {offset:0, color:new Color(token_colors_list[plus_token_1]).brighten(1)},
            {offset:1, color:new Color(token_colors_list[sum_txt_token]).brighten(1)}
          ]
        })}
      />
      <Line
        ref={makeRef(lines, 4)}
        points={[
          token_rects[plus_token_1].bottomRight(),
          token_rects[plus_token_2].topLeft(),
        ]}
        lineWidth={5}
        end={0}
        stroke={new Gradient({
          type: 'linear',
          from: token_rects[plus_token_1].bottomRight(),
          to: token_rects[plus_token_2].topLeft(),
          stops: [
            {offset:0, color:new Color(token_colors_list[plus_token_1]).brighten(1)},
            {offset:1, color:new Color(token_colors_list[plus_token_2]).brighten(1)}
          ]
        })}
      />
      <Line
        ref={makeRef(lines, 5)}
        points={[
          token_rects[plus_token_2].bottomLeft(),
          token_rects[ten_token].topRight(),
        ]}
        lineWidth={5}
        end={0}
        stroke={new Gradient({
          type: 'linear',
          from: token_rects[plus_token_2].bottomLeft(),
          to: token_rects[ten_token].topRight(),
          stops: [
            {offset:0, color:new Color(token_colors_list[plus_token_2]).brighten(1)},
            {offset:1, color:new Color(token_colors_list[ten_token]).brighten(1)}
          ]
        })}
      />
      <Line
        ref={makeRef(lines, 6)}
        points={[
          token_rects[plus_token_2].bottomRight(),
          token_rects[twenty_token].topLeft(),
        ]}
        lineWidth={5}
        end={0}
        stroke={new Gradient({
          type: 'linear',
          from: token_rects[plus_token_2].bottomRight(),
          to: token_rects[twenty_token].topLeft(),
          stops: [
            {offset:0, color:new Color(token_colors_list[plus_token_2]).brighten(1)},
            {offset:1, color:new Color(token_colors_list[twenty_token]).brighten(1)}
          ]
        })}
      />
    </>
  );
  yield* all(...lines.map(l => l.end(1, 0.5)));

  const tags: NeonIcon[] = [];
  const index_tags: NeonIcon[] = [];
  const index_labels: Txt[] = [];
  const index_labels_b1: Txt[] = [];
  const index_labels_b2: Txt[] = [];

  view().add(<>
    <NeonIcon
      ref={makeRef(tags, 0)}
      icon={"mdi:tag"}
      size={45}
      position={() => token_rects[ten_token].bottomRight()}
      alpha={0} icon_alpha={0}
      glow={new Color("#882")}
    />
    <NeonIcon
      ref={makeRef(tags, 1)}
      icon={"mdi:tag"}
      size={45}
      position={() => token_rects[twenty_token].bottomRight()}
      alpha={0} icon_alpha={0}
      glow={new Color("#882")}
    />
    <NeonIcon
      ref={makeRef(tags, 2)}
      icon={"mdi:tag"}
      size={45}
      position={() => token_rects[plus_token_2].bottomRight()}
      alpha={0} icon_alpha={0}
      glow={new Color("#882")}
    />
    <NeonIcon
      ref={makeRef(tags, 3)}
      icon={"mdi:tag"}
      size={45}
      position={() => token_rects[sum_txt_token].bottomRight()}
      alpha={0} icon_alpha={0}
      glow={new Color("#288")}
    />
    <NeonIcon
      ref={makeRef(tags, 4)}
      icon={"mdi:tag"}
      size={45}
      position={() => token_rects[plus_token_1].bottomRight()}
      alpha={0} icon_alpha={0}
      glow={new Color("#288")}
    />
    <NeonIcon
      ref={makeRef(tags, 5)}
      icon={"mdi:tick"}
      size={45}
      position={() => token_rects[print_token].topRight()}
      alpha={0} icon_alpha={0}
      glow={new Color("#283")}
    />
    <NeonIcon
      ref={makeRef(tags, 6)}
      icon={"mdi:tick"}
      size={45}
      position={() => token_rects[func_token].topRight()}
      alpha={0} icon_alpha={0}
      glow={new Color("#283")}
    />
    <NeonIcon
      ref={makeRef(index_tags, 0)}
      icon={"mdi:tag"}
      size={45}
      position={[700, 0]}
      alpha={0} icon_alpha={0}
      glow={new Color("#882")}
    />
    <NeonIcon
      ref={makeRef(index_tags, 1)}
      icon={"mdi:tag"}
      size={45}
      position={[700, 75]}
      alpha={0} icon_alpha={0}
      glow={new Color("#288")}
    />
    <>
      <Txt
        ref={makeRef(index_labels_b2, 0)}
        fontFamily={"Fira Code"}
        fontSize={40}
        text={"int"} fill={"#882"}
        position={index_tags[0].position().addX(75).addY(8)}
        filters={[blur(10)]}
        opacity={0}
      />
      <Txt
        ref={makeRef(index_labels_b1, 0)}
        fontFamily={"Fira Code"}
        fontSize={40}
        text={"int"} fill={"#882"}
        position={() => index_tags[0].position().addX(75).addY(8)}
        filters={[blur(7.5),brightness(1)]}
        opacity={0}
      />
      <Txt
        ref={makeRef(index_labels, 0)}
        fontFamily={"Fira Code"}
        fontSize={40}
        text={"int"} fill={"#882"}
        position={() => index_tags[0].position().addX(75).addY(8)}
        filters={[brightness(2)]}
        opacity={0}
      />
    </>
    <>
      <Txt
        ref={makeRef(index_labels_b2, 1)}
        fontFamily={"Fira Code"}
        fontSize={40}
        text={"str"} fill={"#288"}
        position={index_tags[1].position().addX(75).addY(8)}
        filters={[blur(10)]}
        opacity={0}
      />
      <Txt
        ref={makeRef(index_labels_b1, 1)}
        fontFamily={"Fira Code"}
        fontSize={40}
        text={"str"} fill={"#288"}
        position={() => index_tags[1].position().addX(75).addY(8)}
        filters={[blur(7.5),brightness(1)]}
        opacity={0}
      />
      <Txt
        ref={makeRef(index_labels, 1)}
        fontFamily={"Fira Code"}
        fontSize={40}
        text={"str"} fill={"#288"}
        position={() => index_tags[1].position().addX(75).addY(8)}
        filters={[brightness(2)]}
        opacity={0}
      />
    </>
  </>);
  yield* waitFor(1);
  yield* all(
    sequence(0.25,
      ...range(0, 2).map(i => all(
        index_tags[i].flicker_in(),
        flicker_in(index_labels[i]),
        flicker_in(index_labels_b1[i]),
        flicker_in(index_labels_b2[i]),
      )),
    ),
    sequence(0.75,
      ...tags.map(v => v.flicker_in(1)),
    ),
  );

  yield* waitUntil("all_out");
  yield* sequence(0.1,
    ...lines.map(l => flicker_out(l)),
    ...tags.map(l => l.flicker_out(1)),
    ...index_tags.map(l => l.flicker_out(1)),
    ...index_labels.map(l => flicker_out(l)),
    ...index_labels_b1.map(l => flicker_out(l)),
    ...index_labels_b2.map(l => flicker_out(l)),
    ...range(0, 18).filter((v, i, a) => !punctuation.includes(v)).map(i => all(
      flicker_out(token_rects[i], 1),
      flicker_out(token_copies[i], 1),
      flicker_out(token_copies_b1[i], 1),
      flicker_out(token_copies_b2[i], 1),
    )),
    code_icon().flicker_out(1), ast_icon().flicker_out(1),
    right_arrow().flicker_out(1), right_dash().flicker_out(1),
    frontend_box().flicker_out(1), frontend_title().flicker_out(),
  );
  view().removeChildren();

  yield* waitUntil("the_silly_things");

  const weird_decls = createRef<Node>();
  const weird_decls_code = createRef<Code>();
  const weird_decls_rect = createRef<Rect>();
  const weird_decl_code_str = Code.createSignal(CODE`\
int a = 10;        // Variables
void b(int arg) {} // Functions
struct c {};       // Structs`);

  const namebound_mods = createRef<Node>();
  const namebound_mods_code = createRef<Code>();
  const namebound_mods_rect = createRef<Rect>();
  const namebound_mod_code_str = Code.createSignal(CODE`\
int *a, b; // a is a pointer, b is an int
int* a, b; // changes nothing`);

  const spiral_mods = createRef<Node>();
  const spiral_mods_code = createRef<Code>();
  const spiral_mods_rect = createRef<Rect>();
  const spiral_mod_code_str = Code.createSignal(CODE`\
int *a[10];   // a is an array of 10 pointers to ints
int (*b)[10]; // explicit inversion, pointer to array
              // of 10 ints`);

  const fuckingfunctionpointersvid = createRef<Video>();
  view().add(<>
    <Node ref={weird_decls} y={-300} opacity={0} rotation={-5}>
      <Code
        code={()=>weird_decl_code_str()}
        fontFamily={"Fira Code"}
        fontSize={48}
        filters={[blur(10)]}
      />
      <Code
        code={()=>weird_decl_code_str()}
        fontFamily={"Fira Code"}
        fontSize={48}
        filters={[blur(5),brightness(0.5)]}
      />
      <Code
        ref={weird_decls_code}
        code={()=>weird_decl_code_str()}
        fontFamily={"Fira Code"}
        fontSize={48}
        filters={[brightness(1)]}
      />
      <Rect
        radius={10}
        fill={new Color("#111")}
        position={()=>weird_decls_code().position()}
        size={()=>weird_decls_code().size().add([80, 40])}
        zIndex={-1}
      />
      <Rect
        radius={10}
        stroke={new Color("#428").brighten(1)} lineWidth={15}
        position={()=>weird_decls_code().position()}
        size={()=>weird_decls_code().size().add([80, 40])}
        filters={[blur(10)]}
      />
      <Rect
        radius={10}
        stroke={new Color("#428").brighten(1)} lineWidth={15}
        position={()=>weird_decls_code().position()}
        size={()=>weird_decls_code().size().add([80, 40])}
        filters={[blur(5),brightness(0.5)]}
      />
      <Rect
        ref={weird_decls_rect}
        radius={10}
        stroke={new Color("#428").brighten(1)} lineWidth={15}
        position={()=>weird_decls_code().position()}
        size={()=>weird_decls_code().size().add([80, 40])}
        filters={[brightness(1)]}
      />
    </Node>
    <Node ref={namebound_mods} y={-50} opacity={0} rotation={10}>
      <Code
        code={()=>namebound_mod_code_str()}
        fontFamily={"Fira Code"}
        fontSize={48}
        filters={[blur(10)]}
      />
      <Code
        code={()=>namebound_mod_code_str()}
        fontFamily={"Fira Code"}
        fontSize={48}
        filters={[blur(5),brightness(0.5)]}
      />
      <Code
        ref={namebound_mods_code}
        code={()=>namebound_mod_code_str()}
        fontFamily={"Fira Code"}
        fontSize={48}
        filters={[brightness(1)]}
      />
      <Rect
        radius={10}
        fill={new Color("#111")}
        position={()=>namebound_mods_code().position()}
        size={()=>namebound_mods_code().size().add([80, 40])}
        zIndex={-1}
      />
      <Rect
        radius={10}
        stroke={new Color("#248").brighten(1)} lineWidth={15}
        position={()=>namebound_mods_code().position()}
        size={()=>namebound_mods_code().size().add([80, 40])}
        filters={[blur(10)]}
      />
      <Rect
        radius={10}
        stroke={new Color("#248").brighten(1)} lineWidth={15}
        position={()=>namebound_mods_code().position()}
        size={()=>namebound_mods_code().size().add([80, 40])}
        filters={[blur(5),brightness(0.5)]}
      />
      <Rect
        ref={namebound_mods_rect}
        radius={10}
        stroke={new Color("#248").brighten(1)} lineWidth={15}
        position={()=>namebound_mods_code().position()}
        size={()=>namebound_mods_code().size().add([80, 40])}
        filters={[brightness(1)]}
      />
    </Node>
    <Node ref={spiral_mods} y={100} opacity={0} rotation={0}>
      <Code
        code={()=>spiral_mod_code_str()}
        fontFamily={"Fira Code"}
        fontSize={48}
        filters={[blur(10)]}
      />
      <Code
        code={()=>spiral_mod_code_str()}
        fontFamily={"Fira Code"}
        fontSize={48}
        filters={[blur(5),brightness(0.5)]}
      />
      <Code
        ref={spiral_mods_code}
        code={()=>spiral_mod_code_str()}
        fontFamily={"Fira Code"}
        fontSize={48}
        filters={[brightness(1)]}
      />
      <Rect
        radius={10}
        fill={new Color("#111")}
        position={()=>spiral_mods_code().position()}
        size={()=>spiral_mods_code().size().add([80, 40])}
        zIndex={-1}
      />
      <Rect
        radius={10}
        stroke={new Color("#248").brighten(1)} lineWidth={15}
        position={()=>spiral_mods_code().position()}
        size={()=>spiral_mods_code().size().add([80, 40])}
        filters={[blur(10)]}
      />
      <Rect
        radius={10}
        stroke={new Color("#248").brighten(1)} lineWidth={15}
        position={()=>spiral_mods_code().position()}
        size={()=>spiral_mods_code().size().add([80, 40])}
        filters={[blur(5),brightness(0.5)]}
      />
      <Rect
        ref={spiral_mods_rect}
        radius={10}
        stroke={new Color("#248").brighten(1)} lineWidth={15}
        position={()=>spiral_mods_code().position()}
        size={()=>spiral_mods_code().size().add([80, 40])}
        filters={[brightness(1)]}
      />
    </Node>
    <Video
      ref={fuckingfunctionpointersvid}
      src={fuckingfunctionpointers_vid}
      size={["100%", "100%"]} y={-1200}
    />
  </>);
  yield* flicker_in(weird_decls(), 1);
  yield* waitFor(1);
  yield* flicker_in(namebound_mods(), 1);
  yield* waitFor(1);
  yield* flicker_in(spiral_mods(), 1);
  yield* waitFor(3);
  fuckingfunctionpointersvid().play();
  yield* fuckingfunctionpointersvid().y(0, 3, linear);

  yield* waitFor(2);
  yield* sequence(0.2,
    flicker_out(weird_decls(), 1),
    flicker_out(namebound_mods(), 1),
    flicker_out(spiral_mods(), 1),
    flicker_out(fuckingfunctionpointersvid(), 1),
  );
  view().removeChildren();

  yield* waitUntil("consistency");
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

  const declarations_code_str = Code.createSignal(CODE`name: Type = Value;`);
  const declarations_notype_code_str = Code.createSignal(CODE`name: Type = Value;`);
  const declarations_noval_code_str = Code.createSignal(CODE`name: Type = Value;`);
  const declarations_const_code_str = Code.createSignal(CODE`name: Type = Value;`);
  const declarations_const_notype_code_str = Code.createSignal(CODE`name: Type = Value;`);
  view().add(<>
    <NeonText
      ref={consistency_title}
      txt={"Declaration Consistency"}
      size={150} glow={new Color("#838")}
      alpha={0} text_alpha={0}
    />
    <Node ref={declarations_code_container} opacity={0} y={-100}>
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
    <Node ref={declarations_notype_code_container} opacity={0} y={-100}>
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
    <Node ref={declarations_noval_code_container} opacity={0} y={-100}>
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
    <Node ref={declarations_const_code_container} opacity={0} y={-100}>
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
    <Node ref={declarations_const_notype_code_container} opacity={0} y={-100}>
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
  </>);
  yield* consistency_title().flicker_in(1);
  declarations_code_container().clone()
  yield* waitFor(4.5);
  yield* sequence(0.1,
    consistency_title().size(105, 0.5),
    consistency_title().y(-400, 0.5),    
  );
  yield* flicker_in(declarations_code_container(), 1);
  yield* all(
    declarations_notype_code_container().opacity(1, 0.5),
    declarations_noval_code_container().opacity(1, 0.5),
  );
  yield* waitFor(4);
  yield* shifty(declarations_notype_code_container(), 75, 0.5);
  yield* waitFor(1);
  yield* declarations_notype_code_str(CODE`name := Value;`, 0.5);
  yield* waitFor(4);
  yield* shifty(declarations_noval_code_container(), 150, 0.5);
  yield* waitFor(2);
  yield* declarations_noval_code_str(CODE`name: Type;`, 0.5);

  yield* all(
    declarations_const_notype_code_container().opacity(1, 0.5),
    declarations_const_code_container().opacity(1, 0.5),
  );
  yield* waitFor(6);
  yield* shifty(declarations_const_code_container(), 225, 0.5);
  yield* waitFor(2);
  yield* declarations_const_code_str(CODE`name: Type : Value;`, 0.5);
  yield* waitFor(2);
  yield* shifty(declarations_const_notype_code_container(), 300, 0.5);
  yield* waitFor(2);
  yield* declarations_const_notype_code_str(CODE`name :: Value;`, 0.5);
  
  yield* waitFor(4);
  yield* sequence(0.1,
    flicker_out(declarations_code_container(), 1),
    flicker_out(declarations_notype_code_container(), 1),
    flicker_out(declarations_noval_code_container(), 1),
    flicker_out(declarations_const_code_container(), 1),
    flicker_out(declarations_const_notype_code_container(), 1),
    flicker_out(consistency_title(), 1),
  );
  
  yield* waitUntil("end");
});

