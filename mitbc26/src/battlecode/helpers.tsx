import { Origin, Vector2 } from "@motion-canvas/core";

const dx_offset_lookup: Record<Origin, number> = {
    [Origin.TopLeft]: -1,
    [Origin.Left]: -1,
    [Origin.BottomLeft]: -1,
    
    [Origin.TopRight]: 1,
    [Origin.Right]: 1,
    [Origin.BottomRight]: 1,

    [Origin.Top]: 0,
    [Origin.Middle]: 0,
    [Origin.Bottom]: 0,
}

const dy_offset_lookup: Record<Origin, number> = {
    [Origin.TopLeft]: -1,
    [Origin.Top]: -1,
    [Origin.TopRight]: -1,

    [Origin.BottomLeft]: 1,
    [Origin.Bottom]: 1,
    [Origin.BottomRight]: 1,
    
    [Origin.Left]: 0,
    [Origin.Middle]: 0,
    [Origin.Right]: 0,
}

export function add_dir(p: Vector2, d: Origin) {
    return p.addX(dx_offset_lookup[d]).addY(dy_offset_lookup[d]);
}