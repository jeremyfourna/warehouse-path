import { Locations, Location, PickerTour } from "./interface"

////////////////////////////////////////////////////////////////////////
// Transform origin picker tour to matrix data //
//////////////////////////////////////////////////////////////////////

export function locationsListToMatrixData(locationsList:Locations, functionToApply) {
	return locationsList.map(functionToApply)
}

export function locationToMatrixData(location:Location, functionToApply) {
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

////////////////////////////////////////////////
// Create a sub part of a picker tour //
///////////////////////////////////////////////

export function pickerTourInSequence(pickerTour:PickerTour, nbLocations:number):PickerTour {
	if (nbLocations > pickerTour.length) {
		return pickerTour
	} else {
		const newPickerTour = pickerTour.slice(0, nbLocations)
		return newPickerTour
	}
}