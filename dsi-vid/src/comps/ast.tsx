import { Gradient, NodeProps, colorSignal, initial, signal, Node, Layout, Circle, CircleProps, Txt, Line } from "@motion-canvas/2d";
import { Color, ColorSignal, Origin, PossibleColor, PossibleVector2, Promisable, Reference, SignalValue, SimpleSignal, SimpleVector2Signal, ThreadGenerator, Vector2Signal, all, cancel, chain, createRef, createSignal, debug, easeInBack, easeOutBack, easeOutElastic, join, linear, loop, range, sequence, waitFor } from "@motion-canvas/core";
import { softpurple, softyellow } from "../utils/colors";
import { exec_after } from "../animations/misc";

export type StringTree = string | [ string, StringTree[] ];

export interface ASTProps extends NodeProps {
    node_contents: SignalValue<StringTree>;
    node_size?: SignalValue<number>;
    node_thickness?: SignalValue<number>;
    y_layer_increment?: SignalValue<number>;
    x_dist_scalar?: SignalValue<number>;

    inactive_accent?: SignalValue<PossibleColor>;
    accent?: SignalValue<PossibleColor>;
    angle?: SignalValue<number>;
    startpicker?: SignalValue<number>;
    endpicker?: SignalValue<number>;
    line_inactive_start?: SignalValue<number>;
    line_inactive_end?: SignalValue<number>;
}

export class AST extends Node {
    @initial("0")
    @signal()
    public declare readonly node_contents: SimpleSignal<StringTree, this>;

    @initial(50)
    @signal()
    public declare readonly node_size: SimpleSignal<number, this>;

    @initial(15)
    @signal()
    public declare readonly node_thickness: SimpleSignal<number, this>;

    @initial(75)
    @signal()
    public declare readonly y_layer_increment: SimpleSignal<number, this>;

    @initial(2)
    @signal()
    public declare readonly x_dist_scalar: SimpleSignal<number, this>;

    @initial(Color.lerp(softpurple, "#000000", 0.65))
    @colorSignal()
    public declare readonly inactive_accent: ColorSignal<this>;
    
    @initial(softpurple)
    @colorSignal()
    public declare readonly accent: ColorSignal<this>;

    @initial(0)
    @signal()
    public declare readonly angle: SimpleSignal<number, this>;

    @initial(0)
    @signal()
    public declare readonly startpicker: SimpleSignal<number, this>;

    @initial(0)
    @signal()
    public declare readonly endpicker: SimpleSignal<number, this>;

    @initial(0)
    @signal()
    public declare readonly line_inactive_start: SimpleSignal<number, this>;

    @initial(1)
    @signal()
    public declare readonly line_inactive_end: SimpleSignal<number, this>;

    public node: Reference<ASTNode>;
    public to_subtree_lines: Reference<Line>[] = [];
    public subtrees: Reference<AST>[] = [];

    private angle_rotator: ThreadGenerator = null;
    private closed = true;

    public constructor(props?: ASTProps) {
        super({
            cache: true,
            ...props,
        });
        this.closed = true;
        
        const nodecontentlist = typeof props.node_contents === "function" ? props.node_contents() : props.node_contents;
        const mycontent = typeof nodecontentlist === "string" ? () => nodecontentlist : () => nodecontentlist[0];

        this.node = createRef<ASTNode>();
        if (typeof nodecontentlist !== "string") {
            let i = 0;
            const halfcount = (nodecontentlist[1].length / 2);
            for (const s in nodecontentlist[1]) {
                this.subtrees[i] = createRef<AST>();
                this.to_subtree_lines[i] = createRef<Line>();
                const constthisidx = i;
                this.add(
                    <Line
                        ref={this.to_subtree_lines[i]}
                        points={() => [ [0, 0], [ (constthisidx - halfcount + 0.5) * this.node_size() * this.x_dist_scalar(), this.y_layer_increment() ] ]}
                        lineWidth={12}
                        end={0}
                        stroke={() => new Gradient({
                            from: [0, 0],
                            to: [ (constthisidx - halfcount + 0.5) * this.node_size() * this.x_dist_scalar(), this.y_layer_increment() ],
                            stops: [
                                { offset: 0, color: this.accent() },
                                { offset: this.line_inactive_start(), color: this.accent() },
                                { offset: this.line_inactive_start(), color: this.inactive_accent() },
                                { offset: this.line_inactive_end(), color: this.inactive_accent() },
                                { offset: this.line_inactive_end(), color: this.accent() },
                                { offset: 1, color: this.accent() },
                            ]
                        })}
                    />
                );
                this.add(
                    <AST
                        ref={this.subtrees[i]}
                        x={() => (constthisidx - halfcount + 0.5) * this.node_size() * this.x_dist_scalar()}
                        y={() => this.y_layer_increment()}
                        y_layer_increment={() => this.y_layer_increment()}
                        node_contents={nodecontentlist[1][s]}
                        node_size={() => this.node_size()}
                        node_thickness={() => this.node_thickness()}
                        inactive_accent={() => this.inactive_accent()}
                        x_dist_scalar={() => this.x_dist_scalar()}
                        accent={() => this.accent()}
                    />
                );
                i++;
            }
        }
        this.add(
            <ASTNode
                ref={this.node}
                x={0} y={0}
                node_size={() => this.node_size()}
                content={mycontent}
                lineWidth={() => this.node_thickness()}
                stroke={() => new Gradient({
                    type: "conic",
                    angle: this.angle(),
                    stops: [
                        { offset: 0, color: Color.lerp(this.inactive_accent(), this.accent(), this.startpicker()) },
                        { offset: 1, color: Color.lerp(this.inactive_accent(), this.accent(), this.endpicker()) },
                    ]
                })}
            />
        );

    }

