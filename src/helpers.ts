import { Cell, Direction, Map, Point } from './types';
import { last, random } from 'lodash';

export const getHorizontal = (direction: Direction) => {
  return (direction === Direction.east || direction === Direction.west)
}

export const getCellFromPoint = (map: Map, point: Point): Cell => {
  const { grid } = map;
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
