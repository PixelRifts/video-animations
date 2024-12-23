import { Layout, Line, Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import { Origin, all, createRef, createRefArray, createSignal, linear, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { palette, primary_glow_props, secondary_glow_props } from "../lib/palette";
import { wiggle } from "../lib/utilities";


export default makeScene2D(function* (view) {
    const input_text_block = createRef<Rect>();
    const shaping_input_texts = createRefArray<Txt>();
    const shaping_engine = createRef<Rect>();
    const shaping_engine_txt = createRef<Txt>();
    const output_text_block = createRef<Rect>();
    const shaping_output_texts = createRefArray<Txt>();
    const shaping_output_text_copies = createRefArray<Txt>();
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
    yield* all(shaping_encloser().end(1, 0.0), shaping_encloser().start(0, 0.0));
    yield* all(
        input_text_block().size([300, 500], 0.0),
        input_text_block().lineWidth(12, 0.0),
    );

    yield* all(
        ...shaping_input_texts.map((c, i) => c.text("0x"+shaping_input[i].codePointAt(0).toString(16), 0.0)),
        shaping_engine().end(1, 0.0),
        process_line_a().end(1, 0.0),
    );
    yield* all(
        output_text_block().size([300, 500], 0.0),
        output_text_block().lineWidth(12, 0.0),
        process_line_b().end(1, 0.0),
    );
    yield* all(
        ...shaping_output_texts.map((c, i) => c.text(shaping_output[i], 0.0)),
    )
    yield* shaping_title_ref().text("Text Shaping", 0.0);
    yield* shaping_engine_txt().text("Shaping\nEngine", 0.0);

    yield* all(
        shaping_engine_txt().y(-150, 0.0),
        shaping_engine_txt().text("Shaping", 0.0).to("Shaping Engine", 0.0),
        shaping_engine().size([400, 400], 0.0),
    );
    const minimized_shaping_pass_txt = createRefArray<Txt>();
    shaping_engine().add(<Layout layout direction={"column"} y={30}>
        {...range(4).map(i => <Txt
            fontFamily={"Jetbrains Mono"}
            ref={minimized_shaping_pass_txt}
            text={"Pass " + i}
            fill={palette.text}
            fontSize={40}
        />)}
    </Layout>);
    yield* shaping_encloser().x(2000, 0.0);
    yield* all(
        ...shaping_output_texts.map((c, i) => c.fontSize(c.fontSize() - 10, 0.0)),
        ...shaping_output_texts.map((c, i) => c.text(shaping_output[i] + " @ [" + [0, (i*100).toString().padStart(3,"0")] + "]", 0.0)),
    );

    yield* shaping_encloser().x(0, 0.8);

    yield* waitFor(1);
    output_text_block().remove();
    view.add(output_text_block());
    yield* all(
        output_text_block().x(0, 0.8).to(-500, 0.8),
        output_text_block().scale(1.4, 0.8).to(1, 0.8),
        shaping_encloser().x(-2000, 0.8)
    );

    const fbo_title_ref = createRef<Txt>();
    const fbo_encloser = createRef<Line>();
    const fbo_canvas = createRef<Rect>();
    view.add(<>
        <Line
            ref={fbo_encloser}
            lineWidth={6} x={1800} y={0}
            stroke={palette.primary}
            points={[
                [ 0, 425 ],
                [ 425*0.9, 425 ],
                [ 425*0.9, -345 ],
                [ 275, -345 ],
                [ 220, -425 ],
                [ -220, -425 ],
                [ -275, -345 ],
                [ -425*0.9, -345 ],
                [ -425*0.9, 425 ],
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
                size={[700, 700]}
                y={40}
                fill={"#111111"}
            />
        </Line>
    </>);
    yield* fbo_encloser().x(325, 1.2);

    const copies = output_text_block().childrenAs<Layout>().map(c => c.clone().opacity(0.5).absolutePosition(c.absolutePosition().sub([1920/2, 1080/2])));
    view.add(<>
        {...copies}
    </>);
    yield* sequence(0.1,
        ...copies.map((c, i) => all(
            c.childAs<Txt>(0).text(c.childAs<Txt>(0).text().charAt(0), 0.5),
            c.opacity(1, 0.2),
            c.childAs<Txt>(0).fontSize(50, 0.5),
            c.position([325, 0+i*60], 0.8),
        ))
    );
    yield* waitFor(2);
    yield* all(
        output_text_block().x(-1800, 1.2),
        all(
            fbo_encloser().x(0, 0.8),
            fbo_encloser().scale(1.0, 0.8),
            ...copies.map((c, i) => all(c.position([0, 0+i*60], 0.8),)),
        ),
    );

    yield* waitUntil("feature_creep");
    yield* all(
        all(
            fbo_encloser().x(-1800, 0.8),
            fbo_encloser().scale(1.0, 0.8),
            ...copies.map((c, i) => all(c.position([-1800, 0+i*60], 0.8),)),
        ),
    );
    
    yield* waitUntil("end");
});