    public* working(yee: boolean) {
        if (yee) {
            yield all(this.endpicker(0, 0.5), this.startpicker(1, 0.5));
            this.angle_rotator = yield loop(Infinity, () => this.angle(this.angle() - 360, 35, linear));
        } else {
            yield exec_after(0.5, () => {
                cancel(this.angle_rotator);
                this.angle_rotator = null;
            });
            yield all(this.endpicker(0, 0.5), this.startpicker(0, 0.5));
        }
    }
    
    public* working_entire_subtree(yee: boolean): ThreadGenerator {
        if (yee) {
            yield all(this.endpicker(0, 0.5), this.startpicker(1, 0.5));
            this.angle_rotator = yield loop(Infinity, () => this.angle(this.angle() - 360, 35, linear));
            yield* all(...this.to_subtree_lines.map(r => r().stroke(() => this.accent(), 0.5)));
        } else {
            yield exec_after(0.5, () => {
                cancel(this.angle_rotator);
                this.angle_rotator = null;
            });
            yield all(this.endpicker(0, 0.5), this.startpicker(0, 0.5));
            yield* all(...this.to_subtree_lines.map(r => r().stroke(() => this.inactive_accent(), 0.5)));
        }
        for (let i = 0; i < this.subtrees.length; i++)
            yield* this.subtrees[i]().working_entire_subtree(yee);
    }
    
    public* flash() {
        yield* all(this.endpicker(1, 0.5), this.startpicker(1, 0.5));
        yield* all(this.endpicker(0, 0.5), this.startpicker(0, 0.5));
    }

    public* select(yee: boolean) {
        if (this.angle_rotator != null) {
            cancel(this.angle_rotator);
            this.angle_rotator = null;
        }
        if (yee)
            yield* all(this.endpicker(1, 0.5), this.startpicker(1, 0.5));
        else
            yield* all(this.endpicker(0, 0.5), this.startpicker(0, 0.5));
    }

    public* select_entire_subtree(yee: boolean): ThreadGenerator {
        if (this.angle_rotator != null) {
            cancel(this.angle_rotator);
            this.angle_rotator = null;
        }
        if (yee) {
            yield* all(this.endpicker(1, 0.5), this.startpicker(1, 0.5));
            yield* all(...this.to_subtree_lines.map(r => r().stroke(() => this.accent(), 0.5)));
        } else {
            yield* all(this.endpicker(0, 0.5), this.startpicker(0, 0.5));
            yield* all(...this.to_subtree_lines.map(r => r().stroke(() => this.inactive_accent(), 0.5)));
        }
        for (let i = 0; i < this.subtrees.length; i++)
            yield* this.subtrees[i]().select_entire_subtree(yee);
    }

    public* open(instant = false): ThreadGenerator {
        if (!this.closed) return;
        this.closed = false;
        if (!instant) {
            yield* this.node().open();
            for (let i = 0; i < this.subtrees.length; i++) {
                if (this.subtrees[i]().closed) {
                    yield* this.to_subtree_lines[i]().end(1, 0.15);
                    yield* this.subtrees[i]().open();
                }
            }
        } else {
            yield* this.node().open(true);
            for (let i = 0; i < this.subtrees.length; i++) {
                yield* this.to_subtree_lines[i]().end(1, 0);
                yield* this.subtrees[i]().open(true);
            }
        }
    }

    public* close(): ThreadGenerator {
        if (this.closed) return;
        this.closed = true;
        for (let i = 0; i < this.subtrees.length; i++) {
            if (!this.subtrees[i]().closed) {
                yield* this.subtrees[i]().close();
                yield* this.to_subtree_lines[i]().end(0, 0.15);
            }
        }
        yield* this.node().close();
    }

