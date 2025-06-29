import { Circle, initial, Layout, Line, LineProps, Node, Rect, RectProps, signal, Txt, vector2Signal, View2D } from "@motion-canvas/2d";
import { all, chain, createEaseOutBack, createRef, createRefArray, debug, easeInOutQuad, easeInQuad, easeOutBack, easeOutBounce, easeOutQuad, easeOutSine, linear, PossibleVector2, Random, range, Reference, sequence, SignalValue, SimpleSignal, SimpleVector2Signal, useRandom, Vector2, Vector2Signal, waitFor } from "@motion-canvas/core";
import { random_rect_point_and_dir, seagreen, seagreen_light, seagreen_shaded, SqText, star_coords, write } from "./defaults";

export const CircuitBus = (props: LineProps & {
    bus_ref: Reference<Layout>,
    width: SimpleSignal<number>, height: SimpleSignal<number>,
}) => 
    <Layout ref={props.bus_ref} gap={0} direction={"column"}>
        <Line {...props}/>
        <Rect size={() => [props.width(), props.height()]}/>
        <Line {...props}/>
    </Layout>

export interface CircuitBlockProps extends RectProps {
    initial_text?: SignalValue<string>;
}

export class CircuitBlock extends Rect {
    @initial("TEMP")
    @signal()
    public declare readonly initial_text: SimpleSignal<string, this>;

    public readonly label: Reference<Txt> = createRef<Txt>();
    public readonly rand: Random;

    public constructor(props?: CircuitBlockProps) {
        super({
            lineWidth: 15,
            fill: seagreen_light,
            stroke: seagreen,
            radius: 5,
            textWrap: true,

            shadowOffsetY: 10,
            shadowColor: seagreen_shaded,
            smoothCorners: true,
            ...props
        });
        this.add(<>
            <SqText
                ref={this.label}
                text={""}
                maxWidth={() => this.width()}
                maxHeight={() => this.height()}
                fontSize={() => this.fontSize()}
                fill={seagreen}
                shadowColor={"#0000"}
                shadowOffset={0}
                shadowBlur={0}
            />
        </>);
        this.rand = useRandom();
    }

    public* bounce_reveal(par: Node, size: [number, number], shift = 20, time = 0.5, particles = 10) {
        const randoms: [Vector2, Vector2][] = [];
        const rand_params: [number, number, number, number][] = [];
        range(particles).map(i => {
            randoms[i] = random_rect_point_and_dir(size[0], size[1], this.rand);
            rand_params[i] = [
                this.rand.nextFloat(-360, 360), // rotation
                this.rand.nextFloat(20, 100),   // offset
                this.rand.nextFloat(0.4, 0.9),  // opacity
                this.rand.nextFloat(1, 5),      // scale
            ];
        });
        yield* all(
            this.size(size, time, createEaseOutBack(2.2)),
            this.y(this.y() - shift, time*0.5, easeInOutQuad)
                .to(this.y() + shift, time*0.5, easeInQuad),
            chain(waitFor(0.1, write(this.label(), this.initial_text(), time)))
        );

        const star_refs = createRefArray<Line>();
        par.add(<>
            {...randoms.map((r, i) =>
                <Line
                    ref={star_refs}
                    fill={seagreen} closed
                    radius={3}
                    scale={rand_params[i][3]} zIndex={-1}
                    points={star_coords}
                    position={() => this.position().add(r[0])}
                    opacity={0}
                />
            )}
        </>);

        yield* chain(
            all( 
                ...star_refs.map((r, i) => all(
                    r.opacity(rand_params[i][2], 0).wait(0.4).to(0, 0.3),
                    r.rotation(rand_params[i][0], 0.8, linear),
                    r.position(r.position().add(randoms[i][1].scale(rand_params[i][1])), 0.1, easeOutSine)
                )),
            )
        );
        star_refs.map(v => v.remove());
    }
}

