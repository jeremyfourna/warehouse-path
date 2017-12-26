const R = require('ramda');

const { isNaN } = require('./utils');


/**
 * Matrix = [ [Number], [Number] ]
 *
 * A matrix looks like this : 0 is a walkable location  1 is a wall (not walkable)
 * [
 *      [0, 0, 0, 0, 0],
 *      [0, 0, 1, 0, 0],
 *      [0, 0, 1, 0, 0],
 *      [0, 0, 0, 0, 0]
 * ]
 */

// createWarehouseMatrix :: Number Number [Number] -> Matrix
function createWarehouseMatrix(racksInAisle, aislesInWH, listOfSeparation) {
  return createMatrix(racksFaced(racksInAisle), aislesWithWalls(aislesInWH), checkListOfSeparation(listOfSeparation));
}

// createMatrix :: Number -> Number -> [Number] -> Number -> Number -> Array -> [Array]
function createMatrix(racksInAisle, aislesInWH, listOfSeparation, height = 0, width = 0, matrix = []) {
  // Walkability matrix. Zero is walkable, One is not

  // Are we at the end of the aisle height ?
  if (R.gt(height, racksInAisle)) {

    return R.append(R.repeat(0, aislesInWH), matrix);

    // Are we at the end of the warehouse ?
  } else if (R.gte(width, aislesInWH)) {

    return createMatrix(racksInAisle, aislesInWH, listOfSeparation, R.inc(height), 0, matrix);

    // We are still building the warehouse matrix
  } else {

    // Are we at the beggining of the aisle height
    if (R.equals(height, 0)) {

      const newMatrix = R.append(R.repeat(0, aislesInWH), matrix);
      return createMatrix(racksInAisle, aislesInWH, listOfSeparation, R.inc(height), width, newMatrix);

      // Is the current height defined inside the matrix
    } else if (R.isNil(R.nth(height, matrix))) {

      const newMatrix = R.append([], matrix);
      return createMatrix(racksInAisle, aislesInWH, listOfSeparation, height, width, newMatrix);

      // Define if it is a wall or a walkable axis
    } else {

      // Should the current width be a wall ?
      if (R.equals(R.modulo(R.inc(width), 3), 0)) {

        const newMatrix = R.adjust(R.append(1), height, matrix);
        return createMatrix(racksInAisle, aislesInWH, listOfSeparation, height, R.inc(width), newMatrix);

        // Then it should be a walkable  width
      } else {

        const newMatrix = R.adjust(R.append(0), height, matrix);
        return createMatrix(racksInAisle, aislesInWH, listOfSeparation, height, R.inc(width), newMatrix);
      }
    }
  }
}

// aislesWithWalls :: Number -> Number
function aislesWithWalls(aislesNumber) {
  // The wall are located every two aisles like this (a = aisle  | = wall) :
  //   1   |   2   |   3   |   4   |   5   |   n
  // a : a | a : a | a : a | . : . | . : . | n : n
  const safeAislesNumber = Math.round(aislesNumber);
  if (R.either(isNaN, R.lt(R.__, 1))(safeAislesNumber)) {
    throw new Error(`aislesWithWalls : parameter must be a positive integer but parameter was rounded to ${aislesNumber}`);
  } else {
    return R.dec(R.multiply(safeAislesNumber, 3));
  }
}

// racksFaced :: Number -> Number
function racksFaced(racksNumber) {
  // We assume inside an aisle the racks are located in front of each other
  // 1 : 2
  // 3 : 4
  // 5 : 6
  // . : .
  // . : .
  // n : n
  //
  // So we need to divide the numberOfRackInAisle by two to respect the real warehouse height
  const safeRacksNumber = Math.round(racksNumber);
  const isOdd = R.ifElse(R.modulo(R.__, 2), R.always(true), R.always(false));
  if (R.anyPass([isNaN, R.lt(R.__, 2), isOdd])(safeRacksNumber)) {
    throw new Error(`racksFaced : parameter must be an even positive integer superior to 0 but parameter was rounded to ${racksNumber}`);
  } else {
    return R.divide(safeRacksNumber, 2);
  }
}

// negativeValues :: [Number] -> [Number]
function negativeValues(list) {
  return R.filter(R.lt(R.__, 0), list);
}

function checkListOfSeparation(list) {

  if (R.isNil(list) || R.length(negativeValues(list)) > 0) {
    throw new Error(`checkListOfSeparation : parameter must be an Array of positive numbers but parameter was ${list}`);
  } else {
    return list;
  }
}


exports.aislesWithWalls = aislesWithWalls;
exports.checkListOfSeparation = checkListOfSeparation;
exports.createMatrix = createMatrix;
exports.createWarehouseMatrix = createWarehouseMatrix;
exports.negativeValues = negativeValues;
exports.racksFaced = racksFaced;
