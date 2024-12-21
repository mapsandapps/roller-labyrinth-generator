import { Map, Point } from './types';
import { find } from 'lodash'

const WAIT_BW_RENDERS = 150; // ms

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
