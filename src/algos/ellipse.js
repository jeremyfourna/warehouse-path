const R = require('ramda');

const {
  endAtALocation,
  locationsListToMatrixData,
  startFromALocation,
  pathBtwTwoLocations,
  pathBtwManyLocations
} = require('../picker-tour');
const { shortestPathBetweenLocations } = require('./closestNeighbour');
const { concat } = require('../utils');

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

// locationsInCorner :: [Number, Number] [Number, Number] [Number, Number] [Array] -> [Array]
function locationsInCorner(center, xPoint, yPoint, locationsCoordinates) {
  return R.filter(cur => {
    if (R.lte(R.head(xPoint), R.head(yPoint))) {
      if (R.lte(R.last(xPoint), R.last(yPoint))) {
        // lower left corner
        // So we need the point to be under the vector from center to xPoint
        // and before the vector from center to yPoint
        return R.lte(R.head(cur), R.head(wantToKnowXPointForY(center, yPoint, cur))) &&
          R.gt(R.last(cur), R.last(wantToKnowYPointForX(center, xPoint, cur)));
      } else {
        // upper left corner
        // So we need the point to be above the vector from center to xPoint
        // and before the vector from center to yPoint
        return R.lte(R.head(cur), R.head(wantToKnowXPointForY(center, yPoint, cur))) &&
          R.lte(R.last(cur), R.last(wantToKnowYPointForX(center, xPoint, cur)));
      }
    } else {
      if (R.lte(R.last(xPoint), R.last(yPoint))) {
        // lower right corner
        // So we need the point to be above the vector from center to xPoint
        // and after the vector from center to yPoint
        return R.gt(R.head(cur), R.head(wantToKnowXPointForY(center, yPoint, cur))) &&
          R.gt(R.last(cur), R.last(wantToKnowYPointForX(center, xPoint, cur)));
      } else {
        // upper right corner
        // So we need the point to be under the vector from center to xPoint
        // and after the vector from center to yPoint
        return R.gt(R.head(cur), R.head(wantToKnowXPointForY(center, yPoint, cur))) &&
          R.lte(R.last(cur), R.last(wantToKnowYPointForX(center, xPoint, cur)));
      }
    }
  }, locationsCoordinates);
}

function locationsListInCorner(ellipseData, locationsCoordinates) {
  return [
    // lower left corner
    locationsInCorner(R.last(ellipseData), R.nth(1, ellipseData), R.head(ellipseData), locationsCoordinates),
    // upper left corner
    locationsInCorner(R.last(ellipseData), R.nth(1, ellipseData), R.nth(2, ellipseData), locationsCoordinates),
    // upper left corner
    locationsInCorner(R.last(ellipseData), R.nth(3, ellipseData), R.nth(2, ellipseData), locationsCoordinates),
    // lower right
    locationsInCorner(R.last(ellipseData), R.nth(3, ellipseData), R.head(ellipseData), locationsCoordinates)
  ];
}

// wantToKnowYPointForX :: [Number, Number] -> [Number, Number] -> [Number, Number] -> [Number, Number]
function wantToKnowYPointForX(center, cardinal, locationCoordinates) {
  const xDiff = R.subtract(R.head(cardinal), R.head(center));
  const yDiff = R.subtract(R.last(cardinal), R.last(center));
  const yCorrelation = R.divide(yDiff, xDiff);
  if (R.lte(xDiff, 0)) {
    return [
      R.head(locationCoordinates),
      Math.round(R.subtract(
        R.last(center),
        R.multiply(
          R.subtract(
            R.head(center),
            R.head(locationCoordinates)
          ),
          yCorrelation)
      ))
    ];
  } else {
    return [
      R.head(locationCoordinates),
      Math.round(R.add(
        R.last(center),
        R.multiply(
          R.subtract(
            R.head(locationCoordinates),
            R.head(center)
          ),
          yCorrelation)
      ))
    ];
  }
}

