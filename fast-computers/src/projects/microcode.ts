import {makeProject} from '@motion-canvas/core';

import "./style.css"

import microcode_audio from "../audio/CM1 - 04 - Microcode.mp4";

import microcode_1 from "../scenes/microcode/1_microcode.tsx?scene";

import { Code, LezerHighlighter } from '@motion-canvas/2d';
import { parser } from '@lezer/cpp';


Code.defaultHighlighter = new LezerHighlighter(
  parser.configure({}),
);


export default makeProject({
  scenes: [microcode_1],
  audio: microcode_audio,
});
