export enum CellType {
  vertical = 'vertical',
  horizontal = 'horizontal',
  intersection = 'intersection',
  start = 'start',
  end = 'end',
  wall = 'wall',
}

export type Row = CellType[];

export type Grid = Row[];

export type Map = {
  grid: Grid;
  startDirection?: Direction;
  lastDirection?: Direction;
};

export enum Direction {
  north = 'north',
  east = 'east',
  south = 'south',
  west = 'west',
}
