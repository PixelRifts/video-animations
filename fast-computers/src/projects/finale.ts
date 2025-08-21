
import {makeProject} from '@motion-canvas/core';

import "./style.css"

import finale_audio from "../audio/CM1 - 12 - TrimmedOutro.mp3";

import final_1 from "../scenes/outro/1_finale.tsx?scene";

import { Code, LezerHighlighter } from '@motion-canvas/2d';
import { parser } from '@lezer/cpp';

Code.defaultHighlighter = new LezerHighlighter(
  parser.configure({}),
);

export default makeProject({
  scenes: [final_1],
  audio: finale_audio,
});
