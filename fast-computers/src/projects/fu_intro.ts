import {makeProject} from '@motion-canvas/core';

import "./style.css"

import fu_intro_audio from "../audio/CM1 - 10 - FU Intro.mp4";

import fu_intro_1 from "../scenes/parallelism/2_fu_intro.tsx?scene";

import { Code, LezerHighlighter } from '@motion-canvas/2d';
import { parser } from '@lezer/cpp';

Code.defaultHighlighter = new LezerHighlighter(
  parser.configure({}),
);

export default makeProject({
  scenes: [fu_intro_1],
  audio: fu_intro_audio,
});
