/////////////////////////////////////////////////////
// Create your warehouse matrix //
///////////////////////////////////////////////////

let matrix = createWarehouseMatrix(44, 36, [10]);

//////////////////////////////////////////////////////////////////////
// Define your picker tour via your locations //
////////////////////////////////////////////////////////////////////

let pickerTour = ["MZ1-0115A03", "MZ1-0122A01", "MZ1-0332A03", "MZ1-2531A03", "MZ1-2813D05", "MZ1-2816D04", "MZ1-2913D05", "MZ1-3019D01", "MZ1-3334A02", "MZ1-3341A02", "MZ1-3517A03", "MZ1-3529A01"];
//pickerTour = ["MZ1-2531A03", "MZ1-2813D05", "MZ1-3019D01", "MZ1-0332A03", "MZ1-0719A03", "MZ1-0719A03", "MZ1-0910A02", "MZ1-0919A03", "MZ1-2708A03", "MZ1-2709A01", "MZ1-2714D04", "MZ1-2723D03", "MZ1-2724D05", "MZ1-2903A02", "MZ1-2938A02", "MZ1-3140A02", "MZ1-2910A02", "MZ1-2910A02", "MZ1-2542A02", "MZ1-2705A01", "MZ1-2739A03"];
//pickerTour = ["MZ1-3104A03", "MZ1-3105A01", "MZ1-3110A03", "MZ1-3137A01", "MZ1-3204D05", "MZ1-3309A03", "MZ1-3312A01", "MZ1-3315A03", "MZ1-3316A02", "MZ1-3317A01", "MZ1-3338A02", "MZ1-3204D05", "MZ1-3312A01", "MZ1-2934A03", "MZ1-3103A02", "MZ1-3136D05", "MZ1-3305A03", "MZ1-3305A03", "MZ1-3328A03", "MZ1-3203D02", "MZ1-3305A03"];
//pickerTour = ["MZ1-0939A02", "MZ1-1442D05", "MZ1-2308D01", "MZ1-3038D04"];
//pickerTour = ["MZ1-0602A04", "MZ1-0602B03", "MZ1-0602B03", "MZ1-0602B03", "MZ1-0604B02", "MZ1-0608A02", "MZ1-0612B01", "MZ1-0811B01", "MZ1-0811B01", "MZ1-0811B01", "MZ1-1412B01", "MZ1-1610C04", "MZ1-1612A01", "MZ1-1801B03", "MZ1-1805C04", "MZ1-1807B04", "MZ1-1811B03", "MZ1-1811B04", "MZ1-1811B04", "MZ1-1811B04", "MZ1-3306A02", "MZ1-3306A02", "MZ1-3309B04", "MZ1-3309B04", "MZ1-3309B04", "MZ1-3309B04", "MZ1-3309B04", "MZ1-3309B04", "MZ1-3312B02", "MZ1-3312B02", "MZ1-3312B02", "MZ1-3602A02", "MZ1-3607B02", "MZ1-3607B02", "MZ1-3607B04", "MZ1-3607B04", "MZ1-4001B04", "MZ1-4007C04", "MZ1-4102C02", "MZ1-4208A01", "MZ1-4208A01", "MZ1-4307A02"];

/////////////////////////////////////////////////////////////////////
// Define your starting and/or ending point //
///////////////////////////////////////////////////////////////////

const sortingArea = "MZ1-2444A01";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define your custom function to transform your locations into matrix data point //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// westwingLocationToMatrixData :: String -> [Number, Number]
function westwingLocationToMatrixData(location) {
	var val = location.slice(4, 11);
	var xAxis = Number(val.slice(0, 2)) * 3 - 3;
	var yAxis = Number(val.slice(2, 4));

	if (yAxis % 2 === 0) {
		xAxis += 1;
		yAxis /= 2;
	} else {
		yAxis = (yAxis + 1) / 2;
	}

	return [xAxis, yAxis];
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// If you want to parse a big list of picker tour batches, define your function here //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Bind click event on #drawNextLocation button to advance the picker tour //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Event to display the next location to go in the HTML
$('#drawNextLocation').on('click', function() {
	const nbLocations = Number($(this).attr('data-nblocations'));
	$(this).attr('data-nblocations', nbLocations + 1);

	//////////////////////////////////////////////////////////
	// Call your function to execute here //
	/////////////////////////////////////////////////////////

	return testAlgoOnManyBatchesDisplay(matrix, parseBigDataBatches(pickerTour), sortingArea, nbLocations, true);
});

//////////////////////////////////////////////////////////////////
// Init the warehouse display, if you want //
////////////////////////////////////////////////////////////////
//let warehouse = drawWarehouse(matrix);

//testAlgoOnManyBatchesDisplay(matrix, parseBigDataBatches(pickerTour), sortingArea);
console.log(testAlgoOnManyBatchesReduce(matrix, parseBigDataBatches(bigData), sortingArea, westwingLocationToMatrixData));
//testAlgoOnManyBatchesResultForCSV(matrix, parseBigDataBatches(pickerTour), sortingArea);
