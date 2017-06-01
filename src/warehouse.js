const R = require('ramda')


exports.aislesWithWalls = aislesWithWalls
exports.createMatrix = createMatrix
exports.isNegativeValuesInArray = isNegativeValuesInArray
exports.racksFaced = racksFaced


/**
 * Matrix = [ [Number], [Number] ] 
 */

// createWarehouseMatrix :: (Number -> Number -> [Number]) -> Matrix
function createWarehouseMatrix(numberOfRackInAisle, numberOfAisleInWarehouse, listOfSeparation) {
	// Check parameters
	if (numberOfRackInAisle <= 0) {
		console.log(`numberOfRackInAisle should be > 0  the value passed was ${numberOfRackInAisle}`)
		return []
	} else if (numberOfRackInAisle % 2 !== 0) {
		console.log(`numberOfRackInAisle should be even  the value passed was ${numberOfRackInAisle}`)
		return []
	} else if (numberOfAisleInWarehouse <= 0) {
		console.log(`numberOfAisleInWarehouse should be > 0  the value passed was ${numberOfAisleInWarehouse}`)
		return []
	} else if (listOfSeparation.length === undefined) {
		console.log(`listOfSeparation should be an Array of positive numbers  the value passed was ${listOfSeparation}`)
		return []
	} else if (isNegativeValuesInArray(listOfSeparation).length > 0) {
		console.log(`There should be only numbers >= 0 inside listOfSeparation  we found those numbers inside  ${isNegativeValuesInArray(listOfSeparation)}`)
		return []
	}


	// A matrix looks like this : 0 is a walkable location  1 is a wall (not walkable)
	/* [
		[0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 0, 0, 0]
	] */
	return createMatrix(numberOfRackInAisle, aislesWithWalls(numberOfAisleInWarehouse), listOfSeparation)
}

// createMatrix :: Number -> Number -> [Number] -> Number -> Number -> Array -> [Array]
function createMatrix(racksInAisle, aislesInWH, listOfSeparation, height = 0, width = 0, matrix = []) {
	// Walkability matrix. Zero is walkable, One is not
	if (height >= racksInAisle) {
		matrix.push(Array(aislesInWH).fill(0))
		return matrix
	} else if (width >= aislesInWH) {
		return createMatrix(racksInAisle, aislesInWH, listOfSeparation, height + 1, 0, matrix)
	} else {
		if (height === 0) {
			matrix.push(Array(aislesInWH).fill(0))
			return createMatrix(racksInAisle, aislesInWH, listOfSeparation, height + 1, width, matrix)
		} else if (matrix[height] === undefined) {
			matrix.push([])
			return createMatrix(racksInAisle, aislesInWH, listOfSeparation, height, width, matrix)
		} else {
			if (listOfSeparation.find(function(cur) {
					return cur === height
				}) !== undefined) {
				matrix[height].push(0)
			} else if ((width + 1) % 3 === 0) {
				matrix[height].push(1)
			} else {
				matrix[height].push(0)
			}
			return createMatrix(racksInAisle, aislesInWH, listOfSeparation, height, width + 1, matrix)
		}
	}
}

// aislesWithWalls :: Number -> Number
function aislesWithWalls(aislesNumber) {
	// The wall are located every two aisles like this (a = aisle  | = wall) :
	//   1   |   2   |   3   |   4   |   5   |   n
	// a : a | a : a | a : a | . : . | . : . | n : n
	const safeAislesNumber = Math.round(aislesNumber)
	const isNaN = R.equals(NaN)
	if (R.either(isNaN, R.lt(R.__, 1))(safeAislesNumber)) {
		throw new Error(`aislesNumber must be a positive integer but aislesNumber was rounded to ${aislesNumber}`)
	} else {
		return R.dec(R.multiply(safeAislesNumber, 3))
	}
}

// racksFaced :: Number -> Number
function racksFaced(racksNumber) {
	// We assume inside an aisle the racks are located in front of each other
	// 1 : 2
	// 3 : 4
	// 5 : 6
	// . : .
	// . : .
	// n : n
	//
	// So we need to divide the numberOfRackInAisle by two to respect the real warehouse height
	const safeRacksNumber = Math.round(racksNumber)
	const isNaN = R.equals(NaN)
	const isOdd = R.ifElse(R.modulo(R.__, 2), R.always(true), R.always(false))
	if (R.anyPass([isNaN, R.lte(R.__, 2), isOdd])(safeRacksNumber)) {
		throw new Error(`racksNumber must be an even positive integer superior to 0 but racksNumber was rounded to ${racksNumber}`)
	} else {
		return R.divide(safeRacksNumber, 2)
	}
}

// isNegativeValuesInArray :: Array -> Array
function isNegativeValuesInArray(list) {
	return R.filter(R.lt(R.__, 0), list)
}
