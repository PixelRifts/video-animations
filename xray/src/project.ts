import {makeProject} from '@motion-canvas/core';

import example from './scenes/jam_res?scene';

import audio from './WHEEL.mp3';

import "./style.css"

export default makeProject({
  scenes: [example],
  audio: audio,
});
