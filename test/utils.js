const assert = require('chai').assert;
const R = require('ramda');

const { nbSteps } = require('../src/utils');

describe('utils.js', () => {
  describe('nbSteps', () => {
    it('Case n°1', () => {
      const list = [
        [1],
        [1],
        [1]
      ];

      assert.equal(nbSteps(list), 3);
    });
    it('Case n°2', () => {
      const list = [
        [1]
      ];

      assert.equal(nbSteps(list), 1);
    });
  });
});
