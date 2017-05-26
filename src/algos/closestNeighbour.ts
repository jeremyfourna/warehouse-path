import { differenceBy } from "lodash"

import { MatrixWithShortestPathBetweenLocations, Ref, Matrix, Location, Locations } from "../interface"
import { uniqLocations } from "../utils"
import { startAndEndAtSameALocation, locationsListToMatrixData } from "../transform"
import { createMatrixWithShortestPathBetweenLocations, shortestPathBetweenLocations } from "../path"

export function createShortestPath(matrix:Matrix, sortingArea:Location, locationsList:Locations, functionToApply) {
	let pickerTour = startAndEndAtSameALocation(sortingArea, uniqLocations(locationsList))
	let short = createMatrixWithShortestPathBetweenLocations(matrix, uniqLocations(pickerTour), functionToApply)
	let shortestPath = shortestPathBetweenLocations(short, sortingArea)
	return locationsListToMatrixData(shortestPath, functionToApply)
}
