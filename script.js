// drawWarehouseAndPickerTour :: Number -> Number -> Number -> Array -> WarehouseAndPickerTour
function drawWarehouseAndPickerTour(warehouseHeight, warehouseWidth, warehouseSeparation, pickerTour) {
	// createWarehouseMatrix :: Number -> Number -> Number -> Number -> Array -> Array
	function createWarehouseMatrix(startHeight, startWidth, separation, height = 0, width = 0, matrix = []) {
		// Walkability matrix. Zero is walkable, One is not
		if (height >= startHeight) {
			matrix.push(Array(startWidth).fill(0));
			return matrix;
		} else if (width >= startWidth) {
			return createWarehouseMatrix(startHeight, startWidth, separation, height + 1, 0, matrix);
		} else {
			if (height === 0) {
				matrix.push(Array(startWidth).fill(0));
				return createWarehouseMatrix(startHeight, startWidth, separation, height + 1, width, matrix);
			} else if (matrix[height] === undefined) {
				matrix.push([]);
				return createWarehouseMatrix(startHeight, startWidth, separation, height, width, matrix);
			} else {
				if (height === separation) {
					matrix[height].push(0);
				} else if ((width + 1) % 3 === 0) {
					matrix[height].push(1);
				} else {
					matrix[height].push(0);
				}
				return createWarehouseMatrix(startHeight, startWidth, separation, height, width + 1, matrix);
			}
		}
	}

	// defineWidthWithWalls :: Number -> Number
	function defineWidthWithWalls(originalWidth) {
		if (originalWidth <= 2) {
			return originalWidth;
		}
		if (originalWidth % 2 !== 0) {
			originalWidth += 1;
		}
		originalWidth += originalWidth / 2 - 1;
		return Math.round(originalWidth);
	}

	// addDiv :: Array -> String -> String
	function addDiv(list, openString = '<div class="row">') {

		// addDivEl :: String -> String
		function addDivEl(string, className) {
			if (className === 0) {
				return string + "<div></div>";
			} else {
				return string + '<div class="wall"></div>';
			}
		}

		// closeDivEl :: String -> String
		function closeDivEl(string) {
			return string + "</div>";
		}

		// openDivEl :: String -> String
		function openDivEl(string) {
			return string + '<div class="row">';
		}

		if (list.length === 0) { // list === []
			openString = closeDivEl(openString);
			return openString;
		} else if (list.length === 1) { // list === [a] || list === [[]] || list === [[a]]
			if (list[0].length === undefined) { // list === [a]
				openString = addDivEl(openString, list[0]);
				return addDiv([], openString);
			} else { // list === [[]] || list === [[a]]
				openString = addDiv(list[0], openString);
				openString = openDivEl(openString);
				let newList = list.slice(1);
				return addDiv(newList, openString);
			}
		} else { // list === [a, a] || list === [[], []]
			if (list[0].length === undefined) { // list === [a, a]
				openString = addDivEl(openString, list[0]);
				let newList = list.slice(1);
				return addDiv(newList, openString);
			} else { // list === [[], []]
				openString = addDiv(list[0], openString);
				openString = openDivEl(openString);
				let newList = list.slice(1);
				return addDiv(newList, openString);
			}
		}
	}

	// removeWalls :: NodeList -> Number -> NodeList
	function removeWalls(nodeList, separation) {
		for (let i = 0; i < nodeList.length; i++) {
			if (i === separation) {
				for (let node of nodeList[i].children) {
					node.className = "";
				}
			}
		}
		return nodeList;
	}

	// highlightPath :: NodeList -> Array -> NodeList
	function highlightPath(nodeList, path) {

		// addClassOnNode :: Number -> String
		function addClassOnNode(nbOfClass) {
			return ` path${nbOfClass}`;
		}

		path.map(function(cur, index, array) {
			for (let i = 0; i < nodeList.length; i++) {
				if (i === cur[1]) {
					for (let j = 0; j < nodeList[i].children.length; j++) {
						if (j === cur[0]) {
							let node = nodeList[i].children[j];
							if (index === 0 || index === array.length - 1) {
								nodeList[i].children[j].textContent = "*";
								node.className = 'location';
							} else {
								node.className += addClassOnNode(node.classList.length);
							}
							break;
						}
					}
				}
			}
		});

		return nodeList;
	}

	// drawPickerTour :: Array -> Array -> Array
	function drawPickerTour(matrix, pickerTour) {
		return pickerTour.map(function(cur, index, array) {
			const grid = new PF.Grid(matrix);
			const finder = new PF.AStarFinder({
				allowDiagonal: true
			});
			if (index !== array.length - 1) {
				let path = finder.findPath(cur[0], cur[1], array[index + 1][0], array[index + 1][1], grid);
				return highlightPath(nodeMatrix, path);
			}
		});
	}

	const matrix = createWarehouseMatrix(warehouseHeight / 2, defineWidthWithWalls(warehouseWidth * 2), warehouseSeparation);
	$("body").append(addDiv(matrix));
	const nodeMatrix = $$('.row');
	removeWalls(nodeMatrix, warehouseSeparation);

	return drawPickerTour(matrix, pickerTour);
}

