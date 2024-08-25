import { Txt, withDefaults } from "@motion-canvas/2d";
import { Color } from "@motion-canvas/core";
import { by_palette, shadow_color } from "./colors";

export const RegularText = withDefaults(Txt, {
    fontFamily: "Roboto Condensed",
    fill: by_palette[2],
    fontSize: 66,
    shadowOffsetY: 5,
    shadowBlur: 0,
    shadowColor: shadow_color(by_palette[2]),
});
