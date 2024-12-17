import {Circle, makeScene2D, useScene2D} from '@motion-canvas/2d';
import {createRef, easeInOutCubic, linear, tween, waitFor, waitUntil} from '@motion-canvas/core';
import * as THREE from 'three';
import { Three } from '../lib/three_canvas';

const basic_material = new THREE.MeshBasicMaterial({
  color: 0x777777,
  side: THREE.FrontSide,
  wireframe: true,
});
const mesh = new THREE.Mesh(
  new THREE.SphereGeometry(20),
  basic_material
);

export default makeScene2D(function* (view) {
  const { x: canvasWidth, y: canvasHeight } = useScene2D().getSize();
  let aspect = canvasWidth / canvasHeight;
  // const camera = new THREE.OrthographicCamera(-aspect, aspect);\
  const camera = new THREE.PerspectiveCamera(50, aspect);
  camera.position.setZ(50);
  

  let t = createRef<Three>();
  view.add(<>
    <Three
      ref={t}
      width={1080}
      height={720}
      quality={1 / 5}
      camera={camera}
      onRender={renderer => renderer.clear()}
      zoom={45}
    />
  </>);

  t().onRender = renderer => {
    renderer.autoClear = false;
    renderer.clear();
    renderer.render(mesh, camera);
  };
  yield* tween(2, t => mesh.rotateY(0.1 * t));
  










  yield* waitFor(3);
  yield* waitUntil("end");
});
