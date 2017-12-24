# Fuper

> Fixed update for JS applications

## Purpose

Fuper provides a fixed update loop, breaking accumulated delta time across requested animation frames into chunks having equal duration.

Fixed upates are commonly used by realtime games and apps, especially those containing procedural animation or physics simulations, to help prevent inconsistencies when computing change over fluid timesteps.

## Install

``` bash
$ npm install --save fuper
```

## Usage

Fuper binds itself to requestAnimationFrame, an asynchronous process supported in all modern browsers.  For older browsers, or other environments which do not support requestAnimationFrame, Fuper requires a polyfill of both requestAnimationFrame and cancelAnimationFrame.

### Basics

```js
const Fuper = require('fuper');

const fuper = new Fuper();
fuper.play();
```

The above code creates a new fuper instances and attaches it to requestAnimationFrame.  It will continuously run fixed updates and frame updates, keeping track of the count and duration of each.

### Playing, Pausing, and Time Scaling

```js
const fuper = new Fuper({
  fixedMS: 10,
  deltaTimeScale: 3,
});

fuper.play();

setTimeout(() => fuper.pause(), 5000);
```

The above code tells a Fuper instance to process 10ms of a second per fixed step, while at 3x real world time.  As a result, the fixed update should run approximately 1500 times, assuming two or more frames have elapsed.

The reason for "two or more" is that the first call to play() does not account for any passage of time, so no fixed updates will run.  If you want to process fixed updates on the first frame, you can pass a startTime, like so:

```js
fuper.play(performance.now());
```

The number of fixed updates will be as many that fit between the start time and the next animation frame.

Keep in mind that doing so may result in fuper processing partial frames; it may be better (and simpler) to wait.

If you are calling play from inside of another requestAnimationFrame callback, the timestamp passed to that callback can be used to ensure a complete frame is processed:

```js
const someOtherRequest = requestAnimationFrame((frameTime) => {
  someOtherCode();

  if (someLogic) {
    fooper.play(frameTime); // will run from the beginning of this frame
  }
});
```

For more on animation frames and timing, see [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

## License

ISC © [N.D.Christie](https://github.com/ndchristie)
