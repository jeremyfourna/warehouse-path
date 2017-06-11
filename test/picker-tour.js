const assert = require('chai').assert;
const R = require('ramda');

const nbStepsForAPickerTour = require('../src/picker-tour').nbStepsForAPickerTour;

describe('picker-tour.js', () => {
	describe('nbStepsForAPickerTour', () => {
		it('return 1 for [[0]]', () => {
			const test = [
				[0]
			];

			assert.isNumber(nbStepsForAPickerTour(test));
			assert.equal(nbStepsForAPickerTour(test), 1);
		});
		it('return 0 for [[]]', () => {
			const test = [
				[]
			];

			assert.isNumber(nbStepsForAPickerTour(test));
			assert.equal(nbStepsForAPickerTour(test), 0);
		});
		it('return 4 for [[0,0], [0,0]]', () => {
			const test = [
				[0, 0],
				[0, 0]
			];

			assert.isNumber(nbStepsForAPickerTour(test));
			assert.equal(nbStepsForAPickerTour(test), 4);
		});
	});
});
