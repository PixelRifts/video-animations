import { Rect, RectProps } from "@motion-canvas/2d";

export interface BinPanelProps extends RectProps {
    init_heights: number[];
    wave_scale: number;
    sound_wave_scale: number;
}

export class BinPanel extends Rect {
    public heights: number[];
    public wave_scale: number;
    public sound_wave_scale: number;
    
    constructor(props: BinPanelProps) {
        super(props);

        this.heights = props.init_heights;
        this.wave_scale = props.wave_scale;
        this.sound_wave_scale = props.sound_wave_scale;
    }

    protected draw(context: CanvasRenderingContext2D): void {
        const cols = 24;
        const rows = 11;
        const cellWidth = 40.1;
        const cellHeight = 47;


        const gridWidth = cols * cellWidth;
        const gridHeight = rows * cellHeight;

        context.save();
        context.translate(-gridWidth / 2 - 4, -gridHeight / 2 + 18);

        context.font = `38px WDXL Lubrifont TC`;
        context.fillStyle = `white`;
        context.textAlign = "center";
        context.textBaseline = "middle";

        let text = "0";
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const xpix = x * cellWidth;
                const ypix = y * cellHeight;

                if ((Math.abs(y-5) * 43) > (this.heights[x] * 14 * this.wave_scale * this.sound_wave_scale)) {
                    context.fillStyle = "#94D9FF";
                    text = "0";
                } else {
                    context.fillStyle = "white";
                    text = "1";
                }
                context.fillText(text, xpix + cellWidth / 2, ypix + cellHeight / 2);
            }
        }

        context.restore();
    }
}