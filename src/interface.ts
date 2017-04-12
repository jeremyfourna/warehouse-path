export type Location = string;
export type Locations = string[];
export type Matrix = number[][];
export type MatrixLocation = number[];
export type MatrixLocations = number[][];
export type MatrixPickerTour = number[][];
export type Path = number[][];
export type PickerTour = string[];

export interface MatrixWithShortestPathBetweenLocations {
	ref: Ref[];
	matrix: ShortestMatrixPathBetweenLocations[][];
}

export interface Ref {
	coordinates: MatrixLocation;
	indexInMatrix: number;
	name: string;
}

export interface ShortestMatrixPathBetweenLocations {
	coordinates: MatrixLocation;
	name: string;
	pathLength: number;
}