// wantToKnowXPointForY :: [Number, Number] -> [Number, Number] -> [Number, Number] -> [Number, Number]
function wantToKnowXPointForY(center, cardinal, locationCoordinates) {
  const xDiff = R.subtract(R.head(cardinal), R.head(center));
  const yDiff = R.subtract(R.last(cardinal), R.last(center));
  const xCorrelation = R.divide(xDiff, yDiff);
  if (R.lte(yDiff, 0)) {
    return [
      Math.round(R.subtract(
        R.head(center),
        R.multiply(
          R.subtract(
            R.last(center),
            R.last(locationCoordinates)
          ),
          xCorrelation)
      )),
      R.last(locationCoordinates)
    ];
  } else {
    return [
      Math.round(R.add(
        R.head(center),
        R.multiply(
          R.subtract(
            R.last(locationCoordinates),
            R.last(center)
          ),
          xCorrelation)
      )),
      R.last(locationCoordinates)
    ];
  }
}

// removeCardinalPoints :: [Array] -> [Array] -> [Array]
function removeCardinalPoints(listOfLocationsByCardinalPoints, ellipseData) {
  const notEquals = R.complement(R.equals);
  return R.map(cur => {
    return R.filter(cur1 => {
      return notEquals(cur1, R.head(ellipseData)) &&
        notEquals(cur1, R.nth(1, ellipseData)) &&
        notEquals(cur1, R.nth(2, ellipseData)) &&
        notEquals(cur1, R.nth(3, ellipseData));
    }, cur);
  }, listOfLocationsByCardinalPoints);
}


// matrixWithShortestPathBtwCornerLocations :: warehouseMatrix -> [Number, Number] -> [Number, Number] -> [Array] -> Object
function matrixWithShortestPathBtwCornerLocations(matrix, startLocation, endLocation, cornerLocations) {
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


function shortestPathViaEllipse(matrix, sortingArea, locationsList, functionToApply) {
  // Transform picketTour into matrix data
  const pickerTourForEllipse = locationsListToMatrixData(functionToApply, startFromALocation(sortingArea, R.uniq(locationsList)));
  // Create the ellipse for the pickerTour
  const ellipse = createEllipse(pickerTourForEllipse);

  // We need to remove the ellipse cardinal points from the picker tour
  const pickerTourWithoutCardinals = removeCardinalPoints(locationsListInCorner(ellipse, pickerTourForEllipse), ellipse);

  const matrixCorner1 = matrixWithShortestPathBtwCornerLocations(
    matrix,
    R.head(ellipse),
    R.nth(1, ellipse),
    R.head(pickerTourWithoutCardinals)
  );
  const matrixCorner2 = matrixWithShortestPathBtwCornerLocations(
    matrix,
    R.nth(1, ellipse),
    R.nth(2, ellipse),
    R.nth(1, pickerTourWithoutCardinals)
  );
  const matrixCorner3 = matrixWithShortestPathBtwCornerLocations(
    matrix,
    R.nth(2, ellipse),
    R.nth(3, ellipse),
    R.nth(2, pickerTourWithoutCardinals)
  );
  const matrixCorner4 = matrixWithShortestPathBtwCornerLocations(
    matrix,
    R.nth(3, ellipse),
    R.head(ellipse),
    R.nth(3, pickerTourWithoutCardinals)
  );

  const shortestPathMatrixCorner1 = shortestPathBetweenLocations(matrixCorner1, ellipse[0].toString());
  const shortestPathMatrixCorner2 = shortestPathBetweenLocations(matrixCorner2, ellipse[1].toString());
  const shortestPathMatrixCorner3 = shortestPathBetweenLocations(matrixCorner3, ellipse[2].toString());
  const shortestPathMatrixCorner4 = shortestPathBetweenLocations(matrixCorner4, ellipse[3].toString());

  const finalpath = R.uniq(concat([shortestPathMatrixCorner1, shortestPathMatrixCorner2, shortestPathMatrixCorner3, shortestPathMatrixCorner4]));

  let locList = R.map(cur => {
    const newCur = R.split(',', cur);
    return [newCur[0], newCur[1]];
  }, finalpath);

  locList = endAtALocation(locList[0], locList);

  const newLocList = R.map(cur => {
    return [Number(R.head(cur)), Number(R.last(cur))]
  }, locList);

  return pathBtwManyLocations(matrix, newLocList);
}

exports.shortestPathViaEllipse = shortestPathViaEllipse;
