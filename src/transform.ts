import { Locations, Location, Path, MatrixLocation, MatrixLocations } from "./interface"

////////////////////////////////////////////////////////////////////////
// Transform origin picker tour to matrix data //
//////////////////////////////////////////////////////////////////////

export function locationsListToMatrixData(locationsList:Locations, functionToApply):MatrixLocations {
	let newList = []

	locationsList.map((cur) => {
		newList.push(locationToMatrixData(cur, functionToApply))
	})

	return newList
}

export function locationToMatrixData(location:Location, functionToApply):MatrixLocation {
	return functionToApply(location)
}

/////////////////////////////////////////////////////////////////////////////////////
// Add starting and/or ending point to the picker tour //
///////////////////////////////////////////////////////////////////////////////////

export function startAndEndAtSameALocation(location:Location, locationsList:Locations):Locations {
	return endAtALocation(location, startFromALocation(location, locationsList))
}

export function startFromALocation(startingLocation:Location, locationsList:Locations):Locations {
	let newLocationsList = locationsList.slice(0)
	newLocationsList.reverse().push(startingLocation)
	return newLocationsList.reverse()
}

export function endAtALocation(endingLocation:Location, locationsList:Locations):Locations {
	let newLocationsList = locationsList.slice(0)
	newLocationsList.push(endingLocation)
	return newLocationsList
}

export function startFromALocationMatrix(startingLocation:MatrixLocation, locationsList:MatrixLocations):MatrixLocations {
	let newLocationsList = locationsList.slice(0)
	newLocationsList.reverse().push(startingLocation)
	return newLocationsList.reverse()
}

export function endAtALocationMatrix(endingLocation:MatrixLocation, locationsList:MatrixLocations):MatrixLocations {
	let newLocationsList = locationsList.slice(0)
	newLocationsList.push(endingLocation)
	return newLocationsList
}

////////////////////////////////////////////////
// Create a sub part of a picker tour //
///////////////////////////////////////////////

export function pickerTourInSequence(pickerTour:Path, nbLocations:number):Path {
	if (nbLocations > pickerTour.length) {
		return pickerTour
	} else {
		const newPickerTour = pickerTour.slice(0, nbLocations)
		return newPickerTour
	}
}