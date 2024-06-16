import { CameraView } from "@ksassnowski/motion-canvas-camera";
import { CODE, Circle, Code, LezerHighlighter, Node, Rect, makeScene2D, replace } from "@motion-canvas/2d";
import { Color, all, createRef, makeRef, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { NeonCode, NeonIcon, NeonLine, NeonRect, NeonText, NeonVideo } from "../neon/neon_items";
import { append_to_str, shiftx, shiftx_all, shifty } from "../animations/misc";

import bluescreenvid from "../extern/bluescreen.mp4";
import yoinkvid from "../extern/yoink.mp4";
import hellofailvid from "../extern/hellofail.mp4";


import { parser } from '@lezer/cpp';
import { fadeOutUp, flicker_in } from "../animations/io";
import { softblue } from "../utils/colors";

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeScene2D(function* (_view) {
    const view = createRef<CameraView>();
    _view.add(<CameraView ref={view} width={"100%"} height={"100%"} />);

    yield* waitUntil("hai");
    const ds_icon = createRef<NeonIcon>();
    const writes: NeonText[] = [];
    const write_strs = [
        "write 0x4000304, cast(u32) 0x8003",
        "write 0x4000000, cast(u32) 0x20000",
        "write 0x4000240, cast(u8)  0x80",
    ];
    const vram_addresses = createRef<NeonText>();
    const boxes: NeonRect[] = [];
    const emptybox  = createRef<NeonRect>();
    const colors = [ "#238", "#382", "#823" ]
    view().add(<>
        <NeonIcon
            ref={ds_icon}
            icon={"simple-icons:nintendo3ds"}
            x={-500} y={-150} size={450}
            alpha={0} icon_alpha={0} rotation={10}
            glow={new Color("#383")}
        />
        {...write_strs.map((s, i) => <NeonText
            ref={makeRef(writes, i)}
            txt={s} x={300} y={-200+80*i}
            size={55}
            alpha={0} text_alpha={0}
        />)}
        <NeonText
            ref={vram_addresses}
            txt={""} x={0} y={400}
            size={75}
        />
        {...range(15).map(i => <NeonRect
            ref={makeRef(boxes, i)}
            x={-220+(i%5)*110} y={-100+(Math.floor(i/5))*110}
            width={75} height={75} border={7}
            glow={colors[Math.floor(i/5)]}
            alpha={0}
        />)}
        <NeonRect
            ref={emptybox}
            x={-800} y={0}
            width={75} height={75} border={7}
            glow={"#FFF"}
            alpha={0}
        />
    </>)
    yield* ds_icon().flicker_in(1);
    yield* waitFor(2);
    yield* sequence(0.1, ...writes.map(t=>t.flicker_in(1)));
    yield* waitFor(4);
    yield* all(
        shiftx(ds_icon(), -800, 0.5),
        shiftx_all(1200, 0.5, ...writes),
        append_to_str(vram_addresses(), "0x6800000 and up", 0.5)
    );
    yield* waitFor(2);
    yield* all(
        vram_addresses().y(-450, 0.8), vram_addresses().size(85, 0.8),
        append_to_str(vram_addresses(), " - Framebuffer", 0.5)
    );
    ds_icon().remove();
    writes.map(t=>t.remove());

    yield* waitUntil("boxes");
    yield* sequence(0.1, ...boxes.map(t=>t.flicker_in(1)));
    yield* waitFor(2);
    const addone = (i: number) => Math.floor((i+1)/8);
    yield* sequence(0.05,
        ...boxes.map((t,i) => t.position([-700 + (i+addone(i))*100, 0], 0.5)),
    );
    yield* waitFor(1);
    yield* emptybox().flicker_in(1);
    
    yield* waitUntil("fillscreen");
    yield* all(
        sequence(0.01, shifty(emptybox(), 700, 0.5), ...boxes.map(t=>shifty(t, 700, 0.5))),
    );
    emptybox().remove();
    boxes.map(t=>t.remove());
    const fill_code = createRef<NeonCode>();
    view().add(<>
        <NeonCode
            ref={fill_code}
            y={100}
            code={CODE`\
fill_screen :: func() {
  ptr := cast(^TTT) 0x6800000;
  ctr := XXX;
  while ctr {
    ptr^ = YYY;

    ptr = ptr + cast(^TTT) CCC;
    ctr = ctr - 1;
  }
}`}
            alpha={0}
        />
    </>);
    yield* fill_code().flicker_in(1);
    yield* waitFor(3);
    yield* fill_code().code.edit(0.5)`\
fill_screen :: func() {
  ptr := cast(^TTT) 0x6800000;
  ctr := ${replace("XXX", "256*192")};
  while ctr {
    ptr^ = YYY;

    ptr = ptr + cast(^TTT) CCC;
    ctr = ctr - 1;
  }
}`;

    yield* waitFor(2);
    yield* fill_code().code.edit(0.5)`\
fill_screen :: func() {
  ptr := cast(^${replace("TTT", "u16")}) 0x6800000;
  ctr := 256*192;
  while ctr {
    ptr^ = YYY;

    ptr = ptr + cast(^${replace("TTT", "u16")}) ${replace("CCC", "2")};
    ctr = ctr - 1;
  }
}`;
    yield* waitFor(2);
    yield* fill_code().code.edit(0.5)`\
fill_screen :: func() {
  ptr := cast(^u16) 0x6800000;
  ctr := 256*192;
  while ctr {
    ptr^ = ${replace("YYY", "cast (u16) 0x7EE0")};

    ptr = ptr + cast(^u16) 2;
    ctr = ctr - 1;
  }
}`;
    yield* waitFor(1);
    yield* shiftx_all(-1800, 0.5, fill_code(), vram_addresses());
    fill_code().remove();
    vram_addresses().remove();
    const currvid = createRef<NeonVideo>();
    view().add(<>
        <NeonVideo
            ref={currvid}
            video_source={bluescreenvid}
            x={0} y={0}
            width={1440} height={830}
            intensity={1.0} alpha={0} video_alpha={0}
            glow={new Color("#283")}
        />
    </>)
    currvid().seek_and_play(0);
    yield* all(currvid().alpha(1, 0.5), currvid().video_alpha(1, 0.5));
    
    yield* waitUntil("switch1");
    yield* all(currvid().video_alpha(0, 0.5), currvid().alpha(0, 0.5));
    yield* waitFor(0.5);
    yield* currvid().video_source(yoinkvid, 0);
    currvid().seek_and_play(0);
    yield* all(currvid().alpha(1, 0.5), currvid().video_alpha(1, 0.5));

    yield* waitUntil("easeofusefont");
    yield* all(currvid().video_alpha(0, 0.5), currvid().alpha(0, 0.5));

    const vlines: NeonLine[] = [];
    const hlines: NeonLine[] = [];
    const pixelvalues: NeonText[] = [];
    const char_h = [0x20,0x60,0x6C,0x76,0x66,0x66,0x24,0x00];
    const char_e = [0x00,0x00,0x3C,0x66,0x7E,0x60,0x3C,0x00];
    const char_l = [0x10,0x18,0x18,0x18,0x18,0x18,0x08,0x00];
    const char_o = [0x00,0x00,0x3C,0x66,0x66,0x66,0x3C,0x00];
    const char_w = [0x00,0x00,0x44,0xD6,0xD6,0xFE,0x6C,0x00];
    const char_r = [0x00,0x00,0x38,0x7C,0x60,0x60,0x20,0x00];
    const char_d = [0x08,0x0C,0x7C,0xCC,0xCC,0xCC,0x78,0x00];
    const char_null = [0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00];
    let roller = 0;
    const pixels: Rect[] = [];
    const rest = [char_e, char_l, char_l, char_o, char_null, char_w, char_o, char_r, char_l, char_d];
    

    view().add(<>
        {...range(64).map(i => <Node>
            <NeonText
                ref={makeRef(pixelvalues, i)}
                x={(-375)+(i%8)*93.75+45} y={-375+(Math.floor(i/8))*93.75+45}
                txt={"0"} text_alpha={0} alpha={0}
            />
        </Node>)}
        {...range(9).map(i => <>
            <NeonLine
                ref={makeRef(vlines, i)}
                points={[[-375+(i)*93.75, -375],
                         [-375+(i)*93.75, 375]]}
                border={5} end={0}
            />
            <NeonLine
                ref={makeRef(hlines, i)}
                points={[[-375,-375+(i)*93.75],
                         [375,-375+(i)*93.75]]}
                border={5} end={0}
            />
        </>)}
        {...range(64).filter(i => ((char_h[Math.floor(i/8)]>>(8-(i%8)))&0x1)==1).map(i => <Rect
            ref={makeRef(pixels, roller++)}
            x={(-375)+(i%8)*93.75+45} y={-375+(Math.floor(i/8))*93.75+45}
            width={93.75} height={93.75}
            fill={softblue} zIndex={-1}
            opacity={0}
        />)}
    </>);
    yield* sequence(0.1,
        ...range(9).map(i => vlines[i].end(1, 0.5)),
        ...range(9).map(i => hlines[i].end(1, 0.5))
    );
    yield* sequence(0.1,
        ...range(8).map(i => sequence(0.05,
            ...range(8).map(j => pixelvalues[i*8+j].flicker_in(1)),
        )),
    );
    yield* waitFor(1);
    yield* sequence(0.1,
        ...range(8).map(i => sequence(0.05,
            ...range(8).map(j => pixelvalues[i*8+j].x(450+j*40, 0.5)),
        )),
    );
    yield* waitFor(2);
    const relevant_dudes = range(64).filter(i => ((char_h[Math.floor(i/8)]>>(8-(i%8)))&0x1)==1);
    yield* sequence(0.1,
        ...range(pixels.length).map(i => all(
            flicker_in(pixels[i]),
            pixelvalues[relevant_dudes[i]].glow("#283", 0.5),
            pixelvalues[relevant_dudes[i]].txt("1", 0.5),
        ))
    );
    yield* waitUntil("zoomin");
    yield* sequence(0.05,
        ...range(9).map(i => vlines[i].end(0, 0.5)),
        ...range(9).map(i => hlines[i].end(0, 0.5)),
        sequence(0.01,
            ...pixelvalues.map(t => t.flicker_out(1)),
        ),
    );
    pixelvalues.map(t=>t.remove());
    range(9).map(i => { vlines[i].remove(); hlines[i].remove() });
    roller = 0;
    const new_char_pixes: Rect[] = [];
    view().add(<>
        {...rest.map((v, x) => <>
            {...range(64).filter(i => ((v[Math.floor(i/8)]>>(8-(i%8)))&0x1)==1).map(i => <Rect
                ref={makeRef(new_char_pixes, roller++)}
                x={(-375)+(i%8)*93.75+45+((x+1)*700)} y={-375+(Math.floor(i/8))*93.75+45}
                width={93.75} height={93.75}
                fill={softblue} zIndex={-1}
                opacity={0}
            />)}
        </>)}
    </>);
    view().clip(false);
    yield* sequence(0.1,
        view().x(-550, 1.35),
        view().zoom(0.15, 1.35),
        
        sequence(0.01, ...new_char_pixes.map(t => flicker_in(t, 1))),
    );
    yield* waitFor(1);
    yield* all(
        ...pixels.map(t => all(shifty(t, -40, 0.5), t.opacity(0, 0.5))),
        ...new_char_pixes.map(t => all(shifty(t, -40, 0.5), t.opacity(0, 0.5))),
    );
    pixels.map(t => t.remove());
    new_char_pixes.map(t => t.remove());
    yield* all(
        view().x(0, 0),
        view().zoom(1, 0),
    );
    yield* currvid().video_source(hellofailvid, 0);
    currvid().seek_and_play(0);
    yield* all(currvid().alpha(1, 0.5), currvid().video_alpha(1, 0.5));
    
    yield* waitUntil("end");
});