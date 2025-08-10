import {makeProject} from '@motion-canvas/core';

import "./style.css"

import scoreboard_and_tomasulo_audio from "../audio/CM1 - 11 - Scoreboard and Tomasulo.mp4";
import the_final_stages_audio from "../audio/CM1 - 12 - The Final Stages.mp4";
import outro_audio from "../audio/CM1 - 13 - Outro.mp4";

import scoreboard_and_tomasulo_1 from "../scenes/parallelism/3_scoreboard_and_tomasulo.tsx?scene";

import { Code, LezerHighlighter } from '@motion-canvas/2d';
import { parser } from '@lezer/cpp';

Code.defaultHighlighter = new LezerHighlighter(
  parser.configure({}),
);

export default makeProject({
  scenes: [scoreboard_and_tomasulo_1],
  audio: scoreboard_and_tomasulo_audio,
});
