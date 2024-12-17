import { Gradient } from "@motion-canvas/2d";
import { Color, SimpleSignal } from "@motion-canvas/core";


export let palette = {
    primary: "#72a8f4",
    secondary: "#9171F2",
    accent: "#f03dc8",
    

    background: "#031022",
    foreground: new Color("#031022").brighten(),
    foreground_secondary: "#332C49",
    text: "#dbe9fc",

    primary_shadow: new Color("#72a8f4").darken(3),
    secondary_shadow: new Color("#9171F2").darken(3),
};

export let primary_glow_props = {
    shadowOffsetX: 12,
    shadowOffsetY: 12,
    shadowColor: palette.primary_shadow,
    shadowBlur: 15,
};

export let secondary_glow_props = {
    shadowOffsetX: 12,
    shadowOffsetY: 12,
    shadowColor: palette.secondary_shadow,
    shadowBlur: 15,
};


export function soft_gradient(fromX: number, toX: number) {
    return new Gradient({
        type: "linear",
        from: [-500, 0],
        to:   [500, 0],
        stops: [
            { offset: 0, color: "#09f1b8" },
            { offset: 0.33, color: "#00a2ff" },
            { offset: 0.66, color: "#ff00d2" },
            { offset: 1, color: "#fed90f" },
        ]
    });
};

export const rainbow = new Gradient({
    type: "conic",
    angle: 0,
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
export function offset_rainbow(a: SimpleSignal<number>) {
    return new Gradient({
        type: "conic",
        angle: () => a(),
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

}