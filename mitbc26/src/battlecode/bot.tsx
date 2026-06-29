import { CanvasStyleSignal, Img, ImgProps, Layout, Node, PossibleCanvasStyle, Rect, colorSignal, drawImage, initial, signal } from "@motion-canvas/2d";
import { BBox, Origin, Reference, SignalValue, SimpleSignal, Spacing, ThreadGenerator, Vector2, all, createRef, createSignal, easeInExpo, easeInOutExpo, easeInOutSine, easeInSine, easeOutExpo, easeOutSine, linear, originToOffset } from "@motion-canvas/core";
import { BattlecodeMap } from "./map";
import { add_dir } from "./helpers";

const BOT_PADDING = 4;

export interface BattlecodeBotProps extends ImgProps {
    map?: BattlecodeMap;
    pos?: Vector2;
    dir?: Origin;

    tiles_occupied?: number;
    directional_base_sprites?: Record<Origin, string>;
}

export class BattlecodeBot extends Layout {
    public map: BattlecodeMap;
    public pos: Vector2;
    public dir: Origin;
    public tiles_occupied: number;
    public directional_base_sprites: Record<Origin, string>;
    
    private pct = createSignal(0);
    
    private health_pct = createSignal(1);
    private health: number = 1;

    private max_health_bar: Reference<Rect> = createRef<Rect>();
    private health_bar: Reference<Rect> = createRef<Rect>();
    private img_ref: Reference<Img> = createRef<Img>();
    private off_ref: Reference<Node> = createRef<Node>();
  
    constructor(props: BattlecodeBotProps) {
        super({
            ...props,
            position: props.tiles_occupied % 2 == 0 ? props.map.get_intersect_anchor(props.pos.x, props.pos.y) : props.map.get_tile_anchor(props.pos.x, props.pos.y),
        });

        this.map = props.map;
        this.pos = props.pos;
        this.tiles_occupied = "tiles_occupied" in props ? props.tiles_occupied : 1;
        this.directional_base_sprites = props.directional_base_sprites;

        this.size(() => (this.tiles_occupied * this.map.tile_size() + (this.tiles_occupied - 1) * this.map.tile_gap()
                         - this.map.radius().top * 2 - BOT_PADDING * 2));

        this.add(<Node ref={this.off_ref}>
            <Img
                ref={this.img_ref}
                src={props.directional_base_sprites[props.dir]}
                size={() => this.size()}
            />
            <Rect
                ref={this.max_health_bar}
                position={() => this.getOriginDelta(Origin.Bottom)}
                size={() => [this.width(), 5]}
                fill={"#18101A"} opacity={0}
            >
                <Rect
                    ref={this.health_bar}
                    position={() => [-this.width() / 2, 0]} offsetX={-1}
                    size={() => [this.width() * this.health_pct(), 4]}
                    fill={"#00FFFF"}
                ></Rect>
            </Rect>
        </Node>);
    }

    public anchor(x: number, y: number) {
        return this.tiles_occupied % 2 == 0 ? this.map.get_intersect_anchor(x, y) : this.map.get_tile_anchor(x, y);
    }

    public* move_to_pos(new_pos: Vector2, duration: number) {
        this.pct(0);
        
        const old_anchor = this.anchor(this.pos.x, this.pos.y);
        this.pos = new_pos;
        const new_anchor = this.anchor(this.pos.x, this.pos.y);

        const opacity_tgt = this.map.is_not_visible(this.pos.x, this.pos.y) ? 0 : 1;
        
        this.position(() => Vector2.lerp(new Vector2(old_anchor()), new Vector2(new_anchor()), this.pct()));
        yield* all(this.pct(1, duration), this.opacity(opacity_tgt, duration));
        this.position(new_anchor);
    }

    public look_in_dir(new_dir: Origin) {
        this.dir = new_dir;
        this.img_ref().src(this.directional_base_sprites[this.dir]);
    }

    public* look_and_move(dir: Origin, duration: number) {
        const new_pos = add_dir(this.pos, dir);
        this.look_in_dir(dir);
        yield* this.move_to_pos(new_pos, duration);
    }

    public* execute_moves(duration: number, ...dirs: Origin[]) {
        for (const dir of dirs) {
            yield* this.look_and_move(dir, duration);
            yield* this.map.wait_for_next_tick();
        }
    }

    public* show_healthbar(duration: number) {
        yield* this.max_health_bar().opacity(1, 0.5);
    }

    public damage(dmg: number) {
        this.health -= dmg;
        if (this.health < 0) this.health = 0;
    }

    public* health_sync(duration: number) {
        if (this.health > 0)
            yield* this.health_pct(this.health, duration);
        else
            yield* all(
                this.health_pct(this.health, duration),
                this.opacity(0.5, duration),
            )
    }

    public* damage_and_sync(dmg: number, duration: number) {
        this.health -= dmg;
        yield* this.health_pct(this.health, duration);
    }
    
    public* do_action(dir: Origin) {
        const offset = originToOffset(dir).scale(10);
        this.look_in_dir(dir);
        yield* this.off_ref().position(this.off_ref().position().add(offset), 0.1, easeOutExpo).back(0.1, easeInExpo);
    }

    public* place_item(dir: Origin, n: Node) {

        const norm_offset = originToOffset(dir);
        const offset = norm_offset.scale(10);
        this.look_in_dir(dir);
        yield* this.off_ref().position(this.off_ref().position().add(offset), 0.1, easeOutExpo);
        const np = this.pos.add(norm_offset);
        this.map.add_item(np.x, np.y, n);
        yield* this.off_ref().position(this.off_ref().position().add(offset.scale(-1)), 0.1, easeInExpo);
    }

    public* highlight(duration: number, scale: number, rot = 45) {
        const quarter = duration * 0.25;
        
        yield* all(
            this.off_ref().scale(scale, quarter, easeOutExpo).back(quarter * 3, easeInExpo),
            this.off_ref().rotation(rot, quarter, easeOutSine)
                .to(-rot, quarter * 2, easeInOutSine)
                .to(0, quarter, easeInSine),
        )
    }
}