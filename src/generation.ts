// a) pick a random starting point
// b) pick a random direction (that isn't the one you were just moving in, if that's relevant)
// c) calculate the distance to the outside
// d) pick a distance to move in that direction (random b/w 1 and b)
// e) see if the tile you'd land on is acceptable and no intervening tiles are already going that direction, if so move
// f) if not, maybe just start over from b
// once a certain number of draft moves have failed, end map creation

import { disableGenerate, drawMapWithDelay, enableGenerate } from './dom-helpers';
import { checkDraftMove, getDraftCells, getHorizontal, getMaxDistanceInDirection, getRandomDirection, move, setCellAtPoint } from './helpers';
import { Cell, Map } from './types';
import { random, times } from 'lodash';

const DEFAULT_MAP_WIDTH = 8;
const DEFAULT_MAP_HEIGHT = 12;
const MAX_FAILURES = 3;

const finish = (map: Map) => {
  // TODO: set cell at lastPosition to type 'end'

  enableGenerate();
};

const createDraftMove = (map: Map) => {
  const direction = getRandomDirection(map.lastDirection);
  const isHorizontal = getHorizontal(direction)
  const maxDistance = getMaxDistanceInDirection(map, direction);

  if (maxDistance < 1) {
    // throw this out without even bothering to draw it
    console.warn("draft move had distance 0; redrafting")
    map.failedDrafts++
    createDraftMove(map)
    return
  }

  const distance = random(1, maxDistance)

  const draftCells = getDraftCells(map, direction, distance)

  drawMapWithDelay(map, draftCells).then(map => {
    // decide if draft works or not
    // if the draft is valid, make that move
    // if the draft is not valid, see if we've failed too many times
    // if so, exit map creation
    // if not, make a new draft move
    const isDraftValid = checkDraftMove(map, draftCells, isHorizontal)
    console.log(isDraftValid)

    if (isDraftValid) {
      move(map, draftCells, direction)

      drawMapWithDelay(map).then(map => {
        // TODO: recurse
        finish(map)
      })
    } else {
      map.failedDrafts++

      if (map.failedDrafts > MAX_FAILURES) {
        finish(map)
      } else {
        createDraftMove(map)
      }
    }
  })
}

const createEmptyMap = (cols: number, rows: number) => {
  const map = { grid: times(rows, () => times(cols, () => Cell.wall)), width: cols, height: rows, numberOfPaths: 0, failedDrafts: 0 };
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
  setCellAtPoint(map, { x: startX, y: startY }, Cell.start);

  // FIXME: this needs to be set later
  // map.startDirection = getRandomDirection();
  // map.lastDirection = map.startDirection;

  drawMapWithDelay(map).then((map) => {
    createDraftMove(map);
  });
};

export const generateLevel = () => {
  disableGenerate();
  createEmptyMap(DEFAULT_MAP_WIDTH, DEFAULT_MAP_HEIGHT);
};
