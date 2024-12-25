import { Cell, Direction, Grid, Map, Point } from './types';
import { isEqual, last, random, times } from 'lodash';

export const getHorizontal = (direction: Direction) => {
  return (direction === Direction.east || direction === Direction.west)
}

export const getCellFromPoint = (map: Map, point: Point): Cell => {
  const { grid } = map;
  if (point.y < 0 || point.x < 0) return Cell.wall 
  return grid[point.y][point.x]
}

export const setCellAtPoint = (map: Map, point: Point, cell: Cell): Map => {
  const { grid } = map;
  grid[point.y][point.x] = cell
  return map
}

export const getOppositeDirection = (direction: Direction): Direction => {
  if (direction === Direction.north) return Direction.south
  if (direction === Direction.east) return Direction.west
  if (direction === Direction.west) return Direction.east
  return Direction.north
}

const getStartOrEndPosition = (grid: Grid, cell: Cell): Point => {
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    const cellIndex = row.indexOf(cell)
    if (cellIndex > -1) {
      return { x: cellIndex, y }
    } 
  }

  console.warn('no point found!')
  return { x: -1, y: -1 }
}

export const trimMap = (map: Map): Map => {
  const { grid, height, width } = map

  let removedRows = 0
  let removedColumns = 0

  // loop backwards over rows so if we remove an item from the array, it won't affect the loop
  for (let i = height - 1; i >= 0; i--) {
    const row = grid[i];

    if (isEqual(row, times(width, () => Cell.wall))) {
      grid.splice(i, 1)
      removedRows++
    }
  }

  map.height -= removedRows

  // loop backwards over cols so if we remove an item from the array, it won't affect the loop
  for (let j = width - 1; j >= 0; j--) {
    const column = grid.map(row => {
      return row[j]
    })

    if (isEqual(column, times(map.height, () => Cell.wall))) {
      // now loop over rows and delete the cell in that column
      for (let i = 0; i < map.height; i++) {
        const row = grid[i];
        row.splice(j, 1);
      }
      removedColumns++
    }
    
  }

  map.width -= removedColumns
  map.startPosition = getStartOrEndPosition(grid, Cell.start)
  map.lastPosition = getStartOrEndPosition(grid, Cell.end)

  return map
}

export const checkDraftMove = (map: Map, draftCells: Point[], isHorizontal: boolean): boolean => {
  // ignore first cell: that's the starting cell
  // cells between first and last should not be the start tile or a tile parallel to the direction
  // the last cell needs to have been a wall

  // last cell
  if (getCellFromPoint(map, last(draftCells)!) !== Cell.wall) {
    return false
  }

  // middle cells
  for (let i = 1; i < draftCells.length - 1; i++) {
    const cellType = getCellFromPoint(map, draftCells[i]);

    if (cellType !== Cell.wall && cellType !== Cell.horizontal && cellType !== Cell.vertical) return false

    if (cellType === Cell.horizontal && isHorizontal) return false
    if (cellType === Cell.vertical && !isHorizontal) return false
  }

  return true  
}

const getPointAtDistanceAndDirection = (start: Point, distance: number, direction: Direction): Point => {
  if (direction === Direction.north) {
    return { x: start.x, y: start.y - distance }
  } else if (direction === Direction.east) {
    return { x: start.x + distance, y: start.y }
  } else if (direction === Direction.south) {
    return { x: start.x, y: start.y + distance }
  } else {
    return { x: start.x - distance, y: start.y }
  }
}

export const getDraftCells = (map: Map, direction: Direction, distance: number): Point[] => {
  const draftCells: Point[] = []

  for (let i = 0; i <= distance; i++) {
    draftCells.push(getPointAtDistanceAndDirection(map.lastPosition!, i, direction))    
  }

  return draftCells
}

export const getMaxDistanceInDirection = (map: Map, direction: Direction): number => {
  if (!direction || !map.lastPosition) return 0

  switch(direction) { 
    case Direction.north: {
      return map.lastPosition.y
    } 
    case Direction.east: {
      return map.width - map.lastPosition.x - 1
    } 
    case Direction.south: {
      return map.height - map.lastPosition.y - 1
    } 
    case Direction.west: {
      return map.lastPosition.x
    } 
  } 
}

export const getRandomDirection = (lastDirection?: Direction): Direction => {
  // at the start, go in any direction
  // for subsequent moves, go perpendicular to the previous direction of travel
  // theoretically, we could let it continue in the last direction, but i don't want to

  let directionOptions;
  if (lastDirection === Direction.north || lastDirection === Direction.south) {
    directionOptions = [Direction.east, Direction.west]
  } else if (lastDirection === Direction.east || lastDirection === Direction.west) {
    directionOptions = [Direction.north, Direction.south]
  } else {
    directionOptions = Object.values(Direction)
  }

  return directionOptions[random(directionOptions.length - 1)];
};
