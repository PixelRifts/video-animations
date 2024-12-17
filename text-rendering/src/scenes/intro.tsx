import { Layout, Line, Node, Rect, Txt, Video, makeScene2D, useScene2D } from "@motion-canvas/2d";
import { all, chain, createRef, createRefArray, createSignal, easeInCubic, easeOutCubic, linear, range, run, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { primary_glow_props, palette } from "../lib/palette";
import { delayed_exec, lerp } from "../lib/utilities";
import { Three } from "../lib/three_canvas";
import * as THREE from "three";

import blender_disp_vid from "../extern/BlenderShow.mp4";
import unity_disp_vid from "../extern/UnityShow.mp4";
import vscode_disp_vid from "../extern/VSCodeShow.mp4";
import pdf_disp_vid from "../extern/PDFShow2.mp4";
import jpdf_disp_vid from "../extern/JapanesePDFShow.mp4";
import a_bitmap_tex_src from "../extern/A_Bitmap.png";
import { TypedText } from "../lib/typing";

let a_bitmap_texture = new THREE.TextureLoader().load(a_bitmap_tex_src);
a_bitmap_texture.magFilter = THREE.NearestFilter;
a_bitmap_texture.minFilter = THREE.NearestFilter;

export default makeScene2D(function* (view) {
    const tr_characters = createRefArray<Txt>();
    const str = "Text Rendering";
    const xdist = 80;
    view.add(<>
        <Node x={-(((str.length-1)/2)*xdist)}>
            {[...str].map((c, i) => <Txt
                fontFamily={"Jetbrains Mono"}
                ref={tr_characters}
                text={c}
                fill={palette.text}
                x={i*xdist} y={120}
                opacity={0}
                fontSize={40}
            />)}
        </Node>
    </>);
    yield* waitUntil("title_hit");
    yield* sequence(0.03,
        ...tr_characters.map(t => sequence(0.02,
            t.y(0, 1),
            t.opacity(1, 1),
            t.fontSize(120, 1),
        ))
    );
    yield* waitUntil("title_split");
    yield* all(
        ...tr_characters.slice(0, 4).map(t => t.x(t.x() -1400, 0.6)),
        ...tr_characters.slice(4, tr_characters.length).map(t => t.x(t.x() +1400, 0.6)),
    );

    yield* waitUntil("showcases");
    const videos = createRefArray<Video>();
    view.add(<>
        <Video
            ref={videos}
            src={blender_disp_vid}
            x={-350} y={-200+20}
            scale={0.5} padding={20}
            lineWidth={20} stroke={palette.primary}
            radius={5} opacity={0}
            {...primary_glow_props}
        />
        <Video
            ref={videos}
            src={vscode_disp_vid}
            x={0} y={20}
            scale={0.5} padding={20}
            lineWidth={20} stroke={palette.primary}
            radius={5} opacity={0}
            {...primary_glow_props}
        />
        <Video
            ref={videos}
            src={unity_disp_vid}
            x={350} y={200+20}
            scale={0.5} padding={20}
            lineWidth={20} stroke={palette.primary}
            radius={5} opacity={0}
            {...primary_glow_props}
        />
        <Video
            ref={videos}
            src={pdf_disp_vid}
            x={350} y={-210+20}
            scale={0.5} padding={20}
            lineWidth={20} stroke={palette.primary}
            radius={5} opacity={0}
            {...primary_glow_props}
        />
        <Video
            ref={videos}
            src={jpdf_disp_vid}
            x={-310} y={230+20}
            scale={0.5} padding={20}
            lineWidth={20} stroke={palette.primary}
            radius={5} opacity={0}
            {...primary_glow_props}
        />
    </>);

    videos.forEach(v => v.play());
    yield* sequence(2.,
        ...videos.map(v => all(
            v.y(v.y() - 20, 0.2),
            v.opacity(1, 0.2)
        ))
    );

    yield* waitUntil("placingchars_onscreen");
    yield* sequence(0.05,
        videos[4].y(videos[4].y() + 800, .4),
        videos[3].y(videos[3].y() - 800, .4),
        videos[2].x(videos[2].x() + 1200, .4),
        videos[1].y(videos[1].y() + 1200, .4),
        videos[0].y(videos[0].y() - 700, .4),
    );

    view.removeChildren();
    yield* waitUntil("simplest_method");

    
    const { x: canvasWidth, y: canvasHeight } = useScene2D().getSize();
    let aspect = canvasWidth / canvasHeight;
    let mapper = createRef<Three>();
    let camera = new THREE.PerspectiveCamera(50, aspect);
    camera.position.setZ(10);
    let mapped_texture_mesh = new THREE.Mesh(
        new THREE.ShapeGeometry(
            new THREE.Shape([
                new THREE.Vector2(-1, -1),
                new THREE.Vector2( 1, -1),
                new THREE.Vector2( 1,  1),
                new THREE.Vector2(-1,  1),
            ]),
        1),
        new THREE.MeshBasicMaterial({
            "map": a_bitmap_texture,
            "side": THREE.DoubleSide,
            "blending": THREE.CustomBlending,
        }),
    );
    mapped_texture_mesh.geometry.setAttribute("uv", new THREE.BufferAttribute(
        new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]), 2, false)
    );
    mapped_texture_mesh.scale.set(1.5,1.5,1.5);
    const lang = createRef<TypedText>();
    view.add(<>
        <Three
            ref={mapper}
            width={1920}
            height={1080}
            x={-450} y={-200}
            quality={1}
            camera={camera}
            onRender={renderer => renderer.clear()}
            zoom={45}
            opacity={0}
        />
        <TypedText
            ref={lang}
            initial_text={""}
            fontFamily={"Jetbrains Mono"}
            x={-450} y={250}
            fontSize={120}
            hidden={true}
        />
    </>);
    const time = createSignal(0);
    mapper().onRender = (renderer) => {
        mapped_texture_mesh.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), -time()*4);
        renderer.setClearColor("#031022", 0);
        renderer.clearColor();
        renderer.render(mapped_texture_mesh, camera);
    };
    yield time(9, 9, linear);
    yield* all(
        mapper().opacity(1, 0.5),
        mapper().y(-280, 0.5)
    );
    yield* waitFor(1.5);
    yield* lang().type("こんにちは\nせ", 1.);
    yield* lang().text().text("こんにちは\n世", .1);
    yield* lang().type("かい", .22);
    yield* lang().text().text("こんにちは\n世界", 0);
    yield* waitUntil("letsgo");
    yield* all(
        mapper().opacity(0, 0.6),
        lang().opacity(0, 0.6),
    );

    view.removeChildren();
    yield* waitUntil("before_text");
    const new_txt = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    const chars_again = createRefArray<Txt>();
    const xdist_AGAIN = 50;
    let x = 0, y = -240;
    view.add(
        <Node x={-1200}>
            {[...new_txt].map((c, i) => {
                if ((i+1) % 70 == 0) {
                    y += 120;
                    x = 0;
                }
                const tmp = <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={chars_again}
                    text={c}
                    fill={palette.text}
                    x={x} y={y}
                    opacity={0}
                    fontSize={40}
                />;
                x += xdist_AGAIN;
                return tmp;
            })}
        </Node>
    );
    yield* sequence(0.005,
        ...chars_again.map(t => sequence(0.02,
            t.y(t.y()-120, 1),
            t.opacity(1, 1),
            t.fontSize(80, 1),
        ))
    );
    yield* waitUntil("isolate");
    
    yield* sequence(0.1,
        chain(
            all(chars_again[248-16].fontSize(1023, 1.),
            chars_again[248-16].x(1175, 1.)),
            all(chars_again[248-16].x(1200, 0.7, easeInCubic),
            chars_again[248-16].fontSize(342, 0.7, easeInCubic)),
        ),
        all(
            ...chars_again.filter((v, i) => ((i+1) % 70 < 23 && i != 248 - 16)).map(c => c.x(c.x() - 1200, 0.5)),
            ...chars_again.filter((v, i) => (!((i+1) % 70 < 23) && i != 248 - 16)).map(c => c.x(c.x() + 1200, 0.5)),
        )
    );
    chars_again.filter((v, i) => i != 248 - 16).forEach(c => c.remove());

    yield* waitUntil("4ways");
    const center_line = createRef<Line>();
    const divider_lines = createRefArray<Line>();
    view.add(<>
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
                [-220, 0],
                [-2000, 0],
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
        <Line
            ref={divider_lines}
            points={[
                [220, 0],
                [2000, 0],
            ]}
            end={0}
            lineWidth={50} stroke={palette.primary}
        />
    </>);
    yield center_line().end(1, 2., linear);
    yield* chain(
        waitFor(0.5),
        divider_lines[1].end(1, 0.4),
        waitFor(0.1),
        divider_lines[2].end(1, 0.4),
        waitFor(0.1),
        divider_lines[3].end(1, 0.4),
        waitFor(0.1),
        divider_lines[0].end(1, 0.4),
    );

    yield* waitFor(1.2);
    yield* all(
        center_line().position([2000, 1000], 0.6),
        ...divider_lines.map(t => t.position([2000, 1000], 0.6)),
        chars_again[248-16].position(chars_again[248-16].position().add([2000,1000]), 0.6),
    )




    yield* waitUntil("end");
});