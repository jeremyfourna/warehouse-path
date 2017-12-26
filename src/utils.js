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

exports.isNaN = isNaN;
exports.nbSteps = nbSteps;
