import logger from './logger';

export function isIterable(obj) {
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

export function screamingToCamel(screamingString) {
  const snakeString = screamingString.toLowerCase();
  return snakeString.replace(/([-_][a-z])/ig, (newWordFirstLetter) => newWordFirstLetter.toUpperCase()
    .replace('-', '')
    .replace('_', ''));
}

export function objKeysToCamel(objOrValue) {
  if (!objOrValue) return logger.warn('No object or value passed to objKeysToCamel');
  if (typeof objOrValue !== 'object') return objOrValue;
  const camelObj = {};
  Object.keys(objOrValue).forEach(key => {
    camelObj[screamingToCamel(key)] = objKeysToCamel(objOrValue[key]);
  });

  return camelObj;
}
