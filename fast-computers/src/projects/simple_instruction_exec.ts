import {makeProject} from '@motion-canvas/core';

import "./style.css"

import simple_instruction_exec_audio from "../audio/CM1 - 02 - Simple Instruction Exec.mp4";

import simple_instruction_exec_1 from "../scenes/simple_instruction_exec/1_computer.tsx?scene";

export default makeProject({
  scenes: [simple_instruction_exec_1],
  audio: simple_instruction_exec_audio,
});
