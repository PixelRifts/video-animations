import { Code, Gradient, Node } from "@motion-canvas/2d";
import { Layout, Line, Rect, Shape } from "@motion-canvas/2d/lib/components";
import { CodeBlock, insert } from "@motion-canvas/2d/lib/components/CodeBlock";
import { InterpolationFunction, Signal, SignalValue, SimpleSignal, ThreadGenerator, createComputed, createSignal, easeInOutQuint, usePlayback, useThread } from "@motion-canvas/core";
import { all, waitFor } from "@motion-canvas/core/lib/flow";
import { BBox, PossibleBBox, PossibleColor, PossibleVector2 } from "@motion-canvas/core/lib/types";
import { NeonCode, NeonText } from "../neon/neon_items";

export function* append(code: CodeBlock, word: string, duration: number) {
    const for_one = duration / word.length;
    for (const letter of word) {
        yield* code.edit(for_one, false)`${code.code()}${insert(letter)}`;
    }
}

export function* append_to_code(str: NeonCode, word: string, duration: number) {
    const for_one = duration / word.length;
    for (const letter of word) {
        yield* str.code(str.code().fragments + letter, for_one);
    }
}

export function* append_to_str(str: NeonText, word: string, duration: number) {
    const for_one = duration / word.length;
    for (const letter of word) {
        yield* str.txt(str.txt() + letter, for_one);
    }
}

export function* flash(item: Signal<any, any, any, any>, size: any, duration: number) {
    const oldsize = item();
    yield* item(size, duration/3);
    yield* waitFor(duration/3);
    yield* item(oldsize, duration/3);
}

export function* flashend(item: Signal<any, any, any, any>, val: any, endval: any, duration: number) {
    yield* item(val, duration/3);
    yield* waitFor(duration/3);
    yield* item(endval, duration/3);
}

export function* shiftx(item: Node, dist: number, duration: number, fn: InterpolationFunction<number, any[]> = easeInOutQuint) {
    yield* item.position.x(item.position.x() + dist, duration);
}

export function* shifty(item: Node, dist: number, duration: number, fn: InterpolationFunction<number, any[]> = easeInOutQuint) {
    yield* item.position.y(item.position.y() + dist, duration);
}

export function* shiftx_all(dist: number, duration: number, ...items: Node[]) {
    yield* all(
        ...items.map(item => item.position.x(item.position.x() + dist, duration)),
    );
}
export function* shifty_all(dist: number, duration: number, ...items: Node[]) {
    yield* all(
        ...items.map(item => item.position.y(item.position.y() + dist, duration)),
    );
}

type Procedure = () => void;

export function* exec_after(
    seconds = 0,
    after: Procedure,
  ): ThreadGenerator {
  const thread = useThread();
  const step = usePlayback().framesToSeconds(1);

  const targetTime = thread.time() + seconds;
  while (targetTime - step > thread.fixed) yield;
  thread.time(targetTime);

  after();
}

export function code_get_token(code: Code, txt: string, occurrence: number = 0) {
  return createSignal(() => {
    const range = code.findAllRanges(txt);
    const bboxes = code.getSelectionBBox(range);
    return bboxes[occurrence];
  });
}