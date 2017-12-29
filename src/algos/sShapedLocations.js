const R = require('ramda');

const {
  locationsListToMatrixData,
  pathBtwManyLocations,
  startAndEndAtSameALocation
} = require('../picker-tour');

// sShapedLocationAsc :: [String] -> [String];
function sShapedLocationAsc(locationsList) {
  const byLocation = R.ascend(cur => cur);

  return R.sort(byLocation, locationsList);
}

// sShapedLocationDesc :: [String] -> [String];
function sShapedLocationDesc(locationsList) {
  const byLocation = R.descend(cur => cur);

  return R.sort(byLocation, locationsList);
}

function shortestSShapedPath(matrix, sortingArea, locationsList, functionToApply) {
  const pickerTour = startAndEndAtSameALocation(sortingArea, sShapedLocationAsc(R.uniq(locationsList)));

  return pathBtwManyLocations(matrix, locationsListToMatrixData(functionToApply, pickerTour));
}

exports.shortestSShapedPath = shortestSShapedPath;
exports.sShapedLocationAsc = sShapedLocationAsc;
exports.sShapedLocationDesc = sShapedLocationDesc;