// pickerTourInSequence :: Array -> Number -> Array
function pickerTourInSequence(pickerTour, nbLocations = 2) {
	if (nbLocations >= pickerTour.length) {
		return pickerTour;
	} else {
		const newPickerTour = pickerTour.slice(0, nbLocations);
		return newPickerTour;
	}
}

// mapPickerTourLocationsToMatrixData :: String -> [Number, Number]
function mapPickerTourLocationsToMatrixData(location) {
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

function reorderPickerTour(sortingAreaMatrix, bestWay, pickerTour) {
	let tour = [];
	if (pickerTour[bestWay[0]][0] === sortingAreaMatrix[0] && pickerTour[bestWay[0]][1] === sortingAreaMatrix[1]) {
		for (var i = 0; i < bestWay.length; i++) {
			tour.push(pickerTour[bestWay[i]]);
		}
	} else {
		let firstElemBestWay = bestWay.shift();
		bestWay.push(firstElemBestWay);
		return reorderPickerTour(sortingAreaMatrix, bestWay, pickerTour);
	}
	tour.push(sortingAreaMatrix);
	return tour;
}

const realPickerTour = ["MZ1-0926D03", "MZ1-2540A01", "MZ1-2708A03", "MZ1-2714D01", "MZ1-2716A01", "MZ1-2734D04", "MZ1-2734D04", "MZ1-2734D04", "MZ1-2734D04", "MZ1-2738D01", "MZ1-2738D01", "MZ1-2806D06", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2914A03", "MZ1-3115A01", "MZ1-3116D06", "MZ1-3124A02", "MZ1-3124A02", "MZ1-3124A02", "MZ1-3124A02", "MZ1-3138A01", "MZ1-3138A01", "MZ1-3138A01", "MZ1-3138A01", "MZ1-3138A01", "MZ1-3142A02", "MZ1-3142A02", "MZ1-3142A02", "MZ1-3142A02", "MZ1-3142D06", "MZ1-3205D04", "MZ1-3303D01", "MZ1-3305A02", "MZ1-3305A02", "MZ1-3318D05", "MZ1-3323A01", "MZ1-3328D04", "MZ1-3328D04", "MZ1-3328D04", "MZ1-3328D04", "MZ1-3328D04", "MZ1-3329D06", "MZ1-3407D01"];
const realPickerTour1 = ["MZ1-2010D05", "MZ1-2103D02", "MZ1-2511A01", "MZ1-2529A01", "MZ1-2539A01", "MZ1-2539A01", "MZ1-2539A01", "MZ1-2539A03", "MZ1-2542D01", "MZ1-2542D01", "MZ1-2633D03", "MZ1-2706A01", "MZ1-2709A01", "MZ1-2716D04", "MZ1-2718D01", "MZ1-2718D01", "MZ1-2718D04", "MZ1-2723A02", "MZ1-2734D03", "MZ1-2738D01", "MZ1-2803D05", "MZ1-2803D05", "MZ1-2907A01", "MZ1-2918D06", "MZ1-3103A02", "MZ1-3103D03", "MZ1-3115A02", "MZ1-3119A02", "MZ1-3129D06", "MZ1-3130D01", "MZ1-3139D04", "MZ1-3142A02", "MZ1-3233D02", "MZ1-3303D01", "MZ1-3303D01", "MZ1-3305A02", "MZ1-3307A03", "MZ1-3316A02", "MZ1-3323A01", "MZ1-3325A02", "MZ1-3325A02", "MZ1-3325A02", "MZ1-3328D04", "MZ1-3329D06", "MZ1-3329D06", "MZ1-3405D06", "MZ1-3405D06", "MZ1-3604D02", "MZ1-3604D02", "MZ1-3604D03", "MZ1-3609D06"];
const realPickerTour2 = ["MZ1-2511A01", "MZ1-2520A01", "MZ1-2805D03", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2906A03", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2908A01", "MZ1-2925A01", "MZ1-2936A03", "MZ1-2936A03", "MZ1-2940A03", "MZ1-2940A03", "MZ1-2940A03", "MZ1-2940A03", "MZ1-2940A03", "MZ1-2940A03", "MZ1-2941A01", "MZ1-2941A01", "MZ1-2942A02", "MZ1-2942A02", "MZ1-3103A03", "MZ1-3103A03", "MZ1-3123A01", "MZ1-3123A01", "MZ1-3123A01", "MZ1-3123A01", "MZ1-3123A01", "MZ1-3128A03", "MZ1-3128A03", "MZ1-3205D02"];
const realPickerTour3 = ["MZ1-2507A02", "MZ1-2507A02", "MZ1-2518D05", "MZ1-2518D06", "MZ1-2518D06", "MZ1-2523A03", "MZ1-2525A03", "MZ1-2525A03", "MZ1-2527D03", "MZ1-2527D03", "MZ1-2529D01", "MZ1-2529D01", "MZ1-2529D01", "MZ1-2538A02", "MZ1-2538D05", "MZ1-2538D05", "MZ1-2538D05", "MZ1-2540A03", "MZ1-2540D01", "MZ1-2639D05", "MZ1-2639D05", "MZ1-2639D05", "MZ1-2640D04", "MZ1-2640D04", "MZ1-2640D04", "MZ1-2717A01", "MZ1-2717A01", "MZ1-2906D06", "MZ1-3103A01", "MZ1-3103A01", "MZ1-3104A03", "MZ1-3114D06", "MZ1-3115D02", "MZ1-3116D01", "MZ1-3117D04", "MZ1-3123D05", "MZ1-3142A02", "MZ1-3142A02", "MZ1-3142A02", "MZ1-3142A02", "MZ1-3142A02", "MZ1-3142A02", "MZ1-3231D06", "MZ1-3311A02", "MZ1-3316A02", "MZ1-3317A01", "MZ1-3323A03", "MZ1-3337A03", "MZ1-3337A03", "MZ1-3403D01", "MZ1-3403D01", "MZ1-3403D01", "MZ1-3403D01", "MZ1-3406D02", "MZ1-3407D06", "MZ1-3407D06", "MZ1-3626D01"];
const realPickerTour4 = ["MZ1-0107A02", "MZ1-0207A02", "MZ1-0318D05", "MZ1-0418D06", "MZ1-0518D06", "MZ1-0623A03", "MZ1-0725A03", "MZ1-0825A03", "MZ1-0927D03", "MZ1-1027D03", "MZ1-1129D01", "MZ1-1229D01", "MZ1-1329D01", "MZ1-1438A02", "MZ1-1538D05", "MZ1-1638D05", "MZ1-1738D05", "MZ1-1840A03", "MZ1-1940D01", "MZ1-2039D05", "MZ1-2139D05", "MZ1-2239D05", "MZ1-2340D04", "MZ1-2440D04", "MZ1-2540D04", "MZ1-2617A01", "MZ1-2717A01", "MZ1-2806D06", "MZ1-2903A01", "MZ1-3003A01", "MZ1-3104A03", "MZ1-3214D06", "MZ1-3315D02", "MZ1-3416D01", "MZ1-3517D04", "MZ1-3623D05"];
const sortingArea = "MZ1-2444A01";
const sortingAreaMatrix = mapPickerTourLocationsToMatrixData(sortingArea);

const pickerTourToMatrix = realPickerTour1.map(mapPickerTourLocationsToMatrixData);
const uniqPickerTourLocations = _.uniqWith(pickerTourToMatrix, _.isEqual);

uniqPickerTourLocations.push(sortingAreaMatrix);
uniqPickerTourLocations.reverse();
uniqPickerTourLocations.push(sortingAreaMatrix);
uniqPickerTourLocations.reverse();


// init
drawWarehouseAndPickerTour(44, 36, 10, pickerTourInSequence(uniqPickerTourLocations, 2));

//console.log(reorderPickerTour(bestRoad.best, bestRoad.points), uniqPickerTourLocations);

$('#drawNextLocation').on('click', function() {
	$('.row').remove();
	const nbLocations = Number($(this).attr('data-nblocations'));
	$(this).attr('data-nblocations', nbLocations + 1);
	return drawWarehouseAndPickerTour(44, 36, 10, pickerTourInSequence(uniqPickerTourLocations, nbLocations));
});
