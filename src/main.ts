import './style.css';
import { generateLevel } from './generation.ts';

document.querySelector<HTMLButtonElement>('#generate')!.addEventListener('click', () => generateLevel());

// generate a map when the page first loads:
generateLevel();
