const assert = require('chai').assert
const R = require('ramda')

const aislesWithWalls = require('../src/warehouse').aislesWithWalls
const checkListOfSeparation = require('../src/warehouse').checkListOfSeparation
const createMatrix = require('../src/warehouse').createMatrix
const createWarehouseMatrix = require('../src/warehouse').createWarehouseMatrix
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
		it('return [-1, -4] for [-1, 2, -4]', () => {
			const test = [-1, 2, -4]

			assert.isArray(isNegativeValuesInArray(test))
			assert.lengthOf(isNegativeValuesInArray(test), 2)
		})
	})

	describe('aislesWithWalls', () => {
		describe('dysfunctional cases', () => {
			it('throw Error for "Babar"', () => {
				const test = 'Babar'
				const fn = () => { aislesWithWalls(test) }

				assert.throws(fn, 'aislesWithWalls : parameter must be a positive integer but parameter was rounded to Babar')
			})
			it('throw Error for -1', () => {
				const test = -1
				const fn = () => { aislesWithWalls(test) }

				assert.throws(fn, 'aislesWithWalls : parameter must be a positive integer but parameter was rounded to -1')
			})
			it('throw Error for 0', () => {
				const test = 0
				const fn = () => { aislesWithWalls(test) }

				assert.throws(fn, 'aislesWithWalls : parameter must be a positive integer but parameter was rounded to 0')
			})
		})
		describe('functional cases', () => {
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
	})

	describe('racksFaced', () => {
		describe('dysfunctional cases', () => {
			it('throw Error for "Babar"', () => {
				const test = 'Babar'
				const fn = () => { racksFaced(test) }

				assert.throws(fn, 'racksFaced : parameter must be an even positive integer superior to 0 but parameter was rounded to Babar')
			})
			it('throw Error for 0', () => {
				const test = 0
				const fn = () => { racksFaced(test) }

				assert.throws(fn, 'racksFaced : parameter must be an even positive integer superior to 0 but parameter was rounded to 0')
			})
			it('throw Error for 1', () => {
				const test = 1
				const fn = () => { racksFaced(test) }

				assert.throws(fn, 'racksFaced : parameter must be an even positive integer superior to 0 but parameter was rounded to 1')
			})
			it('throw Error for 3', () => {
				const test = 3
				const fn = () => { racksFaced(test) }

				assert.throws(fn, 'racksFaced : parameter must be an even positive integer superior to 0 but parameter was rounded to 3')
			})
			it('throw Error for 11', () => {
				const test = 11
				const fn = () => { racksFaced(test) }

				assert.throws(fn, 'racksFaced : parameter must be an even positive integer superior to 0 but parameter was rounded to 11')
			})
		})
		describe('functional cases', () => {
			it('return 1 for 2', () => {
				const test = 2
				const fn = () => { racksFaced(test) }

				assert.isNumber(racksFaced(test))
				assert.equal(racksFaced(test), 1)
			})
			it('return 2 for 4', () => {
				const test = 4
				const fn = () => { racksFaced(test) }

				assert.isNumber(racksFaced(test))
				assert.equal(racksFaced(test), 2)
			})
			it('return 10 for 20', () => {
				const test = 20
				const fn = () => { racksFaced(test) }

				assert.isNumber(racksFaced(test))
				assert.equal(racksFaced(test), 10)
			})
		})
	})

	describe('checkListOfSeparation', () => {
		describe('dysfunctional cases', () => {
			it('throw Error for [-1, 2, -4]', () => {
				const test = [-1, 2, -4]
				const fn = () => { checkListOfSeparation(test) }

				assert.throws(fn, 'checkListOfSeparation : parameter must be an Array of positive numbers but parameter was -1,2,-4')
			})
			it('throw Error for undefined', () => {
				const test = undefined
				const fn = () => { checkListOfSeparation(test) }

				assert.throws(fn, 'checkListOfSeparation : parameter must be an Array of positive numbers but parameter was undefined')
			})
			it('throw Error for null', () => {
				const test = null
				const fn = () => { checkListOfSeparation(test) }

				assert.throws(fn, 'checkListOfSeparation : parameter must be an Array of positive numbers but parameter was null')
			})
		})
		describe('functional cases', () => {
			it('return [1] for [1]', () => {
				const test = [1]

				assert.isArray(checkListOfSeparation(test))
				assert.lengthOf(checkListOfSeparation(test), 1)
			})
			it('return [] for []', () => {
				const test = []

				assert.isArray(checkListOfSeparation(test))
				assert.lengthOf(checkListOfSeparation(test), 0)
			})
		})
	})

	describe('createMatrix', () => {
		it('retun for racksInAisle = 2 ; aislesInWH = 11 ; listOfSeparation = []', () => {
			const racksInAisle = 2
			const aislesInWH = 11
			const listOfSeparation = []

			const result = createMatrix(racksInAisle, aislesInWH, listOfSeparation)
				//console.log(result);

			function isZero(number) {
				return assert.equal(0, number)
			}

			function isOne(number) {
				return assert.equal(1, number)
			}

			assert.isArray(result)
			R.forEach(assert.isArray, result)
			R.forEach(isZero, result[0])
			R.forEach(isZero, result[R.dec(R.length(result))])
		})
	})

	describe('createWarehouseMatrix', () => {
		it('for racksInAisle = 4 ; aislesInWH = 4 ; listOfSeparation = []', () => {
			const racksInAisle = 4
			const aislesInWH = 4
			const listOfSeparation = []

			const result = createWarehouseMatrix(racksInAisle, aislesInWH, listOfSeparation)

			assert.isArray(result)
		})
		it(`createWarehouseMatrix for racksInAisle = 4 ; aislesInWH = 4 ; listOfSeparation = [] === createMatrix for racksInAisle = 2 ; aislesInWH = 11 ; listOfSeparation = []`, () => {
			const racksInAisle = 4
			const aislesInWH = 4
			const listOfSeparation = []

			const result = createWarehouseMatrix(4, 4, [])
			const result1 = createMatrix(2, 11, [])

			assert.isArray(result)
			assert.isArray(result1)
			assert.deepEqual(result, result1)
		})
	})
})
