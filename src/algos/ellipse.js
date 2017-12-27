const R = require('ramda');

const {
  locationsListToMatrixData,
  startFromALocation
} = require('../picker-tour');

// createEllipse :: [Array] -> [Array]
function createEllipse(locationsCoordinates) {
  const xMin = R.reduce(R.minBy(R.head), [Infinity, 0], locationsCoordinates);
  const xMax = R.reduce(R.maxBy(R.head), [-1, 0], locationsCoordinates);

  const yMin = R.reduce(R.maxBy(R.last), [0, -1], locationsCoordinates);
  const yMax = R.reduce(R.minBy(R.last), [0, Infinity], locationsCoordinates);

  const center = [
    Math.round(R.divide(R.add(R.head(xMin), R.head(xMax)), 2)),
    Math.round(R.divide(R.add(R.last(yMin), R.last(yMax)), 2))
  ];

  return [yMin, xMin, yMax, xMax, center];
}

// locationsInCorner :: [Number, Number] -> [Number, Number] -> [Number, Number] -> [Array] -> [Array]
function locationsInCorner(center, xPoint, yPoint, locationsCoordinatesInMatrix) {
  return locationsCoordinatesInMatrix.filter(function(cur) {
    //console.log(center, xPoint, yPoint, cur);
    if (xPoint[0] <= yPoint[0]) {
      if (xPoint[1] <= yPoint[1]) {
        // lower left corner
        // So we need the point to be under the vector from center to xPoint and before the vector from center to yPoint
        return cur[0] <= wantToKnowXPointForY(center, yPoint, cur)[0] && cur[1] > wantToKnowYPointForX(center, xPoint, cur)[1];
      } else {
        // upper left corner
        // So we need the point to be above the vector from center to xPoint and before the vector from center to yPoint
        return cur[0] <= wantToKnowXPointForY(center, yPoint, cur)[0] && cur[1] <= wantToKnowYPointForX(center, xPoint, cur)[1];
      }
    } else {
      if (xPoint[1] <= yPoint[1]) {
        // lower right corner
        // So we need the point to be above the vector from center to xPoint and after the vector from center to yPoint
        return cur[0] > wantToKnowXPointForY(center, yPoint, cur)[0] && cur[1] > wantToKnowYPointForX(center, xPoint, cur)[1];
      } else {
        // upper right corner
        // So we need the point to be under the vector from center to xPoint and after the vector from center to yPoint
        return cur[0] > wantToKnowXPointForY(center, yPoint, cur)[0] && cur[1] <= wantToKnowYPointForX(center, xPoint, cur)[1];
      }
    }
  });
}

function locationsListInCorner(ellipseData, locationsCoordinatesInMatrix) {
  let tempPickerTour = [];
  // lower left corner
  tempPickerTour.push(locationsInCorner(ellipseData[4], ellipseData[1], ellipseData[0], locationsCoordinatesInMatrix));
  // upper left corner
  tempPickerTour.push(locationsInCorner(ellipseData[4], ellipseData[1], ellipseData[2], locationsCoordinatesInMatrix));
  // upper left corner
  tempPickerTour.push(locationsInCorner(ellipseData[4], ellipseData[3], ellipseData[2], locationsCoordinatesInMatrix));
  // lower right
  tempPickerTour.push(locationsInCorner(ellipseData[4], ellipseData[3], ellipseData[0], locationsCoordinatesInMatrix));
  return tempPickerTour;
}

// wantToKnowYPointForX :: [Number, Number] -> [Number, Number] -> [Number, Number] -> [Number, Number]
function wantToKnowYPointForX(center, cardinal, locationCoordinates) {
  let xDiff = cardinal[0] - center[0];
  let yDiff = cardinal[1] - center[1];
  let yCorrelation = yDiff / xDiff;
  if (xDiff <= 0) {
    //console.log("wantToKnowYPointForX xDiff <= 0", [locationCoordinates[0], Math.round(center[1] - (center[0] - locationCoordinates[0]) * yCorrelation)]);
    return [locationCoordinates[0], Math.round(center[1] - (center[0] - locationCoordinates[0]) * yCorrelation)];
  } else {
    //console.log("wantToKnowYPointForX xDiff > 0", [locationCoordinates[0], Math.round(center[1] + (center[0] - locationCoordinates[0]) * yCorrelation)]);
    return [locationCoordinates[0], Math.round(center[1] + (locationCoordinates[0] - center[0]) * yCorrelation)];
  }
}

