import { Layout, Line, Node, Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import { all, chain, createRef, createRefArray, createSignal, debug, linear, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { offset_rainbow, palette, primary_glow_props } from "../lib/palette";
import { flash, wiggle } from "../lib/utilities";


export default makeScene2D(function* (view) {
    
    const center_pack = createRef<Node>();
    const string_title = createRef<Txt>();
    const center_line = createRef<Line>();
    const divider_lines = createRefArray<Line>();
    view.add(<Node ref={center_pack}>
        <Line
            ref={center_line}
            points={[
                [0, -220],
                [-220, -220],
                [-220,  220],
                [ 220,  220],
                [ 220, -220],
                [0, -220],
            ]}
            closed radius={10}
            end={0}
            lineWidth={50} stroke={palette.primary}
        />
        <Line
            ref={divider_lines}
            points={[
                [0, -220],
                [0, -1000],
            ]}
            end={0}
            lineWidth={50} stroke={palette.primary}
        />
        <Line
            ref={divider_lines}
            points={[
                [0, 220],
                [0, 1000],
            ]}
            end={0}
            lineWidth={50} stroke={palette.primary}
        />
    </Node>);
    center_line().add(
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={string_title}
            text={""}
            fill={palette.text}
            x={0} y={0}
            fontSize={100}
        />);
    yield* waitUntil("full_strings");
    yield* string_title().text("String", 0.8);
    yield* waitFor(1);
    yield center_line().end(1, 1, linear);
    yield* waitFor(0.5);
    yield divider_lines[1].end(1, 0.4);
    yield* waitFor(0.5);
    yield divider_lines[0].end(1, 0.4);

    yield* waitUntil("ascii_drop");
    yield* center_pack().x(2000, 1);
    const ascii_title = createRef<Node>();
    const ascii = createRef<Txt>();
    view.add(<Node ref={ascii_title}>
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={ascii}
            text={""}
            fill={palette.text}
            x={0} y={0}
            fontSize={120}
        />
    </Node>);
    yield* ascii().text("ASCII", 0.8);
    
    yield* waitUntil("ascii_standard");
    yield* ascii_title().x(-500, 0.8);
    const chars_parent = createRefArray<Node>();
    const chars = createRefArray<Txt>();
    const chars_extended = createRefArray<Txt>();
    const special_sym_names = [
        "ACKNOWLEDGE",
        "BELL",
        "BACKSPACE",
        "HORIZ. TAB",
        "LINE FEED",
        "VERTI. TAB",
        "FORM FEED",
        "CARRI. FEED",
        "SHIFT OUT",
        "SHIFT IN",
        "⋮",
    ];
    const extended_lines = [
        "À",
        "Á",
        "Â",
        "Ã",
        "Ä",
        "Å",
        "Æ",
        "Ç",
        "È",
        "É",
        "Ê",
        "Ë",
        "Ì",
        "Í",
        "Î",
        "Ï",
        "Ð",
        "Ñ",
        "Ò",
        "Ó",
        "Ô",
        "Õ",
        "Ö",
        "×",
        "Ø",
        "Ù",
        "Ú",
        "Û",
        "Ü",
        "Ý",
        "Þ",
    ]
    view.add(<Node ref={chars_parent} y={-250}>
        {...range(10).map((t, i) => <Txt
            fontFamily={"Jetbrains Mono"}
            ref={chars}
            text={""}
            fill={palette.primary}
            x={0} y={i * 50}
            fontSize={35}
        />)}
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={chars}
            text={""}
            fill={palette.primary}
            x={0} y={10 * 50}
            fontSize={35}
        />
        {...range(10).map((t, i) => <Txt
            fontFamily={"Jetbrains Mono"}
            ref={chars}
            text={""}
            fill={palette.primary}
            x={265} y={i * 50}
            fontSize={35}
        />)}
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={chars}
            text={""}
            fill={palette.primary}
            x={265} y={10 * 50}
            fontSize={35}
        />
        {...range(10).map((t, i) => <Txt
            fontFamily={"Jetbrains Mono"}
            ref={chars}
            text={""}
            fill={palette.primary} width={100}
            x={500} y={i * 50}
            fontSize={35}
        />)}
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={chars}
            text={""}
            fill={palette.primary}
            x={600} y={10 * 50}
            fontSize={35}
        />
        
        {...range(10).map((t, i) => <Txt
            fontFamily={"Jetbrains Mono"}
            ref={chars_extended}
            text={""}
            fill={palette.primary}
            x={0} y={(11 + i) * 50}
            fontSize={35}
        />)}
        {...range(10).map((t, i) => <Txt
            fontFamily={"Jetbrains Mono"}
            ref={chars_extended}
            text={""}
            fill={palette.primary}
            x={265} y={(11 + i) * 50}
            fontSize={35}
        />)}
        {...range(10).map((t, i) => <Txt
            fontFamily={"Jetbrains Mono"}
            ref={chars_extended}
            text={""}
            fill={palette.primary}
            x={600} y={(11 + i) * 50}
            fontSize={35}
        />)}
        
    </Node>);
    yield* waitUntil("show_chars");
    yield* sequence(0.05,
        ...chars.slice(0, 10).map((t, i) => t.text(String.fromCharCode(65+i), 0.8)),
        chars[10].text("⋮", 0.8),
    );
    yield* waitFor(0.5);
    yield* sequence(0.05,
        ...chars.slice(11, 21).map((t, i) => t.text(String.fromCharCode(34+i), 0.8)),
        chars[21].text("⋮", 0.8),
    );
    yield* waitFor(0.5);
    yield* sequence(0.05,
        ...chars.slice(22, 32).map((t, i) => t.text(special_sym_names[i], 0.8)),
        chars[32].text("⋮", 0.8),
    );

    yield* waitUntil("show_mapped_nums");
    yield* sequence(0.01,
        ...chars.slice(0, 10).map((t, i) => t.text(t.text() + " = " + t.text().charCodeAt(0), 0.8)),
        ...chars.slice(11, 21).map((t, i) => t.text(t.text() + " = " + t.text().charCodeAt(0), 0.8)),
        ...chars.slice(22, 32).map((t, i) => t.text(t.text() + " = " + (6+i), 0.8)),
    );
    
    yield* waitUntil("seven_bits");
    const seven_bits = createRef<Txt>();
    ascii_title().add(<Txt
        fontFamily={"Jetbrains Mono"}
        ref={seven_bits}
        text={""}
        fill={palette.secondary}
        y={85}
        fontSize={40}
    />)
    yield* seven_bits().text("[0, 127]", 0.8);
    yield* waitFor(3);
    yield* seven_bits().text("7 bits", 0.8);


    yield* waitUntil("eight_bits");
    yield* chain(
        chars_parent().y(-500, 0.5),
        sequence(0.01,
            ...chars_extended.map((t, i) => t.text(extended_lines[i] + " = " + (192+i), 0.8)),
        )
    );
    yield* seven_bits().text("", 0.8).to("8 bits", 0.8);
    yield* all(
        ascii().text("Extended\nASCII", 0.8),
        seven_bits().y(180, 0.8),
        seven_bits().fontSize(50, 0.8),
    );
    const disclaimer = createRef<Txt>();
    ascii_title().add(<Txt
        fontFamily={"Jetbrains Mono"}
        ref={disclaimer}
        text={""}
        fill={"#CA2323"}
        y={-175}
        fontSize={40}
    />);
    yield* disclaimer().text("* Not ANSI Approved", 1.0).wait(1).to("", 0.5);

    yield* waitUntil("ascii_strings");
    yield* chars_parent().x(2000, 0.5);
    const ascii_str = createRef<Layout>();
    const ascii_str_bytes = createRefArray<Txt>();
    const ascii_str_chars = createRefArray<Txt>();
    const ascii_string_val = "Hello !?";
    view.add(<Layout ref={ascii_str} x={300}  layout direction={"row"}>
        <Layout  layout direction={"column"}>
            {...range(ascii_string_val.length).map(i => <Txt
                fontFamily={"Jetbrains Mono"}
                ref={ascii_str_bytes}
                text={""}
                fill={palette.text}
                fontSize={50}
            />)}
        </Layout>
        <Layout  layout direction={"column"}>
            {...range(ascii_string_val.length).map(i => <Txt
                fontFamily={"Jetbrains Mono"}
                ref={ascii_str_chars}
                text={""}
                fill={palette.text}
                fontSize={50}
            />)}
        </Layout>
    </Layout>);
    yield* sequence(0.05,
        ...ascii_str_bytes.map((t, i) => t.text(ascii_string_val[i].charCodeAt(0).toString(2).padStart(8, "0"), 0.5)),
    );

    yield* waitFor(2);
    yield* sequence(0.05,
        ...ascii_str_chars.map((t, i) => t.text(" -> " + ascii_string_val[i], 0.5)),
    );


    yield* waitUntil("the_problem");
    yield* ascii_str().x(ascii_str().x() + 1200, 1.0);

    yield* waitUntil("other_languages");
    const langchars_parent = createRef<Layout>();
    const mychars = createRef<Layout>();
    const otherlang = createRef<Layout>();
    const mychar_txts = createRefArray<Txt>();
    const otherlang_txts = createRefArray<Txt>();
    const mychar_txt_vals = [
        "%",
        "$",
        "\"",
        "6",
        "@",
        " ",
        "A",
        "a",
        "\\",
        "...",
    ];
    const otherlang_txt_vals = [
        createSignal("ऐ"),
        createSignal("७"),
        createSignal("ا"),
        createSignal("ظ"),
        createSignal("私"),
        createSignal("そ"),
        createSignal("カ"),
        createSignal("॥"),
        createSignal("ञ"),
    ];
    view.add(<Layout ref={langchars_parent} layout x={300} columnGap={150}>
        <Layout ref={mychars} layout direction={"column"}>
            {...mychar_txt_vals.map((c,i) => <Txt
                fontFamily={"Jetbrains Mono"}
                ref={mychar_txts}
                text={""}
                fill={palette.text}
                fontSize={80}
            />)}
        </Layout>
        <Layout ref={otherlang} layout direction={"column"}>
            {...otherlang_txt_vals.map((c,i) => <Txt
                fontFamily={"Jetbrains Mono"}
                ref={otherlang_txts}
                text={""}
                fill={palette.text}
                fontSize={80}
            />)}
        </Layout>
    </Layout>);
    yield* sequence(0.05,
        ...mychar_txts.map((c, i) => c.text(mychar_txt_vals[i], 0.8)),
    );

    yield* waitFor(4);
    yield* sequence(0.05,
        ...otherlang_txts.map((c, i) => c.text(otherlang_txt_vals[i], 0.8)),
    );

    yield* waitUntil("segue_to_unicode");
    yield* langchars_parent().y(-2000, 0.8);
    yield* sequence(0.1,
        center_pack().x(0, 1.2),
        seven_bits().scale(1.0, 0.8),
        seven_bits().x(seven_bits().x()-100, 0.8),
        ascii().scale(0.8, 0.8),
        ascii().x(ascii().x()-100, 0.8),
    );

    yield* all(
        center_pack().x(center_pack().x() - 1800, 1.2),
        seven_bits().x(seven_bits().x() - 1800, 1.2),
        ascii().x(ascii().x() - 1800, 1.2),
    );

    yield* waitUntil("unicode_title_drop");
    const unicode_title = createRef<Node>();
    const unicode = createRef<Txt>();
    view.add(<Node ref={unicode_title}>
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={unicode}
            text={""}
            fill={palette.text}
            x={0} y={0}
            fontSize={100}
        />
    </Node>);
    yield* unicode().text("Unicode", 0.8);
    
    yield* waitUntil("unicode_standard");
    otherlang_txts.splice(0, otherlang_txts.length)
    yield* unicode_title().x(500, 0.8);
    const mapped_codepoints = createRefArray<Txt>();
    view.add(<Layout ref={langchars_parent} layout x={-300} columnGap={20}>
        <Layout ref={otherlang} layout direction={"column"}>
            {...otherlang_txt_vals.map((c,i) => <Txt
                fontFamily={"Jetbrains Mono"}
                ref={otherlang_txts}
                text={""}
                fill={palette.text}
                fontSize={60}
            />)}
        </Layout>
        <Layout ref={otherlang} layout direction={"column"}>
            {...otherlang_txt_vals.map((c,i) => <Txt
                fontFamily={"Jetbrains Mono"}
                ref={mapped_codepoints}
                text={""}
                fill={palette.text}
                fontSize={60}
            />)}
        </Layout>
    </Layout>);
    yield* sequence(0.05,
        ...otherlang_txts.map((c, i) => c.text(() => otherlang_txt_vals[i](), 0.8)),
        ...mapped_codepoints.map((c, i) => c.text(() => " -> " + otherlang_txt_vals[i]().codePointAt(0).toString(), 0.8)),
    );
    yield* waitUntil("codepoint_drop");
    const codepoint_txt = createRef<Txt>();
    view.add(<>
        <Txt
            ref={codepoint_txt}
            text={""}
            fill={palette.secondary}
            x={-250} y={-390}
            width={100}
            fontSize={60}
        />
    </>);
    yield* sequence(0.05,
        codepoint_txt().text("Codepoint", 0.8),
        ...mapped_codepoints.map(t => chain(
            t.fill(palette.secondary, 0.5),
            t.fill(palette.text, 0.5),
        )),
    );

    yield* waitUntil("other_codepoints");
    yield* sequence(0.2,
        otherlang_txt_vals[0](" ", 0.2).to("😊", 0.2),
        otherlang_txt_vals[1](" ", 0.2).to("👹", 0.2),
        waitFor(0.2),
        waitFor(0.2),
        otherlang_txt_vals[2](" ", 0.2).to("ि", 0.2),
        otherlang_txt_vals[3](" ", 0.2).to("◌́", 0.2),
        otherlang_txt_vals[4](" ", 0.2).to("ः", 0.2),
        waitFor(0.2),
        waitFor(0.2),
        otherlang_txt_vals[5](" ", 0.2).to("▰", 0.2),
        otherlang_txt_vals[6](" ", 0.2).to("◇", 0.2),
        otherlang_txt_vals[7](" ", 0.2).to("▩", 0.2),
        otherlang_txt_vals[8](" ", 0.2).to("◝", 0.2),
    );

    yield* waitUntil("unicode_range");
    const unicode_bits = createRef<Txt>();
    unicode_title().add(<Txt
        fontFamily={"Jetbrains Mono"}
        ref={unicode_bits}
        text={""}
        fill={palette.secondary}
        y={85}
        fontSize={40}
    />)
    yield* unicode_bits().text("[0x0, 0x10FFFF]", 0.8);
    yield* waitFor(3);
    yield* unicode_bits().text("[0, 1114111]", 0.8);
    yield* waitFor(3);
    yield* unicode_bits().text("21 bits", 0.8).wait(0.5).to("32 bits", 0.8);

    yield* waitUntil("follow_ascii_logic");
    yield* all(
        codepoint_txt().x(codepoint_txt().x() - 1000, 0.8),
        langchars_parent().x(langchars_parent().x() - 1000, 0.8),
    )

    const unicode_str1 = createRef<Layout>();
    const unicode_str1_bytes = createRefArray<Txt>();
    const unicode_str1_chars = createRefArray<Txt>();
    const unicode_string_val_1 = "こんにちわ";
    view.add(<Layout ref={unicode_str1} x={-300}  layout direction={"row"}>
        <Layout  layout direction={"column"}>
            {...range(unicode_string_val_1.length).map(i => <Txt
                fontFamily={"Jetbrains Mono"}
                ref={unicode_str1_bytes}
                text={""}
                fill={palette.text}
                fontSize={45}
            />)}
        </Layout>
        <Layout  layout direction={"column"}>
            {...range(unicode_string_val_1.length).map(i => <Txt
                fontFamily={"Jetbrains Mono"}
                ref={unicode_str1_chars}
                text={""}
                fill={palette.text}
                fontSize={45}
            />)}
        </Layout>
    </Layout>);
    yield* sequence(0.05,
        ...unicode_str1_bytes.map((t, i) => t.text(unicode_string_val_1[i].charCodeAt(0).toString(2).padStart(32, "0"), 0.5)),
    );

    yield* waitFor(8);
    yield* sequence(0.05,
        ...unicode_str1_chars.map((t, i) => t.text(" -> " + unicode_string_val_1[i], 0.5)),
    );

    yield* waitUntil("but_hello_world");

    yield* sequence(0.05,
        ...unicode_str1_bytes.map((t, i) => t.text("", 0.5)),
        ...unicode_str1_chars.map((t, i) => t.text("", 0.5)),
    );
    
    const unicode_str2 = createRef<Layout>();
    const utf32_wasted_rect = createRef<Rect>();
    const utf32_used_rect = createRef<Rect>();
    const unicode_str2_bytes = createRefArray<Txt>();
    const unicode_str2_chars = createRefArray<Txt>();
    const unicode_string_val_2 = "Hello World";
    const angle_sig = createSignal(0);
    view.add(<Layout ref={unicode_str2} x={-300}  layout direction={"row"}>
        <Rect ref={utf32_wasted_rect} stroke={offset_rainbow(angle_sig)} layout direction={"column"}>
            {...range(unicode_string_val_2.length).map(i => <Txt
                fontFamily={"Jetbrains Mono"}
                ref={unicode_str2_bytes}
                text={""}
                fill={palette.text}
                fontSize={45}
            />)}
        </Rect>
        <Rect ref={utf32_used_rect} stroke={offset_rainbow(angle_sig)} layout direction={"column"}>
            {...range(unicode_string_val_2.length).map(i => <Txt
                fontFamily={"Jetbrains Mono"}
                ref={unicode_str2_bytes}
                text={""}
                fill={palette.text}
                fontSize={45}
            />)}
        </Rect>
        <Layout  layout direction={"column"}>
            {...range(unicode_string_val_2.length).map(i => <Txt
                fontFamily={"Jetbrains Mono"}
                ref={unicode_str2_chars}
                text={""}
                fill={palette.text}
                fontSize={45}
            />)}
        </Layout>
    </Layout>);


    yield* sequence(0.05,
        ...unicode_str2_bytes.slice(0, unicode_string_val_2.length).map((t, i) => t.text("0".repeat(24), 0.5)),
        ...unicode_str2_bytes.slice(unicode_string_val_2.length, unicode_string_val_2.length*2).map((t, i) => t.text(unicode_string_val_2[i].charCodeAt(0).toString(2).padStart(8, "0"), 0.5)),
    );

    yield* waitFor(1);
    yield* sequence(0.05,
        ...unicode_str2_chars.map((t, i) => t.text(" -> " + unicode_string_val_2[i], 0.5)),
    );

    yield* waitUntil("wasted_space");
    yield angle_sig(40, 20, linear);
    yield* utf32_wasted_rect().lineWidth(10, 0.5).wait(2).to(0, 0.5);
    yield* waitUntil("single_byte");
    yield* utf32_used_rect().lineWidth(10, 0.5).wait(2).to(0, 0.5);

    yield* waitUntil("utf32_drop");
    const utf32_title = createRef<Txt>();
    const utf32_encloser = createRef<Line>();
    view.add(<>
        <Line
            ref={utf32_encloser}
            lineWidth={6}
            stroke={palette.primary}
            points={[
                [ 0, 425 ],
                [ 425*1.25, 425 ],
                [ 425*1.25, -345 ],
                [ 275*1.25, -345 ],
                [ 220*1.25, -425 ],
                [ -220*1.25, -425 ],
                [ -275*1.25, -345 ],
                [ -425*1.25, -345 ],
                [ -425*1.25, 425 ],
                [ 0, 425 ],
            ]}
            closed zIndex={-5} x={-275} y={-40}
            start={0.5} end={0.5}
            fill={palette.foreground}
            {...primary_glow_props}
        />
    </>);
    utf32_encloser().add(<Txt
        fontFamily={"Jetbrains Mono"}
        ref={utf32_title}
        text={""}
        fill={palette.text}
        x={0} y={-380}
        fontSize={80}
    />);
    yield* utf32_title().text("UTF-32", 0.8);
    yield* all(utf32_encloser().start(0, 0.5), utf32_encloser().end(1, 0.5));
    yield* waitFor(2);
    yield* all(
        utf32_encloser().y(utf32_encloser().y() - 1200, 0.8),
        unicode_str2().y(unicode_str2().y() - 1200, 0.8),
    );

    yield* waitUntil("utf8_drop")
    const utf8_title = createRef<Txt>();
    const utf8_encloser = createRef<Line>();
    view.add(<>
        <Line
            ref={utf8_encloser}
            lineWidth={6}
            stroke={palette.primary}
            points={[
                [ 0, 425 ],
                [ 425*0.85, 425 ],
                [ 425*0.85, -345 ],
                [ 275*0.85, -345 ],
                [ 220*0.85, -425 ],
                [ -220*0.85, -425 ],
                [ -275*0.85, -345 ],
                [ -425*0.85, -345 ],
                [ -425*0.85, 425 ],
                [ 0, 425 ],
            ]}
            closed zIndex={-5} x={-275} y={-40}
            start={0.5} end={0.5}
            fill={palette.foreground}
            {...primary_glow_props}
        />
    </>);
    utf8_encloser().add(<Txt
        fontFamily={"Jetbrains Mono"}
        ref={utf8_title}
        text={""}
        fill={palette.text}
        x={0} y={-380}
        fontSize={80}
    />);
    yield* utf8_title().text("UTF-8", 0.8);

    const utf8_codepoints = createRef<Layout>();
    const utf8_codepoint_txts_0 = createRefArray<Txt>();
    const utf8_codepoint_txts_1 = createRefArray<Txt>();
    const utf8_codepoint_txts_2 = [createRefArray<Txt>(),createRefArray<Txt>(),createRefArray<Txt>(),createRefArray<Txt>()];
    const utf8_codepoint_vals = [0x64, 0x7AA, 0x812, 0x11234];
    const utf8_encoded_vals =   [0x64, 0xDEAA, 0xe0a092, 0xf09188b4];
    utf8_encloser().add(<Layout ref={utf8_codepoints} layout direction={"row"} y={80} columnGap={20}>
        <Layout layout direction={"column"} rowGap={50}>
            {...range(utf8_codepoint_vals.length).map(i => <Txt
                fontFamily={"Jetbrains Mono"}
                ref={utf8_codepoint_txts_0}
                text={""}
                fill={palette.text}
                fontSize={60}
            />)}
        </Layout>
        <Layout layout direction={"column"} rowGap={50}>
            {...range(utf8_codepoint_vals.length).map(i => <Layout layout direction={"row"} columnGap={20}>
                <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={utf8_codepoint_txts_1}
                    text={""}
                    fill={palette.text}
                    fontSize={60}
                />
                <Layout layout direction={"row"}>
                    {...range((i+1) * 8).map(j => <Layout layout direction={"column"} justifyContent={"center"}>
                        <Txt
                            fontFamily={"Jetbrains Mono"}
                            ref={utf8_codepoint_txts_2[i]}
                            text={""}
                            fill={palette.text}
                            fontSize={40}
                        />
                    </Layout>)}
                </Layout>
            </Layout>)}
        </Layout>
    </Layout>);

    yield* waitUntil("sequence");
    yield* sequence(0.5,
        ...range(4).map(i => sequence(0.05,
            utf8_codepoint_txts_0[i].text(String.fromCodePoint(utf8_codepoint_vals[i]), 0.5),
            utf8_codepoint_txts_1[i].text("->", 0.5),
            ...utf8_codepoint_txts_2[i].map((t,j) => 
                t.text(utf8_encoded_vals[i].toString(2).padStart((i+1)*8, "0").charAt(j), 0.1)
            ),
        ))
    );

    yield* waitUntil("leading_ones");
    yield* sequence(0.05,
        all(
            flash(utf8_codepoint_txts_2[0][0].fill, "yellow", 6.0),
            wiggle(utf8_codepoint_txts_2[0][0].rotation, 20, -20, 1.0),
        ),
        
        all(
            flash(utf8_codepoint_txts_2[1][0].fill, "yellow", 6.0),
            wiggle(utf8_codepoint_txts_2[1][0].rotation, 20, -20, 1.0),
        ),
        all(
            flash(utf8_codepoint_txts_2[1][1].fill, "yellow", 6.0),
            wiggle(utf8_codepoint_txts_2[1][1].rotation, 20, -20, 1.0),
        ),
        all(
            flash(utf8_codepoint_txts_2[1][2].fill, "yellow", 6.0),
            wiggle(utf8_codepoint_txts_2[1][2].rotation, 20, -20, 1.0),
        ),


        
        all(
            flash(utf8_codepoint_txts_2[2][0].fill, "yellow", 6.0),
            wiggle(utf8_codepoint_txts_2[2][0].rotation, 20, -20, 1.0),
        ),
        all(
            flash(utf8_codepoint_txts_2[2][1].fill, "yellow", 6.0),
            wiggle(utf8_codepoint_txts_2[2][1].rotation, 20, -20, 1.0),
        ),
        all(
            flash(utf8_codepoint_txts_2[2][2].fill, "yellow", 6.0),
            wiggle(utf8_codepoint_txts_2[2][2].rotation, 20, -20, 1.0),
        ),
        all(
            flash(utf8_codepoint_txts_2[2][3].fill, "yellow", 6.0),
            wiggle(utf8_codepoint_txts_2[2][3].rotation, 20, -20, 1.0),
        ),
        
        all(
            flash(utf8_codepoint_txts_2[3][0].fill, "yellow", 6.0),
            wiggle(utf8_codepoint_txts_2[3][0].rotation, 20, -20, 1.0),
        ),
        all(
            flash(utf8_codepoint_txts_2[3][1].fill, "yellow", 6.0),
            wiggle(utf8_codepoint_txts_2[3][1].rotation, 20, -20, 1.0),
        ),
        all(
            flash(utf8_codepoint_txts_2[3][2].fill, "yellow", 6.0),
            wiggle(utf8_codepoint_txts_2[3][2].rotation, 20, -20, 1.0),
        ),
        all(
            flash(utf8_codepoint_txts_2[3][3].fill, "yellow", 6.0),
            wiggle(utf8_codepoint_txts_2[3][3].rotation, 20, -20, 1.0),
        ),
        all(
            flash(utf8_codepoint_txts_2[3][4].fill, "yellow", 6.0),
            wiggle(utf8_codepoint_txts_2[3][4].rotation, 20, -20, 1.0),
        ),
    );
    

    yield* waitUntil("old_hello_world");
    
    yield* sequence(0.02,
        ...range(4).map(i => sequence(0.01,
            utf8_codepoint_txts_0[i].text("", 0.05),
            utf8_codepoint_txts_1[i].text("", 0.05),
            ...utf8_codepoint_txts_2[i].map((t,j) => t.text("", 0.05)),
        ))
    );

    const unicode_string_val_2_again = "Hello World";
    const unicode_string_val_2_encoded_again = [ 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64, ];

    const refreshed_hello_world_bytes = createRefArray<Txt>();
    const refreshed_hello_world_chars = createRefArray<Txt>();
    view.add(<Layout ref={unicode_str2} x={-300}  layout direction={"row"}>
        <Rect ref={utf32_used_rect} stroke={offset_rainbow(angle_sig)} layout direction={"column"}>
            {...range(unicode_string_val_2_encoded_again.length).map(i => <Txt
                fontFamily={"Jetbrains Mono"}
                ref={refreshed_hello_world_bytes}
                text={""}
                fill={palette.text}
                fontSize={45}
            />)}
        </Rect>
        <Layout  layout direction={"column"}>
            {...range(unicode_string_val_2_encoded_again.length).map(i => <Txt
                fontFamily={"Jetbrains Mono"}
                ref={refreshed_hello_world_chars}
                text={""}
                fill={palette.text}
                fontSize={45}
            />)}
        </Layout>
    </Layout>);


    yield* waitFor(1);
    yield* sequence(0.05,
        ...refreshed_hello_world_bytes.map((t, i) => t.text(unicode_string_val_2_encoded_again[i].toString(2).padStart(8, "0"), 0.5)),
    );
    yield* sequence(0.05,
        ...refreshed_hello_world_chars.map((t, i) => t.text(" -> " + unicode_string_val_2_again[i], 0.5)),
    );

    yield* waitUntil("utf16_drop");
    yield* all(utf8_encloser().start(0, 0.5), utf8_encloser().end(1, 0.5));
    yield* all(utf8_encloser().y(utf8_encloser().y() - 1500, 1.2), unicode_str2().y(unicode_str2().y() - 1500, 1.2))
    yield* waitUntil("segue_to_main");
    yield*  all(
        unicode().x(unicode().x() + 100, 1.2),
        unicode_bits().x(unicode_bits().x() + 100, 1.2),
        center_pack().x(center_pack().x() + 1800, 1.2),
        seven_bits().x(seven_bits().x() + 1800, 1.2),
        ascii().x(ascii().x() + 1800, 1.2),
    );

    yield* waitUntil("end");
});