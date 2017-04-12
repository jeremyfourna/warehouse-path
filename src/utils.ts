import { uniq, uniqBy, isEqual } from "lodash"
import { Locations, MatrixLocations, MatrixPickerTour } from "./interface"

export function uniqLocations(locations:Locations):Locations {
	return uniq(locations)
}

export function uniqMatrixLocations(matrixLocations:MatrixLocations):MatrixLocations {
	return uniqBy(matrixLocations, isEqual)
}

export function nbStepsForAPickerTour(pickerTour:MatrixPickerTour):number {
	return pickerTour.reduce((prev:number, cur:number[]) => {
		return prev + cur.length
	}, 0)
}