const warehouseHeight = 44;
const warehouseWidth = 36;
const warehouseSeparation = 10;

let realPickerTour = ["MZ1-0926D03", "MZ1-2540A01", "MZ1-2708A03", "MZ1-2714D01", "MZ1-2716A01", "MZ1-2734D04", "MZ1-2734D04", "MZ1-2734D04", "MZ1-2734D04", "MZ1-2738D01", "MZ1-2738D01", "MZ1-2806D06", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2914A03", "MZ1-3115A01", "MZ1-3116D06", "MZ1-3124A02", "MZ1-3124A02", "MZ1-3124A02", "MZ1-3124A02", "MZ1-3138A01", "MZ1-3138A01", "MZ1-3138A01", "MZ1-3138A01", "MZ1-3138A01", "MZ1-3142A02", "MZ1-3142A02", "MZ1-3142A02", "MZ1-3142A02", "MZ1-3142D06", "MZ1-3205D04", "MZ1-3303D01", "MZ1-3305A02", "MZ1-3305A02", "MZ1-3318D05", "MZ1-3323A01", "MZ1-3328D04", "MZ1-3328D04", "MZ1-3328D04", "MZ1-3328D04", "MZ1-3328D04", "MZ1-3329D06", "MZ1-3407D01"];
let realPickerTour1 = ["MZ1-2010D05", "MZ1-2103D02", "MZ1-2511A01", "MZ1-2529A01", "MZ1-2539A01", "MZ1-2539A01", "MZ1-2539A01", "MZ1-2539A03", "MZ1-2542D01", "MZ1-2542D01", "MZ1-2633D03", "MZ1-2706A01", "MZ1-2709A01", "MZ1-2716D04", "MZ1-2718D01", "MZ1-2718D01", "MZ1-2718D04", "MZ1-2723A02", "MZ1-2734D03", "MZ1-2738D01", "MZ1-2803D05", "MZ1-2803D05", "MZ1-2907A01", "MZ1-2918D06", "MZ1-3103A02", "MZ1-3103D03", "MZ1-3115A02", "MZ1-3119A02", "MZ1-3129D06", "MZ1-3130D01", "MZ1-3139D04", "MZ1-3142A02", "MZ1-3233D02", "MZ1-3303D01", "MZ1-3303D01", "MZ1-3305A02", "MZ1-3307A03", "MZ1-3316A02", "MZ1-3323A01", "MZ1-3325A02", "MZ1-3325A02", "MZ1-3325A02", "MZ1-3328D04", "MZ1-3329D06", "MZ1-3329D06", "MZ1-3405D06", "MZ1-3405D06", "MZ1-3604D02", "MZ1-3604D02", "MZ1-3604D03", "MZ1-3609D06"];
let realPickerTour2 = ["MZ1-2511A01", "MZ1-2520A01", "MZ1-2805D03", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2925A01", "MZ1-2936A03", "MZ1-2936A03", "MZ1-2940A03", "MZ1-2940A03", "MZ1-2940A03", "MZ1-2940A03", "MZ1-2940A03", "MZ1-2940A03", "MZ1-2941A01", "MZ1-2941A01", "MZ1-2942A02", "MZ1-2942A02", "MZ1-3103A03", "MZ1-3103A03", "MZ1-3123A01", "MZ1-3123A01", "MZ1-3123A01", "MZ1-3123A01", "MZ1-3123A01", "MZ1-3128A03", "MZ1-3128A03", "MZ1-3205D02"];
let realPickerTour3 = ["MZ1-2507A02", "MZ1-2507A02", "MZ1-2518D05", "MZ1-2518D06", "MZ1-2518D06", "MZ1-2523A03", "MZ1-2525A03", "MZ1-2525A03", "MZ1-2527D03", "MZ1-2527D03", "MZ1-2529D01", "MZ1-2529D01", "MZ1-2529D01", "MZ1-2538A02", "MZ1-2538D05", "MZ1-2538D05", "MZ1-2538D05", "MZ1-2540A03", "MZ1-2540D01", "MZ1-2639D05", "MZ1-2639D05", "MZ1-2639D05", "MZ1-2640D04", "MZ1-2640D04", "MZ1-2640D04", "MZ1-2717A01", "MZ1-2717A01", "MZ1-2906D06", "MZ1-3103A01", "MZ1-3103A01", "MZ1-3104A03", "MZ1-3114D06", "MZ1-3115D02", "MZ1-3116D01", "MZ1-3117D04", "MZ1-3123D05", "MZ1-3142A02", "MZ1-3142A02", "MZ1-3142A02", "MZ1-3142A02", "MZ1-3142A02", "MZ1-3142A02", "MZ1-3231D06", "MZ1-3311A02", "MZ1-3316A02", "MZ1-3317A01", "MZ1-3323A03", "MZ1-3337A03", "MZ1-3337A03", "MZ1-3403D01", "MZ1-3403D01", "MZ1-3403D01", "MZ1-3403D01", "MZ1-3406D02", "MZ1-3407D06", "MZ1-3407D06", "MZ1-3626D01"];
let realPickerTour4 = ["MZ1-0107A02", "MZ1-0207A02", "MZ1-0318D05", "MZ1-0418D06", "MZ1-0518D06", "MZ1-0623A03", "MZ1-0725A03", "MZ1-0825A03", "MZ1-0927D03", "MZ1-1027D03", "MZ1-1129D01", "MZ1-1229D01", "MZ1-1329D01", "MZ1-1438A02", "MZ1-1538D05", "MZ1-1638D05", "MZ1-1738D05", "MZ1-1840A03", "MZ1-1940D01", "MZ1-2039D05", "MZ1-2139D05", "MZ1-2239D05", "MZ1-2340D04", "MZ1-2440D04", "MZ1-2540D04", "MZ1-2617A01", "MZ1-2717A01", "MZ1-2806D06", "MZ1-2903A01", "MZ1-3003A01", "MZ1-3104A03", "MZ1-3214D06", "MZ1-3315D02", "MZ1-3416D01", "MZ1-3517D04", "MZ1-3623D05"];
let pickerTour = ["MZ1-0926D03", "MZ1-2540A01", "MZ1-2708A03", "MZ1-2714D01", "MZ1-2716A01", "MZ1-2734D04", "MZ1-2734D04", "MZ1-2734D04", "MZ1-2734D04", "MZ1-2738D01", "MZ1-2738D01", "MZ1-2806D06", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2914A03", "MZ1-3115A01", "MZ1-3116D06", "MZ1-3124A02", "MZ1-3124A02", "MZ1-3124A02", "MZ1-3124A02", "MZ1-3138A01", "MZ1-3138A01", "MZ1-3138A01", "MZ1-3138A01", "MZ1-3138A01", "MZ1-3142A02", "MZ1-3142A02", "MZ1-3142A02", "MZ1-3142A02", "MZ1-3142D06", "MZ1-3205D04", "MZ1-3303D01", "MZ1-3305A02", "MZ1-3305A02", "MZ1-3318D05", "MZ1-3323A01", "MZ1-3328D04", "MZ1-3328D04", "MZ1-3328D04", "MZ1-3328D04", "MZ1-3328D04", "MZ1-3329D06", "MZ1-3407D01"];
const sortingArea = "MZ1-2444A01";
const sortingAreaMatrix = mapPickerTourLocationsToMatrixData(sortingArea);


const pickerTourToMatrix = realPickerTour2.map(mapPickerTourLocationsToMatrixData);
const uniqPickerTourLocations = _.uniqWith(pickerTourToMatrix, _.isEqual);


const uniqPickerTour = pickerTourWithSortingArea(uniqPickerTourLocations, sortingAreaMatrix);

function pickerTourWithSortingArea(uniqPickerTour, sortingArea) {
	let newPickerTour = uniqPickerTour.slice(0);
	newPickerTour.push(sortingArea);
	newPickerTour.reverse();
	newPickerTour.push(sortingArea);
	newPickerTour.reverse();

	return newPickerTour;
}








realPickerTour2 = _.uniq(realPickerTour2);


const matrix = createWarehouseMatrix(warehouseHeight / 2, defineWidthWithWalls(warehouseWidth * 2), warehouseSeparation);

const newPickerTour = realPickerTour2.map(function(cur, index) {
	return {
		name: cur,
		coordinates: mapPickerTourLocationsToMatrixData(cur),
		indexInMatrix: index
	};
});

function transformLocation(location, index = undefined) {
	let newLocation = {
		name: location,
		coordinates: mapPickerTourLocationsToMatrixData(location)
	};
	if (index) {
		newLocation.indexInMatrix = index;
	}
	return newLocation;
}

const matrixWithShortestPathBetweenLocations = createMatrixWithShortestPathBetweenLocations(matrix, newPickerTour);



function bestPickerTour(matrix, allLocationsForPickerTour, matrixWithShortestPathBetweenLocations, startingPoint, endingPoint, newPath, remainingLocationsToVisit, currentPosition = undefined) {

	function findClosestLocation(allLocationsForPickerTour, matrixWithShortestPathBetweenLocations, remainingLocationsToVisit, currentPosition) {
		if (currentPosition.indexInMatrix === undefined) {
			currentPosition.indexInMatrix = allLocationsForPickerTour.findIndex(function(cur) {
				return cur.name === currentPosition.name;
			});
		}
		let sortingDistance = matrixWithShortestPathBetweenLocations[currentPosition.indexInMatrix];
		let closestLocation = undefined;
		sortingDistance.sort(function(a, b) {
			if (a.pathLength < b.pathLength) {
				return -1;
			} else if (a.pathLength > b.pathLength) {
				return 1;
			} else {
				return 0;
			}
		});
		sortingDistance.map(function(cur) {
			let elem = remainingLocationsToVisit.findIndex(function(cur1) {
				return cur.name === cur1.name;
			});
			if (elem >= 0 && closestLocation === undefined) {
				return closestLocation = cur;
			}
		});
		return closestLocation;
	}

	let newRemainingLocationsToVisit = [];
	if (newPath.length === 0 && currentPosition === undefined) {
		let matrixForStarting = [];
		allLocationsForPickerTour.map(function(cur) {
			let newCur = {
				name: cur.name,
				coordinates: cur.coordinates,
				indexInMatrix: cur.indexInMatrix,
				pathLength: findPathLength(matrix, startingPoint, cur)
			};
			return matrixForStarting.push(newCur);
		});
		matrixForStarting.sort(function(a, b) {
			if (a.pathLength < b.pathLength) {
				return -1;
			} else if (a.pathLength > b.pathLength) {
				return 1;
			} else {
				return 0;
			}
		});
		newPath.push(findPath(matrix, startingPoint, matrixForStarting[0]));
		remainingLocationsToVisit.map(function(cur) {
			if (cur.indexInMatrix !== matrixForStarting[0].indexInMatrix) {
				return newRemainingLocationsToVisit.push(cur);
			}
		});

		return bestPickerTour(matrix, allLocationsForPickerTour, matrixWithShortestPathBetweenLocations, startingPoint, endingPoint, newPath, newRemainingLocationsToVisit, matrixForStarting[0]);

	} else if (remainingLocationsToVisit.length === 0) {
		newPath.push(findPath(matrix, currentPosition, endingPoint));

		return newPath;

	} else {
		let closestLocation = findClosestLocation(allLocationsForPickerTour, matrixWithShortestPathBetweenLocations, remainingLocationsToVisit, currentPosition);
		newPath.push(findPath(matrix, currentPosition, closestLocation));
		if (!closestLocation.indexInMatrix) {
			closestLocation.indexInMatrix = allLocationsForPickerTour.find(function(cur) {
				return cur.name === closestLocation.name;
			}).indexInMatrix;
		}
		remainingLocationsToVisit.map(function(cur) {
			if (cur.indexInMatrix !== closestLocation.indexInMatrix) {
				return newRemainingLocationsToVisit.push(cur);
			}
		});
		return bestPickerTour(matrix, allLocationsForPickerTour, matrixWithShortestPathBetweenLocations, startingPoint, endingPoint, newPath, newRemainingLocationsToVisit, closestLocation);
	}
}

const newBestPickerTour = bestPickerTour(matrix, newPickerTour, matrixWithShortestPathBetweenLocations, transformLocation(sortingArea), transformLocation(sortingArea), [], newPickerTour);

function findPath(matrix, origin, destination) {
	const grid = new PF.Grid(matrix);
	const finder = new PF.AStarFinder();
	let path = finder.findPath(origin.coordinates[0], origin.coordinates[1], destination.coordinates[0], destination.coordinates[1], grid);
	return path;
}

function findPathLength(matrix, origin, destination) {
	return findPath(matrix, origin, destination).length;
}



function separateBatches(data) {
	let newData = [];
	let previous = undefined;
	let tempBatch = [];
	data.map(function(cur, index, array) {
		if (index === array.length - 1) {
			tempBatch.push(cur);
			return newData.push(tempBatch);
		} else {
			if (previous === undefined) {
				tempBatch.push(cur);
				return previous = cur;
			} else {
				if (cur >= previous) {
					tempBatch.push(previous);
				} else {
					tempBatch.push(previous);
					newData.push(tempBatch);
					tempBatch = [];
				}
				return previous = cur;
			}
		}
	});
	return newData;
}

let newBatches = separateBatches(bigData);

let recordResult = []


newBatches.map(function(cur) {
	let newCur = _.uniq(cur);
	newCurSShaped = pickerTourWithSortingArea(newCur, sortingArea);
	let pickerTourforNewVersion = newCur.map(function(cur1, index) {
		return {
			name: cur1,
			coordinates: mapPickerTourLocationsToMatrixData(cur1),
			indexInMatrix: index
		};
	});
	let sShapedData = newCurSShaped.map(mapPickerTourLocationsToMatrixData);
	let matrixWithShortestPathBetweenLoc = createMatrixWithShortestPathBetweenLocations(matrix, pickerTourforNewVersion);
	let result = {
		locations: newCur,
		sShaped: drawPickerTourV2(matrix, sShapedData, 0),
		newVersion: drawPickerTourV2(matrix, bestPickerTour(matrix, pickerTourforNewVersion, matrixWithShortestPathBetweenLoc, transformLocation(sortingArea), transformLocation(sortingArea), [], pickerTourforNewVersion), 1).pop()
	};
	result.sShaped = result.sShaped[result.sShaped.length - 2];
	result.diff = result.newVersion - result.sShaped;
	return recordResult.push(result);
});

recordResult.map(function(cur) {
	return console.log(`Result -> S-Shaped : ${cur.sShaped} // newVersion : ${cur.newVersion} // diff : ${cur.diff}`);
});

console.log(recordResult);

console.log("Final result (Neg = newVersion rocks || Pos = S-Shaped rocks)", recordResult.reduce(function(prev, cur) {
	return prev + cur.diff;
}, 0));

// drawPickerTour :: Array -> Array -> Array
function drawPickerTourV2(matrix, pickerTour, version) {
	let pathLength = 0;
	if (version === 0) { // old S-shaped
		return pickerTour.map(function(cur, index, array) {
			const grid = new PF.Grid(matrix);
			const finder = new PF.AStarFinder({
				allowDiagonal: true
			});
			if (index !== array.length - 1) {
				let path = finder.findPath(cur[0], cur[1], array[index + 1][0], array[index + 1][1], grid);
				return pathLength += path.length;
			}
		});
	} else if (version === 1) { // new version
		return pickerTour.map(function(cur) {
			return pathLength += cur.length;
		});
	}
	return pathLength;
}













/*// init
//drawWarehouseAndPickerTour(warehouseHeight, warehouseWidth, warehouseSeparation, pickerTourInSequence(uniqPickerTour, 2), 0);
drawWarehouseAndPickerTour(warehouseHeight, warehouseWidth, warehouseSeparation, pickerTourInSequence(newBestPickerTour, 1), 1);

// Event to display the next location to go in the HTML
$('#drawNextLocation').on('click', function() {
	$('.row').remove();
	const nbLocations = Number($(this).attr('data-nblocations'));
	$(this).attr('data-nblocations', nbLocations + 1);
	//return drawWarehouseAndPickerTour(warehouseHeight, warehouseWidth, warehouseSeparation, pickerTourInSequence(uniqPickerTour, nbLocations), 0);
	return drawWarehouseAndPickerTour(warehouseHeight, warehouseWidth, warehouseSeparation, pickerTourInSequence(newBestPickerTour, nbLocations), 1);
});*/
