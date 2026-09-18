import {makeProject} from '@motion-canvas/core';
import './style.css';

import scene1 from '../scenes/extras2?scene';

import { Code, LezerHighlighter } from '@motion-canvas/2d';
import { parser } from "@lezer/java";

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeProject({
  scenes: [scene1],
});
