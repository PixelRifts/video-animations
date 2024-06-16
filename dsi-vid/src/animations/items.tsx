import { View2D, Video, Txt, Img, Node } from "@motion-canvas/2d/lib/components";
import { waitUntil } from "@motion-canvas/core/lib/flow";
import { Reference, createRef } from "@motion-canvas/core/lib/utils";
import { fadeInUp, fadeOutDown, fadeOutUp } from "./io";
import { Color, PossibleColor, PossibleVector2, Vector2 } from "@motion-canvas/core/lib/types";
import { CameraView } from "@ksassnowski/motion-canvas-camera";
import { NeonText } from "../neon/neon_items";


export function* video(view: View2D, name: string, vidsrc: string) {
  yield* waitUntil("play__" + name);
  const thevideo = createRef<Video>();
  view.add(
    <Video
      ref={thevideo}
      src={vidsrc}
      width={'100%'}
      height={'100%'}
      y={40}
      radius={10}
      smoothCorners
      opacity={0}
      clip
    />
  );
  thevideo().play();
  yield* fadeInUp(thevideo);

  yield* waitUntil("end__" + name);
  yield* fadeOutUp(thevideo);
}

export function* sized_video(view: View2D, name: string, vidsrc: string, size: [number, number] | [`${number}%`, `${number}%`]) {
  yield* waitUntil("play__" + name);
  const thevideo = createRef<Video>();
  view.add(
    <Video
      ref={thevideo}
      src={vidsrc}
      width={size[0]}
      height={size[1]}
      y={40}
      radius={10}
      smoothCorners
      opacity={0}
      clip
    />
  );
  thevideo().play();
  yield* fadeInUp(thevideo);

  yield* waitUntil("end__" + name);
  yield* fadeOutUp(thevideo);
}

export function* placed_video(view: View2D, name: string, vidsrc: string, pos: [number, number], size: [number, number]) {
  yield* waitUntil("play__" + name);
  const thevideo = createRef<Video>();
  view.add(
    <Video
      ref={thevideo}
      src={vidsrc}
      position={pos}
      size={size}
      radius={10}
      smoothCorners
      opacity={0}
      clip
    />
  );
  thevideo().play();
  yield* fadeInUp(thevideo);

  yield* waitUntil("end__" + name);
  yield* fadeOutUp(thevideo);
}

export function* placed_text(view: View2D, name: string, text: string, color: PossibleColor, pos: PossibleVector2, size: number = 48) {
  yield* waitUntil("show__" + name);
  const thetxt = createRef<Txt>();
  view.add(
    <Txt
      ref={thetxt}
      fontFamily={"Cascadia Code"}
      fontSize={size}
      fill={color}
      position={pos}
      opacity={0}
      text={text}
    />
  );
  yield* fadeInUp(thetxt);
  yield* waitUntil("unshow__" + name);
  yield* fadeOutUp(thetxt);
}

export function* middle_text(view: View2D, name: string, text: string, color: PossibleColor, size: number = 48) {
  yield* waitUntil("show__" + name);
  const thetxt = createRef<Txt>();
  view.add(
    <Txt
      ref={thetxt}
      fontFamily={"Fira Code"}
      fill={color}
      fontSize={size}
      fontStyle={"italic"}
      opacity={0}
      y={40}
      text={text}
    />
  );
  yield* fadeInUp(thetxt);

  yield* waitUntil("unshow__" + name);
  yield* fadeOutUp(thetxt);
}

export function* sized_image(view: View2D, name: string, src: string, size: [number, number] | [`${number}%`, `${number}%`]) {
  yield* waitUntil("show__" + name);
  const theimg = createRef<Img>();
  view.add(
    <Img
      ref={theimg}
      fontFamily={"Cascadia Code"}
      src={src}
      size={size}
      opacity={0}
      y={40}
      radius={5}
    />
  );
  yield* fadeInUp(theimg);

  yield* waitUntil("unshow__" + name);
  yield* fadeOutUp(theimg);
}

export function* correction(view: Node, id: string, text: string, offset_y: number, size: number = 36, color: Color = new Color("#832")) {
  yield* waitUntil("show__" + id);
  const thetxt = createRef<Txt>();
  view.add(
    <NeonText
      ref={thetxt}
      size={size}
      glow={color}
      position={[0, offset_y+40]}
      opacity={0}
      txt={"** " + text}
    />
  );
  yield* fadeInUp(thetxt);
  yield* waitUntil("unshow__" + id);
  yield* fadeOutDown(thetxt);
}
export function* notification(view: Node, id: string, text: string, offset_y: number, size: number = 36, color: Color = new Color("#832")) {
  yield* waitUntil("show__" + id);
  const thetxt = createRef<Txt>();
  view.add(
    <NeonText
      ref={thetxt}
      size={size}
      glow={color}
      position={[0, offset_y+40]}
      opacity={0}
      txt={text}
    />
  );
  yield* fadeInUp(thetxt);
  yield* waitUntil("unshow__" + id);
  yield* fadeOutDown(thetxt);
  thetxt().remove();
}

export function* notification_placed(view: Node, id: string, text: string, offset_x: number, offset_y: number, size: number = 36, color: Color = new Color("#832")) {
  yield* waitUntil("show__" + id);
  const thetxt = createRef<Txt>();
  view.add(
    <NeonText
      ref={thetxt}
      size={size}
      glow={color}
      position={[offset_x, offset_y+40]}
      opacity={0}
      txt={text}
    />
  );
  yield* fadeInUp(thetxt);
  yield* waitUntil("unshow__" + id);
  yield* fadeOutDown(thetxt);
}
