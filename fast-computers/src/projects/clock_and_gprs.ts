import {makeProject} from '@motion-canvas/core';

import "./style.css"

import clock_and_gprs_audio from "../audio/CM1 - 03 - Clock & GPRs.mp4";

import clock_1 from "../scenes/clock_and_gprs/1_clock.tsx?scene";
import gprs_2 from "../scenes/clock_and_gprs/2_gprs.tsx?scene";

export default makeProject({
  scenes: [clock_1, gprs_2],
  audio: clock_and_gprs_audio,
});
