'use strict';

var assert = require('assert');
var Buffer = require('buffer').Buffer;

var des = require('../');

var fixtures = require('./fixtures');
var bin = fixtures.bin;

describe('DES-PCBC', function() {
  var PCBC = des.PCBC.instantiate(des.DES);

  describe('encryption/decryption', function() {
    var vectors = [
      {
        key: '133457799bbcdff1',
        iv: '0102030405060708',
        input: '0123456789abcdef',
        expected: 'e61690cc695580f6'
      },
      {
        key: '0000000000000000',
        iv: 'ffffffffffffffff',
        input: '0000000000000000',
        expected: '355550b2150e2451'
      },
      {
        key: 'a3a3a3a3b3b3b3b3',
        iv: 'cdcdcdcdcdcdcdcd',
        input: 'cccccccccccccccc',
        expected: 'd3b46e94d6beb89f'
      },
      {
        key: 'deadbeefabbadead',
        iv: 'a0da0da0da0da0da',
        input: '0102030405060708',
        expected: 'aa8f918a8290790b'
      },
      {
        key: 'aabbccddeeff0011',
        iv: 'fefefefefefefefe',
        input: '0102030405060708090a0102030405060708090a0102030405060708090a' +
               '0102030405060708090a0102030405060607080a010203040506',
        expected: 'b55586b5e2394ea8d6d3d9f783a62bdc03b85e4418744ae6cdd6350f4' +
                  '792482bad99c3d16bdbf76cd0c34977c2a865d86184263401f14d0b'
      }
    ];

    vectors.forEach(function(vec, i) {
      it('should encrypt vector ' + i, function() {
        var key = Buffer.from(vec.key, 'hex');
        var iv = Buffer.from(vec.iv, 'hex');
        var input = Buffer.from(vec.input, 'hex');

        var enc = PCBC.create({
          type: 'encrypt',
          key: key,
          iv: iv,
          padding: false
        });
        var out = Buffer.from(enc.update(input).concat(enc.final()));

        var expected = Buffer.from(vec.expected, 'hex');
        assert.deepEqual(out, expected);

        var dec = PCBC.create({
          type: 'decrypt',
          key: key,
          iv: iv,
          padding: false
        });
        assert.deepEqual(Buffer.from(dec.update(out).concat(dec.final())), input);
      });
    });
  });
});
