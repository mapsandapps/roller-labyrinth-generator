import { Map } from './types';

const WAIT_BW_RENDERS = 150; // ms

const drawMap = (map: Map) => {
  let dom = '';

  map.grid.map((row) => {
    dom += '<pre class="row">';

    row.map((cell) => {
      dom += `<span class="cell ${cell}">${cell[0]}</span>`;
    });

    dom += '</pre>';
  });

  document.querySelector<HTMLDivElement>('#map')!.innerHTML = dom;
};

export const delayMap = (map: Map, waitMultiplier = 1): Promise<Map> => {
  drawMap(map);

  return new Promise((resolve) => setTimeout(() => resolve(map), WAIT_BW_RENDERS * waitMultiplier));
};

export const disableGenerate = () => {
  document.querySelector<HTMLButtonElement>('#generate')!.disabled = true;
};

export const enableGenerate = () => {
  document.querySelector<HTMLButtonElement>('#generate')!.disabled = false;
};
