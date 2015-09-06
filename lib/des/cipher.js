'use strict';

function Cipher() {
  this.blockSize = 8;
  this._init();

  this.buffer = new Array(this.blockSize);
  this.bufferOff = 0;
}
module.exports = Cipher;

Cipher.prototype._init = function _init() {
  // Might be overrided
};

Cipher.prototype.update = function update(data) {
  var off = 0;

  // TODO(indutny): allocate big enough buffer
  var out = [];

  if (this.bufferOff !== 0) {
    // Append data to buffer
    var min = Math.min(this.buffer.length - this.bufferOff, data.length);
    for (var i = 0; i < min; i++)
      this.buffer[i + this.bufferOff] = data[i];
    this.bufferOff += min;

    // Flush
    if (this.bufferOff === this.buffer.length) {
      this.bufferOff = 0;
      this._update(this.buffer, 0, out, out.length);
    }

    // Shift next
    off = min;
  }

  // Write blocks
  var max = data.length - ((data.length - off) % this.blockSize);
  for (; off < max; off += this.blockSize) {
    this._update(data, off, out, out.length);
  }

  // Queue rest
  for (; off < data.length; off++, this.bufferOff++)
    this.buffer[this.bufferOff] = data[off];

  return out;
};

Cipher.prototype._pad = function _pad() {
  while (this.bufferOff < this.buffer.length)
    this.buffer[this.bufferOff++] = 0;
};

Cipher.prototype.final = function final() {
  if (this.bufferOff === 0)
    return [];

  this._pad();

  var out = new Array(this.blockSize);
  this._update(this.buffer, 0, out, 0);
  return out;
};
