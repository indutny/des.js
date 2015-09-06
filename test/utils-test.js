'use strict';

var assert = require('assert');

var des = require('../');
var utils = des.utils;

var fixtures = require('./fixtures');
var bin = fixtures.bin;

describe('utils', function() {
  describe('IP', function() {
    it('should permute properly', function() {
      var out = new Array(2);
      var inp = [
        bin('00000001 00100011 01000101 01100111'),
        bin('10001001 10101011 11001101 11101111')
      ];

      utils.ip(inp[0], inp[1], out, 0);

      var expected = [
        bin('11001100 00000000 11001100 11111111'),
        bin('11110000 10101010 11110000 10101010')
      ];

      assert.deepEqual(out, expected);
    });

    it('should rev-permute properly', function() {
      var out = new Array(2);
      var inp = [
        bin('11001100 00000000 11001100 11111111'),
        bin('11110000 10101010 11110000 10101010')
      ];

      utils.rip(inp[0], inp[1], out, 0);

      var expected = [
        bin('00000001 00100011 01000101 01100111'),
        bin('10001001 10101011 11001101 11101111')
      ];

      assert.deepEqual(out, expected);
    });
  });

  describe('PC1', function() {
    it('should permute properly', function() {
      var out = new Array(2);
      var inp = [
        bin('00010011 00110100 01010111 01111001'),
        bin('10011011 10111100 11011111 11110001')
      ];

      utils.pc1(inp[0], inp[1], out, 0);

      var expected = [
        bin('1111000 0110011 0010101 0101111'),
        bin('0101010 1011001 1001111 0001111')
      ];

      assert.deepEqual(out, expected);
    });
  });

  describe('r28shl', function() {
    it('should shl properly', function() {
      assert.equal(utils.r28shl(bin('1111000011001100101010101111'), 1),
                   bin('1110000110011001010101011111'));

      assert.equal(utils.r28shl(bin('0101010101100110011110001111'), 1),
                   bin('1010101011001100111100011110'));

      assert.equal(utils.r28shl(bin('1111000011001100101010101111'), 4),
                   bin('0000110011001010101011111111'));

      assert.equal(utils.r28shl(bin('0101010101100110011110001111'), 4),
                   bin('0101011001100111100011110101'));
    });
  });

  describe('PC2', function() {
    it('should permute properly', function() {
      var out = new Array(2);
      var inp = [
        bin('1110000 1100110 0101010 1011111'),
        bin('1010101 0110011 0011110 0011110')
      ];

      utils.pc2(inp[0], inp[1], out, 0);

      var expected = [
        bin('000110 110000 001011 101111'),
        bin('111111 000111 000001 110010')
      ];

      assert.deepEqual(out, expected);
    });
  });

  describe('readUInt32BE', function() {
    it('should read number properly', function() {
      var a = [ 0xde, 0xad, 0xbe, 0xef ];
      var o = utils.readUInt32BE(a, 0);
      assert.equal(o, 0xdeadbeef);
    });
  });

  describe('writeUInt32BE', function() {
    it('should read number properly', function() {
      var a = [ 0, 0, 0, 0 ];
      utils.writeUInt32BE(a, 0xdeadbeef, 0);
      var expected = [ 0xde, 0xad, 0xbe, 0xef ];
      assert.deepEqual(a, expected);
    });
  });

  describe('e', function() {
    it('should expand', function() {
      var out = [ 0, 0 ];
      utils.e(bin('1111 0000 1010 1010 1111 0000 1010 1010'), out, 0);
      var expected = [
        bin('011110 100001 010101 010101'),
        bin('011110 100001 010101 010101')
      ];
      assert.deepEqual(out, expected);
    });
  });
});
