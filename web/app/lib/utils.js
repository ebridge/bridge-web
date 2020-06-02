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