// wantToKnowXPointForY :: [Number, Number] -> [Number, Number] -> [Number, Number] -> [Number, Number]
function wantToKnowXPointForY(center, cardinal, locationCoordinates) {
  let xDiff = cardinal[0] - center[0];
  let yDiff = cardinal[1] - center[1];
  let xCorrelation = xDiff / yDiff;
  if (yDiff <= 0) {
    //console.log("wantToKnowXPointForY yDiff <= 0", [Math.round(center[0] - (center[1] - locationCoordinates[1]) * xCorrelation), locationCoordinates[1]]);
    return [Math.round(center[0] - (center[1] - locationCoordinates[1]) * xCorrelation), locationCoordinates[1]];
  } else {
    //console.log("wantToKnowXPointForY yDiff > 0", [Math.round(center[0] + (center[1] - locationCoordinates[1]) * xCorrelation), locationCoordinates[1]]);
    return [Math.round(center[0] + (locationCoordinates[1] - center[1]) * xCorrelation), locationCoordinates[1]];
  }
}

// removeCardinalPoints :: [Array] -> [Array] -> [Array]
function removeCardinalPoints(listOfLocationsByCardinalPoints, ellipseData) {
  return listOfLocationsByCardinalPoints.map(function(cur) {
    return cur.filter(function(cur1) {
      return !_.isEqual(cur1, ellipseData[0]) && !_.isEqual(cur1, ellipseData[1]) && !_.isEqual(cur1, ellipseData[2]) && !_.isEqual(cur1, ellipseData[3]);
    });
  });
}


// createMatrixWithShortestPathBetweenCornerLocations :: warehouseMatrix -> [Number, Number] -> [Number, Number] -> [Array] -> Object
function createMatrixWithShortestPathBetweenCornerLocations(matrix, startLocation, endLocation, cornerLocations) {
  let newCornerLocations = endAtALocation(endLocation, startFromALocation(startLocation, cornerLocations));
  let ref = [];
  let shortestMatrix = [];
  newCornerLocations.map(function(cur, index) {
    return ref.push({
      name: cur.toString(),
      coordinates: cur,
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

// shortestPathViaEllipse ::
function shortestPathViaEllipse(matrix, sortingArea, locationsList, functionToApply) {
  // Transform picketTour into matrix data
  const pickerTourForEllipse = locationsListToMatrixData(functionToApply, startFromALocation(sortingArea, R.uniq(locationsList)));
  // Create the ellipse for the pickerTour
  const ellipse = createEllipse(pickerTourForEllipse);

  // We need to remove the ellipse cardinal points from the picker tour
  const pickerTourWithoutCardinals = removeCardinalPoints(locationsListInCorner(ellipse, pickerTourForEllipse), ellipse);

  const matrixCorner1 = createMatrixWithShortestPathBetweenCornerLocations(matrix, ellipse[0], ellipse[1], pickerTourWithoutCardinals[0]);
  const matrixCorner2 = createMatrixWithShortestPathBetweenCornerLocations(matrix, ellipse[1], ellipse[2], pickerTourWithoutCardinals[1]);
  const matrixCorner3 = createMatrixWithShortestPathBetweenCornerLocations(matrix, ellipse[2], ellipse[3], pickerTourWithoutCardinals[2]);
  const matrixCorner4 = createMatrixWithShortestPathBetweenCornerLocations(matrix, ellipse[3], ellipse[0], pickerTourWithoutCardinals[3]);

  const shortestPathMatrixCorner1 = shortestPathBetweenLocations(matrixCorner1, ellipse[0].toString());
  const shortestPathMatrixCorner2 = shortestPathBetweenLocations(matrixCorner2, ellipse[1].toString());
  const shortestPathMatrixCorner3 = shortestPathBetweenLocations(matrixCorner3, ellipse[2].toString());
  const shortestPathMatrixCorner4 = shortestPathBetweenLocations(matrixCorner4, ellipse[3].toString());

  const finalpath = _.uniq(shortestPathMatrixCorner1.concat(shortestPathMatrixCorner2, shortestPathMatrixCorner3, shortestPathMatrixCorner4));

  let locList = finalpath.map(function(cur) {
    let newCur = cur.split(',');
    return [newCur[0], newCur[1]];
  });

  locList = endAtALocation(locList[0], locList);

  return locList;
}

exports.shortestPathViaEllipse = shortestPathViaEllipse;
