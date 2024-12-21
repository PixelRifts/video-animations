import { Layout, Line, Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import { DEFAULT, Origin, all, chain, createRef, createRefArray, createSignal, linear, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { offset_rainbow, palette, primary_glow_props, secondary_glow_props } from "../lib/palette";
import { TypedText } from "../lib/typing";


export default makeScene2D(function* (view) {
    yield* waitUntil("codepoint_list");
    const codepoints = createRef<Rect>();
    const codepoint_list = createRefArray<Txt>();
    const unicode_string = "Hello, World!";
    view.add(<>
        <Rect ref={codepoints} layout>
            {...range(unicode_string.length).map(i => <Txt
                fontFamily={"Jetbrains Mono"}
                ref={codepoint_list}
                text={""}
                fill={palette.text}
                fontSize={70}
            />)}
        </Rect>
    </>);

    yield* sequence(0.05,
        ...codepoint_list.map((t,i) => t.text(unicode_string[i], 0.8)),
    );
    yield* waitFor(1);
    yield* sequence(0.05,
        ...codepoint_list.map((t,i) => all(
            t.fontSize(45, 0.8),
            t.text(unicode_string[i].codePointAt(0).toString(10), 0.8)
        )),
        codepoints().columnGap(20, 0.5)
    );

    yield* waitUntil("simple_procedure");
    yield* codepoints().y(-450, 0.8);
    const fbo_title_ref = createRef<Txt>();
    const fbo_encloser = createRef<Line>();
    const fbo_canvas = createRef<Rect>();
    view.add(<>
        <Line
            ref={fbo_encloser}
            lineWidth={6} x={1800} y={70}
            stroke={palette.primary}
            points={[
                [ 0, 425 ],
                [ 425*1.3, 425 ],
                [ 425*1.3, -345 ],
                [ 275, -345 ],
                [ 220, -425 ],
                [ -220, -425 ],
                [ -275, -345 ],
                [ -425*1.3, -345 ],
                [ -425*1.3, 425 ],
                [ 0, 425 ],
            ]}
            closed zIndex={-5}
            fill={palette.foreground}
            {...primary_glow_props}
        >
            <Txt
                fontFamily={"Jetbrains Mono"}
                ref={fbo_title_ref}
                text={"Framebuffer"}
                fill={palette.text}
                x={0} y={-375}
                fontSize={60}
            />
            <Rect
                ref={fbo_canvas}
                size={[1000, 700]}
                y={40}
                fill={"#111111"}
            />
        </Line>
    </>);
    yield* fbo_encloser().x(325, 1.2);

    yield* waitUntil("map_cdpt_to_glyph");
    const map_encloser = createRef<Line>();
    const map_title_ref = createRef<Txt>();
    view.add(<>
        <Line
            ref={map_encloser}
            lineWidth={6} x={-575} y={70}
            stroke={palette.secondary}
            points={[
                [ 0, 425 ],
                [ 425*0.7, 425 ],
                [ 425*0.7, -345 ],
                [ 275*0.6, -345 ],
                [ 220*0.6, -425 ],
                [ -220*0.6, -425 ],
                [ -275*0.6, -345 ],
                [ -425*0.7, -345 ],
                [ -425*0.7, 425 ],
                [ 0, 425 ],
            ]} start={0.5} end={0.5}
            closed zIndex={-5}
            fill={palette.foreground_secondary}
            {...secondary_glow_props}
        >
            <Txt
                fontFamily={"Jetbrains Mono"}
                ref={map_title_ref}
                text={""}
                fill={palette.text}
                x={0} y={-375}
                fontSize={60}
            />
        </Line>
    </>);
    yield* map_title_ref().text("Map", 0.8);
    yield* all(map_encloser().start(0, 0.8), map_encloser().end(1, 0.8));
    const cached_data = createRefArray<Txt>();

    const cached_chars: string[] = [];
    new Set(unicode_string).add(" ").forEach(c => cached_chars.push(c));
    map_encloser().add(<>
        <Layout layout direction={"column"} height={400}>
            {...cached_chars.map(c => <Txt
                fontFamily={"Jetbrains Mono"}
                ref={cached_data}
                text={""}
                fill={palette.text}
                fontSize={40}
            />)}
        </Layout>
    </>);
    yield* sequence(0.05,
        ...cached_data.map((c, i) => c.text(cached_chars[i].codePointAt(0) + " -> " + cached_chars[i], 0.5))
    );

    yield* waitUntil("draw_text_routine");
    const text_writer = createRef<TypedText>();
    fbo_canvas().add(<>
        <TypedText
            ref={text_writer}
            fontSize={100}
            initial_text={""}
            width={800}
            hidden={false}
        />
    </>);

    yield* waitUntil("start_typing");
    yield* chain(
        ...range(unicode_string.length).map(i => all(
            codepoint_list[i].fontSize(codepoint_list[i].fontSize() + 50, 0.5).back(0.5),
            codepoint_list[i].fill("yellow", 0.5).back(0.5),
            text_writer().type(unicode_string[i]),
        ))
    );

    yield* waitUntil("the_issue");
    yield* sequence(0.1,
        fbo_encloser().x(1800, 1.2),
        map_encloser().x(-1800, 1.2),
        codepoints().y(codepoints().y() - 400, 1.2),
    );

    const hello_world_ref_english = createRef<TypedText>();
    const hello_world_ref_arabic = createRef<TypedText>();
    const hello_world_ref_hindi = createRef<TypedText>();
    const hello_world_ref_japanese = createRef<TypedText>();

    view.add(<>
        <TypedText
            ref={hello_world_ref_english}
            fontSize={100}
            initial_text={""}
            width={800} y={-200}
            hidden={true}
        />
        <TypedText
            ref={hello_world_ref_arabic}
            fontSize={100}
            initial_text={""} 
            width={800} x={300} y={-50}
            textDirection={"rtl"}
            hidden={true}
        />
        <TypedText
            ref={hello_world_ref_hindi}
            fontSize={100}
            initial_text={""}
            width={800} y={100}
            hidden={true}
        />
        <TypedText
            ref={hello_world_ref_japanese}
            fontSize={100}
            initial_text={""}
            width={800} y={250}
            hidden={true}
        />
    </>);

    yield* waitUntil("do_type");
    const hello_world_0 = "مرحبا بالعالم";
    const hello_world_1 = "नमस्ते दुनिया";
    const hello_world_2 = "こんにちは世界";

    yield* hello_world_ref_english().type(unicode_string, 2);
    yield* sequence(1,
        hello_world_ref_arabic().type(hello_world_0, 2),
        hello_world_ref_hindi().type(hello_world_1, 2),
        hello_world_ref_japanese().type(hello_world_2, 2),
    );

    yield* waitFor(2);
    yield* sequence(0.1,
        hello_world_ref_english().text().text("", 0.5),
        hello_world_ref_arabic().text().text("", 0.5),
        hello_world_ref_hindi().text().text("", 0.5),
        hello_world_ref_japanese().text().text("", 0.5),
    );

    view.removeChildren();
    yield* waitUntil("omori_unlocked_overcome");
    const input_text_block = createRef<Rect>();
    const shaping_input_texts = createRefArray<Txt>();
    const shaping_engine = createRef<Rect>();
    const shaping_engine_txt = createRef<Txt>();
    const output_text_block = createRef<Rect>();
    const shaping_output_texts = createRefArray<Txt>();
    const process_line_a = createRef<Line>();
    const process_line_b = createRef<Line>();
    const shaping_encloser = createRef<Line>();
    const shaping_title_ref = createRef<Txt>();

    const angle_sig = createSignal(0);
    yield angle_sig(80, 40, linear);
    const shaping_input = "こんにちはせかい";
    const shaping_output = "こんにちは世界";
    view.add(<>
        <Line ref={shaping_encloser}
            lineWidth={6}
            stroke={palette.primary}
            points={[
                [ 0, 425 ],
                [ 425*2, 425 ],
                [ 425*2, -345 ],
                [ 275*1.2, -345 ],
                [ 220*1.2, -425 ],
                [ -220*1.2, -425 ],
                [ -275*1.2, -345 ],
                [ -425*2, -345 ],
                [ -425*2, 425 ],
                [ 0, 425 ],
            ]}
            closed zIndex={-5} start={0.5} end={0.5}
            fill={palette.foreground}
            {...primary_glow_props}
        >
            <Txt
                fontFamily={"Jetbrains Mono"}
                ref={shaping_title_ref}
                text={""}
                fill={palette.text}
                x={0} y={-375}
                fontSize={60}
            />
        </Line>
    </>);
    shaping_encloser().add(<>
        <Rect
            ref={input_text_block}
            size={[0, 0]}
            x={-600} stroke={palette.secondary}
            fill={palette.foreground_secondary}
            layout
            direction={"column"}
            justifyContent={"center"}
            {...secondary_glow_props}
        >
            
            {...range(shaping_input.length).map(i => <Layout layout justifyContent={"center"}>
                <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={shaping_input_texts}
                    text={""}
                    fill={palette.text}
                    fontSize={40}
                />
            </Layout>)}
        </Rect>
        <Rect
            ref={shaping_engine}
            stroke={palette.secondary}
            fill={palette.foreground_secondary}
            {...secondary_glow_props}
            size={[300, 200]} lineWidth={12}
            end={0}
        >
            <Txt
                fontFamily={"Jetbrains Mono"}
                ref={shaping_engine_txt}
                text={""}
                fill={palette.text}
                fontSize={40}
            />
        </Rect>
        <Rect
            ref={output_text_block}
            size={[0, 0]}
            x={600} stroke={palette.secondary}
            fill={palette.foreground_secondary}
            layout
            direction={"column"}
            justifyContent={"center"}
            {...secondary_glow_props}
        >
            
            {...range(shaping_output.length).map(i => <Layout layout justifyContent={"center"}>
                <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={shaping_output_texts}
                    text={""}
                    fill={palette.text}
                    fontSize={40}
                />
            </Layout>)}
        </Rect>
        <Line
            ref={process_line_a}
            lineWidth={70}
            stroke={palette.secondary}
            points={() => [
                input_text_block().getOriginDelta(Origin.Right).add(input_text_block().position()),
                shaping_engine().getOriginDelta(Origin.Left).add(shaping_engine().position()),
            ]}
            end={0}
            fill={palette.foreground_secondary}
        />
        <Line
            ref={process_line_b}
            lineWidth={70}
            stroke={palette.secondary}
            points={() => [
                shaping_engine().getOriginDelta(Origin.Right).add(shaping_engine().position()),
                output_text_block().getOriginDelta(Origin.Left).add(output_text_block().position()),
            ]} endArrow
            arrowSize={120} end={0}
            fill={palette.foreground_secondary}
        />
    </>);
    yield* all(shaping_encloser().end(1, 0.8), shaping_encloser().start(0, 0.8));
    yield* sequence(0.1,
        input_text_block().size([300, 500], 1.2),
        input_text_block().lineWidth(12, 0.2),
    );

    yield* sequence(0.05,
        ...shaping_input_texts.map((c, i) => c.text("0x"+shaping_input[i].codePointAt(0).toString(16), 0.5)),
        shaping_engine().end(1, 0.8),
        process_line_a().end(1, 1.2),
    );
    yield* sequence(0.1,
        output_text_block().size([300, 500], 1.2),
        output_text_block().lineWidth(12, 0.2),
        process_line_b().end(1, 1.2),
    );
    yield* sequence(0.01,
        ...shaping_output_texts.map((c, i) => c.text(shaping_output[i], 0.5)),
    )
    yield* shaping_title_ref().text("Text Shaping", 1.2);
    yield* waitFor(0.5);
    yield* shaping_engine_txt().text("Shaping\nEngine", 0.8);

    yield* waitUntil("show_passes");
    yield* all(
        shaping_engine_txt().y(-150, 0.5),
        shaping_engine_txt().text("Shaping", 0.2).to("Shaping Engine", 0.4),
        shaping_engine().size([400, 400], 0.5),
    );
    const minimized_shaping_pass_txt = createRefArray<Txt>();
    shaping_engine().add(<Layout layout direction={"column"} y={30}>
        {...range(4).map(i => <Txt
            fontFamily={"Jetbrains Mono"}
            ref={minimized_shaping_pass_txt}
            text={""}
            fill={palette.text}
            fontSize={40}
        />)}
    </Layout>);

    yield* sequence(0.05, ...minimized_shaping_pass_txt.map((r, i) => r.text("Pass " + i, 0.5)));

    yield* waitUntil("devanagari_shaping_model");
    yield* shaping_encloser().y(-1200, 0.8)
    const dev2_passes = [
        "1) Identifying syllables and other sequences",
        "2) Initial reordering",
        "3) Applying the basic substitution features from GSUB",
        "4) Final reordering",
        "5) Applying all remaining substitution features from GSUB",
        "6) Applying all remaining positioning features from GPOS",
    ];
    const dev2_passes_encloser = createRef<Line>();
    const dev2_passes_title_ref = createRef<Txt>();
    const dev2_passes_texts = createRefArray<Txt>();

    view.add(<>
        <Line ref={dev2_passes_encloser}
            lineWidth={6}
            stroke={palette.primary}
            points={[
                [ 0, 425 ],
                [ 425, 425 ],
                [ 425, -345 ],
                [ 275, -345 ],
                [ 220, -425 ],
                [ -220, -425 ],
                [ -275, -345 ],
                [ -425, -345 ],
                [ -425, 425 ],
                [ 0, 425 ],
            ]}
            closed zIndex={-5} start={0.5} end={0.5}
            fill={palette.foreground}
            {...primary_glow_props}
        >
            <Txt
                fontFamily={"Jetbrains Mono"}
                ref={dev2_passes_title_ref}
                text={""}
                fill={palette.text}
                x={0} y={-375}
                fontSize={60}
            />
            <Layout layout direction={"column"} width={800} rowGap={20} y={30} textWrap>
                {...dev2_passes.map((s,i) => <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={dev2_passes_texts}
                    text={""}
                    fill={palette.text}
                    fontSize={35}
                />)}
            </Layout>
        </Line>
    </>);
    yield* all(dev2_passes_encloser().start(0, 0.8), dev2_passes_encloser().end(1, 0.8));
    yield* dev2_passes_title_ref().text("DEV2 Model", 1.2);
    yield* sequence(0.05,
        ...dev2_passes_texts.map((t, i) => t.text(dev2_passes[i], 0.8)),
    );

    yield* waitUntil("three_major_parts");
    yield* dev2_passes_encloser().x(-300, 0.8);
    const type_titles = createRefArray<Txt>();
    view.add(<>
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={type_titles}
            text={""}
            fill={palette.pastel_red}
            x={550} y={-250}
            fontSize={80}
        />
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={type_titles}
            text={""}
            fill={palette.pastel_green}
            x={550} y={0}
            fontSize={80}
        />
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={type_titles}
            text={""}
            fill={palette.pastel_pink}
            x={550} y={250}
            fontSize={80}
        />
    </>);
    yield* waitFor(2);
    yield* sequence(0.05,
        type_titles[0].text("SUBSTITUTION", 1.8),
        dev2_passes_texts[2].fill(palette.pastel_red, 0.8),
        dev2_passes_texts[4].fill(palette.pastel_red, 0.8),
    )
    yield* sequence(0.05,
        type_titles[1].text("REORDERING", 1.2),
        dev2_passes_texts[1].fill(palette.pastel_green, 0.8),
        dev2_passes_texts[3].fill(palette.pastel_green, 0.8),
    );
    yield* sequence(0.05,
        type_titles[2].text("POSITIONING", 1.2),
        dev2_passes_texts[0].fill(palette.pastel_pink, 0.8),
        dev2_passes_texts[5].fill(palette.pastel_pink, 0.8),
    );

    yield* waitFor(0.5);
    yield* sequence(0.1, dev2_passes_encloser().x(-1800, 1.2), all(
        ...type_titles.map(t => sequence(0.05,
            t.x(0, 0.8),
            t.fontSize(120, 0.8),
        )),
    ));
    
    yield* waitUntil("end");
});