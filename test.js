/* eslint-env node, mocha */
/* eslint-disable no-console */

const assert = require('assert');
const sinon = require('sinon');
const Fuper = require('./index');
const { replaceRaf } = require('raf-stub');

replaceRaf();
const rafStub = global.requestAnimationFrame;

describe('Fuper', () => {
  let fuper;
  let frameCB;
  let fixedCB;
  const idealFrameDuration = 1000 / 60;

  beforeEach(() => {
    fuper = new Fuper();
    frameCB = sinon.spy(fuper, 'frameCB');
    fixedCB = sinon.spy(fuper, 'fixedCB');
  });

  afterEach(() => {
    fuper.pause(); // kill runaway requestAnimationFrame(s)
    frameCB.restore();
    fixedCB.restore();
  });

  it('does a frameCB exactly once per animation frame when playing', () => {
    // setup
    const stepsToTake = 17; // arbitrary integer > 1
    // do test
    fuper.play();
    assert(frameCB.notCalled, 'fuper should not frameCB until RAF has played');
    rafStub.step(stepsToTake, idealFrameDuration);
    assert.equal(frameCB.callCount, stepsToTake);
    assert.equal(frameCB.callCount, fuper.frameCount);
  });
  it('does a fixedCB as many times as it can without exceeding the time elapsed', () => {
    // setup
    const idealFixedUpdatesPerFrame = Math.PI; // non-repeating
    const stepsToTake = 17; // arbitrary integer > 1
    const expectedCallCount = Math.floor((stepsToTake - 1) * idealFixedUpdatesPerFrame);
    fuper.fixedMS = idealFrameDuration / idealFixedUpdatesPerFrame;
    // do test
    fuper.play();
    rafStub.step(stepsToTake, idealFrameDuration);
    assert.equal(fixedCB.callCount, expectedCallCount);
    assert.equal(fixedCB.callCount, fuper.fixedCount);
  });
  it('rescales time appropriately', () => {
    fuper = new Fuper({
      fixedMS: idealFrameDuration / 2,
      timeScale: 0.1,
    });

    fuper.play();

    rafStub.step(1001, idealFrameDuration);
    assert.equal(fuper.frameCount, 1001); // unchanged
    assert(Math.abs(fuper.fixedCount - 200) <= 1); // tolerate floating point issues
  });
});
