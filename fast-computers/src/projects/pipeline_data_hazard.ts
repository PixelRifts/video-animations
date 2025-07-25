import {makeProject} from '@motion-canvas/core';

import "./style.css"

import pipeline_data_hazard_audio from "../audio/CM1 - 06 - Pipeline Data Hazard.mp4";
import forwarding_and_branch_prediction_audio from "../audio/CM1 - 07 - Forwarding and Branch Prediction.mp4";
import control_hazards_and_caches_audio from "../audio/CM1 - 08 - Control Hazards & Caches.mp4";
import simd_and_ilp_audio from "../audio/CM1 - 09 - SIMD and ILP.mp4";
import fu_intro_audio from "../audio/CM1 - 10 - FU Intro.mp4";
import scoreboard_and_tomasulo_audio from "../audio/CM1 - 11 - Scoreboard and Tomasulo.mp4";
import the_final_stages_audio from "../audio/CM1 - 12 - The Final Stages.mp4";
import outro_audio from "../audio/CM1 - 13 - Outro.mp4";


import data_hazards_3 from "../scenes/pipelining/3_data_hazards.tsx?scene";


import { Code, LezerHighlighter } from '@motion-canvas/2d';
import { parser } from '@lezer/cpp';

Code.defaultHighlighter = new LezerHighlighter(
  parser.configure({}),
);

export default makeProject({
  scenes: [data_hazards_3],
  audio: pipeline_data_hazard_audio,
});
