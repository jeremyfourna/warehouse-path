const assert = require('chai').assert
const R = require('ramda')

const aislesWithWalls = require('../src/warehouse').aislesWithWalls
const createMatrix = require('../src/warehouse').createMatrix
const isNegativeValuesInArray = require('../src/warehouse').isNegativeValuesInArray
const racksFaced = require('../src/warehouse').racksFaced

describe('warehouse.js', () => {
	describe('isNegativeValuesInArray', () => {
		it('return [-1] for [1, 2, -1, 3, 0]', () => {
			const test = [1, 2, -1, 3, 0]

			assert.isArray(isNegativeValuesInArray(test))
			assert.lengthOf(isNegativeValuesInArray(test), 1)
			assert.equal(R.nth(0, isNegativeValuesInArray(test)), [-1])
		})
		it('return [] for []', () => {
			const test = []

			assert.isArray(isNegativeValuesInArray(test))
			assert.lengthOf(isNegativeValuesInArray(test), 0)
		})
		it('return [-1, -2, -3, -4] for [-1, -2, -3, -4]', () => {
			const test = [-1, -2, -3, -4]

			assert.isArray(isNegativeValuesInArray(test))
			assert.lengthOf(isNegativeValuesInArray(test), 4)
			assert.equal(R.nth(0, isNegativeValuesInArray(test)), [-1])
			assert.equal(R.nth(1, isNegativeValuesInArray(test)), [-2])
			assert.equal(R.nth(2, isNegativeValuesInArray(test)), [-3])
			assert.equal(R.nth(3, isNegativeValuesInArray(test)), [-4])
		})
		it('return [] for [1, 2, 3, 4]', () => {
			const test = [1, 2, 3, 4]

			assert.isArray(isNegativeValuesInArray(test))
			assert.lengthOf(isNegativeValuesInArray(test), 0)
		})
	})

	describe('aislesWithWalls', () => {
		it('throw Error for "Babar"', () => {
			const test = 'Babar'
			const fn = () => { aislesWithWalls(test) }

			assert.throws(fn, 'aislesNumber must be a positive integer but aislesNumber was rounded to Babar')
		})
		it('throw Error for -1', () => {
			const test = -1
			const fn = () => { aislesWithWalls(test) }

			assert.throws(fn, 'aislesNumber must be a positive integer but aislesNumber was rounded to -1')
		})
		it('throw Error for 0', () => {
			const test = 0
			const fn = () => { aislesWithWalls(test) }

			assert.throws(fn, 'aislesNumber must be a positive integer but aislesNumber was rounded to 0')
		})
		it('return 2 for 0.9', () => {
			const test = 0.9

			assert.isNumber(aislesWithWalls(test))
			assert.equal(aislesWithWalls(test), 2)
		})
		it('return 2 for 1', () => {
			const test = 1

			assert.isNumber(aislesWithWalls(test))
			assert.equal(aislesWithWalls(test), 2)
		})
		it('return 2 for 1.3', () => {
			const test = 1.3

			assert.isNumber(aislesWithWalls(test))
			assert.equal(aislesWithWalls(test), 2)
		})
		it('return 5 for 2', () => {
			const test = 2

			assert.isNumber(aislesWithWalls(test))
			assert.equal(aislesWithWalls(test), 5)
		})
		it('return 8 for 3', () => {
			const test = 3

			assert.isNumber(aislesWithWalls(test))
			assert.equal(aislesWithWalls(test), 8)
		})
		it('return 11 for 4', () => {
			const test = 4

			assert.isNumber(aislesWithWalls(test))
			assert.equal(aislesWithWalls(test), 11)
		})
		it('return 14 for 5', () => {
			const test = 5

			assert.isNumber(aislesWithWalls(test))
			assert.equal(aislesWithWalls(test), 14)
		})
	})

	describe('racksFaced', () => {
		it('throw Error for "Babar"', () => {
			const test = 'Babar'
			const fn = () => { racksFaced(test) }

			assert.throws(fn, 'racksNumber must be an even positive integer superior to 0 but racksNumber was rounded to Babar')
		})
		it('throw Error for 0', () => {
			const test = 0
			const fn = () => { racksFaced(test) }

			assert.throws(fn, 'racksNumber must be an even positive integer superior to 0 but racksNumber was rounded to 0')
		})
		it('throw Error for 1', () => {
			const test = 1
			const fn = () => { racksFaced(test) }

			assert.throws(fn, 'racksNumber must be an even positive integer superior to 0 but racksNumber was rounded to 1')
		})
		it('throw Error for 3', () => {
			const test = 3
			const fn = () => { racksFaced(test) }

			assert.throws(fn, 'racksNumber must be an even positive integer superior to 0 but racksNumber was rounded to 3')
		})
		it('throw Error for 11', () => {
			const test = 11
			const fn = () => { racksFaced(test) }

			assert.throws(fn, 'racksNumber must be an even positive integer superior to 0 but racksNumber was rounded to 11')
		})
	})

	describe('createMatrix', () => {
		it('return [0, 0] for racksInAisle = 2 ; aislesInWH = 1 ; listOfSeparation = []', () => {
			const racksInAisle = 2
			const aislesInWH = 1
			const listOfSeparation = []

			assert.isArray(createMatrix(racksInAisle, aislesInWH, listOfSeparation))
		})
	})
})
