let matrix = createWarehouseMatrix(44, 36, [10]);
let nodeMatrix = drawWarehouse(matrix);
let nodeMatrix1 = drawWarehouse(matrix, "body", "superRow");
let pickerTour = ["MZ1-0115A03", "MZ1-0122A01", "MZ1-0332A03", "MZ1-2531A03", "MZ1-2813D05", "MZ1-2816D04", "MZ1-2913D05", "MZ1-3019D01", "MZ1-3334A02", "MZ1-3341A02", "MZ1-3517A03", "MZ1-3529A01"];
pickerTour = ["MZ1-2531A03", "MZ1-2813D05", "MZ1-3019D01", "MZ1-0332A03", "MZ1-0719A03", "MZ1-0719A03", "MZ1-0910A02", "MZ1-0919A03", "MZ1-2708A03", "MZ1-2709A01", "MZ1-2714D04", "MZ1-2723D03", "MZ1-2724D05", "MZ1-2903A02", "MZ1-2938A02", "MZ1-3140A02", "MZ1-2910A02", "MZ1-2910A02", "MZ1-2542A02", "MZ1-2705A01", "MZ1-2739A03"];
pickerTour = ["MZ1-0538A02", "MZ1-3104A03", "MZ1-3105A01", "MZ1-3110A03", "MZ1-3137A01", "MZ1-3204D05", "MZ1-3309A03", "MZ1-3312A01", "MZ1-3315A03", "MZ1-3316A02", "MZ1-3317A01", "MZ1-3338A02", "MZ1-3204D05", "MZ1-3312A01", "MZ1-2934A03", "MZ1-3103A02", "MZ1-3136D05", "MZ1-3305A03", "MZ1-3305A03", "MZ1-3328A03", "MZ1-3203D02", "MZ1-3305A03"];
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
	let nodeMatrix = drawWarehouse(matrix);
	let nodeMatrix1 = drawWarehouse(matrix, "body", "superRow");

	highlightPathBetweenManyLocations(nodeMatrix, pickerTourInSequence(createPathBetweenManyLocations(matrix, locationsListToMatrixData(uniqLocations(pickerTour), westwingLocationToMatrixData)), nbLocations));
	highlightPathBetweenManyLocations(nodeMatrix1, pickerTourInSequence(createPathBetweenManyLocations(matrix, locationsListToMatrixData(uniqLocations(shortestPath), westwingLocationToMatrixData)), nbLocations));
});

highlightPathBetweenManyLocations(nodeMatrix, pickerTourInSequence(createPathBetweenManyLocations(matrix, locationsListToMatrixData(uniqLocations(pickerTour), westwingLocationToMatrixData)), 1));
highlightPathBetweenManyLocations(nodeMatrix1, pickerTourInSequence(createPathBetweenManyLocations(matrix, locationsListToMatrixData(uniqLocations(shortestPath), westwingLocationToMatrixData)), 1));


console.log("S-Shaped", nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, locationsListToMatrixData(uniqLocations(pickerTour), westwingLocationToMatrixData))));
console.log("Shortest Path", nbStepsForAPickerTour(createPathBetweenManyLocations(matrix, locationsListToMatrixData(uniqLocations(shortestPath), westwingLocationToMatrixData))));
