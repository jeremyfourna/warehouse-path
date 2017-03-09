let matrix = createWarehouseMatrix(44, 36, [10]);
let pickerTour = ["MZ1-0115A03", "MZ1-0122A01", "MZ1-0332A03", "MZ1-2531A03", "MZ1-2813D05", "MZ1-2816D04", "MZ1-2913D05", "MZ1-3019D01", "MZ1-3334A02", "MZ1-3341A02", "MZ1-3517A03", "MZ1-3529A01"];
pickerTour = ["MZ1-2531A03", "MZ1-2813D05", "MZ1-3019D01", "MZ1-0332A03", "MZ1-0719A03", "MZ1-0719A03", "MZ1-0910A02", "MZ1-0919A03", "MZ1-2708A03", "MZ1-2709A01", "MZ1-2714D04", "MZ1-2723D03", "MZ1-2724D05", "MZ1-2903A02", "MZ1-2938A02", "MZ1-3140A02", "MZ1-2910A02", "MZ1-2910A02", "MZ1-2542A02", "MZ1-2705A01", "MZ1-2739A03"];
pickerTour = ["MZ1-3104A03", "MZ1-3105A01", "MZ1-3110A03", "MZ1-3137A01", "MZ1-3204D05", "MZ1-3309A03", "MZ1-3312A01", "MZ1-3315A03", "MZ1-3316A02", "MZ1-3317A01", "MZ1-3338A02", "MZ1-3204D05", "MZ1-3312A01", "MZ1-2934A03", "MZ1-3103A02", "MZ1-3136D05", "MZ1-3305A03", "MZ1-3305A03", "MZ1-3328A03", "MZ1-3203D02", "MZ1-3305A03"];
//pickerTour = ["MZ1-0939A02", "MZ1-1442D05", "MZ1-2308D01", "MZ1-3038D04"];
//pickerTour = ["MZ1-0602A04", "MZ1-0602B03", "MZ1-0602B03", "MZ1-0602B03", "MZ1-0604B02", "MZ1-0608A02", "MZ1-0612B01", "MZ1-0811B01", "MZ1-0811B01", "MZ1-0811B01", "MZ1-1412B01", "MZ1-1610C04", "MZ1-1612A01", "MZ1-1801B03", "MZ1-1805C04", "MZ1-1807B04", "MZ1-1811B03", "MZ1-1811B04", "MZ1-1811B04", "MZ1-1811B04", "MZ1-3306A02", "MZ1-3306A02", "MZ1-3309B04", "MZ1-3309B04", "MZ1-3309B04", "MZ1-3309B04", "MZ1-3309B04", "MZ1-3309B04", "MZ1-3312B02", "MZ1-3312B02", "MZ1-3312B02", "MZ1-3602A02", "MZ1-3607B02", "MZ1-3607B02", "MZ1-3607B04", "MZ1-3607B04", "MZ1-4001B04", "MZ1-4007C04", "MZ1-4102C02", "MZ1-4208A01", "MZ1-4208A01", "MZ1-4307A02"];
const sortingArea = "MZ1-2444A01";

pickerTour = startAndEndAtSameALocation(sortingArea, pickerTour);

let short = createMatrixWithShortestPathBetweenLocations(matrix, uniqLocations(pickerTour), westwingLocationToMatrixData);

let shortestPath = shortestPathBetweenLocations(short, sortingArea, findClosestLocation);

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



// Event to display the next location to go in the HTML
$('#drawNextLocation').on('click', function() {
	$('.row').remove();
	$('.superRow').remove();
	const nbLocations = Number($(this).attr('data-nblocations'));
	$(this).attr('data-nblocations', nbLocations + 1);

	testAlgoOnManyBatches(matrix, parseBigDataBatches(bigData), sortingArea, nbLocations, true);
});

console.log(testAlgoOnManyBatches(matrix, parseBigDataBatches(bigData), sortingArea));

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
			listOfBatches.push(tempPickerTour);
			tempPickerTour = [];
			return previous = undefined;
		}
	});
	return listOfBatches;
}


function testAlgoOnManyBatches(matrix, listOfBatches, sortingArea, nbLocations = 1, cleanUp = false) {
	return listOfBatches.reduce(function(prev, cur, index) {
		let pickerTour = startAndEndAtSameALocation(sortingArea, cur);
		let short = createMatrixWithShortestPathBetweenLocations(matrix, uniqLocations(pickerTour), westwingLocationToMatrixData);
		let shortestPath = shortestPathBetweenLocations(short, sortingArea, findClosestLocation);

		let sShaped = nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, locationsListToMatrixData(uniqLocations(pickerTour), westwingLocationToMatrixData)));
		let shortest = nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, locationsListToMatrixData(uniqLocations(shortestPath), westwingLocationToMatrixData)));
		console.log(`Result ${index} : `, shortest - sShaped);
		return prev + (shortest - sShaped);
		//console.log(`S-Shaped ${index}`, nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, locationsListToMatrixData(uniqLocations(pickerTour), westwingLocationToMatrixData))));
		//console.log(`Shortest Path ${index}`, nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, locationsListToMatrixData(uniqLocations(shortestPath), westwingLocationToMatrixData))));

		//highlightPathBetweenManyLocations(nodeMatrix, pickerTourInSequence(createPathBetweenManyLocations(matrix, locationsListToMatrixData(uniqLocations(pickerTour), westwingLocationToMatrixData)), nbLocations));
		//highlightPathBetweenManyLocations(nodeMatrix1, pickerTourInSequence(createPathBetweenManyLocations(matrix, locationsListToMatrixData(uniqLocations(shortestPath), westwingLocationToMatrixData)), nbLocations));
	}, 0);

	return listOfBatches.map(function(cur, index) {
		if (cleanUp === true) {
			$(`.row${index}`).remove();
			$(`.superRow${index}`).remove();
		}
		let nodeMatrix = drawWarehouse(matrix, "body", `row${index}`);
		let nodeMatrix1 = drawWarehouse(matrix, "body", `superRow${index}`);

		let pickerTour = startAndEndAtSameALocation(sortingArea, cur);
		let short = createMatrixWithShortestPathBetweenLocations(matrix, uniqLocations(pickerTour), westwingLocationToMatrixData);
		let shortestPath = shortestPathBetweenLocations(short, sortingArea, findClosestLocation);

		let sShaped = nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, locationsListToMatrixData(uniqLocations(pickerTour), westwingLocationToMatrixData)));
		let shortest = nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, locationsListToMatrixData(uniqLocations(shortestPath), westwingLocationToMatrixData)));
		console.log(`Result ${index} : `, shortest - sShaped);
		//console.log(`S-Shaped ${index}`, nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, locationsListToMatrixData(uniqLocations(pickerTour), westwingLocationToMatrixData))));
		//console.log(`Shortest Path ${index}`, nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, locationsListToMatrixData(uniqLocations(shortestPath), westwingLocationToMatrixData))));

		//highlightPathBetweenManyLocations(nodeMatrix, pickerTourInSequence(createPathBetweenManyLocations(matrix, locationsListToMatrixData(uniqLocations(pickerTour), westwingLocationToMatrixData)), nbLocations));
		//highlightPathBetweenManyLocations(nodeMatrix1, pickerTourInSequence(createPathBetweenManyLocations(matrix, locationsListToMatrixData(uniqLocations(shortestPath), westwingLocationToMatrixData)), nbLocations));
	});
}
