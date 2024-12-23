import {makeProject} from '@motion-canvas/core';

import example from './scenes/example?scene';
import playground from './scenes/playground?scene';

import part1 from './extern/TR - Intro.mp4';
import part2 from './extern/TR - Bitmap Fonts.mp4';
import part3 from './extern/TR - Drawing Curves.mp4';
import part4 from './extern/TR - SDF.mp4';
import part5 from './extern/TR - MSDF Mk2.mp4';
import part6 from './extern/TR - Representation.mp4';
import part7 from './extern/TR - Shaping Intro.mp4';
import part8 from './extern/TR - Shaping Operations.mp4';
import part9 from './extern/TR - OutroSub.mp4';

import scene1 from './scenes/intro?scene';
import scene2 from './scenes/bitmaps?scene';
import scene3 from './scenes/curves?scene';
import scene4 from './scenes/sdfs?scene';
import scene5 from './scenes/msdfs?scene';
import scene6 from './scenes/str_rep?scene';
import scene7 from './scenes/shaping_intro?scene';
import scene8 from './scenes/shaping_ops?scene';
import scene9 from './scenes/outro_sub?scene';

import "./style.css"

export default makeProject({
  scenes: [scene9],
  audio: part9,
  experimentalFeatures: true,
});
