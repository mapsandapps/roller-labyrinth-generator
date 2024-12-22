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

export const move = (map: Map, draftCells: Point[], direction: Direction) => {
  // if the first cell was not the start, change it to vertical or horizontal
  // change each cell travelled thru to horizontal or vertical, or - if it was already a path - change. it to an intersection
  const isHorizontal = getHorizontal(direction)
  const oppositeDirection = isHorizontal ? Cell.vertical : Cell.horizontal
  for (let i = 0; i < draftCells.length; i++) {
    const cellType = getCellFromPoint(map, draftCells[i]);
    if (i === 0 && cellType === Cell.start) {
      // do nothing
    } else if (i === 0) {
      let cellType = Cell.turnNW

      if ((map.lastDirection === Direction.west && direction === Direction.north) ||
        (map.lastDirection === Direction.south && direction === Direction.east)) {
        cellType = Cell.turnNE
      } else if ((map.lastDirection === Direction.north && direction === Direction.east) ||
        (map.lastDirection === Direction.west && direction === Direction.south)) {
        cellType = Cell.turnES
      } else if ((map.lastDirection === Direction.north && direction === Direction.west) ||
        (map.lastDirection === Direction.east && direction === Direction.south)) {
        cellType = Cell.turnSW
      }
      setCellAtPoint(map, draftCells[i], cellType)
    } else if (cellType === oppositeDirection) {
      // if this was already a path, now it's an intersection
      setCellAtPoint(map, draftCells[i], Cell.intersection)
    } else {
      setCellAtPoint(map, draftCells[i], isHorizontal ? Cell.horizontal : Cell.vertical)
    }
  }

  if (!map.startDirection) map.startDirection = direction
  map.lastDirection = direction
  map.lastPosition = last(draftCells)
  map.numberOfPaths++
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

  console.log(`DISTANCE: ${distance}`)

  for (let i = 0; i <= distance; i++) {
    draftCells.push(getPointAtDistanceAndDirection(map.lastPosition!, i, direction))    
  }

  console.log(draftCells)

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
