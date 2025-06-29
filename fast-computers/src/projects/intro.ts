import {makeProject} from '@motion-canvas/core';

import "./style.css"

import intro_audio from "../audio/CM1 - 01 - Intro.mp4";
import simple_instruction_exec_audio from "./audio/CM1 - 02 - Simple Instruction Exec.mp4";
import clock_and_gprs_audio from "./audio/CM1 - 03 - Clock & GPRs.mp4";
import microcode_audio from "./audio/CM1 - 04 - Microcode.mp4";
import pipelining23_audio from "./audio/CM1 - 05 - Pipelining 2 & 3.mp4";
import pipelining5_audio from "./audio/CM1 - 055 - Pipelining 5.mp4";
import pipeline_data_hazard_audio from "./audio/CM1 - 06 - Pipeline Data Hazard.mp4";
import forwarding_and_branch_prediction_audio from "./audio/CM1 - 07 - Forwarding and Branch Prediction.mp4";
import control_hazards_and_caches_audio from "./audio/CM1 - 08 - Control Hazards & Caches.mp4";
import simd_and_ilp_audio from "./audio/CM1 - 09 - SIMD and ILP.mp4";
import fu_intro_audio from "./audio/CM1 - 10 - FU Intro.mp4";
import scoreboard_and_tomasulo_audio from "./audio/CM1 - 11 - Scoreboard and Tomasulo.mp4";
import the_final_stages_audio from "./audio/CM1 - 12 - The Final Stages.mp4";
import outro_audio from "./audio/CM1 - 13 - Outro.mp4";

import intro_1 from "../scenes/intro/1_intro.tsx?scene";

export default makeProject({
  scenes: [intro_1],
  audio: intro_audio,
});
