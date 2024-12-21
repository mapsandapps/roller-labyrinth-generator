import { disableGenerate, drawMapWithDelay, enableGenerate } from './dom-helpers';
import { getDraftCells, getMaxDistanceInDirection, getRandomDirection } from './helpers';
import { CellType, Map } from './types';
import { random, times } from 'lodash';

const finish = (map: Map) => {
  enableGenerate();
};

const createDraftMove = (map: Map) => {
  const direction = getRandomDirection();
  const distance = random(getMaxDistanceInDirection(map, direction))

  const draftCells = getDraftCells(map, direction, distance)

  drawMapWithDelay(map, draftCells).then((map => {
    // decide if draft works or not

    // if distance < 1, fail
  }))

  // if successful:
  // map.startDirection = getRandomDirection();
  // map.lastDirection = map.startDirection;
  // map.lastPosition = [x, y]

  // drawMapWithDelay(map).then((map) => {
  //   finish(map);
  // });
}

const createEmptyMap = (cols: number, rows: number) => {
  const map = { grid: times(rows, () => times(cols, () => CellType.wall)), width: cols, height: rows };
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
  grid[startY][startX] = CellType.start;

  // FIXME: this needs to be set later
  // map.startDirection = getRandomDirection();
  // map.lastDirection = map.startDirection;

  drawMapWithDelay(map).then((map) => {
    createDraftMove(map);
  });
};

export const generateLevel = () => {
  disableGenerate();
  createEmptyMap(6, 5);
};
