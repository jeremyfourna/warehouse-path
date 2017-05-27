var R = require('ramda');

const isNotNil = R.complement(R.isNil)

// createWarehouseMatrix :: (number, number, [number]) -> Matrix
function createWarehouseMatrix(numberOfRackInAisle, numberOfAisleInWarehouse, listOfSeparation) {

	// createMatrix :: (number, number, [number], number, number, Array )-> Matrix
	function createMatrix(startHeight, startWidth, listOfSeparation, height = 0, width = 0, matrix = []) {
		// Walkability matrix. Zero is walkable, One is not
		if (R.gte(height, startHeight)) {
			return R.append(R.repeat(0, startWidth), matrix);
		} else if (R.gte(width, startWidth)) {
			return createMatrix(startHeight, startWidth, listOfSeparation, R.inc(height), 0, matrix);
		} else {
			if (R.equals(height, 0)) {
				matrix = R.append(R.repeat(0, startWidth), matrix);
				return createMatrix(startHeight, startWidth, listOfSeparation, R.inc(height), width, matrix);
			} else if (R.isNil(R.nth(height, matrix))) {
				matrix = R.append([], matrix);
				return createMatrix(startHeight, startWidth, listOfSeparation, height, width, matrix);
			} else {
				if (isNotNil(R.find(R.equals(height), listOfSeparation))) {
					matrix = R.adjust(R.append(0), height, matrix);
				} else if (R.equals(R.modulo(R.inc(width), 3), 0)) {
					matrix = R.adjust(R.append(1), height, matrix);
				} else {
					matrix = R.adjust(R.append(0), height, matrix);
				}
				return createMatrix(startHeight, startWidth, listOfSeparation, height, R.inc(width), matrix);
			}
		}
	}

	// defineWidthWithWalls :: number -> number
	function defineWidthWithWalls(originalWidth) {
		// The wall are located every two aisles like this (a = aisle  | = wall) :
		// a : a | a : a | a : a | . : . | . : . | n : n
		return R.ifElse(
			R.lte(originalWidth, 2),
			R.identity(originalWidth),
			Math.round(R.add(R.dec(R.divide(originalWidth, 2)), originalWidth))
		);
	}

	// isNegativeValuesInArray :: [number] -> [number]
	function isNegativeValuesInArray(list) {
		return R.filter(R.lt(R.__, 0), list)
	}

	// onlyPositiveNumbers :: [number] -> [number]
	function onlyPositiveNumbers(list) {
		return R.filter(R.gte(R.__, 0), list)
	}

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

	// Round numberOfRackInAisle and numberOfAisleInWarehouse to prevent errors
	numberOfRackInAisle = Math.round(numberOfRackInAisle)
	numberOfAisleInWarehouse = Math.round(numberOfAisleInWarehouse)

	// We assume inside an aisle the racks are located in front of each other
	// 1 : 2
	// 3 : 4
	// 5 : 6
	// . : .
	// . : .
	// n : n
	//
	// So we need to divide the numberOfRackInAisle by two to respect the real warehouse height
	numberOfRackInAisle /= 2
		// We also need to multiply numberOfAisleInWarehouse by 2 to be able to place on the page the racks in front of each other
	numberOfAisleInWarehouse *= 2

	// A matrix looks like this : 0 is a walkable location  1 is a wall (not walkable)
	/* [
		[0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 0, 0, 0]
	] */
	return createMatrix(numberOfRackInAisle, defineWidthWithWalls(numberOfAisleInWarehouse), listOfSeparation)
}


exports.createWarehouseMatrix = R.curry(createWarehouseMatrix);
