import {makeProject} from '@motion-canvas/core';

import "./style.css"

import forwarding_and_branch_prediction_audio from "../audio/CM1 - 07 - Forwarding and Branch Prediction.mp4";

import forwarding_and_bp_4 from "../scenes/pipelining/4_forwarding_and_bp.tsx?scene";

import { Code, LezerHighlighter } from '@motion-canvas/2d';
import { parser } from '@lezer/cpp';

Code.defaultHighlighter = new LezerHighlighter(
  parser.configure({}),
);

export default makeProject({
  scenes: [forwarding_and_bp_4],
  audio: forwarding_and_branch_prediction_audio,
});
