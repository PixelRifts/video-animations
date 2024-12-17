import { Img, Line, NodeProps, Shape, ShapeProps, signal } from "@motion-canvas/2d";
import { SignalValue, SimpleSignal, Vector2 } from "@motion-canvas/core";

import * as THREE from "three"

export interface ProjectedShapeProps extends ShapeProps {
    points?: SignalValue<SignalValue<THREE.Vector3>[]>;
    camera?: THREE.Camera;
}

export class ProjectedShape extends Shape {
    @signal()
    public declare readonly points: SimpleSignal<SignalValue<THREE.Vector3>[], this>;

    public constructor(props: ProjectedShapeProps) {
        super(props);

        this.add(<>
            <Line
                closed
                fill={"#123123"}
                lineWidth={7}
                stroke={"#FFFFFF"}
                points={() => this.points().map(p => typeof p == 'function' ?
                    project(p(), props.camera) :
                    project(p, props.camera))}
            />
        </>);
    }
}

function project(v: THREE.Vector3, cam: THREE.Camera): Vector2 {
    const t = new THREE.Vector3(v.x, v.y, v.z).applyMatrix4(cam.projectionMatrix);
    return new Vector2(t.x / t.z, t.y / t.z);
}