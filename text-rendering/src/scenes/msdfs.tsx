import { Bezier, Circle, Code, Layout, LezerHighlighter, Line, Node, QuadBezier, Rect, SVG, Txt, Video, lines, makeScene2D, replace } from "@motion-canvas/2d";
import { Color, DEFAULT, Vector2, all, createRef, createRefArray, createSignal, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { palette, primary_glow_props } from "../lib/palette";
import { flash, lerp, range_check } from "../lib/utilities";
import { smoothstep } from "three/src/math/MathUtils";


import original_thesis_vid from "../extern/OriginalShow.mp4"


import {parser} from '@lezer/cpp';
Code.defaultHighlighter = new LezerHighlighter(parser);

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

const msdf_16 = [
    0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x09, 0x09, 0xff, 0x2c, 0x2c, 0xff, 0x3d, 0x3d, 0xff, 0x3e, 0x3e, 0xff, 0x2f, 0x2f, 0xff, 0x0e, 0x0e, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 
    0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x45, 0x45, 0xff, 0x80, 0x80, 0xff, 0xa8, 0xa8, 0xff, 0xbc, 0xbc, 0xff, 0xbe, 0xbe, 0xff, 0xac, 0xac, 0xff, 0x86, 0x86, 0xff, 0x4b, 0x4b, 0xff, 0x01, 0x01, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 
    0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x59, 0x59, 0xff, 0xae, 0xae, 0xff, 0xf3, 0xf3, 0xd2, 0xff, 0xd2, 0xb3, 0xff, 0xb3, 0xb0, 0xff, 0xb0, 0xca, 0xff, 0xca, 0xff, 0xf9, 0xf9, 0xff, 0xb4, 0xb4, 0xff, 0x60, 0x60, 0xff, 0x01, 0x01, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 
    0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x44, 0x44, 0xff, 0xad, 0xad, 0xfe, 0xff, 0xfe, 0xa4, 0xff, 0xa4, 0x5d, 0xff, 0x5d, 0x35, 0xff, 0x35, 0x31, 0xff, 0x31, 0x53, 0xff, 0x53, 0x97, 0xff, 0x97, 0xf0, 0xff, 0xf0, 0xff, 0xb4, 0xb4, 0xff, 0x4a, 0x4a, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 
    0xff, 0x00, 0x00, 0xff, 0x0a, 0x0a, 0xff, 0x80, 0x80, 0xff, 0xf3, 0xf3, 0xb4, 0xff, 0xb4, 0x4b, 0x00, 0x4b, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x3c, 0x00, 0x3c, 0xa6, 0xff, 0xa6, 0xff, 0xf8, 0xf8, 0xff, 0x85, 0x85, 0xff, 0x0f, 0x0f, 0xff, 0x00, 0x00, 
    0xff, 0x00, 0x00, 0xff, 0x30, 0x30, 0xff, 0xab, 0xab, 0xfc, 0xff, 0xfc, 0x81, 0x00, 0x81, 0x09, 0x00, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x77, 0x00, 0x77, 0xf3, 0xff, 0xf3, 0xff, 0xaf, 0xaf, 0xff, 0x34, 0x34, 0xff, 0x00, 0x00, 
    0xff, 0x00, 0x00, 0xff, 0x48, 0x48, 0xff, 0xc6, 0xc6, 0xe7, 0x64, 0xe7, 0x68, 0x64, 0x68, 0x64, 0x64, 0x00, 0x64, 0x64, 0x00, 0x64, 0x64, 0x00, 0x64, 0x64, 0x00, 0x64, 0x64, 0x00, 0x64, 0x64, 0x00, 0x64, 0x64, 0x5f, 0xde, 0x64, 0xde, 0xff, 0xc9, 0xc9, 0xff, 0x4a, 0x4a, 0xff, 0x00, 0x00, 
    0xff, 0x00, 0x00, 0xff, 0x54, 0x54, 0xff, 0xd3, 0xd3, 0xe4, 0xe4, 0xdf, 0xe4, 0xe4, 0x5f, 0xe4, 0xe4, 0x00, 0xe4, 0xe4, 0x00, 0xe4, 0xe4, 0x00, 0xe4, 0xe4, 0x00, 0xe4, 0xe4, 0x00, 0xe4, 0xe4, 0x00, 0xe4, 0xe4, 0x53, 0xe4, 0xe4, 0xd2, 0xff, 0xd4, 0xd4, 0xff, 0x55, 0x55, 0xff, 0x00, 0x00, 
    0x8a, 0x00, 0x00, 0x8a, 0x55, 0x55, 0x8a, 0xd5, 0xd5, 0x8a, 0xd4, 0xd4, 0x8a, 0x8a, 0x55, 0x8a, 0x8a, 0x00, 0x8a, 0x8a, 0x00, 0x8a, 0x8a, 0x00, 0x8a, 0x8a, 0x00, 0x8a, 0x8a, 0x00, 0x8a, 0x8a, 0x00, 0x8a, 0x8a, 0x48, 0x8a, 0x8a, 0xff, 0x8a, 0x8a, 0xd4, 0x8a, 0x55, 0x55, 0x8a, 0x00, 0x00, 
    0x0a, 0x00, 0x00, 0x0a, 0x4b, 0x4b, 0x0a, 0xca, 0xca, 0x0a, 0xe1, 0xe1, 0x0a, 0x63, 0x63, 0x0a, 0x0a, 0x00, 0x0a, 0x0a, 0x00, 0x0a, 0x0a, 0x00, 0x0a, 0x0a, 0x00, 0x0a, 0x0a, 0x00, 0x0a, 0x0a, 0x00, 0x14, 0x3b, 0x14, 0x0a, 0x0a, 0x04, 0x0a, 0x0a, 0x00, 0x0a, 0x0a, 0x51, 0x0a, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x35, 0x35, 0x00, 0xb1, 0xb1, 0x00, 0xfd, 0xfd, 0x00, 0x84, 0x84, 0x00, 0x0e, 0x0e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xa2, 0x00, 0x00, 0x92, 0x67, 0x67, 0x83, 0xde, 0x83, 0x73, 0xcf, 0x73, 0x63, 0x54, 0x54, 0x54, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x10, 0x10, 0x00, 0x87, 0x87, 0x00, 0xfa, 0xfa, 0x00, 0xba, 0xba, 0x00, 0x51, 0x51, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x33, 0x33, 0xff, 0x9e, 0x9e, 0xff, 0xff, 0xff, 0xf1, 0xa5, 0xa5, 0xe2, 0x2f, 0x2f, 0xd2, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x4c, 0x4c, 0x00, 0xb5, 0xb5, 0x00, 0xff, 0xff, 0x00, 0xab, 0xab, 0x00, 0x62, 0x62, 0x00, 0x37, 0x37, 0xff, 0x30, 0x30, 0xff, 0x4c, 0x4c, 0xff, 0x8d, 0x8d, 0xff, 0xe7, 0xe7, 0xff, 0xd3, 0xd3, 0xff, 0x6b, 0x6b, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x02, 0x00, 0x61, 0x61, 0x00, 0xb4, 0xb4, 0x00, 0xf6, 0xf6, 0x00, 0xd6, 0xd6, 0x00, 0xb5, 0xb5, 0xff, 0xaf, 0xaf, 0xff, 0xc5, 0xc5, 0xff, 0xf7, 0xf7, 0xff, 0xce, 0xce, 0xff, 0x7d, 0x7d, 0xff, 0x20, 0x20, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00, 0x49, 0x49, 0x00, 0x82, 0x82, 0x00, 0xa8, 0xa8, 0xff, 0xbc, 0xbc, 0xff, 0xbf, 0xbf, 0xff, 0xb2, 0xb2, 0xff, 0x93, 0x93, 0xff, 0x61, 0x61, 0xff, 0x1c, 0x1c, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0a, 0x0a, 0x00, 0x2b, 0x2b, 0xff, 0x3c, 0x3c, 0xff, 0x3f, 0x3f, 0xff, 0x34, 0x34, 0xff, 0x1a, 0x1a, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00,
];

const msdf_18 = [
    0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x10, 0x10, 0xff, 0x2e, 0x2e, 0xff, 0x3d, 0x3d, 0xff, 0x3f, 0x3f, 0xff, 0x32, 0x32, 0xff, 0x15, 0x15, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 
    0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x12, 0x12, 0xff, 0x55, 0x55, 0xff, 0x89, 0x89, 0xff, 0xab, 0xab, 0xff, 0xbd, 0xbd, 0xff, 0xbe, 0xbe, 0xff, 0xaf, 0xaf, 0xff, 0x8e, 0x8e, 0xff, 0x5b, 0x5b, 0xff, 0x19, 0x19, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 
    0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x20, 0x20, 0xff, 0x77, 0x77, 0xff, 0xc3, 0xc3, 0xff, 0xff, 0xff, 0xef, 0xff, 0xef, 0xd5, 0xff, 0xd5, 0xd2, 0xff, 0xd2, 0xe7, 0xff, 0xe7, 0xff, 0xff, 0xff, 0xff, 0xca, 0xca, 0xff, 0x7f, 0x7f, 0xff, 0x28, 0x28, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 
    0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x0c, 0x0c, 0xff, 0x74, 0x74, 0xff, 0xd4, 0xd4, 0xff, 0xff, 0xff, 0xb2, 0xff, 0xb2, 0x76, 0xff, 0x76, 0x56, 0xff, 0x56, 0x53, 0xff, 0x53, 0x6d, 0xff, 0x6d, 0xa4, 0xff, 0xa4, 0xf2, 0xff, 0xf2, 0xff, 0xdc, 0xdc, 0xff, 0x7b, 0x7b, 0xff, 0x13, 0x13, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 
    0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x4c, 0x4c, 0xff, 0xbc, 0xbc, 0xff, 0xff, 0xff, 0xab, 0xff, 0xab, 0x4e, 0xff, 0x4e, 0x03, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x3e, 0xff, 0x3e, 0x9a, 0xff, 0x9a, 0xff, 0xff, 0xff, 0xff, 0xc3, 0xc3, 0xff, 0x52, 0x52, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 
    0xff, 0x00, 0x00, 0xff, 0x05, 0x05, 0xff, 0x7e, 0x7e, 0xff, 0xf5, 0xf5, 0xd9, 0xff, 0xd9, 0x66, 0x00, 0x66, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x56, 0x00, 0x56, 0xcc, 0xff, 0xcc, 0xff, 0xfb, 0xfb, 0xff, 0x84, 0x84, 0xff, 0x0a, 0x0a, 0xff, 0x00, 0x00, 
    0xff, 0x00, 0x00, 0xff, 0x26, 0x26, 0xff, 0xa2, 0xa2, 0xff, 0xff, 0xff, 0xb4, 0x00, 0xb4, 0x38, 0x00, 0x38, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x2d, 0x00, 0x2d, 0xa9, 0x00, 0xa9, 0xff, 0xff, 0xff, 0xff, 0xa6, 0xa6, 0xff, 0x2a, 0x2a, 0xff, 0x00, 0x00, 
    0xff, 0x00, 0x00, 0xff, 0x3b, 0x3b, 0xff, 0xb9, 0xb9, 0xff, 0x7c, 0xff, 0xa2, 0x7c, 0xa2, 0x7c, 0x7c, 0x23, 0x7c, 0x7c, 0x00, 0x7c, 0x7c, 0x00, 0x7c, 0x7c, 0x00, 0x7c, 0x7c, 0x00, 0x7c, 0x7c, 0x00, 0x7c, 0x7c, 0x00, 0x7c, 0x7c, 0x18, 0x97, 0x7c, 0x97, 0xff, 0x7c, 0xff, 0xff, 0xbc, 0xbc, 0xff, 0x3d, 0x3d, 0xff, 0x00, 0x00, 
    0xff, 0x00, 0x00, 0xff, 0x45, 0x45, 0xff, 0xc5, 0xc5, 0xff, 0xff, 0xff, 0xfb, 0xfb, 0x9a, 0xfb, 0xfb, 0x1b, 0xfb, 0xfb, 0x00, 0xfb, 0xfb, 0x00, 0xfb, 0xfb, 0x00, 0xfb, 0xfb, 0x00, 0xfb, 0xfb, 0x00, 0xfb, 0xfb, 0x00, 0xfb, 0xfb, 0x0d, 0xfb, 0xfb, 0x8c, 0xff, 0xff, 0xff, 0xff, 0xc5, 0xc5, 0xff, 0x46, 0x46, 0xff, 0x00, 0x00, 
    0x94, 0x00, 0x00, 0x94, 0x46, 0x46, 0x94, 0xc6, 0xc6, 0x94, 0xff, 0xff, 0x94, 0x94, 0x8e, 0x94, 0x94, 0x0f, 0x94, 0x94, 0x00, 0x94, 0x94, 0x00, 0x94, 0x94, 0x00, 0x94, 0x94, 0x00, 0x94, 0x94, 0x00, 0x94, 0x94, 0x00, 0x94, 0x94, 0x01, 0x94, 0x94, 0x80, 0x94, 0x94, 0xff, 0x94, 0x94, 0xc5, 0x94, 0x46, 0x46, 0x94, 0x00, 0x00, 
    0x15, 0x00, 0x00, 0x15, 0x3e, 0x3e, 0x15, 0xbd, 0xbd, 0x15, 0xff, 0xff, 0x15, 0x9a, 0x9a, 0x15, 0x1c, 0x1c, 0x15, 0x15, 0x00, 0x15, 0x15, 0x00, 0x15, 0x15, 0x00, 0x15, 0x15, 0x00, 0x15, 0x15, 0x00, 0x15, 0x15, 0x00, 0x15, 0x15, 0x00, 0x15, 0x15, 0x00, 0x15, 0x15, 0x00, 0x15, 0x15, 0xc1, 0x15, 0x15, 0x42, 0x15, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x2b, 0x2b, 0x00, 0xa8, 0xa8, 0x00, 0xff, 0xff, 0x00, 0xb4, 0xb4, 0x00, 0x39, 0x39, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x7f, 0x00, 0x00, 0x6f, 0x17, 0x17, 0x60, 0x8f, 0x60, 0x50, 0xff, 0x50, 0x41, 0xcc, 0x41, 0x31, 0x51, 0x31, 0x21, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x0c, 0x0c, 0x00, 0x85, 0x85, 0x00, 0xfd, 0xfd, 0x00, 0xde, 0xde, 0x00, 0x6c, 0x6c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xfe, 0x00, 0x00, 0xee, 0x4b, 0x4b, 0xde, 0xbe, 0xbe, 0xcf, 0xff, 0xcf, 0xbf, 0xa8, 0xa8, 0xaf, 0x2f, 0x2f, 0xa0, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x54, 0x54, 0x00, 0xc5, 0xc5, 0x00, 0xff, 0xff, 0x00, 0xb2, 0xb2, 0x00, 0x55, 0x55, 0x00, 0x09, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x33, 0x33, 0xff, 0x90, 0x90, 0xff, 0xf9, 0xf9, 0xff, 0xe8, 0xe8, 0xff, 0x77, 0x77, 0xff, 0x03, 0x03, 0xff, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x15, 0x15, 0x00, 0x7d, 0x7d, 0x00, 0xdd, 0xdd, 0x00, 0xff, 0xff, 0x00, 0xb9, 0xb9, 0x00, 0x7b, 0x7b, 0x00, 0x58, 0x58, 0xff, 0x52, 0x52, 0xff, 0x67, 0x67, 0xff, 0x9b, 0x9b, 0xff, 0xe7, 0xe7, 0xff, 0xfe, 0xfe, 0xff, 0x9f, 0x9f, 0xff, 0x38, 0x38, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x29, 0x29, 0x00, 0x7e, 0x7e, 0x00, 0xc8, 0xc8, 0x00, 0xff, 0xff, 0x00, 0xf3, 0xf3, 0x00, 0xd6, 0xd6, 0xff, 0xd1, 0xd1, 0xff, 0xe2, 0xe2, 0xff, 0xff, 0xff, 0xff, 0xe3, 0xe3, 0xff, 0x9d, 0x9d, 0xff, 0x4a, 0x4a, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x18, 0x18, 0x00, 0x58, 0x58, 0x00, 0x8a, 0x8a, 0x00, 0xab, 0xab, 0xff, 0xbc, 0xbc, 0xff, 0xbf, 0xbf, 0xff, 0xb5, 0xb5, 0xff, 0x9b, 0x9b, 0xff, 0x70, 0x70, 0xff, 0x34, 0x34, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x10, 0x00, 0x2d, 0x2d, 0xff, 0x3d, 0x3d, 0xff, 0x3f, 0x3f, 0xff, 0x36, 0x36, 0xff, 0x1f, 0x1f, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 0xff, 0x00, 0x00, 
]

export default makeScene2D(function* (view) {
    const encloser = createRef<Line>();
    view.add(<>
        <Line
            ref={encloser}
            lineWidth={6}
            stroke={palette.primary}
            points={[
                [ 0, 425 ],
                [ 425*0.9, 425 ],
                [ 425*0.9, -345 ],
                [ 275, -345 ],
                [ 220, -425 ],
                [ -220, -425 ],
                [ -275, -345 ],
                [ -425*0.9, -345 ],
                [ -425*0.9, 425 ],
                [ 0, 425 ],
            ]}
            closed zIndex={-5}
            start={0.5} end={0.5}
            fill={palette.foreground}
            {...primary_glow_props}
        />
    </>);
    const multi_sdf_font_title = createRef<Txt>();
    encloser().add(<Txt
        fontFamily={"Jetbrains Mono"}
        ref={multi_sdf_font_title}
        text={"MSDF Fonts"}
        fill={palette.text}
        x={0} y={0}
        fontSize={120}
    />);
    const multi_sdf_font_subtitle = createRef<Txt>();
    encloser().add(<Txt
        fontFamily={"Jetbrains Mono"}
        ref={multi_sdf_font_subtitle}
        text={""}
        fill={new Color(palette.text).darken()}
        x={0} y={140}
        fontSize={80}
    />);
    yield* waitUntil("drop_subtitle");
    yield* multi_sdf_font_subtitle().text("(Multi-Channel SDFs)", 0.8);
    yield* waitUntil("idea_behind_msdfs");
    yield* sequence(0.1,
        multi_sdf_font_title().fontSize(60, 0.8),
        multi_sdf_font_title().y(-375, 0.8),
        multi_sdf_font_subtitle().fontSize(40, 0.8),
        multi_sdf_font_subtitle().y(-375+70, 0.8),
        
    );

    const glyph_e = createRef<Node>();
    const all_ends = createSignal(0);
    const sections = createRefArray<Node>();
    view.add(<>
        <Node ref={glyph_e} y={100}>
            <Node ref={sections}>
                <Line
                    points={[[-120, 0], [100, 0]]}
                    lineWidth={8} end={() => all_ends()}
                    stroke={palette.text}
                />
            </Node>
            <Node ref={sections}>
                <Line
                    points={[[-120, -40], [40, -40]]}
                    lineWidth={8} end={() => all_ends()}
                    stroke={palette.text}
                />
            </Node>
            <Node ref={sections}>
                <QuadBezier
                    p0={[100, 0]}
                    p1={[100, -200]}
                    p2={[-40, -200]}
                    lineWidth={8} end={() => all_ends()}
                    stroke={palette.text}
                />
                <QuadBezier
                    p0={[-40, -200]}
                    p1={[-180, -200]}
                    p2={[-180, 0]}
                    lineWidth={8} end={() => all_ends()}
                    stroke={palette.text}
                />
                <QuadBezier
                    p0={[-180, 0]}
                    p1={[-180, 200]}
                    p2={[60, 160]}
                    lineWidth={8} end={() => all_ends()}
                    stroke={palette.text}
                />
            </Node>
            
            
            <Node ref={sections}>
                <Line
                    points={[[60, 160], [60, 100]]}
                    lineWidth={8} end={() => all_ends()}
                    stroke={palette.text}
                />
            </Node>

            <Node ref={sections}>
                <QuadBezier
                    p0={[60, 100]}
                    p1={[-120, 120]}
                    p2={[-120, 0]}
                    lineWidth={8} end={() => all_ends()}
                    stroke={palette.text}
                />
            </Node>
            <Node ref={sections}>
                <QuadBezier
                    p0={[-120, -40]}
                    p1={[-120, -150]}
                    p2={[-40, -150]}
                    lineWidth={8} end={() => all_ends()}
                    stroke={palette.text}
                />
                <QuadBezier
                    p0={[120-80, -40]}
                    p1={[120-80, -150]}
                    p2={[40-80, -150]}
                    lineWidth={8} end={() => all_ends()}
                    stroke={palette.text}
                />
            </Node>
        </Node>
    </>);

    yield* waitUntil("take_e");
    yield* all_ends(1, 1.2);

    yield* waitFor(2);
    yield* sequence(0.1,
        ...sections.map((t, i) => t.position(new Vector2(-700 + i*300, 0), 0.8)),
    );
    const colors = [
        "cyan",
        "cyan",
        "yellow",
        "magenta",
        "yellow",
        "yellow",
    ]
    yield* sequence(0.1,
        ...sections.map((t, i) => all(
            // @ts-expect-error
            ...t.children().map(c => c.stroke(colors[i], 0.8)),
        )),
    );

    
    yield* waitFor(3);
    yield* sequence(0.1,
        ...sections.map((t, i) => t.position([0, 0], 0.8)),
    );

    yield* waitUntil("color_components");
    yield* glyph_e().x(-400, 0.8);
    yield* waitFor(2);
    const color_callouts = createRefArray<Layout>();
    const color_magenta = createRefArray<Txt>();
    const color_cyan = createRefArray<Txt>();
    const color_yellow = createRefArray<Txt>();
    const color_text_vals = [
        "Magenta", "->", "Red", "+", "Blue",
        "Cyan", "->", "Blue", "+", "Green",
        "Yellow", "->", "Green", "+", "Red",
    ]
    view.add(<>
        <Layout
            ref={color_callouts}
            layout direction={"column"}
            rowGap={100} height={500}
            x={300} y={150}
        >
            <Layout layout direction={"row"} columnGap={50}>
                <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={color_magenta}
                    text={""}
                    fill={"magenta"}
                    fontSize={60}
                />
                <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={color_magenta}
                    text={""}
                    fill={palette.text}
                    fontSize={60}
                />
                <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={color_magenta}
                    text={""}
                    fill={palette.pastel_red}
                    fontSize={60}
                />
                <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={color_magenta}
                    text={""}
                    fill={palette.text}
                    fontSize={60}
                />
                <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={color_magenta}
                    text={""}
                    fill={palette.pastel_blue}
                    fontSize={60}
                />
            </Layout>
            
            <Layout layout direction={"row"} columnGap={50}>
                <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={color_cyan}
                    text={""}
                    fill={"cyan"}
                    fontSize={60}
                />
                <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={color_cyan}
                    text={""}
                    fill={palette.text}
                    fontSize={60}
                />
                <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={color_cyan}
                    text={""}
                    fill={palette.pastel_blue}
                    fontSize={60}
                />
                <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={color_cyan}
                    text={""}
                    fill={palette.text}
                    fontSize={60}
                />
                <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={color_cyan}
                    text={""}
                    fill={palette.pastel_green}
                    fontSize={60}
                />
            </Layout>
            
            <Layout layout direction={"row"} columnGap={50}>
                <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={color_yellow}
                    text={""}
                    fill={"yellow"}
                    fontSize={60}
                />
                <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={color_yellow}
                    text={""}
                    fill={palette.text}
                    fontSize={60}
                />
                <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={color_yellow}
                    text={""}
                    fill={palette.pastel_green}
                    fontSize={60}
                />
                <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={color_yellow}
                    text={""}
                    fill={palette.text}
                    fontSize={60}
                />
                <Txt
                    fontFamily={"Jetbrains Mono"}
                    ref={color_yellow}
                    text={""}
                    fill={palette.pastel_red}
                    fontSize={60}
                />
            </Layout>

        </Layout>
    </>);
    yield* sequence(0.05,
        ...color_magenta.map((t, i) => t.text(color_text_vals[i], 0.8)),
        ...color_cyan.map((t, i) => t.text(color_text_vals[i+5], 0.8)),
        ...color_yellow.map((t, i) => t.text(color_text_vals[i+10], 0.8)),
    );

    yield* waitUntil("decomp");
    yield* color_callouts().x(1800, 1.2);
    const segment_offsets = [
        [1, 2],
        [1, 2],
        [0, 1],
        [0, 2],
        [0, 1],
        [0, 1],
    ];
    const segment_off_colors = [ palette.pastel_red, palette.pastel_green, palette.pastel_blue, ]
    const glyph_clone = glyph_e().clone();
    view.add(glyph_clone);
    yield* sequence(0.05,
        ...glyph_e().childrenAs<Node>().map((t, i) => all(
            ...t.children().map(c => all(
                c.position([segment_offsets[i][0] * 450, 0], 0.8),
                // @ts-expect-error
                c.stroke(segment_off_colors[segment_offsets[i][0]], 0.8),
            )),
        )),
        ...glyph_clone.childrenAs<Node>().map((t, i) => all(
            ...t.children().map(c => all(
                c.position([segment_offsets[i][1] * 450, 0], 0.8),
                // @ts-expect-error
                c.stroke(segment_off_colors[segment_offsets[i][1]], 0.8),
            )),
        )),
    );

    yield* waitUntil("show_component_sdfs");
    const component_sdf_parent = createRef<Node>();
    const component_sdf_red = createRef<Rect>();
    const component_sdf_green = createRef<Rect>();
    const component_sdf_blue = createRef<Rect>();
    const sdf_red_pixels = createRefArray<Rect>();
    const sdf_green_pixels = createRefArray<Rect>();
    const sdf_blue_pixels = createRefArray<Rect>();
    view.add(<>
        <Node ref={component_sdf_parent}>
            <Rect ref={component_sdf_red} x={-440} y={85} width={400} height={400}>
                {...range(16*16).map(i => <Rect
                    ref={sdf_red_pixels}
                    x={-201 + (i % 16) * (25+0.5) + (25 / 2)}
                    y={-201 + (Math.floor(i / 16)) * (25+0.5) + (25 / 2)}
                    size={[0, 0]} zIndex={0}
                    fill={{
                        r: msdf_16[i * 3 + 2],
                        g: 0,
                        b: 0,
                        a: 1,
                    }} radius={2}
                />)}
            </Rect>
            <Rect ref={component_sdf_green}  x={30} y={85} width={400} height={400}>
                {...range(16*16).map(i => <Rect
                    ref={sdf_green_pixels}
                    x={-201 + (i % 16) * (25+0.5) + (25 / 2)}
                    y={-201 + (Math.floor(i / 16)) * (25+0.5) + (25 / 2)}
                    size={[0, 0]} zIndex={0}
                    fill={{
                        r: 0,
                        g: msdf_16[i * 3 + 1],
                        b: 0,
                        a: 1,
                    }} radius={2}
                />)}
            </Rect>
            <Rect ref={component_sdf_blue}  x={470} y={85} width={400} height={400}>
                {...range(16*16).map(i => <Rect
                    ref={sdf_blue_pixels}
                    x={-201 + (i % 16) * (25+0.5) + (25 / 2)}
                    y={-201 + (Math.floor(i / 16)) * (25+0.5) + (25 / 2)}
                    size={[0, 0]} zIndex={0}
                    fill={{
                        r: 0,
                        g: 0,
                        b: msdf_16[i * 3 + 0],
                        a: 1,
                    }} radius={2}
                />)}
            </Rect>
        </Node>
    </>);
    yield* sequence(0.01,
        sequence(0.005,
            ...sdf_red_pixels.map(t => t.size([24,24], 0.8)),
        ),
        sequence(0.005,
            ...sdf_green_pixels.map(t => t.size([24,24], 0.8)),
        ),
        sequence(0.005,
            ...sdf_blue_pixels.map(t => t.size([24,24], 0.8)),
        ),
    );
    yield* all(glyph_e().opacity(0, 0.5), glyph_clone.opacity(0, 0.5));
    yield* waitFor(0.5);
    yield* sequence(0.1,
        all(
            component_sdf_red().x(0, 0.8),
            component_sdf_green().x(0, 0.8),
            component_sdf_blue().x(0, 0.8),
        ),
        all(
            component_sdf_red().opacity(0, 0.8),
            component_sdf_green().opacity(0, 0.8),
            ...range(16).map(i => sequence(0.01,
                ...sdf_blue_pixels.slice(i*16, (i+1)*16).map((t,j) => 
                    t.fill(new Color({
                        r: (msdf_16[(i * 16 + j) * 3 + 2]),
                        g: (msdf_16[(i * 16 + j) * 3 + 1]),
                        b: (msdf_16[(i * 16 + j) * 3 + 0]),
                        a: 1
                    }), 0.5)
                )
            ))
        )
    );
    component_sdf_green().remove();
    component_sdf_red().remove();
    yield* all(
        multi_sdf_font_subtitle().text("", 0.4),
        component_sdf_blue().scale(1.6, 0.8),
        component_sdf_blue().y(40, 0.8),
    )

    yield* waitUntil("inside_outside");
    const any_two = (a: number, b: number, c: number, cond: (x:number) => boolean): boolean => {
        return (cond(a) && cond(b)) || (cond(a) && cond(c)) || (cond(b) && cond(c));
    }
    yield* sequence(0.05,
        ...range(16).map(i => sequence(0.01,
            ...sdf_blue_pixels.slice(i*16, (i+1)*16)
            .filter((t,j) => any_two(
                msdf_16[(i * 16 + j) * 3],
                msdf_16[(i * 16 + j) * 3 + 1],
                msdf_16[(i * 16 + j) * 3 + 2],
                x => x > 90
            ))
            .map((t,j) => 
                flash(t.size, [0,0], 1.2)
            )
        ))
    );

    yield* waitFor(2);
    yield* sequence(0.05,
        ...range(16).map(i => sequence(0.01,
            ...sdf_blue_pixels.slice(i*16, (i+1)*16)
            .filter((t,j) => !any_two(
                msdf_16[(i * 16 + j) * 3],
                msdf_16[(i * 16 + j) * 3 + 1],
                msdf_16[(i * 16 + j) * 3 + 2],
                x => x > 90
            ))
            .map((t,j) => 
                flash(t.size, [0,0], 1.2)
            )
        ))
    );

    yield* waitUntil("drawing_a_glyph");
    yield* all(
        encloser().start(0, 0.8),
        encloser().end(1, 0.8),
    );
    yield* waitFor(2);
    yield* all(
        encloser().y(1200, 1.2),
        component_sdf_blue().y(1200, 1.2),
    )
    

    //=========================================================================
    //=========================================================================
    view.removeChildren();
    
    const framebuffer_title_ref = createRef<Txt>();
    const fbo_encloser = createRef<Line>();
    view.add(<>
        <Line
            ref={fbo_encloser}
            lineWidth={6} x={1800} y={0}
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


    const plotted_fn = createRef<Code>();
    const mapped_area = createRef<Rect>();
    const output_param_encloser = createRef<Line>();
    const param_title = createRef<Txt>();
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
                ref={param_title}
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

    // yield* all(
    //     flash(mapped_area().opacity, 1, 2.2),
    //     sequence(0.05,
    //         ...range(expanded_sdf_dim).map(i => sequence(0.01,
    //             ...fbo_pixels.slice(i*expanded_sdf_dim, (i+1)*expanded_sdf_dim)
    //             .map((t,j) =>
    //                 fbo_pixels[(2*fbo_dim+3) + (i*fbo_dim+j)].fill(new Color({
    //                     r: (c_sdf_bitmap_expanded[(i * expanded_sdf_dim + j) * 3 + 0]),
    //                     g: (c_sdf_bitmap_expanded[(i * expanded_sdf_dim + j) * 3 + 1]),
    //                     b: (c_sdf_bitmap_expanded[(i * expanded_sdf_dim + j) * 3 + 2]),
    //                     a: 1
    //                 }), 0.5),
    //             )
    //         ))
    //     ),
    // );
    param_title().text("Parameters");
    output_param_encloser().start(0);
    output_param_encloser().end(1);
    plotted_fn().code("output = value;");

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
    // yield* all(
    //     sequence(0.05,
    //         ...range(expanded_sdf_dim).map(i => sequence(0.01,
    //             ...range(expanded_sdf_dim).map(j => all(
    //                 fbo_pixels[(2*fbo_dim+3) + (i*fbo_dim+j)].fill(() => (c_sdf_bitmap_expanded[(i * expanded_sdf_dim + j) * 3 + 0])/255 >= threshold() ? palette.accent : "#000000", 0.5),
    //             ))
    //         ))
    //     ),
    // );
    plotted_fn().code("output = (value > threshold)"),
    threshold_title().text(() => "Threshold = " + threshold().toFixed(3)),
    threshold(0.18),
    threshold_title().fill(palette.secondary),
    threshold_title().fontSize(40),

    smoothness_title().text(() => "Smoothness = " + smoothness().toFixed(3)),
    plotted_fn().code("output = smoothstep(\n  threshold - smoothness,\n  threshold + smoothness,\n  value\n)"),
    smoothness(0.18),
    smoothness_title().fill(palette.secondary),
    smoothness_title().fontSize(40),
    output_param_encloser().y(output_param_encloser().y() - 1700);
    yield* all(
        output_param_encloser().y(output_param_encloser().y() + 1700, 1.2),
        fbo_encloser().x(400, 1.2),
    )
    yield* all(
        sequence(0.05,
            ...range(18).map(i => sequence(0.01,
                ...range(18).map(j => all(
                    fbo_pixels[(2*fbo_dim+3) + (i*fbo_dim+j)].fill(
                        () => new Color({
                            r: lerp(0, 240, smoothstep(0, threshold()-smoothness(), threshold()+smoothness())),
                            g: lerp(0, 61, smoothstep(0, threshold()-smoothness(), threshold()+smoothness())),
                            b: lerp(0, 200, smoothstep(0, threshold()-smoothness(), threshold()+smoothness())),
                            a: 1,
                        }
                    ), 0.1),
                    flash(fbo_pixels[(2*fbo_dim+3) + (i*fbo_dim+j)].width, 0, 0.3),
                ))
            ))
        ),
    );
    yield* waitFor(1.5);
    yield* plotted_fn().selection(lines(3), 0.8);

    yield* waitUntil("median_op");
    yield* plotted_fn().selection(DEFAULT, 0.3);
    yield* plotted_fn().code.edit(1.2)`\
output = smoothstep(
  threshold - smoothness,
  threshold + smoothness,
  ${replace("value", `median(value.r, value.g,
    value.b)`)}
)`;
    const median = (r: number, g: number, b: number): number => {
        return Math.max(Math.min(r, g), Math.min(Math.max(r, g), b));
    }

    yield* waitFor(2);
    yield* all(
        sequence(0.05,
            ...range(18).map(i => sequence(0.01,
                ...range(18).map(j => all(
                    fbo_pixels[(2*fbo_dim+3) + (i*fbo_dim+j)].fill(
                        () => new Color({
                            r: lerp(0, 240, smoothstep(median(msdf_18[(i * 18 + j) * 3 + 2]/255, msdf_18[(i * 18 + j) * 3 + 1]/255, msdf_18[(i * 18 + j) * 3 + 0]/255), threshold()-smoothness(), threshold()+smoothness())),
                            g: lerp(0, 61, smoothstep(median(msdf_18[(i * 18 + j) * 3 + 2]/255, msdf_18[(i * 18 + j) * 3 + 1]/255, msdf_18[(i * 18 + j) * 3 + 0]/255), threshold()-smoothness(), threshold()+smoothness())),
                            b: lerp(0, 200, smoothstep(median(msdf_18[(i * 18 + j) * 3 + 2]/255, msdf_18[(i * 18 + j) * 3 + 1]/255, msdf_18[(i * 18 + j) * 3 + 0]/255), threshold()-smoothness(), threshold()+smoothness())),
                            a: 1,
                        }
                    ), 0.1),
                    flash(fbo_pixels[(2*fbo_dim+3) + (i*fbo_dim+j)].width, 0, 0.3),
                ))
            ))
        ),
    );

    yield* waitUntil("original");
    yield* all(
        output_param_encloser().y(-1800, 1.2),
        fbo_encloser().y(-1800, 1.2),
    );
    
    // ========================================================================
    // ========================================================================
    view.removeChildren();
    const masters = createRef<Video>();
    view.add(<>
        <Video
            ref={masters}
            src={original_thesis_vid}
            x={0} y={-1500}
            scale={0.5} padding={20}
            lineWidth={20} stroke={palette.primary}
            radius={5} opacity={0}
            {...primary_glow_props}
        />
    </>);
    masters().play();
    yield* sequence(0.1,
        masters().y(0, 0.8),
        masters().scale(0.8, 0.8),
        masters().opacity(1, 0.8),
    );

    yield* waitUntil("segue_to_main_scene");
    yield* sequence(0.1,
        masters().opacity(0, 0.8),
        masters().scale(0.5, 0.8),
        masters().y(1500, 0.8),
    );

    // ===============================
    // MAIN SCENE
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
    ]);
    const sdf_encloser = createRef<Line>();
    center_pack().add(<>
        <Line
            ref={sdf_encloser}
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
            ]} scale={0.45}
            position={[-550, 300]}
            closed zIndex={-5}
            fill={palette.foreground}
            {...primary_glow_props}
        />
    </>);
    sdf_encloser().add(<Txt
        fontFamily={"Jetbrains Mono"}
        text={"SDF Fonts"}
        fill={palette.text}
        x={0} y={0}
        fontSize={120}
    />);
    const sdf_pixels = createRefArray<Rect>();
    const sdf_padding = 75;
    const sdf_width = ((425 - sdf_padding) * 2);
    const sdf_pix_start = (-425 + sdf_padding);
    const sdf_dim = 12;
    const pixel_size = sdf_width / sdf_dim;
    sdf_encloser().add(<>
        {...range(sdf_dim * sdf_dim).map(i => <Rect
            ref={sdf_pixels}
            x={sdf_pix_start + (i % sdf_dim) * (pixel_size+0.5) + (pixel_size / 2)}
            y={-310 + (Math.floor(i / sdf_dim)) * (pixel_size+0.5) + (pixel_size / 2)}
            size={[0,0]} zIndex={0}
            fill={"#000000"} radius={2}
        />)}
    </>);
    yield* all(
        ...range(sdf_dim).map(i => all(
            ...sdf_pixels.slice(i*sdf_dim, (i+1)*sdf_dim).map(t => t.size([pixel_size, pixel_size], 0))
        ))
    );
    yield* all(
        ...range(sdf_dim).map(i => all(
            ...sdf_pixels.slice(i*sdf_dim, (i+1)*sdf_dim).map((t,j) => 
                t.fill(new Color({
                    r: (c_sdf_bitmap[(i * sdf_dim + j) * 3 + 0]),
                    g: (c_sdf_bitmap[(i * sdf_dim + j) * 3 + 1]),
                    b: (c_sdf_bitmap[(i * sdf_dim + j) * 3 + 2]),
                    a: 1
                }), 0)
            )
        ))
    );
    yield* all(
        sdf_encloser().lineWidth(10, 0),
        sdf_encloser().points([
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
        ], 0),
        sdf_encloser().childAs<Txt>(0).text("SDF", 0),
        sdf_encloser().childAs<Txt>(0).y(-360, 0),
    );
    yield* sdf_encloser().childAs<Txt>(0).fontSize(90, 0);
    view.add(encloser());
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
    ])
    encloser().childAs<Txt>(0).fontSize(90);
    view.add(component_sdf_blue());
    encloser().position([550, 700]);
    component_sdf_blue().position([550, 720]);
    encloser().scale(0.47);
    component_sdf_blue().scale(0.75);
    yield* all(
        center_pack().position([0, 0], 1.5),
        encloser().childAs<Txt>(0).text("MSDF", 1.2),
        encloser().position([550, 300], 1.5),
        component_sdf_blue().position([550, 320], 1.5),
    );

    
    
    yield* waitUntil("end");
});