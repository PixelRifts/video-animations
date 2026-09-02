import {makeProject} from '@motion-canvas/core';
import './style.css';

import scene1 from '../scenes/mk4sp2/touchups?scene';
import audio from '../audio/BC - 08 - Mk4 Fixed.mp3';

import { Code, LezerHighlighter } from '@motion-canvas/2d';
import { parser } from "@lezer/java";

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeProject({
  scenes: [scene1],
  audio: audio
});
