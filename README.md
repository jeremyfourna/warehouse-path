# warehouse-path

Lib that allow you to build to best picket tour inside a warehouse for a given list of locations to visit. Inside a warehouse a picker must pick during his/her tour 40 to 60 products, those products are located across many locations, `warehouse-path` allow you to define the best way to go throught all locations and minimize the length of the tour.

## Installation

`npm i --save warehouse-path`

## Usage

```js
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

```

Will output via the node terminal `node example/example-1.js`

```
S Shaped 397
Closest Neighbour 382
Ellipse 347
```

Those numbers means that each algo will ask the picker to go throught that many steps to complete their picker tour. In the example above the ellipse algo is the best for this given picker tour.

### Performance between `S-Shaped` and `closest neighbour` algos

![alt text](public/closestNeighbour_sShaped.png "Simple warehouse configuration")

* S-Shape = `S-Shaped`
* Shortest = `closest neighbour`
* Difference = `closest neighbour` steps for a given picker tour **minus** `S-Shaped` steps for a given picker tour

The `closest neighbour` tends to performance better than the `S-Shaped` and this is even more true as the number of locations in a picker tour increase.

### Performance between `S-Shaped` and `ellipse` algos

![alt text](public/ellipse_sShaped.png "Simple warehouse configuration")

* S-Shape = `S-Shaped`
* Ellipse = `ellipse`
* Difference = `ellipse` steps for a given picker tour **minus** `S-Shaped` steps for a given picker tour

The `ellipse` tends to performance better than the `S-Shaped` and this is even more true as the number of locations in a picker tour increase. It also outperform the `closest neighbour` algo.

## Reading list and useful websites

* https://simple.wikipedia.org/wiki/Travelling_salesman_problem
* https://simple.wikipedia.org/wiki/Monte_Carlo_algorithm
* https://simple.wikipedia.org/wiki/Las_Vegas_algorithm
* https://en.wikipedia.org/wiki/Branch_and_bound
* https://m3ideas.org/2014/09/26/walking-directions-in-a-warehouse-part-2/
* http://will.thimbleby.net/a-shortest-path-in-javascript/
* http://theory.stanford.edu/~amitp/GameProgramming/
* https://en.wikipedia.org/wiki/Artificial_ants
* http://www.cse.yorku.ca/~aaw/Zambito/TSP_Euclidean_PTAS.pdf
* https://en.wikipedia.org/wiki/Euclidean_distance
* http://gbb.mehr-davon.de/
* http://gbb.mehr-davon.de/content/median-circle-problem/example.html
* http://mathworld.wolfram.com/Ellipse.html
* https://developers.google.com/optimization/routing/tsp/tsp
