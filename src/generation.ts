import { delayMap, disableGenerate, enableGenerate } from './dom-helpers';
import { getRandomDirection } from './helpers';
import { CellType, Map } from './types';
import { random, times } from 'lodash';

const finish = (map: Map): Map => {
  enableGenerate();
};

const createEmptyMap = (cols: number, rows: number): Map => {
  const map = { grid: times(rows, () => times(cols, () => CellType.wall)) };
  delayMap(map).then((map) => {
    startPath(map);
  });
};

const startPath = (map: Map): Map => {
  const { grid } = map;
  const startX = random(0, grid[0].length - 1);
  const startY = random(0, grid.length - 1);

  grid[startY][startX] = CellType.start;

  // FIXME: this needs to be set later
  // map.startDirection = getRandomDirection();
  // map.lastDirection = map.startDirection;

  delayMap(map).then((map) => {
    finish(map);
  });
};

export const generateLevel = () => {
  disableGenerate();
  createEmptyMap(6, 5);
};
