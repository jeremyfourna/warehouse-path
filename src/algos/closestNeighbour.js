const R = require('ramda');

const {
  locationsListToMatrixData,
  matrixWithShortestPathBtwLocations,
  pathBtwManyLocations,
  startAndEndAtSameALocation
} = require('warehouse-picker-tour');

// shortestPathBetweenLocations :: Object -> String -> [String]
function shortestPathBetweenLocations(mWSPBL, startingPoint) {
  // mWSPBL = matrix With Shortest Path Between Locations
  function sortByPathLength(list) {
    const byLength = R.ascend(R.prop('pathLength'));

    return R.sort(byLength, list);
  }
  // findClosestLocation :: mWSPBL -> Object -> [Object]
  function findClosestLocation(mWSPBL, currentPosition, visitedLocations) {
    // mWSPBL = matrix With Shortest Path Between Locations
    const notEquals = R.complement(R.equals);
    const sortingDistanceFromCurrentPosition = R.path(['matrix', R.prop('indexInMatrix', currentPosition)], mWSPBL);
    const sortingDistanceFromCurrentPositionSorted = sortByPathLength(sortingDistanceFromCurrentPosition);

    const notInVisitedLocations = R.differenceWith(
      (x, y) => R.equals(R.prop('name', x), R.prop('name', y)),
      sortingDistanceFromCurrentPositionSorted,
      visitedLocations
    );

    const closestLocation = R.find(
      cur => R.equals(R.prop('name', cur), R.path([0, 'name'], notInVisitedLocations)),
      R.prop('ref', mWSPBL)
    );

    const newVisitedLocations = R.append(closestLocation, visitedLocations);

    if (notEquals(R.length(newVisitedLocations), R.length(R.prop('ref', mWSPBL)))) {
      return findClosestLocation(mWSPBL, closestLocation, newVisitedLocations);
    } else {
      return R.append(startingPoint, R.map(R.prop('name'), visitedLocations));
    }
  }

  const startingPointInMatrix = R.find(R.propEq('name', startingPoint), R.prop('ref', mWSPBL));

  return findClosestLocation(mWSPBL, startingPointInMatrix, [startingPointInMatrix]);
}

function shortestClosestNeighbourPath(matrix, sortingArea, locationsList, functionToApply) {
  const pickerTour = startAndEndAtSameALocation(sortingArea, R.uniq(locationsList));
  const matrixShortestPath = matrixWithShortestPathBtwLocations(matrix, R.uniq(pickerTour), functionToApply);
  const shortestPath = shortestPathBetweenLocations(matrixShortestPath, sortingArea);

  return pathBtwManyLocations(matrix, locationsListToMatrixData(functionToApply, shortestPath));
}

exports.shortestClosestNeighbourPath = shortestClosestNeighbourPath;
exports.shortestPathBetweenLocations = shortestPathBetweenLocations;
