'use strict';

var assert = require('minimalistic-assert');
var inherits = require('inherits');

var proto = {};

function PCBCState(iv) {
  assert.equal(iv.length, 8, 'Invalid IV length');

  this.iv = new Array(8);
  for (var i = 0; i < this.iv.length; i++)
    this.iv[i] = iv[i];
}

function instantiate(Base) {
  function PCBC(options) {
    Base.call(this, options);
    this._pcbcInit();
  }
  inherits(PCBC, Base);

  var keys = Object.keys(proto);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    PCBC.prototype[key] = proto[key];
  }

  PCBC.create = function create(options) {
    return new PCBC(options);
  };

  return PCBC;
}

exports.instantiate = instantiate;

proto._pcbcInit = function _pcbcInit() {
  var state = new PCBCState(this.options.iv);
  this._pcbcState = state;
};

proto._update = function _update(inp, inOff, out, outOff) {
  var state = this._pcbcState;
  var superProto = this.constructor.super_.prototype;

  var iv = state.iv;
  if (this.type === 'encrypt') {
    for (var i = 0; i < this.blockSize; i++)
      iv[i] ^= inp[inOff + i];

    superProto._update.call(this, iv, 0, out, outOff);

    for (var i = 0; i < this.blockSize; i++)
      iv[i] = out[outOff + i];
    
    for (var i = 0; i < this.blockSize; i++)
      iv[i] ^= inp[inOff + i];
  } else {
    superProto._update.call(this, inp, inOff, out, outOff);

    for (var i = 0; i < this.blockSize; i++)
      out[outOff + i] ^= iv[i];

    for (var i = 0; i < this.blockSize; i++)
      iv[i] = inp[inOff + i];

    for (var i = 0; i < this.blockSize; i++)
      iv[i] ^= out[outOff + i];
  }
};
