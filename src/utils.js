const R = require('ramda');

function isNaN(num) {
  return R.equals(NaN, num);
}

// nbSteps :: [Array] -> Number
function nbSteps(pickerTour) {
  return R.reduce((prev, cur) => {
    return R.add(prev, R.length(cur));
  }, 0, pickerTour);
}

function concat(listOfArrays) {
  return R.reduce((prev, cur) => R.concat(prev, cur), [], listOfArrays);
}

const mapIndexed = R.addIndex(R.map);

exports.isNaN = isNaN;
exports.nbSteps = nbSteps;
exports.concat = concat;
exports.mapIndexed = mapIndexed;
