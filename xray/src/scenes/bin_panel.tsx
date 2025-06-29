import { Rect, RectProps } from "@motion-canvas/2d";

import svgone from "./XRayJamLogo_One.svg"
import svgzer from "./XRayJamLogo_Zero.svg"

export interface BinPanelProps extends RectProps {
    init_heights: number[];
    wave_scale: number;
    sound_wave_scale: number;
}

export class BinPanel extends Rect {
    public heights: number[];
    public wave_scale: number;
    public sound_wave_scale: number;
    
    private svgCache: Record<"0" | "1", HTMLImageElement> = {
        "0": new Image(),
        "1": new Image(),
    };

    constructor(props: BinPanelProps) {
        super(props);

        this.heights = props.init_heights;
        this.wave_scale = props.wave_scale;
        this.sound_wave_scale = props.sound_wave_scale;

          
        this.svgCache["0"].src = svgzer;
        this.svgCache["1"].src = svgone;
    }

    protected draw(context: CanvasRenderingContext2D): void {
        const cols = 24;
        const rows = 11;
        const cellWidth = 40.1;
        const cellHeight = 47;

        const gridWidth = cols * cellWidth;
        const gridHeight = rows * cellHeight;

        context.save();
        context.translate(-gridWidth / 2 + 8, -gridHeight / 2 + 34);

        context.font = `38px WDXL Lubrifont TC`;
        context.fillStyle = `white`;
        context.textAlign = "center";
        context.textBaseline = "middle";
    
        let text = "0";
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const xpix = x * cellWidth;
                const ypix = y * cellHeight;

                const is_one = (Math.abs(y-5) * 43) <= (this.heights[x] * 14 * this.wave_scale * this.sound_wave_scale);

                let img = is_one ? this.svgCache["1"] : this.svgCache["0"];
                let cellwidth_sm = is_one ? cellWidth * 0.6 * 0.8 : cellWidth * 0.6;
                let cellheight_sm = cellHeight * 0.6;
                let xpix_sm = is_one ? xpix + 3 : xpix;
                context.drawImage(img, xpix_sm, ypix, cellwidth_sm, cellheight_sm);
                
                // context.fillText(text, xpix + cellWidth / 2, ypix + cellHeight / 2);
            }
        }

        context.restore();
    }

}