// locationsListToMatrixData :: [String] -> Function -> Function
function locationsListToMatrixData(locationsList, functionToApply) {
	return locationsList.map(functionToApply);
}

// locationToMatrixData :: String -> Function -> Function
function locationToMatrixData(location, functionToApply) {
	return functionToApply(location);
}

// uniqLocations :: [String] -> [String]
function uniqLocations(listOfLocations) {
	return _.uniq(listOfLocations);
}

// uniqMatrixLocations :: [Array] -> [Array]
function uniqMatrixLocations(listOfMatrixLocations) {
	return _.uniqBy(listOfMatrixLocations, _.isEqual);
}


// highlightPathBetweenTwoLocations :: NodeList -> [Array] -> NodeList
function highlightPathBetweenTwoLocations(nodeList, path) {

	// addClassOnNode :: Number -> String
	function addClassOnNode(nbOfClass) {
		return ` path${nbOfClass}`;
	}

	path.map(function(cur, index, array) {
		for (let i = 0; i < nodeList.length; i++) {
			if (i === cur[1]) {
				for (let j = 0; j < nodeList[i].children.length; j++) {
					if (j === cur[0]) {
						let node = nodeList[i].children[j];
						if (index === 0 || index === array.length - 1) {
							nodeList[i].children[j].textContent = "*";
							node.className = 'location';
						} else {
							node.className += addClassOnNode(node.classList.length);
						}
						break;
					}
				}
			}
		}
	});

	return nodeList;
}

// startFromALocation :: String -> [String] -> [String]
function startFromALocation(startingLocation, locationsList) {
	let newLocationsList = locationsList.slice(0);
	newLocationsList.reverse().push(startingLocation);
	return newLocationsList.reverse();
}

// endToALocation :: String -> [String] -> [String]
function endToALocation(endingLocation, locationsList) {
	let newLocationsList = locationsList.slice(0);
	newLocationsList.push(endingLocation);
	return newLocationsList;
}

// startAndEndAtSameALocation :: String -> [String] -> [String]
function startAndEndAtSameALocation(location, locationsList) {
	return endToALocation(location, startFromALocation(location, locationsList));
}

// highlightPathBetweenManyLocations :: NodeList -> [Array] -> NodeList
function highlightPathBetweenManyLocations(nodeList, path) {
	return path.map(function(cur) {
		return highlightPathBetweenTwoLocations(nodeList, cur);
	});
}

// createPathBetweenTwoLocations :: [Array] -> [Number, Number] -> [Number, Number] -> [Array]
function createPathBetweenTwoLocations(matrix, originLocation, destinationLocation) {
	const grid = new PF.Grid(matrix);
	const finder = new PF.AStarFinder({
		allowDiagonal: true
	});
	return finder.findPath(originLocation[0], originLocation[1], destinationLocation[0], destinationLocation[1], grid);
}

// createPathBetweenManyLocations :: [Array] -> [Array] -> [Array]
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

// pickerTourInSequence :: [Array] -> Number -> [Array]
function pickerTourInSequence(pickerTour, nbLocations) {
	if (nbLocations > pickerTour.length) {
		return pickerTour;
	} else {
		const newPickerTour = pickerTour.slice(0, nbLocations);
		return newPickerTour;
	}
}

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

// shortestPathBetweenLocations :: Object -> String -> [String]
function shortestPathBetweenLocations(matrixWithShortestPathBetweenLocations, startingPoint, functionToApply) {
	let visitedLocations = [];
	let startingPointInMatrix = matrixWithShortestPathBetweenLocations.ref.find(function(cur) {
		return cur.name === startingPoint;
	});
	if (startingPointInMatrix === undefined) {
		return [];
	} else {
		visitedLocations.push(startingPointInMatrix);
	}
	return functionToApply(matrixWithShortestPathBetweenLocations, startingPointInMatrix, visitedLocations);
}

// findClosestLocation :: matrixWithShortestPathBetweenLocations -> Object -> [Object]
function findClosestLocation(matrixWithShortestPathBetweenLocations, currentPosition, visitedLocations) {
	let sortingDistance = matrixWithShortestPathBetweenLocations.matrix[currentPosition.indexInMatrix];
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
	let notInVisitedLocations = _.differenceBy(sortingDistance, visitedLocations, "name");
	closestLocation = matrixWithShortestPathBetweenLocations.ref.find(function(cur) {
		return cur.name === notInVisitedLocations[0].name;
	});
	visitedLocations.push(closestLocation);
	if (visitedLocations.length !== matrixWithShortestPathBetweenLocations.ref.length) {
		return findClosestLocation(matrixWithShortestPathBetweenLocations, closestLocation, visitedLocations);
	} else {
		return visitedLocations.map(function(cur) {
			return cur.name;
		});
	}
}

// nbStepsForAPickerTour :: [Array] -> Number
function nbStepsForAPickerTour(pickerTour) {
	return pickerTour.reduce(function(prev, cur) {
		return prev + cur.length;
	}, 0);
}
