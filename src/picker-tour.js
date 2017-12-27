const R = require('ramda');
const PF = require('pathfinding');

//////////////////////////////////////////////////
// Transform origin picker tour to matrix data //
////////////////////////////////////////////////

// locationsListToMatrixData :: Function [String] -> [Array]
function locationsListToMatrixData(functionToApply, locationsList) {
  return R.map(functionToApply, locationsList);
}

// locationToMatrixData :: Function String -> [Array]
function locationToMatrixData(functionToApply, location) {
  return functionToApply(location);
}

//////////////////////////////////////////////////////////
// Add starting and/or ending point to the picker tour //
////////////////////////////////////////////////////////

// startAndEndAtSameALocation :: String [String] -> [String]
function startAndEndAtSameALocation(location, locationsList) {
  return endAtALocation(location, startFromALocation(location, locationsList));
}

// startFromALocation :: String [String] -> [String]
function startFromALocation(startingLocation, locationsList) {
  return R.prepend(startingLocation, locationsList);
}

// endAtALocation :: String [String] -> [String]
function endAtALocation(endingLocation, locationsList) {
  return R.append(endingLocation, locationsList);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions responsible to create a path between 2 or more matrix data points //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// pathBtwManyLocations :: warehouseMatrix [Array] -> [Array]
function pathBtwManyLocations(matrix, locations) {
  const firstLocation = R.head(locations);
  const remainingLocations = R.tail(locations);

  return R.head(R.reduce((prev, cur) => {
    return [R.append(pathBtwTwoLocations(matrix, R.last(prev), cur), R.head(prev)), cur];
  }, [
    [], firstLocation
  ], remainingLocations));
}

// pathBtwTwoLocations :: warehouseMatrix [Number, Number] [Number, Number] -> [Array]
function pathBtwTwoLocations(matrix, origin, destination) {
  const grid = new PF.Grid(matrix);
  const finder = new PF.AStarFinder({
    allowDiagonal: true
  });

  return finder.findPath(...origin, ...destination, grid);
}

////////////////////////////////////////////////////////////////////////////////////
// Function that will define a matrix between all the locations of a picker tour //
// Should be used with an algo function to find best path                       //
/////////////////////////////////////////////////////////////////////////////////

// matrixWithShortestPathBtwLocations :: warehouseMatrix [String] Function -> Object
function matrixWithShortestPathBtwLocations(matrix, pickerTour, functionToApply) {
  // pickerTour should also contain the point of origin/return
  const mapIndexed = R.addIndex(R.map);

  const ref = mapIndexed((cur, index) => {
    return {
      name: cur,
      coordinates: locationToMatrixData(functionToApply, cur),
      indexInMatrix: index
    };
  }, pickerTour);

  const shortestMatrix = R.map(cur => {
    return R.map(cur1 => {
      const path = pathBtwTwoLocations(matrix, R.prop('coordinates', cur), R.prop('coordinates', cur1));
      return {
        name: R.prop('name', cur1),
        coordinates: R.prop('coordinates', cur1),
        pathLength: R.length(path)
      };
    }, ref);
  }, ref);

  return {
    ref,
    matrix: shortestMatrix
  };
}


exports.endAtALocation = endAtALocation;
exports.locationsListToMatrixData = locationsListToMatrixData;
exports.matrixWithShortestPathBtwLocations = matrixWithShortestPathBtwLocations;
exports.pathBtwManyLocations = pathBtwManyLocations;
exports.startAndEndAtSameALocation = startAndEndAtSameALocation;
exports.startFromALocation = startFromALocation;
