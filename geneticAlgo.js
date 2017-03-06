// initData :: Array -> Object
function initData(listOfPoints) {
	return {
		best: [],
		bestValue: undefined,
		currentBest: undefined,
		dis: undefined,
		points: listOfPoints,
		population: [],
		populationSize: listOfPoints.length,
		unchangedGens: 0,
		values: Array(listOfPoints.length)
	};
}

// GAInitialize :: Object -> Number -> Object
function runAlgo(universe, nbOfTimesToTry) {
	// randomIndivial :: Number -> Array
	function randomIndivial(n) {
		// shuffle :: Array -> Array
		function shuffle(list) {
			// randomNumber :: Number -> Number
			function randomNumber(boundary) {
				return parseInt(Math.random() * boundary);
			}

			for (var j, x, i = list.length - 1; i; j = randomNumber(i), x = list[--i], list[i] = list[j], list[j] = x);

			return list;
		};

		var a = [];
		for (var i = 0; i < n; i++) {
			a.push(i);
		}
		return shuffle(a);
	}

	// countDistances :: Object -> Object
	function countDistances(universe) {
		// distance :: Object -> Object -> Number
		function distance(p1, p2) {
			// euclidean :: Number -> Number -> Number
			function euclidean(dx, dy) {
				return Math.sqrt(dx * dx + dy * dy);
			}

			return euclidean(p2[0] - p1[0], p2[1] - p1[1]);
		}

		const length = universe.points.length;
		universe.dis = new Array(length);
		for (var i = 0; i < length; i++) {
			universe.dis[i] = new Array(length);
			for (var j = 0; j < length; j++) {
				universe.dis[i][j] = ~~distance(universe.points[i], universe.points[j]);
			}
		}
		return universe;
	}

	if (nbOfTimesToTry <= 0) {
		return universe;
	}

	countDistances(universe);

	for (var i = 0; i < universe.populationSize; i++) {
		universe.population.push(randomIndivial(universe.points.length));
	}
	setBestValue(universe);

	return runAlgo(universe, nbOfTimesToTry - 1);
}

// setBestValue :: Object -> Object
function setBestValue(universe) {
	// getCurrentBest :: Array -> Number -> Object
	function getCurrentBest(values, populationLength) {
		var bestP = 0;
		var currentBestValue = values[0];

		for (var i = 1; i < populationLength; i++) {
			if (values[i] < currentBestValue) {
				currentBestValue = values[i];
				bestP = i;
			}
		}

		return {
			bestPosition: bestP,
			bestValue: currentBestValue
		}
	}

	// evaluate :: Number -> Array -> Number
	function evaluate(indivial, dis) {
		let sum = dis[indivial[0]][indivial[indivial.length - 1]];
		for (let i = 1; i < indivial.length; i++) {
			sum += dis[indivial[i]][indivial[i - 1]];
		}
		return sum;
	}

	// clone :: Array -> Array
	function clone(list) {
		return list.slice(0);
	}

	for (var i = 0; i < universe.population.length; i++) {
		universe.values[i] = evaluate(universe.population[i], universe.dis);
	}

	universe.currentBest = getCurrentBest(universe.values, universe.population.length);

	if (universe.bestValue === undefined || universe.bestValue > universe.currentBest.bestValue) {
		universe.best = clone(universe.population[universe.currentBest.bestPosition]);
		universe.bestValue = universe.currentBest.bestValue;
		universe.unchangedGens = 0;
	} else {
		universe.unchangedGens += 1;
	}
	//let str = JSON.stringify(universe.best, null, 4);
	//$('#answer').append(`<br><code>${str}</code>`);
	return universe;
}
