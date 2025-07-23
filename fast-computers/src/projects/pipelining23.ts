import {makeProject} from '@motion-canvas/core';

import "./style.css"

import pipelining23_audio from "../audio/CM1 - 05 - Pipelining 2 & 3.mp4";

import pipelining_1 from "../scenes/pipelining/1_pipelining.tsx?scene";

import { Code, LezerHighlighter } from '@motion-canvas/2d';
import { parser } from '@lezer/cpp';

Code.defaultHighlighter = new LezerHighlighter(
  parser.configure({}),
);

export default makeProject({
  scenes: [pipelining_1],
  audio: pipelining23_audio,
});
