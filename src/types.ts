export enum Cell {
  horizontal = 'horizontal',
  vertical = 'vertical',
  intersection = 'intersection',
  // turn = 'turn',
  turnNE = 'turn-ne',
  turnES = 'turn-es',
  turnSW = 'turn-sw',
  turnNW = 'turn-nw',
  start = 'start',
  end = 'end',
  wall = 'wall',
}

export type Point = { x: number, y: number }

export type Row = Cell[];

export type Grid = Row[];

export type Map = {
  grid: Grid;
  width: number;
  height: number;
  startDirection?: Direction;
  lastDirection?: Direction;
  startPosition?: Point;
  lastPosition?: Point;
  numberOfPaths: number;
  failedDrafts: number;
};

export enum Direction {
  north = 'north',
  east = 'east',
  south = 'south',
  west = 'west',
}
