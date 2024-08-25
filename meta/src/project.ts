import {makeProject} from '@motion-canvas/core';

import intro from './scenes/intro?scene';
import lv1strings from './scenes/lv1strings?scene';
import lv2ast from './scenes/lv2ast?scene';
import lv3asm from './scenes/lv3asm?scene';
import lv4machinecodeintro from './scenes/lv4machinecodeintro?scene';
import lv4translatingpseudo from './scenes/lv4translatingpseudo?scene';
import lv4conventions from './scenes/lv4conventions?scene';
import lv4final from './scenes/lv4final?scene';

import intro_audio from "../Meta - Intro.mp4";
import lv1strings_audio from "../Meta - Level 1 - Strings.mp4";
import lv2ast_audio from "../Meta - Level 2 - AST.mp4";
import lv3asm_audio from "../Meta - Level 3 - Assembly.mp4";
import lv4machinecodeintro_audio from "../Meta - Level 4 - Machine Code Intro.mp4";
import lv4translatingpseudo_audio from "../Meta - Level 4 - Translating pseudocode.mp4";
import lv4conventions_audio from "../Meta - Level 4 - Conventions.mp4";
import lv4final_audio from "../Meta - Level 4 - Final.mp4";

import "./global.css"

export default makeProject({
  scenes: [lv4final],
  audio: lv4final_audio
});
