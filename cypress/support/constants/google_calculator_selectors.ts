export const CALCULATOR_SELECTORS = {
  calculatorSection: 'div[class="card-section"]',
  result: 'span[id="cwos"]',
  textField: 'span[id="cwos"]',
  operators: {
    multiply: 'div[aria-label="multiply"]',
    divide: 'div[aria-label="divide"]',
    plus: 'div[aria-label="plus"]',
    minus: 'div[aria-label="minus"]',
  },
  buttons: 'div[role="button"]',
  numbersTable: 'table[class="ElumCf"]',
  numbers: 'div[role="button"]',
} as const;
