import { Icon, Layout, LayoutProps, Txt, initial, signal } from "@motion-canvas/2d";
import { ColorSignal, PossibleColor, Reference, SignalValue, SimpleSignal } from "@motion-canvas/core";
import { softgreen, softyellow } from "../utils/colors";

export interface IconTextProps extends LayoutProps {
    icon?: SignalValue<string>;
    text?: SignalValue<string>;
    color?: SignalValue<PossibleColor>;
}

export class IconText extends Layout {
    @initial("material-symbols:do-not-disturb-on-outline")
    @signal()
    public declare readonly icon: SimpleSignal<string, this>;

    @initial("Foo")
    @signal()
    public declare readonly text: SimpleSignal<string, this>;

    @initial(softyellow)
    @signal()
    public declare readonly color: ColorSignal<this>;

    public iconref: Reference<Icon>;
    public textref: Reference<Txt>;

    public constructor(props?: IconTextProps) {
        super({
            direction: "row",
            layout: true,
            columnGap: 50,
            ...props,
        });
        this.add(
            <Icon
                ref={this.iconref}
                size={() => [this.fontSize()*1.5, this.fontSize()*1.5]}
                color={() => this.color()}
                icon={props.icon}
            />
        );
        this.add(
            <Txt
                ref={this.textref}
                fontFamily={"Cascadia Code"}
                fontStyle={"thin"}
                fill={() => this.color()}
                text={() => this.text()}
            />
        );
    }
}
