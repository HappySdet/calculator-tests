import { CALCULATOR_SELECTORS } from "../constants/google_calculator_selectors";

export class CalculatorPage {
  CALCULATOR_PATH = "/search?q=calculator";

  waitForCalculatorToLoad(): this {
    cy.get(CALCULATOR_SELECTORS.calculatorSection).should("be.visible");
    cy.get(CALCULATOR_SELECTORS.textField)
      .should("be.visible")
      .and("contain.text", "0");
    return this;
  }

  clickNumbersButton(button: string): this {
    cy.get(CALCULATOR_SELECTORS.numbersTable).within(() => {
      cy.get(CALCULATOR_SELECTORS.buttons).contains(button).click();
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
    if (operator === "equals") {
      cy.get(CALCULATOR_SELECTORS.operators.equals)
        .should("be.visible")
        .click();
    }
    if (operator === "point") {
      cy.get(CALCULATOR_SELECTORS.operators.point).should("be.visible").click();
    }
    return this;
  }

  putExpression(expression: string): this {
    const noSpacesExpression = expression.replace(/\s+/g, "");
    noSpacesExpression.split("").forEach((char) => {
      if (!isNaN(Number(char)) && char.trim() !== "") {
        this.clickNumbersButton(char);
      } else if (char === "+") {
        this.clickOperatorsButton("plus");
      } else if (char === "-") {
        this.clickOperatorsButton("minus");
      } else if (char === "x" || char === "*") {
        this.clickOperatorsButton("multiply");
      } else if (char === "/" || char === "÷") {
        this.clickOperatorsButton("divide");
      } else if (char === "=") {
        this.clickOperatorsButton("equals");
      } else if (char === ".") {
        this.clickOperatorsButton("point");
      }
    });
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

  private getCEButton() {
    return cy.get(CALCULATOR_SELECTORS.buttons).contains("CE");
  }

  private getACButton() {
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
   * @param input Use the operations such as backspace, enter, etc. through keyboard. Can be also use for numbers and operators.
   *
   * @returns
   */
  public input(
    input: string,
    method: "buttons" | "keyboard" = "keyboard",
  ): this {
    const noSpacesInput = input.replace(/\s+/g, "");
    if (method === "keyboard") {
      if (noSpacesInput.startsWith("{") && noSpacesInput.endsWith("}")) {
        cy.get(CALCULATOR_SELECTORS.textField).type(noSpacesInput);
      } else {
        noSpacesInput
          .split("")
          .forEach((char) => cy.get(CALCULATOR_SELECTORS.textField).type(char));
      }
    }
    if (method === "buttons") {
      this.putExpression(noSpacesInput);
    }
    return this;
  }

  /** Get the results of the calculator */
  private get result() {
    return cy.get(CALCULATOR_SELECTORS.result);
  }

  getResultValue(): Cypress.Chainable<string> {
    return this.result.invoke("text").then((text) => {
      const cleanText = text.trim();
      return cleanText;
    });
  }

  /** Not using it currently - Manually Reset the calculator to initial state in case captcha block the test cases. */
  private ensureCalculatorReady() {
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

  private clearAllInput() {
    // Keep pressing CE until we get to 0
    this.getResultValue().then((value) => {
      if (value !== "0") {
        this.clearEntry();
        this.clearAllInput();
      }
    });
  }
}
