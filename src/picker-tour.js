const R = require('ramda')


exports.nbStepsForAPickerTour = nbStepsForAPickerTour

//////////////
// Utils //
////////////

// nbStepsForAPickerTour :: [Array] -> Number
function nbStepsForAPickerTour(pickerTour) {
  return R.reduce((prev, cur) => {
    return R.add(prev, R.length(cur))
  }, 0, pickerTour)
}

////////////////////////////////////////////////////////////////////////
// Transform origin picker tour to matrix data //
//////////////////////////////////////////////////////////////////////

// locationsListToMatrixData :: [String] -> Function -> Function
function locationsListToMatrixData(functionToApply, locationsList) {
  return R.map(functionToApply, locationsList)
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

// createMatrixWithShortestPathBetweenLocations :: warehouseMatrix -> [String] -> Function -> Object
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

// testClosestNeightbourAgainstSShapedOnManyBatchesReduce :: [Array] -> [Array] -> String -> Function -> Object
function testClosestNeightbourAgainstSShapedOnManyBatchesReduce(matrix, listOfBatches, sortingArea, functionToApply) {
  return listOfBatches.reduce(function(prev, cur, index) {
    // S-Shaped
    let sShaped = nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, createShorterSShapedPath(sortingArea, cur, functionToApply)));
    // Shortest path
    let shortest = nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, createShortestPath(matrix, sortingArea, cur, functionToApply)));

    console.log(`ClosestNeighbour against S-Shaped : Result ${index} = nbStepsForAPickerTour sShaped ${sShaped} nbStepsForAPickerTour shortest  ${shortest} gain ${shortest - sShaped} so ${_.round((shortest - sShaped) / sShaped * 100, 2)} %`);

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
    let sShaped = nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, createShorterSShapedPath(sortingArea, cur, functionToApply)));
    // Shortest via ellipse
    let ellipse = nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, createShortestPathViaEllipse(matrix, sortingArea, cur, functionToApply)));

    console.log(`Ellipse against S-Shaped : Result ${index} = nbStepsForAPickerTour sShaped ${sShaped} nbStepsForAPickerTour ellipse  ${ellipse} gain ${ellipse - sShaped} so ${_.round((ellipse - sShaped) / sShaped * 100, 2)} %`);

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
        createPathBetweenManyLocations(
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
        createPathBetweenManyLocations(
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
        createPathBetweenManyLocations(
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
        createPathBetweenManyLocations(
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
    let sShaped = nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, createShorterSShapedPath(sortingArea, cur, functionToApply)));
    // Shortest path
    let shortest = nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, createShortestPath(matrix, sortingArea, cur, functionToApply)));

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
    let sShaped = nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, createShorterSShapedPath(sortingArea, cur, functionToApply)));
    // Shortest via ellipse
    let ellipse = nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, createShortestPathViaEllipse(matrix, sortingArea, cur, functionToApply)));

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
