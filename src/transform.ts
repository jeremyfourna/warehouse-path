////////////////////////////////////////////////////////////////////////
// Transform origin picker tour to matrix data //
//////////////////////////////////////////////////////////////////////

export function locationsListToMatrixData(locationsList:string[], functionToApply) {
	return locationsList.map(functionToApply);
}

export function locationToMatrixData(location:string, functionToApply) {
	return functionToApply(location);
}

/////////////////////////////////////////////////////////////////////////////////////
// Add starting and/or ending point to the picker tour //
///////////////////////////////////////////////////////////////////////////////////

export function startAndEndAtSameALocation(location:string, locationsList:string[]):string[] {
	return endAtALocation(location, startFromALocation(location, locationsList));
}

export function startFromALocation(startingLocation:string, locationsList:string[]):string[] {
	let newLocationsList = locationsList.slice(0);
	newLocationsList.reverse().push(startingLocation);
	return newLocationsList.reverse();
}

export function endAtALocation(endingLocation:string, locationsList:string[]):string[] {
	let newLocationsList = locationsList.slice(0);
	newLocationsList.push(endingLocation);
	return newLocationsList;
}

////////////////////////////////////////////////
// Create a sub part of a picker tour //
///////////////////////////////////////////////

export function pickerTourInSequence(pickerTour:number[][], nbLocations:number):number[][] {
	if (nbLocations > pickerTour.length) {
		return pickerTour;
	} else {
		const newPickerTour = pickerTour.slice(0, nbLocations);
		return newPickerTour;
	}
}