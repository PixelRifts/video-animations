import { ComponentChildren, Gradient, Layout, Node, Rect, RectProps, computed, initial, signal, vector2Signal } from "@motion-canvas/2d";
import { Computed, PossibleVector2, Reference, SignalValue, SimpleSignal, ThreadGenerator, Vector2, Vector2Signal, createComputed, createEaseOutBack, createRef, createSignal, debug, easeOutBack, linear, waitFor, waitUntil } from "@motion-canvas/core";

export interface BattlecodeMapProps extends RectProps {
    map_bounds?:   SignalValue<PossibleVector2>;
    tile_size?:    SignalValue<number>;
    tile_gap?:     SignalValue<number>;
    base_colors?:  SignalValue<string[]>;
    show_pct?:     SignalValue<number>;
    
    faded_bounds?: SignalValue<boolean>;
}

export class BattlecodeMap extends Rect {
    @initial({x: 5, y: 5})
    @vector2Signal({x: 'width', y: 'height'})
    public declare readonly map_bounds: Vector2Signal<this>;

    @initial(120)
    @signal()
    public declare readonly tile_size: SimpleSignal<number, this>;

    @initial(12)
    @signal()
    public declare readonly tile_gap: SimpleSignal<number, this>;

    @initial(0)
    @signal()
    public declare readonly show_pct: SimpleSignal<number, this>;

    @initial(true)
    @signal()
    public declare readonly faded_bounds: SimpleSignal<boolean, this>;

    @initial([])
    @signal()
    public declare readonly base_colors: SimpleSignal<string[], this>;

    private additional_items = createRef<Node>();

    @computed()
    public real_map_bounds() {
        if (!this.faded_bounds()) return this.map_bounds();
        return this.map_bounds().add([2, 2]);
    }

    @computed()
    public side_lengths() {
        const bounds = this.real_map_bounds();
        const stride = this.tile_size() + this.tile_gap();
        return [
            bounds.x * this.tile_size() + (bounds.x - 1) * this.tile_gap(),
            bounds.y * this.tile_size() + (bounds.y - 1) * this.tile_gap(),
        ];
    }

    public get_tile_anchor(x: number, y: number): Computed<PossibleVector2> {
        return createComputed(() => {
            const [total_width, total_height] = this.side_lengths();
            const real_x = this.faded_bounds() ? x + 1 : x;
            const real_y = this.faded_bounds() ? y + 1 : y;
            const tile_size = this.tile_size();
            const stride = this.tile_size() + this.tile_gap();
            
            return [-total_width/2 + tile_size/2 + real_x*stride, -total_height/2 + tile_size/2 + real_y*stride];
        })
    }

    public get_intersect_anchor(x: number, y: number): Computed<PossibleVector2> {
        return createComputed(() => {
            const [total_width, total_height] = this.side_lengths();
            const real_x = this.faded_bounds() ? x + 1 : x;
            const real_y = this.faded_bounds() ? y + 1 : y;
            const tile_size = this.tile_size();
            const stride = this.tile_size() + this.tile_gap();
            return [
                -total_width/2 + tile_size + real_x*stride,
                -total_height/2 + tile_size + real_y*stride,
            ];
        })
    }

    public is_not_visible(x: number, y: number): boolean {
        const [w,h] = this.real_map_bounds()
        if (this.faded_bounds())
            return x < 0 || x >= w-2 || y < 0 || y >= h-2;
        else
            return x < 0 || x >= w   || y < 0 || y >= h  ;
    }

    constructor(props: BattlecodeMapProps) {
        super(props);

        this.add(<Node ref={this.additional_items}></Node>);
    }
    
