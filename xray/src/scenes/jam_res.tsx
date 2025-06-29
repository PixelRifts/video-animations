import { Gradient, Icon, Img, Layout, Line, makeScene2D, Rect, SVG, Txt } from '@motion-canvas/2d';
import { Computed, createComputed, createRef, createRefArray, createSignal, debug, easeInOutCirc, loop, range, SimpleSignal, useRandom, Vector2, waitFor } from '@motion-canvas/core';
import { BinPanel } from './bin_panel';

import values from "./audio_spectrum_old.json";

import xrayjamlogo_bgframe from "./jam_bgframe.png";
import xrayjamlogo_fgframe from "./jam_fgframe.png";
import xrayjamlogo_label   from "./jam_text.png";

export default makeScene2D(function* (view) {
    const window = createRef<Img>();
    const sound_wave = createRef<Layout>();
    const sound_wave_lines = createRefArray<Rect>();
  
    const scale = 1.75;
    const sound_wave_off = 24;
    const sound_wave_count = 24;
    const sound_wave_line_width = 18;
    const sound_wave_gap = ((575*scale - 2*10 - sound_wave_count*sound_wave_line_width) / (sound_wave_count+1))
    const sound_wave_start = -575*scale*0.5 + 20 + sound_wave_gap;
    const sound_wave_scale = 10;
    
    const sound_wave_heights: number[] = [];
    const sound_wave_height_sigs: SimpleSignal<number>[] = [];
    for (let i = 0; i < sound_wave_count; i++) {
      sound_wave_heights[i] = values[0][i] * 15 * scale * sound_wave_scale;
      sound_wave_height_sigs[i] = createSignal(sound_wave_heights[i]);
    }
    
    const bin_cover = createRef<Line>();
    const bin_cover_complement = createRef<Line>();
    const bin_window = createRef<Img>();
    const bin_panel = createRef<BinPanel>();
    const bin_divider = createRef<Line>();
    const bin_cover_progress = createSignal(0.5);
    const bin_cover_offset = createSignal(() => -(((bin_cover_progress()*2.0)-1.0) * 600));
    const bin_cover_oblique = 400;
    const background = createRef<Rect>();

    const label_img = createRef<Img>();

    view.add(
    <Rect
      ref={background}
      size={[965*2, 545*2]}
      fill={new Gradient({
        type: "radial",
        fromRadius: 0,
        toRadius: Math.sqrt((960)**2 + (540)**2),
        stops: [
          { offset: 0, color: "#0F5D8F" },
          { offset: 1, color: "#05121D" }
        ]
      })}
    />)

    background().add(<>
      <Line
        ref={bin_cover_complement}
        points={() => [[800*scale*0.5-10, 350*scale],  [-bin_cover_oblique-bin_cover_offset(), 350*scale],
                       [bin_cover_oblique-bin_cover_offset(), -350*scale], [800*scale*0.5-10, -350*scale],]}
        closed
        clip
      >
        <Img
          ref={window}
          src={xrayjamlogo_fgframe}
          size={[575*scale, 350*scale]}
        >
          <Layout ref={sound_wave} y={sound_wave_off}>
            {...range(sound_wave_count).map(i => {
              return <Line
                ref={sound_wave_lines}
                x={sound_wave_start + i*(sound_wave_gap+sound_wave_line_width)}
                points={() => [[0, sound_wave_height_sigs[i]()], [0, -sound_wave_height_sigs[i]()]]}
                lineWidth={sound_wave_line_width}
                stroke={"white"} lineCap={"round"}
              />
            })}
          </Layout>
        </Img>
      </Line>

      <Rect
        size={[575*scale+300, 350*scale+300]}
        radius={10}
        zIndex={4} clip
      >
        <Img
          ref={label_img}
          y={20}
          size={[575*scale, 450*scale]}
          src={xrayjamlogo_label}
        />

        <Line
          ref={bin_divider}
          points={() => [
            new Vector2([-bin_cover_oblique, 350*scale]).normalized.scale(475).addX(-bin_cover_offset()),
            new Vector2([bin_cover_oblique, -350*scale]).normalized.scale(475).addX(-bin_cover_offset())
          ]}
          start={() => bin_cover_progress() < 0.25 ? ((0.25-bin_cover_progress())*4)*0.55 : 0}
          end={() => bin_cover_progress() > 0.75 ? 1-((bin_cover_progress()-0.75)*4)*0.55 : 1}
          lineWidth={10}
          stroke={"white"}
          lineCap={"round"}
        />
      </Rect>
  
      <Line
        ref={bin_cover}
        points={() => [[-800*scale*0.5-10, 350*scale],  [-bin_cover_oblique-bin_cover_offset(), 350*scale],
                       [bin_cover_oblique-bin_cover_offset(), -350*scale], [-800*scale*0.5-10, -350*scale],]}
        closed
        clip
      >
        <Img
            ref={bin_window}
            src={xrayjamlogo_bgframe}
            size={[575*scale, 350*scale]}
            zIndex={-1}
        >
            <BinPanel
                ref={bin_panel}
                y={4}
                init_heights={values[10]}
                wave_scale={scale}
                sound_wave_scale={sound_wave_scale}
            />
        </Img>
      </Line>
    </>);
  
    
    const wiper = yield loop(Infinity, function* (i) {
      yield* bin_cover_progress(0.5, 4).wait(6)
        .to(0.05, 4).wait(1)
        .to(0.95, 8).wait(1);
    });
    for (let t = 1; t < values.length; t++) {
      for (let i = 0; i < sound_wave_count; i++) {
        sound_wave_heights[i] = values[t][i] * 15 * scale * sound_wave_scale;
        sound_wave_height_sigs[i](sound_wave_heights[i]);
        bin_panel().heights = values[t];
      }
      yield;
    }
  
})