    public* close_but_not_this(): ThreadGenerator {
        if (this.closed) return;
        for (let i = 0; i < this.subtrees.length; i++) {
            if (!this.subtrees[i]().closed) {
                yield* this.subtrees[i]().close();
                yield* this.to_subtree_lines[i]().end(0, 0.15);
            }
        }
    }

    public cancelallrotators() {
        if (this.angle_rotator != null) {
            cancel(this.angle_rotator);
            this.angle_rotator = null;
        }
        for (let i = 0; i < this.subtrees.length; i++)
            this.subtrees[i]().cancelallrotators();
    }

    
    public* change(new_tree_content: SignalValue<StringTree>) {
        // yield* this.close();
        this.removeChildren();
        this.closed = true;
        const nodecontentlist = typeof new_tree_content === "function" ? new_tree_content() : new_tree_content;
        const mycontent = typeof nodecontentlist === "string" ? () => nodecontentlist : () => nodecontentlist[0];

        this.node = createRef<ASTNode>();
        if (typeof nodecontentlist !== "string") {
            let i = 0;
            const halfcount = (nodecontentlist[1].length / 2);
            for (const s in nodecontentlist[1]) {
                this.subtrees[i] = createRef<AST>();
                this.to_subtree_lines[i] = createRef<Line>();
                const constthisidx = i;
                this.add(
                    <Line
                        ref={this.to_subtree_lines[i]}
                        points={() => [ [0, 0], [ (constthisidx - halfcount + 0.5) * this.node_size() * this.x_dist_scalar(), this.y_layer_increment() ] ]}
                        lineWidth={12}
                        end={0}
                        stroke={() => new Gradient({
                            from: [0, 0],
                            to: [ (constthisidx - halfcount + 0.5) * this.node_size() * this.x_dist_scalar(), this.y_layer_increment() ],
                            stops: [
                                { offset: 0, color: this.accent() },
                                { offset: this.line_inactive_start(), color: this.accent() },
                                { offset: this.line_inactive_start(), color: this.inactive_accent() },
                                { offset: this.line_inactive_end(), color: this.inactive_accent() },
                                { offset: this.line_inactive_end(), color: this.accent() },
                                { offset: 1, color: this.accent() },
                            ]
                        })}
                    />
                );
                this.add(
                    <AST
                        ref={this.subtrees[i]}
                        x={() => (constthisidx - halfcount + 0.5) * this.node_size() * this.x_dist_scalar()}
                        y={() => this.y_layer_increment()}
                        y_layer_increment={() => this.y_layer_increment()}
                        node_contents={nodecontentlist[1][s]}
                        node_size={() => this.node_size()}
                        node_thickness={() => this.node_thickness()}
                        inactive_accent={() => this.inactive_accent()}
                        x_dist_scalar={() => this.x_dist_scalar()}
                        accent={() => this.accent()}
                    />
                );
                i++;
            }
        }
        this.add(
            <ASTNode
                ref={this.node}
                x={0} y={0}
                node_size={() => this.node_size()}
                content={mycontent}
                lineWidth={() => this.node_thickness()}
                stroke={() => new Gradient({
                    type: "conic",
                    angle: this.angle(),
                    stops: [
                        { offset: 0, color: Color.lerp(this.inactive_accent(), this.accent(), this.startpicker()) },
                        { offset: 1, color: Color.lerp(this.inactive_accent(), this.accent(), this.endpicker()) },
                    ]
                })}
            />
        );
    }
}



export interface ASTNodeProps extends CircleProps {
    node_size: SignalValue<number>;
    content: SignalValue<string>;
}

export class ASTNode extends Circle {
    @initial(30)
    @signal()
    public declare readonly node_size: SimpleSignal<number>;

    @initial("0")
    @signal()
    public declare readonly content: SimpleSignal<string>;

    private text_ref: Reference<Txt> = createRef<Txt>();

    public constructor(props?: ASTNodeProps) {
        super({
            width: 0,
            height: 0,
            fill: "#222222",
            strokeFirst: true,
            ...props,
        });

        this.add(
            <Txt
                ref={this.text_ref}
                fontFamily={"Fira Code"} fontSize={60}
                text={() => this.content()}
                opacity={0}
                fill={"white"}
            />
        )
    }

    public* open(instant = false) {
        if (!instant) {
            yield* all(
                this.text_ref().opacity(1, 0.15),
                this.width(() => this.node_size(), 0.15, easeOutBack),
                this.height(() => this.node_size(), 0.15, easeOutBack),
            );
        } else {
            yield* all(
                this.text_ref().opacity(1, 0),
                this.width(() => this.node_size(), 0, easeOutBack),
                this.height(() => this.node_size(), 0, easeOutBack),
            );
        }
    }
    public* close() {
        yield* all(
            this.width(0, 0.15, easeInBack),
            this.height(0, 0.15, easeInBack),
            this.text_ref().opacity(0, 0.15),
        );
    }
}