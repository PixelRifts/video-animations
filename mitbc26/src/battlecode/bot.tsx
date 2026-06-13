import { Img, ImgProps, drawImage } from "@motion-canvas/2d";
import { BBox, Origin, SignalValue, Spacing, Vector2, all, createSignal } from "@motion-canvas/core";
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

export class BattlecodeBot extends Img {
    public map: BattlecodeMap;
    public pos: Vector2;
    public dir: Origin;
    public tiles_occupied: number;
    public directional_base_sprites: Record<Origin, string>;
    
    private pct = createSignal(0);
    
    constructor(props: BattlecodeBotProps) {
        super({
            ...props,
            position: props.tiles_occupied % 2 == 0 ? props.map.get_intersect_anchor(props.pos.x, props.pos.y) : props.map.get_tile_anchor(props.pos.x, props.pos.y),
            size: [0, 0],
            src: props.directional_base_sprites[props.dir],
        });

        this.map = props.map;
        this.pos = props.pos;
        this.tiles_occupied = "tiles_occupied" in props ? props.tiles_occupied : 1;
        this.directional_base_sprites = props.directional_base_sprites;

        this.size(() => (this.tiles_occupied * this.map.tile_size() + (this.tiles_occupied - 1) * this.map.tile_gap()
                         - this.map.radius().top * 2 - BOT_PADDING * 2));
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
        this.src(this.directional_base_sprites[this.dir]);
    }

    public* look_and_move(dir: Origin, duration: number) {
        const new_pos = add_dir(this.pos, dir);
        this.look_in_dir(dir);
        yield* this.move_to_pos(new_pos, duration);
    }
}