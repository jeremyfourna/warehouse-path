//////////////
// Utils //
////////////

// uniqLocations :: [String] -> [String]
function uniqLocations(listOfLocations) {
	return _.uniq(listOfLocations);
}

// uniqMatrixLocations :: [Array] -> [Array]
function uniqMatrixLocations(listOfMatrixLocations) {
	return _.uniqBy(listOfMatrixLocations, _.isEqual);
}

// nbStepsForAPickerTour :: [Array] -> Number
function nbStepsForAPickerTour(pickerTour) {
	return pickerTour.reduce(function(prev, cur) {
		return prev + cur.length;
	}, 0);
}

////////////////////////////////////////////////////////////////////////
// Transform origin picker tour to matrix data //
//////////////////////////////////////////////////////////////////////

// locationsListToMatrixData :: [String] -> Function -> Function
function locationsListToMatrixData(locationsList, functionToApply) {
	return locationsList.map(functionToApply);
}

// locationToMatrixData :: String -> Function -> Function
function locationToMatrixData(location, functionToApply) {
	return functionToApply(location);
}

/////////////////////////////////////////////////////////////////////////////////////
// Add starting and/or ending point to the picker tour //
///////////////////////////////////////////////////////////////////////////////////

// startAndEndAtSameALocation :: String -> [String] -> [String]
function startAndEndAtSameALocation(location, locationsList) {
	return endAtALocation(location, startFromALocation(location, locationsList));
}

// startFromALocation :: String -> [String] -> [String]
function startFromALocation(startingLocation, locationsList) {
	let newLocationsList = locationsList.slice(0);
	newLocationsList.reverse().push(startingLocation);
	return newLocationsList.reverse();
}

