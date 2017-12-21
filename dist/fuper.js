(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.fuper = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Fuper = function () {
  function Fuper() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$accMS = _ref.accMS,
        accMS = _ref$accMS === undefined ? 0 : _ref$accMS,
        _ref$fixedMS = _ref.fixedMS,
        fixedMS = _ref$fixedMS === undefined ? 10 : _ref$fixedMS,
        _ref$timeScale = _ref.timeScale,
        timeScale = _ref$timeScale === undefined ? 1 : _ref$timeScale,
        _ref$fixedCB = _ref.fixedCB,
        fixedCB = _ref$fixedCB === undefined ? function () {/* do nothing */} : _ref$fixedCB,
        _ref$fixedCount = _ref.fixedCount,
        fixedCount = _ref$fixedCount === undefined ? 0 : _ref$fixedCount,
        _ref$fixedClock = _ref.fixedClock,
        fixedClock = _ref$fixedClock === undefined ? 0 : _ref$fixedClock,
        _ref$frameCB = _ref.frameCB,
        frameCB = _ref$frameCB === undefined ? function () {/* do nothing */} : _ref$frameCB,
        _ref$frameCount = _ref.frameCount,
        frameCount = _ref$frameCount === undefined ? 0 : _ref$frameCount,
        _ref$frameClock = _ref.frameClock,
        frameClock = _ref$frameClock === undefined ? 0 : _ref$frameClock;

    _classCallCheck(this, Fuper);

    // enumerables
    Object.assign(this, {
      accMS: accMS,
      fixedMS: fixedMS,
      timeScale: timeScale,
      fixedCount: fixedCount,
      fixedClock: fixedClock,
      frameCount: frameCount,
      frameClock: frameClock
    });
    // non-enumerables
    Object.defineProperties(this, {
      fixedCB: {
        value: fixedCB,
        writable: true
      },
      frameCB: {
        value: frameCB,
        writable: true
      },
      rafId: {
        value: null,
        writable: true
      }
    });
  }

  _createClass(Fuper, [{
    key: "play",
    value: function play(fromTime) {
      var _this = this;

      this.pause(); // prevents doubling-up
      this.$rafId = requestAnimationFrame(function (now) {
        // calculate time to process
        var frameMS = Number.isNaN(+fromTime) ? 0 : (now - fromTime) * _this.timeScale;
        if (frameMS > 250) frameMS = 250; // cap
        _this.accMS += frameMS;
        _this.frameClock += frameMS;

        // do fixed steps
        while (_this.accMS >= _this.fixedMS) {
          _this.fixedCB();
          _this.fixedCount++;
          _this.fixedClock += _this.fixedMS;
          _this.accMS -= _this.fixedMS;
        }

        // do frame step
        _this.frameCB();
        _this.frameCount++;

        // loop
        _this.$rafId = null;
        _this.play(now);
      });
    }
  }, {
    key: "pause",
    value: function pause() {
      cancelAnimationFrame(this.$rafId);
      this.$rafId = null;
    }
  }, {
    key: "alpha",
    get: function get() {
      return this.accMS / this.fixedMS;
    }
  }]);

  return Fuper;
}();

module.exports = Fuper;

},{}]},{},[1])(1)
});