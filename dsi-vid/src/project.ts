import {makeProject} from '@motion-canvas/core';

import intro from './scenes/intro?scene';
import parsing_end from './scenes/parsing_end?scene';
import type_checking_intro from './scenes/type_checking_intro?scene';
import type_checking_end from './scenes/type_checking_end?scene';
import backend_start from './scenes/backend_start?scene';
import backend_lowering from './scenes/backend_lowering?scene';
import backend_functions from './scenes/backend_functions?scene';
import outro from './scenes/outro?scene';
import ending_mk1 from './scenes/endingmk1?scene';

import intro_au from '../DSILang - Intro.mp4';
import parsing_end_au from '../DSILang - Parsing End.mp4';
import type_checking_intro_au from '../DSILang - Type Checking Intro.mp4';
import type_checking_end_au from '../DSILang - Type Checking End.mp4';
import backend_start_au from '../DSILang - Backend Start.mp4';
import backend_lowering_au from '../DSILang - Backend Lowering.mp4';
import backend_functions_au from '../DSILang - Backend Functions and Div.mp4';
import outro_au from '../DSILang - Outro.mp4';
import ending_mk1_au from '../DSILang - Endingmk1.mp4';

import './global.css';

export default makeProject({
  scenes: [ending_mk1],
  audio: ending_mk1_au,
  experimentalFeatures: true,
});
