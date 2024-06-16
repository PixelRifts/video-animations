import { CameraView } from "@ksassnowski/motion-canvas-camera";
import { CODE, Code, LezerHighlighter, Txt, makeScene2D } from "@motion-canvas/2d";
import { Color, all, createRef, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { NeonCode, NeonIcon, NeonLine, NeonRect, NeonText, NeonVideo } from "../neon/neon_items";
import { flicker_in, flicker_out } from "../animations/io";

import ndsromformatvid from "../extern/ndsromformat.mp4";
import romformatlookingvid from "../extern/romformatlooking.mp4";
import { parser } from '@lezer/cpp';

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeScene2D(function* (_view) {
    const view = createRef<CameraView>();
    _view.add(<CameraView ref={view} width={"100%"} height={"100%"}/>);

    const backend_title = createRef<NeonText>();
    const dotnds = createRef<NeonText>();
    const dotndsshow = createRef<NeonVideo>();
    const ds_icon = createRef<NeonIcon>(); // simple-icons:nintendo3ds
    const emu_icon = createRef<NeonIcon>(); // arcticons:card-emulator-pro
    view().add(<>
        <NeonText
            ref={backend_title}
            size={128}
            glow={new Color("#388")}
            alpha={0} text_alpha={0}
            txt={"Compiler Backend"}
        />
        <NeonText
            ref={dotnds}
            size={100}
            glow={new Color("#383")}
            x={-650} y={-200}
            alpha={0} text_alpha={0}
            txt={".nds"} rotation={-15}
        />
        <NeonVideo
            ref={dotndsshow}
            video_source={ndsromformatvid}
            alpha={0} video_alpha={0}
            x={-150} y={50} intensity={0.5}
            width={900} height={500}zIndex={-1}
        />
        <NeonIcon
            ref={ds_icon}
            icon={"simple-icons:nintendo3ds"}
            x={700} y={-150} size={150}
            alpha={0} icon_alpha={0} rotation={10}
            glow={new Color("#383")}
        />
        <NeonIcon
            ref={emu_icon}
            icon={"arcticons:card-emulator-pro"}
            x={650} y={50} size={200}
            rotation={-15}
            alpha={0} icon_alpha={0}
            glow={new Color("#383")}
        />
    </>);
    yield* waitFor(2);
    yield* backend_title().flicker_in(1);
    yield* waitFor(2);
    yield* sequence(0.1,
        backend_title().size(100, 0.5),
        backend_title().y(-400, 0.5),
    );
    
    yield* waitUntil("dotndsformat");
    yield* dotnds().flicker_in(1);
    dotndsshow().seek_and_play(0);
    yield* all(dotndsshow().alpha(1, 0.5), dotndsshow().video_alpha(1, 0.5));
    yield* waitUntil("nds_emu_icons");
    yield* sequence(0.5, emu_icon().flicker_in(1), ds_icon().flicker_in(1));
    
    yield* waitUntil("takingalook");
    yield* sequence(0.1,
        dotnds().flicker_out(1),
        all(dotndsshow().alpha(0, 0.5), dotndsshow().video_alpha(0, 0.5)),
        emu_icon().flicker_out(1),
        ds_icon().flicker_out(1)
    );
    yield* dotndsshow().video_source(romformatlookingvid,0);
    yield* dotndsshow().x(0,0); yield* dotndsshow().y(100,0);
    yield* dotndsshow().width(1200,0); yield* dotndsshow().height(700,0);
    dotndsshow().seek_and_play(0);
    yield* all(dotndsshow().alpha(1, 0.5), dotndsshow().video_alpha(1, 0.5));

    yield* waitUntil("finishedlooking");
    yield* all(dotndsshow().alpha(0, 0.5), dotndsshow().video_alpha(0, 0.5));
    const chip1 = createRef<NeonIcon>();
    const chip1lbl = createRef<NeonText>();
    const chip2 = createRef<NeonIcon>();
    const chip2lbl = createRef<NeonText>();

    const start_code = createRef<NeonText>();
    const asm_code = createRef<NeonText>();
    const nds_file = createRef<NeonText>();

    const frontend_title = createRef<NeonText>();
    const frontend_box = createRef<NeonRect>();
    const right_dash_1 = createRef<NeonLine>();
    const right_arrow_1 = createRef<NeonLine>();

    const assembler_title = createRef<NeonText>();
    const assembler_box = createRef<NeonRect>();
    const right_dash_2 = createRef<NeonLine>();
    const right_arrow_2 = createRef<NeonLine>();

    const arm7_code = createRef<NeonCode>();
    const arm9_code = createRef<NeonCode>();
    view().add(<>
        <NeonIcon
            ref={chip1}
            icon={"charm:chip"}
            x={-200} y={-100} size={200}
            alpha={0} icon_alpha={0}
        />
        <NeonText
            ref={chip1lbl}
            txt={"ARM9"}
            x={-200} y={100} size={100}
            alpha={0} text_alpha={0}
        />
        <NeonIcon
            ref={chip2}
            icon={"charm:chip"}
            x={200} y={-100} size={200}
            alpha={0} icon_alpha={0}
        />
        <NeonText
            ref={chip2lbl}
            txt={"ARM7"}
            x={200} y={100} size={100}
            alpha={0} text_alpha={0}
        />
        <>
            <NeonText
                ref={frontend_title}
                size={48} x={-350} y={300}
                glow={new Color("#388")}
                alpha={0} text_alpha={0}
                txt={"Compiler"}
            />
            <NeonRect
                ref={frontend_box}
                x={()=>frontend_title().x()} y={()=>frontend_title().y()}
                width={()=>frontend_title().width()+50}
                height={()=>frontend_title().height()+40}
                glow={new Color("#388")} alpha={0} border={10}
                zIndex={-1}
            />
            <NeonLine
                ref={right_dash_1}
                x={()=>frontend_title().x()} y={()=>frontend_title().y()}
                points={[
                    frontend_box().rect_ref().left(),
                    frontend_box().rect_ref().left().addX(-75),
                ]}
                glow={new Color("#388")} alpha={0} border={20}
                zIndex={-2}
            />
            <NeonLine
                ref={right_arrow_1}
                x={()=>frontend_title().x()} y={()=>frontend_title().y()}
                points={[
                    frontend_box().rect_ref().right(),
                    frontend_box().rect_ref().right().addX(75),
                ]}
                glow={new Color("#388")} alpha={0} border={20}
                endArrow
                zIndex={-2}
            />
        </>
        <>
            <NeonText
                ref={assembler_title}
                size={48} x={350} y={300}
                glow={new Color("#388")}
                alpha={0} text_alpha={0}
                txt={"Assembler"}
            />
            <NeonRect
                ref={assembler_box}
                x={()=>assembler_title().x()} y={()=>assembler_title().y()}
                width={()=>assembler_title().width()+50}
                height={()=>assembler_title().height()+40}
                glow={new Color("#388")} alpha={0} border={10}
                zIndex={-1}
            />
            <NeonLine
                ref={right_dash_2}
                x={()=>assembler_title().x()} y={()=>assembler_title().y()}
                points={[
                    assembler_box().rect_ref().left(),
                    assembler_box().rect_ref().left().addX(-75),
                ]}
                glow={new Color("#388")} alpha={0} border={20}
                zIndex={-2}
            />
            <NeonLine
                ref={right_arrow_2}
                x={()=>assembler_title().x()} y={()=>assembler_title().y()}
                points={[
                    assembler_box().rect_ref().right(),
                    assembler_box().rect_ref().right().addX(75),
                ]}
                glow={new Color("#388")} alpha={0} border={20}
                endArrow
                zIndex={-2}
            />
        </>
        <NeonText
            ref={start_code}
            x={-750} y={300} size={80}
            glow={new Color("#388")}
            txt={".comp"} alpha={0} text_alpha={0}
        />
        <NeonText
            ref={asm_code}
            x={0} y={300} size={80}
            glow={new Color("#388")}
            txt={".asm"} alpha={0} text_alpha={0}
        />
        <NeonText
            ref={nds_file}
            x={750} y={300} size={80}
            glow={new Color("#388")}
            txt={".bin"} alpha={0} text_alpha={0}
        />
        <Code
            ref={arm9_code}
            code={CODE`\
Arm9_Start:
  ; The Compiled Code`}
            x={-400} y={250} opacity={0}
        />
        <Code
            ref={arm7_code}
            code={CODE`\
Arm7_Start:
  b Arm7_Start`}
            x={300} y={250} opacity={0}
        />
    </>);

    yield* waitUntil("twochips");
    yield* sequence(0.1,
        chip1().flicker_in(1),
        chip1lbl().flicker_in(1),
        chip2().flicker_in(1),
        chip2lbl().flicker_in(1),
    );
    yield* waitFor(3);
    
    yield* waitFor(6);
    yield* start_code().flicker_in(1);
    yield* sequence(0.1,
        frontend_title().flicker_in(1),
        frontend_box().flicker_in(1),
        right_dash_1().flicker_in(1),
        right_arrow_1().flicker_in(1),
    );
    yield* asm_code().flicker_in(1);
    
    yield* waitFor(2);
    yield* sequence(0.1,
        assembler_title().flicker_in(1),
        assembler_box().flicker_in(1),
        right_dash_2().flicker_in(1),
        right_arrow_2().flicker_in(1),
    );
    yield* waitFor(2);
    yield* nds_file().flicker_in(1);
    yield* waitFor(1);
    yield* nds_file().txt(".nds", 0.5);

    yield* waitUntil("unshow_pipeline");
    yield* sequence(0.1,
        frontend_title().flicker_out(1),
        frontend_box().flicker_out(1),
        right_dash_1().flicker_out(1),
        right_arrow_1().flicker_out(1),

        assembler_title().flicker_out(1),
        assembler_box().flicker_out(1),
        right_dash_2().flicker_out(1),
        right_arrow_2().flicker_out(1),

        asm_code().flicker_out(1),
        nds_file().flicker_out(1),
        start_code().flicker_out(1),
    );
    frontend_title().remove();
    frontend_box().remove();
    right_dash_1().remove();
    right_arrow_1().remove();
    assembler_title().remove();
    assembler_box().remove();
    right_dash_2().remove();
    right_arrow_2().remove();
    asm_code().remove();
    nds_file().remove();
    start_code().remove();
    
    yield* flicker_in(arm9_code(), 1);
    yield* flicker_in(arm7_code(), 1);
    
    yield* waitUntil("end");
    yield* sequence(0.1,
        flicker_out(arm7_code(), 1),
        flicker_out(arm9_code(), 1),
        backend_title().flicker_out(1),
        chip1().flicker_out(1),
        chip1lbl().flicker_out(1),
        chip2().flicker_out(1),
        chip2lbl().flicker_out(1),
    );
});