import { Path, PathStep, Matrix } from "./interface"

///////////////////////////////////////////////////////////////////////////////////////////////////
// Functions responsible to display the picker tour on the page //
/////////////////////////////////////////////////////////////////////////////////////////////////

export function highlightPathBetweenManyLocations(nodeList, path:Path) {
	return path.map((cur:PathStep) => {
		return highlightPathBetweenTwoLocations(nodeList, cur)
	})
}

// highlightPathBetweenTwoLocations :: NodeList -> [Array] -> [Array]
export function highlightPathBetweenTwoLocations(nodeList, path:PathStep) {

	function addClassOnNode(nbOfClass:number):string {
		return ` path${nbOfClass}`
	}

	return path.map((cur, index, array) => {
		let node = nodeList[cur[1]].children[cur[0]]
		if (index === 0 || index === array.length - 1) {
			node.textContent = "*"
			node.className = 'location'
		} else {
			node.className += addClassOnNode(node.classList.length)
		}
	})
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// Functions responsible to display the warehouse on the page //
/////////////////////////////////////////////////////////////////////////////////////////////////

export function drawWarehouse(matrix:Matrix, tagToAppendTheWarehouse = "body", classForRow = "row") {

	function addDiv(list:Matrix, openString:string, style:string):string {

		function addDivEl(string:string, className:number, style:string):string {
			if (className === 0) {
				return string + `<div style="${style}"></div>`
			} else {
				return string + `<div class="wall" style="${style}"></div>`
			}
		}

		function closeDivEl(string:string):string {
			return string + "</div>"
		}

		function openDivEl(string:string, classForRow:string):string {
			return string + `<div class="${classForRow}">`
		}

		list.map((cur:number[], index:number) => {
			openString = openDivEl(openString, classForRow)
			cur.map((cur1:number) => {
				openString = addDivEl(openString, cur1, style)
			})
			openString = closeDivEl(openString)
		})

		return openString
	}

	// Style for the div element inside a warehouse
	const style:string = "width: 15pxheight: 15pxdisplay: inline-blockborder: 0.5px solid black"
	// Add in the page the warehouse
	$(tagToAppendTheWarehouse).append(addDiv(matrix, "", style))
	// Retrieve the warehouse from the DOM
	const nodeMatrix = $(`.${classForRow}`)
	// Return the warehouse for reuse into other functions
	return nodeMatrix
}