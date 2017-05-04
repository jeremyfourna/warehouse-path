import { Locations, Location, MatrixLocations } from "../interface"
import { startAndEndAtSameALocation, locationsListToMatrixData } from "../transform"
import { uniqLocations } from "../utils"

function sShapedLocationAsc(locationsList:Locations):Locations {
	let newList = locationsList.slice(0);
	newList.sort(function(a, b) {
		if (a < b) {
			return -1;
		} else if (a > b) {
			return 1;
		} else {
			return 0;
		}
	});
	return newList;
}

function sShapedLocationDesc(locationsList:Locations):Locations {
	let newList = locationsList.slice(0);
	newList.sort(function(a, b) {
		if (a > b) {
			return -1;
		} else if (a < b) {
			return 1;
		} else {
			return 0;
		}
	});
	return newList;
}

export function createShorterSShapedPath(sortingArea:Location, locationsList:Locations, functionToApply):MatrixLocations {
	const pickerTour:Locations = startAndEndAtSameALocation(sortingArea, sShapedLocationAsc(uniqLocations(locationsList)));
	return locationsListToMatrixData(pickerTour, functionToApply);
}
