import { Color, PossibleColor } from "@motion-canvas/core";

export const softred = "#DD3355";
export const softgreen = "#33DD55";
export const softblue = "#118ff0";
export const softpurple = "#DD55DD";
export const softyellow = "#DDDD55";
export const softorange = "#f29a1f";
export const softteal = "#2bedb3";

export const by_palette = [
    "#779ecc",
    "#9fc0de",
    "#f2c894",
    "#ffb347",
    "#ff985a",
];

export function shadow_color(color: PossibleColor) {
    return new Color(color).brighten(1).alpha(0.5);
}