import { Direction, Map, Point } from './types';
import { random } from 'lodash';

export const checkDraftMove = (map: Map, draftCells: Point[]) => {
  // TODO:
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
