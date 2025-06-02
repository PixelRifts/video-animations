import {makeProject} from '@motion-canvas/core';

import example from './scenes/opt_example?scene';

import audio from './test.mp3';

import "./style.css"

export default makeProject({
  scenes: [example],
  audio: audio,
});
