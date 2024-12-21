import { Direction } from './types';
import { random } from 'lodash';

export const getRandomDirection = (): Direction => {
  const directionOptions = Object.values(Direction);

  return directionOptions[random(directionOptions - 1)];
};
