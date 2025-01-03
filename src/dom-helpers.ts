import { DEFAULT_MAP_WIDTH, DEFAULT_MAP_HEIGHT } from './generation';
import { getCellFromPoint, getOppositeDirection } from './helpers';
import { Cell, Direction, Map, Point } from './types';
import { find, repeat, toNumber, toString } from 'lodash'

const DEFAULT_WAIT_BW_RENDERS = 200; // ms
const DEFAULT_IS_MAZE = false;
const MAX_WAIT = 3000;
const TILESET = 'labyrinth'
const RELATIONAL_TILESET = 'small'
const SHOULD_DRAW_BORDER = true; // add a border of "wall" cells around the whole sprite map

let waitBetweenRenders = DEFAULT_WAIT_BW_RENDERS
let isMaze = DEFAULT_IS_MAZE

export const setDefaultFormValues = () => {
  document.querySelector<HTMLInputElement>('#speed')!.value = toString(MAX_WAIT - DEFAULT_WAIT_BW_RENDERS)
  document.querySelector<HTMLInputElement>('#speed')!.max = toString(MAX_WAIT)
  document.querySelector<HTMLInputElement>('#columns')!.value = toString(DEFAULT_MAP_WIDTH)
  document.querySelector<HTMLInputElement>('#rows')!.value = toString(DEFAULT_MAP_HEIGHT)
  if (DEFAULT_IS_MAZE) {
    document.querySelector<HTMLInputElement>('input[name="type"][value="maze"')!.checked = true
  } else {
    document.querySelector<HTMLInputElement>('input[name="type"][value="labyrinth"')!.checked = true
  }
}

export const getFormValues = () => {
  const sliderValue = document.querySelector<HTMLInputElement>('#speed')!.value
  const speed = MAX_WAIT - toNumber(sliderValue);
  waitBetweenRenders = speed;
  isMaze = document.querySelector<HTMLInputElement>('input[name="type"]:checked')!.value === 'maze'
  return {
    isMaze,
    speed,
    columns: toNumber(document.querySelector<HTMLInputElement>('#columns')!.value) || DEFAULT_MAP_WIDTH,
    rows: toNumber(document.querySelector<HTMLInputElement>('#rows')!.value) || DEFAULT_MAP_HEIGHT
  }
}

const getStartTile = (startDirection: Direction) => {
  // when the map is first initialized, there's no startDirection yet
  return startDirection ? startDirection[0] : 'n'
}

const getEndTile = (lastDirection: Direction) => {
  return getOppositeDirection(lastDirection)[0]
}

const getTileImg = (map: Map, cell: Cell) => {
  const { lastDirection, startDirection } = map;
  if (cell === Cell.wall) return `<img src="/${TILESET}/solid.png">`

  if (isMaze) {
    return `<img src="/${TILESET}/tunnel.png">`
  } else {
    if (cell === Cell.start) return `<img src="/${TILESET}/${getStartTile(startDirection!)}.png">`
    if (cell === Cell.end) return `<img src="/${TILESET}/${getEndTile(lastDirection!)}.png">`
    if (cell === Cell.horizontal) return `<img src="/${TILESET}/ew.png">`
    if (cell === Cell.vertical) return `<img src="/${TILESET}/ns.png">`
    if (cell === Cell.intersection) return `<img src="/${TILESET}/nesw.png">`
    const [ cellType, directions ] = cell.split('-')
    if (cellType === 'turn') {
      return `<img src="/${TILESET}/${directions}.png">`
    }
  }
}

export const clearMapWithSprites = () => {
  document.querySelector<HTMLDivElement>('#sprites')!.innerHTML = '';
}

const getRelationalSpriteName = (map: Map, cellPoint: Point): string => {
  const { x, y } = cellPoint
  const isLeftWall = getCellFromPoint(map, { x: x - 1, y }) === Cell.wall
  const isUpWall = getCellFromPoint(map, { x, y: y - 1 }) === Cell.wall
  const isUpLeftWall = getCellFromPoint(map, { x: x - 1, y: y - 1 }) === Cell.wall

  if (getCellFromPoint(map, cellPoint) === Cell.wall) return 'Solid'

  if (isLeftWall && isUpLeftWall && isUpWall) return 'UL-L-U'
  if (isLeftWall && isUpWall) return 'UL-L-U'
  if (isLeftWall && isUpLeftWall) return 'UL-L'
  if (isUpLeftWall && isUpWall) return 'UL-U'
  if (isUpLeftWall) return 'UL'
  if (isUpWall) return 'U'
  if (isLeftWall) return 'L'

  return 'Blank'
}

