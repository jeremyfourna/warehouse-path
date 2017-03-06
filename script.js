// drawWarehouseAndPickerTour :: Number -> Number -> Number -> Array -> WarehouseAndPickerTour
function drawWarehouseAndPickerTour(warehouseHeight, warehouseWidth, warehouseSeparation, pickerTour) {
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
		return pickerTour.map(mapPickerTourLocationsToMatrixData)
			.map(function(cur, index, array) {
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

const pickerTour = ["MZ1-0103A01", "MZ1-0305D05", "MZ1-0515D05"];
const pickerTour1 = ["MZ1-0706D05", "MZ1-3136A01", "MZ1-3328A02", "MZ1-0103A01"];
const realPickerTour = ["MZ1-3129A03", "MZ1-3136D06", "MZ1-3137D05", "MZ1-3137D05", "MZ1-3137D05", "MZ1-3331A01", "MZ1-3331A01", "MZ1-3415D03", "MZ1-0103A01", "MZ1-0305D05", "MZ1-0306D05", "MZ1-0306D05", "MZ1-0314A02", "MZ1-0412D06", "MZ1-0414D02", "MZ1-0723D03", "MZ1-1215D06", "MZ1-1241D03", "MZ1-2504A01", "MZ1-2934A02", "MZ1-3227D05", "MZ1-3339A02", "MZ1-0525A01", "MZ1-0535D06", "MZ1-0923D02", "MZ1-0923D02", "MZ1-0923D02", "MZ1-1908D05", "MZ1-1909D01", "MZ1-1909D06", "MZ1-2524A02", "MZ1-2530A02", "MZ1-2703A03", "MZ1-2715A01", "MZ1-2715A01", "MZ1-2715A01", "MZ1-2715A01", "MZ1-2814D01", "MZ1-2820D04", "MZ1-3025D06", "MZ1-3028D03", "MZ1-3103A02", "MZ1-3106A01", "MZ1-3106A01", "MZ1-3107A03", "MZ1-3109A01", "MZ1-3110A03", "MZ1-3110A03", "MZ1-3111A01", "MZ1-3111A01", "MZ1-3111A02", "MZ1-3111A02", "MZ1-3111A02", "MZ1-3111A03", "MZ1-3111A03", "MZ1-3112A03", "MZ1-3112A03", "MZ1-3112A03", "MZ1-3113A01", "MZ1-3115A02", "MZ1-3115A02", "MZ1-3116A02", "MZ1-3117A02", "MZ1-3117A02", "MZ1-3118A01", "MZ1-3118A01", "MZ1-3118A01", "MZ1-3119A03", "MZ1-3136D05", "MZ1-3204D05", "MZ1-3208D03", "MZ1-3208D03", "MZ1-3208D03", "MZ1-3208D04", "MZ1-3303A02", "MZ1-3305A03", "MZ1-3328A02", "MZ1-3328A02", "MZ1-3332A03", "MZ1-3333A02"];


// init
drawWarehouseAndPickerTour(44, 36, 10, pickerTourInSequence(realPickerTour, 2));

$('#drawNextLocation').on('click', function() {
	$('.row').remove();
	const nbLocations = Number($(this).attr('data-nblocations'));
	$(this).attr('data-nblocations', nbLocations + 1);
	return drawWarehouseAndPickerTour(44, 36, 10, pickerTourInSequence(realPickerTour, nbLocations));
});