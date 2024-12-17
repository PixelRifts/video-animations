import { Bezier, Camera, Circle, Code, Icon, Img, LezerHighlighter, Line, Node, QuadBezier, Rect, Txt, Video, makeScene2D } from "@motion-canvas/2d";
import { Color, DEFAULT, Origin, Vector2, all, chain, createRef, createRefArray, createSignal, easeOutCubic, linear, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { offset_rainbow, palette, primary_glow_props, rainbow, secondary_glow_props } from "../lib/palette";
import { flash, flash_delay, lerp, range_check, wiggle } from "../lib/utilities";
import { smoothstep } from "three/src/math/MathUtils";

import c_18_img from "../extern/C_18.png";
import c_24_img from "../extern/C_24.png";
import c_48_img from "../extern/C_48.png";
import c_96_img from "../extern/C_96.png";
const c_big_imgs = [c_18_img, c_24_img, c_48_img, c_96_img];
const c_big_scales = [18, 24, 48, 96];
import a_char_img from "../extern/A_SDF_Rendered.png";

import quality_loss_vid from "../extern/QualityLossShow.mp4";

import {parser} from '@lezer/cpp';
Code.defaultHighlighter = new LezerHighlighter(parser);

const a_sdf_bitmap = [
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x11, 0x11, 0x11, 0x3f, 0x3f, 0x3f, 0x3f, 0x3f, 0x3f, 0x0e, 0x0e, 0x0e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x43, 0x43, 0x43, 0xba, 0xba, 0xba, 0xb7, 0xb7, 0xb7, 0x41, 0x41, 0x41, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x71, 0x71, 0x71, 0xae, 0xae, 0xae, 0xb6, 0xb6, 0xb6, 0x71, 0x71, 0x71, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x27, 0x27, 0x27, 0x9e, 0x9e, 0x9e, 0x8d, 0x8d, 0x8d, 0x8d, 0x8d, 0x8d, 0xa2, 0xa2, 0xa2, 0x2c, 0x2c, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x55, 0x55, 0x55, 0xcc, 0xcc, 0xcc, 0x84, 0x84, 0x84, 0x84, 0x84, 0x84, 0xd2, 0xd2, 0xd2, 0x5c, 0x5c, 0x5c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0c, 0x0c, 0x0c, 0x83, 0x83, 0x83, 0xae, 0xae, 0xae, 0x37, 0x37, 0x37, 0x34, 0x34, 0x34, 0xac, 0xac, 0xac, 0x8c, 0x8c, 0x8c, 0x16, 0x16, 0x16, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x39, 0x39, 0x39, 0xb0, 0xb0, 0xb0, 0x82, 0x82, 0x82, 0x0a, 0x0a, 0x0a, 0x07, 0x07, 0x07, 0x7f, 0x7f, 0x7f, 0xbc, 0xbc, 0xbc, 0x46, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x0c, 0x0c, 0x0c, 0x67, 0x67, 0x67, 0xd2, 0xd2, 0xd2, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0xcf, 0xcf, 0xcf, 0x77, 0x77, 0x77, 0x0c, 0x0c, 0x0c, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x31, 0x31, 0x31, 0x95, 0x95, 0x95, 0xa4, 0xa4, 0xa4, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x95, 0x9e, 0x9e, 0x9e, 0xa7, 0xa7, 0xa7, 0x31, 0x31, 0x31, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x61, 0x61, 0x61, 0xc2, 0xc2, 0xc2, 0x77, 0x77, 0x77, 0x16, 0x16, 0x16, 0x16, 0x16, 0x16, 0x16, 0x16, 0x16, 0x16, 0x16, 0x16, 0x6e, 0x6e, 0x6e, 0xd7, 0xd7, 0xd7, 0x61, 0x61, 0x61, 0x00, 0x00, 0x00, 
    0x1c, 0x1c, 0x1c, 0x92, 0x92, 0x92, 0xc3, 0xc3, 0xc3, 0x4c, 0x4c, 0x4c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x40, 0x40, 0xb7, 0xb7, 0xb7, 0x92, 0x92, 0x92, 0x1c, 0x1c, 0x1c, 
    0x4c, 0x4c, 0x4c, 0xbf, 0xbf, 0xbf, 0x98, 0x98, 0x98, 0x20, 0x20, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x12, 0x12, 0x12, 0x89, 0x89, 0x89, 0xbf, 0xbf, 0xbf, 0x4c, 0x4c, 0x4c, 
];

const c_sdf_bitmap = [
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1a, 0x1a, 0x1a, 0x42, 0x42, 0x42, 0x55, 0x55, 0x55, 0x54, 0x54, 0x54, 0x3e, 0x3e, 0x3e, 0x11, 0x11, 0x11, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x4b, 0x4b, 0x4b, 0x8e, 0x8e, 0x8e, 0xbd, 0xbd, 0xbd, 0xc9, 0xc9, 0xc9, 0xcc, 0xcc, 0xcc, 0xb8, 0xb8, 0xb8, 0x80, 0x80, 0x80, 0x31, 0x31, 0x31, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x4a, 0x4a, 0x4a, 0xab, 0xab, 0xab, 0xa8, 0xa8, 0xa8, 0x68, 0x68, 0x68, 0x4a, 0x4a, 0x4a, 0x4e, 0x4e, 0x4e, 0x79, 0x79, 0x79, 0xca, 0xca, 0xca, 0x86, 0x86, 0x86, 0x1c, 0x1c, 0x1c, 0x00, 0x00, 0x00, 
    0x19, 0x19, 0x19, 0x8d, 0x8d, 0x8d, 0xb6, 0xb6, 0xb6, 0x4c, 0x4c, 0x4c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x16, 0x16, 0x7f, 0x7f, 0x7f, 0xc8, 0xc8, 0xc8, 0x52, 0x52, 0x52, 0x00, 0x00, 0x00, 
    0x41, 0x41, 0x41, 0xbc, 0xbc, 0xbc, 0x85, 0x85, 0x85, 0x0c, 0x0c, 0x0c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x4e, 0x4e, 0x4e, 0x5b, 0x5b, 0x5b, 0x3d, 0x3d, 0x3d, 0x00, 0x00, 0x00, 
    0x58, 0x58, 0x58, 0xd6, 0xd6, 0xd6, 0x6a, 0x6a, 0x6a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x5e, 0x5e, 0x5e, 0xdd, 0xdd, 0xdd, 0x62, 0x62, 0x62, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x55, 0x55, 0x55, 0xd3, 0xd3, 0xd3, 0x6a, 0x6a, 0x6a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x15, 0x15, 0x15, 0x21, 0x21, 0x21, 0x02, 0x02, 0x02, 0x00, 0x00, 0x00, 
    0x3d, 0x3d, 0x3d, 0xb8, 0xb8, 0xb8, 0x85, 0x85, 0x85, 0x0c, 0x0c, 0x0c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x4a, 0x4a, 0x4a, 0x9d, 0x9d, 0x9d, 0x7d, 0x7d, 0x7d, 0x00, 0x00, 0x00, 
    0x16, 0x16, 0x16, 0x8b, 0x8b, 0x8b, 0xb6, 0xb6, 0xb6, 0x4b, 0x4b, 0x4b, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x19, 0x19, 0x19, 0x7e, 0x7e, 0x7e, 0xca, 0xca, 0xca, 0x56, 0x56, 0x56, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x4c, 0x4c, 0x4c, 0xb1, 0xb1, 0xb1, 0xa7, 0xa7, 0xa7, 0x68, 0x68, 0x68, 0x49, 0x49, 0x49, 0x50, 0x50, 0x50, 0x7f, 0x7f, 0x7f, 0xcd, 0xcd, 0xcd, 0x86, 0x86, 0x86, 0x1d, 0x1d, 0x1d, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x54, 0x54, 0x54, 0x99, 0x99, 0x99, 0xc4, 0xc4, 0xc4, 0xc8, 0xc8, 0xc8, 0xcd, 0xcd, 0xcd, 0xb7, 0xb7, 0xb7, 0x7e, 0x7e, 0x7e, 0x30, 0x30, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
];

const c_sdf_bitmap_expanded = [
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0f, 0x0f, 0x0f, 0x24, 0x24, 0x24, 0x3d, 0x3d, 0x3d, 0x4c, 0x4c, 0x4c, 0x55, 0x55, 0x55, 0x54, 0x54, 0x54, 0x4a, 0x4a, 0x4a, 0x39, 0x39, 0x39, 0x1d, 0x1d, 0x1d, 0x09, 0x09, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x11, 0x11, 0x11, 0x30, 0x30, 0x30, 0x53, 0x53, 0x53, 0x70, 0x70, 0x70, 0x8b, 0x8b, 0x8b, 0x97, 0x97, 0x97, 0x9d, 0x9d, 0x9d, 0x9f, 0x9f, 0x9f, 0x96, 0x96, 0x96, 0x86, 0x86, 0x86, 0x67, 0x67, 0x67, 0x47, 0x47, 0x47, 0x1e, 0x1e, 0x1e, 0x08, 0x08, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x10, 0x10, 0x10, 0x2f, 0x2f, 0x2f, 0x5b, 0x5b, 0x5b, 0x7d, 0x7d, 0x7d, 0x99, 0x99, 0x99, 0xae, 0xae, 0xae, 0xb7, 0xb7, 0xb7, 0xbc, 0xbc, 0xbc, 0xbe, 0xbe, 0xbe, 0xb7, 0xb7, 0xb7, 0xab, 0xab, 0xab, 0x95, 0x95, 0x95, 0x73, 0x73, 0x73, 0x42, 0x42, 0x42, 0x1d, 0x1d, 0x1d, 0x02, 0x02, 0x02, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x2f, 0x2f, 0x2f, 0x5b, 0x5b, 0x5b, 0x96, 0x96, 0x96, 0xa2, 0xa2, 0xa2, 0x9e, 0x9e, 0x9e, 0x83, 0x83, 0x83, 0x75, 0x75, 0x75, 0x6e, 0x6e, 0x6e, 0x70, 0x70, 0x70, 0x7c, 0x7c, 0x7c, 0x91, 0x91, 0x91, 0xb8, 0xb8, 0xb8, 0xa3, 0xa3, 0xa3, 0x73, 0x73, 0x73, 0x3a, 0x3a, 0x3a, 0x0f, 0x0f, 0x0f, 0x00, 0x00, 0x00, 
    0x0f, 0x0f, 0x0f, 0x53, 0x53, 0x53, 0x7f, 0x7f, 0x7f, 0xa8, 0xa8, 0xa8, 0x9d, 0x9d, 0x9d, 0x7d, 0x7d, 0x7d, 0x58, 0x58, 0x58, 0x41, 0x41, 0x41, 0x34, 0x34, 0x34, 0x37, 0x37, 0x37, 0x4a, 0x4a, 0x4a, 0x6c, 0x6c, 0x6c, 0xa0, 0xa0, 0xa0, 0xab, 0xab, 0xab, 0x9f, 0x9f, 0x9f, 0x5c, 0x5c, 0x5c, 0x2b, 0x2b, 0x2b, 0x00, 0x00, 0x00, 
    0x23, 0x23, 0x23, 0x70, 0x70, 0x70, 0x9b, 0x9b, 0x9b, 0xab, 0xab, 0xab, 0x88, 0x88, 0x88, 0x40, 0x40, 0x40, 0x19, 0x19, 0x19, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0a, 0x0a, 0x0a, 0x36, 0x36, 0x36, 0x6f, 0x6f, 0x6f, 0x9f, 0x9f, 0x9f, 0xb0, 0xb0, 0xb0, 0x6b, 0x6b, 0x6b, 0x38, 0x38, 0x38, 0x00, 0x00, 0x00, 
    0x3c, 0x3c, 0x3c, 0x8a, 0x8a, 0x8a, 0xb0, 0xb0, 0xb0, 0x96, 0x96, 0x96, 0x6a, 0x6a, 0x6a, 0x1d, 0x1d, 0x1d, 0x08, 0x08, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x02, 0x02, 0x23, 0x23, 0x23, 0x51, 0x51, 0x51, 0x69, 0x69, 0x69, 0x70, 0x70, 0x70, 0x4d, 0x4d, 0x4d, 0x2d, 0x2d, 0x2d, 0x00, 0x00, 0x00, 
    0x4d, 0x4d, 0x4d, 0x9c, 0x9c, 0x9c, 0xbf, 0xbf, 0xbf, 0x8a, 0x8a, 0x8a, 0x58, 0x58, 0x58, 0x05, 0x05, 0x05, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x12, 0x12, 0x12, 0x32, 0x32, 0x32, 0x3c, 0x3c, 0x3c, 0x3e, 0x3e, 0x3e, 0x2f, 0x2f, 0x2f, 0x1c, 0x1c, 0x1c, 0x00, 0x00, 0x00, 
    0x59, 0x59, 0x59, 0xa8, 0xa8, 0xa8, 0xca, 0xca, 0xca, 0x84, 0x84, 0x84, 0x4b, 0x4b, 0x4b, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x5d, 0x5d, 0x5d, 0xac, 0xac, 0xac, 0xce, 0xce, 0xce, 0x82, 0x82, 0x82, 0x47, 0x47, 0x47, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x5a, 0x5a, 0x5a, 0xa9, 0xa9, 0xa9, 0xcb, 0xcb, 0xcb, 0x82, 0x82, 0x82, 0x49, 0x49, 0x49, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x02, 0x02, 0x0a, 0x0a, 0x0a, 0x11, 0x11, 0x11, 0x13, 0x13, 0x13, 0x04, 0x04, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x52, 0x52, 0x52, 0xa0, 0xa0, 0xa0, 0xc3, 0xc3, 0xc3, 0x85, 0x85, 0x85, 0x50, 0x50, 0x50, 0x02, 0x02, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0x08, 0x08, 0x20, 0x20, 0x20, 0x39, 0x39, 0x39, 0x46, 0x46, 0x46, 0x38, 0x38, 0x38, 0x23, 0x23, 0x23, 0x00, 0x00, 0x00, 
    0x42, 0x42, 0x42, 0x90, 0x90, 0x90, 0xb5, 0xb5, 0xb5, 0x8d, 0x8d, 0x8d, 0x5e, 0x5e, 0x5e, 0x08, 0x08, 0x08, 0x02, 0x02, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x18, 0x18, 0x18, 0x3e, 0x3e, 0x3e, 0x73, 0x73, 0x73, 0x8d, 0x8d, 0x8d, 0x79, 0x79, 0x79, 0x53, 0x53, 0x53, 0x00, 0x00, 0x00, 
    0x2e, 0x2e, 0x2e, 0x7b, 0x7b, 0x7b, 0xa3, 0xa3, 0xa3, 0xa0, 0xa0, 0xa0, 0x7a, 0x7a, 0x7a, 0x31, 0x31, 0x31, 0x12, 0x12, 0x12, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x07, 0x07, 0x07, 0x2d, 0x2d, 0x2d, 0x60, 0x60, 0x60, 0x95, 0x95, 0x95, 0xac, 0xac, 0xac, 0x7c, 0x7c, 0x7c, 0x4e, 0x4e, 0x4e, 0x00, 0x00, 0x00, 
    0x13, 0x13, 0x13, 0x60, 0x60, 0x60, 0x8d, 0x8d, 0x8d, 0xae, 0xae, 0xae, 0x93, 0x93, 0x93, 0x5b, 0x5b, 0x5b, 0x37, 0x37, 0x37, 0x23, 0x23, 0x23, 0x1b, 0x1b, 0x1b, 0x1d, 0x1d, 0x1d, 0x2e, 0x2e, 0x2e, 0x4f, 0x4f, 0x4f, 0x85, 0x85, 0x85, 0xaa, 0xaa, 0xaa, 0xb5, 0xb5, 0xb5, 0x6e, 0x6e, 0x6e, 0x38, 0x38, 0x38, 0x00, 0x00, 0x00, 
    0x04, 0x04, 0x04, 0x40, 0x40, 0x40, 0x6f, 0x6f, 0x6f, 0xa7, 0xa7, 0xa7, 0xa8, 0xa8, 0xa8, 0x95, 0x95, 0x95, 0x6d, 0x6d, 0x6d, 0x53, 0x53, 0x53, 0x44, 0x44, 0x44, 0x48, 0x48, 0x48, 0x62, 0x62, 0x62, 0x86, 0x86, 0x86, 0xb9, 0xb9, 0xb9, 0xae, 0xae, 0xae, 0x8a, 0x8a, 0x8a, 0x4b, 0x4b, 0x4b, 0x1e, 0x1e, 0x1e, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x25, 0x25, 0x25, 0x4d, 0x4d, 0x4d, 0x83, 0x83, 0x83, 0x97, 0x97, 0x97, 0xa0, 0xa0, 0xa0, 0x9f, 0x9f, 0x9f, 0x9c, 0x9c, 0x9c, 0x9a, 0x9a, 0x9a, 0x9d, 0x9d, 0x9d, 0x9e, 0x9e, 0x9e, 0xa0, 0xa0, 0xa0, 0xaa, 0xaa, 0xaa, 0x8f, 0x8f, 0x8f, 0x5f, 0x5f, 0x5f, 0x2e, 0x2e, 0x2e, 0x0a, 0x0a, 0x0a, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x20, 0x20, 0x20, 0x4d, 0x4d, 0x4d, 0x7c, 0x7c, 0x7c, 0xa1, 0xa1, 0xa1, 0xbe, 0xbe, 0xbe, 0xc6, 0xc6, 0xc6, 0xc9, 0xc9, 0xc9, 0xcc, 0xcc, 0xcc, 0xc2, 0xc2, 0xc2, 0xaf, 0xaf, 0xaf, 0x89, 0x89, 0x89, 0x61, 0x61, 0x61, 0x2b, 0x2b, 0x2b, 0x0f, 0x0f, 0x0f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
];
const expanded_sdf_dim = 18;

export default makeScene2D(function* (view) {
    
    const sdf_font_title = createRef<Txt>();
    const encloser = createRef<Line>();
    view.add(<>
        <Line
            ref={encloser}
            lineWidth={6}
            stroke={palette.primary}
            points={[
                [ 0, 425 ],
                [ 425, 425 ],
                [ 425, -345 ],
                [ 275, -345 ],
                [ 220, -425 ],
                [ -220, -425 ],
                [ -275, -345 ],
                [ -425, -345 ],
                [ -425, 425 ],
                [ 0, 425 ],
            ]}
            closed zIndex={-5}
            start={0.5} end={0.5}
            fill={palette.foreground}
            {...primary_glow_props}
        />
    </>);
    encloser().add(<Txt
        fontFamily={"Jetbrains Mono"}
        ref={sdf_font_title}
        text={"SDF Fonts"}
        fill={palette.text}
        x={0} y={0}
        fontSize={120}
    />);
    yield* waitFor(2);
    yield* sequence(
        0.1,
        sdf_font_title().fontSize(60, 0.4),
        sdf_font_title().y(-375, 0.4),
    );
    yield* all(encloser().start(0, 1.0), encloser().end(1, 1.0));

    const sdf_pixels = createRefArray<Rect>();
    const sdf_padding = 75;
    const sdf_width = ((425 - sdf_padding) * 2);
    const sdf_pix_start = (-425 + sdf_padding);
    const sdf_dim = 12;
    const pixel_size = sdf_width / sdf_dim;
    encloser().add(<>
        {...range(sdf_dim * sdf_dim).map(i => <Rect
            ref={sdf_pixels}
            x={sdf_pix_start + (i % sdf_dim) * (pixel_size+0.5) + (pixel_size / 2)}
            y={-310 + (Math.floor(i / sdf_dim)) * (pixel_size+0.5) + (pixel_size / 2)}
            size={[0,0]} zIndex={0}
            fill={"#000000"} radius={2}
        />)}
    </>);
    yield* sequence(0.05,
        ...range(sdf_dim).map(i => sequence(0.01,
            ...sdf_pixels.slice(i*sdf_dim, (i+1)*sdf_dim).map(t => t.size([pixel_size, pixel_size], 0.5))
        ))
    );

    yield* waitUntil("proportional");
    yield* sequence(0.05,
        ...range(sdf_dim).map(i => sequence(0.01,
            ...sdf_pixels.slice(i*sdf_dim, (i+1)*sdf_dim).map((t,j) => 
                t.fill(new Color({
                    r: (c_sdf_bitmap[(i * sdf_dim + j) * 3 + 0]),
                    g: (c_sdf_bitmap[(i * sdf_dim + j) * 3 + 1]),
                    b: (c_sdf_bitmap[(i * sdf_dim + j) * 3 + 2]),
                    a: 1
                }), 0.5)
            )
        ))
    );

    yield* waitUntil("glyph_edge");
    yield* sequence(0.05,
        ...range(sdf_dim).map(i => sequence(0.01,
            ...sdf_pixels.slice(i*sdf_dim, (i+1)*sdf_dim)
            .filter((t,j) => range_check(c_sdf_bitmap[(i * sdf_dim + j) * 3], 0x4F, 0x9F))
            .map((t,j) => 
                flash(t.fill, 'yellow', 1.2)
            )
        ))
    );
    
    yield* waitUntil("glyph_inside");
    yield* sequence(0.05,
        ...range(sdf_dim).map(i => sequence(0.01,
            ...sdf_pixels.slice(i*sdf_dim, (i+1)*sdf_dim)
            .filter((t,j) => range_check(c_sdf_bitmap[(i * sdf_dim + j) * 3], 0x9F, 0xFF))
            .map((t,j) => 
                flash(t.fill, 'yellow', 1.2)
            )
        ))
    );
    yield* waitUntil("glyph_outside");
    yield* sequence(0.05,
        ...range(sdf_dim).map(i => sequence(0.01,
            ...sdf_pixels.slice(i*sdf_dim, (i+1)*sdf_dim)
            .filter((t,j) => range_check(c_sdf_bitmap[(i * sdf_dim + j) * 3], 0x00, 0x4F))
            .map((t,j) => 
                flash(t.fill, 'yellow', 1.2)
            )
        ))
    );

    yield* waitUntil("draw_on_that_thing");
    yield* sequence(0.1,
        encloser().scale(0.8, 1.2),
        encloser().x(-400, 1.2),
    );


    const framebuffer_title_ref = createRef<Txt>();
    const fbo_encloser = createRef<Line>();
    view.add(<>
        <Line
            ref={fbo_encloser}
            lineWidth={6} x={400} y={-1000}
            stroke={palette.primary}
            points={[
                [ 0, 425 ],
                [ 425, 425 ],
                [ 425, -345 ],
                [ 275, -345 ],
                [ 220, -425 ],
                [ -220, -425 ],
                [ -275, -345 ],
                [ -425, -345 ],
                [ -425, 425 ],
                [ 0, 425 ],
            ]}
            closed zIndex={-5}
            fill={palette.foreground}
            {...primary_glow_props}
        >
            <Txt
                fontFamily={"Jetbrains Mono"}
                ref={framebuffer_title_ref}
                text={"Framebuffer"}
                fill={palette.text}
                x={0} y={-375}
                fontSize={60}
            />
        </Line>
    </>);

    let fbo_pixels = createRefArray<Rect>();
    let fbo_padding = 75;
    let fbo_width = ((425 - fbo_padding) * 2);
    let fbo_pix_start = (-425 + fbo_padding);
    let fbo_dim = 24;
    let fbo_pixel_size = fbo_width / fbo_dim;
    fbo_encloser().add(<>
        {...range(fbo_dim * fbo_dim).map(i => <Rect
            ref={fbo_pixels}
            x={fbo_pix_start + (i % fbo_dim) * (fbo_pixel_size+0.5) + (fbo_pixel_size / 2)}
            y={-310 + (Math.floor(i / fbo_dim)) * (fbo_pixel_size+0.5) + (fbo_pixel_size / 2)}
            size={[fbo_pixel_size, fbo_pixel_size]} zIndex={0}
            fill={"#000000"} radius={2}
        />)}
    </>);
    yield* fbo_encloser().y(0, 1.2);
    const plotted_fn = createRef<Code>();
    const mapped_area = createRef<Rect>();
    const output_param_encloser = createRef<Line>();
    const angle_sig = createSignal(0);
    yield angle_sig(20, 10, linear);
    fbo_encloser().add(<>
        <Rect
            ref={mapped_area}
            size={(expanded_sdf_dim+0.5)*fbo_pixel_size} scale={1}
            opacity={0}
            x={5} y={fbo_pixel_size-12}
            lineWidth={8} stroke={offset_rainbow(angle_sig)}
        />
    </>);
    view.add(
        <Line
            ref={output_param_encloser}
            lineWidth={6} x={-400}
            stroke={palette.secondary}
            points={[
                [ 0, 425/1.2 ],
                [ 425/1.2, 425/1.2 ],
                [ 425/1.2, -345/1.2 ],
                [ 275/1.2, -345/1.2 ],
                [ 220/1.2, -425/1.1 ],
                [ -220/1.2, -425/1.1 ],
                [ -275/1.2, -345/1.2 ],
                [ -425/1.2, -345/1.2 ],
                [ -425/1.2, 425/1.2 ],
                [ 0, 425/1.2 ],
            ]}
            closed zIndex={-5}
            start={0.5} end={0.5}
            fill={palette.foreground_secondary}
            {...primary_glow_props}
        >
            <Txt
                fontFamily={"Jetbrains Mono"}
                ref={sdf_font_title}
                text={""}
                fill={palette.text}
                x={0} y={-325}
                fontSize={60}
            />
        </Line>
    );
    output_param_encloser().add(
        <Code
            fontFamily={"Jetbrains Mono"}
            ref={plotted_fn}
            code={""}
            fill={palette.secondary}
            x={0} y={200}
            fontSize={38}
        />
    );

    yield* waitFor(1);
    yield* all(
        flash(mapped_area().opacity, 1, 2.2),
        sequence(0.05,
            ...range(expanded_sdf_dim).map(i => sequence(0.01,
                ...fbo_pixels.slice(i*expanded_sdf_dim, (i+1)*expanded_sdf_dim)
                .map((t,j) =>
                    fbo_pixels[(2*fbo_dim+3) + (i*fbo_dim+j)].fill(new Color({
                        r: (c_sdf_bitmap_expanded[(i * expanded_sdf_dim + j) * 3 + 0]),
                        g: (c_sdf_bitmap_expanded[(i * expanded_sdf_dim + j) * 3 + 1]),
                        b: (c_sdf_bitmap_expanded[(i * expanded_sdf_dim + j) * 3 + 2]),
                        a: 1
                    }), 0.5),
                )
            ))
        ),
    );
    yield* encloser().x(encloser().x() - 1000, 0.8);
    yield* all(sdf_font_title().text("Parameters", 0.8),
        output_param_encloser().start(0, 0.5), output_param_encloser().end(1, 0.5));
    yield* plotted_fn().code("output = value;", 0.5);

    yield* waitFor(2);

    const threshold_title = createRef<Txt>();
    const threshold = createSignal(0.1);
    const smoothness_title = createRef<Txt>();
    const smoothness = createSignal(0.05);
    output_param_encloser().add(<>
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={threshold_title}
            text={""}
            fill={palette.secondary}
            x={0} y={-200}
            fontSize={40}
        />
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={smoothness_title}
            text={""}
            fill={palette.secondary}
            x={0} y={-140}
            fontSize={40}
        />
    </>);
    yield* all(
        sequence(0.05,
            ...range(expanded_sdf_dim).map(i => sequence(0.01,
                ...range(expanded_sdf_dim).map(j => all(
                    fbo_pixels[(2*fbo_dim+3) + (i*fbo_dim+j)].fill(() => (c_sdf_bitmap_expanded[(i * expanded_sdf_dim + j) * 3 + 0])/255 >= threshold() ? palette.accent : "#000000", 0.5),
                ))
            ))
        ),
        plotted_fn().code("output = (value > threshold)", 0.5),
        threshold_title().text(() => "Threshold = " + threshold().toFixed(3), 0.5),
    );

    yield* chain(
        all(
            threshold_title().fontSize(50, 0.2),
            threshold_title().fill('yellow', 0.2),
        ),
        threshold(0.4, 3).to(0.18, 2),
        all(
            threshold_title().fill(palette.secondary, 0.2),
            threshold_title().fontSize(40, 0.2),
        )
    )

    yield* waitUntil("smoothstep_it");
    yield* all(
        sequence(0.05,
            ...range(expanded_sdf_dim).map(i => sequence(0.01,
                ...range(expanded_sdf_dim).map(j => all(
                    fbo_pixels[(2*fbo_dim+3) + (i*fbo_dim+j)].fill(
                        () => new Color({
                            r: lerp(0, 240, smoothstep(c_sdf_bitmap_expanded[(i * expanded_sdf_dim + j) * 3 + 0]/255, threshold()-smoothness(), threshold()+smoothness())),
                            g: lerp(0, 61, smoothstep(c_sdf_bitmap_expanded[(i * expanded_sdf_dim + j) * 3 + 0]/255, threshold()-smoothness(), threshold()+smoothness())),
                            b: lerp(0, 200, smoothstep(c_sdf_bitmap_expanded[(i * expanded_sdf_dim + j) * 3 + 0]/255, threshold()-smoothness(), threshold()+smoothness())),
                            a: 1,
                        }
                    ), 0.1),
                    flash(fbo_pixels[(2*fbo_dim+3) + (i*fbo_dim+j)].width, 0, 0.3),
                ))
            ))
        ),
        smoothness_title().text(() => "Smoothness = " + smoothness().toFixed(3), 0.5),
        plotted_fn().code("output = smoothstep(\n\tthreshold - smoothness,\n\tthreshold + smoothness,\n\tvalue\n)", 0.5),
    );
    yield* chain(
        all(
            smoothness_title().fontSize(50, 0.2),
            smoothness_title().fill('yellow', 0.2),
        ),
        smoothness(0.4, 3).to(0.18, 2),
        all(
            smoothness_title().fill(palette.secondary, 0.2),
            smoothness_title().fontSize(40, 0.2),
        )
    );

    yield* waitUntil("big_advantage");

    yield* output_param_encloser().y(output_param_encloser().y() - 1700, 1.4);
    const second_fbo = fbo_encloser().clone();
    view.add(second_fbo);
    yield* all(
        fbo_encloser().x(450, 0.2),
        second_fbo.x(-450, 1.2)
    );

    yield* waitFor(4);
    yield* sequence(0.05,
        ...range(expanded_sdf_dim).map(i => sequence(0.01,
            ...range(expanded_sdf_dim).map(j => all(
                fbo_pixels[(2*fbo_dim+3) + (i*fbo_dim+j)].fill(
                    () => (c_sdf_bitmap_expanded[(i * expanded_sdf_dim + j) * 3 + 0]/255 < 0.05 ||
                           c_sdf_bitmap_expanded[(i * expanded_sdf_dim + j) * 3 + 0]/255 > 0.4) ?
                        new Color({
                            r: lerp(0, 240, smoothstep(c_sdf_bitmap_expanded[(i * expanded_sdf_dim + j) * 3 + 0]/255, threshold()-smoothness(), threshold()+smoothness())),
                            g: lerp(0, 61, smoothstep(c_sdf_bitmap_expanded[(i * expanded_sdf_dim + j) * 3 + 0]/255, threshold()-smoothness(), threshold()+smoothness())),
                            b: lerp(0, 200, smoothstep(c_sdf_bitmap_expanded[(i * expanded_sdf_dim + j) * 3 + 0]/255, threshold()-smoothness(), threshold()+smoothness())),
                            a: 1,
                        }) :
                        new Color({
                            r: 255,
                            g: 255,
                            b: 10,
                            a: 1,
                        }),
                        0.1),
            ))
        ))
    );

    yield* waitFor(2);
    yield* sequence(0.05,
        ...range(expanded_sdf_dim).map(i => sequence(0.01,
            ...range(expanded_sdf_dim).map(j => all(
                second_fbo.childrenAs<Rect>()[(2*fbo_dim+3) + (i*fbo_dim+j)+1].fill(
                    () => (c_sdf_bitmap_expanded[(i * expanded_sdf_dim + j) * 3 + 0]/255 <= 0.4) ?
                        new Color({
                            r: lerp(0, 240, smoothstep(c_sdf_bitmap_expanded[(i * expanded_sdf_dim + j) * 3 + 0]/255, threshold()-smoothness(), threshold()+smoothness())),
                            g: lerp(0, 61, smoothstep(c_sdf_bitmap_expanded[(i * expanded_sdf_dim + j) * 3 + 0]/255, threshold()-smoothness(), threshold()+smoothness())),
                            b: lerp(0, 200, smoothstep(c_sdf_bitmap_expanded[(i * expanded_sdf_dim + j) * 3 + 0]/255, threshold()-smoothness(), threshold()+smoothness())),
                            a: 1,
                        }) :
                        new Color({
                            r: 255,
                            g: 255,
                            b: 10,
                            a: 1,
                        }),
                0.1),
            ))
        ))
    );
    yield* waitUntil("remove_fbos");
    yield* sequence(0.3,
        second_fbo.y(-1800, 1.3),
        fbo_encloser().y(-1800, 1.3),
    );
    second_fbo.remove();
    fbo_encloser().remove();

    yield* encloser().x(-500, 0.6);
    const big_c_img_refs = createRefArray<Img>();
    view.add(<>
        {...c_big_imgs.map((s, i) => <Img
            ref={big_c_img_refs}
            src={s} smoothing={false}
            size={new Vector2([800, 800]).scale(c_big_scales[i] / 96)}
            x={400} y={-800 - i * (700 * Math.pow(c_big_scales[i] / 96, 1/4))}
            lineWidth={8} stroke={palette.primary}
        />)}
    </>);
    yield* all(
        ...big_c_img_refs.map(t => t.y(t.y() + 2900, 10, easeOutCubic)),
    );

    yield* waitUntil("quality_loss");
    yield* all(big_c_img_refs[3].y(1800, 0.8), encloser().x(encloser().x() - 900, 0.8))
    const quality_loss_show = createRef<Video>();
    view.add(<>
        <Video
            ref={quality_loss_show}
            src={quality_loss_vid}
            x={0} y={-1500}
            scale={0.5} padding={20}
            lineWidth={20} stroke={palette.primary}
            radius={5} opacity={0}
            {...primary_glow_props}
        />
    </>);
    quality_loss_show().play();
    yield* sequence(0.1,
        quality_loss_show().y(0, 0.8),
        quality_loss_show().scale(0.9, 0.8),
        quality_loss_show().opacity(1, 0.8),
    );

    yield* waitUntil("why_does_this_happen");
    yield* sequence(0.1,
        quality_loss_show().opacity(0, 0.8),
        quality_loss_show().scale(0.5, 0.8),
        quality_loss_show().y(1500, 0.8),
    );
    // a_sdf_bitmap
    yield* encloser().x(encloser().x() + 900, 0.8);
    yield* waitUntil("char_a");
    yield* sequence(0.05,
        ...range(sdf_dim).map(i => sequence(0.01,
            ...sdf_pixels.slice(i*sdf_dim, (i+1)*sdf_dim).map((t,j) => 
                all(
                    t.fill(new Color({
                        r: (a_sdf_bitmap[(i * sdf_dim + j) * 3 + 0]),
                        g: (a_sdf_bitmap[(i * sdf_dim + j) * 3 + 1]),
                        b: (a_sdf_bitmap[(i * sdf_dim + j) * 3 + 2]),
                        a: 1
                    }), 0.5),
                    flash(t.width, 10, 0.5),
                )
            )
        ))
    );
    const char_a_rendered = createRef<Img>();
    const clip_rect = createRef<Rect>();
    yield angle_sig(angle_sig() + 160, 80, linear);
    view.add(
    <Rect ref={clip_rect}
        x={1920/4} width={1920/2} height={1090}
        clip lineWidth={0} stroke={offset_rainbow(angle_sig)}>
        <Img
            ref={char_a_rendered}
            src={a_char_img}
            x={0} y={-1500}
            scale={0.5} padding={20}
            lineWidth={20} stroke={palette.primary}
            radius={5} opacity={0}
            {...primary_glow_props}
            smoothing={false}
        />
    </Rect>)
    
    yield* sequence(0.1,
        char_a_rendered().y(0, 0.8),
        char_a_rendered().scale(0.9, 0.8),
        char_a_rendered().opacity(1, 0.8),
    );
    yield* all(
        clip_rect().lineWidth(20, 1.2),
        char_a_rendered().scale(3.5, 0.8),
        char_a_rendered().y(800, 0.8),
    );

    yield* waitUntil("show_samples");
    yield* sequence(0.05,
        ...range(sdf_dim).map(i => sequence(0.01,
            ...sdf_pixels.slice(i*sdf_dim, (i+1)*sdf_dim).map((t,j) => 
                all(
                    flash(t.size, [90,90], 0.5),
                )
            )
        ))
    );
    // 5,3
    const sample_points = createRefArray<Circle>();
    const sample_points_TO = createRefArray<Circle>();
    view.add(<>
        <Circle
            ref={sample_points}
            position={sdf_pixels[3*sdf_dim+5].absolutePosition().sub([1920/2,1080/2])}
            size={[0,0]}
            lineWidth={5} stroke={"yellow"}
        />
        <Circle
            ref={sample_points}
            position={sdf_pixels[3*sdf_dim+6].absolutePosition().sub([1920/2,1080/2])}
            size={[0,0]}
            lineWidth={5} stroke={"yellow"}
        />
        <Circle
            ref={sample_points}
            position={sdf_pixels[4*sdf_dim+5].absolutePosition().sub([1920/2,1080/2])}
            size={[0,0]}
            lineWidth={5} stroke={"yellow"}
        />
        <Circle
            ref={sample_points}
            position={sdf_pixels[4*sdf_dim+6].absolutePosition().sub([1920/2,1080/2])}
            size={[0,0]}
            lineWidth={5} stroke={"yellow"}
        />
    </>);
    // , [200, -200]
    
    yield* waitFor(2);
    yield* sequence(0.1,
        ...sample_points.map(t => t.size([40,40], 1.2)),
    )
    yield* waitFor(0.5);
    yield* sequence(0.1,
        ...sample_points.map((t, i) => chain(
            all(
                t.fill(sdf_pixels[(3+(i%2))*sdf_dim+(5+Math.floor(i/2))].fill(), 0.8),
                t.stroke("#000", 0.8),
            ),
            t.position(new Vector2([400, -335]).add([200*(i%2), 200*Math.floor(i/2)]), 0.8)
        )),
    );
    yield* waitFor(4);
    const the_tri = createRef<Line>();
    view.add(<Line
       ref={the_tri}
       points={[[450,-125], [546, -125], [500, -250]]} 
       lineWidth={8} closed fill={"black"} opacity={0}
    />);
    yield* flash(the_tri().opacity, 1, 3.5);

    yield* waitUntil("how2fix");
    yield* encloser().y(encloser().y() - 200, 0.8)

    yield* waitUntil("specifics");
    const left_side = createRef<Line>();
    const right_side = createRef<Line>();
    clip_rect().add(<>
        <Line
            ref={left_side}
            stroke={offset_rainbow(angle_sig)} lineWidth={15}
            points={[
                [300-(1920/4), -540],
                [-290-(1920/4), 800],
                [44-(1920/4), 800],
                [620-(1920/4), -540],
            ]}
            fill={"#feffcc"}
            closed opacity={0}
        />
        <Line
            ref={right_side}
            stroke={offset_rainbow(angle_sig)} lineWidth={15}
            points={[
                [-(300-(1920/4))+30, -540],
                [-(-290-(1920/4))+30, 800],
                [-(44-(1920/4))+30, 800],
                [-(620-(1920/4))+30, -540],
            ]}
            fill={"#feffcc"}
            closed opacity={0}
        />
    </>);
    yield* waitUntil("flash_left");
    yield* right_side().opacity(1, 1.2);
    yield* waitFor(3);
    yield* sequence(0.1,
        flash_delay(sample_points[0].size, 0, 2.8, .9),
        flash_delay(sample_points[2].size, 0, 2.8, .9),
    );
    
    yield* waitUntil("flash_right");
    yield* all(
        right_side().opacity(0, 0.8),
        left_side().opacity(1, 0.8),
    )
    yield* waitFor(1);
    yield* sequence(0.1,
        flash_delay(sample_points[1].size, 0, 2.0, .5),
        flash_delay(sample_points[3].size, 0, 2.0, .5),
    );
    yield* waitUntil("driving_idea");
    yield* sequence(0.1,
        all(
            ...sample_points.map(t=>t.x(t.x()+1000, 0.5)),
            clip_rect().x(clip_rect().x() + 1000, 0.5)
        )
    );

    // SETUP

    const center_line = createRef<Line>();
    const divider_lines = createRefArray<Line>();
    const my_d = createRef<Txt>();
    const center_pack = createRef<Node>();
    const bitmap_encloser = createRef<Line>();

    const bitmap_padding = 40;
    const bitmap_width = (((425/2) - bitmap_padding) * 2);
    const bitmap_pix_start = (-(425/2) + bitmap_padding);
    const bitmap_dim = 6;
    const bitmap_pixel_size = bitmap_width / bitmap_dim;

    const curve_encloser = createRef<Line>();
    const vecfont_title_ref = createRef<Txt>();
    view.add(<>
        <Node ref={center_pack} x={2000} y={-1000}>
            <Txt
                ref={my_d}
                fontFamily={"Jetbrains Mono"}
                text={"D"}
                fill={palette.text}
                fontSize={342}
            />
            <Line
                ref={center_line}
                points={[
                    [0, -220],
                    [-220, -220],
                    [-220,  220],
                    [ 220,  220],
                    [ 220, -220],
                    [0, -220],
                ]}
                closed radius={10}
                lineWidth={50} stroke={palette.primary}
            />
            <Line
                ref={divider_lines}
                points={[
                    [0, -220],
                    [0, -1000],
                ]}
                lineWidth={50} stroke={palette.primary}
            />
            <Line
                ref={divider_lines}
                points={[
                    [-220, 0],
                    [-2000, 0],
                ]}
                lineWidth={50} stroke={palette.primary}
            />
            <Line
                ref={divider_lines}
                points={[
                    [0, 220],
                    [0, 1000],
                ]}
                lineWidth={50} stroke={palette.primary}
            />
            <Line
                ref={divider_lines}
                points={[
                    [220, 0],
                    [2000, 0],
                ]}
                lineWidth={50} stroke={palette.primary}
            />
            <Line
                ref={bitmap_encloser}
                lineWidth={6} position={[-550, -300]}
                scale={0.8}
                stroke={palette.primary}
                points={[
                    [ 0, 425/2 ],
                    [ 425/2, 425/2 ],
                    [ 425/2, -345/2 ],
                    [ 275/2, -345/2 ],
                    [ 220/2, -425/1.75 ],
                    [ -220/2, -425/1.75 ],
                    [ -275/2, -345/2 ],
                    [ -425/2, -345/2 ],
                    [ -425/2, 425/2 ],
                    [ 0, 425/2 ],
                ]}
                closed zIndex={-5}
                fill={palette.foreground}
                {...primary_glow_props}
            />
            <Line
                ref={curve_encloser}
                lineWidth={6}
                stroke={palette.primary}
                points={[
                    [ 0, 425 ],
                    [ 425, 425 ],
                    [ 425, -345 ],
                    [ 275, -345 ],
                    [ 220, -425 ],
                    [ -220, -425 ],
                    [ -275, -345 ],
                    [ -425, -345 ],
                    [ -425, 425 ],
                    [ 0, 425 ],
                ]}
                closed zIndex={-5}
                fill={palette.foreground}
                {...primary_glow_props}
            >
                <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={vecfont_title_ref}
                    text={"Vector"}
                    fill={palette.text}
                    x={0} y={-360}
                    fontSize={90}
                />
            </Line>
        </Node>
    </>);
    const bitmap_pixels = createRefArray<Rect>();
    const bitmap_title_ref = createRef<Txt>();

    const bitmap = [
        0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0,
        0, 1, 0, 0, 1, 0,
        0, 1, 1, 1, 1, 0,
        0, 1, 0, 0, 1, 0,
    ];
    bitmap_encloser().add(<>
        {...range(bitmap_dim * bitmap_dim).map(i => <Rect
            ref={bitmap_pixels}
            x={bitmap_pix_start + (i % bitmap_dim) * (bitmap_pixel_size+0.5) + (bitmap_pixel_size / 2)}
            y={-150 + (Math.floor(i / bitmap_dim)) * (bitmap_pixel_size+0.5) + (bitmap_pixel_size / 2)}
            size={[bitmap_pixel_size,bitmap_pixel_size]} zIndex={0}
            fill={bitmap[i] == 0 ? "#111111" : palette.accent} radius={2}
        />)}
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={bitmap_title_ref}
            text={"Bitmap"}
            fill={palette.text}
            x={0} y={-200}
            fontSize={55}
        />
    </>);

    const b_glyph = createRef<Node>();
    const b_lines = createRefArray<Line>();
    const b_points = createRefArray<Circle>();
    const b_curves = createRefArray<Bezier>();
    const animator_a = createSignal(1);
    const animator_b = createSignal(1);
    const animator_c = createSignal(1);
    curve_encloser().add(<Node ref={b_glyph} y={40} scale={1.4}>
        <Line
            ref={b_lines}
            lineWidth={8} stroke={palette.text}
            points={[[-150, -200], [-150, 200]]}
            start={() => 0.5-(animator_a()/2)} end={() => 0.5+(animator_a()/2)}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_a()), lerp(0,20,animator_a())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(-150, -150, animator_a()), lerp(0, 200, animator_a())]}
            />
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_a()), lerp(0,20,animator_a())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(-150, -150, animator_a()), lerp(0, -200, animator_a())]}
            />
        </Line>
        <Line
            ref={b_lines}
            lineWidth={8} stroke={palette.text} zIndex={-1}
            points={[[-75, -150], [-75, -50]]}
            start={() => 0.5-(animator_a()/2)} end={() => 0.5+(animator_a()/2)}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_a()), lerp(0,20,animator_a())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(-75, -75, animator_a()), lerp(-100, -50, animator_a())]}
            />
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_a()), lerp(0,20,animator_a())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(-75, -75, animator_a()), lerp(-100, -150, animator_a())]}
            />
        </Line>
        <Line
            ref={b_lines}
            lineWidth={8} stroke={palette.text} zIndex={-1}
            points={[[-75, 150], [-75, 50]]}
            start={() => 0.5-(animator_a()/2)} end={() => 0.5+(animator_a()/2)}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_a()), lerp(0,20,animator_a())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(-75, -75, animator_a()), lerp(100, 50, animator_a())]}
            />
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_a()), lerp(0,20,animator_a())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(-75, -75, animator_a()), lerp(100, 150, animator_a())]}
            />
        </Line>

        <QuadBezier
            ref={b_curves}
            lineWidth={8} stroke={palette.text}
            p0={[-133, -205]}
            p1={[100, -220]}
            p2={[100, -100]}
            end={() => animator_b()}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_b()), lerp(0,20,animator_b())]}
                stroke={palette.primary} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(-133, 100, animator_b()), lerp(-205, -220, animator_b())]}
            />
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_b()), lerp(0,20,animator_b())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => b_curves[0].getPointAtPercentage(animator_b()).position}
            />
        </QuadBezier>
        <QuadBezier
            ref={b_curves}
            lineWidth={8} stroke={palette.text}
            p0={[-133, 205]}
            p1={[100, 220]}
            p2={[100, 100]}
            end={() => animator_b()}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_b()), lerp(0,20,animator_b())]}
                stroke={palette.primary} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(-133, 100, animator_b()), lerp(205, 220, animator_b())]}
            />
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_b()), lerp(0,20,animator_b())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => b_curves[1].getPointAtPercentage(animator_b()).position}
            />
        </QuadBezier>
        <QuadBezier
            ref={b_curves}
            lineWidth={8} stroke={palette.text}
            p0={[100, -90]}
            p1={[100, -30]}
            p2={[25, 0]}
            end={() => animator_c()}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_c()), lerp(0,20,animator_c())]}
                stroke={palette.primary} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(100, 100, animator_c()), lerp(-90, -30, animator_c())]}
            />
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_c()), lerp(0,20,animator_c())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => b_curves[2].getPointAtPercentage(animator_c()).position}
            />
        </QuadBezier>
        <QuadBezier
            ref={b_curves}
            lineWidth={8} stroke={palette.text}
            p0={[100, 90]}
            p1={[100, 30]}
            p2={[25, 0]}
            end={() => animator_c()}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_c()), lerp(0,20,animator_c())]}
                stroke={palette.primary} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(100, 100, animator_c()), lerp(90, 30, animator_c())]}
            />
        </QuadBezier>

        <QuadBezier
            ref={b_curves}
            lineWidth={8} stroke={palette.text}
            p0={[-58, -152]}
            p1={[20, -160]}
            p2={[20, -100]}
            end={() => animator_b()}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_b()), lerp(0,20,animator_b())]}
                stroke={palette.primary} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(-58, 20, animator_b()), lerp(-152, -160, animator_b())]}
            />
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_b()), lerp(0,20,animator_b())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => b_curves[4].getPointAtPercentage(animator_b()).position}
            />
        </QuadBezier>
        <QuadBezier
            ref={b_curves}
            lineWidth={8} stroke={palette.text}
            p0={[-58, 152]}
            p1={[20, 160]}
            p2={[20, 100]}
            end={() => animator_b()}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_b()), lerp(0,20,animator_b())]}
                stroke={palette.primary} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(-58, 20, animator_b()), lerp(152, 160, animator_b())]}
            />
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_b()), lerp(0,20,animator_b())]}
                stroke={palette.text} lineWidth={5}
                fill={palette.foreground}
                position={() => b_curves[5].getPointAtPercentage(animator_b()).position}
            />
        </QuadBezier>
        <QuadBezier
            ref={b_curves}
            lineWidth={8} stroke={palette.text}
            p0={[20, -90]}
            p1={[20, -38]}
            p2={[-58, -48]}
            end={() => animator_c()}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_c()), lerp(0,20,animator_c())]}
                stroke={palette.primary} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(20, 20, animator_c()), lerp(-90, -38, animator_c())]}
            />
        </QuadBezier>
        <QuadBezier
            ref={b_curves}
            lineWidth={8} stroke={palette.text}
            p0={[20, 90]}
            p1={[20, 38]}
            p2={[-58, 48]}
            end={() => animator_c()}
        >
            <Circle
                ref={b_points}
                size={() => [lerp(0,20,animator_c()), lerp(0,20,animator_c())]}
                stroke={palette.primary} lineWidth={5}
                fill={palette.foreground}
                position={() => [lerp(20, 20, animator_c()), lerp(90, 38, animator_c())]}
            />
        </QuadBezier>
    </Node>);
    
    curve_encloser().position([550, -300]),
    curve_encloser().scale(0.45),
    curve_encloser().lineWidth(10),
    curve_encloser().points([
        [ 0, 425/1.05 ],
        [ 425/1.05, 425/1.05 ],
        [ 425/1.05, -345/1.05 ],
        [ 245/1.05, -345/1.05 ],
        [ 220/1.05, -450/1.05 ],
        [ -220/1.05, -450/1.05 ],
        [ -245/1.05, -345/1.05 ],
        [ -425/1.05, -345/1.05 ],
        [ -425/1.05, 425/1.05 ],
        [ 0, 425/1.05 ],
    ]),

    yield* all(
        center_pack().position([0, 0], 1.5),
        encloser().position([-550, 300], 1.5),
        encloser().scale(0.45, 1),
        encloser().lineWidth(10, 1),
        encloser().points([
            [ 0, 425/1.05 ],
            [ 425/1.05, 425/1.05 ],
            [ 425/1.05, -345/1.05 ],
            [ 245/1.05, -345/1.05 ],
            [ 220/1.05, -450/1.05 ],
            [ -220/1.05, -450/1.05 ],
            [ -245/1.05, -345/1.05 ],
            [ -425/1.05, -345/1.05 ],
            [ -425/1.05, 425/1.05 ],
            [ 0, 425/1.05 ],
        ], 1),
        encloser().childAs<Txt>(0).text("SDF", 1.5),
        encloser().childAs<Txt>(0).y(-360, 1.5),
    );
    yield* encloser().childAs<Txt>(0).fontSize(90, 1.5);

    yield* waitUntil("msdf_title_drop");
    yield* all(
        center_pack().position([-2000, -1000], 1.5),
        encloser().position(encloser().position().add([-2000, -1000]), 1.5),
    )
    yield* waitFor(0.5);
    const multi_sdf_font_title = createRef<Txt>();
    view.add(<>
        <Txt
            fontFamily={"Jetbrains Mono"}
            ref={multi_sdf_font_title}
            text={""}
            fill={palette.text}
            x={0} y={0}
            fontSize={120}
        />
    </>);
    yield* multi_sdf_font_title().text("MSDF Fonts", 0.7);

    yield* waitUntil("end");
});
