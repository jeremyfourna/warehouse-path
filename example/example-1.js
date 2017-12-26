const { createWarehouseMatrix } = require('../index');

///////////////////////////////////
// Create your warehouse matrix //
/////////////////////////////////

const matrix = createWarehouseMatrix(44, 36, [10]);

/////////////////////////////////////////////////
// Define your picker tour via your locations //
///////////////////////////////////////////////

const pickerTour = ["MZ1-0115A03", "MZ1-0122A01", "MZ1-0332A03", "MZ1-2531A03", "MZ1-2813D05", "MZ1-2816D04", "MZ1-2913D05", "MZ1-3019D01", "MZ1-3334A02", "MZ1-3341A02", "MZ1-3517A03", "MZ1-3529A01"];

///////////////////////////////////////////////
// Define your starting and/or ending point //
/////////////////////////////////////////////

const sortingArea = "MZ1-2444A01";

/////////////////////////////////////////////////////////////////////////////////////
// Define your custom function to transform your locations into matrix data point //
///////////////////////////////////////////////////////////////////////////////////

// westwingLocationToMatrixData :: String -> [Number, Number]
function westwingLocationToMatrixData(location) {
  const val = location.slice(4, 11);
  const xAxis = Number(val.slice(0, 2)) * 3 - 3;
  const yAxis = Number(val.slice(2, 4));

  if (yAxis % 2 === 0) {
    xAxis += 1;
    yAxis /= 2;
  } else {
    yAxis = (yAxis + 1) / 2;
  }

  return [xAxis, yAxis];
}

////////////////////////////////////////////////////////////////////////////////////////
// If you want to parse a big list of picker tour batches, define your function here //
//////////////////////////////////////////////////////////////////////////////////////

// parseBigDataBatches :: [String] -> [Array]
function parseBigDataBatches(bigListOfBatches) {
  let listOfBatches = [];
  let previous = undefined;
  let tempPickerTour = [];
  bigListOfBatches.map(function(cur) {
    if (cur[0] !== "M" || cur[1] !== "Z" || cur[2] !== "1") {
      return;
    }
    if (previous === undefined) {
      tempPickerTour.push(cur);
      return previous = cur;
    } else if (cur >= previous) {
      tempPickerTour.push(cur);
      return previous = cur;
    } else {
      if (tempPickerTour.length > 4) {
        listOfBatches.push(tempPickerTour);
      }
      tempPickerTour = [];
      return previous = undefined;
    }
  });
  listOfBatches.push(tempPickerTour);
  return listOfBatches;
}
