import { Path } from "./interface"

///////////////////////////////////////////////////////////////////////////////////////////////////
// Functions responsible to display the picker tour on the page //
/////////////////////////////////////////////////////////////////////////////////////////////////

export function highlightPathBetweenManyLocations(nodeList, path:Path) {
	return path.map(function(cur) {
		return highlightPathBetweenTwoLocations(nodeList, cur);
	});
}

// highlightPathBetweenTwoLocations :: NodeList -> [Array] -> [Array]
export function highlightPathBetweenTwoLocations(nodeList, path:Path) {

	function addClassOnNode(nbOfClass:number):string {
		return ` path${nbOfClass}`;
	}

	return path.map(function(cur, index, array) {
		let node = nodeList[cur[1]].children[cur[0]];
		if (index === 0 || index === array.length - 1) {
			node.textContent = "*";
			node.className = 'location';
		} else {
			node.className += addClassOnNode(node.classList.length);
		}
	});
}