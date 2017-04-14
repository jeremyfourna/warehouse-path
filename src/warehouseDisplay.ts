import { Matrix } from "./interface"

export function drawWarehouse(matrix:Matrix, tagToAppendTheWarehouse = "body", classForRow = "row") {

	function addDiv(list:Matrix, openString:string, style:string):string {

		function addDivEl(string:string, className:number, style:string):string {
			if (className === 0) {
				return string + `<div style="${style}"></div>`
			} else {
				return string + `<div class="wall" style="${style}"></div>`
			}
		}

		function closeDivEl(string:string):string {
			return string + "</div>"
		}

		function openDivEl(string:string, classForRow:string):string {
			return string + `<div class="${classForRow}">`
		}

		list.map((cur:number[], index:number) => {
			openString = openDivEl(openString, classForRow)
			cur.map((cur1:number) => {
				openString = addDivEl(openString, cur1, style)
			})
			openString = closeDivEl(openString)
		})

		return openString
	}

	// Style for the div element inside a warehouse
	const style:string = "width: 15pxheight: 15pxdisplay: inline-blockborder: 0.5px solid black"
	// Add in the page the warehouse
	$(tagToAppendTheWarehouse).append(addDiv(matrix, "", style))
	// Retrieve the warehouse from the DOM
	const nodeMatrix = $(`.${classForRow}`)
	// Return the warehouse for reuse into other functions
	return nodeMatrix
}

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

	// defineWidthWithWalls :: Number -> Number
	function defineWidthWithWalls(originalWidth) {
		// The wall are located every two aisles like this (a = aisle  | = wall) :
		// a : a | a : a | a : a | . : . | . : . | n : n
		if (originalWidth <= 2) { // so there is no wall needed
			return originalWidth
		} else {
			originalWidth += originalWidth / 2 - 1
			return Math.round(originalWidth)
		}
	}

	// isNegativeValuesInArray :: Array -> Array
	function isNegativeValuesInArray(list) {
		let negativeValues = []
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
