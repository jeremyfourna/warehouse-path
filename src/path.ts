import { AStarFinder, Grid } from "pathfinding"
import { Location, Matrix, MatrixLocation,MatrixLocations, Path, PickerTour, MatrixWithShortestPathBetweenLocations, Ref, ShortestMatrixPathBetweenLocations } from "./interface"
import { locationToMatrixData } from "./transform"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions responsible to create a path between 2 or more matrix data points //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function createPathBetweenManyLocations(matrix:Matrix, matrixLocations:MatrixLocations):Path {
	let path = []
	let previousLocation = undefined
	matrixLocations.map((cur:MatrixLocation, index:number) => {
		if (previousLocation === undefined) {
			return previousLocation = cur
		} else {
			path.push(createPathBetweenTwoLocations(matrix, previousLocation, cur))
			return previousLocation = cur
		}
	});
	// Add the path to return to the point of origin
	path.push(createPathBetweenTwoLocations(matrix, matrixLocations[matrixLocations.length - 1], matrixLocations[0]))
	
	return path
}

export function createPathBetweenTwoLocations(matrix:Matrix, originLocation:MatrixLocation, destinationLocation:MatrixLocation):Path {
	const grid = new Grid(matrix)
	const finder = new AStarFinder({
		allowDiagonal: true
	});
	
	return finder.findPath(originLocation[0], originLocation[1], destinationLocation[0], destinationLocation[1], grid)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function that will a matrix between all the locations of a picker tour //
// Should be used with an algo function to find best path                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function createMatrixWithShortestPathBetweenLocations(matrix:Matrix, pickerTour:PickerTour, functionToApply):MatrixWithShortestPathBetweenLocations {
	// pickerTour should also contain the point of origin/return
	let ref:Ref[] = []
	let shortestMatrix:ShortestMatrixPathBetweenLocations[][] = []
	pickerTour.map((cur:string, index:number) => {
		return ref.push({
			name: cur,
			coordinates: locationToMatrixData(cur, functionToApply),
			indexInMatrix: index
		})
	})

	ref.map((cur:Ref) => {
		let pathForEachLocations:ShortestMatrixPathBetweenLocations[] = []
		ref.map((cur1:Ref) => {
			const path = createPathBetweenTwoLocations(matrix, cur.coordinates, cur1.coordinates)
			return pathForEachLocations.push({
				name: cur1.name,
				coordinates: cur1.coordinates,
				pathLength: path.length
			})
		})
		return shortestMatrix.push(pathForEachLocations)
	})

	return {
		ref,
		matrix: shortestMatrix
	}
}