import { Map, Point } from './types';
import { find } from 'lodash'

const WAIT_BW_RENDERS = 500; // ms

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
