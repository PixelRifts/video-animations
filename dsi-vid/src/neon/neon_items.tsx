import { initial, signal, Node, NodeProps, Rect, Img, brightness, blur, Video, PossibleCanvasStyle, canvasStyleSignal, CanvasStyleSignal, colorSignal, Txt, Icon, Line, Code, CodeSignal, CODE, codeSignal, hue, PossibleCodeScope, PossibleCodeSelection, Circle, vector2Signal, CubicBezier } from "@motion-canvas/2d";
import { Color, ColorSignal, Computed, DEFAULT, PossibleColor, PossibleVector2, Reference, SignalValue, SimpleSignal, SimpleVector2Signal, Vector2, all, createComputed, createRef, createSignal, sequence, useRandom, waitFor } from "@motion-canvas/core";

import border_shader from "../shaders/border_shader.glsl";


export interface NeonLineProps extends NodeProps {
    points: SignalValue<SignalValue<PossibleVector2>[]>;
    height?: SignalValue<number>;
    border?: SignalValue<number>;
    alpha?: SignalValue<number>;
    glow?: SignalValue<PossibleCanvasStyle>;
    line_dash?: SignalValue<number[]>;
    startArrow?: SignalValue<boolean>;
    endArrow?: SignalValue<boolean>;
    end?: SignalValue<number>;
}

export class NeonLine extends Node {
    @signal()
    public declare readonly points: SimpleSignal<
        SignalValue<PossibleVector2>[] | null,
        this
    >;

    @initial(25)
    @signal()
    public declare readonly border: SimpleSignal<number, this>;

    @initial(1.0)
    @signal()
    public declare readonly alpha: SimpleSignal<number, this>;

    @initial(new Color("#823"))
    @canvasStyleSignal()
    public declare readonly glow: CanvasStyleSignal<this>;

    @initial(false)
    @signal()
    public declare readonly startArrow: SimpleSignal<boolean, this>;

    @initial(false)
    @signal()
    public declare readonly endArrow: SimpleSignal<boolean, this>;

    @initial([])
    @signal()
    public declare readonly line_dash: SimpleSignal<number[], this>;

    @initial(1.0)
    @signal()
    public declare readonly end: SimpleSignal<number, this>;

    public constructor(props?: NeonLineProps) {
        super({
            ...props,
        });

        this.add(<>
            <Line
                points={()=>this.points()}
                stroke={()=>this.glow()}
                lineWidth={()=>this.border()} opacity={()=>this.alpha()}
                lineDash={()=>this.line_dash()}
                startArrow={()=>this.startArrow()} endArrow={()=>this.endArrow()}
                arrowSize={()=>this.border()*1.5}
                radius={10} y={()=>this.border()}
                end={()=>this.end()}
                filters={[brightness(-5)]}
            />
            <Line
                points={()=>this.points()}
                stroke={()=>this.glow()}
                lineWidth={()=>this.border()} opacity={()=>this.alpha()}
                lineDash={()=>this.line_dash()}
                startArrow={()=>this.startArrow()} endArrow={()=>this.endArrow()}
                radius={10} y={()=>this.border()}
                end={()=>this.end()}
                arrowSize={()=>this.border()*1.5}
                filters={[blur(7.5),brightness(-3)]}
            />
            <Line
                points={()=>this.points()}
                stroke={()=>this.glow()}
                lineWidth={()=>this.border()} opacity={()=>this.alpha()}
                lineDash={()=>this.line_dash()}
                startArrow={()=>this.startArrow()} endArrow={()=>this.endArrow()}
                end={()=>this.end()}
                arrowSize={()=>this.border()*1.5}
                radius={10} y={()=>this.border()}
                filters={[blur(10.5),brightness(-1)]}
            />
        </>);
        this.add(<>
            <Line
                points={()=>this.points()}
                stroke={()=>this.glow()}
                lineWidth={()=>this.border()} opacity={()=>this.alpha()}
                startArrow={()=>this.startArrow()} endArrow={()=>this.endArrow()}
                arrowSize={()=>this.border()*1.5}
                end={()=>this.end()}
                radius={10} filters={[brightness(2)]}
                lineDash={()=>this.line_dash()}
            />
            <Line
                points={()=>this.points()}
                stroke={()=>this.glow()}
                lineWidth={()=>this.border()} opacity={()=>this.alpha()}
                startArrow={()=>this.startArrow()} endArrow={()=>this.endArrow()}
                arrowSize={()=>this.border()*1.5}
                end={()=>this.end()}
                radius={10}
                lineDash={()=>this.line_dash()}
                filters={[blur(13.5),brightness(2.5)]}
            />
            <Line
                points={()=>this.points()}
                stroke={()=>this.glow()}
                lineWidth={()=>this.border()} opacity={()=>this.alpha()}
                startArrow={()=>this.startArrow()} endArrow={()=>this.endArrow()}
                arrowSize={()=>this.border()*1.5}
                end={()=>this.end()}
                radius={10}
                lineDash={()=>this.line_dash()}
                filters={[blur(10.5),brightness(3.5)]}
            />
        </>);
    }

