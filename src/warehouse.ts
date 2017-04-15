import { Matrix } from "./interface"

export function createWarehouseMatrix(numberOfRackInAisle:number, numberOfAisleInWarehouse:number, listOfSeparation:number[]):Matrix {

	// createMatrix :: Number -> Number -> [Number] -> Number -> Number -> Array -> [Array]
	function createMatrix(startHeight:number, startWidth:number, listOfSeparation:number[], height = 0, width = 0, matrix = []) {
		// Walkability matrix. Zero is walkable, One is not
		if (height >= startHeight) {
			matrix.push(Array(startWidth).fill(0))
			return matrix
		} else if (width >= startWidth) {
			return createMatrix(startHeight, startWidth, listOfSeparation, height + 1, 0, matrix)
		} else {
			if (height === 0) {
				matrix.push(Array(startWidth).fill(0))
				return createMatrix(startHeight, startWidth, listOfSeparation, height + 1, width, matrix)
			} else if (matrix[height] === undefined) {
				matrix.push([])
				return createMatrix(startHeight, startWidth, listOfSeparation, height, width, matrix)
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
				return createMatrix(startHeight, startWidth, listOfSeparation, height, width + 1, matrix)
			}
		}
	}

	function defineWidthWithWalls(originalWidth:number):number {
		// The wall are located every two aisles like this (a = aisle  | = wall) :
		// a : a | a : a | a : a | . : . | . : . | n : n
		if (originalWidth <= 2) { // so there is no wall needed
			return originalWidth
		} else {
			originalWidth += originalWidth / 2 - 1
			return Math.round(originalWidth)
		}
	}

	function isNegativeValuesInArray(list:number[]):number[] {
		let negativeValues:number[] = []
		list.map(function(cur) {
			if (cur < 0) {
				return negativeValues.push(cur)
			}
		})
		return negativeValues
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
