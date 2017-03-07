// drawWarehouseAndPickerTour :: Number -> Number -> Number -> Array -> WarehouseAndPickerTour
function drawWarehouseAndPickerTour(warehouseHeight, warehouseWidth, warehouseSeparation, pickerTour, version) {
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
	function drawPickerTour(nodeMatrix, matrix, pickerTour, version) {
		if (version === 0) {
			return pickerTour.map(function(cur, index, array) {
				const grid = new PF.Grid(matrix);
				const finder = new PF.AStarFinder({
					allowDiagonal: true
				});
				if (index !== array.length - 1) {
					let path = finder.findPath(cur[0], cur[1], array[index + 1][0], array[index + 1][1], grid);
					recordPath += path.length;
					return highlightPath(nodeMatrix, path);
				}
			});
		} else if (version === 1) {
			return pickerTour.map(function(cur) {
				recordPath += cur.length;
				return highlightPath(nodeMatrix, cur);
			});
		}
	}

	// Step 1 : Create the matrix for the warehouse and add it into the HTML body
	const matrix = createWarehouseMatrix(warehouseHeight / 2, defineWidthWithWalls(warehouseWidth * 2), warehouseSeparation);
	$("body").append(addDiv(matrix));
	// Step 2 : Remove the walls in the HTML body (only for display, the matrix already have this configuration)
	const nodeMatrix = $$('.row');
	removeWalls(nodeMatrix, warehouseSeparation);
	// Step 3 : Draw the picker tour
	return drawPickerTour(nodeMatrix, matrix, pickerTour, version);
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

// pickerTourInSequence :: Array -> Number -> Array
function pickerTourInSequence(pickerTour, nbLocations = 2) {
	if (nbLocations >= pickerTour.length) {
		console.log("total steps", recordPath);
		return pickerTour;
	} else {
		const newPickerTour = pickerTour.slice(0, nbLocations);
		return newPickerTour;
	}
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

function createMatrixWithShortestPathBetweenLocations(matrix, pickerTour) {
	let shortestMatrix = [];

	pickerTour.map(function(cur, index, array) {
		let pathForEachLocations = [];
		pickerTour.map(function(cur1, index1, array1) {
			const grid = new PF.Grid(matrix);
			const finder = new PF.AStarFinder();
			let path = finder.findPath(cur.coordinates[0], cur.coordinates[1], cur1.coordinates[0], cur1.coordinates[1], grid);
			return pathForEachLocations.push({
				name: cur1.name,
				coordinates: cur1.coordinates,
				pathLength: path.length
			});
		});
		return shortestMatrix.push(pathForEachLocations);
	});

	return shortestMatrix;
}
