import { Layout, Line, Rect, Txt, Video, makeScene2D } from "@motion-canvas/2d";
import { Color, Origin, Vector2, all, createRef, createRefArray, createSignal, linear, range, sequence, useRandom, waitFor, waitUntil } from "@motion-canvas/core";
import { offset_rainbow, palette, primary_glow_props, secondary_glow_props } from "../lib/palette";
import { TypedText } from "../lib/typing";
import { wiggle } from "../lib/utilities";

import libraries_vid from "../extern/LibShowMk2.mp4";

export default makeScene2D(function* (view) {
    
    const type_titles = createRefArray<Txt>();
    view.add(<>
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={type_titles}
            text={"SUBSTITUTION"}
            fill={palette.pastel_red}
            x={0} y={-250}
            fontSize={120}
        />
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={type_titles}
            text={"REORDERING"}
            fill={palette.pastel_green}
            x={0} y={0}
            fontSize={120}
        />
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={type_titles}
            text={"POSITIONING"}
            fill={palette.pastel_pink}
            x={0} y={250}
            fontSize={120}
        />
    </>);

    yield* waitUntil("00_substitution");
    yield* sequence(0.1,
        type_titles[0].y(0, 0.8).to(-400, 1.2),
        type_titles[0].fontSize(160, 0.8).to(120, 1.2),
        type_titles[2].y(type_titles[2].y() + 1000, 0.8),
        type_titles[1].y(type_titles[1].y() + 1000, 0.8),
    );

    const subs_codepoint_container = createRef<Rect>();
    const subs_codepoint_input_list = createRefArray<Txt>();
    const subs_example_input = "10->20";
    const subs_example_output = "10 ➜20";
    view.add(<>
        <Rect
            ref={subs_codepoint_container}
            layout direction={"row"}
            columnGap={20}
        >
            {...range(subs_example_input.length).map(i => <Txt
                fontFamily={"Jetbrains Mono"}
                ref={subs_codepoint_input_list}
                text={""}
                fill={palette.text}
                x={0} y={250}
                fontSize={100}
            />)}
        </Rect>
    </>);
    yield* sequence(0.05,
        ...subs_codepoint_input_list.map((c, i) => c.text(subs_example_input[i], 0.8)),
    );
    yield* sequence(0.05,
        ...subs_codepoint_input_list.map((c, i) => c.text(subs_example_output[i], 0.1)),
    );
    yield* waitUntil("normalisation");
    yield* subs_codepoint_container().x(-1400, 0.8);

    const pokemon_container = createRef<Rect>();
    const pokemon_codepoint_container = createRef<Rect>();
    const pokemon_input_list = createRefArray<Txt>();
    const pokemon_input_codepoint_list = createRefArray<Txt>();
    const pokemon_input_codepoint_components_list = createRefArray<Layout>();
    const pokemon_input_text_components_list = createRefArray<Layout>();
    const pokemon_string = "Pokémon";
    const acute_txt = createRef<Txt>();
    const angle_sig = createSignal(0);
    yield angle_sig(240, 120, linear);
    yield* waitFor(5);
    view.add(<>
        <Rect
            ref={pokemon_container}
            layout direction={"row"}
            x={-400}
            columnGap={20} justifyContent={"center"}
        >
            {...range(pokemon_string.length).map(i => <Rect
                ref={pokemon_codepoint_container}
                layout direction={"column"}
                rowGap={0} stroke={offset_rainbow(angle_sig)}
            >
                <Layout ref={pokemon_input_text_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={pokemon_input_list}
                        text={""}
                        fill={palette.text}
                        x={0}
                        fontSize={100}
                    />
                </Layout>
                <Layout ref={pokemon_input_codepoint_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={pokemon_input_codepoint_list}
                        text={" "}
                        fill={new Color(palette.text).darken(2)}
                        x={0}
                        fontSize={50}
                    />
                </Layout>
            </Rect>)}
        </Rect>
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={acute_txt}
            text={""}
            y={300}
            fill={new Color(palette.text).darken(2)}
            fontSize={50}
        />
    </>);
    yield* sequence(0.05,
        ...pokemon_input_list.map((c, i) => c.text(pokemon_string[i], 0.8)),
        ...pokemon_input_codepoint_list.map((c, i) => c.text(pokemon_string[i].codePointAt(0).toString(16), 0.8)),
    );
    
    yield* waitUntil("highlight_ee");
    yield* all(
        pokemon_input_list[3].fontSize(120, 0.8),
        pokemon_input_list[3].fill("yellow", 0.8),
    );
    yield* waitUntil("acute_inf");
    yield* acute_txt().text("Latin Small Letter E with Acute", 1.2).wait(2).back(0.4);

    yield* waitUntil("decomp_form");
    const decomposed = pokemon_container().clone();
    view.add(decomposed);
    yield* decomposed.x(400, 0.8);
    decomposed.childAs<Rect>(3).childAs<Layout>(0).add(<Txt
        fontFamily={"Jetbrains Mono"}
        text={""}
        fill={"yellow"}
        x={0} y={250}
        fontSize={120}
    />);
    decomposed.childAs<Rect>(3).childAs<Layout>(1).add(<Txt
        fontFamily={"Jetbrains Mono"}
        text={""}
        fill={new Color(palette.text).darken(2)}
        x={0}
        fontSize={50}
    />);
    yield* all(
        decomposed.childAs<Rect>(3).childAs<Layout>(0).childAs<Txt>(0).text("e", 0.2),
        decomposed.childAs<Rect>(3).childAs<Layout>(0).childAs<Txt>(1).text("◌́", 0.2),
        decomposed.childAs<Rect>(3).childAs<Layout>(1).childAs<Txt>(0).text("65", 0.2),
        decomposed.childAs<Rect>(3).childAs<Layout>(1).childAs<Txt>(1).text("301", 0.2),
    );
    yield* waitFor(1);
    yield* acute_txt().text("Latin Small Letter E + Combining Acute Accent", 1.2).wait(2).back(0.4);


    yield* waitUntil("grapheme_highlight");
    yield* sequence(0.05,
        ...pokemon_container().childrenAs<Rect>().map((t, i) => t.lineWidth(8, 0.5).wait(1.0).back(0.5)),
        ...decomposed.childrenAs<Rect>().map((t, i) => t.lineWidth(8, 0.5).wait(1.0).back(0.5)),
    );
    const grapheme_title = createRef<Txt>();
    view.add(<>
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={grapheme_title}
            text={""}
            y={300}
            fill={new Color(palette.text).darken(2)}
            fontSize={100}
        />
    </>);
    yield* grapheme_title().text("GRAPHEME", 1.2).wait(3).back(0.8);

    yield* waitUntil("graphemes_v_codepoints");

    const formA_list = createRef<Layout>();
    const formB_list = createRef<Layout>();
    view.add(<>
        <Layout layout direction={"column"} ref={formA_list} x={-400} y={250} height={175}>
            <Txt
                fontFamily={"Jetbrains Mono"}
                text={""}
                fill={palette.pastel_purple}
                fontSize={50}
            />
            <Txt
                fontFamily={"Jetbrains Mono"}
                text={""}
                fill={new Color(palette.pastel_purple).brighten()}
                fontSize={50}
            />
            <Txt
                fontFamily={"Jetbrains Mono"}
                text={""}
                fill={new Color(palette.pastel_purple).brighten(2)}
                fontSize={50}
            />
        </Layout>
        <Layout layout direction={"column"} ref={formB_list} x={400} y={250} height={175}>
            <Txt
                fontFamily={"Jetbrains Mono"}
                text={""}
                fill={palette.pastel_purple}
                fontSize={50}
            />
            <Txt
                fontFamily={"Jetbrains Mono"}
                text={""}
                fill={new Color(palette.pastel_purple).brighten()}
                fontSize={50}
            />
            <Txt
                fontFamily={"Jetbrains Mono"}
                text={""}
                fill={new Color(palette.pastel_purple).brighten(2)}
                fontSize={50}
            />
        </Layout>
    </>);

    yield* all(
        formA_list().childAs<Txt>(0).text("7 Graphemes", 0.8),
        formB_list().childAs<Txt>(0).text("7 Graphemes", 0.8),
    );
    yield* waitFor(1);
    yield* sequence(0.1,
        formA_list().childAs<Txt>(1).text("7 Codepoints", 0.8),
        formB_list().childAs<Txt>(1).text("8 Codepoints", 0.8),
    );
    yield* waitFor(4);
    yield* sequence(3,
        formA_list().childAs<Txt>(2).text("Composed Form", 0.8),
        formB_list().childAs<Txt>(2).text("Decomposed Form", 0.8),
    );

    yield* waitUntil("ligatures");
    yield* all(
        formA_list().x(-1800, 1.2),
        formB_list().x( 1800, 1.2),
        pokemon_container().x(-1800, 1.2),
        decomposed.x( 1800, 1.2),
    );

    const nolig_container = createRef<Rect>();
    const nolig_codepoint_container = createRef<Rect>();
    const nolig_input_text_components_list = createRefArray<Txt>();
    const nolig_input_codepoint_components_list = createRefArray<Txt>();
    const nolig_input_list = createRefArray<Txt>();
    const nolig_input_codepoint_list = createRefArray<Txt>();
    const nolig_string = "fi->ffi";

    
    const withlig_container = createRef<Rect>();
    const withlig_codepoint_container = createRef<Rect>();
    const withlig_input_text_components_list = createRefArray<Txt>();
    const withlig_input_codepoint_components_list = createRefArray<Txt>();
    const withlig_input_list = createRefArray<Txt>();
    const withlig_input_codepoint_list = createRefArray<Txt>();
    const withlig_string = "ﬁ→ﬃ";
    view.add(<>
        <Rect
            ref={nolig_container}
            layout direction={"row"}
            x={0}
            columnGap={20} justifyContent={"center"}
        >
            {...range(nolig_string.length).map(i => <Rect
                ref={nolig_codepoint_container}
                layout direction={"column"}
                rowGap={0} stroke={offset_rainbow(angle_sig)}
            >
                <Layout ref={nolig_input_text_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={nolig_input_list}
                        text={""}
                        fill={palette.text}
                        x={0}
                        fontSize={100}
                    />
                </Layout>
                <Layout ref={nolig_input_codepoint_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={nolig_input_codepoint_list}
                        text={" "}
                        fill={new Color(palette.text).darken(2)}
                        x={0}
                        fontSize={50}
                    />
                </Layout>
            </Rect>)}
        </Rect>

        <Rect
            ref={withlig_container}
            layout direction={"row"}
            x={0} y={200}
            columnGap={20} justifyContent={"center"}
        >
            {...range(withlig_string.length).map(i => <Rect
                ref={withlig_codepoint_container}
                layout direction={"column"}
                rowGap={0} stroke={offset_rainbow(angle_sig)}
            >
                <Layout ref={withlig_input_text_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={withlig_input_list}
                        text={""}
                        fill={palette.text}
                        x={0}
                        fontSize={100}
                    />
                </Layout>
                <Layout ref={withlig_input_codepoint_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={withlig_input_codepoint_list}
                        text={" "}
                        fill={new Color(palette.text).darken(2)}
                        x={0}
                        fontSize={50}
                    />
                </Layout>
            </Rect>)}
        </Rect>
    </>);
    yield* sequence(0.05,
        ...nolig_input_list.map((c, i) => c.text(nolig_string[i], 0.8)),
        ...nolig_input_codepoint_list.map((c, i) => c.text(nolig_string[i].codePointAt(0).toString(16), 0.8)),
    );

    yield* waitUntil("combine");
    yield* sequence(0.1,
        ...withlig_input_list.map((c, i) => c.text(withlig_string[i], 0.8)),
        ...withlig_input_codepoint_list.map((c, i) => c.text(withlig_string[i].codePointAt(0).toString(16), 0.8)),
    );
    
    yield* waitUntil("other_lang_ligatures");
    yield* all(withlig_container().x(-1800, 1.2), nolig_container().x(-1800, 1.2),);
    
    const dev_nolig_container = createRef<Rect>();
    const dev_nolig_codepoint_container = createRef<Rect>();
    const dev_nolig_input_text_components_list = createRefArray<Txt>();
    const dev_nolig_input_codepoint_components_list = createRefArray<Txt>();
    const dev_nolig_input_list = createRefArray<Txt>();
    const dev_nolig_input_codepoint_list = createRefArray<Txt>();
    const dev_nolig_string = "ध्र";
    const dev_withlig_container = createRef<Rect>();
    const dev_withlig_codepoint_container = createRef<Rect>();
    const dev_withlig_input_text_components_list = createRefArray<Txt>();
    const dev_withlig_input_codepoint_components_list = createRefArray<Txt>();
    const dev_withlig_input_list = createRefArray<Txt>();
    const dev_withlig_input_codepoint_list = createRefArray<Txt>();
    const dev_withlig_string = "ध्र";
    view.add(<>
        <Rect
            ref={dev_nolig_container}
            layout direction={"row"}
            x={0}
            columnGap={20} justifyContent={"center"}
        >
            {...range(dev_withlig_string.length).map(i => <Rect
                ref={dev_nolig_codepoint_container}
                layout direction={"column"}
                rowGap={0} stroke={offset_rainbow(angle_sig)}
            >
                <Layout ref={dev_nolig_input_text_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={dev_nolig_input_list}
                        text={""}
                        fill={palette.text}
                        x={0}
                        fontSize={100}
                    />
                </Layout>
                <Layout ref={dev_nolig_input_codepoint_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={dev_nolig_input_codepoint_list}
                        text={" "}
                        fill={new Color(palette.text).darken(2)}
                        x={0}
                        fontSize={50}
                    />
                </Layout>
            </Rect>)}
        </Rect>

        <Rect
            ref={dev_withlig_container}
            layout direction={"row"}
            x={0} y={200}
            columnGap={20} justifyContent={"center"}
        >
            <Rect
                ref={dev_withlig_codepoint_container}
                layout direction={"column"}
                rowGap={0} stroke={offset_rainbow(angle_sig)}
            >
                <Layout ref={dev_withlig_input_text_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={dev_withlig_input_list}
                        text={""}
                        fill={palette.text}
                        x={0}
                        fontSize={100}
                    />
                </Layout>
                <Layout ref={dev_withlig_input_codepoint_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={dev_withlig_input_codepoint_list}
                        text={" "}
                        fill={new Color(palette.text).darken(2)}
                        x={0}
                        fontSize={50}
                    />
                </Layout>
            </Rect>
        </Rect>
    </>);
    yield* sequence(0.05,
        ...dev_nolig_input_list.map((c, i) => c.text(dev_nolig_string[i], 0.8)),
        ...dev_nolig_input_codepoint_list.map((c, i) => c.text(dev_nolig_string[i].codePointAt(0).toString(16), 0.8)),
    );
    yield* sequence(0.05,
        ...dev_withlig_input_list.map((c, i) => c.text(dev_nolig_string, 0.8)),
        ...dev_withlig_input_codepoint_list.map((c, i) => c.text("--", 0.8)),
    );

    yield* waitUntil("contextual_subs");
    yield* all(dev_nolig_container().x(1800, 1.2), dev_withlig_container().x(1800, 1.2));

    const greek_noctx_container = createRef<Rect>();
    const greek_noctx_codepoint_container = createRefArray<Rect>();
    const greek_noctx_input_text_components_list = createRefArray<Txt>();
    const greek_noctx_input_codepoint_components_list = createRefArray<Txt>();
    const greek_noctx_input_list = createRefArray<Txt>();
    const greek_noctx_input_codepoint_list = createRefArray<Txt>();
    const greek_noctx_string = "Ὀδυσσεύσ";
    const greek_withctx_container = createRef<Rect>();
    const greek_withctx_codepoint_container = createRefArray<Rect>();
    const greek_withctx_input_text_components_list = createRefArray<Txt>();
    const greek_withctx_input_codepoint_components_list = createRefArray<Txt>();
    const greek_withctx_input_list = createRefArray<Txt>();
    const greek_withctx_input_codepoint_list = createRefArray<Txt>();
    const greek_withctx_string = "Ὀδυσσεύς";
    view.add(<>
        <Rect
            ref={greek_noctx_container}
            layout direction={"row"}
            x={0}
            columnGap={20} justifyContent={"center"}
        >
            {...range(greek_noctx_string.length).map(i => <Rect
                ref={greek_noctx_codepoint_container}
                layout direction={"column"}
                rowGap={0} stroke={offset_rainbow(angle_sig)}
            >
                <Layout ref={greek_noctx_input_text_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={greek_noctx_input_list}
                        text={""}
                        fill={palette.text}
                        x={0}
                        fontSize={100}
                    />
                </Layout>
                <Layout ref={greek_noctx_input_codepoint_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={greek_noctx_input_codepoint_list}
                        text={" "}
                        fill={new Color(palette.text).darken(2)}
                        x={0}
                        fontSize={50}
                    />
                </Layout>
            </Rect>)}
        </Rect>

        <Rect
            ref={greek_withctx_container}
            layout direction={"row"}
            x={0} y={200}
            columnGap={20} justifyContent={"center"}
        >
            {...range(greek_withctx_string.length).map(i => <Rect
                ref={greek_withctx_codepoint_container}
                layout direction={"column"}
                rowGap={0} stroke={offset_rainbow(angle_sig)}
            >
                <Layout ref={greek_withctx_input_text_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={greek_withctx_input_list}
                        text={""}
                        fill={palette.text}
                        x={0}
                        fontSize={100}
                    />
                </Layout>
                <Layout ref={greek_withctx_input_codepoint_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={greek_withctx_input_codepoint_list}
                        text={" "}
                        fill={new Color(palette.text).darken(2)}
                        x={0}
                        fontSize={50}
                    />
                </Layout>
            </Rect>)}
        </Rect>
    </>);
    yield* sequence(0.05,
        ...greek_noctx_input_list.map((c, i) => c.text(greek_noctx_string[i], 0.8)),
        ...greek_noctx_input_codepoint_list.map((c, i) => c.text(greek_noctx_string[i].codePointAt(0).toString(16), 0.8)),
    );
    yield* sequence(0.05,
        ...greek_withctx_input_list.map((c, i) => c.text(greek_withctx_string[i], 0.8)),
        ...greek_withctx_input_codepoint_list.map((c, i) => c.text(greek_withctx_string[i].codePointAt(0).toString(16), 0.8)),
    );
    yield* waitUntil("lowercase_sigma");
    yield* sequence(0.1,
        greek_noctx_codepoint_container[7].lineWidth(12, 0.8).wait(2).back(0.5),
        greek_withctx_codepoint_container[7].lineWidth(12, 0.8).wait(2).back(0.5),
    );

    yield* waitUntil("aesthetic_single_glyph");
    yield* all(
        greek_noctx_container().x(-1800, 1.2),
        greek_withctx_container().x( 1800, 1.2),
    );
    const singleglyph_container = createRef<Rect>();
    const singleglyph_codepoint_container = createRefArray<Rect>();
    const singleglyph_input_text_components_list = createRefArray<Txt>();
    const singleglyph_input_codepoint_components_list = createRefArray<Txt>();
    const singleglyph_input_list = createRefArray<Txt>();
    const singleglyph_input_codepoint_list = createRefArray<Txt>();
    const singleglyph_string = "& -> 🙰 🙱 🙵";
    view.add(<>
        <Rect
            ref={singleglyph_container}
            layout direction={"row"}
            x={0}
            columnGap={20} justifyContent={"center"}
        >
            <Rect
                ref={singleglyph_codepoint_container}
                layout direction={"column"}
                rowGap={0} stroke={offset_rainbow(angle_sig)}
            >
                <Layout ref={singleglyph_input_text_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={singleglyph_input_list}
                        text={""}
                        fill={palette.text}
                        x={0}
                        fontSize={100}
                    />
                </Layout>
                <Layout ref={singleglyph_input_codepoint_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={singleglyph_input_codepoint_list}
                        text={" "}
                        fill={new Color(palette.text).darken(2)}
                        x={0}
                        fontSize={50}
                    />
                </Layout>
            </Rect>
        </Rect>
    </>);

    yield* sequence(0.05,
        ...singleglyph_input_list.map((c, i) => c.text(singleglyph_string, 0.8)),
    );

    yield* waitUntil("reordering");
    yield* singleglyph_container().x(1800, 1.2);

    yield* sequence(0.1,
        type_titles[0].y(type_titles[0].y() - 1000, 0.8),
        type_titles[1].fontSize(160, 0.8).to(120, 0.8),
        type_titles[1].y(0, 0.8).to(-400, 0.8),
    );


    // ==============================

    const reordering_container = createRef<Rect>();
    const reordering_codepoint_container = createRefArray<Rect>();
    const reordering_input_text_components_list = createRefArray<Txt>();
    const reordering_input_codepoint_components_list = createRefArray<Txt>();
    const reordering_input_list = createRefArray<Txt>();
    const reordering_input_codepoint_list = createRefArray<Txt>();
    const reordering_string = "Reorder";

    const reordered_container = createRef<Rect>();
    const reordered_codepoint_container = createRefArray<Rect>();
    const reordered_input_text_components_list = createRefArray<Txt>();
    const reordered_input_codepoint_components_list = createRefArray<Txt>();
    const reordered_input_list = createRefArray<Txt>();
    const reordered_input_codepoint_list = createRefArray<Txt>();
    const reordered_string = "eRroedr";
    view.add(<>
        
        <Rect
            ref={reordering_container}
            layout direction={"row"}
            x={0} y={0}
            columnGap={20} justifyContent={"center"}
        >
            {...range(reordering_string.length).map(i => <Rect
                ref={reordering_codepoint_container}
                layout direction={"column"}
                rowGap={0} stroke={offset_rainbow(angle_sig)}
            >
                <Layout ref={reordering_input_text_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={reordering_input_list}
                        text={""}
                        fill={palette.text}
                        x={0}
                        fontSize={100}
                    />
                </Layout>
                <Layout ref={reordering_input_codepoint_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={reordering_input_codepoint_list}
                        text={" "}
                        fill={new Color(palette.text).darken(2)}
                        x={0}
                        fontSize={50}
                    />
                </Layout>
            </Rect>)}
        </Rect>

        
        <Rect
            ref={reordered_container}
            layout direction={"row"}
            x={0} y={200}
            columnGap={20} justifyContent={"center"}
        >
            {...range(reordered_string.length).map(i => <Rect
                ref={reordered_codepoint_container}
                layout direction={"column"}
                rowGap={0} stroke={offset_rainbow(angle_sig)}
            >
                <Layout ref={reordered_input_text_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={reordered_input_list}
                        text={""}
                        fill={palette.text}
                        x={0}
                        fontSize={100}
                    />
                </Layout>
                <Layout ref={reordered_input_codepoint_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={reordered_input_codepoint_list}
                        text={" "}
                        fill={new Color(palette.text).darken(2)}
                        x={0}
                        fontSize={50}
                    />
                </Layout>
            </Rect>)}
        </Rect>
    </>);

    yield* sequence(0.05,
        ...reordering_input_list.map((c, i) => c.text(reordering_string[i], 0.8)),
        ...reordering_input_codepoint_list.map((c, i) => c.text(reordering_string[i].codePointAt(0).toString(16), 0.8)),
    );
    yield* sequence(0.05,
        ...reordered_input_list.map((c, i) => c.text(reordered_string[i], 0.8)),
        ...reordered_input_codepoint_list.map((c, i) => c.text(reordered_string[i].codePointAt(0).toString(16), 0.8)),
    );

    yield* waitUntil("dev_example");
    yield* all(
        reordering_container().x(1800, 0.8),
        reordered_container().x(1800, 0.8),
    );

    const dev_in_container = createRef<Rect>();
    const dev_in_codepoint_container = createRefArray<Rect>();
    const dev_in_input_text_components_list = createRefArray<Txt>();
    const dev_in_input_codepoint_components_list = createRefArray<Txt>();
    const dev_in_input_list = createRefArray<Txt>();
    const dev_in_input_codepoint_list = createRefArray<Txt>();
    const dev_in_string = "   ";

    const dev_out_container = createRef<Rect>();
    const dev_out_codepoint_container = createRefArray<Rect>();
    const dev_out_input_text_components_list = createRefArray<Txt>();
    const dev_out_input_codepoint_components_list = createRefArray<Txt>();
    const dev_out_input_list = createRefArray<Txt>();
    const dev_out_input_codepoint_list = createRefArray<Txt>();
    const dev_out_string = " ";
    view.add(<>
        
        <Rect
            ref={dev_in_container}
            layout direction={"row"}
            x={0} y={0}
            columnGap={20} justifyContent={"center"}
        >
            {...range(dev_in_string.length).map(i => <Rect
                ref={dev_in_codepoint_container}
                layout direction={"column"}
                rowGap={0} stroke={offset_rainbow(angle_sig)}
            >
                <Layout ref={dev_in_input_text_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={dev_in_input_list}
                        text={""}
                        fill={palette.text}
                        x={0}
                        fontSize={100}
                    />
                </Layout>
                <Layout ref={dev_in_input_codepoint_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={dev_in_input_codepoint_list}
                        text={" "}
                        fill={new Color(palette.text).darken(2)}
                        x={0}
                        fontSize={50}
                    />
                </Layout>
            </Rect>)}
        </Rect>

        
        <Rect
            ref={dev_out_container}
            layout direction={"row"}
            x={0} y={250}
            columnGap={20} justifyContent={"center"}
        >
            {...range(dev_out_string.length).map(i => <Rect
                ref={dev_out_codepoint_container}
                layout direction={"column"}
                rowGap={0} stroke={offset_rainbow(angle_sig)}
            >
                <Layout ref={dev_out_input_text_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={dev_out_input_list}
                        text={""}
                        fill={palette.text}
                        x={0}
                        fontSize={100}
                    />
                </Layout>
                <Layout ref={dev_out_input_codepoint_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={dev_out_input_codepoint_list}
                        text={" "}
                        fill={new Color(palette.text).darken(2)}
                        x={0}
                        fontSize={50}
                    />
                </Layout>
            </Rect>)}
        </Rect>
    </>);
    yield* sequence(0.05,
        dev_in_input_list[2].text("इ", 0.8),
        dev_in_input_codepoint_list[2].text("इ".codePointAt(0).toString(16), 0.8),
    );
    yield* waitFor(1.5);
    
    yield* sequence(0.05,
        dev_in_input_list[0].text("क", 0.8),
        dev_in_input_list[1].text("+", 0.8),
        dev_in_input_codepoint_list[0].text("क".codePointAt(0).toString(16), 0.8),
        dev_in_input_codepoint_list[1].text("+".codePointAt(0).toString(16), 0.8),
    );
    yield* waitFor(1);
    
    yield* sequence(0.05,
        ...dev_in_input_list.map((c, i) => c.text("कि "[i], 0.3)),
        ...dev_in_input_codepoint_list.slice(0, -2).map((c, i) => c.text("कि"[i].codePointAt(0).toString(16), 0.3)),
        dev_in_input_codepoint_list[2].text("", 0.8),
    );
    yield* sequence(0.05,
        ...dev_out_input_list.map((c, i) => c.text("कि", 0.8)),
        ...dev_out_input_codepoint_list.map((c, i) => c.text("---", 0.8)),
    );

    yield* waitFor(4);
    yield* all(
        dev_out_input_list[0].fontSize(180, 0.5).back(0.5),
        dev_out_input_list[0].fill("yellow", 0.5).back(0.5)
    );

    yield* waitUntil("positioning");
    yield* all(
        dev_out_container().x(1800, 0.8),
        dev_in_container().x(-1800, 0.8),
    )
    yield* sequence(0.1,
        type_titles[1].y(type_titles[0].y() - 1000, 0.8),
        type_titles[2].fontSize(160, 0.8).to(120, 0.8),
        type_titles[2].y(0, 0.8).to(-400, 0.8),
    );

    const small_positioning_container = createRef<Rect>();
    const small_positioning_codepoint_container = createRefArray<Rect>();
    const small_positioning_input_text_components_list = createRefArray<Txt>();
    const small_positioning_input_codepoint_components_list = createRefArray<Txt>();
    const small_positioning_input_list = createRefArray<Txt>();
    const small_positioning_input_codepoint_list = createRefArray<Txt>();
    const small_positioning_string = "Tweaks";
    view.add(<>
        <Rect
            ref={small_positioning_container}
            x={0} y={0}
        >
            {...range(small_positioning_string.length).map(i => <Rect
                ref={small_positioning_codepoint_container}
                x={-175 + 60*i}
                layout direction={"column"}
                rowGap={0} stroke={offset_rainbow(angle_sig)}
            >
                <Layout ref={small_positioning_input_text_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={small_positioning_input_list}
                        text={""}
                        fill={palette.text}
                        x={0}
                        fontSize={100}
                    />
                </Layout>
            </Rect>)}
        </Rect>
    </>);
    yield* sequence(0.05,
        ...small_positioning_input_list.map((c, i) => c.text(small_positioning_string[i], 0.8)),
    );
    yield* waitFor(3);
    const myrand = useRandom();
    yield* sequence(0.1,
        ...small_positioning_codepoint_container.map((c, i) =>
            c.position(c.position().add(new Vector2([10, 0]).rotate(myrand.nextFloat(0, 360))), 0.8)),
    );
    
    yield* waitUntil("kerning");
    yield* small_positioning_container().x(-1800, 1.2);
    const kerning_container = createRef<Rect>();
    const kerning_codepoint_container = createRefArray<Rect>();
    const kerning_input_text_components_list = createRefArray<Txt>();
    const kerning_input_codepoint_components_list = createRefArray<Txt>();
    const kerning_input_list = createRefArray<Txt>();
    const kerning_input_codepoint_list = createRefArray<Txt>();
    const kerning_string = "AVALANCHE";
    view.add(<>
        <Rect
            ref={kerning_container}
            x={0} y={0}
        >
            {...range(kerning_string.length).map(i => <Rect
                ref={kerning_codepoint_container}
                x={-300 + 100*i}
                layout direction={"column"}
                rowGap={0} stroke={offset_rainbow(angle_sig)}
            >
                <Layout ref={kerning_input_text_components_list}
                    layout direction={"row"} columnGap={20} justifyContent={"center"}>
                    <Txt
                        fontFamily={"Jetbrains Mono"}
                        ref={kerning_input_list}
                        text={""}
                        fill={palette.text}
                        x={0}
                        fontSize={150}
                    />
                </Layout>
            </Rect>)}
        </Rect>
    </>);
    yield* sequence(0.05,
        ...kerning_input_list.map((c, i) => c.text(kerning_string[i], 0.8)),
    );
    yield* waitFor(2);
    yield* sequence(0.01,
        ...kerning_codepoint_container.map((t, i) => t.x(-300 + 80*i, 0.8)),
    );
    yield* waitFor(1.5);
    yield* sequence(0.01,
        ...kerning_codepoint_container.slice(1).map((t, i) => t.x(t.x() - 15, 0.8)),
    );
    yield* sequence(0.01,
        ...kerning_codepoint_container.slice(2).map((t, i) => t.x(t.x() - 15, 0.8)),
    );

    yield* waitUntil("cursive_fonts");
    yield* kerning_container().x(1800, 1.2);
    const my_txt = createRef<TypedText>();
    view.add(<TypedText
        fontFamily={"Cedarville Cursive"}
        ref={my_txt}
        fontSize={100}
        initial_text={""}
        hidden={false}
    />);
    yield* my_txt().type("Hello World!", 5);

    yield* waitUntil("directionality");
    yield* my_txt().x(-1800, 1.2);
 
    const eng_text_comps = createRef<Layout>();
    const eng_text = createRefArray<Txt>();
    const ara_text_comps = createRef<Layout>();
    const ara_text = createRefArray<Txt>();
    const jp_text_comps = createRef<Layout>();
    const jp_text = createRefArray<Txt>();
    view.add(<>
        <Layout ref={eng_text_comps} x={-450} layout direction={"row"} gap={40}>
            <Txt
                fontFamily={"Jetbrains Mono"}
                ref={eng_text}
                text={""}
                fill={palette.text}
                fontSize={60}
            />
            <Txt
                fontFamily={"Jetbrains Mono"}
                ref={eng_text}
                text={""}
                fill={new Color(palette.text).darken()}
                fontSize={60}
            />
            <Txt
                fontFamily={"Jetbrains Mono"}
                ref={eng_text}
                text={""}
                fill={palette.pastel_green}
                fontSize={50}
            />
        </Layout>
        
        <Layout ref={ara_text_comps} x={450} layout direction={"row"} gap={40}>
            <Txt
                fontFamily={"Jetbrains Mono"}
                ref={ara_text}
                text={""}
                fill={palette.pastel_green}
                fontSize={50}
            />
            <Txt
                fontFamily={"Jetbrains Mono"}
                ref={ara_text}
                text={""}
                fill={new Color(palette.text).darken()}
                fontSize={60}
            />
            <Txt
                fontFamily={"Jetbrains Mono"}
                ref={ara_text}
                text={""}
                fill={palette.text}
                fontSize={60}
            />
        </Layout>
        
        <Layout ref={jp_text_comps} y={150} layout direction={"column"} gap={10}>
            <Txt
                fontFamily={"Jetbrains Mono"}
                ref={jp_text}
                text={""}
                fill={palette.text}
                fontSize={60}
            />
            <Layout layout direction={"row"} justifyContent={"center"}>
                <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={jp_text}
                    text={""}
                    fill={new Color(palette.text).darken()}
                    fontSize={60}
                />
            </Layout>
            <Layout layout direction={"row"} justifyContent={"center"}>
                <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={jp_text}
                    text={""}
                    fill={palette.pastel_green}
                    fontSize={50}
                />
            </Layout>
        </Layout>
    </>);
    yield* waitFor(2);

    const eng_text_strs = [ "Latin", "->", "Left to Right\nTop to Bottom" ];
    yield* sequence(0.2, ...eng_text.map((t, i) => t.text(eng_text_strs[i], 0.8)));
    
    const ara_text_strs = [ "Arabic", "<-", "Right to Left\nTop to Bottom" ];
    yield* waitFor(2);
    yield* sequence(0.2, ...ara_text.reverse().map((t, i) => t.text(ara_text_strs[i], 0.8)));

    const jp_text_strs = [ "Hiragana/Katakana/Kanji", "↓", "Top to Bottom\nRight to Left" ];
    yield* waitFor(4);
    yield* all(
        eng_text_comps().y(eng_text_comps().y() - 150, 0.8),
        ara_text_comps().y(ara_text_comps().y() - 150, 0.8),
    )
    yield* sequence(0.2, ...jp_text.map((t, i) => t.text(jp_text_strs[i], 0.8)));

    yield* waitUntil("endofshapingops");
    yield* all(eng_text_comps().x(-1800, 1.2), ara_text_comps().x(1800, 1.2), jp_text_comps().y(1800, 1.2));
    yield* sequence(0.1,
        ...type_titles.reverse().map((t, i) => sequence(0.1,
            t.y(250 - i*250, 1.2),
            t.fontSize(120, 1.2),
        ))
    );
    yield* all(...type_titles.map(t => t.x(1800, 1.2)));

    //======
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

    angle_sig(0);
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
    yield* shaping_encloser().x(-2000, 0.0);

    yield* shaping_encloser().x(0, 0.8);
    yield* sequence(0.8,
        wiggle(shaping_engine().rotation, -5, 5, 1.2),
        wiggle(input_text_block().rotation, -5, 5, 1.2),
    );

    yield* waitFor(1);
    yield* sequence(0.05,
        ...shaping_output_texts.map((c, i) => c.fontSize(c.fontSize() - 10, 0.5)),
        ...shaping_output_texts.map((c, i) => c.text(shaping_output[i] + " @ [" + [0, (i*100).toString().padStart(3,"0")] + "]", 0.5)),
    );

    yield* waitUntil("libraries");
    yield* shaping_encloser().x(2000, 0.8);

    const libraries_show = createRef<Video>();
    view.add(<>
        <Video
            ref={libraries_show}
            src={libraries_vid}
            x={0} y={-1500}
            scale={0.5} padding={20}
            lineWidth={20} stroke={palette.primary}
            radius={5} opacity={0}
            playbackRate={2}
            {...primary_glow_props}
        />
    </>);
    libraries_show().play();
    yield* sequence(0.1,
        libraries_show().y(0, 0.8),
        libraries_show().scale(0.9, 0.8),
        libraries_show().opacity(1, 0.8),
    );

    yield* waitUntil("out");
    yield* sequence(0.1,
        libraries_show().opacity(0, 0.8),
        libraries_show().scale(0.5, 0.8),
        libraries_show().y(1500, 0.8),
    );

        
    yield* waitUntil("end");
});