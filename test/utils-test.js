var assert = require('assert');

var des = require('../');
var utils = des.utils;

describe('utils', function() {
  describe('IP', function() {
    it('should permute properly', function() {
      var out = new Array(2);
      var inp = [
        parseInt('00000001_00100011_01000101_01100111'.replace(/_/g, ''), 2),
        parseInt('10001001_10101011_11001101_11101111'.replace(/_/g, ''), 2)
      ];

      utils.ip(out, inp[0], inp[1]);

      var expected = [
        parseInt('11001100_00000000_11001100_11111111'.replace(/_/g, ''), 2),
        parseInt('11110000_10101010_11110000_10101010'.replace(/_/g, ''), 2)
      ];

      assert.deepEqual(out, expected);
    });

    it('should rev-permute properly', function() {
      var out = new Array(2);
      var inp = [
        parseInt('11001100_00000000_11001100_11111111'.replace(/_/g, ''), 2),
        parseInt('11110000_10101010_11110000_10101010'.replace(/_/g, ''), 2)
      ];

      utils.rip(out, inp[0], inp[1]);

      var expected = [
        parseInt('00000001_00100011_01000101_01100111'.replace(/_/g, ''), 2),
        parseInt('10001001_10101011_11001101_11101111'.replace(/_/g, ''), 2)
      ];

      assert.deepEqual(out, expected);
    });
  });
});
