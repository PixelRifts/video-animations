import {makeProject} from '@motion-canvas/core';

import "./style.css"

import pipelining5_audio from "../audio/CM1 - 05.5 - Pipelining 5.mp4";

import pipelining_2 from "../scenes/pipelining/2_pipelining_EXT.tsx?scene";

import { Code, LezerHighlighter } from '@motion-canvas/2d';
import { parser } from '@lezer/cpp';

Code.defaultHighlighter = new LezerHighlighter(
  parser.configure({}),
);

export default makeProject({
  scenes: [pipelining_2],
  audio: pipelining5_audio,
});
