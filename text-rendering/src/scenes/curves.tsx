import { Bezier, Circle, Gradient, Icon, Layout, Line, Node, PossibleCanvasStyle, QuadBezier, Rect, Txt, Video, makeScene2D } from "@motion-canvas/2d";
import { Origin, PossibleColor, Vector2, all, chain, createRef, createRefArray, createSignal, easeInCubic, easeOutCubic, linear, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { primary_glow_props, palette, secondary_glow_props } from "../lib/palette";
import { flash, flashend, lerp, wiggle } from "../lib/utilities";
import { TypedText } from "../lib/typing";

import text_rendering_vid from "../extern/TextRenderingShow.mp4";
import td_text_vid from "../extern/3DTextShow.mp4";
import sdf_paper_vid from "../extern/SDFPaperShow.mp4";

export default makeScene2D(function* (view) {
    const vecfont_title_ref = createRef<Txt>();
    view.add(<>
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={vecfont_title_ref}
            text={"Vector Fonts"}
            fill={palette.text}
            x={0} y={0}
            fontSize={120}
        />
    </>);
    yield* waitFor(3);
    yield* sequence(
        0.1,
        vecfont_title_ref().fontSize(60, 0.4),
        vecfont_title_ref().y(-375, 0.4),
    );
    const encloser = createRef<Line>();
    view.add(<>
        <Line
            ref={encloser}
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
            closed zIndex={-5}
            start={0.5} end={0.5}
            fill={palette.foreground}
            {...primary_glow_props}
        />
    </>);
    yield* all(encloser().start(0, 1.0), encloser().end(1, 1.0));

    yield* waitUntil("decomposed_b");
    const b_glyph = createRef<Node>();
    const b_lines = createRefArray<Line>();
    const b_points = createRefArray<Circle>();
    const b_curves = createRefArray<Bezier>();
    const animator_a = createSignal(0);
    const animator_b = createSignal(0);
    const animator_c = createSignal(0);
    encloser().add(<Node ref={b_glyph} y={40} scale={1.4}>
        <Line
            ref={b_lines}
            lineWidth={8} stroke={palette.text}
            points={[[-150, -200], [-150, 200]]}
            start={() => 0.5-(animator_a()/2)} end={() => 0.5+(animator_a()/2)}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_a()), lerp(0,20,animator_a())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(-150, -150, animator_a()), lerp(0, 200, animator_a())]}
            />
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_a()), lerp(0,20,animator_a())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(-150, -150, animator_a()), lerp(0, -200, animator_a())]}
            />
        </Line>
        <Line
            ref={b_lines}
            lineWidth={8} stroke={palette.text} zIndex={-1}
            points={[[-75, -150], [-75, -50]]}
            start={() => 0.5-(animator_a()/2)} end={() => 0.5+(animator_a()/2)}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_a()), lerp(0,20,animator_a())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(-75, -75, animator_a()), lerp(-100, -50, animator_a())]}
            />
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_a()), lerp(0,20,animator_a())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(-75, -75, animator_a()), lerp(-100, -150, animator_a())]}
            />
        </Line>
        <Line
            ref={b_lines}
            lineWidth={8} stroke={palette.text} zIndex={-1}
            points={[[-75, 150], [-75, 50]]}
            start={() => 0.5-(animator_a()/2)} end={() => 0.5+(animator_a()/2)}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_a()), lerp(0,20,animator_a())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(-75, -75, animator_a()), lerp(100, 50, animator_a())]}
            />
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_a()), lerp(0,20,animator_a())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(-75, -75, animator_a()), lerp(100, 150, animator_a())]}
            />
        </Line>

        <QuadBezier
            ref={b_curves}
            lineWidth={8} stroke={palette.text}
            p0={[-133, -205]}
            p1={[100, -220]}
            p2={[100, -100]}
            end={() => animator_b()}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_b()), lerp(0,20,animator_b())]}
                stroke={palette.primary} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(-133, 100, animator_b()), lerp(-205, -220, animator_b())]}
            />
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_b()), lerp(0,20,animator_b())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => b_curves[0].getPointAtPercentage(animator_b()).position}
            />
        </QuadBezier>
        <QuadBezier
            ref={b_curves}
            lineWidth={8} stroke={palette.text}
            p0={[-133, 205]}
            p1={[100, 220]}
            p2={[100, 100]}
            end={() => animator_b()}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_b()), lerp(0,20,animator_b())]}
                stroke={palette.primary} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(-133, 100, animator_b()), lerp(205, 220, animator_b())]}
            />
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_b()), lerp(0,20,animator_b())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => b_curves[1].getPointAtPercentage(animator_b()).position}
            />
        </QuadBezier>
        <QuadBezier
            ref={b_curves}
            lineWidth={8} stroke={palette.text}
            p0={[100, -90]}
            p1={[100, -30]}
            p2={[25, 0]}
            end={() => animator_c()}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_c()), lerp(0,20,animator_c())]}
                stroke={palette.primary} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(100, 100, animator_c()), lerp(-90, -30, animator_c())]}
            />
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_c()), lerp(0,20,animator_c())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => b_curves[2].getPointAtPercentage(animator_c()).position}
            />
        </QuadBezier>
        <QuadBezier
            ref={b_curves}
            lineWidth={8} stroke={palette.text}
            p0={[100, 90]}
            p1={[100, 30]}
            p2={[25, 0]}
            end={() => animator_c()}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_c()), lerp(0,20,animator_c())]}
                stroke={palette.primary} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(100, 100, animator_c()), lerp(90, 30, animator_c())]}
            />
        </QuadBezier>

        <QuadBezier
            ref={b_curves}
            lineWidth={8} stroke={palette.text}
            p0={[-58, -152]}
            p1={[20, -160]}
            p2={[20, -100]}
            end={() => animator_b()}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_b()), lerp(0,20,animator_b())]}
                stroke={palette.primary} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(-58, 20, animator_b()), lerp(-152, -160, animator_b())]}
            />
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_b()), lerp(0,20,animator_b())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => b_curves[4].getPointAtPercentage(animator_b()).position}
            />
        </QuadBezier>
        <QuadBezier
            ref={b_curves}
            lineWidth={8} stroke={palette.text}
            p0={[-58, 152]}
            p1={[20, 160]}
            p2={[20, 100]}
            end={() => animator_b()}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_b()), lerp(0,20,animator_b())]}
                stroke={palette.primary} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(-58, 20, animator_b()), lerp(152, 160, animator_b())]}
            />
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_b()), lerp(0,20,animator_b())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => b_curves[5].getPointAtPercentage(animator_b()).position}
            />
        </QuadBezier>
        <QuadBezier
            ref={b_curves}
            lineWidth={8} stroke={palette.text}
            p0={[20, -90]}
            p1={[20, -38]}
            p2={[-58, -48]}
            end={() => animator_c()}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_c()), lerp(0,20,animator_c())]}
                stroke={palette.primary} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(20, 20, animator_c()), lerp(-90, -38, animator_c())]}
            />
        </QuadBezier>
        <QuadBezier
            ref={b_curves}
            lineWidth={8} stroke={palette.text}
            p0={[20, 90]}
            p1={[20, 38]}
            p2={[-58, 48]}
            end={() => animator_c()}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_c()), lerp(0,20,animator_c())]}
                stroke={palette.primary} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(20, 20, animator_c()), lerp(90, 38, animator_c())]}
            />
        </QuadBezier>
    </Node>);
    yield* animator_a(1, 0.8);
    yield* animator_b(1, 1.5, easeInCubic);
    yield* animator_c(1, 0.8, easeOutCubic);

    yield* waitUntil("sebastian_lague");
    const video_showcase = createRef<Video>();
    view.add(
        <Video
            ref={video_showcase}
            src={text_rendering_vid}
            x={-1800} y={0}
            scale={0.8} padding={20}
            lineWidth={20} stroke={palette.primary}
            radius={5}
            {...primary_glow_props}
        />
    );
    yield* all(encloser().x(encloser().x() - 1500, 1.2), vecfont_title_ref().x(vecfont_title_ref().x() - 1500, 1.2));
    encloser().scale(0.7);
    vecfont_title_ref().scale(0.7).y(vecfont_title_ref().y() + 115);
    video_showcase().play();
    yield* video_showcase().x(0, 1.5);
    yield* waitUntil("cliffnotes");
    yield* sequence(0.3,
        video_showcase().x(1800, 1.5),
        all(
            encloser().x(-400, 1.2),
            vecfont_title_ref().x(-400, 1.2),
        )
    );
    
    const framebuffer_title_ref = createRef<Txt>();
    const fbo_encloser = createRef<Line>();
    view.add(<>
        <Line
            ref={fbo_encloser}
            lineWidth={6} x={400} y={-1000}
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
            closed zIndex={-5}
            fill={palette.foreground}
            {...primary_glow_props}
        >
            <Txt
                fontFamily={"Jetbrains Mono"}
                ref={framebuffer_title_ref}
                text={"Framebuffer"}
                fill={palette.text}
                x={0} y={-375}
                fontSize={60}
            />
        </Line>
    </>);

    const fbo_pixels = createRefArray<Rect>();
    const fbo_padding = 75;
    const fbo_width = ((425 - fbo_padding) * 2);
    const fbo_pix_start = (-425 + fbo_padding);
    const fbo_dim = 16;
    const pixel_size = fbo_width / fbo_dim;
    fbo_encloser().add(<>
        {...range(fbo_dim * fbo_dim).map(i => <Rect
            ref={fbo_pixels}
            x={fbo_pix_start + (i % fbo_dim) * (pixel_size+0.5) + (pixel_size / 2)}
            y={-310 + (Math.floor(i / fbo_dim)) * (pixel_size+0.5) + (pixel_size / 2)}
            size={[pixel_size, pixel_size]} zIndex={0}
            fill={"#111111"} radius={2}
        />)}
    </>);
    yield* fbo_encloser().y(0, 1.2);

    const bitmap0 = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    yield* sequence(0.1,
        ...range(fbo_dim).map(i => sequence(0.1,
            ...fbo_pixels.slice(i*fbo_dim, (i+1)*fbo_dim)
                .filter((v, j) => bitmap0[i*fbo_dim+j] == 1).map(t => t.fill(palette.accent, 0.4))
        ))
    );
    yield* waitUntil("decompose_curve");
    const new_curve = b_curves[0].clone();
    new_curve.removeChildren();
    b_glyph().add(new_curve);
    yield* all(
        encloser().y(encloser().y() + 150, 0.5),
        vecfont_title_ref().y(vecfont_title_ref().y() + 150, 0.5),
        new_curve.y(-400, 0.5),
        new_curve.opacity(0.3, 0.5),
    );
    const sub_lines = createRefArray<Line>();
    const resolution = createSignal(1);
    const max_resolution = 8;
    const resolution_indicator = createRef<Txt>();
    view.add(<>
        {...range(max_resolution).map(i => <Line
            ref={sub_lines}
            points={() => [
                new_curve.getPointAtPercentage(Math.min(i/Math.floor(resolution()), 1)).position.add(new_curve.absolutePosition().sub([1920/2, 1080/2])),
                new_curve.getPointAtPercentage(Math.min((i+1)/Math.floor(resolution()), 1)).position.add(new_curve.absolutePosition().sub([1920/2, 1080/2])),
            ]}
            end={i == 0 ? 0 : 1}
            lineWidth={4} stroke={palette.text}
        />)}
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={resolution_indicator}
            text={""}
            fill={palette.text}
            x={-400} y={-250}
            fontSize={40}
        />
    </>);
    yield* sub_lines[0].end(1, 0.5);
    yield* resolution_indicator().text(() => "Resolution = " + Math.floor(resolution()), 0.5);
    yield* resolution(8, 5.0, linear);

    yield* waitUntil("prettyeasytoo");
    yield* all(
        ...sub_lines.map(t => t.y(t.y() - 800, 1.2)),
        new_curve.y(new_curve.y() - 800, 1.2),
        resolution_indicator().y(resolution_indicator().y() - 800, 1.2),
        encloser().y(encloser().y() - 150, 0.5),
        vecfont_title_ref().y(vecfont_title_ref().y() - 150, 0.5),
    );
    new_curve.remove();

    const bitmap1 = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
    ];
    yield* sequence(0.1,
        ...range(fbo_dim).map(i => sequence(0.1,
            ...fbo_pixels.slice(i*fbo_dim, (i+1)*fbo_dim)
                .filter((v, j) => bitmap1[i*fbo_dim+j] == 1).map(t => t.fill(palette.accent, 0.4))
        ))
    );

    yield* waitUntil("thetrickypart");
    
    const bitmap_flash = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 2, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 2, 1, 0, 0, 1, 2, 1, 1, 0, 0, 0, 0,
        0, 0, 0, 1, 2, 1, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0,
        0, 0, 0, 1, 2, 1, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0,
        0, 0, 0, 1, 2, 1, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0,
        0, 0, 0, 1, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 2, 1, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0,
        0, 0, 0, 1, 2, 1, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0,
        0, 0, 0, 1, 2, 1, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0,
        0, 0, 0, 1, 2, 1, 0, 0, 1, 2, 1, 1, 0, 0, 0, 0,
        0, 0, 0, 1, 2, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
    ];
    
    yield* sequence(0.1,
        ...range(fbo_dim).map(i => sequence(0.1,
            ...fbo_pixels.slice(i*fbo_dim, (i+1)*fbo_dim)
                .filter((v, j) => bitmap_flash[i*fbo_dim+j] == 2).map(t => flash(t.fill, 'yellow', 0.9))
        ))
    );

    yield* waitUntil("io_test");
    const io_arrows = createRefArray<Line>();
    fbo_pixels.forEach(t => view.add(<Line
        ref={io_arrows} position={() => t.absolutePosition().sub([1920/2, 1080/2])}
        points={[[0, 0], [20, 0]]}
        lineWidth={3} stroke={palette.text}
        endArrow arrowSize={4} end={0}
    />))
    yield* sequence(0.1,
        ...range(fbo_dim).map(i => sequence(0.1,
            ...io_arrows.slice(i*fbo_dim, (i+1)*fbo_dim)
                .map(t => t.end(1, 0.4))
        ))
    );
    const glyph_cpy = b_glyph().snapshotClone();
    glyph_cpy.opacity(0);
    glyph_cpy.children().forEach(t => t.removeChildren())
    glyph_cpy.position(b_glyph().absolutePosition().sub([1920/2, 1080/2]))
    glyph_cpy.scale(b_glyph().absoluteScale())
    view.add(glyph_cpy);
    glyph_cpy.childrenAs<Line>()[0].points([[-150, -210], [-150, 210]]);
    glyph_cpy.childrenAs<Line>()[1].points([[-85, -165], [-85, -25]]);
    glyph_cpy.childrenAs<Line>()[2].points([[-85, 165], [-85, 25]]);
    glyph_cpy.childrenAs<QuadBezier>()[ 3].p0([-150, -210]).p1([100, -220]).p2([100, -100]);
    glyph_cpy.childrenAs<QuadBezier>()[ 4].p0([-150,  210]).p1([100,  220]).p2([100,  100]);
    glyph_cpy.childrenAs<QuadBezier>()[ 5].p0([100, -100]).p1([100, -30]).p2([25, 0]);
    glyph_cpy.childrenAs<QuadBezier>()[ 6].p0([100,  100]).p1([100,  30]).p2([25, 0]);
    glyph_cpy.childrenAs<QuadBezier>()[ 7].p0([-85, -165]).p1([20, -185]).p2([20, -100]);
    glyph_cpy.childrenAs<QuadBezier>()[ 8].p0([-85,  165]).p1([20,  185]).p2([20,  100]);
    glyph_cpy.childrenAs<QuadBezier>()[ 9].p0([20, -100]).p1([20, -10]).p2([-85, -25]);
    glyph_cpy.childrenAs<QuadBezier>()[10].p0([20,  100]).p1([20,  10]).p2([-85,  25]);

    yield* sequence(0.2,
        glyph_cpy.opacity(1, 0.5),
        glyph_cpy.position([425, 60], 0.8),
        glyph_cpy.scale(1.5, 0.8),
        all(
            // @ts-expect-error
            ...glyph_cpy.children().map(t => t.lineWidth(3, 0.8))
        ),
    );

    yield* waitUntil("show_even_intersects");
    yield* sequence(0.1,
        ...range(fbo_dim).map(i => sequence(0.1,
            ...io_arrows.slice(i*fbo_dim, (i+1)*fbo_dim)
                .filter((v,j) => !(i == 2 && j == 2) && !(i == 11 && j == 2)).map(t => t.end(0, 0.4))
        )),
        io_arrows[2*fbo_dim+2].lineWidth(6, 0.5),
        io_arrows[2*fbo_dim+2].points([[0,0], [600, 0]], 0.5),
        io_arrows[2*fbo_dim+2].arrowSize(10, 0.5),
        io_arrows[11*fbo_dim+2].lineWidth(6, 0.5),
        io_arrows[11*fbo_dim+2].points([[0,0], [600, 0]], 0.5),
        io_arrows[11*fbo_dim+2].arrowSize(10, 0.5),
    );
    const even_highlights = createRefArray<Circle>();
    view.add(<>
        <Circle
            ref={even_highlights}
            position={[200, -200]} size={[90,90]}
            opacity={0}
            lineWidth={5} stroke={"yellow"}
        />
        <Circle
            ref={even_highlights}
            position={[517, -200]} size={[90,90]}
            opacity={0}
            lineWidth={5} stroke={"yellow"}
        />
        <Circle
            ref={even_highlights}
            position={[200, 200]} size={[90,90]}
            opacity={0}
            lineWidth={5} stroke={"yellow"}
        />
        <Circle
            ref={even_highlights}
            position={[298, 200]} size={[90,90]}
            opacity={0}
            lineWidth={5} stroke={"yellow"}
        />
        <Circle
            ref={even_highlights}
            position={[455, 200]} size={[90,90]}
            opacity={0}
            lineWidth={5} stroke={"yellow"}
        />
        <Circle
            ref={even_highlights}
            position={[575, 200]} size={[90,90]}
            opacity={0}
            lineWidth={5} stroke={"yellow"}
        />
    </>);
    yield* sequence(0.1,
        ...even_highlights.map(t => all(
            flash(t.opacity, 1, 2),
            t.size([0,0], 1),
        ))
    );
    yield* waitUntil("show_odd_intersects");
    yield* sequence(0.4,
        io_arrows[2*fbo_dim+2].end(0, 1.2),
        io_arrows[11*fbo_dim+2].end(0, 1.2),
        all(
            io_arrows[4*fbo_dim+10].lineWidth(6, 0.5),
            io_arrows[4*fbo_dim+10].points([[0,0], [240, 0]], 0.0),
            io_arrows[4*fbo_dim+10].end(1, 0.5),
            io_arrows[4*fbo_dim+10].arrowSize(10, 0.5),
        ),
        all(
            io_arrows[11*fbo_dim+4].lineWidth(6, 0.5),
            io_arrows[11*fbo_dim+4].points([[0,0], [520, 0]], 0.0),
            io_arrows[11*fbo_dim+4].end(1, 0.5),
            io_arrows[11*fbo_dim+4].arrowSize(10, 0.5),
        ),
    )

    const odd_highlights = createRefArray<Circle>();
    view.add(<>
        <Circle
            ref={odd_highlights}
            position={[574, -110]} size={[90,90]}
            opacity={0}
            lineWidth={5} stroke={"yellow"}
        />
        <Circle
            ref={odd_highlights}
            position={[297, 200]} size={[90,90]}
            opacity={0}
            lineWidth={5} stroke={"yellow"}
        />
        <Circle
            ref={odd_highlights}
            position={[455, 200]} size={[90,90]}
            opacity={0}
            lineWidth={5} stroke={"yellow"}
        />
        <Circle
            ref={odd_highlights}
            position={[575, 200]} size={[90,90]}
            opacity={0}
            lineWidth={5} stroke={"yellow"}
        />
    </>);
    yield* sequence(0.1,
        ...odd_highlights.map(t => all(
            flash(t.opacity, 1, 2),
            t.size([0,0], 1),
        ))
    );

    yield* waitUntil("color_glyph");
    yield* sequence(0.1,
        io_arrows[4*fbo_dim+10].end(0, 1.2),
        io_arrows[11*fbo_dim+4].end(0, 1.2),
    );
    yield* sequence(0.1,
        ...range(fbo_dim).map(i => sequence(0.1,
            ...fbo_pixels.slice(i*fbo_dim, (i+1)*fbo_dim)
                .filter((v, j) => bitmap_flash[i*fbo_dim+j] == 2).map(t => flashend(t.fill, 'yellow', palette.accent, 0.9))
        ))
    );
    yield* waitUntil("defined_in_curves");
    
    yield* wiggle(b_glyph().rotation, 5, -5, 1.5);
    yield* waitUntil("shifty");
    yield* all(
        encloser().y(encloser().y() - 150, 0.5),
        vecfont_title_ref().y(vecfont_title_ref().y() - 150, 0.5),
    );

    yield* waitUntil("flash_pix_in_bb");
    yield* sequence(0.1,
        ...range(15).map(i => sequence(0.1,
            ...range(9).map(j => flash(fbo_pixels[19 + i * fbo_dim + j].fill, "yellow", 1.2)),
        ))
    );

    yield* waitFor(2);
    yield* sequence(0.1,
        ...glyph_cpy.children().map(t => all(
            // @ts-expect-error
            flash(t.stroke, "yellow", 1.2),
            wiggle(t.rotation, -5, 5, 1.2),
        ))
    );

    yield* waitUntil("caching?");
    yield* sequence(0.1,
        all(
            vecfont_title_ref().y(vecfont_title_ref().y() - 900, 1.2),
            encloser().y(encloser().y() - 900, 1.2),
        ),
        all(
            fbo_encloser().x(fbo_encloser().x() + 1200, 1.2),
            glyph_cpy.x(glyph_cpy.x() + 1200, 1.2),
        )
    );

    //~ RESET =================================================================
    view.removeChildren();
    
    const calls_parent = createRef<Node>();
    const slow_part = createRef<Txt>();
    const multi_calls = createRefArray<Txt>();
    view.add(<Node ref={calls_parent}>
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={slow_part}
            text={""}
            fill={palette.text}
            x={0} y={0}
            fontSize={120}
        />
        {...range(10).map(i => <Txt
            fontFamily={"Jetbrains Mono"}
            ref={multi_calls}
            text={""}
            fill={palette.text}
            x={0} y={-400 + 80*(i+1)}
            fontSize={50}
        />)}
    </Node>);
    yield* slow_part().text("f(x, y) => z", 1.2);
    yield* waitFor(1);
    yield* slow_part().text("f(x, y) => z [5ms]", 1.2);
    yield* waitFor(1);
    yield* sequence(0.2,
        slow_part().fontSize(50, 0.8),
        slow_part().y(-400, 0.8),
    );
    const calls = [
        "f(x, y) => z [5ms]",
        "f(a, b) => c [4ms]",
        "f(x, y) => z [5ms]",
        "f(x, y) => z [5ms]",
        "f(x, y) => z [5ms]",
        "f(a, b) => c [4ms]",
        "f(a, b) => c [4ms]",
        "f(x, y) => z [5ms]",
        "f(c, d) => e [7ms]",
        "f(x, y) => z [5ms]",
    ];
    const map_color = (s: string): PossibleCanvasStyle => {
        if (s[2] == 'x') return "#72A8F4";
        if (s[2] == 'a') return "#9171F2";
        if (s[2] == 'c') return "#EF7087";
    };
    yield* sequence(0.1,
        ...multi_calls.map((t, i) => t.text(calls[i], 0.5))
    );
    yield* sequence(0.1,
        slow_part().fill("#72A8F4", 0.3),
        ...multi_calls.map((t, i) => t.fill(map_color(t.text()), 0.5))
    );
    yield* waitUntil("show_cache");
    yield* sequence(0.05,
        slow_part().x(slow_part().x() - 500, 0.3),
        ...multi_calls.map((t, i) => t.x(t.x() - 500, 0.3))
    );

    const cache_encloser = createRef<Line>();
    const cache_title = createRef<Txt>();
    view.add(<>
        <Line
            ref={cache_encloser}
            lineWidth={6} x={400}
            stroke={palette.secondary}
            points={[
                [ 0, 425 ],
                [ 425/1.5, 425 ],
                [ 425/1.5, -345 ],
                [ 275/1.5, -345 ],
                [ 220/1.5, -425 ],
                [ -220/1.5, -425 ],
                [ -275/1.5, -345 ],
                [ -425/1.5, -345 ],
                [ -425/1.5, 425 ],
                [ 0, 425 ],
            ]}
            closed zIndex={-5}
            start={0.5} end={0.5}
            fill={palette.foreground_secondary}
            {...secondary_glow_props}
        >
            <Txt
                fontFamily={"Jetbrains Mono"}
                ref={cache_title}
                text={""}
                fill={palette.text}
                x={0} y={-375}
                fontSize={60}
            />
        </Line>
    </>);
    
    yield* all(cache_encloser().start(0, 1.0), cache_encloser().end(1, 1.0));
    yield* cache_title().text("Cache", 1.0);

    yield* waitUntil("cache_explanation");
    yield* sequence(0.05,
        slow_part().text("f(x, y) => ?", 0.4),
        ...multi_calls.map((t, i) => t.text(calls[i].slice(0, -7) + "?", 0.4))
    );
    yield* all(
        slow_part().fontSize(80, 0.8),
        slow_part().fill('yellow', 0.8),
    );
    
    yield* slow_part().text("f(x, y) => z [5ms]", 1.2);
    const slow_part_clone = slow_part().clone();
    slow_part_clone.remove();
    slow_part_clone.opacity(0);
    view.add(slow_part_clone);
    yield* all(
        slow_part_clone.position(() => cache_encloser().position().addY(-200), 1.2),
        slow_part_clone.opacity(1, 0.8),
        slow_part_clone.text("(x, y) => z", 0.8),
        slow_part_clone.fontSize(60, 0.8),
        slow_part_clone.fill(map_color(slow_part_clone.text()), 0.8),
    );
    yield* all(
        slow_part().fontSize(50, 0.8),
        slow_part().fill(map_color(slow_part().text()), 0.8),
    );
    
    yield* all(
        multi_calls[0].fontSize(80, 0.8),
        multi_calls[0].fill('yellow', 0.8),
    );
    yield* all(
        flash(slow_part_clone.fontSize, 65, 0.4),
        flash(slow_part_clone.fill, "yellow", 0.4),
        multi_calls[0].text("f(x, y) => z [0ms]", 0.4),
    );
    yield* all(
        multi_calls[0].fontSize(50, 0.8),
        multi_calls[0].fill("#97ED6F", 0.8),
    );

    
    yield* all(
        multi_calls[1].fontSize(80, 0.8),
        multi_calls[1].fill('yellow', 0.8),
    );
    yield* multi_calls[1].text("f(a, b) => c [4ms]", 1.2)
    const cached2 = multi_calls[1].clone();
    cached2.remove();
    cached2.opacity(0);
    view.add(cached2);
    yield* all(
        cached2.position(() => cache_encloser().position().addY(-50), 1.2),
        cached2.opacity(1, 0.8),
        cached2.text("(a, b) => c", 0.8),
        cached2.fontSize(60, 0.8),
        cached2.fill(map_color(cached2.text()), 0.8),
    );
    yield* all(
        multi_calls[1].fontSize(50, 0.8),
        multi_calls[1].fill(map_color(multi_calls[1].text()), 0.8),
    );
    
    const cached3 = multi_calls[8].clone();
    cached3.remove();
    cached3.opacity(0);
    view.add(cached3);

    const txt_map = (s: string): string => {
        if (s[2] == 'x') return "f(x, y) => z [0ms]";
        if (s[2] == 'a') return "f(a, b) => c [0ms]";
        if (s[2] == 'c') return "#EF7087";
    }
    yield* sequence(0.05,
        ...multi_calls.slice(2, 8).map(v => chain(
            all(
                v.fontSize(65, 0.4),
                v.fill('yellow', 0.4),
            ),
            v.text(txt_map(v.text()), 0.2),
            all(
                v.fontSize(50, 0.8),
                v.fill("#97ED6F", 0.8),
            )
        )),
        chain(
            all(
                multi_calls[8].fontSize(65, 0.4),
                multi_calls[8].fill('yellow', 0.4),
            ),
            multi_calls[8].text("f(c, d) => e [4ms]", 0.2),
            all(
                cached3.position(() => cache_encloser().position().addY(100), 0.8),
                cached3.opacity(1, 0.4),
                cached3.text("(c, d) => e", 0.4),
                cached3.fontSize(60, 0.4),
                cached3.fill(map_color(cached3.text()), 0.4),
            ),
            all(
                multi_calls[8].fontSize(50, 0.4),
                multi_calls[8].fill(map_color(multi_calls[8].text()), 0.4),
            )
        ),
    );
    yield* sequence(0.01,
        ...multi_calls.slice(9, 10).map(v => chain(
            all(
                v.fontSize(65, 0.4),
                v.fill('yellow', 0.4),
            ),
            v.text(txt_map(v.text()), 0.2),
            all(
                v.fontSize(50, 0.8),
                v.fill("#97ED6F", 0.8),
            )
        ))
    );
    
    yield* waitUntil("font_atlas");
    yield* all(
        calls_parent().x(calls_parent().x() - 1000, 1.2),
        slow_part_clone.text("", 0.8),
        cached2.text("", 0.8),
        cached3.text("", 0.8),
    );

    yield* cache_encloser().x(0, 0.5);
    yield* all(
        cache_encloser().points([
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
        ], 1.2),
        cache_title().text("Font Atlas", 1.2)
    );

    yield* waitFor(1);
    const atlas_texture = createRef<Rect>();
    cache_encloser().add(<>
        <Rect
            ref={atlas_texture}
            y={40} layout
            direction={"column"}
            fill={"#111111"}
        />
    </>)
    yield* atlas_texture().size([700,700], 0.8)
    const small_glyph_a = createRef<Node>();
    const small_glyph_l = createRef<Node>();
    const small_glyph_h = createRef<Node>();
    const small_glyph_p = createRef<Node>();
    const arrows = createRefArray<Line>();
    view.add(<>
        <Node ref={small_glyph_a} y={0} x={-1800}>
            <Txt
                fill={palette.background}
                stroke={palette.text} lineWidth={5}
                text={"A"}
                fontSize={150}
            />
            <Line
                ref={arrows}
                lineWidth={30} stroke={"yellow"}
                x={225} endArrow arrowSize={50}
                points={[[-75, 0],[75,0]]} opacity={0}
            />
        </Node>
        <Node ref={small_glyph_l} y={150} x={-1800}>
            <Txt
                fill={palette.background}
                stroke={palette.text} lineWidth={5}
                text={"L"}
                fontSize={150}
            />
            <Line
                ref={arrows}
                lineWidth={30} stroke={"yellow"}
                x={225} endArrow arrowSize={50}
                points={[[-75, 0],[75,0]]} opacity={0}
            />
        </Node>
        <Node ref={small_glyph_h} y={-150} x={-1800}>
            <Txt
                fill={palette.background}
                stroke={palette.text} lineWidth={5}
                text={"H"}
                fontSize={150}
            />
            <Line
                ref={arrows}
                lineWidth={30} stroke={"yellow"}
                x={225} endArrow arrowSize={50}
                points={[[-75, 0],[75,0]]} opacity={0}
            />
        </Node>
        <Node ref={small_glyph_p} y={300} x={-1800}>
            <Txt
                fill={palette.background}
                stroke={palette.text} lineWidth={5}
                text={"P"}
                fontSize={150}
            />
            <Line
                ref={arrows}
                lineWidth={30} stroke={"yellow"}
                x={225} endArrow arrowSize={50}
                points={[[-75, 0],[75,0]]} opacity={0}
            />
        </Node>
    </>);

    const on_atlas_glyphs = createRefArray<Txt>();
    const on_atlas_glyphs_line2 = createRefArray<Txt>();
    const on_atlas_glyphs_line3 = createRefArray<Txt>();
    atlas_texture().add(<>
        <Layout layout direction={"row"}>
            <Txt
                ref={on_atlas_glyphs}
                fill={palette.text}
                text={"A"} opacity={0}
                fontSize={80}
            />
            <Txt
                ref={on_atlas_glyphs}
                fill={palette.text}
                text={"L"} opacity={0}
                fontSize={80}
            />
            <Txt
                ref={on_atlas_glyphs}
                fill={palette.text}
                text={"H"} opacity={0}
                fontSize={80}
            />
            <Txt
                ref={on_atlas_glyphs}
                fill={palette.text}
                text={"P"} opacity={0}
                fontSize={80}
            />
            <Txt
                ref={on_atlas_glyphs}
                fill={palette.text}
                text={"B"} opacity={0}
                fontSize={80}
            />
        </Layout>
        <Layout layout direction={"row"}>
            <Txt
                ref={on_atlas_glyphs_line2}
                fill={palette.text}
                text={"A"} opacity={0}
                fontSize={120}
            />
            <Txt
                ref={on_atlas_glyphs_line2}
                fill={palette.text}
                text={"L"} opacity={0}
                fontSize={120}
            />
            <Txt
                ref={on_atlas_glyphs_line2}
                fill={palette.text}
                text={"H"} opacity={0}
                fontSize={120}
            />
            <Txt
                ref={on_atlas_glyphs_line2}
                fill={palette.text}
                text={"P"} opacity={0}
                fontSize={120}
            />
        </Layout>
        <Layout layout direction={"row"}>
            <Txt
                ref={on_atlas_glyphs_line3}
                fill={palette.text}
                text={"A"} opacity={0}
                fontSize={150}
            />
            <Txt
                ref={on_atlas_glyphs_line3}
                fill={palette.text}
                text={"L"} opacity={0}
                fontSize={150}
            />
            <Txt
                ref={on_atlas_glyphs_line3}
                fill={palette.text}
                text={"H"} opacity={0}
                fontSize={150}
            />
            <Txt
                ref={on_atlas_glyphs_line3}
                fill={palette.text}
                text={"P"} opacity={0}
                fontSize={150}
            />
        </Layout>
    </>)

    yield* sequence(0.3,
        chain(
            small_glyph_a().x(-800, 1.2),
            all(
                flash(arrows[0].opacity, 1, 0.3),
                on_atlas_glyphs[0].opacity(1, 0.1),
            )
        ),
        chain(
            small_glyph_l().x(-800, 1.2),
            all(
                flash(arrows[1].opacity, 1, 0.3),
                on_atlas_glyphs[1].opacity(1, 0.1),
            )
        ),
        chain(
            small_glyph_h().x(-800, 1.2),
            all(
                flash(arrows[2].opacity, 1, 0.3),
                on_atlas_glyphs[2].opacity(1, 0.1),
            )
        ),
        chain(
            small_glyph_p().x(-800, 1.2),
            all(
                flash(arrows[3].opacity, 1, 0.3),
                on_atlas_glyphs[3].opacity(1, 0.1),
            )
        ),
    );
    
    yield* waitUntil("andthen");
    yield* sequence(0.1,
        small_glyph_a().x(-1800, 1.2),
        small_glyph_l().x(-1800, 1.2),
        small_glyph_h().x(-1800, 1.2),
        small_glyph_p().x(-1800, 1.2),
    );

    view.add(fbo_encloser());
    fbo_encloser().removeChildren();
    fbo_encloser().add(framebuffer_title_ref());
    fbo_encloser().add(<Rect
        ref={atlas_texture}
        y={40} layout size={[700,700]}
        fill={"#111111"}
    />)
    yield* all(
        cache_encloser().scale(0.9, 0.8),
        cache_encloser().x(-400, 0.8),
        fbo_encloser().scale(0.9, 0.8),
        fbo_encloser().position([400,0], 0.8),
    );

    yield* waitUntil("map_alpha");
    const mapping_rects = createRefArray<Rect>();
    const write_rect = createRef<TypedText>();
    const angle_sig = createSignal(0);
    yield angle_sig(20, 10, linear);
    const rainbow = new Gradient({
        type: "conic",
        angle: () => angle_sig(),
        stops: [
            { offset: 0, color: "violet" },
            { offset: 1/7, color: "indigo" },
            { offset: 2/7, color: "blue" },
            { offset: 3/7, color: "green" },
            { offset: 4/7, color: "yellow" },
            { offset: 5/7, color: "orange" },
            { offset: 6/7, color: "red" },
            { offset: 1, color: "violet" },
        ]
    });
    view.add(<>
        <Rect
            ref={mapping_rects}
            position={new Vector2({"x":268.4843827225268,"y":304.2000062465668}).sub([1920/2, 1080/2])}
            size={{"x":52.1875,"y":96}} scale={0.9}
            opacity={0}
            lineWidth={8} stroke={rainbow}
        />
        <Rect
            ref={mapping_rects}
            position={new Vector2({"x":311.33985033724457,"y":304.2000062465668}).sub([1920/2, 1080/2])}
            size={{"x":52.1875,"y":96}} scale={0.9}
            opacity={0}
            lineWidth={8} stroke={rainbow}
        />
        <Rect
            ref={mapping_rects}
            position={new Vector2({"x":404.7500041127205,"y":304.2000062465668}).sub([1920/2, 1080/2])}
            size={{"x":50.46875,"y":96}} scale={0.9}
            opacity={0}
            lineWidth={8} stroke={rainbow}
        />
        <Rect
            ref={mapping_rects}
            position={new Vector2({"x":356.37500539422035,"y":304.2000062465668}).sub([1920/2, 1080/2])}
            size={{"x":43.046875,"y":96}} scale={0.9}
            opacity={0}
            lineWidth={8} stroke={rainbow}
        />
        <Rect
            ref={mapping_rects}
            position={new Vector2({"x":268.4843827225268,"y":304.2000062465668}).sub([1920/2, 1080/2])}
            size={{"x":52.1875,"y":96}} scale={0.9}
            opacity={0}
            lineWidth={8} stroke={rainbow}
        />



        <TypedText
            ref={write_rect}
            initial_text={""} width={255}
            x={300} hidden
            fontSize={80}
            textAlign={"left"}
        />
    </>);
    yield* sequence(0.2,
        flash(mapping_rects[0].opacity, 1, 0.5),
        write_rect().type("A", 0.2),
        flash(mapping_rects[1].opacity, 1, 0.5),
        write_rect().type("L", 0.2),
        flash(mapping_rects[2].opacity, 1, 0.5),
        write_rect().type("P", 0.2),
        flash(mapping_rects[3].opacity, 1, 0.5),
        write_rect().type("H", 0.2),
        flash(mapping_rects[4].opacity, 1, 0.5),
        write_rect().type("A", 0.2),
    );

    yield* waitUntil("what_have_we_done");
    yield* all(
        cache_encloser().x(400, 1.2),
        fbo_encloser().x(fbo_encloser().x() + 1500, 1.2),
        write_rect().x(write_rect().x() + 1500, 1.2),
    );
    view.add(encloser());
    view.add(vecfont_title_ref());
    yield* sequence(0.1,
        all(
            vecfont_title_ref().y(vecfont_title_ref().y() + 1050, 1.2),
            encloser().y(encloser().y() + 1050, 1.2),
        ),
    )
    yield* wiggle(b_glyph().rotation, -5, 5, 0.5);
    yield* on_atlas_glyphs[4].opacity(1, 0.3);
    yield* wiggle(on_atlas_glyphs[4].rotation, -5, 5, 0.5);

    yield* waitUntil("issue_with_this");
    yield* sequence(0.1,
        all(
            vecfont_title_ref().y(vecfont_title_ref().y() - 1050, 1.2),
            encloser().y(encloser().y() - 1050, 1.2),
        ),
        cache_encloser().x(-400, 1.2),
        all(
            fbo_encloser().x(fbo_encloser().x() - 1500, 1.2),
            write_rect().x(write_rect().x() - 1500, 1.2),
        ),
    );
    const draggable_corners = createRefArray<Rect>();
    const boundary_lines = createRefArray<Line>();
    const animator = createSignal(0);
    const cursor = createRef<Icon>();
    view.add(<>
        <Rect
            ref={draggable_corners}
            position={() => write_rect().getOriginDelta(Origin.TopLeft).add(write_rect().absolutePosition().sub([1920/2, 1080/2])).addX(-10)}
            size={[0,0]}
            fill={palette.primary}
            radius={4}
        />
        <Rect
            ref={draggable_corners}
            position={() => write_rect().getOriginDelta(Origin.BottomLeft).add(write_rect().absolutePosition().sub([1920/2, 1080/2])).addX(-10)}
            size={[0,0]}
            fill={palette.primary}
            radius={4}
        />
        <Rect
            ref={draggable_corners}
            position={() => write_rect().getOriginDelta(Origin.BottomRight).add(write_rect().absolutePosition().sub([1920/2, 1080/2])).addX(10)}
            size={[0,0]}
            fill={palette.primary}
            radius={4}
        />
        <Rect
            ref={draggable_corners}
            position={() => write_rect().getOriginDelta(Origin.TopRight).add(write_rect().absolutePosition().sub([1920/2, 1080/2])).addX(10)}
            size={[0,0]}
            fill={palette.primary}
            radius={4}
        />
        <Icon
            icon={"ph:cursor-light"}
            ref={cursor}
            size={[50,50]}
            opacity={0}
            scale={1.2}
        />
    </>);
    view.add(<>
        <Line
            ref={boundary_lines}
            points={() => [
                draggable_corners[0].absolutePosition().sub([1920/2, 1080/2]),
                draggable_corners[1].absolutePosition().sub([1920/2, 1080/2]),
            ]}
            stroke={palette.primary}
            lineWidth={4} end={0}
            lineDash={[52, 5]}  lineDashOffset={() => animator() * 50}
        />
        <Line
            ref={boundary_lines}
            points={() => [
                draggable_corners[1].absolutePosition().sub([1920/2, 1080/2]),
                draggable_corners[2].absolutePosition().sub([1920/2, 1080/2]),
            ]}
            stroke={palette.primary}
            lineWidth={4} end={0}
            lineDash={[52, 5]}  lineDashOffset={() => animator() * 50}
        />
        <Line
            ref={boundary_lines}
            points={() => [
                draggable_corners[2].absolutePosition().sub([1920/2, 1080/2]),
                draggable_corners[3].absolutePosition().sub([1920/2, 1080/2]),
            ]}
            stroke={palette.primary}
            lineWidth={4} end={0}
            lineDash={[52, 5]}  lineDashOffset={() => animator() * 50}
        />
        <Line
            ref={boundary_lines}
            points={() => [
                draggable_corners[3].absolutePosition().sub([1920/2, 1080/2]),
                draggable_corners[0].absolutePosition().sub([1920/2, 1080/2]),
            ]}
            stroke={palette.primary}
            lineWidth={4} end={0}
            lineDash={[52, 5]}  lineDashOffset={() => animator() * 50}
        />
    </>)
    yield* cursor().position(write_rect().getOriginDelta(Origin.TopRight).add(write_rect().absolutePosition().sub([1920/2, 1080/2])).add([20,20]), 0);
    yield* all( ...draggable_corners.map(t => t.size([20, 20], 0.5)) );
    yield* all( ...boundary_lines.map(t => t.end(1, 0.5)), );
    yield* all(
        cursor().scale(1, 0.25),
        cursor().opacity(1, 0.25),
    );
    yield* all(
        chain(
            cursor().scale(0.8, 0.2),
            all(
                cursor().position([565+20, -72+20], 0.5),
                draggable_corners[3].position([565, -72], 0.5),
                draggable_corners[2].position([565,  72], 0.5),
                draggable_corners[0].position([162, -72], 0.5),
                draggable_corners[1].position([162,  72], 0.5),
            ),
            all(
                write_rect().text().text("", 0.3),
                cursor().scale(1, 0.2),
            ),
        ),
    );
    yield* all(
        cursor().scale(1.2, 0.25),
        cursor().opacity(0, 0.25),
    );

    yield* sequence(0.3,
        on_atlas_glyphs_line2[0].opacity(1, 0.1),
        on_atlas_glyphs_line2[1].opacity(1, 0.1),
        on_atlas_glyphs_line2[2].opacity(1, 0.1),
        on_atlas_glyphs_line2[3].opacity(1, 0.1),
    );
    yield* write_rect().text().fontSize(120, 0);
    yield* write_rect().type("ALPHA", 0.5);

    yield* waitFor(0.5);
    yield* all(
        cursor().scale(1, 0.25),
        cursor().opacity(1, 0.25),
    );
    yield* all(
        chain(
            cursor().scale(0.8, 0.2),
            all(
                cursor().position([660+20, -92+20], 0.5),
                draggable_corners[3].position([660, -92], 0.5),
                draggable_corners[2].position([660,  92], 0.5),
                draggable_corners[0].position([162, -92], 0.5),
                draggable_corners[1].position([162,  92], 0.5),
            ),
            write_rect().text().text("", 0.3),
            cursor().scale(1, 0.2),
        ),
    )
    yield* all(
        cursor().scale(1.2, 0.25),
        cursor().opacity(0, 0.25),
    );
    yield* write_rect().text().fontSize(150, 0);
    yield* sequence(0.3,
        on_atlas_glyphs_line3[0].opacity(1, 0.1),
        on_atlas_glyphs_line3[1].opacity(1, 0.1),
        on_atlas_glyphs_line3[2].opacity(1, 0.1),
        on_atlas_glyphs_line3[3].opacity(1, 0.1),
    );
    yield* write_rect().type("ALPHA", 0.5);

    yield* waitUntil("issue_in_games");
    yield* all(
        cache_encloser().x(cache_encloser().x() - 1000, 1.2),
        fbo_encloser().x(fbo_encloser().x() + 1000, 1.2),
        write_rect().x(write_rect().x() + 1000, 1.2),
        ...draggable_corners.map(t => t.x(t.x() + 1000, 1.2)),
    );
    const game_show = createRef<Video>();
    view.add(<>
        <Video
            ref={game_show}
            src={td_text_vid}
            x={0} y={-1500}
            scale={0.5} padding={20}
            lineWidth={20} stroke={palette.primary}
            radius={5} opacity={0}
            {...primary_glow_props}
        />
    </>);
    game_show().play();
    yield* sequence(0.1,
        game_show().y(0, 0.8),
        game_show().scale(0.8, 0.8),
        game_show().opacity(1, 0.8),
    );

    yield* waitUntil("segue_to_main_scene");
    yield* sequence(0.1,
        game_show().opacity(0, 0.8),
        game_show().scale(0.5, 0.8),
        game_show().y(1500, 0.8),
    );
    yield* all(
        vecfont_title_ref().scale(1, 1.5),
        vecfont_title_ref().fontSize(60, 1.2),
        vecfont_title_ref().position([0, -375], 1.2),
        encloser().position([0, 0], 1.2),
        encloser().scale(1, 1.5),
    );

    const center_line = createRef<Line>();
    const divider_lines = createRefArray<Line>();
    const my_d = createRef<Txt>();
    const center_pack = createRef<Node>();
    const bitmap_encloser = createRef<Line>();

    const bitmap_padding = 40;
    const bitmap_width = (((425/2) - bitmap_padding) * 2);
    const bitmap_pix_start = (-(425/2) + bitmap_padding);
    const bitmap_dim = 6;
    const bitmap_pixel_size = bitmap_width / bitmap_dim;

    view.add(<>
        <Node ref={center_pack} x={-2000} y={1000}>
            <Txt
                ref={my_d}
                fontFamily={"Jetbrains Mono"}
                text={"D"}
                fill={palette.text}
                fontSize={342}
            />
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
                lineWidth={50} stroke={palette.primary}
            />
            <Line
                ref={divider_lines}
                points={[
                    [0, -220],
                    [0, -1000],
                ]}
                lineWidth={50} stroke={palette.primary}
            />
            <Line
                ref={divider_lines}
                points={[
                    [-220, 0],
                    [-2000, 0],
                ]}
                lineWidth={50} stroke={palette.primary}
            />
            <Line
                ref={divider_lines}
                points={[
                    [0, 220],
                    [0, 1000],
                ]}
                lineWidth={50} stroke={palette.primary}
            />
            <Line
                ref={divider_lines}
                points={[
                    [220, 0],
                    [2000, 0],
                ]}
                lineWidth={50} stroke={palette.primary}
            />
            <Line
                ref={bitmap_encloser}
                lineWidth={6} position={[-550, -300]}
                scale={0.8}
                stroke={palette.primary}
                points={[
                    [ 0, 425/2 ],
                    [ 425/2, 425/2 ],
                    [ 425/2, -345/2 ],
                    [ 275/2, -345/2 ],
                    [ 220/2, -425/1.75 ],
                    [ -220/2, -425/1.75 ],
                    [ -275/2, -345/2 ],
                    [ -425/2, -345/2 ],
                    [ -425/2, 425/2 ],
                    [ 0, 425/2 ],
                ]}
                closed zIndex={-5}
                fill={palette.foreground}
                {...primary_glow_props}
            />
        </Node>
    </>);
    const bitmap_pixels = createRefArray<Rect>();
    const bitmap_title_ref = createRef<Txt>();

    const bitmap = [
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0,
        0, 1, 0, 0, 1, 0,
        0, 1, 1, 1, 1, 0,
        0, 1, 0, 0, 1, 0,
    ];
    bitmap_encloser().add(<>
        {...range(bitmap_dim * bitmap_dim).map(i => <Rect
            ref={bitmap_pixels}
            x={bitmap_pix_start + (i % bitmap_dim) * (bitmap_pixel_size+0.5) + (bitmap_pixel_size / 2)}
            y={-150 + (Math.floor(i / bitmap_dim)) * (bitmap_pixel_size+0.5) + (bitmap_pixel_size / 2)}
            size={[bitmap_pixel_size,bitmap_pixel_size]} zIndex={0}
            fill={bitmap[i] == 0 ? "#111111" : palette.accent} radius={2}
        />)}
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={bitmap_title_ref}
            text={"Bitmap"}
            fill={palette.text}
            x={0} y={-200}
            fontSize={55}
        />
    </>);
    
    yield* all(
        center_pack().position([0, 0], 1.5),
        encloser().position([550, -300], 1.5),
        encloser().scale(0.45, 1),
        encloser().lineWidth(10, 1),
        encloser().points([
            [ 0, 425/1.05 ],
            [ 425/1.05, 425/1.05 ],
            [ 425/1.05, -345/1.05 ],
            [ 245/1.05, -345/1.05 ],
            [ 220/1.05, -450/1.05 ],
            [ -220/1.05, -450/1.05 ],
            [ -245/1.05, -345/1.05 ],
            [ -425/1.05, -345/1.05 ],
            [ -425/1.05, 425/1.05 ],
            [ 0, 425/1.05 ],
        ], 1),
        vecfont_title_ref().scale(0.7, 1),
        vecfont_title_ref().text("Vector", 1.5),
        vecfont_title_ref().position([550, -465], 1.5),
    );
    yield* wiggle(bitmap_encloser().rotation, 5, -5, 1.2);
    yield* waitFor(3);
    yield* all(
        wiggle(vecfont_title_ref().rotation, 5, -5, 1.2),
        wiggle(vecfont_title_ref().position.x, vecfont_title_ref().position.x()+10, vecfont_title_ref().position.x()-10, 1.2),
        wiggle(encloser().rotation, 5, -5, 1.2),
    );

    yield* waitUntil("something_in_bwtween");
    yield* all(
        center_pack().position([2000, -1000], 1.5),
        vecfont_title_ref().position(vecfont_title_ref().position().add([2000, -1000]), 1.5),
        encloser().position(encloser().position().add([2000, -1000]), 1.5),
    );
    yield* waitFor(1.5);
    const paper_show = createRef<Video>();
    view.add(<>
        <Video
            ref={paper_show}
            src={sdf_paper_vid}
            x={0} y={-1500}
            scale={0.5} padding={20}
            lineWidth={20} stroke={palette.primary}
            radius={5} opacity={0}
            {...primary_glow_props}
        />
    </>);
    yield* sequence(0.1,
        paper_show().y(0, 0.8),
        paper_show().scale(0.8, 0.8),
        paper_show().opacity(1, 0.8),
    );
    yield* waitFor(1.7);
    paper_show().play();

    yield* waitUntil("sdf_title_show");
    yield* sequence(0.1,
        paper_show().opacity(0, 0.8),
        paper_show().scale(0.5, 0.8),
        paper_show().y(1500, 0.8),
    );
    const sdf_font_title = createRef<Txt>();
    view.add(<>
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={sdf_font_title}
            text={""}
            fill={palette.text}
            x={0} y={0}
            fontSize={120}
        />
    </>);
    yield* waitFor(2);
    yield* sdf_font_title().text("SDF Fonts", 0.7);


    

    yield* waitUntil("end");
});