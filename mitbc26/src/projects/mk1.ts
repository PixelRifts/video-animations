import {makeProject} from '@motion-canvas/core';
import './style.css';

import scene1 from '../scenes/mk1/mk1_comms?scene';
import scene2 from '../scenes/mk1/mk1_strat1?scene';
import scene3 from '../scenes/mk1/mk1_cats?scene';
import audio from '../audio/BC - 04 - Mk1 Fixed.mp3';

import { Code, LezerHighlighter } from '@motion-canvas/2d';
import { parser } from "@lezer/java";

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeProject({
  scenes: [scene1, scene2, scene3],
  audio: audio
});
