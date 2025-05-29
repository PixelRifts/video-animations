import { makeScene2D } from '@motion-canvas/2d';
import { createRef, sequence, waitFor, waitUntil } from '@motion-canvas/core';
import { CircuitBlock } from '../components/circuits';

export default makeScene2D(function* (view) {
  const tec = createRef<CircuitBlock>();
  const toc = createRef<CircuitBlock>();

  view.add(<>
    <CircuitBlock
      ref={tec} x={-400}
      initial_text={"BEEP"}
      fontSize={100}
    />
    <CircuitBlock
      ref={toc} x={400}
      initial_text={"BOOP"}
      fontSize={100}
    />
  </>);
  yield* waitFor(1);
  yield* sequence(0.2,
    tec().bounce_reveal(view, [400, 200]),
    toc().bounce_reveal(view, [400, 200]),
  );
  yield* waitUntil("end");
});
