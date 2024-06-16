import { CODE, Code, Gradient, LezerHighlighter, Node, Path, insert, makeScene2D, remove, replace } from "@motion-canvas/2d";
import { Color, ColorSignal, DEFAULT, Reference, all, chain, createRef, linear, makeRef, range, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { NeonCircle, NeonCode, NeonCubicBezier, NeonLine, NeonRect, NeonText } from "../neon/neon_items";
import { CameraView } from "@ksassnowski/motion-canvas-camera";
import { code_get_token, flash, shiftx } from "../animations/misc";
import { flicker_in, flicker_out } from "../animations/io";
import { notification } from "../animations/items";

import { parser } from '@lezer/cpp';


Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeScene2D(function* (_view) {
    const view = createRef<CameraView>();
    _view.add(<CameraView ref={view} width={"100%"} height={"100%"}/>);

    const node_circles: NeonCircle[] = [];
    const node_labels: NeonText[] = [];
    const edges: NeonCubicBezier[] = [];
    const graph = createRef<Node>();
    const example_code = createRef<NeonCode>();
    view().add(<NeonCode
        ref={example_code}
        code={CODE`\
A :: struct { a: ^A; };

B1 :: struct { b2: ^B2; };
B2 :: struct { b1: B1; };

C1 :: struct { c2: ^C2; };
C2 :: struct { c3: C3; };
C3 :: struct { c1: C1; };`}
        x={-450}
        size={40}
    />);
    const circle_color_signals: ColorSignal<void>[] = [];
    for (let i = 0; i < 6; i++)
        circle_color_signals[i] = Color.createSignal("#585")
    
    view().add(<>
        <Node ref={graph} x={450} y={0}>
            <NeonCircle
                ref={makeRef(node_circles, 0)}
                x={0} y={-200}
                width={100} height={100} border={8}
                glow={circle_color_signals[0]}
            >
                <NeonText
                    ref={makeRef(node_labels, 0)}
                    txt={"A"} size={48} text_alpha={()=>node_circles[0].alpha()}
                    glow={new Color("#595")}
                />
            </NeonCircle>

            <NeonCircle
                ref={makeRef(node_circles, 1)}
                x={-200} y={0}
                width={100} height={100} border={8}
                glow={circle_color_signals[1]}
            >
                <NeonText
                    ref={makeRef(node_labels, 1)}
                    txt={"B1"} size={48} text_alpha={()=>node_circles[1].alpha()}
                    glow={new Color("#595")}
                />
            </NeonCircle>

            <NeonCircle
                ref={makeRef(node_circles, 2)}
                x={-200} y={200}
                width={100} height={100} border={8}
                glow={circle_color_signals[2]}
            >
                <NeonText
                    ref={makeRef(node_labels, 2)}
                    txt={"B2"} size={48} text_alpha={()=>node_circles[2].alpha()}
                    glow={new Color("#595")}
                />
            </NeonCircle>

            <NeonCircle
                ref={makeRef(node_circles, 3)}
                x={200} y={0}
                width={100} height={100} border={8}
                glow={circle_color_signals[3]}
            >
                <NeonText
                    ref={makeRef(node_labels, 3)}
                    txt={"C1"} size={48} text_alpha={()=>node_circles[3].alpha()}
                    glow={new Color("#595")}
                />
            </NeonCircle>

            <NeonCircle
                ref={makeRef(node_circles, 4)}
                x={100} y={200}
                width={100} height={100} border={8}
                glow={circle_color_signals[4]}
            >
                <NeonText
                    ref={makeRef(node_labels, 4)}
                    txt={"C2"} size={48} text_alpha={()=>node_circles[4].alpha()}
                    glow={new Color("#595")}
                />
            </NeonCircle>

            <NeonCircle
                ref={makeRef(node_circles, 5)}
                x={300} y={200}
                width={100} height={100} border={8}
                glow={circle_color_signals[5]}
            >
                <NeonText
                    ref={makeRef(node_labels, 5)}
                    txt={"C3"} size={48} text_alpha={()=>node_circles[5].alpha()}
                    glow={new Color("#595")}
                />
            </NeonCircle>


            <NeonCubicBezier
                ref={makeRef(edges, 0)}
                p0={[-55,-200]} p1={[-150,-350]} p2={[150,-350]} p3={[55,-200]}
                border={10} endArrow line_dash={[10]}
                zIndex={-1}
            />
            <NeonCubicBezier
                ref={makeRef(edges, 1)}
                p0={[-200,55]} p1={[-150,55]} p2={[-150,115]} p3={[-190,145]}
                border={10} endArrow line_dash={[10]}
                zIndex={-1}
            />
            <NeonCubicBezier
                ref={makeRef(edges, 2)}
                p0={[-220,145]} p1={[-250,125]} p2={[-250,95]} p3={[-220,55]}
                border={10} endArrow 
                zIndex={-1}
            />
            <NeonCubicBezier
                ref={makeRef(edges, 3)}
                p0={[160,55]} p1={[140,75]} p2={[120,75]} p3={[110,145]}
                border={10} endArrow line_dash={[10]}
                zIndex={-1}
            />
            <NeonCubicBezier
                ref={makeRef(edges, 4)}
                p0={[290,145]} p1={[280,75]} p2={[260,75]} p3={[240,55]}
                border={10} endArrow 
                zIndex={-1}
            />
            <NeonCubicBezier
                ref={makeRef(edges, 5)}
                p0={[160,215]} p1={[190,245]} p2={[210,245]} p3={[240,215]}
                border={10} endArrow 
                zIndex={-1}
            />
        </Node>
    </>);

    yield* waitUntil("show__" + "checking_algorithm");
    const thetxt = createRef<NeonText>();
    const status_tags: NeonCircle[] = [];
    const colors: ColorSignal<void>[] = [];
    const is_ready_fn = createRef<NeonCode>();
    const transfer_fn = createRef<NeonCode>();

    for (let i = 0; i < 7; i++) colors[i] = Color.createSignal("#823");
    const k_map = [0, 1, 1, 2, 2, 2];
    view().add(<>
        <NeonText
            ref={thetxt}
            size={90}
            glow={new Color("#388")}
            position={[0, -400]}
            alpha={0} text_alpha={0}
            txt={"Checking Algorithm"}
        />
        {...range(6).map(t => <NeonCircle
            ref={makeRef(status_tags, t)}
            x={-800} y={-170 + (t+k_map[t])*48}
            width={10} height={10} border={10}
            glow={() => colors[t]()} alpha={0}
        />)}
        <NeonCode
            ref={is_ready_fn}
            x={-500} y={350} size={40}
            code={CODE`bool is_ready(ASTNode* node);`}
            alpha={0}
        />
        <NeonCode
            ref={transfer_fn}
            x={-500} y={400} size={40}
            code={CODE`void transfer(ASTNode* node);`}
            alpha={0}
        />
    </>);
    yield* thetxt().flicker_in(1);
    yield* waitFor(3);
    yield* sequence(0.05,
        ...status_tags.map(s => s.flicker_in(1)),
    );
    yield* waitFor(3);
    yield* sequence(0.1, is_ready_fn().flicker_in(1), transfer_fn().flicker_in(1));
    yield* waitUntil("is_ready_xplain");
    yield* transfer_fn().selection([], 0.5);
    yield* example_code().selection([[[2, 0], [3, Infinity]]], 0.5);

    yield* is_ready_fn().code.edit(0.5)`${remove("bool ")}is_ready(${replace("ASTNode* node", "B2")})${insert(" = is_checked(B1)")};`;
    yield* waitUntil("transfer_xplain");
    yield* all(transfer_fn().selection(DEFAULT, 0.5), is_ready_fn().selection([], 0.5));
    yield* sequence(0.1,
        transfer_fn().code.edit(0.5)`${remove("void ")}transfer(${replace("ASTNode* node", "B2")})${insert(" => sizeof(B2) = sizeof(B1)")};`,
        shiftx(transfer_fn(), 115, 0.5)
    );

    yield* waitUntil("unshow_fns");
    yield* sequence(0.1, is_ready_fn().flicker_out(1), transfer_fn().flicker_out(1));
    
    yield* waitUntil("worklisttime");
    yield* thetxt().txt("Worklist based Checking Algorithm", 1.2);

    
    const queue = createRef<Node>();
    const queue_top_line = createRef<NeonLine>();
    const queue_bot_line = createRef<NeonLine>();
    const queue_back = createRef<NeonRect>();
    const decl_name_strs = ["A", "B2", "B1",  "C1", "C2", "C3"];
    const decl_name_tokens = [
        code_get_token(example_code().code_ref(), "A"),
        code_get_token(example_code().code_ref(), "B2", 1),
        code_get_token(example_code().code_ref(), "B1"),
        code_get_token(example_code().code_ref(), "C1"),
        code_get_token(example_code().code_ref(), "C2", 1),
        code_get_token(example_code().code_ref(), "C3", 1),
    ];
    const decl_name_txts: NeonText[] = [];
    view().add(<>
        <Node ref={queue} y={375} opacity={0}>
            <NeonLine
                ref={queue_top_line}
                points={[[-600, -50], [600, -50]]}
                border={10}
                glow={new Gradient({
                    type: "linear",
                    from: [-600,-50], to: [600,-50],
                    stops: [
                        { offset: 0, color: "#1110" },
                        { offset: 0.45, color: "#283" },
                        { offset: 0.95, color: "#283" },
                        { offset: 1, color: "#1110" },
                    ]
                })}
            />
            <NeonLine
                ref={queue_bot_line}
                points={[[-600, 50], [600, 50]]}
                border={10}
                glow={new Gradient({
                    type: "linear",
                    from: [-600,-50], to: [600,-50],
                    stops: [
                        { offset: 0, color: "#1110" },
                        { offset: 0.45, color: "#283" },
                        { offset: 0.95, color: "#283" },
                        { offset: 1, color: "#1110" },
                    ]
                })}
            />
            <NeonRect
                ref={queue_back}
                border={10}
                width={1200} height={75}
                fill={new Gradient({
                    type: "linear",
                    from: [-600,0], to: [600,0],
                    stops: [
                        { offset: 0, color: "#1110" },
                        { offset: 0.35, color: "#2831" },
                        { offset: 0.95, color: "#2831" },
                        { offset: 1, color: "#1110" },
                    ]
                })}
                glow={"#1110"}
            />
        </Node>
        {...decl_name_tokens.map((t,i) => <NeonText
            ref={makeRef(decl_name_txts, i)}
            position={()=>t().center.add(example_code().position())}
            glow={new Color("#777a72")}
            txt={decl_name_strs[i]} alpha={0} text_alpha={0}
        />)}
    </>);

    yield* flicker_in(queue(), 1);
    
    yield* sequence(0.3,
        ...decl_name_txts.map((t, i) => chain(
            all(
                t.y(375, 0.5),
                t.alpha(0.75, 0.5), t.text_alpha(0.75, 0.5),
            ),
            all(
                t.x(480-150*i, 0.5),
                t.alpha(0.75, 0.5), t.text_alpha(0.75, 0.5),
            ),
        )),
    );
    const circle_locs = node_circles.map(v => v.position);
    const circle_widths = node_circles.map(v => v.width);
    const circle_heights = node_circles.map(v => v.height);
    yield* all(
        example_code().flicker_out(1),
        sequence(0.1,
            ...range(6).map(i => chain(
                all(
                    status_tags[i].position(()=>circle_locs[i]().mul(graph().scale()).add(graph().position()), 0.5),
                    status_tags[i].width(()=>circle_widths[i]()*graph().scale().x, 0.5),
                    status_tags[i].height(()=>circle_heights[i]()*graph().scale().y, 0.5),
                    status_tags[i].alpha(0, 0.5),
                ),
                circle_color_signals[i](colors[i], 0.5),
            )),
        ),
    );
    
    status_tags.map(t => t.remove());
    example_code().remove();

    yield* sequence(0.2, graph().scale(0.7, 0.5), graph().x(-300, 0.5));

    yield* waitUntil("work_one_node");
    yield* waitFor(2);
    yield* sequence(0.1,
        chain(
            decl_name_txts[0].x(700, 0.5),
            decl_name_txts[0].y(0, 0.5),
            decl_name_txts[0].x(400, 0.5),
        ),
        chain(
            waitFor(1.0),
            decl_name_txts[0].size(140, 0.5),
        ),
        ...decl_name_txts.filter((v,i)=>i!=0).map(v => shiftx(v, 150, 0.5)),
    );



    yield* waitFor(2);
    yield* decl_name_txts[0].flicker_out(1);
    yield* circle_color_signals[0]("#383", 0.5);

    yield* waitFor(2);
    yield* sequence(0.1,
        chain(
            decl_name_txts[1].x(700, 0.5),
            decl_name_txts[1].y(0, 0.5),
            decl_name_txts[1].x(400, 0.5),
        ),
        chain(
            waitFor(1.0),
            decl_name_txts[1].size(140, 0.5),
        ),
        ...decl_name_txts.filter((v,i)=>i!=1).map(v => shiftx(v, 150, 0.5)),
    );
    yield* waitUntil("show__" + "b1notrdy");
    const toast = createRef<NeonText>();
    view().add(
        <NeonText
            ref={toast}
            size={48}
            glow={new Color("#823")}
            position={[400, 120]}
            alpha={0}
            txt={"B1 is not checked"}
        />
    );
    yield* toast().flicker_in(1);
    yield* flash(circle_color_signals[1], "#883", 0.3);
    yield* flash(circle_color_signals[1], "#883", 0.3);
    yield* flash(circle_color_signals[1], "#883", 0.3);
    yield* waitUntil("unshow__" + "b1notrdy");
    yield* sequence(0.1,
        toast().flicker_out(1),
        all(
            decl_name_txts[1].size(48, 0.5),
            chain(
                decl_name_txts[1].y(250, 0.5),
                decl_name_txts[1].x(-600, 0.5),
                decl_name_txts[1].y(375, 0.5),
                decl_name_txts[1].x(decl_name_txts[5].x() - 150, 0.5),
            ),
        ),
    );

    yield* sequence(0.1,
        chain(
            decl_name_txts[2].x(700, 0.5),
            decl_name_txts[2].y(0, 0.5),
            decl_name_txts[2].x(400, 0.5),
        ),
        chain(
            waitFor(1.0),
            decl_name_txts[2].size(140, 0.5),
        ),
        ...decl_name_txts.filter((v,i)=>i!=2).map(v => shiftx(v, 150, 0.5)),
    );
    yield* waitFor(0.3);
    yield* decl_name_txts[2].flicker_out(1);
    yield* circle_color_signals[1]("#383", 0.5);
    
    yield* sequence(0.1,
        chain(
            decl_name_txts[3].x(700, 0.5),
            decl_name_txts[3].y(0, 0.5),
            decl_name_txts[3].x(400, 0.5),
        ),
        chain(
            waitFor(1.0),
            decl_name_txts[3].size(140, 0.5),
        ),
        ...decl_name_txts.filter((v,i)=>i!=3).map(v => shiftx(v, 150, 0.5)),
    );
    yield* waitFor(0.3);
    yield* decl_name_txts[3].flicker_out(1);
    yield* circle_color_signals[3]("#383", 0.5);
    

    yield* sequence(0.1,
        chain(
            decl_name_txts[4].x(700, 0.5),
            decl_name_txts[4].y(0, 0.5),
            decl_name_txts[4].x(400, 0.5),
        ),
        chain(
            waitFor(1.0),
            decl_name_txts[4].size(140, 0.5),
        ),
        ...decl_name_txts.filter((v,i)=>i!=4).map(v => shiftx(v, 150, 0.5)),
    );
    yield* waitFor(0.3);
    
    yield* flash(circle_color_signals[5], "#883", 0.3);
    yield* flash(circle_color_signals[5], "#883", 0.3);
    yield* flash(circle_color_signals[5], "#883", 0.3);
    yield* sequence(0.1,
        all(
            decl_name_txts[4].size(48, 0.5),
            chain(
                decl_name_txts[4].y(250, 0.5),
                decl_name_txts[4].x(-600, 0.5),
                decl_name_txts[4].y(375, 0.5),
                decl_name_txts[4].x(decl_name_txts[1].x() - 150, 0.5),
            ),
        ),
    );



    yield* sequence(0.1,
        chain(
            decl_name_txts[5].x(700, 0.5),
            decl_name_txts[5].y(0, 0.5),
            decl_name_txts[5].x(400, 0.5),
        ),
        chain(
            waitFor(1.0),
            decl_name_txts[5].size(140, 0.5),
        ),
        ...decl_name_txts.filter((v,i)=>i!=5).map(v => shiftx(v, 150, 0.5)),
    );
    yield* waitFor(0.3);
    yield* decl_name_txts[5].flicker_out(1);
    yield* circle_color_signals[5]("#383", 0.5);

    yield* sequence(0.1,
        chain(
            decl_name_txts[1].x(700, 0.5),
            decl_name_txts[1].y(0, 0.5),
            decl_name_txts[1].x(400, 0.5),
        ),
        chain(
            waitFor(1.0),
            decl_name_txts[1].size(140, 0.5),
        ),
        ...decl_name_txts.filter((v,i)=>i!=1).map(v => shiftx(v, 150, 0.5)),
    );
    yield* waitFor(0.3);
    yield* decl_name_txts[1].flicker_out(1);
    yield* circle_color_signals[2]("#383", 0.5);

    yield* sequence(0.1,
        chain(
            decl_name_txts[4].x(700, 0.5),
            decl_name_txts[4].y(0, 0.5),
            decl_name_txts[4].x(400, 0.5),
            flicker_out(queue(), 1),
        ),
        chain(
            waitFor(1.0),
            decl_name_txts[4].size(140, 0.5),
        ),
        ...decl_name_txts.filter((v,i)=>i!=4).map(v => shiftx(v, 150, 0.5)),
    );
    yield* waitFor(0.3);
    yield* decl_name_txts[4].flicker_out(1);
    yield* circle_color_signals[4]("#383", 0.5);

    yield* waitFor(2);
    yield* sequence(0.1,
        flicker_out(graph(), 1),
        thetxt().flicker_out(1),
    );


    yield* waitUntil("end");
});