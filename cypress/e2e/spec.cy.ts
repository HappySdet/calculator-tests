import { GoogleSearchPage } from "../support/pages/GoogleSearchPage";
import { CalculatorPage } from "../support/pages/CalculatorPage";

describe("Google Calculator - E2E Tests", () => {
  const googleSearch = new GoogleSearchPage();
  const calculator = new CalculatorPage();

  before(() => {
    googleSearch.visit();
    googleSearch.verifyPageLoaded();
    googleSearch.typeSearchQuery("calculator");
    googleSearch.submitSearch();
    cy.on("uncaught:exception", (err, runnable) => {
      // Ignore specific errors that don't affect your test
      if (
        err.message.includes("recaptcha") ||
        err.message.includes("captcha") ||
        err.message.includes("solveSimpleChallenge")
      ) {
        return false;
      }
      return true;
    });
    cy.handleCaptcha();
    calculator.waitForCalculatorToLoad();
  });

  beforeEach(() => {
    cy.visit(calculator.CALCULATOR_PATH);
  });

  /* User Interaction Workflows -
   * 1. Correction workflow
   * 2. Calculation workflow
   * 3. Operator switching workflow
   * 4. Chain calculations workflow
   * Focus for e2e tests are to test user interactions instead of calculations which should be covered by unit tests.
   */
  context("User Workflows", () => {
    it("Correction Workflow - User inputs 8x8, clear an input entry using CE, retypes, and validates result", () => {
      calculator.putExpression("8x8");
      calculator.clearEntry();
      calculator.putExpression("9=");
      calculator.getResultValue().should("equal", "72");
    });

    it("Correction Workflow - User inputs -8x100 with keyboard", () => {
      calculator.input("-8*100=");
      calculator.getResultValue().should("equal", "-800");
    });

    it("Calculation Workflow - should show correct result for decimal expression", () => {
      calculator.putExpression("3.50+4.22");
      calculator.input("{Enter}");
      calculator.getResultValue().should("equal", "7.72");
      calculator.allClear(); // When = or Enter is pressed, AC button should appear and click AC to clear all
    });

    it("Operator switching workflows - should only add either multiply or divide operator after a number", () => {
      calculator.putExpression("3x");
      calculator.putExpression("/");
      calculator.getResultValue().should("equal", "3 ÷");
    });

    it("Chain calculations workflow - should handle chained operations correctly: 10÷2×3.5=17.5", () => {
      calculator.putExpression("10/2x3.5=");
      calculator.getResultValue().should("equal", "17.5");
    });
  });

  context("Error Handling", () => {
    it("should show same number when any number is entered followed by an equal sign", () => {
      calculator.putExpression("5.");
      calculator.putExpression("=");
      calculator.getResultValue().should("equal", "5");
    });

    it("divide by zero should show infinity", () => {
      calculator.putExpression("7/0=");
      calculator.getResultValue().should("equal", "Infinity");
    });

    it("zero divide by zero should show Error", () => {
      calculator.putExpression("0/0=");
      calculator.getResultValue().should("equal", "Error");
    });

    it("zero followed by divide and equals should show same input", () => {
      calculator.putExpression("0/=");
      calculator.getResultValue().should("equal", "0 ÷");
    });

    it("zero multiply by dot should show Error", () => {
      calculator.putExpression("0x.=");
      calculator.getResultValue().should("equal", "Error");
    });

    it("6 x 06 should not break calculation", () => {
      calculator.putExpression("6x06");
      calculator.getResultValue().should("equal", "6 × 6");
      calculator.putExpression("=");
      calculator.getResultValue().should("equal", "36");
    });

    it("should ignore invalid keyboard characters and show nothing in the calculator display", () => {
      calculator.putExpression("-5");
      calculator.getResultValue().should("equal", "-5");
      const invalidChars = ["@", "#", "$", "&", "z", ":", "<", ">", "?"];
      invalidChars.forEach((char) => {
        calculator.input(char);
        calculator.getResultValue().should("equal", "-5"); // Still just -5
      });
    });

    it("should show number literal using E-notation for really big numbers", () => {
      calculator.putExpression("9999999999x9999999999");
      calculator.input("{Enter}");
      calculator.getResultValue().should("equal", "1e+20");
    });
  });

  context("Other Buttons Tests", () => {
    it("Backspace should clear the calculator result/text field", () => {
      calculator.putExpression("796");
      calculator.input("{backspace}");
      calculator.getResultValue().should("equal", "79");
    });

    it("CE should clear input entry one by one", () => {
      calculator.putExpression("9x9");
      calculator.isCEVisible().should("be.true");
      calculator.clearEntry();
      calculator.getResultValue().should("equal", "9 ×");
      calculator.clearEntry();
      calculator.getResultValue().should("equal", "9");
      calculator.clearEntry();
      calculator.getResultValue().should("equal", "0");
    });

    //Test for AC button and continue calculations
    it("should clear the calculator result/text field with single click", () => {
      calculator.putExpression("-9x-9=");
      calculator.getResultValue().should("equal", "81");
      calculator.isACVisible().should("be.true");
      calculator.allClear();
      calculator.getResultValue().should("equal", "0");
      calculator.isACVisible().should("be.false");
      calculator.putExpression("-9-9=");
      calculator.getResultValue().should("equal", "-18");
      calculator.isACVisible().should("be.true");
    });
  });
});