export const drawMapWithRelationalSprites = (map: Map) => {
  const { grid, width } = map;
  const wallTileImg = `<img src="/${RELATIONAL_TILESET}/Solid.png">`
  let dom = ''

  if (SHOULD_DRAW_BORDER) dom += '<div>' + repeat(wallTileImg, width + 2) + '</div>'

  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    dom += '<div>'
    if (SHOULD_DRAW_BORDER) dom += wallTileImg

    for (let x = 0; x < row.length; x++) {
      // const cell = row[x];
      dom += `<img src="/${RELATIONAL_TILESET}/${getRelationalSpriteName(map, { x, y })}.png">`
    }

    if (SHOULD_DRAW_BORDER) dom += wallTileImg
    dom += '</div>'
  }

  if (SHOULD_DRAW_BORDER) dom += '<div>' + repeat(wallTileImg, width + 2) + '</div>'

  document.querySelector<HTMLDivElement>('#sprites')!.innerHTML = dom;
}

export const drawMapWithSprites = (map: Map) => {
  const { grid, width } = map;
  let dom = ''

  if (SHOULD_DRAW_BORDER) dom += '<div>' + repeat(getTileImg(map, Cell.wall), width + 2) + '</div>'

  grid.map(row => {
    dom += '<div>'
    if (SHOULD_DRAW_BORDER) dom += getTileImg(map, Cell.wall)
    row.map(cell => {
      dom += getTileImg(map, cell)
    })
    if (SHOULD_DRAW_BORDER) dom += getTileImg(map, Cell.wall)
    dom += '</div>'
  })

  if (SHOULD_DRAW_BORDER) dom += '<div>' + repeat(getTileImg(map, Cell.wall), width + 2) + '</div>'

  document.querySelector<HTMLDivElement>('#sprites')!.innerHTML = dom;
}

const printJson = (map: Map) => {
  let dom = '<table>'

  dom += `<tr><td>Size</td><td>Width: ${map.width}, Height: ${map.height}</td></tr>`
  dom += `<tr><td>Start direction</td><td>${map.startDirection}</td></tr>`
  dom += `<tr><td>Start position</td><td>${JSON.stringify(map.startPosition)}</td></tr>`
  dom += `<tr><td>Last direction</td><td>${map.lastDirection}</td></tr>`
  dom += `<tr><td>Last position</td><td>${JSON.stringify(map.lastPosition)}</td></tr>`
  dom += `<tr><td>Number of paths</td><td>${map.numberOfPaths}</td></tr>`
  dom += `<tr><td>Total path length</td><td>${map.totalPathLength}</td></tr>`
  dom += `<tr><td>Failed drafts</td><td>${map.failedDrafts}</td></tr>`

  dom += '</table>'

  // dom += `<div><code>${JSON.stringify(map.grid)}</code></div>`

  document.querySelector<HTMLDivElement>('#json')!.innerHTML = dom;
}

const drawMap = (map: Map, draftCells?: Point[]) => {
  let dom = '';

  map.grid.map((row, y) => {
    dom += '<pre class="row">';

    row.map((cell, x) => {
      let className = `cell ${cell}`
      if (draftCells) {
        const isInDraft = Boolean(find(draftCells, (cell) => { return cell.x === x && cell.y === y }))
        if (isInDraft) className += ' draft'
      }

      dom += `<span id="${x}-${y}" class="${className}">${cell[0]}</span>`;
    });

    dom += '</pre>';
  });

  document.querySelector<HTMLDivElement>('#map')!.innerHTML = dom;

  printJson(map);
};

export const drawMapWithDelay = (map: Map, draft?: Point[]): Promise<Map> => {
  drawMap(map, draft);

  // draw map with sprites, but only when the move is made, not when it's in draft
  if (isMaze) {
    if (!draft) drawMapWithRelationalSprites(map);
  } else {
    if (!draft) drawMapWithSprites(map);
  }

  return new Promise((resolve) => setTimeout(() => resolve(map), waitBetweenRenders));
};

export const disableGenerate = () => {
  document.querySelector<HTMLButtonElement>('#speed')!.disabled = true;
  document.querySelector<HTMLButtonElement>('#columns')!.disabled = true;
  document.querySelector<HTMLButtonElement>('#rows')!.disabled = true;
  document.querySelector<HTMLButtonElement>('#generate')!.disabled = true;
};

export const enableGenerate = () => {
  document.querySelector<HTMLButtonElement>('#speed')!.disabled = false;
  document.querySelector<HTMLButtonElement>('#columns')!.disabled = false;
  document.querySelector<HTMLButtonElement>('#rows')!.disabled = false;
  document.querySelector<HTMLButtonElement>('#generate')!.disabled = false;
};
