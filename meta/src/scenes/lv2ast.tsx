import { Circle, Code, Gradient, Img, LezerHighlighter, Line, Node, Rect, Txt, Video, makeScene2D } from "@motion-canvas/2d";
import { Color, Vector2, all, cancel, createRef, createRefArray, createSignal, easeOutCubic, easeOutSine, linear, loop, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { by_palette, shadow_color } from "../utils/colors";
import { RegularText } from "../utils/defaults";
import { fade_in_up, fade_out_up, write_code } from "../utils/anims";

import vid_libclang from "../extern/libclang.mp4";
import vid_misra_std from "../extern/misra_std.mp4";
import img_jailogo from "../extern/jailogo.png";
import img_nimlogo from "../extern/nimlogo.png";

import { parser } from '@lezer/cpp';
Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeScene2D(function* (view) {
    const middle_circ = createRef<Circle>();
    const middle_txt = createRef<Txt>();
    
    const component_strs = [
        "Calls",
        "Decls",
        "Types",
        "Names",
        "More",
    ];
    const component_circs = createRefArray<Circle>();
    const component_texts = createRefArray<Txt>();
    const component_lines = createRefArray<Line>();
    const component_distance = createSignal(0.0);
    const component_angle_off = createSignal(0.0);
    const background_tri = createRefArray<Line>();
    const biggraph = createRef<Node>();

    view.add(<>
        <Node
            ref={biggraph}
        >
            <Circle
                ref={middle_circ}
                scale={0}
                width={300} height={200}
                lineWidth={20} fill={"#111111"}
                stroke={by_palette[0]} clip
                shadowOffsetY={10} zIndex={1}
                shadowColor={shadow_color(by_palette[0])}
            >
                <RegularText
                    ref={middle_txt}
                    y={7} fontSize={100}
                    fill={by_palette[0]}
                    shadowOffsetY={0}
                    text={"AST"}
                />
            </Circle>

            {...component_strs.map((v, i) => <Node
                position={() => new Vector2([-0, component_distance()])
                    .rotate(-component_angle_off()+i*360/5).mul([1.25,1])}
            >
                <Circle
                    ref={component_circs}
                    scale={0}
                    width={250} height={150}
                    lineWidth={10} fill={"#111111"}
                    stroke={by_palette[2]}
                    shadowOffsetY={10} clip
                    shadowColor={shadow_color(by_palette[2])}
                >
                    <RegularText
                        ref={component_texts}
                        y={7} fontSize={50}
                        fill={by_palette[2]}
                        shadowOffsetY={0}
                        text={v}
                    />
                </Circle>
                <Line
                    ref={component_lines}
                    points={[[0, 0], () => new Vector2([0, -component_distance()])
                        .rotate(-component_angle_off()+i*360/5).mul([1.25,1])]}
                    lineWidth={10}
                    stroke={() => new Gradient({
                        type: "linear",
                        from: [0, 0],
                        to: new Vector2([0, -component_distance()])
                            .rotate(-component_angle_off()+i*360/5).mul([1.25,1]),
                        stops: [
                            { offset: 0, color: by_palette[2] },
                            { offset: 0.85, color: by_palette[0] },
                        ]
                    })}
                    zIndex={-10}
                />
            </Node>)}
        </Node>

        <Line
            ref={background_tri}
            points={[
                new Vector2(900, 0).rotate(   0),
                new Vector2(900, 0).rotate( 120),
                new Vector2(900, 0).rotate(-120),
            ]}
            scale={0}
            rotation={() => 2*component_angle_off()}
            closed radius={80}
            fill={new Color(by_palette[1]).brighten(1).alpha(0.05)}
            zIndex={-1}
        />
    </>);
    yield* middle_circ().scale(1, 0.5);
    yield all(...component_circs.map(v => v.scale(1, 0.25)));
    yield all( background_tri().scale(1, 0.75), component_distance(400, 0.5) );
    const task = yield loop(Infinity, function* () {
        yield* component_angle_off(component_angle_off() + 360, 30, linear);
    });

    yield* waitUntil("endrotating");
    yield* sequence(0.1,
        biggraph().x(biggraph().x() - 1650, 0.5),
        background_tri().x(background_tri().x() - 1650, 0.5),
    );
    cancel(task);

    const libclang_vid = createRef<Video>();
    view.add(<>
        <Video
            ref={libclang_vid}
            src={vid_libclang}
            y={40} opacity={0}
            size={[1800, 900]}
            playbackRate={2}
        />
    </>);
    libclang_vid().play();
    yield* fade_in_up(libclang_vid());
    yield* waitUntil("other_langs");
    
    yield* fade_out_up(libclang_vid());
    const jailogo = createRef<Img>();
    const nimlogo = createRef<Img>();
    view.add(<>
        <Img
            ref={jailogo}
            src={img_jailogo}
            x={-300} width={500} height={500}
            opacity={0} y={40}
        />
        <Img
            ref={nimlogo}
            src={img_nimlogo}
            x={300} width={800} height={500}
            opacity={0} y={40}
        />
    </>);
    yield* waitFor(1.5);
    yield* sequence(1.0,
        fade_in_up(jailogo()),
        fade_in_up(nimlogo()),
    );


    yield* waitUntil("whatcanwedo");
    yield* sequence(0.1,
        fade_out_up(jailogo()),
        fade_out_up(nimlogo()),
    );
    const misra_vid = createRef<Video>();
    view.add(<>
        <Video
            ref={misra_vid}
            src={vid_misra_std}
            y={40} opacity={0}
            size={[1600, 900]}
        />
    </>);
    yield* waitFor(8);
    misra_vid().play();
    yield* fade_in_up(misra_vid());
    
    yield* waitUntil("endmisra");
    yield* fade_out_up(misra_vid());
    view.removeChildren();
    
    const introspective_txt = createRef<Txt>();
    const generative_txt = createRef<Txt>();
    view.add(<>
        <RegularText
            ref={introspective_txt}
            x={-1625} fontSize={80}
            text={"Introspective"}
        />
        <RegularText
            ref={generative_txt}
            x={225} y={40} opacity={0} fontSize={80}
            text={"+= Generative"}
        />
    </>);
    yield* waitFor(1);
    yield* introspective_txt().x(-225, 0.5);
    yield* waitFor(1);
    yield* fade_in_up(generative_txt());

    yield* waitUntil("common_req");
    yield* sequence(0.1,
        fade_out_up(introspective_txt()),
        fade_out_up(generative_txt()),
    );
    const string_arr = createRef<Code>();
    const enum_arr = createRef<Code>();
    const conv_arrow = createRef<Line>();
    const backrect0 = createRef<Rect>();
    const backrect0_lbl = createRef<Line>();
    const backrect0_lbl_txt = createRef<Txt>();
    view.add(<>
        <Rect
            ref={backrect0}
            width={1650}
            height={500}
            fill={"#222222"}
            stroke={by_palette[0]}
            lineWidth={15}
            radius={15} y={40} opacity={0}
            shadowOffsetY={10}
            shadowColor={shadow_color(by_palette[0])}
        >
            <Line
                ref={backrect0_lbl}
                x={-(1650/2)-7} y={-(500/2)}
                points={[[5, 0], [0, 20], [0, 0], [0, -100], [400, -100], [500, 0]]}
                closed radius={5}
                fill={by_palette[0]}
                lineWidth={15}
            />
            <RegularText
                ref={backrect0_lbl_txt}
                text={"Example 0"}
                x={-(1650/2)+175} y={-(500/2)-45}
                fill={"#ffffff"} shadowOffsetY={0}
            />
            <Line
                ref={conv_arrow}
                points={[[-150, 0], [150, 0]]} end={0}
                lineWidth={75} stroke={by_palette[1]}
                shadowOffsetY={10} shadowColor={shadow_color(by_palette[1])}
                arrowSize={100}
                endArrow
            />
            <Code
                ref={string_arr}
                code={``}
                x={475}
            />
            <Code
                ref={enum_arr}
                code={`\
enum {
    Instruction_Mov,
    Instruction_Ldr,
    Instruction_Str,
    Instruction_Adc,
};`}
                x={-500} y={40} opacity={0}
            />
        </Rect>
    </>);

    yield* waitFor(0.5);
    yield* fade_in_up(backrect0());
    yield* waitFor(1);
    yield* fade_in_up(enum_arr());
    yield* waitFor(1);
    yield* conv_arrow().end(1, 0.5);
    yield* waitFor(0.5);
    yield* write_code(string_arr(), `\
char* instr_names[] = {
    "MOV",
    "LDR",
    "STR",
    "ADC",
};`);

    const struct_arr = createRef<Code>();
    const serialize_fn = createRef<Code>();
    const conv_arrow_2 = createRef<Line>();
    const backrect1 = createRef<Rect>();
    const backrect1_lbl = createRef<Line>();
    const backrect1_lbl_txt = createRef<Txt>();
    view.add(<>
        <Rect
            ref={backrect1}
            width={1650}
            height={500}
            fill={"#222222"}
            stroke={by_palette[3]}
            lineWidth={15}
            radius={15} y={40} opacity={0}
            shadowOffsetY={10}
            shadowColor={shadow_color(by_palette[3])}
        >
            <Line
                ref={backrect1_lbl}
                x={-(1650/2)-7} y={-(500/2)}
                points={[[5, 0], [0, 20], [0, 0], [0, -100], [400, -100], [500, 0]]}
                closed radius={5}
                fill={by_palette[3]}
                lineWidth={15}
            />
            <RegularText
                ref={backrect1_lbl_txt}
                text={"Example 1"}
                x={-(1650/2)+175} y={-(500/2)-45}
                fill={"#ffffff"} shadowOffsetY={0}
            />
            <Line
                ref={conv_arrow_2}
                points={[[-100, 0], [100, 0]]} end={0}
                lineWidth={75} stroke={by_palette[1]}
                shadowOffsetY={10} shadowColor={shadow_color(by_palette[1])}
                arrowSize={90}
                endArrow
            />
            <Code
                ref={serialize_fn}
                code={``}
                x={450}
            />
            <Code
                ref={struct_arr}
                code={`\
typedef struct Entity {
    u64   id;
    i64   health;
    vec2  vel;
    EntityFlags flags;
} Entity;`}
                x={-470} y={40} opacity={0}
            />
        </Rect>
    </>);


    yield* waitFor(1.5);
    yield* backrect0().y(-800, 0.5);
    yield* fade_in_up(backrect1());
    yield* waitFor(1);
    yield* fade_in_up(struct_arr());
    yield* waitFor(1);
    yield* conv_arrow_2().end(1, 0.5);
    yield* waitFor(0.5);
    yield* write_code(serialize_fn(), `\
void serialize(Entity* e) {
    write8(&e->id);
    write8(&e->health);
    write_v2(&e->vel);
    write8(&e->flags);
}`);

    yield* waitFor(3);
    yield* backrect1().y(-800, 0.5);
    view.removeChildren();

    yield* waitUntil("glsl_conv_start"); 
    const functions_to_scroll = [
        "main :: ();",
        "window_create :: (w: u32, h: u32);",
        "window_should_close :: () -> bool;",
        "create_shader :: () -> u32;",
        "create_buffer :: () -> u32;",
        "create_vao :: () -> u32;",
        "like_and_subscribe :: ();",
        "vertex_shader :: () -> vec4; @Shader", // 7
        "delete_vao :: (handle: u32);",
        "delete_buffer :: (handle: u32);",
        "delete_shader :: (handle: u32);",
    ];
    const functions_to_scroll_containers = createRefArray<Node>();
    const functions_to_scroll_strings = createRefArray<Txt>();
    const functions_to_scroll_backs = createRefArray<Rect>();
    view.add(<>
        {...functions_to_scroll.map((s, i) =>
        <Node
            ref={functions_to_scroll_containers}
            x={-400}
            y={700 + i * 200}
        >
            <Rect
                ref={functions_to_scroll_backs}
                shadowOffsetY={3}
                x={-200}
                width={1400} height={80}
                fill={"#222222"} lineWidth={5}
                radius={5} stroke={by_palette[1]}
            />
            <RegularText
                ref={functions_to_scroll_strings}
                fontFamily={"Consolas"} fontSize={40}
                shadowOffsetY={3}
                text={s}
            />
        </Node>)}
    </>);

    yield* waitFor(5);
    yield* loop(4, function* () {
        yield* all(
            ...functions_to_scroll_containers.map(v => v.y(v.y() - 475, 0.75, linear)),
        );
    });
    yield* all(
        ...functions_to_scroll_containers.map(v => v.y(v.y() - 200, 0.75, easeOutSine)),
    );

    yield* all(
        sequence(0.15,
            ...functions_to_scroll_containers.filter((v, i) => i > 7)
                .reverse()
                .map(v => v.x(v.x() - 1200, 0.5))
        ),
        sequence(0.15,
            ...functions_to_scroll_containers.filter((v, i) => i < 7)
                .map(v => v.x(v.x() - 1200, 0.5))
        ),
    );

    yield* waitFor(0.2);
    yield* functions_to_scroll_strings[7].fill(by_palette[1], 0.5);
    yield* functions_to_scroll_containers[7].y(-300, 0.5);
    const to_shader_arrow = createRef<Line>();
    const shader_code = createRef<Code>();
    const shader_code_back = createRef<Rect>();
    view.add(<>
        <Line
            ref={to_shader_arrow}
            points={[[-450, -215], [-450, 175], [0, 175]]}
            lineWidth={30} endArrow arrowSize={60} end={0}
            radius={5}
            stroke={by_palette[2]}
        />
        <Rect
            ref={shader_code_back}
            x={500} y={240} opacity={0}
            width={850} height={400}
            fill={"222222"}
            lineWidth={5} radius={5}
            stroke={by_palette[4]}
        />
        <Code
            ref={shader_code}
            fontSize={36}
            code={``}
            x={500} y={200}
        />
    </>);
    yield* to_shader_arrow().end(1, 0.5);
    yield* fade_in_up(shader_code_back());
    yield* write_code(shader_code(), `\
#version 330 core

layout (location=0) in vec2 a_pos;

void main() {
    gl_Position = vec4(a_pos, 0.0, 1.0);
}`);

    yield* waitUntil("done_glsl_conv");
    yield* sequence(0.1,
        fade_out_up(functions_to_scroll_containers[7]),
        fade_out_up(to_shader_arrow()),
        fade_out_up(shader_code()),
        fade_out_up(shader_code_back()),
    )

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
      x={-400} y={65}
      lineWidth={10} closed
      lineDash={[50*1.2, 50*0.21]}
      stroke={new Color(by_palette[4])}      
      shadowOffsetY={5}
      shadowColor={shadow_color(by_palette[4])}
    />
    <Line
      ref={focus_line}
      x={-400} y={-75}
      points={[[0, 100], [0, 0], [600, 0]]}
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
    ...stack_elements.filter((v,i) => i < 2).map(v => fade_in_up(v, -40)),
  );
  yield* sequence(0.2,
    ...stack_elements.filter((v,i) => i >= 2).reverse().map(v => all(
      v.opacity(0.25, 0.5),
      v.y(v.y()-40, 0.5)
    )),
  );
    
  const reticle_task = yield loop(Infinity, function* () {
    yield* focus_reticle().lineDashOffset(focus_reticle().lineDashOffset() + 100, 1, linear)
  });
  yield* focus_reticle().points([[50, 0], [0, 50], [-50, 0], [0, -50]], 0.5);
  yield* focus_line().end(1, 0.5);
  yield* part_1_l1().text("PART 3", 0.5);
  yield* waitFor(1);
  yield* part_1_l2().text("ASSEMBLY", 0.5);

  yield* waitFor(4);
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