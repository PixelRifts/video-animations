import {makeProject} from '@motion-canvas/core';

import "./style.css"

import intro_audio from "../audio/CM1 - 01 - Intro.mp4";
import intro_1 from "../scenes/intro/1_intro.tsx?scene";

export default makeProject({
  scenes: [intro_1],
  audio: intro_audio,
});