// endAtALocation :: String -> [String] -> [String]
function endAtALocation(endingLocation, locationsList) {
	let newLocationsList = locationsList.slice(0);
	newLocationsList.push(endingLocation);
	return newLocationsList;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// Functions responsible to display the picker tour on the page //
/////////////////////////////////////////////////////////////////////////////////////////////////

// highlightPathBetweenManyLocations :: NodeList -> [Array] -> [Array]
function highlightPathBetweenManyLocations(nodeList, path) {
	return path.map(function(cur) {
		return highlightPathBetweenTwoLocations(nodeList, cur);
	});
}

// highlightPathBetweenTwoLocations :: NodeList -> [Array] -> [Array]
function highlightPathBetweenTwoLocations(nodeList, path) {

	// addClassOnNode :: Number -> String
	function addClassOnNode(nbOfClass) {
		return ` path${nbOfClass}`;
	}

	return path.map(function(cur, index, array) {
		let node = nodeList[cur[1]].children[cur[0]];
		if (index === 0 || index === array.length - 1) {
			node.textContent = "*";
			node.className = 'location';
		} else {
			node.className += addClassOnNode(node.classList.length);
		}
	});
}

// pickerTourInSequence :: [Array] -> Number -> [Array]
function pickerTourInSequence(pickerTour, nbLocations) {
	if (nbLocations > pickerTour.length) {
		return pickerTour;
	} else {
		const newPickerTour = pickerTour.slice(0, nbLocations);
		return newPickerTour;
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions responsible to create a path between 2 or more matrix data points //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// createPathBetweenManyLocations :: warehouseMatrix -> [Array] -> [Array]
function createPathBetweenManyLocations(matrix, locations) {
	let path = [];
	let previousLocation = undefined;
	locations.map(function(cur, index) {
		if (previousLocation === undefined) {
			return previousLocation = cur;
		} else {
			path.push(createPathBetweenTwoLocations(matrix, previousLocation, cur));
			return previousLocation = cur;
		}
	});
	// Add the path to return to the point of origin
	path.push(createPathBetweenTwoLocations(matrix, locations[locations.length - 1], locations[0]));
	return path;
}

// createPathBetweenTwoLocations :: warehouseMatrix -> [Number, Number] -> [Number, Number] -> [Array]
function createPathBetweenTwoLocations(matrix, originLocation, destinationLocation) {
	const grid = new PF.Grid(matrix);
	const finder = new PF.AStarFinder({
		allowDiagonal: true
	});
	return finder.findPath(originLocation[0], originLocation[1], destinationLocation[0], destinationLocation[1], grid);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function that will a matrix between all the locations of a picker tour //
// Should be used with an algo function to find best path                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// createMatrixWithShortestPathBetweenLocations :: [Array] -> [String] -> Function -> [Array]
function createMatrixWithShortestPathBetweenLocations(matrix, pickerTour, functionToApply) {
	// pickerTour should also contain the point of origin/return
	let ref = [];
	let shortestMatrix = [];
	pickerTour.map(function(cur, index) {
		return ref.push({
			name: cur,
			coordinates: locationToMatrixData(cur, functionToApply),
			indexInMatrix: index
		});
	});

	ref.map(function(cur, index, array) {
		let pathForEachLocations = [];
		ref.map(function(cur1, index1, array1) {
			const path = createPathBetweenTwoLocations(matrix, cur.coordinates, cur1.coordinates);
			return pathForEachLocations.push({
				name: cur1.name,
				coordinates: cur1.coordinates,
				pathLength: path.length
			});
		});
		return shortestMatrix.push(pathForEachLocations);
	});

	return {
		ref,
		matrix: shortestMatrix
	};
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Final functions display, calculate differences between differents algo //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// testAlgoOnManyBatchesReduce :: [Array] -> [Array] -> String -> Number
function testAlgoOnManyBatchesReduce(matrix, listOfBatches, sortingArea) {
	return listOfBatches.reduce(function(prev, cur, index) {
		let pickerTour = startAndEndAtSameALocation(sortingArea, sShapedLocationAsc(uniqLocations(cur)));

		// S-Shaped
		let sShaped = nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, locationsListToMatrixData(pickerTour, westwingLocationToMatrixData)));
		// Shortest path
		let short = createMatrixWithShortestPathBetweenLocations(matrix, uniqLocations(pickerTour), westwingLocationToMatrixData);
		let shortestPath = shortestPathBetweenLocations(short, sortingArea);
		let shortest = nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, locationsListToMatrixData(shortestPath, westwingLocationToMatrixData)));

		console.log(`Result ${index} : `, shortest - sShaped, "nbStepsForAPickerTour sShaped", sShaped, "nbStepsForAPickerTour shortest", shortest, "gain", _.round((shortest - sShaped) / sShaped * 100, 2), "%");

		return prev + shortest - sShaped;
	}, 0);
}

// testAlgoOnManyBatchesDisplay :: [Array] -> [Array] -> String -> Number -> Boolean -> Nodelist
function testAlgoOnManyBatchesDisplay(matrix, listOfBatches, sortingArea, nbLocations = 1, cleanUp = false) {
	return listOfBatches.map(function(cur, index) {
		if (cleanUp === true) {
			$(`.row${index}`).remove();
			$(`.superRow${index}`).remove();
		}
		let pickerTour = startAndEndAtSameALocation(sortingArea, sShapedLocationAsc(uniqLocations(cur)));

		// S-Shaped
		let nodeMatrix = drawWarehouse(matrix, "body", `row${index}`);
		highlightPathBetweenManyLocations(nodeMatrix, pickerTourInSequence(createPathBetweenManyLocations(matrix, locationsListToMatrixData(pickerTour, westwingLocationToMatrixData)), nbLocations));
		// Shortest path
		let nodeMatrix1 = drawWarehouse(matrix, "body", `superRow${index}`);
		let short = createMatrixWithShortestPathBetweenLocations(matrix, uniqLocations(pickerTour), westwingLocationToMatrixData);
		let shortestPath = shortestPathBetweenLocations(short, sortingArea);
		highlightPathBetweenManyLocations(nodeMatrix1, pickerTourInSequence(createPathBetweenManyLocations(matrix, locationsListToMatrixData(shortestPath, westwingLocationToMatrixData)), nbLocations));
	});
}

// testAlgoOnManyBatchesResultForCSV :: [Array] -> [Array] -> String -> [Object]
function testAlgoOnManyBatchesResultForCSV(matrix, listOfBatches, sortingArea, tagToAppendResults = "body") {
	let results = [];

	listOfBatches.map(function(cur, index) {
		let pickerTour = startAndEndAtSameALocation(sortingArea, sShapedLocationAsc(uniqLocations(cur)));

		// S-Shaped
		let sShaped = nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, locationsListToMatrixData(pickerTour, westwingLocationToMatrixData)));
		// Shortest path
		let short = createMatrixWithShortestPathBetweenLocations(matrix, uniqLocations(pickerTour), westwingLocationToMatrixData);
		let shortestPath = shortestPathBetweenLocations(short, sortingArea);
		let shortest = nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, locationsListToMatrixData(shortestPath, westwingLocationToMatrixData)));

		let resultForABatch = {
			pickerTourLength: pickerTour.length,
			sShapedSteps: sShaped,
			shortestSteps: shortest,
			diff: shortest - sShaped,
			gain: _.round((shortest - sShaped) / sShaped * 100, 2)
		};

		return results.push(resultForABatch);
	});

	let str = JSON.stringify(results, null, 4);

	return $(tagToAppendResults).append(`<code>${str}</code>`);
}
