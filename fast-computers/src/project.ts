import {makeProject} from '@motion-canvas/core';

import example from './scenes/example?scene';
import simple_cpu from './scenes/simple_cpu?scene';

import "./style.css"

export default makeProject({
  scenes: [simple_cpu],
});
