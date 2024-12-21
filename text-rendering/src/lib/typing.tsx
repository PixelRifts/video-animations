import { Gradient, Layout, LayoutProps, NodeProps, Rect, Txt, TxtProps, initial, signal } from "@motion-canvas/2d";
import { palette, soft_gradient } from "./palette";
import { SignalValue, SimpleSignal, ThreadGenerator, cancel, createRef, loop, waitFor } from "@motion-canvas/core";


export interface TypedTextProps extends LayoutProps {

    initial_text?: SignalValue<string>;
    cursor_scale?: SignalValue<number>;
    hidden?: SignalValue<boolean>;
}

export class TypedText extends Layout {
    @initial("Hello World")
    @signal()
    public declare readonly initial_text: SimpleSignal<string, this>;

    @initial(0.5)
    @signal()
    public declare readonly cursor_scale: SimpleSignal<number, this>;

    @initial(false)
    @signal()
    public declare readonly hidden: SimpleSignal<boolean, this>;


    public text = createRef<Txt>();
    public cursor = createRef<Rect>();

    public constructor(props: TypedTextProps) {
        super({
            ...props,
            offsetX: 0,
            layout: true,
        });

        

        this.add(<>
            <Txt
                
                ref={this.text}
                clip
                fontFamily={props.fontFamily}
                text={this.initial_text()}
                fill={palette.text}
                textDirection={props.textDirection}
            />
        </>);

        if (!this.hidden()) this.add(
            <Layout
                width={() => this.fontSize() * this.cursor_scale()}
                direction={"column"}
            >
                <Rect
                    ref={this.cursor}
                    width={() => this.fontSize() * this.cursor_scale()}
                    height={20}
                    y={() => this.fontSize() / 2}
                    fill={() => this.hidden() ? palette.background : palette.text}
                    layout={false}
                />
            </Layout>
        );
    }

    public* type(s: string, time: number = 0.5) {
        let per_unit = time / s.length;
        for (let i = 0; i < s.length; i++) {
            yield* this.text().text(this.text().text() + s[i], 0.0);
            yield* waitFor(per_unit);
        }
    }
}