const R = require('ramda');

function isNaN(num) {
  return R.equals(NaN, num);
}

exports.isNaN = isNaN;
