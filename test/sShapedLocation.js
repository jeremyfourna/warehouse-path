const assert = require('chai').assert;
const R = require('ramda');

const {
  sShapedLocationAsc,
  sShapedLocationDesc
} = require('../src/algos/sShapedLocations');

describe('sShapedLocations.js', () => {
  describe('sShapedLocationAsc', () => {
    it('Case n°1', () => {
      const list = [1, 2, 3, 7, 6, 5, 4];

      assert.deepEqual(sShapedLocationAsc(list), [1, 2, 3, 4, 5, 6, 7]);
    });
    it('Case n°2', () => {
      const list = ['b', 'a', 'e', 'd', 'c', 'f'];

      assert.deepEqual(sShapedLocationAsc(list), ['a', 'b', 'c', 'd', 'e', 'f']);
    });
  });

  describe('sShapedLocationDesc', () => {
    it('Case n°1', () => {
      const list = [1, 2, 3, 7, 6, 5, 4];

      assert.deepEqual(sShapedLocationDesc(list), [7, 6, 5, 4, 3, 2, 1]);
    });
    it('Case n°2', () => {
      const list = ['b', 'a', 'e', 'd', 'c', 'f'];

      assert.deepEqual(sShapedLocationDesc(list), ['f', 'e', 'd', 'c', 'b', 'a']);
    });
  });
});
