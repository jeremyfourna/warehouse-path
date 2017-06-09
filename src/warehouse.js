const R = require('ramda')


exports.aislesWithWalls = aislesWithWalls
exports.checkListOfSeparation = checkListOfSeparation
exports.createMatrix = createMatrix
exports.createWarehouseMatrix = createWarehouseMatrix
exports.isNegativeValuesInArray = isNegativeValuesInArray
exports.racksFaced = racksFaced


const isNaN = R.equals(NaN)


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

// createWarehouseMatrix :: (Number -> Number -> [Number]) -> Matrix
function createWarehouseMatrix(racksInAisle, aislesInWH, listOfSeparation) {
  return createMatrix(racksFaced(racksInAisle), aislesWithWalls(aislesInWH), checkListOfSeparation(listOfSeparation))
}

// createMatrix :: Number -> Number -> [Number] -> Number -> Number -> Array -> [Array]
function createMatrix(racksInAisle, aislesInWH, listOfSeparation, height = 0, width = 0, matrix = []) {
  // Walkability matrix. Zero is walkable, One is not
  if (R.gt(height, racksInAisle)) {
    matrix.push(Array(aislesInWH).fill(0))
    return matrix
  } else if (R.gte(width, aislesInWH)) {
    return createMatrix(racksInAisle, aislesInWH, listOfSeparation, height + 1, 0, matrix)
  } else {
    if (R.equals(height, 0)) {
      matrix.push(Array(aislesInWH).fill(0))
      return createMatrix(racksInAisle, aislesInWH, listOfSeparation, height + 1, width, matrix)
    } else if (R.isNil(R.nth(height, matrix))) {
      matrix.push([])
      return createMatrix(racksInAisle, aislesInWH, listOfSeparation, height, width, matrix)
    } else {
      if (R.equals(R.modulo(R.inc(width), 3), 0)) {
        matrix[height].push(1)
      } else {
        matrix[height].push(0)
      }
      return createMatrix(racksInAisle, aislesInWH, listOfSeparation, height, width + 1, matrix)
    }
  }
}

// aislesWithWalls :: Number -> Number
function aislesWithWalls(aislesNumber) {
  // The wall are located every two aisles like this (a = aisle  | = wall) :
  //   1   |   2   |   3   |   4   |   5   |   n
  // a : a | a : a | a : a | . : . | . : . | n : n
  const safeAislesNumber = Math.round(aislesNumber)
  if (R.either(isNaN, R.lt(R.__, 1))(safeAislesNumber)) {
    throw new Error(`aislesWithWalls : parameter must be a positive integer but parameter was rounded to ${aislesNumber}`)
  } else {
    return R.dec(R.multiply(safeAislesNumber, 3))
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
  const safeRacksNumber = Math.round(racksNumber)
  const isOdd = R.ifElse(R.modulo(R.__, 2), R.always(true), R.always(false))
  if (R.anyPass([isNaN, R.lt(R.__, 2), isOdd])(safeRacksNumber)) {
    throw new Error(`racksFaced : parameter must be an even positive integer superior to 0 but parameter was rounded to ${racksNumber}`)
  } else {
    return R.divide(safeRacksNumber, 2)
  }
}

// isNegativeValuesInArray :: [Number] -> [Number]
function isNegativeValuesInArray(list) {
  return R.filter(R.lt(R.__, 0), list)
}

function checkListOfSeparation(list) {
  if (R.isNil(list) || R.length(isNegativeValuesInArray(list)) > 0) {
    throw new Error(`checkListOfSeparation : parameter must be an Array of positive numbers but parameter was ${list}`)
  } else {
    return list;
  }
}
