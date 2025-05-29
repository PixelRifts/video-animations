import {Icon, Layout, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {createComputed, createRef, createRefArray, createSignal, easeInOutCirc, range, SimpleSignal, useRandom, Vector2, waitFor} from '@motion-canvas/core';


export default makeScene2D(function* (view) {
  const random = useRandom(20);
  const window = createRef<Rect>();
  const header = createRef<Rect>();
  const header_cross = createRef<Icon>();
  const sound_wave = createRef<Layout>();
  const sound_wave_lines = createRefArray<Rect>();

  const scale = 1.75;
  const header_pct = 0.08;
  const cross_off = 30;
  const sound_wave_off = 20;
  const sound_wave_count = 24;
  const sound_wave_line_width = 18;
  const sound_wave_gap = (575*scale - 2*10 - sound_wave_count*sound_wave_line_width) / (sound_wave_count+1)
  const sound_wave_start = -575*scale*0.5 + 15 + sound_wave_gap;
  const sound_wave_scale = 10;
  
  const sound_wave_heights: number[] = [];
  const sound_wave_height_sigs: SimpleSignal<number>[] = [];
  for (let i = 0; i < sound_wave_count; i++) {
    sound_wave_heights[i] = Math.pow(random.nextFloat(0, 1), 1) * 14 * scale * sound_wave_scale;
    sound_wave_height_sigs[i] = createSignal(sound_wave_heights[i]);
  }
  

  const bin_cover = createRef<Line>();
  const bin_window = createRef<Rect>();
  const bin_header = createRef<Rect>();
  const bin_wave = createRef<Layout>();
  const bin_divider = createRef<Line>();
  const bin_wave_lines = createRefArray<Text>();
  const bin_cover_progress = createSignal(0.5);
  const bin_cover_offset = createSignal(() => -(((bin_cover_progress()*2.0)-1.0) * 600))
  
  const bin_per_line = 11;
  const bin_cover_oblique = 400;

  view.add(<>
    <Rect
      ref={window}
      size={[575*scale-10, 333*scale-10]}
      radius={10}
      lineWidth={10}
      stroke={"white"}
      fill={'#208CD2'}
    >
      <Rect
        ref={header}
        y={(-333*scale + 333*scale*header_pct)*0.5}
        size={[575*scale-10, 333*scale*header_pct-10]}
        radius={5}
        lineWidth={10}
        stroke={"white"}
        fill={"white"}
      />
      <Icon
        ref={header_cross}
        icon={"gridicons:cross"}
        x={(575*scale)*0.5-cross_off} y={(-333*scale + 333*scale*header_pct)*0.5}
        color={"#208CD2"}
        size={333*scale*header_pct}
      />
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
    </Rect>

    <Rect
      size={[575*scale+100, 333*scale+100]}
      radius={10}
      zIndex={4} clip
    >     
      <Line
        ref={bin_divider}
        points={() => [
          new Vector2([-bin_cover_oblique, 333*scale]).normalized.scale(400).addX(-bin_cover_offset()),
          new Vector2([bin_cover_oblique, -333*scale]).normalized.scale(400).addX(-bin_cover_offset())
        ]}
        lineWidth={10}
        stroke={"white"}
        lineCap={"round"}
      />
    </Rect>

    <Line
      ref={bin_cover}
      points={() => [[-800*scale*0.5-10, 333*scale],  [-bin_cover_oblique-bin_cover_offset(), 333*scale],
                     [bin_cover_oblique-bin_cover_offset(), -333*scale], [-800*scale*0.5-10, -333*scale],]}
      closed
      clip
    >
      <Rect
        ref={bin_window}
        size={[575*scale, 333*scale]}
        radius={10}
        fill={'#2E84BE'}
      >
        <Rect
          ref={bin_header}
          y={(-333*scale + 333*scale*header_pct)*0.5}
          size={[575*scale, 333*scale*header_pct]}
          radius={5}
          fill={"92D7FF"}
        />
        <Layout ref={bin_wave} y={sound_wave_off}>
          {...range(sound_wave_count).map(i => {
            return <Layout layout
              x={sound_wave_start + i*(sound_wave_gap+sound_wave_line_width)}
              direction={"column"}
            >
              {...range(bin_per_line).map(t => <Txt
                ref={bin_wave_lines}
                fontFamily={"WDXL Lubrifont TC"}
                text={() => (Math.abs(t-5) * 43 > sound_wave_height_sigs[i]()) ? "0" : "1"} fontSize={38}
                fill={() => (Math.abs(t-5) * 43 > sound_wave_height_sigs[i]()) ? "#94D9FF" : "white"}
              />)}
            </Layout>
          })}
        </Layout>
      </Rect>
    </Line>
  </>);

  yield* waitFor(2);
  yield bin_cover_progress(1, 2).to(0, 2).to(0.5, 1);
  for (let t = 0; t < 4; t++) {
    for (let i = 0; i < sound_wave_count; i++) {
      sound_wave_heights[i] = Math.pow(random.nextFloat(0, 1), 1) * 14 * scale * sound_wave_scale;
      yield sound_wave_height_sigs[i](sound_wave_heights[i], 1.5, easeInOutCirc);
    }
    yield* waitFor(1.2);
  }
  
  yield* waitFor(2);
});
