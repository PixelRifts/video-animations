import { Img, Rect, withDefaults } from "@motion-canvas/2d";
import { BattlecodeBot } from "../bot";
import { Origin, Vector2 } from "@motion-canvas/core";

import cheddar_babyrat_left        from "./img/robots/cheddar/rat_1_64x64.png";
import cheddar_babyrat_bottomleft  from "./img/robots/cheddar/rat_2_64x64.png";
import cheddar_babyrat_bottom      from "./img/robots/cheddar/rat_3_64x64.png";
import cheddar_babyrat_bottomright from "./img/robots/cheddar/rat_4_64x64.png";
import cheddar_babyrat_right       from "./img/robots/cheddar/rat_5_64x64.png";
import cheddar_babyrat_topright    from "./img/robots/cheddar/rat_6_64x64.png";
import cheddar_babyrat_top         from "./img/robots/cheddar/rat_7_64x64.png";
import cheddar_babyrat_topleft     from "./img/robots/cheddar/rat_8_64x64.png";

import plum_babyrat_left        from "./img/robots/plum/rat_1_64x64.png";
import plum_babyrat_bottomleft  from "./img/robots/plum/rat_2_64x64.png";
import plum_babyrat_bottom      from "./img/robots/plum/rat_3_64x64.png";
import plum_babyrat_bottomright from "./img/robots/plum/rat_4_64x64.png";
import plum_babyrat_right       from "./img/robots/plum/rat_5_64x64.png";
import plum_babyrat_topright    from "./img/robots/plum/rat_6_64x64.png";
import plum_babyrat_top         from "./img/robots/plum/rat_7_64x64.png";
import plum_babyrat_topleft     from "./img/robots/plum/rat_8_64x64.png";

import cat_left        from "./img/robots/cat/cat_1.png"; import cat_nom_left        from "./img/robots/cat/cat_feed_1.png"; import cat_owie_left        from "./img/robots/cat/cat_scratch_1.png";
import cat_bottomleft  from "./img/robots/cat/cat_2.png"; import cat_nom_bottomleft  from "./img/robots/cat/cat_feed_2.png"; import cat_owie_bottomleft  from "./img/robots/cat/cat_scratch_2.png";
import cat_bottom      from "./img/robots/cat/cat_3.png"; import cat_nom_bottom      from "./img/robots/cat/cat_feed_3.png"; import cat_owie_bottom      from "./img/robots/cat/cat_scratch_3.png";
import cat_bottomright from "./img/robots/cat/cat_4.png"; import cat_nom_bottomright from "./img/robots/cat/cat_feed_4.png"; import cat_owie_bottomright from "./img/robots/cat/cat_scratch_4.png";
import cat_right       from "./img/robots/cat/cat_5.png"; import cat_nom_right       from "./img/robots/cat/cat_feed_5.png"; import cat_owie_right       from "./img/robots/cat/cat_scratch_5.png";
import cat_topright    from "./img/robots/cat/cat_6.png"; import cat_nom_topright    from "./img/robots/cat/cat_feed_6.png"; import cat_owie_topright    from "./img/robots/cat/cat_scratch_6.png";
import cat_top         from "./img/robots/cat/cat_7.png"; import cat_nom_top         from "./img/robots/cat/cat_feed_7.png"; import cat_owie_top         from "./img/robots/cat/cat_scratch_7.png";
import cat_topleft     from "./img/robots/cat/cat_8.png"; import cat_nom_topleft     from "./img/robots/cat/cat_feed_8.png"; import cat_owie_topleft     from "./img/robots/cat/cat_scratch_8.png";

import cheddar_ratking from "./img/robots/cheddar/rat_king_64x64.png";
import plum_ratking    from "./img/robots/plum/rat_king_64x64.png";

import cheese_mine from "./img/icons/cheese_mine.png";
import cheese      from "./img/icons/cheese_64x64.png";
import cat_trap    from "./img/icons/cat_trap.png";
import rat_trap    from "./img/icons/rat_trap.png";

const origins = Object.values(Origin) as Origin[];


export const CheddarBabyRat = withDefaults(BattlecodeBot, {
    directional_base_sprites: {
        [Origin.Middle]:      cheddar_babyrat_left,
        [Origin.Left]:        cheddar_babyrat_left,
        [Origin.BottomLeft]:  cheddar_babyrat_bottomleft,
        [Origin.Bottom]:      cheddar_babyrat_bottom,
        [Origin.BottomRight]: cheddar_babyrat_bottomright,
        [Origin.Right]:       cheddar_babyrat_right,
        [Origin.TopRight]:    cheddar_babyrat_topright,
        [Origin.Top]:         cheddar_babyrat_top,
        [Origin.TopLeft]:     cheddar_babyrat_topleft,
    },
    tiles_occupied: 1,
});

export const PlumBabyRat = withDefaults(BattlecodeBot, {
    directional_base_sprites: {
        [Origin.Middle]:      plum_babyrat_left,
        [Origin.Left]:        plum_babyrat_left,
        [Origin.BottomLeft]:  plum_babyrat_bottomleft,
        [Origin.Bottom]:      plum_babyrat_bottom,
        [Origin.BottomRight]: plum_babyrat_bottomright,
        [Origin.Right]:       plum_babyrat_right,
        [Origin.TopRight]:    plum_babyrat_topright,
        [Origin.Top]:         plum_babyrat_top,
        [Origin.TopLeft]:     plum_babyrat_topleft,
    },
    tiles_occupied: 1,
});


export const CheddarRatKing = withDefaults(BattlecodeBot, {
    directional_base_sprites:  Object.fromEntries(
        origins.map(origin => [origin, cheddar_ratking]),
    ) as Record<Origin, string>,
    tiles_occupied: 3,
    scale: 0.85,
});

export const PlumRatKing = withDefaults(BattlecodeBot, {
    directional_base_sprites:  Object.fromEntries(
        origins.map(origin => [origin, plum_ratking]),
    ) as Record<Origin, string>,
    tiles_occupied: 3,
    scale: 0.85,
});

export const Cat = withDefaults(BattlecodeBot, {
    directional_base_sprites: {
        [Origin.Middle]:      cat_left,
        [Origin.Left]:        cat_left,
        [Origin.BottomLeft]:  cat_bottomleft,
        [Origin.Bottom]:      cat_bottom,
        [Origin.BottomRight]: cat_bottomright,
        [Origin.Right]:       cat_right,
        [Origin.TopRight]:    cat_topright,
        [Origin.Top]:         cat_top,
        [Origin.TopLeft]:     cat_topleft,
    },
    tiles_occupied: 2,
});

export const Dirt       = withDefaults(Rect, { fill: "#3B2931" });
export const CheeseMine = withDefaults(Img,  { src: cheese_mine });
export const Cheese     = withDefaults(Img,  { src: cheese });
export const CatTrap    = withDefaults(Img,  { src: cat_trap });
export const RatTrap    = withDefaults(Img,  { src: rat_trap });

export enum TileType {
    Empty = 0,
    Wall = 1,
}

export const TileTypeInfo: Record<TileType, { color: string }> = {
    [TileType.Empty]: { color: "#221725" },
    // [TileType.Empty]: { color: "#FF1111" },
    [TileType.Wall]:  { color: "#52485A" },
    // [TileType.Dirt]:  { color: "#3B2931" },
};
