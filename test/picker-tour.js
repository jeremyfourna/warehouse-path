const assert = require('chai').assert
const R = require('ramda')

const nbStepsForAPickerTour = require('../src/picker-tour').nbStepsForAPickerTour

describe('picker-tour.js', () => {
  describe('nbStepsForAPickerTour', () => {
    it('return 1 for [[0]]', () => {
      const test = [
        [0]
      ]

      assert.isNumber(nbStepsForAPickerTour(test))
      assert.equal(R.equals(nbStepsForAPickerTour(test)), 1)
    })
  })
})