    public* flicker_in(groups: number = 2) {
        const random = useRandom();
        let c = random.nextFloat(0.1, 0.2);
        yield* all(
            this.alpha(1.00, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
        let shift = 0; let final = 0;
        for (let i = 0; i < groups; i++) {
            for (let j = 0; j < random.nextInt(2, 6-final); j++) {
                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.alpha(0.05, c),
                );
                yield* waitFor(random.nextFloat(0.01, 0.02));

                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.alpha(1.0, c),
                );
                yield* waitFor(random.nextFloat(0.01+(shift/3), 0.02+(shift/3)));
            }
            
            yield* waitFor(random.nextFloat(shift+0.3, shift+0.4));
            shift += 0.2;
            final += 2;
        }
        c = random.nextFloat(0.01, 0.02);
        yield* all(
            this.alpha(1.0, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
    }
    
    public* flicker_out(groups: number = 2) {
        const random = useRandom();
        let c = random.nextFloat(0.1, 0.2);
        yield* all(
            this.alpha(0.00, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
        let shift = 0; let final = 0;
        for (let i = 0; i < groups; i++) {
            for (let j = 0; j < random.nextInt(2, 6-final); j++) {
                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.alpha(0.95, c),
                );
                yield* waitFor(random.nextFloat(0.01, 0.02));

                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.alpha(0.0, c),
                );
                yield* waitFor(random.nextFloat(0.01+(shift/3), 0.02+(shift/3)));
            }
            
            yield* waitFor(random.nextFloat(shift+0.3, shift+0.4));
            shift += 0.2;
            final += 2;
        }
        c = random.nextFloat(0.01, 0.02);
        yield* all(
            this.alpha(0.0, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
    }
}



export interface NeonCubicBezierProps extends NodeProps {
    p0: SignalValue<PossibleVector2>;
    p1: SignalValue<PossibleVector2>;
    p2: SignalValue<PossibleVector2>;
    p3: SignalValue<PossibleVector2>;
    height?: SignalValue<number>;
    border?: SignalValue<number>;
    alpha?: SignalValue<number>;
    glow?: SignalValue<Color>;
    line_dash?: SignalValue<number[]>;
    startArrow?: SignalValue<boolean>;
    endArrow?: SignalValue<boolean>;
}

export class NeonCubicBezier extends Node {
    @vector2Signal()
    public declare readonly p0: SimpleVector2Signal<this>;
    @vector2Signal()
    public declare readonly p1: SimpleVector2Signal<this>;
    @vector2Signal()
    public declare readonly p2: SimpleVector2Signal<this>;
    @vector2Signal()
    public declare readonly p3: SimpleVector2Signal<this>;

    @initial(25)
    @signal()
    public declare readonly border: SimpleSignal<number, this>;

    @initial(1.0)
    @signal()
    public declare readonly alpha: SimpleSignal<number, this>;

    @initial(new Color("#823"))
    @colorSignal()
    public declare readonly glow: ColorSignal<this>;

    @initial(false)
    @signal()
    public declare readonly startArrow: SimpleSignal<boolean, this>;

    @initial(false)
    @signal()
    public declare readonly endArrow: SimpleSignal<boolean, this>;

    @initial([])
    @signal()
    public declare readonly line_dash: SimpleSignal<number[], this>;

    public constructor(props?: NeonCubicBezierProps) {
        super({
            ...props,
        });

        this.add(<>
            <CubicBezier
                p0={()=>this.p0()} p1={()=>this.p1()} p2={()=>this.p2()} p3={()=>this.p3()}
                stroke={()=>this.glow().alpha(this.alpha()).darken(5)}
                lineWidth={()=>this.border()}
                lineDash={()=>this.line_dash()}
                startArrow={()=>this.startArrow()} endArrow={()=>this.endArrow()}
                arrowSize={()=>this.border()*1.5} y={()=>this.border()}
            />
            <CubicBezier
                p0={()=>this.p0()} p1={()=>this.p1()} p2={()=>this.p2()} p3={()=>this.p3()}
                stroke={()=>this.glow().alpha(this.alpha()).darken(3)}
                lineWidth={()=>this.border()}
                lineDash={()=>this.line_dash()}
                startArrow={()=>this.startArrow()} endArrow={()=>this.endArrow()} y={()=>this.border()}
                arrowSize={()=>this.border()*1.5}
                filters={[blur(4.5)]}
            />
            <CubicBezier
                p0={()=>this.p0()} p1={()=>this.p1()} p2={()=>this.p2()} p3={()=>this.p3()}
                stroke={()=>this.glow().alpha(this.alpha()).darken(1)}
                lineWidth={()=>this.border()}
                lineDash={()=>this.line_dash()}
                startArrow={()=>this.startArrow()} endArrow={()=>this.endArrow()}
                arrowSize={()=>this.border()*1.5} y={()=>this.border()}
                filters={[blur(10.5)]}
            />
        </>);
        this.add(<>
            <CubicBezier
                p0={()=>this.p0()} p1={()=>this.p1()} p2={()=>this.p2()} p3={()=>this.p3()}
                stroke={()=>this.glow().alpha(this.alpha()).brighten(2)}
                lineWidth={()=>this.border()}
                startArrow={()=>this.startArrow()} endArrow={()=>this.endArrow()}
                arrowSize={()=>this.border()*1.5}
                lineDash={()=>this.line_dash()}
            />
            <CubicBezier
                p0={()=>this.p0()} p1={()=>this.p1()} p2={()=>this.p2()} p3={()=>this.p3()}
                stroke={()=>this.glow().alpha(this.alpha()).brighten(1)}
                lineWidth={()=>this.border()}
                startArrow={()=>this.startArrow()} endArrow={()=>this.endArrow()}
                arrowSize={()=>this.border()*1.5}
                lineDash={()=>this.line_dash()}
                filters={[blur(4.5),brightness(1.5)]}
            />
            <CubicBezier
                p0={()=>this.p0()} p1={()=>this.p1()} p2={()=>this.p2()} p3={()=>this.p3()}
                stroke={()=>this.glow().alpha(this.alpha())}
                lineWidth={()=>this.border()}
                startArrow={()=>this.startArrow()} endArrow={()=>this.endArrow()}
                arrowSize={()=>this.border()*1.5}
                lineDash={()=>this.line_dash()}
                filters={[blur(10.5),brightness(2.5)]}
            />
        </>);
    }

    public* flicker_in(groups: number = 2) {
        const random = useRandom();
        let c = random.nextFloat(0.1, 0.2);
        yield* all(
            this.alpha(1.00, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
        let shift = 0; let final = 0;
        for (let i = 0; i < groups; i++) {
            for (let j = 0; j < random.nextInt(2, 6-final); j++) {
                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.alpha(0.05, c),
                );
                yield* waitFor(random.nextFloat(0.01, 0.02));

                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.alpha(1.0, c),
                );
                yield* waitFor(random.nextFloat(0.01+(shift/3), 0.02+(shift/3)));
            }
            
            yield* waitFor(random.nextFloat(shift+0.3, shift+0.4));
            shift += 0.2;
            final += 2;
        }
        c = random.nextFloat(0.01, 0.02);
        yield* all(
            this.alpha(1.0, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
    }
    
    public* flicker_out(groups: number = 2) {
        const random = useRandom();
        let c = random.nextFloat(0.1, 0.2);
        yield* all(
            this.alpha(0.00, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
        let shift = 0; let final = 0;
        for (let i = 0; i < groups; i++) {
            for (let j = 0; j < random.nextInt(2, 6-final); j++) {
                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.alpha(0.95, c),
                );
                yield* waitFor(random.nextFloat(0.01, 0.02));

                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.alpha(0.0, c),
                );
                yield* waitFor(random.nextFloat(0.01+(shift/3), 0.02+(shift/3)));
            }
            
            yield* waitFor(random.nextFloat(shift+0.3, shift+0.4));
            shift += 0.2;
            final += 2;
        }
        c = random.nextFloat(0.01, 0.02);
        yield* all(
            this.alpha(0.0, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
    }
}




export interface NeonCircleProps extends NodeProps {
    width?: SignalValue<number>;
    height?: SignalValue<number>;
    border?: SignalValue<number>;
    alpha?: SignalValue<number>;
    glow?: SignalValue<PossibleCanvasStyle>;
}

export class NeonCircle extends Node {
    @initial(100)
    @signal()
    public declare readonly width: SimpleSignal<number, this>;

    @initial(100)
    @signal()
    public declare readonly height: SimpleSignal<number, this>;
    
    @initial(8)
    @signal()
    public declare readonly border: SimpleSignal<number, this>;

    @initial(1.0)
    @signal()
    public declare readonly alpha: SimpleSignal<number, this>;

    @initial(new Color("#823"))
    @canvasStyleSignal()
    public declare readonly glow: CanvasStyleSignal<this>;

    public circle_ref: Reference<Circle> = createRef<Circle>();

    public constructor(props?: NeonCircleProps) {
        super({
            ...props,
        });

        this.add(<>
            <Circle
                width={()=>this.width()+this.border()}
                height={()=>this.height()+this.border()}
                stroke={()=>this.glow()}
                lineWidth={()=>this.border()} opacity={()=>this.alpha()}
                filters={[brightness(-2)]}
                y={()=>this.border()}
            />
            <Circle
                width={()=>this.width()+this.border()}
                height={()=>this.height()+this.border()}
                stroke={()=>this.glow()}
                lineWidth={()=>this.border()} opacity={()=>this.alpha()}
                y={()=>this.border()}
                filters={[blur(7.5),brightness(-1)]}
            />
            <Circle
                width={()=>this.width()+this.border()}
                height={()=>this.height()+this.border()}
                stroke={()=>this.glow()}
                lineWidth={()=>this.border()} opacity={()=>this.alpha()}
                y={()=>this.border()}
                filters={[blur(10.5)]}
            />
        </>);
        this.add(<>
            <Circle
                ref={this.circle_ref}
                width={()=>this.width()+this.border()}
                height={()=>this.height()+this.border()}
                stroke={()=>this.glow()} opacity={()=>this.alpha()}
                lineWidth={()=>this.border()}
                filters={[brightness(4.5)]}
            />
            <Circle
                width={()=>this.width()+this.border()}
                height={()=>this.height()+this.border()}
                stroke={()=>this.glow()} opacity={()=>this.alpha()}
                lineWidth={()=>this.border()}
                filters={[blur(10.5),brightness(2.5)]}
            />
            <Circle
                width={()=>this.width()+this.border()}
                height={()=>this.height()+this.border()}
                stroke={()=>this.glow()} opacity={()=>this.alpha()}
                lineWidth={()=>this.border()}
                filters={[blur(13.5),brightness(1.5)]}
            />
        </>);
    }

    public* flicker_in(groups: number = 2) {
        const random = useRandom();
        let c = random.nextFloat(0.1, 0.2);
        yield* all(
            this.alpha(1.00, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
        let shift = 0; let final = 0;
        for (let i = 0; i < groups; i++) {
            for (let j = 0; j < random.nextInt(2, 6-final); j++) {
                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.alpha(0.05, c),
                );
                yield* waitFor(random.nextFloat(0.01, 0.02));

                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.alpha(1.0, c),
                );
                yield* waitFor(random.nextFloat(0.01+(shift/3), 0.02+(shift/3)));
            }
            
            yield* waitFor(random.nextFloat(shift+0.3, shift+0.4));
            shift += 0.2;
            final += 2;
        }
        c = random.nextFloat(0.01, 0.02);
        yield* all(
            this.alpha(1.0, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
    }
    
    public* flicker_out(groups: number = 2) {
        const random = useRandom();
        let c = random.nextFloat(0.1, 0.2);
        yield* all(
            this.alpha(0.00, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
        let shift = 0; let final = 0;
        for (let i = 0; i < groups; i++) {
            for (let j = 0; j < random.nextInt(2, 6-final); j++) {
                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.alpha(0.95, c),
                );
                yield* waitFor(random.nextFloat(0.01, 0.02));

                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.alpha(0.0, c),
                );
                yield* waitFor(random.nextFloat(0.01+(shift/3), 0.02+(shift/3)));
            }
            
            yield* waitFor(random.nextFloat(shift+0.3, shift+0.4));
            shift += 0.2;
            final += 2;
        }
        c = random.nextFloat(0.01, 0.02);
        yield* all(
            this.alpha(0.0, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
    }
}



export interface NeonRectProps extends NodeProps {
    width?: SignalValue<number>;
    height?: SignalValue<number>;
    border?: SignalValue<number>;
    alpha?: SignalValue<number>;
    fill?: SignalValue<PossibleCanvasStyle>;
    glow?: SignalValue<PossibleCanvasStyle>;
}

export class NeonRect extends Node {
    @initial(100)
    @signal()
    public declare readonly width: SimpleSignal<number, this>;

    @initial(100)
    @signal()
    public declare readonly height: SimpleSignal<number, this>;
    
    @initial(25)
    @signal()
    public declare readonly border: SimpleSignal<number, this>;

    @initial(1.0)
    @signal()
    public declare readonly alpha: SimpleSignal<number, this>;

    @initial(new Color("#1110"))
    @signal()
    public declare readonly fill: CanvasStyleSignal<this>;

    @initial(new Color("#823"))
    @canvasStyleSignal()
    public declare readonly glow: CanvasStyleSignal<this>;

    public rect_ref: Reference<Rect> = createRef<Rect>();

    public constructor(props?: NeonRectProps) {
        super({
            ...props,
        });

        this.add(<>
            <Rect
                width={()=>this.width()+this.border()}
                height={()=>this.height()+this.border()}
                stroke={()=>this.glow()} fill={()=>this.fill()} opacity={()=>this.alpha()}
                lineWidth={()=>this.border()}
                radius={10} y={()=>this.border()}
                filters={[brightness(-5)]}
            />
            <Rect
                width={()=>this.width()+this.border()}
                height={()=>this.height()+this.border()}
                stroke={()=>this.glow()} fill={()=>this.fill()} opacity={()=>this.alpha()}
                lineWidth={()=>this.border()}
                radius={10} y={()=>this.border()}
                filters={[blur(3.5),brightness(-3)]}
            />
            <Rect
                width={()=>this.width()+this.border()}
                height={()=>this.height()+this.border()}
                stroke={()=>this.glow()} fill={()=>this.fill()} opacity={()=>this.alpha()}
                lineWidth={()=>this.border()}
                radius={10} y={()=>this.border()}
                filters={[blur(5.5),brightness(-1)]}
            />
        </>);
        this.add(<>
            <Rect
                ref={this.rect_ref}
                width={()=>this.width()+this.border()}
                height={()=>this.height()+this.border()}
                stroke={()=>this.glow()} fill={()=>this.fill()} opacity={()=>this.alpha()}
                lineWidth={()=>this.border()}
                radius={10}
                filters={[brightness(2)]}
            />
            <Rect
                width={()=>this.width()+this.border()}
                height={()=>this.height()+this.border()}
                stroke={()=>this.glow()} fill={()=>this.fill()} opacity={()=>this.alpha()}
                lineWidth={()=>this.border()}
                radius={10}
                filters={[blur(5.5),brightness(2.5)]}
            />
            <Rect
                width={()=>this.width()+this.border()}
                height={()=>this.height()+this.border()}
                stroke={()=>this.glow()} fill={()=>this.fill()} opacity={()=>this.alpha()}
                lineWidth={()=>this.border()}
                radius={10}
                filters={[blur(10.5),brightness(3.5)]}
            />
        </>);
    }

    public* flicker_in(groups: number = 2) {
        const random = useRandom();
        let c = random.nextFloat(0.1, 0.2);
        yield* all(
            this.alpha(1.00, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
        let shift = 0; let final = 0;
        for (let i = 0; i < groups; i++) {
            for (let j = 0; j < random.nextInt(2, 6-final); j++) {
                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.alpha(0.05, c),
                );
                yield* waitFor(random.nextFloat(0.01, 0.02));

                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.alpha(1.0, c),
                );
                yield* waitFor(random.nextFloat(0.01+(shift/3), 0.02+(shift/3)));
            }
            
            yield* waitFor(random.nextFloat(shift+0.3, shift+0.4));
            shift += 0.2;
            final += 2;
        }
        c = random.nextFloat(0.01, 0.02);
        yield* all(
            this.alpha(1.0, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
    }
    
    public* flicker_out(groups: number = 2) {
        const random = useRandom();
        let c = random.nextFloat(0.1, 0.2);
        yield* all(
            this.alpha(0.00, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
        let shift = 0; let final = 0;
        for (let i = 0; i < groups; i++) {
            for (let j = 0; j < random.nextInt(2, 6-final); j++) {
                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.alpha(0.95, c),
                );
                yield* waitFor(random.nextFloat(0.01, 0.02));

                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.alpha(0.0, c),
                );
                yield* waitFor(random.nextFloat(0.01+(shift/3), 0.02+(shift/3)));
            }
            
            yield* waitFor(random.nextFloat(shift+0.3, shift+0.4));
            shift += 0.2;
            final += 2;
        }
        c = random.nextFloat(0.01, 0.02);
        yield* all(
            this.alpha(0.0, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
    }
}


export interface NeonImageProps extends NodeProps {
    image_source: SignalValue<string>;
    width?: SignalValue<number>;
    height?: SignalValue<number>;
    rotation?: SignalValue<number>;
    border?: SignalValue<number>;
    intensity?: SignalValue<number>;
    alpha?: SignalValue<number>;
    image_alpha?: SignalValue<number>;
    reach?: SignalValue<number>;
    glow?: SignalValue<Color>;
}

export class NeonImage extends Node {
    @initial("")
    @signal()
    public declare readonly image_source: SimpleSignal<string, this>;

    @initial(100)
    @signal()
    public declare readonly width: SimpleSignal<number, this>;

    @initial(100)
    @signal()
    public declare readonly height: SimpleSignal<number, this>;
    
    @initial(0)
    @signal()
    public declare readonly rotation: SimpleSignal<number, this>;

    @initial(135)
    @signal()
    public declare readonly border: SimpleSignal<number, this>;

    @initial(1.2)
    @signal()
    public declare readonly intensity: SimpleSignal<number, this>;
    
    @initial(1.0)
    @signal()
    public declare readonly alpha: SimpleSignal<number, this>;

    @initial(1.0)
    @signal()
    public declare readonly image_alpha: SimpleSignal<number, this>;

    @initial(25.0)
    @signal()
    public declare readonly reach: SimpleSignal<number, this>;

    @initial(new Color("#823"))
    @colorSignal()
    public declare readonly glow: ColorSignal<this>;

    public constructor(props?: NeonImageProps) {
        super({
            ...props,
        });

        const tr = createRef<Img>();

        this.add(<>
            <Rect
                width={()=>this.width()+this.border()}
                height={()=>this.height()+this.border()}
                radius={10}
                shaders={{
                    fragment: border_shader,
                    uniforms: {
                        position: () => new Vector2(this.x(), this.y()),
                        color: () => this.glow(),
                        size: () => new Vector2(this.width()+this.border(), this.height()+this.border()),
                        border: () => this.border(),
                        intensity: () => this.intensity(),
                        alpha_max: () => this.alpha(),
                        radius: () => this.reach(),
                    }
                }}
            />
            <Img
                ref={tr}
                src={this.image_source}
                width={()=>this.width()}
                height={()=>this.height()}
                alpha={()=>this.image_alpha()}
                radius={10}
                // filters={[brightness(1.5)]}
            />
        </>);
    }

    public* flicker_in(groups: number = 2) {
        const random = useRandom();
        let c = random.nextFloat(0.1, 0.2);
        yield* all(
            this.image_alpha(1.00, c),
            this.alpha(1.00, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
        let shift = 0; let final = 0;
        for (let i = 0; i < groups; i++) {
            for (let j = 0; j < random.nextInt(2, 6-final); j++) {
                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.image_alpha(0.35, c),
                    this.alpha(0.05, c),
                );
                yield* this.reach(19.0, c/2);
                yield* waitFor(random.nextFloat(0.01, 0.02));

                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.image_alpha(1.0, c),
                    this.alpha(1.0, c),
                );
                yield* this.reach(25.0, c/2);
                yield* waitFor(random.nextFloat(0.01+(shift/3), 0.02+(shift/3)));
            }
            
            yield* waitFor(random.nextFloat(shift+0.3, shift+0.4));
            shift += 0.2;
            final += 2;
        }
        c = random.nextFloat(0.01, 0.02);
        yield* all(
            this.alpha(1.0, c),
            this.image_alpha(1.0, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
    }
    
    public* flicker_out(groups: number = 2) {
        const random = useRandom();
        let c = random.nextFloat(0.1, 0.2);
        yield* all(
            this.image_alpha(0.00, c),
            this.alpha(0.00, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
        let shift = 0; let final = 0;
        for (let i = 0; i < groups; i++) {
            for (let j = 0; j < random.nextInt(2, 6-final); j++) {
                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.image_alpha(0.65, c),
                    this.alpha(0.95, c),
                );
                yield* this.reach(25.0, c/2);
                yield* waitFor(random.nextFloat(0.01, 0.02));

                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.image_alpha(0.0, c),
                    this.alpha(0.0, c),
                );
                yield* this.reach(19.0, c/2);
                yield* waitFor(random.nextFloat(0.01+(shift/3), 0.02+(shift/3)));
            }
            
            yield* waitFor(random.nextFloat(shift+0.3, shift+0.4));
            shift += 0.2;
            final += 2;
        }
        c = random.nextFloat(0.01, 0.02);
        yield* all(
            this.alpha(0.0, c),
            this.image_alpha(0.0, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
    }
}

export interface NeonVideoProps extends NodeProps {
    video_source: SignalValue<string>;
    width?: SignalValue<number>;
    height?: SignalValue<number>;
    rotation?: SignalValue<number>;
    border?: SignalValue<number>;
    intensity?: SignalValue<number>;
    alpha?: SignalValue<number>;
    video_alpha?: SignalValue<number>;
    reach?: SignalValue<number>;
    glow?: SignalValue<Color>;
}

export class NeonVideo extends Node {
    @initial("")
    @signal()
    public declare readonly video_source: SimpleSignal<string, this>;

    @initial(100)
    @signal()
    public declare readonly width: SimpleSignal<number, this>;

    @initial(100)
    @signal()
    public declare readonly height: SimpleSignal<number, this>;
    
    @initial(0)
    @signal()
    public declare readonly rotation: SimpleSignal<number, this>;

    @initial(135)
    @signal()
    public declare readonly border: SimpleSignal<number, this>;

    @initial(1.2)
    @signal()
    public declare readonly intensity: SimpleSignal<number, this>;
    
    @initial(1.0)
    @signal()
    public declare readonly alpha: SimpleSignal<number, this>;

    @initial(1.0)
    @signal()
    public declare readonly video_alpha: SimpleSignal<number, this>;

    @initial(25.0)
    @signal()
    public declare readonly reach: SimpleSignal<number, this>;

    @initial(new Color("#823"))
    @colorSignal()
    public declare readonly glow: ColorSignal<this>;

    public video_ref: Reference<Video>;

    public constructor(props?: NeonVideoProps) {
        super({
            ...props,
        });

        this.video_ref = createRef<Video>();

        this.add(<>
            <Rect
                cache
                width={()=>this.width()+this.border()}
                height={()=>this.height()+this.border()}
                radius={10}
                shaders={{
                    fragment: border_shader,
                    uniforms: {
                        position: () => new Vector2(this.x(), this.y()),
                        color: () => this.glow(),
                        size: () => new Vector2(this.width()+this.border(), this.height()+this.border()),
                        border: () => this.border(),
                        intensity: () => this.intensity(),
                        alpha_max: () => this.alpha(),
                        radius: () => this.reach(),
                    }
                }}
            />
            <Video
                ref={this.video_ref}
                src={this.video_source}
                width={()=>this.width()}
                height={()=>this.height()}
                alpha={()=>this.video_alpha()}
                radius={10}
            />
        </>);
    }

    public seek_and_play(time: number) {
        this.video_ref().seek(time);
        this.video_ref().play();
    }

    public* flicker_in(groups: number = 2) {
        const random = useRandom();
        let c = random.nextFloat(0.1, 0.2);
        yield* all(
            this.video_alpha(1.00, c),
            this.alpha(1.00, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
        let shift = 0; let final = 0;
        for (let i = 0; i < groups; i++) {
            for (let j = 0; j < random.nextInt(2, 6-final); j++) {
                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.video_alpha(0.35, c),
                    this.alpha(0.05, c),
                );
                yield* this.reach(19.0, c/2);
                yield* waitFor(random.nextFloat(0.01, 0.02));

                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.video_alpha(1.0, c),
                    this.alpha(1.0, c),
                );
                yield* this.reach(25.0, c/2);
                yield* waitFor(random.nextFloat(0.01+(shift/3), 0.02+(shift/3)));
            }
            
            yield* waitFor(random.nextFloat(shift+0.3, shift+0.4));
            shift += 0.2;
            final += 2;
        }
        c = random.nextFloat(0.01, 0.02);
        yield* all(
            this.alpha(1.0, c),
            this.video_alpha(1.0, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
    }

    public* flicker_out(groups: number = 2) {
        const random = useRandom();
        let c = random.nextFloat(0.1, 0.2);
        yield* all(
            this.video_alpha(0.00, c),
            this.alpha(0.00, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
        let shift = 0; let final = 0;
        for (let i = 0; i < groups; i++) {
            for (let j = 0; j < random.nextInt(2, 6-final); j++) {
                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.video_alpha(0.65, c),
                    this.alpha(0.95, c),
                );
                yield* this.reach(25.0, c/2);
                yield* waitFor(random.nextFloat(0.01, 0.02));

                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.video_alpha(0.0, c),
                    this.alpha(0.0, c),
                );
                yield* this.reach(19.0, c/2);
                yield* waitFor(random.nextFloat(0.01+(shift/3), 0.02+(shift/3)));
            }
            
            yield* waitFor(random.nextFloat(shift+0.3, shift+0.4));
            shift += 0.2;
            final += 2;
        }
        c = random.nextFloat(0.01, 0.02);
        yield* all(
            this.alpha(0.0, c),
            this.video_alpha(0.0, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
    }
}






export interface NeonTextProps extends NodeProps {
    txt: SignalValue<string>;
    size?: SignalValue<number>;
    rotation?: SignalValue<number>;
    border?: SignalValue<number>;
    diffusion?: SignalValue<number>;
    alpha?: SignalValue<number>;
    text_alpha?: SignalValue<number>;
    shadow?: boolean;
    glow?: SignalValue<Color>;
}

export class NeonText extends Node {
    @initial("")
    @signal()
    public declare readonly txt: SimpleSignal<string, this>;

    @initial(48)
    @signal()
    public declare readonly size: SimpleSignal<number, this>;

    @initial(0)
    @signal()
    public declare readonly rotation: SimpleSignal<number, this>;

    @initial(135)
    @signal()
    public declare readonly border: SimpleSignal<number, this>;

    @initial(1)
    @signal()
    public declare readonly diffusion: SimpleSignal<number, this>;
    
    @initial(1.0)
    @signal()
    public declare readonly alpha: SimpleSignal<number, this>;

    @initial(1.0)
    @signal()
    public declare readonly text_alpha: SimpleSignal<number, this>;

    @initial(new Color("#823"))
    @colorSignal()
    public declare readonly glow: ColorSignal<this>;

    public txt_ref: Reference<Txt>;
    public width: Computed<number>;
    public height: Computed<number>;

    public constructor(props?: NeonTextProps) {
        super({
            ...props,
        });

        this.txt_ref = createRef<Txt>();
        
        if (props.shadow === true || props.shadow === undefined) {
            this.add(<>
                <Txt
                    fontFamily={"Inconsolata"}
                    text={() => this.txt()}
                    fill={() => this.glow().alpha(this.text_alpha()).darken(0.5)}
                    fontSize={() => this.size()}
                    filters={() => [blur((this.size()*this.diffusion())/10),brightness(4)]}
                    y={7.5}
                />
                <Txt
                    fontFamily={"Inconsolata"}
                    text={() => this.txt()}
                    fill={() => this.glow().alpha(this.text_alpha()).darken(0.5)}
                    fontSize={() => this.size()}
                    filters={() => [blur((this.size()*this.diffusion())/20),brightness(2)]}
                    y={7.5}
                />
                <Txt
                    fontFamily={"Inconsolata"}
                    text={() => this.txt()}
                    fill={() => this.glow().alpha(this.text_alpha()).darken(0.5)}
                    fontSize={() => this.size()}
                    y={7.5}
                />
            </>);
        }
        
        
        this.add(<>
            <Txt
                fontFamily={"Inconsolata"}
                text={() => this.txt()}
                fill={() => this.glow().alpha(this.text_alpha())}
                fontSize={() => this.size()}
                filters={[blur(10.5*this.diffusion()),brightness(4)]}
            />
            <Txt
                fontFamily={"Inconsolata"}
                text={() => this.txt()}
                fill={() => this.glow().alpha(this.text_alpha()).brighten(1)}
                fontSize={() => this.size()}
                filters={[blur(3.5*this.diffusion()),brightness(2)]}
            />
            <Txt
                ref={this.txt_ref}
                fontFamily={"Inconsolata"}
                text={() => this.txt()}
                fill={() => this.glow().alpha(this.text_alpha()).brighten(2)}
                fontSize={() => this.size()}
            />
        </>);

        this.width = createComputed(() => this.txt_ref().size().x);
        this.height = createComputed(() => this.txt_ref().size().y);
    }

    public* flicker_in(groups: number = 2) {
        const random = useRandom();
        let c = random.nextFloat(0.1, 0.2);
        yield* all(
            this.text_alpha(1.00, c),
            this.alpha(1.00, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
        let shift = 0; let final = 0;
        for (let i = 0; i < groups; i++) {
            for (let j = 0; j < random.nextInt(2, 6-final); j++) {
                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.text_alpha(0.35, c),
                    this.alpha(0.05, c),
                );
                yield* waitFor(random.nextFloat(0.01, 0.02));

                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.text_alpha(1.0, c),
                    this.alpha(1.0, c),
                );
                yield* waitFor(random.nextFloat(0.01+(shift/3), 0.02+(shift/3)));
            }
            
            yield* waitFor(random.nextFloat(shift+0.3, shift+0.4));
            shift += 0.2;
            final += 2;
        }
        c = random.nextFloat(0.01, 0.02);
        yield* all(
            this.alpha(1.0, c),
            this.text_alpha(1.0, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
    }

    public* flicker_out(groups: number = 2) {
        const random = useRandom();
        let c = random.nextFloat(0.1, 0.2);
        yield* all(
            this.text_alpha(0.00, c),
            this.alpha(0.00, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
        let shift = 0; let final = 0;
        for (let i = 0; i < groups; i++) {
            for (let j = 0; j < random.nextInt(2, 6-final); j++) {
                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.text_alpha(0.65, c),
                    this.alpha(0.95, c),
                );
                yield* waitFor(random.nextFloat(0.01, 0.02));

                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.text_alpha(0.0, c),
                    this.alpha(0.0, c),
                );
                yield* waitFor(random.nextFloat(0.01+(shift/3), 0.02+(shift/3)));
            }
            
            yield* waitFor(random.nextFloat(shift+0.3, shift+0.4));
            shift += 0.2;
            final += 2;
        }
        c = random.nextFloat(0.01, 0.02);
        yield* all(
            this.alpha(0.0, c),
            this.text_alpha(0.0, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
    }
}






export interface NeonIconProps extends NodeProps {
    icon: SignalValue<string>;
    size?: SignalValue<number>;
    rotation?: SignalValue<number>;
    border?: SignalValue<number>;
    intensity?: SignalValue<number>;
    alpha?: SignalValue<number>;
    icon_alpha?: SignalValue<number>;
    reach?: SignalValue<number>;
    glow?: SignalValue<Color>;
}

export class NeonIcon extends Node {
    @initial("")
    @signal()
    public declare readonly icon: SimpleSignal<string, this>;

    @initial(48)
    @signal()
    public declare readonly size: SimpleSignal<number, this>;

    @initial(0)
    @signal()
    public declare readonly rotation: SimpleSignal<number, this>;

    @initial(135)
    @signal()
    public declare readonly border: SimpleSignal<number, this>;

    @initial(1.2)
    @signal()
    public declare readonly intensity: SimpleSignal<number, this>;
    
    @initial(1.0)
    @signal()
    public declare readonly alpha: SimpleSignal<number, this>;

    @initial(1.0)
    @signal()
    public declare readonly icon_alpha: SimpleSignal<number, this>;

    @initial(25.0)
    @signal()
    public declare readonly reach: SimpleSignal<number, this>;

    @initial(new Color("#823"))
    @colorSignal()
    public declare readonly glow: ColorSignal<this>;

    public icon_ref: Reference<Icon>;

    public constructor(props?: NeonIconProps) {
        super({
            ...props,
        });

        this.icon_ref = createRef<Icon>();
        
        this.add(<>
            <Icon
                fontFamily={"Inconsolata"}
                icon={() => this.icon()}
                color={() => this.glow().alpha(this.icon_alpha()).darken(0.5)}
                size={() => this.size()}
                filters={[blur(10.5),brightness(4)]}
                y={7.5}
            />
            <Icon
                fontFamily={"Inconsolata"}
                icon={() => this.icon()}
                color={() => this.glow().alpha(this.icon_alpha()).darken(0.5)}
                size={() => this.size()}
                filters={[blur(3.5),brightness(2)]}
                y={7.5}
            />
            <Icon
                fontFamily={"Inconsolata"}
                icon={() => this.icon()}
                color={() => this.glow().alpha(this.icon_alpha()).darken(0.5)}
                size={() => this.size()}
                y={7.5}
            />
        </>);
        this.add(<>
            <Icon
                fontFamily={"Inconsolata"}
                icon={() => this.icon()}
                color={() => this.glow().alpha(this.icon_alpha())}
                size={() => this.size()}
                filters={[blur(10.5),brightness(4)]}
            />
            <Icon
                fontFamily={"Inconsolata"}
                icon={() => this.icon()}
                color={() => this.glow().alpha(this.icon_alpha()).brighten(1)}
                size={() => this.size()}
                filters={[blur(3.5),brightness(2)]}
            />
            <Icon
                ref={this.icon_ref}
                fontFamily={"Inconsolata"}
                icon={() => this.icon()}
                color={() => this.glow().alpha(this.icon_alpha()).brighten(2)}
                size={() => this.size()}
            />
        </>);
    }

    public* flicker_in(groups: number = 2) {
        const random = useRandom();
        let c = random.nextFloat(0.1, 0.2);
        yield* all(
            this.icon_alpha(1.00, c),
            this.alpha(1.00, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
        let shift = 0; let final = 0;
        for (let i = 0; i < groups; i++) {
            for (let j = 0; j < random.nextInt(2, 6-final); j++) {
                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.icon_alpha(0.35, c),
                    this.alpha(0.05, c),
                );
                yield* this.reach(19.0, c/2);
                yield* waitFor(random.nextFloat(0.01, 0.02));

                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.icon_alpha(1.0, c),
                    this.alpha(1.0, c),
                );
                yield* this.reach(25.0, c/2);
                yield* waitFor(random.nextFloat(0.01+(shift/3), 0.02+(shift/3)));
            }
            
            yield* waitFor(random.nextFloat(shift+0.3, shift+0.4));
            shift += 0.2;
            final += 2;
        }
        c = random.nextFloat(0.01, 0.02);
        yield* all(
            this.alpha(1.0, c),
            this.icon_alpha(1.0, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
    }

    public* flicker_out(groups: number = 2) {
        const random = useRandom();
        let c = random.nextFloat(0.1, 0.2);
        yield* all(
            this.icon_alpha(0.00, c),
            this.alpha(0.00, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
        let shift = 0; let final = 0;
        for (let i = 0; i < groups; i++) {
            for (let j = 0; j < random.nextInt(2, 6-final); j++) {
                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.icon_alpha(0.65, c),
                    this.alpha(0.95, c),
                );
                yield* this.reach(25.0, c/2);
                yield* waitFor(random.nextFloat(0.01, 0.02));

                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.icon_alpha(0.0, c),
                    this.alpha(0.0, c),
                );
                yield* this.reach(19.0, c/2);
                yield* waitFor(random.nextFloat(0.01+(shift/3), 0.02+(shift/3)));
            }
            
            yield* waitFor(random.nextFloat(shift+0.3, shift+0.4));
            shift += 0.2;
            final += 2;
        }
        c = random.nextFloat(0.01, 0.02);
        yield* all(
            this.alpha(0.0, c),
            this.icon_alpha(0.0, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
    }
}





export interface NeonCodeProps extends NodeProps {
    code: SignalValue<PossibleCodeScope>;
    size?: SignalValue<number>;
    alpha?: SignalValue<number>;
    glow?: SignalValue<Color>;
}


export class NeonCode extends Node {
    @initial(CODE``)
    @codeSignal()
    public declare readonly code: CodeSignal<this>;

    @initial(48)
    @signal()
    public declare readonly size: SimpleSignal<number, this>;

    @initial(1.0)
    @signal()
    public declare readonly alpha: SimpleSignal<number, this>;

    @initial(new Color("#fff"))
    @colorSignal()
    public declare readonly glow: ColorSignal<this>;

    public code_ref: Reference<Code>;
    public code_ref_b1: Reference<Code>;
    public code_ref_b2: Reference<Code>;

    public constructor(props?: NeonCodeProps) {
        super({
            ...props,
        });
        
        this.code_ref = createRef<Code>();
        this.code_ref_b1 = createRef<Code>();
        this.code_ref_b2 = createRef<Code>();
        
        this.add(<>
            <Code
                ref={this.code_ref_b2}
                code={() => this.code()}
                fontSize={() => this.size()}
                opacity={() => this.alpha()}
                filters={[blur(2.5),brightness(2)]}
            />
            <Code
                ref={this.code_ref_b1}
                code={() => this.code()}
                opacity={() => this.alpha()}
                fontSize={() => this.size()}
                filters={[blur(1.5),brightness(1)]}
            />
            <Code
                ref={this.code_ref}
                code={() => this.code()}
                opacity={() => this.alpha()}
                fontSize={() => this.size()}
            />
        </>);
    }

    public* flicker_in(groups: number = 2) {
        const random = useRandom();
        let c = random.nextFloat(0.1, 0.2);
        yield* all(
            this.alpha(1.00, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
        let shift = 0; let final = 0;
        for (let i = 0; i < groups; i++) {
            for (let j = 0; j < random.nextInt(2, 6-final); j++) {
                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.alpha(0.05, c),
                );
                yield* waitFor(random.nextFloat(0.01, 0.02));

                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.alpha(1.0, c),
                );
                yield* waitFor(random.nextFloat(0.01+(shift/3), 0.02+(shift/3)));
            }
            
            yield* waitFor(random.nextFloat(shift+0.3, shift+0.4));
            shift += 0.2;
            final += 2;
        }
        c = random.nextFloat(0.01, 0.02);
        yield* all(
            this.alpha(1.0, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
    }

    public* flicker_out(groups: number = 2) {
        const random = useRandom();
        let c = random.nextFloat(0.1, 0.2);
        yield* all(
            this.alpha(0.00, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
        let shift = 0; let final = 0;
        for (let i = 0; i < groups; i++) {
            for (let j = 0; j < random.nextInt(2, 6-final); j++) {
                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.alpha(0.95, c),
                );
                yield* waitFor(random.nextFloat(0.01, 0.02));

                c = random.nextFloat(0.02, 0.04);
                yield* all(
                    this.alpha(0.0, c),
                );
                yield* waitFor(random.nextFloat(0.01+(shift/3), 0.02+(shift/3)));
            }
            
            yield* waitFor(random.nextFloat(shift+0.3, shift+0.4));
            shift += 0.2;
            final += 2;
        }
        c = random.nextFloat(0.01, 0.02);
        yield* all(
            this.alpha(0.0, c),
        );
        yield* waitFor(random.nextFloat(0.01, 0.02));
    }

    public* selection(selection: typeof DEFAULT | SignalValue<PossibleCodeSelection>, duration: number = 0.5) {
        yield* all(
            this.code_ref().selection(selection, duration),
            this.code_ref_b1().selection(selection, duration),
            this.code_ref_b2().selection(selection, duration),
        );
    }
}


