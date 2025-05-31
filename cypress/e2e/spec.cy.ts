import { GoogleSearchPage } from '../support/pages/GoogleSearchPage';
import { CalculatorPage } from '../support/pages/CalculatorPage';

describe('Google Calculator - E2E Tests', () => {
  const googleSearch = new GoogleSearchPage();
  const calculator = new CalculatorPage();

  before(() => {
    googleSearch.visit();
    googleSearch.typeSearchQuery('calculator');
    googleSearch.submitSearch();
    calculator.waitForCalculatorToLoad();
  });

  beforeEach(() => {
    calculator.ensureCalculatorReady();
  });

  /* User Interaction Workflows -
  * 1. Correction workflow
  * 2. Calculation workflow
  * 3. Operator switching workflow
  * 4. Chain calculations workflow
  * Focus for e2e tests are to test user interactions instead of calculations which should be covered by unit tests.
  */
  context('User Workflows', () => {
    it('Correction Workflow - User inputs 8+8, clear an input entry using CE, retypes, and validates result', () => {
      calculator.addInput('8*8')
      calculator.clearEntry();
      calculator.addInput('9')
      calculator.answerByEquals();
      calculator.getResultValue().should('equal', '72');
    });
      
    it('Calculation Workflow - should show correct result for decimal expression', () => {
      calculator.addInput('3.50+4.22', "keyboard");
      calculator.answerByEnterButton();
      calculator.getResultValue().should('equal', '7.72');
      calculator.allClear(); // When = or Enter is pressed, AC button should appear and click AC to clear all
    });

    it('Operator switching workflows - should only add either multiply or divide operator after a number', () => {
      calculator.addInput('3x')
      calculator.addInput('÷');
      calculator.getResultValue().should('equal', '3÷');
    });

    it('Chain calculations workflow - should handle chained operations correctly: 10÷2×3=15', () => {
      calculator.addInput('10÷2×3.5');
      calculator.answerByEnterButton();
      calculator.getResultValue().should('equal', '17.5');
    });
});

context('Error Handling', () => {
  it('should show same number when any number is entered followed by an equal sign', () => {
    calculator.addInput('50.')
    calculator.answerByEnterButton();
    calculator.getResultValue().should('equal', '50');
  });

  it('divide by zero should show infinity', () => {
    calculator.addInput('10÷0');
    calculator.answerByEquals();
    calculator.getResultValue().should('equal', 'Infinity');
  });

  it('zero divide by zero should show Error', () => {
    calculator.addInput('0÷0');
    calculator.answerByEquals();
    calculator.getResultValue().should('equal', 'Error');
  });

  it('zero followed by divide and equals should show same input', () => {
    calculator.addInput('0÷');
    calculator.answerByEquals();
    calculator.getResultValue().should('equal', '0÷');
  });

  it('zero multiply by dot should show Error', () => {
    calculator.addInput('0x.');
    calculator.answerByEquals();
    calculator.getResultValue().should('equal', 'Error');
  });

  it('6 x 06 should not break calculation', () => {
    calculator.addInput('6x06');
    calculator.getResultValue().should('equal', '6x6');
    calculator.answerByEquals();
    calculator.getResultValue().should('equal', '36');
  });

  it('should ignore invalid keyboard characters and show nothing in the calculator display', () => {
    calculator.addInput('-5', "keyboard")
    calculator.getResultValue().should('equal', '-5');
    const invalidChars = ['@', '#', '$', '&', 'a', 'z', ':', '<', '>', '?'];
    invalidChars.forEach(char => {
      calculator.addInput(char,"keyboard");
      calculator.getResultValue().should('equal', '-5'); // Still just -5
    });
  });

  it('should show number literal using E-notation for really big numbers', () => {
    calculator.addInput('9999999999x9999999999');
    calculator.answerByEnterButton();
    calculator.getResultValue().should('equal', '1e+20');
  });
});

context('Other Buttons Tests', () => {
    it('Backspace should clear the calculator result/text field', () => {
      calculator.addInput('796', "keyboard");
      calculator.addInput('{backspace}', "keyboard");
      calculator.getResultValue().should('equal', '79');
    });
    
    it('CE should clear input entry one by one', () => {
      calculator.addInput('9×9');
      calculator.isCEVisible().should('be.true');
      // Test CE clears current entry
      calculator.clearEntry();
      calculator.getResultValue().should('equal', '9×');
      calculator.clearEntry();
      calculator.getResultValue().should('equal', '9');
      calculator.clearEntry();
      calculator.getResultValue().should('equal', '0');
    });

    //Test for AC button and continue calculations
    it('should clear the calculator result/text field with single click', () => {
      calculator.addInput('9×9');
      calculator.answerByEquals();
      calculator.getResultValue().should('equal', '81');
      calculator.isACVisible().should('be.true');
      calculator.allClear();
      calculator.getResultValue().should('equal', '0');
      calculator.isACVisible().should('be.false');
      calculator.addInput('9+9');
      calculator.answerByEquals();
      calculator.getResultValue().should('equal', '18');
      calculator.isACVisible().should('be.true');
    });
  });
});
