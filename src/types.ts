export enum CellType {
  vertical = 'vertical',
  horizontal = 'horizontal',
  intersection = 'intersection',
  start = 'start',
  end = 'end',
  wall = 'wall',
}

export type Point = { x: number, y: number }

export type Row = CellType[];

export type Grid = Row[];

export type Map = {
  grid: Grid;
  width: number;
  height: number;
  startDirection?: Direction;
  lastDirection?: Direction;
  startPosition?: Point;
  lastPosition?: Point;
};

export enum Direction {
  north = 'north',
  east = 'east',
  south = 'south',
  west = 'west',
}
