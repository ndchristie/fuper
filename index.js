
class Fuper {
  constructor({
    // timing and tracking
    accMS = 0,
    fixedMS = 10,
    timeScale = 1,
    // variable count per raf
    fixedCB = () => { /* do nothing */ },
    fixedCount = 0,
    fixedClock = 0,
    // exactly once per raf
    frameCB = () => { /* do nothing */ },
    frameCount = 0,
    frameClock = 0,
  } = {}) {
    ['requestAnimationFrame', 'cancelAnimationFrame'].forEach((req) => {
      if (!{}.hasOwnProperty.call(global, req)) {
        throw new TypeError(`Fuper requires a ${req} polyfill in this environment`);
      }
    });
    // enumerables
    Object.assign(this, {
      accMS,
      fixedMS,
      timeScale,
      fixedCount,
      fixedClock,
      frameCount,
      frameClock,
    });
    // non-enumerables
    Object.defineProperties(this, {
      fixedCB: {
        value: fixedCB,
        writable: true,
      },
      frameCB: {
        value: frameCB,
        writable: true,
      },
      rafId: {
        value: null,
        writable: true,
      },
    });
  }

  get alpha() { return this.accMS / this.fixedMS; }

  play(fromTime) {
    this.pause(); // prevents doubling-up
    this.$rafId = requestAnimationFrame((now) => {
      // calculate time to process
      let frameMS = Number.isNaN(+fromTime) ? 0 : (now - fromTime) * this.timeScale;
      if (frameMS > 250) frameMS = 250; // cap
      this.accMS += frameMS;
      this.frameClock += frameMS;

      // do fixed steps
      while (this.accMS >= this.fixedMS) {
        this.fixedClock += this.fixedMS;
        this.accMS -= this.fixedMS;
        this.fixedCB();
        this.fixedCount++;
      }

      // do frame step
      this.frameCB();
      this.frameCount++;

      // loop
      this.$rafId = null;
      this.play(now);
    });
  }

  pause() {
    cancelAnimationFrame(this.$rafId);
    this.$rafId = null;
  }
}

module.exports = Fuper;
