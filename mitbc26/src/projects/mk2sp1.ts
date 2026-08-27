import {makeProject} from '@motion-canvas/core';
import './style.css';

import scene1 from '../scenes/mk2sp1/mk2?scene';
import audio from '../audio/BC - 05 - Mk2 and Sprint 1 Fixed.mp3';

import { Code, LezerHighlighter } from '@motion-canvas/2d';
import { parser } from "@lezer/java";

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeProject({
  scenes: [scene1],
  audio: audio
});
