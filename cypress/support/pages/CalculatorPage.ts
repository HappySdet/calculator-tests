import { CALCULATOR_SELECTORS } from "../constants/google_calculator_selectors";

export class CalculatorPage {
  waitForCalculatorToLoad(): this {
    cy.get(CALCULATOR_SELECTORS.calculatorSection).should("be.visible");
    cy.get(CALCULATOR_SELECTORS.textField)
      .should("be.visible")
      .and("contain.text", "0");
    return this;
  }

  clickNumbersButton(button: string): this {
    cy.get(CALCULATOR_SELECTORS.calculatorSection).within(() => {
      cy.get(CALCULATOR_SELECTORS.numbersTable).within(() => {
        cy.get(CALCULATOR_SELECTORS.buttons).contains(button).click();
      });
    });
    return this;
  }

  clickOperatorsButton(operator: string): this {
    if (operator === "divide") {
      cy.get(CALCULATOR_SELECTORS.operators.divide)
        .should("be.visible")
        .click();
    }
    if (operator === "multiply") {
      cy.get(CALCULATOR_SELECTORS.operators.multiply)
        .should("be.visible")
        .click();
    }
    if (operator === "minus") {
      cy.get(CALCULATOR_SELECTORS.operators.minus).should("be.visible").click();
    }
    if (operator === "plus") {
      cy.get(CALCULATOR_SELECTORS.operators.plus).should("be.visible").click();
    }
    return this;
  }

  allClear(): this {
    this.getACButton().should("be.visible").click();
    return this;
  }

  clearEntry(): this {
    this.getCEButton().should("be.visible").click();
    return this;
  }

  getCEButton() {
    return cy.get(CALCULATOR_SELECTORS.buttons).contains("CE");
  }

  getACButton() {
    return cy.get(CALCULATOR_SELECTORS.buttons).contains("AC");
  }

  isCEVisible(): Cypress.Chainable<boolean> {
    return cy.then(() => {
      try {
        return this.getCEButton().then(($el) => {
          return $el.length > 0 && $el.is(":visible");
        });
      } catch (error) {
        return cy.wrap(false);
      }
    });
  }

  isACVisible(): Cypress.Chainable<boolean> {
    return cy.then(() => {
      try {
        return this.getACButton().then(($el) => {
          return $el.length > 0 && $el.is(":visible");
        });
      } catch (error) {
        return cy.wrap(false);
      }
    });
  }

  /**
   *
   * @param expression Enter the numbers through buttons or a keyboard
   * @param method Pass the method to input the expression. By default it is buttons.
   *
   * @returns
   */
  input(expression: string, method: "buttons" | "keyboard" = "buttons"): this {
    if (method === "buttons") {
      this.inputThroughButtons(expression);
    } else {
      this.inputThroughKeyboard(expression);
    }
    return this;
  }

  /**
   *
   * @param input Enter the numbers through buttons.
   *
   * @returns
   */
  private inputThroughButtons(input: string): this {
    input.split("").forEach((char) => this.clickNumbersButton(char));
    return this;
  }

  /**
   *
   * @param input Enter the numbers through keyboard or can pass keyboard specific keys like backspace, enter, etc.
   *
   * @returns
   */
  private inputThroughKeyboard(input: string): this {
    if (input.startsWith("{") && input.endsWith("}")) {
      cy.get(CALCULATOR_SELECTORS.textField).type(input);
      return this;
    } else {
      input
        .split("")
        .forEach((char) => cy.get(CALCULATOR_SELECTORS.textField).type(char));
      return this;
    }
  }

  /** Get the results of the calculator */
  get result() {
    return cy.get(CALCULATOR_SELECTORS.result);
  }

  getResultValue(): Cypress.Chainable<string> {
    return this.result.invoke("text").then((text) => {
      const cleanText = text.trim();
      return cleanText;
    });
  }

  /** Reset the calculator to initial state. */
  ensureCalculatorReady() {
    this.getResultValue().then((currentValue) => {
      if (currentValue === "0") {
        cy.log("Calculator already in initial state");
        return;
      } else {
        // Resolve both chainables to get actual boolean values
        this.isACVisible().then((hasAC) => {
          this.isCEVisible().then((hasCE) => {
            cy.log(`AC visible: ${hasAC}, CE visible: ${hasCE}`);

            if (hasAC) {
              cy.log("Clearing with AC");
              this.allClear();
            } else if (hasCE) {
              cy.log("Clearing with CE");
              this.clearAllInput();
            } else {
              cy.log("No clear buttons found, reloading page");
              cy.reload();
            }

            // Verify reset worked
            this.getResultValue().should("equal", "0");
          });
        });
      }
    });
  }

  clearAllInput() {
    // Keep pressing CE until we get to 0
    this.getResultValue().then((value) => {
      if (value !== "0") {
        this.clearEntry();
        this.clearAllInput();
      }
    });
  }
}
