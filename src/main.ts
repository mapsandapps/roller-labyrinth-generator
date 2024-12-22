import './style.css';
import { setDefaultFormValues } from './dom-helpers.ts';
import { generateLevel } from './generation.ts';

document.querySelector<HTMLButtonElement>('#generate')!.addEventListener('click', () => generateLevel());

setDefaultFormValues();

// generate a map when the page first loads:
generateLevel();
