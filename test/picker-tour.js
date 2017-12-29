const assert = require('chai').assert;
const R = require('ramda');

const {
  endAtALocation,
  startFromALocation,
  startAndEndAtSameALocation
} = require('../src/picker-tour');

describe('picker-tour.js', () => {
  describe('startFromALocation', () => {
    it('Case n°1', () => {
      const list = [1, 2, 3];

      assert.deepEqual(startFromALocation(10, list), [10, 1, 2, 3]);
    });
    it('Case n°2', () => {
      const list = ['a', 'b', 'c'];

      assert.deepEqual(startFromALocation('d', list), ['d', 'a', 'b', 'c']);
    });
  });

  describe('endAtALocation', () => {
    it('Case n°1', () => {
      const list = [1, 2, 3];

      assert.deepEqual(endAtALocation(10, list), [1, 2, 3, 10]);
    });
    it('Case n°2', () => {
      const list = ['a', 'b', 'c'];

      assert.deepEqual(endAtALocation('d', list), ['a', 'b', 'c', 'd']);
    });
  });

  describe('startAndEndAtSameALocation', () => {
    it('Case n°1', () => {
      const list = [1, 2, 3];

      assert.deepEqual(startAndEndAtSameALocation(10, list), [10, 1, 2, 3, 10]);
    });
    it('Case n°2', () => {
      const list = ['a', 'b', 'c'];

      assert.deepEqual(startAndEndAtSameALocation('d', list), ['d', 'a', 'b', 'c', 'd']);
    });
  });
});
