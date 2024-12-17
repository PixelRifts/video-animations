import { Txt, makeScene2D, useScene2D } from "@motion-canvas/2d";
import { createRef, createSignal, debug, linear, waitFor, waitUntil } from "@motion-canvas/core";
import { palette } from "../lib/palette";
import { TypedText } from "../lib/typing";
import { Three } from "../lib/three_canvas";
import * as THREE from 'three';

import a_bitmap_png from "../extern/A_Bitmap.png";
import { ProjectedShape } from "../lib/projected";
let metal_texture = new THREE.TextureLoader().load(a_bitmap_png);
metal_texture.magFilter = THREE.NearestFilter;
metal_texture.minFilter = THREE.NearestFilter;

export default makeScene2D(function* (view) {
    let aspect = 1080 / 720;
    let typer = createRef<TypedText>();

    let mapper = createRef<Three>();
    let camera = new THREE.PerspectiveCamera(50, aspect);
    camera.position.setZ(20);

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
            "map": metal_texture,
            "side": THREE.DoubleSide,
            "blending": THREE.CustomBlending,
        }),
    );
    mapped_texture_mesh.geometry.setAttribute("uv", new THREE.BufferAttribute(
        new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]), 2, false)
    );
    mapped_texture_mesh.position.setX(-4);
    const sp = [-4, 0, 0], ep = [-1, 0, 6];
    mapped_texture_mesh.scale.set(3,3,3);

    const shape = createRef<ProjectedShape>();
    view.add(<>
        <TypedText
            ref={typer}
            fontSize={250}
            initial_text={""}
            hidden={false}
        />
        <Three
            ref={mapper}
            width={1920}
            height={1080}
            quality={1}
            camera={camera}
            onRender={renderer => renderer.clear()}
            zoom={45}
        />

        <ProjectedShape
            ref={shape}
            position={[400, 0]}
            camera={camera}
            points={[
                new THREE.Vector3(-100, -100, 1),
                new THREE.Vector3( 100, -100, 1),
                new THREE.Vector3( 100,  100, 1),
                new THREE.Vector3(-100,  100, 1),
            ]}
        />
    </>);
    const time = createSignal(0);
    mapper().onRender = (renderer) => {
        mapped_texture_mesh.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), -time() * 0.5);
        mapped_texture_mesh.position.set(ep[0] * time() + sp[0] * (1-time()), ep[1] * time() + sp[1] * (1-time()), ep[2] * time() + sp[2] * (1-time()));
        renderer.setClearColor("#031022", 0);
        renderer.clearColor();
        renderer.render(mapped_texture_mesh, camera);
    };



    yield* waitUntil("prog");
    yield time(1, 1);
    yield* typer().type("私", 2);
    yield* typer().hidden(true, 0);

    yield* shape().points([
        new THREE.Vector3(-100+50, -100, 1+1),
        new THREE.Vector3( 100+50, -100, 1+2),
        new THREE.Vector3( 100+50,  100, 1+1),
        new THREE.Vector3(-100+50,  100, 1),
    ], 1);

    yield* waitFor(3);
    yield* waitUntil("end");
});