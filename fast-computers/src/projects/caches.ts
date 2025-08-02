import {makeProject} from '@motion-canvas/core';

import "./style.css"

import control_hazards_and_caches_audio from "../audio/CM1 - 08 - Control Hazards & Caches.mp4";

import caches_5 from "../scenes/pipelining/5_caches.tsx?scene";
import segue_6 from "../scenes/pipelining/6_segue_to_parallel.tsx?scene";

import { Code, LezerHighlighter } from '@motion-canvas/2d';
import { parser } from '@lezer/cpp';

Code.defaultHighlighter = new LezerHighlighter(
  parser.configure({}),
);

export default makeProject({
  scenes: [caches_5, segue_6],
  audio: control_hazards_and_caches_audio,
});
