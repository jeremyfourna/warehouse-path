const assert = require('chai').assert;
const R = require('ramda');

const {
  startFromALocation,
  endAtALocation
} = require('../src/picker-tour');

describe('picker-tour.js', () => {
  describe('startFromALocation', () => {
    it('Case n°1', () => {
      const list = [1, 2, 3];

      assert.deepEqual(startFromALocation(10, list), [10, 1, 2, 3]);
    });
  });

  describe('endAtALocation', () => {
    it('Case n°1', () => {
      const list = [1, 2, 3];

      assert.deepEqual(endAtALocation(10, list), [1, 2, 3, 10]);
    });
  });
});
