import {makeProject} from '@motion-canvas/core';

import "./style.css"

import control_hazards_and_caches_audio from "../audio/CM1 - 08 - Control Hazards & Caches.mp4";
import simd_and_ilp_audio from "../audio/CM1 - 09 - SIMD and ILP.mp4";
import fu_intro_audio from "../audio/CM1 - 10 - FU Intro.mp4";
import scoreboard_and_tomasulo_audio from "../audio/CM1 - 11 - Scoreboard and Tomasulo.mp4";
import the_final_stages_audio from "../audio/CM1 - 12 - The Final Stages.mp4";
import outro_audio from "../audio/CM1 - 13 - Outro.mp4";

import caches_5 from "../scenes/pipelining/5_caches.tsx?scene";

import { Code, LezerHighlighter } from '@motion-canvas/2d';
import { parser } from '@lezer/cpp';

Code.defaultHighlighter = new LezerHighlighter(
  parser.configure({}),
);

export default makeProject({
  scenes: [caches_5],
  audio: control_hazards_and_caches_audio,
});
