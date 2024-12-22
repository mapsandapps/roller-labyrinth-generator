// a) pick a random starting point
// b) pick a random direction (that isn't the one you were just moving in, if that's relevant)
// c) calculate the distance to the outside
// d) pick a distance to move in that direction (random b/w 1 and b)
// e) see if the tile you'd land on is acceptable and no intervening tiles are already going that direction, if so move
// f) if not, maybe just start over from b
// once a certain number of draft moves have failed, end map creation

import { clearMapWithSprites, disableGenerate, drawMapWithDelay, drawMapWithSprites, enableGenerate, getFormValues } from './dom-helpers';
import { checkDraftMove, getCellFromPoint, getDraftCells, getHorizontal, getMaxDistanceInDirection, getRandomDirection, setCellAtPoint } from './helpers';
import { Cell, Direction, Map, Point } from './types';
import { last, random, times } from 'lodash';

export const DEFAULT_MAP_WIDTH = 8;
export const DEFAULT_MAP_HEIGHT = 12;
const MAX_FAILURES = 20;

const finish = (map: Map) => {
  setCellAtPoint(map, map.lastPosition!, Cell.end)

  drawMapWithDelay(map).then(() => {
    drawMapWithSprites(map);
    enableGenerate();
  })
};

const move = (map: Map, draftCells: Point[], direction: Direction) => {
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

    if (i !== 0) map.totalPathLength++
  }

  if (!map.startDirection) map.startDirection = direction
  map.lastDirection = direction
  map.lastPosition = last(draftCells)
  map.numberOfPaths++
}

const createDraftMove = (map: Map) => {
  const direction = getRandomDirection(map.lastDirection);
  const isHorizontal = getHorizontal(direction)
  const maxDistance = getMaxDistanceInDirection(map, direction);

  if (maxDistance < 1) {
    // throw this out without even bothering to draw it
    console.warn("draft move had distance 0; redrafting")
    map.failedDrafts++

    if (map.failedDrafts >= MAX_FAILURES) {
      finish(map)
    } else {
      createDraftMove(map)
    }
    return
  }

  const distance = random(1, maxDistance)

  const draftCells = getDraftCells(map, direction, distance)

  // draw draft move
  drawMapWithDelay(map, draftCells).then(map => {
    // decide if draft works or not
    // if the draft is valid, make that move
    // if the draft is not valid, see if we've failed too many times
    // if so, exit map creation
    // if not, make a new draft move
    const isDraftValid = checkDraftMove(map, draftCells, isHorizontal)

    if (isDraftValid) {
      move(map, draftCells, direction)

      // re-draw with draft move approved
      drawMapWithDelay(map).then(map => {
        // recurse
        createDraftMove(map);
      })
    } else {
      map.failedDrafts++

      if (map.failedDrafts >= MAX_FAILURES) {
        finish(map)
      } else {
        createDraftMove(map)
      }
    }
  })
}

const createEmptyMap = (cols: number, rows: number) => {
  const map = { 
    grid: times(rows, () => times(cols, () => Cell.wall)), 
    width: cols, 
    height: rows, 
    numberOfPaths: 0, 
    failedDrafts: 0,
    totalPathLength: 0
  };
  drawMapWithDelay(map).then((map) => {
    startPath(map);
  });
};

const startPath = (map: Map) => {
  const { grid } = map;
  const startX = random(0, grid[0].length - 1);
  const startY = random(0, grid.length - 1);

  map.startPosition = { x: startX, y: startY };
  map.lastPosition = { x: startX, y: startY };
  map.totalPathLength = 1;
  setCellAtPoint(map, { x: startX, y: startY }, Cell.start);

  drawMapWithDelay(map).then((map) => {
    createDraftMove(map);
  });
};

export const generateLevel = () => {
  const { columns, rows } = getFormValues()
  disableGenerate();
  clearMapWithSprites();
  createEmptyMap(columns, rows);
};
