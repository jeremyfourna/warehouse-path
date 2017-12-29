const R = require('ramda');

const {
  nbSteps,
  shortestClosestNeighbourPath,
  shortestPathViaEllipse,
  shortestSShapedPath,
  warehouseMatrix,
} = require('../index');

///////////////////////////////////
// Create your warehouse matrix //
/////////////////////////////////

const matrix = warehouseMatrix(44, 36, [10]);

/////////////////////////////////////////////////
// Define your picker tour via your locations //
///////////////////////////////////////////////

const pickerTour = ['MZ1-0115A03', 'MZ1-0122A01', 'MZ1-0332A03', 'MZ1-2531A03', 'MZ1-2813D05', 'MZ1-2816D04', 'MZ1-2913D05', 'MZ1-3019D01', 'MZ1-3334A02', 'MZ1-3341A02', 'MZ1-3517A03', 'MZ1-3529A01', 'MZ1-3227A02', 'MZ1-0715A01'];

///////////////////////////////////////////////
// Define your starting and/or ending point //
/////////////////////////////////////////////

const sortingArea = 'MZ1-2444A01';

/////////////////////////////////////////////////////////////////////////////////////
// Define your custom function to transform your locations into matrix data point //
///////////////////////////////////////////////////////////////////////////////////

// testLocationToMatrixData :: String -> [Number, Number]
function testLocationToMatrixData(location) {
  const val = R.slice(4, 11, location);
  const xAxis = R.subtract(R.multiply(Number(R.slice(0, 2, val)), 3), 3);
  const yAxis = Number(R.slice(2, 4, val));

  if (R.equals(0, R.modulo(yAxis, 2))) {
    return [R.inc(xAxis), R.divide(yAxis, 2)];
  } else {
    return [xAxis, R.divide(R.inc(yAxis), 2)];
  }
}


console.log('S Shaped', nbSteps(shortestSShapedPath(matrix, sortingArea, pickerTour, testLocationToMatrixData)));
console.log('Closest Neighbour', nbSteps(shortestClosestNeighbourPath(matrix, sortingArea, pickerTour, testLocationToMatrixData)));
console.log('Ellipse', nbSteps(shortestPathViaEllipse(matrix, sortingArea, pickerTour, testLocationToMatrixData)));
