import { Camera, Circle, Gradient, Icon, Latex, Line, Node, Rect, Txt, makeScene2D } from "@motion-canvas/2d";
import { Color, Origin, all, chain, createRef, createRefArray, createSignal, easeInCubic, easeOutCubic, linear, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { primary_glow_props, palette } from "../lib/palette";
import { flash, flashend, wiggle } from "../lib/utilities";

export default makeScene2D(function* (view) {
    const framebuffer_title_ref = createRef<Txt>();
    view.add(<>
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={framebuffer_title_ref}
            text={""}
            fill={palette.text}
            x={0} y={0}
            fontSize={120}
        />
    </>);
    yield* waitUntil("fbo_title_drop");
    yield* framebuffer_title_ref().text("Framebuffer", 0.7);
    yield* waitFor(0.5);
    yield* sequence(
        0.1,
        framebuffer_title_ref().fontSize(60, 0.4),
        framebuffer_title_ref().y(-375, 0.4),
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

    const fbo_pixels = createRefArray<Rect>();
    const fbo_padding = 75;
    const fbo_width = ((425 - fbo_padding) * 2);
    const fbo_pix_start = (-425 + fbo_padding);
    const fbo_dim = 12;
    const pixel_size = fbo_width / fbo_dim;
    encloser().add(<>
        {...range(fbo_dim * fbo_dim).map(i => <Rect
            ref={fbo_pixels}
            x={fbo_pix_start + (i % fbo_dim) * (pixel_size+0.5) + (pixel_size / 2)}
            y={-310 + (Math.floor(i / fbo_dim)) * (pixel_size+0.5) + (pixel_size / 2)}
            size={[0,0]} zIndex={0}
            fill={"#111111"} radius={2}
        />)}
    </>);
    yield* sequence(0.05,
        ...range(fbo_dim).map(i => sequence(0.01,
            ...fbo_pixels.slice(i*fbo_dim, (i+1)*fbo_dim).map(t => t.size([pixel_size, pixel_size], 0.5))
        ))
    );
    yield* waitFor(0.5);
    yield* waitUntil("pixelhighlight");
    const angle_sig = createSignal(0);
    yield angle_sig(20, 10, linear);
    
    const view_rect = createRef<Rect>();
    const projectors = createRefArray<Line>();
    const color_lerp = createSignal(0);
    view.add(<>
        <Rect
            ref={view_rect}
            x={-600}
            fill={new Gradient({
                type: "linear",
                from: [-150, 0],
                to:   [150, 0],
                stops: [
                    { offset: 0, color: () => Color.lerp(palette.foreground, "#FF0000", color_lerp()) },
                    { offset: 0.3333, color:  () => Color.lerp(palette.foreground, "#FF0000", color_lerp()) },
                    { offset: 0.3333, color:  () => Color.lerp(palette.foreground, "#00FF00", color_lerp()) },
                    { offset: 0.6666, color:  () => Color.lerp(palette.foreground, "#00FF00", color_lerp()) },
                    { offset: 0.6666, color:  () => Color.lerp(palette.foreground, "#0000FF", color_lerp()) },
                    { offset: 1, color:  () => Color.lerp(palette.foreground, "#0000FF", color_lerp()) },
                ]
            })}
            stroke={new Gradient({
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
            })}
            lineWidth={10} radius={5}
        />
        <Line
            ref={projectors}
            points={() => [
                fbo_pixels[13].getOriginDelta(Origin.TopLeft).add([3,3]).add(fbo_pixels[13].position()),
                view_rect().getOriginDelta(Origin.TopLeft).add(view_rect().position()),
            ]}
            lineWidth={2} zIndex={-1}
            stroke={palette.primary}
            lineDash={[8]} end={0}
        />
        <Line
            ref={projectors}
            points={() => [
                fbo_pixels[13].getOriginDelta(Origin.TopRight).add([-3,3]).add(fbo_pixels[13].position()),
                view_rect().getOriginDelta(Origin.TopRight).add(view_rect().position()),
            ]}
            lineWidth={2} zIndex={-1}
            stroke={palette.primary}
            lineDash={[8]} end={0}
        />
        <Line
            ref={projectors}
            points={() => [
                fbo_pixels[13].getOriginDelta(Origin.BottomRight).add([-3,-3]).add(fbo_pixels[13].position()),
                view_rect().getOriginDelta(Origin.BottomRight).add(view_rect().position()),
            ]}
            lineWidth={2} zIndex={-1}
            stroke={palette.primary}
            lineDash={[8]} end={0}
        />
        <Line
            ref={projectors}
            points={() => [
                fbo_pixels[13].getOriginDelta(Origin.BottomLeft).add([3,-3]).add(fbo_pixels[13].position()),
                view_rect().getOriginDelta(Origin.BottomLeft).add(view_rect().position()),
            ]}
            lineWidth={2} zIndex={-1}
            stroke={palette.primary}
            lineDash={[8]} end={0}
        />
    </>);

    yield* all(
        fbo_pixels[13].scale(0.9, 0.5),
        fbo_pixels[13].lineWidth(5, 0.5),
        fbo_pixels[13].stroke(new Gradient({
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
        }), 0),
        view_rect().size([300,300], 0.5),
        ...projectors.map(p => p.end(1, 0.2)),
    );
    
    yield* waitUntil("RGB");
    yield* all(
        color_lerp(1, 1),
    );

    yield* waitUntil("nomorecolor");
    yield* all(
        fbo_pixels[13].scale(1, 0.5),
        fbo_pixels[13].lineWidth(0, 0.5),
        view_rect().size([0,0], 0.5),
        ...projectors.map(p => p.start(1, 0.2)),
    );

    yield* waitUntil("definechar");
    yield* all(
        encloser().x(encloser().x() + 400, 0.5),
        framebuffer_title_ref().x(framebuffer_title_ref().x() + 400, 0.5)
    );
    
    const encloser_tuah = createRef<Line>(); // SORRY
    view.add(<>
        <Line
            ref={encloser_tuah}
            lineWidth={6} x={-400}
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
            start={0.5} end={0.5}
            fill={palette.foreground}
            {...primary_glow_props}
        />
    </>);
    const bitmap_pixels = createRefArray<Rect>();
    const bitmap_padding = 40;
    const bitmap_width = (((425/2) - bitmap_padding) * 2);
    const bitmap_pix_start = (-(425/2) + bitmap_padding);
    const bitmap_dim = 6;
    const bitmap_pixel_size = bitmap_width / bitmap_dim;

    const bitmap_title_ref = createRef<Txt>();

    encloser_tuah().add(<>
        {...range(bitmap_dim * bitmap_dim).map(i => <Rect
            ref={bitmap_pixels}
            x={bitmap_pix_start + (i % bitmap_dim) * (bitmap_pixel_size+0.5) + (bitmap_pixel_size / 2)}
            y={-150 + (Math.floor(i / bitmap_dim)) * (bitmap_pixel_size+0.5) + (bitmap_pixel_size / 2)}
            size={[0,0]} zIndex={0}
            fill={"#111111"} radius={2}
        />)}
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={bitmap_title_ref}
            text={""}
            fill={palette.text}
            x={0} y={-200}
            fontSize={55}
        />
    </>);
    yield* all(
        encloser_tuah().start(0, 0.5),
        encloser_tuah().end(1, 0.5),
    );
    
    yield* sequence(0.05,
        ...range(bitmap_dim).map(i => sequence(0.01,
            ...bitmap_pixels.slice(i*bitmap_dim, (i+1)*bitmap_dim).map(t => t.size([bitmap_pixel_size, bitmap_pixel_size], 0.5))
        ))
    );

    const bitmap = [
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0,
        0, 1, 0, 0, 1, 0,
        0, 1, 1, 1, 1, 0,
        0, 1, 0, 0, 1, 0,
    ];

    yield* waitUntil("showbitmap");
    yield* sequence(0.1,
        ...bitmap_pixels.filter((v, i) => bitmap[i] == 1).map(v => all(
            chain(v.width(0, 0.2, easeOutCubic), v.width(bitmap_pixel_size, 0.2, easeInCubic)),
            v.fill(palette.accent, 0.2)
        )),
    );

    yield* waitUntil("bitmap_title_drop");
    yield* bitmap_title_ref().text("Bitmap", 0.5);

    yield* waitUntil("map_texture");
    yield* sequence(0.1,
        ...range(bitmap_dim * bitmap_dim).map(i => sequence(0.01,
            flash(bitmap_pixels[i].fill, "yellow", 0.3),
            flashend(fbo_pixels[27+(Math.floor(i/bitmap_dim))*fbo_dim+i%bitmap_dim].fill, "yellow", bitmap[i]==1?palette.accent:"#111111", 0.3),
        )),
    );

    yield* waitUntil("make_it_bigger");
    const boundary_lines = createRefArray<Line>();
    const draggable_corners = createRefArray<Rect>();
    const cursor = createRef<Icon>();
    const animator = createSignal(0);
    yield animator(100, 100, linear);
    view.add(<>
        <Line
            ref={boundary_lines}
            points={[
                fbo_pixels[27].getOriginDelta(Origin.TopLeft).add(fbo_pixels[27].absolutePosition().sub([1920/2, 1080/2])),
                fbo_pixels[87].getOriginDelta(Origin.BottomLeft).add(fbo_pixels[87].absolutePosition().sub([1920/2, 1080/2])),
            ]}
            stroke={palette.primary}
            lineWidth={4} end={0}
            lineDash={[52, 5]}  lineDashOffset={() => animator() * 50}
        />
        <Line
            ref={boundary_lines}
            points={[
                fbo_pixels[87].getOriginDelta(Origin.BottomLeft).add(fbo_pixels[87].absolutePosition().sub([1920/2, 1080/2])),
                fbo_pixels[92].getOriginDelta(Origin.BottomRight).add(fbo_pixels[92].absolutePosition().sub([1920/2, 1080/2])),
            ]}
            stroke={palette.primary}
            lineWidth={4} end={0}
            lineDash={[52, 5]}  lineDashOffset={() => animator() * 50}
        />
        <Line
            ref={boundary_lines}
            points={[
                fbo_pixels[92].getOriginDelta(Origin.BottomRight).add(fbo_pixels[92].absolutePosition().sub([1920/2, 1080/2])),
                fbo_pixels[32].getOriginDelta(Origin.TopRight).add(fbo_pixels[32].absolutePosition().sub([1920/2, 1080/2])),
            ]}
            stroke={palette.primary}
            lineWidth={4} end={0}
            lineDash={[52, 5]}  lineDashOffset={() => animator() * 50}
        />
        <Line
            ref={boundary_lines}
            points={[
                fbo_pixels[32].getOriginDelta(Origin.TopRight).add(fbo_pixels[32].absolutePosition().sub([1920/2, 1080/2])),
                fbo_pixels[27].getOriginDelta(Origin.TopLeft).add(fbo_pixels[27].absolutePosition().sub([1920/2, 1080/2])),
            ]}
            stroke={palette.primary}
            lineWidth={4} end={0}
            lineDash={[52, 5]}  lineDashOffset={() => animator() * 50}
        />
        <Rect
            ref={draggable_corners}
            position={fbo_pixels[27].getOriginDelta(Origin.TopLeft).add(fbo_pixels[27].absolutePosition().sub([1920/2, 1080/2]))}
            size={[0,0]}
            fill={palette.primary}
            radius={4}
        />
        <Rect
            ref={draggable_corners}
            position={fbo_pixels[87].getOriginDelta(Origin.BottomLeft).add(fbo_pixels[87].absolutePosition().sub([1920/2, 1080/2]))}
            size={[0,0]}
            fill={palette.primary}
            radius={4}
        />
        <Rect
            ref={draggable_corners}
            position={fbo_pixels[92].getOriginDelta(Origin.BottomRight).add(fbo_pixels[92].absolutePosition().sub([1920/2, 1080/2]))}
            size={[0,0]}
            fill={palette.primary}
            radius={4}
        />
        <Rect
            ref={draggable_corners}
            position={fbo_pixels[32].getOriginDelta(Origin.TopRight).add(fbo_pixels[32].absolutePosition().sub([1920/2, 1080/2]))}
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
    yield* all(...draggable_corners.map(t => t.size([20, 20], 0.5)));
    yield* all(...boundary_lines.map(t => t.end(1, 0.5)));
    yield* waitUntil("dragit");
    yield* cursor().position(fbo_pixels[32].getOriginDelta(Origin.TopRight).add(fbo_pixels[32].absolutePosition().sub([1920/2, 1080/2])).add([20,20]), 0);
    yield* all(
        cursor().scale(1, 0.25),
        cursor().opacity(1, 0.25),
    );
    yield* all(
        chain(
            cursor().scale(0.8, 0.2),
            all(
                cursor().position(fbo_pixels[11].getOriginDelta(Origin.TopRight).add(fbo_pixels[11].absolutePosition().sub([1920/2, 1080/2])).add([20,20]), 0.5),
                draggable_corners[3].position(fbo_pixels[11].getOriginDelta(Origin.TopRight).add(fbo_pixels[11].absolutePosition().sub([1920/2, 1080/2])), 0.5),
                draggable_corners[2].position(fbo_pixels[95].getOriginDelta(Origin.BottomRight).add(fbo_pixels[95].absolutePosition().sub([1920/2, 1080/2])), 0.5),
                draggable_corners[0].position(fbo_pixels[3].getOriginDelta(Origin.TopLeft).add(fbo_pixels[3].absolutePosition().sub([1920/2, 1080/2])), 0.5),
                boundary_lines[0].points([
                    fbo_pixels[3].getOriginDelta(Origin.TopLeft).add(fbo_pixels[3].absolutePosition().sub([1920/2, 1080/2])),
                    fbo_pixels[87].getOriginDelta(Origin.BottomLeft).add(fbo_pixels[87].absolutePosition().sub([1920/2, 1080/2])),
                ], 0.5),
                boundary_lines[1].points([
                    fbo_pixels[87].getOriginDelta(Origin.BottomLeft).add(fbo_pixels[87].absolutePosition().sub([1920/2, 1080/2])),
                    fbo_pixels[95].getOriginDelta(Origin.BottomRight).add(fbo_pixels[95].absolutePosition().sub([1920/2, 1080/2])),
                ], 0.5),
                boundary_lines[2].points([
                    fbo_pixels[95].getOriginDelta(Origin.BottomRight).add(fbo_pixels[95].absolutePosition().sub([1920/2, 1080/2])),
                    fbo_pixels[11].getOriginDelta(Origin.TopRight).add(fbo_pixels[11].absolutePosition().sub([1920/2, 1080/2])),
                ], 0.5),
                boundary_lines[3].points([
                    fbo_pixels[11].getOriginDelta(Origin.TopRight).add(fbo_pixels[11].absolutePosition().sub([1920/2, 1080/2])),
                    fbo_pixels[3].getOriginDelta(Origin.TopLeft).add(fbo_pixels[3].absolutePosition().sub([1920/2, 1080/2])),
                ], 0.5),
            ),
            cursor().scale(1, 0.2),
        ),
        sequence(0.01,
            ...range(bitmap_dim * bitmap_dim).map(i =>
                fbo_pixels[27+(Math.floor(i/bitmap_dim))*fbo_dim+i%bitmap_dim].fill("#111111", 0.1),
            )
        ),
    )
    yield* all(
        cursor().scale(1.2, 0.25),
        cursor().opacity(0, 0.25),
    );
    yield* cursor().position(fbo_pixels[87].getOriginDelta(Origin.BottomLeft).add(fbo_pixels[87].absolutePosition().sub([1920/2, 1080/2])).add([20,20]), 0);
    yield* all(
        cursor().scale(1.0, 0.25),
        cursor().opacity(1, 0.25),
    );
    yield* chain(
        cursor().scale(0.8, 0.2),
        all(
            cursor().position(fbo_pixels[132].getOriginDelta(Origin.BottomLeft).add(fbo_pixels[132].absolutePosition().sub([1920/2, 1080/2])).add([20,20]), 0.5),
            draggable_corners[1].position(fbo_pixels[132].getOriginDelta(Origin.BottomLeft).add(fbo_pixels[132].absolutePosition().sub([1920/2, 1080/2])), 0.5),
            draggable_corners[2].position(fbo_pixels[143].getOriginDelta(Origin.BottomRight).add(fbo_pixels[143].absolutePosition().sub([1920/2, 1080/2])), 0.5),
            draggable_corners[0].position(fbo_pixels[0].getOriginDelta(Origin.TopLeft).add(fbo_pixels[0].absolutePosition().sub([1920/2, 1080/2])), 0.5),
            boundary_lines[0].points([
                fbo_pixels[0].getOriginDelta(Origin.TopLeft).add(fbo_pixels[0].absolutePosition().sub([1920/2, 1080/2])),
                fbo_pixels[132].getOriginDelta(Origin.BottomLeft).add(fbo_pixels[132].absolutePosition().sub([1920/2, 1080/2])),
            ], 0.5),
            boundary_lines[1].points([
                fbo_pixels[132].getOriginDelta(Origin.BottomLeft).add(fbo_pixels[132].absolutePosition().sub([1920/2, 1080/2])),
                fbo_pixels[143].getOriginDelta(Origin.BottomRight).add(fbo_pixels[143].absolutePosition().sub([1920/2, 1080/2])),
            ], 0.5),
            boundary_lines[2].points([
                fbo_pixels[143].getOriginDelta(Origin.BottomRight).add(fbo_pixels[143].absolutePosition().sub([1920/2, 1080/2])),
                fbo_pixels[11].getOriginDelta(Origin.TopRight).add(fbo_pixels[11].absolutePosition().sub([1920/2, 1080/2])),
            ], 0.5),
            boundary_lines[3].points([
                fbo_pixels[11].getOriginDelta(Origin.TopRight).add(fbo_pixels[11].absolutePosition().sub([1920/2, 1080/2])),
                fbo_pixels[0].getOriginDelta(Origin.TopLeft).add(fbo_pixels[0].absolutePosition().sub([1920/2, 1080/2])),
            ], 0.5),
        ),
        cursor().scale(1, 0.2),
    );
    yield* all(
        cursor().scale(1.2, 0.25),
        cursor().opacity(0, 0.25),
    );

    yield* waitUntil("highlight_bitmap")
    const res_txt = createRef<Txt>();
    encloser_tuah().add(<Txt
        ref={res_txt}
        text={""}
        y={250} fill={palette.text}
    />)
    yield* sequence(0.1,
        ...range(bitmap_dim).map(i => sequence(0.018,
            ...bitmap_pixels.slice(i * bitmap_dim, (i+1) * bitmap_dim).map(t => flash(t.scale, 1.2, 0.3))
        )),
        res_txt().text("6x6", 0.5),
    );
    
    yield* waitUntil("source_bitmap_wiggle");
    yield wiggle(encloser_tuah().rotation, 5, -5, 1.5);
    yield* waitFor(3);
    yield* sequence(0.01,
        ...range(fbo_dim).map(i => sequence(0.01,
            ...fbo_pixels.slice(i * fbo_dim, (i+1) * fbo_dim).map(t => all(flash(t.scale, 0.8, 1.2), wiggle(t.rotation, 3, -3, 1.2))),
        )),
    );

    yield* waitUntil("stretch_gaps");
    const circs = createRefArray<Circle>();
    view.add(<>
        {...bitmap_pixels.map(t => <Circle
            ref={circs}
            position={t.absolutePosition().sub([1920/2, 1080/2])}
            size={[20,20]} fill={t.fill()}
            stroke={palette.text}
        />)}
    </>)
    yield* sequence(0.01,
        ...range(bitmap_dim).map(i => sequence(0.01,
            ...bitmap_pixels.slice(i * bitmap_dim, (i+1) * bitmap_dim).map(t => t.size([0,0], 1.2)),
        ))
    );
    yield* sequence(0.01,
        ...range(bitmap_dim).map(i => sequence(0.01,
            ...circs.slice(i * bitmap_dim, (i+1) * bitmap_dim).map((t,j) => all(
                t.position([
                    108 + (j) * (226-109),
                    -250 + Math.floor(i) * (226-109),
                ], 0.8),
                t.lineWidth(3, 0.8)
            )),
        ))
    )

    yield* waitUntil("zoomin");
    
    yield angle_sig(80, 40, linear)
    view_rect().fill(palette.foreground);
    view_rect().position.x(view_rect().position.x() + 150);
    view_rect().clip(true);

    const zoomed_pixels = createRefArray<Rect>();
    const zoomed_mapped_colors = createRefArray<Circle>();
    view_rect().add(<>
        {...range(4*4).map(i => <Rect
            ref={zoomed_pixels}
            fill={"#111111"}
            position={() => [
                (i%4) * (view_rect().size.x() / 3) - (view_rect().size.x()/2),
                Math.floor(i/4) * (view_rect().size.y() / 3) - (view_rect().size.y()/2),
            ]}
            size={() => [(view_rect().size.x() / 3)-5, (view_rect().size.x() / 3)-5]}
            radius={10}  zIndex={-10}
        />)}
        {...range(4).map(i => <Circle
            ref={zoomed_mapped_colors}
            fill={i % 3 == 0 ? "#111111" : palette.accent}
            position={() => [
                -167 + 333 * (i%2),
                -167 + 333 * Math.floor(i/2),
            ]}
            stroke={palette.text} lineWidth={5}
            size={[30, 30]}
        />)}
    </>)
    projectors[0].points(() => [
        fbo_pixels[28].absolutePosition().sub([1920/2, 1080/2]),
        view_rect().getOriginDelta(Origin.TopLeft).add(view_rect().position()),
    ]);
    projectors[1].points(() => [
        fbo_pixels[31].absolutePosition().sub([1920/2, 1080/2]),
        view_rect().getOriginDelta(Origin.TopRight).add(view_rect().position()),
    ]);
    projectors[2].points(() => [
        fbo_pixels[67].absolutePosition().sub([1920/2, 1080/2]),
        view_rect().getOriginDelta(Origin.BottomRight).add(view_rect().position()),
    ]);
    projectors[3].points(() => [
        fbo_pixels[64].absolutePosition().sub([1920/2, 1080/2]),
        view_rect().getOriginDelta(Origin.BottomLeft).add(view_rect().position()),
    ]);
    projectors.forEach(t => t.start(0));
    projectors.forEach(t => t.end(0));
    yield* sequence(0.8,
        encloser_tuah().position.x(encloser_tuah().position.x() - 1000, 0.8),
        sequence(0.1,
            view_rect().size([500, 500], 0.8),
            all(
                ...projectors.map(t => t.end(1, 0.8))
            )
        ),
    );

    yield* waitUntil("btwnpixels");
    yield* sequence(0.1,
        flash(zoomed_pixels[ 5].fill, "yellow", 0.5),
        flash(zoomed_pixels[ 6].fill, "yellow", 0.5),
        flash(zoomed_pixels[ 9].fill, "yellow", 0.5),
        flash(zoomed_pixels[10].fill, "yellow", 0.5),
    );
    const pix_circs = createRefArray<Circle>();
    const pix_lines = createRefArray<Line>();
    zoomed_pixels.forEach((v, i) => v.add(<>
        <Circle
            ref={pix_circs}
            size={[0, 0]}
            lineWidth={2}
            stroke={palette.text}
        />
        <Line
            ref={pix_lines}
            points={[
                [0, 0],
                (i % 2 == 0 && i % 8 < 4) ? [(view_rect().size.x() / 6)-5, (view_rect().size.x() / 6)-5] :
                (i % 2 == 1 && i % 8 < 4) ? [-(view_rect().size.x() / 6)+5, (view_rect().size.x() / 6)-5] :
                (i % 2 == 0 && i % 8 >= 4) ? [(view_rect().size.x() / 6)-5, -(view_rect().size.x() / 6)+5] :
                (i % 2 == 1 && i % 8 >= 4) ? [-(view_rect().size.x() / 6)+5, -(view_rect().size.x() / 6)+5] : [0, 0]
            ]}
            lineWidth={2}
            stroke={palette.text}
            lineDash={[10, 4]} lineDashOffset={() => angle_sig()}
            end={0}
        />
    </>));
    yield* all(
        ...pix_circs.map(t => t.size([10, 10], 0.5)),
    )

    yield* waitUntil("nearest_op");
    yield* all(
        ...pix_lines.map(t => t.end(1, 0.5)),
    );
    yield* waitFor(2);
    const tinybitmap = [
        0,0,1,1,
        0,0,1,1,
        1,1,0,0,
        1,1,0,0,
    ];
    const bigbitmap = [
        0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,1,1,0,0,0,0,
        0,0,0,0,0,0,1,1,0,0,0,0,
        0,0,0,0,1,1,0,0,1,1,0,0,
        0,0,0,0,1,1,0,0,1,1,0,0,
        0,0,1,1,0,0,0,0,1,1,0,0,
        0,0,1,1,0,0,0,0,1,1,0,0,
        0,0,1,1,1,1,1,1,1,1,0,0,
        0,0,1,1,1,1,1,1,1,1,0,0,
        0,0,1,1,0,0,0,0,1,1,0,0,
        0,0,1,1,0,0,0,0,1,1,0,0,
    ];
    yield* all(
        ...pix_lines.map(t => t.start(1, 0.5)),
        ...zoomed_pixels.map((t,i) => t.fill(tinybitmap[i]==1 ? palette.accent : "#111111", 0.4)),
        ...fbo_pixels.map((t,i) => t.fill(bigbitmap[i]==1 ? palette.accent : "#111111", 0.4))
    )
    yield* waitUntil("clear_nearest");
    yield* all(
        ...zoomed_pixels.map((t,i) => t.fill("#111111", 0.4)),
        ...fbo_pixels.map((t,i) => t.fill("#111111", 0.4))
    );

    yield* waitUntil("mix_anim");
    const mix_lines = createRefArray<Line>();
    view.add(<>
        {...range(4).map(i => <Line
            ref={mix_lines}
            points={[
                zoomed_pixels[5].absolutePosition().sub([1920/2, 1080/2]),
                zoomed_pixels[0].size().scale(-1/2).add([
                    (i % 2) * zoomed_pixels[0].size.x() * 2,
                    Math.floor(i / 2) * zoomed_pixels[0].size.y() * 2,
                ]).add(zoomed_pixels[5].absolutePosition().sub([1920/2, 1080/2])),
            ]}
            lineWidth={2}
            stroke={palette.text}
            lineDash={[10, 4]} lineDashOffset={() => angle_sig()}
            zIndex={5} end={0}
        />)}
        {...range(4).map(i => <Line
            ref={mix_lines}
            points={[
                zoomed_pixels[6].absolutePosition().sub([1920/2, 1080/2]),
                zoomed_pixels[0].size().mul([-3/2, -1/2]).add([
                    (i % 2) * zoomed_pixels[0].size.x() * 2,
                    Math.floor(i / 2) * zoomed_pixels[0].size.y() * 2,
                ]).add(zoomed_pixels[6].absolutePosition().sub([1920/2, 1080/2])),
            ]}
            lineWidth={2}
            stroke={palette.text}
            lineDash={[10, 4]} lineDashOffset={() => angle_sig()}
            zIndex={5} end={0}
        />)}
        {...range(4).map(i => <Line
            ref={mix_lines}
            points={[
                zoomed_pixels[9].absolutePosition().sub([1920/2, 1080/2]),
                zoomed_pixels[0].size().mul([-1/2, -3/2]).add([
                    (i % 2) * zoomed_pixels[0].size.x() * 2,
                    Math.floor(i / 2) * zoomed_pixels[0].size.y() * 2,
                ]).add(zoomed_pixels[9].absolutePosition().sub([1920/2, 1080/2])),
            ]}
            lineWidth={2}
            stroke={palette.text}
            lineDash={[10, 4]} lineDashOffset={() => angle_sig()}
            zIndex={5} end={0}
        />)}
        {...range(4).map(i => <Line
            ref={mix_lines}
            points={[
                zoomed_pixels[10].absolutePosition().sub([1920/2, 1080/2]),
                zoomed_pixels[0].size().mul([-3/2, -3/2]).add([
                    (i % 2) * zoomed_pixels[0].size.x() * 2,
                    Math.floor(i / 2) * zoomed_pixels[0].size.y() * 2,
                ]).add(zoomed_pixels[10].absolutePosition().sub([1920/2, 1080/2])),
            ]}
            lineWidth={2}
            stroke={palette.text}
            lineDash={[10, 4]} lineDashOffset={() => angle_sig()}
            zIndex={5} end={0}
        />)}
    </>)
    const bilerpmap = [
        "#111111", "#111111", "#111111", "#111111",
        "#111111", "#9C2881", "#C331A2", "#111111",
        "#111111", "#C331A2", "#9C2881", "#111111",
        "#111111", "#111111", "#111111", "#111111",
    ]
    yield* sequence(0.1,
        ...mix_lines.slice(0, 4).map(t => t.end(1, 0.5)),
    )
    yield* waitFor(2);
    yield* sequence(0.1,
        ...mix_lines.slice(0, 4).map(t => t.end(0, 0.5)),
        zoomed_pixels[5].fill(bilerpmap[5], 0.7),
    );

    yield* sequence(0.4,
        chain(
            sequence(0.1,
                ...mix_lines.slice(4, 8).map(t => t.end(1, 0.5)),
            ),
            sequence(0.1,
                ...mix_lines.slice(4, 8).map(t => t.end(0, 0.5)),
                zoomed_pixels[6].fill(bilerpmap[6], 0.7),
            )
        ),
        chain(
            sequence(0.1,
                ...mix_lines.slice(8, 12).map(t => t.end(1, 0.5)),
            ),
            sequence(0.1,
                ...mix_lines.slice(8, 12).map(t => t.end(0, 0.5)),
                zoomed_pixels[9].fill(bilerpmap[9], 0.7),
            )
        ),
        chain(
            sequence(0.1,
                ...mix_lines.slice(12, 16).map(t => t.end(1, 0.5)),
            ),
            sequence(0.1,
                ...mix_lines.slice(12, 16).map(t => t.end(0, 0.5)),
                zoomed_pixels[10].fill(bilerpmap[10], 0.7),
            )
        ),
    )

    yield* waitFor(3);
    
    const bigbilerpmap = [
        "#111111", "#111111", "#111111", "#111111", "#111111", "#111111", "#111111", "#111111", "#111111", "#111111", "#111111", "#111111",
        "#111111", "#111111", "#111111", "#111111", "#111111", "#451639", "#721E5E", "#721E5E", "#451639", "#111111", "#111111", "#111111",
        "#111111", "#111111", "#111111", "#111111", "#111111", "#721E5E", "#BA2F9B", "#BA2F9B", "#721E5E", "#111111", "#111111", "#111111",
        "#111111", "#111111", "#111111", "#451639", "#721E5E", "#9C2881", "#C331A2", "#C331A2", "#9C2881", "#721E5E", "#451639", "#111111",
        "#111111", "#111111", "#111111", "#721E5E", "#BA2F9B", "#C331A2", "#9C2881", "#9C2881", "#C331A2", "#BA2F9B", "#721E5E", "#111111",
        "#111111", "#451639", "#721E5E", "#9C2881", "#C331A2", "#BA2F9B", "#721E5E", "#82226B", "#D336B0", "#D336B0", "#82226B", "#111111",
        "#111111", "#721E5E", "#BA2F9B", "#C331A2", "#9C2881", "#721E5E", "#451639", "#82226B", "#D336B0", "#D336B0", "#82226B", "#111111",
        "#111111", "#82226B", "#D336B0", "#DB37B6", "#9C2881", "#82226B", "#82226B", "#A72A8A", "#DB37B6", "#D336B0", "#82226B", "#111111",
        "#111111", "#82226B", "#D336B0", "#E93BC2", "#DB37B6", "#D336B0", "#D336B0", "#DB37B6", "#E93BC2", "#D336B0", "#82226B", "#111111",
        "#111111", "#82226B", "#D336B0", "#E93BC2", "#DB37B6", "#D336B0", "#D336B0", "#DB37B6", "#E93BC2", "#D336B0", "#82226B", "#111111",
        "#111111", "#82226B", "#D336B0", "#DB37B6", "#A72A8A", "#82226B", "#82226B", "#A72A8A", "#DB37B6", "#D336B0", "#82226B", "#111111",
        "#111111", "#82226B", "#D336B0", "#D336B0", "#82226B", "#111111", "#111111", "#82226B", "#D336B0", "#D336B0", "#82226B", "#111111",
    ];
    yield* all(
        ...fbo_pixels.map((t, i) => t.fill(bigbilerpmap[i], 0.5))
    );

    yield* waitUntil("unshowbitmaps");
    yield* sequence(0.1,
        all(
            ...projectors.map(t => t.start(1, 0.5)),
        ),
        view_rect().size([0,0], 0.5),
    );
    yield* waitUntil("unshow_fbo");
    res_txt().remove();
    yield* sequence(0.1,
        sequence(0.2,
            encloser_tuah().x(0, 1.2),
            encloser_tuah().scale(1.4, 1.1),
            sequence(0.05,
                ...bitmap_pixels.map(t => t.size([bitmap_pixel_size, bitmap_pixel_size], 0.5))
            )
        ),
        all(
            encloser().x(encloser().x() + 1800, 1.2),
            ...draggable_corners.map(t=>t.x(t.x() + 1800, 1.2)),
            ...boundary_lines.map(t=>t.x(t.x() + 1800, 1.2)),
            ...circs.map(t=>t.x(t.x() + 1800, 1.2)),
            framebuffer_title_ref().x(framebuffer_title_ref().x() + 1800, 1.2),
        )
    );
    
    yield* waitUntil("constraints_impossible");
    const center_line = createRef<Line>();
    const divider_lines = createRefArray<Line>();
    const my_d = createRef<Txt>();
    const center_pack = createRef<Node>();
    view.add(<>
        <Node ref={center_pack} x={2000} y={1000}>
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
        </Node>
    </>);
    yield* all(
        center_pack().position([0, 0], 1.5),
        encloser_tuah().position([-550, -300], 1.5),
        encloser_tuah().scale(0.8, 1),
    );
    yield* waitFor(2);
    yield* all(
        center_pack().position(center_pack().position().add([-2000, 1000]), 1.5),
        encloser_tuah().position(encloser_tuah().position().add([-2000, 1000]), 1.5),
    );

    yield* waitUntil("vectorfonts");
    
    const vecfont_title_ref = createRef<Txt>();
    view.add(<>
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={vecfont_title_ref}
            text={""}
            fill={palette.text}
            x={0} y={0}
            fontSize={120}
        />
    </>);
    yield* vecfont_title_ref().text("Vector Fonts", 0.7);

    yield* waitUntil("end");
});