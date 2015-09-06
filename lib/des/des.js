'use strict';

var inherits = require('inherits');

var des = require('../des');
var utils = des.utils;
var Cipher = des.Cipher;

function DESState() {
  this._tmp = new Array(2);
  this.keys = null;
}

function DES(key) {
  Cipher.call(this);

  var state = new DESState();
  this._desState = state;

  this.deriveKeys(state, key);
}
inherits(DES, Cipher);
module.exports = DES;

DES.create = function create(key) {
  return new DES(key);
};

var shiftTable = [
  1, 1, 2, 2, 2, 2, 2, 2,
  1, 2, 2, 2, 2, 2, 2, 1
];

DES.prototype.deriveKeys = function deriveKeys(state, key) {
  state.keys = new Array(16 * 2);

  var kL = utils.readUInt32BE(key, 0);
  var kR = utils.readUInt32BE(key, 4);

  utils.pc1(kL, kR, state._tmp, 0);
  kL = state._tmp[0];
  kR = state._tmp[1];
  for (var i = 0; i < state.keys.length; i += 2) {
    var shift = shiftTable[i >>> 1];
    kL = utils.r28shl(kL, shift);
    kR = utils.r28shl(kR, shift);
    utils.pc2(kL, kR, state.keys, i);
  }
};

DES.prototype._update = function _update(inp, inOff, out, outOff) {
  var state = this._desState;

  var l = utils.readUInt32BE(inp, inOff);
  var r = utils.readUInt32BE(inp, inOff + 4);

  // Initial Permutation
  utils.ip(l, r, state._tmp, 0);
  l = state._tmp[0];
  r = state._tmp[1];

  for (var i = 0; i < state.keys.length; i += 2) {
    var keyL = state.keys[i];
    var keyR = state.keys[i + 1];

    var t = r;
    r = l ^ utils.f(r, keyL, keyR);
    l = t;
  }

  // Reverse Initial Permutation
  utils.rip(l, r, state._tmp, 0);
  l = state._tmp[0];
  r = state._tmp[1];

  utils.writeUInt32BE(out, l, outOff);
  utils.writeUInt32BE(out, r, outOff + 4);
};
