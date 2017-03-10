// sShapedLocation :: [String] -> [String];
function sShapedLocation(locationsList) {
	let newList = locationsList.slice(0);
	newList.sort(function(a, b) {
		if (a < b) {
			return -1;
		} else if (a > b) {
			return 1;
		} else {
			return 0;
		}
	});
	return newList;
}
