export type EllipseCoordinates = number[][];
export type Location = string;
export type Locations = Location[];
export type Matrix = number[][];
export type MatrixLocation = number[];
export type MatrixLocations = MatrixLocation[];
export type MatrixPickerTour = number[][];
export type Path = MatrixLocations;
export type PathStep = MatrixLocation;
export type PickerTour = Locations;

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
