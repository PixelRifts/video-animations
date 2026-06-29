import {makeProject} from '@motion-canvas/core';
import './style.css';

import scene from '../scenes/refbot?scene';
import audio from '../audio/BC - 03 - Reference Bot Fixed.mp3';

import { Code, LezerHighlighter } from '@motion-canvas/2d';
import { parser } from "@lezer/java";

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeProject({
  scenes: [scene],
  audio: audio
});