    private get_tile_style(x: number, y: number, tile_size: number, stride: number, context: CanvasRenderingContext2D, bounds: Vector2, base: string): (string | CanvasGradient) {
        if (this.faded_bounds()) {
            const px = -tile_size * 0.5;
            const py = -tile_size * 0.5;

            const left   = x === 0;
            const right  = x === bounds.x - 1;
            const top    = y === 0;
            const bottom = y === bounds.y - 1;

            if ((left || right) && (top || bottom)) {
                let cx = px;
                let cy = py;

                if (left) cx += tile_size;
                if (top)  cy += tile_size;

                const grad = context.createRadialGradient(
                    cx, cy, 0,
                    cx, cy, tile_size
                );

                grad.addColorStop(0.9, "#00000000");
                grad.addColorStop(0, base);

                return grad;
            } else if (left) {
                const grad = context.createLinearGradient(
                    px,
                    py,
                    px + tile_size,
                    py
                );

                grad.addColorStop(0.1, "#00000000");
                grad.addColorStop(1, base);

                return grad;
            } else if (right) {
                const grad = context.createLinearGradient(
                    px + tile_size,
                    py,
                    px,
                    py
                );

                grad.addColorStop(0.1, "#00000000");
                grad.addColorStop(1, base);

                return grad;
            } else if (top) {
                const grad = context.createLinearGradient(
                    px,
                    py,
                    px,
                    py + tile_size
                );

                grad.addColorStop(0.1, "#00000000");
                grad.addColorStop(1, base);

                return grad;
            } else if (bottom) {
                const grad = context.createLinearGradient(
                    px,
                    py + tile_size,
                    px,
                    py
                );

                grad.addColorStop(0.1, "#00000000");
                grad.addColorStop(1, base);

                return grad;
            }
        }

        return base;
    }

    protected draw(context: CanvasRenderingContext2D): void {
        context.save();
        const [total_width, total_height] = this.side_lengths();
        context.translate(-total_width/2, -total_height/2);

        const bounds = this.real_map_bounds();
        const tile_size = this.tile_size();
        const radius = this.radius();
        const stride = tile_size + this.tile_gap();
        const base_colors = this.base_colors();
        const pct = this.show_pct();
        const max_index = (bounds.x - 1) + (bounds.y - 1);

        context.save();
        context.fillStyle = "#100a0b";
        context.beginPath();
        context.roundRect(-20, -20, total_width+40, total_height+40, radius);
        context.fill();
        context.closePath();
        context.restore();

        for (let y = 0; y < bounds.y; y++) {
            for (let x = 0; x < bounds.x; x++) {
                const index = x + y;

                const start = index / max_index;
                const localPct = Math.max(0, Math.min(1, pct * 2 - start));
                const scale = easeOutBack(localPct);
                
                context.save();
                context.translate(x * stride + tile_size * 0.5, y * stride + tile_size * 0.5);
                context.scale(scale, scale);
                context.fillStyle = this.get_tile_style(x, y, tile_size, stride, context, bounds, base_colors[y * bounds.x + x] ?? "#FFF");
                // context.fillStyle = "red"
                
                context.beginPath();
                context.roundRect(-tile_size*0.5, -tile_size*0.5, tile_size, tile_size, radius);
                context.fill();
                context.closePath();
                context.restore();
            }
        }
        
        context.restore();
        this.drawChildren(context);
    }

    public* fade_in(duration = 1.2) {
        yield* this.show_pct(1, duration, linear);
    }
    
    public tick = 0;
    public tick_timer = createSignal(0);

    public* run_ticks(tick_time: number, wait_time: number) {
        while (true) {
            yield* waitFor(wait_time);
        
            this.tick++;
            yield* this.tick_timer(this.tick, tick_time);
        }
    }

    public* wait_for_next_tick(): ThreadGenerator {
        const current = this.tick;
        
        while (this.tick <= current) {
            yield;
        }
    }

    public add_item(x: number, y: number, _node: Node) {
        const node = _node as Layout;
        node.position(this.get_tile_anchor(x, y));
        node.size(this.tile_size() - 4);
        this.additional_items().add(node);
    }
}