// shortestPathBetweenLocations :: Object -> String -> [String]
function shortestPathBetweenLocations(matrixWithShortestPathBetweenLocations, startingPoint) {
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
		if (notInVisitedLocations.length === 0) {
			let newList = [];
			newList.push(matrixWithShortestPathBetweenLocations.ref[0].name);
			return newList;
		}
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

	let visitedLocations = [];
	let startingPointInMatrix = matrixWithShortestPathBetweenLocations.ref.find(function(cur) {
		return cur.name === startingPoint;
	});

	if (startingPointInMatrix === undefined) {
		return [];
	} else {
		visitedLocations.push(startingPointInMatrix);
	}
	return findClosestLocation(matrixWithShortestPathBetweenLocations, startingPointInMatrix, visitedLocations);
}

function createShortestPath(matrix, sortingArea, locationsList, functionToApply) {
	let pickerTour = startAndEndAtSameALocation(sortingArea, uniqLocations(locationsList));
	let short = createMatrixWithShortestPathBetweenLocations(matrix, uniqLocations(pickerTour), functionToApply);
	let shortestPath = shortestPathBetweenLocations(short, sortingArea);
	return createPathBetweenManyLocations(matrix, locationsListToMatrixData(shortestPath, functionToApply));
}
