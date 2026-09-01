import {makeProject} from '@motion-canvas/core';
import './style.css';

import scene1 from '../scenes/pathfinding/bandaid?scene';
import audio from '../audio/BC - 07 - Pathfinding Fix Fixed.mp3';

import { Code, LezerHighlighter } from '@motion-canvas/2d';
import { parser } from "@lezer/java";

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeProject({
  scenes: [scene1],
  audio: audio
});
