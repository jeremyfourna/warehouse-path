const assert = require('chai').assert
const createWarehouseMatrix = require('../src/warehouse').createWarehouseMatrix

describe('warehouse.js', () => {
	describe('createWarehouseMatrix()', () => {
		it('It should return [ [ 0, 0 ], [ 0, 0 ] ]', () => {
			const result = createWarehouseMatrix(1, 2, [])

			assert.isArray(result)
			assert.lengthOf(result, 2)

			result.map((cur) => {
				assert.lengthOf(cur, 2)
				assert.equal(cur[0], 0)
				assert.equal(cur[1], 0)
			})
		})
		it('It should return [ [ 0, 0 ], [ 0, 0 ] ]', () => {
			const result = createWarehouseMatrix(1, 2, [])

			assert.isArray(result)
			assert.lengthOf(result, 2)

			result.map((cur) => {
				assert.lengthOf(cur, 2)
				assert.equal(cur[0], 0)
				assert.equal(cur[1], 0)
			})
		})
	})
})
