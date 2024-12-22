import { getOppositeDirection } from './helpers';
import { Cell, Direction, Map, Point } from './types';
import { find } from 'lodash'

const WAIT_BW_RENDERS = 200; // ms
const TILESET = 'labyrinth'

const getStartTile = (startDirection: Direction) => {
  return startDirection[0]
}

const getEndTile = (lastDirection: Direction) => {
  return getOppositeDirection(lastDirection)[0]
}

const getTileImg = (map: Map, cell: Cell) => {
  const { lastDirection, startDirection } = map;
  if (cell === Cell.wall) return `<img src="/${TILESET}/solid.png">`
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

export const clearMapWithSprites = () => {
  document.querySelector<HTMLDivElement>('#sprites')!.innerHTML = '';
}

export const drawMapWithSprites = (map: Map) => {
  const { grid } = map;
  let dom = ''

  grid.map(row => {
    dom += '<div>'
    row.map(cell => {
      dom += getTileImg(map, cell)
    })
    dom += '</div>'
  })

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

  return new Promise((resolve) => setTimeout(() => resolve(map), WAIT_BW_RENDERS));
};

export const disableGenerate = () => {
  document.querySelector<HTMLButtonElement>('#generate')!.disabled = true;
};

export const enableGenerate = () => {
  document.querySelector<HTMLButtonElement>('#generate')!.disabled = false;
};
