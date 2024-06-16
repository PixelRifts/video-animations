import { Layout } from "@motion-canvas/2d";
import { Origin, Vector2 } from "@motion-canvas/core";

export function getAbsolutePosition(item: Layout, origin: Origin, offset = [0, 0]): Vector2 {
    return new Vector2(offset[0], offset[1]).add(item.position().add(item.getOriginDelta(origin)));
}
