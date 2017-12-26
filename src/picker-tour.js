const R = require('ramda');
const PF = require('pathfinding');
const { nbSteps } = require('./utils');

//////////////////////////////////////////////////
// Transform origin picker tour to matrix data //
////////////////////////////////////////////////

// locationsListToMatrixData :: Function [String] -> [Array]
function locationsListToMatrixData(functionToApply, locationsList) {
  return R.map(functionToApply, locationsList)
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
  const path = R.reduce((prev, cur) => {
    return [R.append(pathBtwTwoLocations(matrix, R.last(prev), cur), R.head(prev)), cur];
  }, [
    [], undefined

  ], locations);
  // Add the path to return to the poin
  return R.append(pathBtwTwoLocations(matrix, R.last(locations), R.head(locations)));
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

// createMatrixWithShortestPathBetweenLocations :: warehouseMatrix [String] Function -> Object
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

  ref.map(function(cur) {
    let pathForEachLocations = [];
    ref.map(function(cur1) {
      const path = pathBtwTwoLocations(matrix, cur.coordinates, cur1.coordinates);
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

// testClosestNeightbourAgainstSShapedOnManyBatchesReduce :: [Array] -> [Array] -> String -> Function -> Object
function testClosestNeightbourAgainstSShapedOnManyBatchesReduce(matrix, listOfBatches, sortingArea, functionToApply) {
  return listOfBatches.reduce(function(prev, cur, index) {
    // S-Shaped
    let sShaped = nbSteps(pathBtwManyLocations(matrix, createShorterSShapedPath(sortingArea, cur, functionToApply)));
    // Shortest path
    let shortest = nbSteps(pathBtwManyLocations(matrix, createShortestPath(matrix, sortingArea, cur, functionToApply)));

    console.log(`ClosestNeighbour against S-Shaped : Result ${index} = nbSteps sShaped ${sShaped} nbSteps shortest  ${shortest} gain ${shortest - sShaped} so ${_.round((shortest - sShaped) / sShaped * 100, 2)} %`);

    prev.sShaped += sShaped;
    prev.shortest += shortest;
    prev.shortestGainOverSShaped += shortest - sShaped;

    return prev;
  }, { sShaped: 0, shortest: 0, shortestGainOverSShaped: 0 });
}

// testEllipseAgainstSShapedOnManyBatchesReduce :: [Array] -> [Array] -> String -> Function -> Object
function testEllipseAgainstSShapedOnManyBatchesReduce(matrix, listOfBatches, sortingArea, functionToApply) {
  return listOfBatches.reduce(function(prev, cur, index) {
    // S-Shaped
    let sShaped = nbSteps(pathBtwManyLocations(matrix, createShorterSShapedPath(sortingArea, cur, functionToApply)));
    // Shortest via ellipse
    let ellipse = nbSteps(pathBtwManyLocations(matrix, createShortestPathViaEllipse(matrix, sortingArea, cur, functionToApply)));

    console.log(`Ellipse against S-Shaped : Result ${index} = nbSteps sShaped ${sShaped} nbSteps ellipse  ${ellipse} gain ${ellipse - sShaped} so ${_.round((ellipse - sShaped) / sShaped * 100, 2)} %`);

    prev.sShaped += sShaped;
    prev.ellipse += ellipse;
    prev.ellipseGainOverSShaped += ellipse - sShaped;
    return prev;
  }, { sShaped: 0, ellipse: 0, ellipseGainOverSShaped: 0 });
}

// testClosestNeightbourAgainstSShapedOnManyBatchesDisplay :: [Array] -> [Array] -> String -> Function  -> Number -> Boolean -> ?
function testClosestNeightbourAgainstSShapedOnManyBatchesDisplay(matrix, listOfBatches, sortingArea, functionToApply, nbLocations = 1, cleanUp = false) {
  return listOfBatches.map(function(cur, index) {
    if (cleanUp === true) {
      $(`.row${index}`).remove();
      $(`.superRow${index}`).remove();
    }

    // S-Shaped
    let nodeMatrix = drawWarehouse(matrix, "body", `row${index}`);
    highlightPathBetweenManyLocations(
      nodeMatrix,
      pickerTourInSequence(
        pathBtwManyLocations(
          matrix,
          createShorterSShapedPath(
            sortingArea,
            cur,
            functionToApply
          )
        ),
        nbLocations
      )
    );
    // Shortest path
    let nodeMatrix1 = drawWarehouse(matrix, "body", `superRow${index}`);
    highlightPathBetweenManyLocations(
      nodeMatrix1,
      pickerTourInSequence(
        pathBtwManyLocations(
          matrix,
          createShortestPath(
            matrix,
            sortingArea,
            cur,
            functionToApply
          )
        ),
        nbLocations
      )
    );
  });
}

// testEllipseAgainstSShapedOnManyBatchesDisplay :: [Array] -> [Array] -> String -> Function  -> Number -> Boolean -> ?
function testEllipseAgainstSShapedOnManyBatchesDisplay(matrix, listOfBatches, sortingArea, functionToApply, nbLocations = 1, cleanUp = false) {
  return listOfBatches.map(function(cur, index) {
    if (cleanUp === true) {
      $(`.row${index}`).remove();
      $(`.superRow${index}`).remove();
    }

    // S-Shaped
    let nodeMatrix = drawWarehouse(matrix, "body", `row${index}`);
    highlightPathBetweenManyLocations(
      nodeMatrix,
      pickerTourInSequence(
        pathBtwManyLocations(
          matrix,
          createShorterSShapedPath(
            sortingArea,
            cur,
            functionToApply
          )
        ),
        nbLocations
      )
    );
    // Ellipse path
    let nodeMatrix1 = drawWarehouse(matrix, "body", `superRow${index}`);
    highlightPathBetweenManyLocations(
      nodeMatrix1,
      pickerTourInSequence(
        pathBtwManyLocations(
          matrix,
          createShortestPathViaEllipse(
            matrix,
            sortingArea,
            cur,
            functionToApply
          )
        ),
        nbLocations
      )
    );
  });
}

// testClosestNeightbourAgainstSShapedOnManyBatchesResultForCSV::[Array] -> [Array] -> String -> Function -> [Object]
function testClosestNeightbourAgainstSShapedOnManyBatchesResultForCSV(matrix, listOfBatches, sortingArea, functionToApply, tagToAppendResults = "body") {
  let results = [];

  listOfBatches.map(function(cur, index) {
    let pickerTour = startAndEndAtSameALocation(sortingArea, sShapedLocationAsc(uniqLocations(cur)));

    // S-Shaped
    let sShaped = nbSteps(pathBtwManyLocations(matrix, createShorterSShapedPath(sortingArea, cur, functionToApply)));
    // Shortest path
    let shortest = nbSteps(pathBtwManyLocations(matrix, createShortestPath(matrix, sortingArea, cur, functionToApply)));

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

// testEllipseAgainstSShapedOnManyBatchesResultForCSV::[Array] - > [Array] -> String -> Function -> [Object]
function testEllipseAgainstSShapedOnManyBatchesResultForCSV(matrix, listOfBatches, sortingArea, functionToApply, tagToAppendResults = "body") {
  let results = [];

  listOfBatches.map(function(cur, index) {
    let pickerTour = startAndEndAtSameALocation(sortingArea, sShapedLocationAsc(uniqLocations(cur)));

    // S-Shaped
    let sShaped = nbSteps(pathBtwManyLocations(matrix, createShorterSShapedPath(sortingArea, cur, functionToApply)));
    // Shortest via ellipse
    let ellipse = nbSteps(pathBtwManyLocations(matrix, createShortestPathViaEllipse(matrix, sortingArea, cur, functionToApply)));

    let resultForABatch = {
      pickerTourLength: pickerTour.length,
      sShapedSteps: sShaped,
      ellipseSteps: ellipse,
      diff: ellipse - sShaped,
      gain: _.round((ellipse - sShaped) / sShaped * 100, 2)
    };

    return results.push(resultForABatch);
  });

  let str = JSON.stringify(results, null, 4);

  return $(tagToAppendResults).append(`<code>${str}</code>`);
}


exports.startFromALocation = startFromALocation;
exports.endAtALocation = endAtALocation;
exports.startAndEndAtSameALocation = startAndEndAtSameALocation;
