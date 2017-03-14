// createEllipse :: [Array] -> [Array]
function createEllipse(locationsCoordinatesInMatrix) {
	const yMax = _.minBy(locationsCoordinatesInMatrix, 1);
	const xMax = _.maxBy(locationsCoordinatesInMatrix, 0);
	const yMin = _.maxBy(locationsCoordinatesInMatrix, 1);
	const xMin = _.minBy(locationsCoordinatesInMatrix, 0);
	const center = [Math.round((xMin[0] + xMax[0]) / 2), Math.round((yMin[1] + yMax[1]) / 2)]

	return [yMax, xMax, yMin, xMin, center];
}

// displayEllipse :: NodeList -> Array -> Array
function displayEllipse(nodeMatrix, ellipse) {
	return ellipse.map(function(cur) {
		let node = nodeMatrix[cur[1]].children[cur[0]];
		node.textContent = "e";
		node.className = 'ellipse';
	});
}

function locationsInCorner(center, xPoint, yPoint, locationsCoordinatesInMatrix) {
	return locationsCoordinatesInMatrix.filter(function(cur) {
		console.log(xPoint, yPoint, cur);
		if (xPoint[0] <= yPoint[0]) {
			if (xPoint[1] <= yPoint[1]) {
				// lower left corner
				// So we need the point to be under the vector from center to xPoint and before the vector from center to yPoint
				return cur[0] > xPoint[0] && cur[1] > xPoint[1] && cur[0] <= yPoint[0] && cur[1] <= yPoint[1];
			} else {
				// upper left corner
				// So we need the point to be above the vector from center to xPoint and before the vector from center to yPoint
				return cur[0] >= xPoint[0] && cur[1] <= xPoint[1] && cur[0] <= yPoint[0] && cur[1] >= yPoint[1];
			}
		} else {
			if (xPoint[1] <= yPoint[1]) {
				// lower right corner
				// So we need the point to be above the vector from center to xPoint and after the vector from center to yPoint
				//console.log(cur[0] <= xPoint[0], cur[1] > xPoint[1], cur[0] >= yPoint[0], cur[1] < yPoint[1])
				return cur[0] <= xPoint[0] && cur[1] >= xPoint[1] && cur[0] >= yPoint[0] && cur[1] < yPoint[1];
			} else {
				// upper right corner
				// So we need the point to be under the vector from center to xPoint and after the vector from center to yPoint
				//console.log(cur[0] < xPoint[0], cur[1] <= xPoint[1], cur[0] > yPoint[0], cur[1] >= yPoint[1])
				return cur[0] < xPoint[0] && cur[1] < xPoint[1] && cur[0] > yPoint[0] && cur[1] >= yPoint[1];
			}
		}
	});
}


function vectorCenterToCardinalForX(center, cardinal, locationCoordinates) {
	let yDiff = cardinal[1] - center[1];
	let xDiff = cardinal[0] - center[0];
	let xCorrelation = yDiff / xDiff;
	return [locationCoordinates[0], Math.round(xCorrelation * locationCoordinates[0] + cardinal[1])];
}

function vectorCenterToCardinalForY(center, cardinal, locationCoordinates) {
	let yDiff = cardinal[1] - center[1];
	let xDiff = cardinal[0] - center[0];
	let xCorrelation = yDiff / xDiff;
	return [Math.round(xCorrelation * locationCoordinates[1] + cardinal[0]), locationCoordinates[1]];
}
