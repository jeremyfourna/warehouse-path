// sShapedLocationAsc :: [String] -> [String];
function sShapedLocationAsc(locationsList) {
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

// sShapedLocationDesc :: [String] -> [String];
function sShapedLocationDesc(locationsList) {
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

function createShorterSShapedPath(sortingArea, locationsList, functionToApply) {
	const pickerTour = startAndEndAtSameALocation(sortingArea, sShapedLocationAsc(uniqLocations(locationsList)));
	return locationsListToMatrixData(pickerTour, functionToApply);
}
