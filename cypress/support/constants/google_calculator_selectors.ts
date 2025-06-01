export const CALCULATOR_SELECTORS = {
  calculatorSection: 'div[class="card-section"]',
  result: 'span[id="cwos"]',
  textField: 'span[id="cwos"]',
  operators: {
    multiply: 'div[aria-label="multiply"]',
    divide: 'div[aria-label="divide"]',
    plus: 'div[aria-label="plus"]',
    minus: 'div[aria-label="minus"]',
    equals: 'div[aria-label="equals"]',
    point: 'div[aria-label="point"]',
  },
  buttons: 'div[role="button"]',
  numbersTable: 'table[class="ElumCf"]', // Need to figure out a better selector for this. Using class is not reliable.
  numbers: 'div[role="button"]',
} as const;
