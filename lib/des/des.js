'use strict';

var inherits = require('inherits');

var des = require('../des');
var Cipher = des.Cipher;

function DES(key) {
  Cipher.call(this);

  this.key = key;
  this._tmp = new Buffer(this.blockSize);
}
inherits(DES, Cipher);
module.exports = DES;

DES.prototype._update = function _update(data, offset) {
  ip(this._tmp, data, offset);
};
