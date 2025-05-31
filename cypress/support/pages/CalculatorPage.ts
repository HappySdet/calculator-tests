import { CALCULATOR_SELECTORS } from "../constants/google_calculator_page";

export class CalculatorPage {
  clickCalculatorButton(button: string): this {
    cy.get(CALCULATOR_SELECTORS.buttons)
      .contains(button)
      .should("be.visible")
      .click();
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
    return this.getCEButton().then(($el) => $el.is(":visible"));
  }

  isACVisible(): Cypress.Chainable<boolean> {
    return this.getACButton().then(($el) => $el.is(":visible"));
  }

  /**
   *
   * @param input Enter the input without spaces. For example, "5+5" is valid but "5+5=" is not. Only valid operators are +, -, *, / are allowed.
   *
   * @returns
   */
  inputThroughButtons(input: string): this {
    input.split("").forEach((char) => this.clickCalculatorButton(char));
    return this;
  }

  /**
   *
   * @param input Enter the input without spaces. For example, "5+5" is valid but "5+5=" is not. Only valid operators are +, -, *, / are allowed.
   *
   * @returns
   */
  inputThroughKeyboard(input: string): this {
    input
      .split("")
      .forEach((char) => cy.get(CALCULATOR_SELECTORS.textField).type(char));
    return this;
  }

  addInput(
    expression: string,
    method: "buttons" | "keyboard" = "buttons",
  ): this {
    if (method === "buttons") {
      this.inputThroughButtons(expression);
    } else {
      this.inputThroughKeyboard(expression);
    }
    return this;
  }

  answerByEquals(): this {
    return this.clickCalculatorButton("=");
  }

  answerByEnterButton(): this {
    cy.get(CALCULATOR_SELECTORS.textField).type("{enter}");
    return this;
  }

  get result() {
    return cy.get(CALCULATOR_SELECTORS.result);
  }

  getResultValue(): Cypress.Chainable<string> {
    return this.result.invoke("text").then((text) => {
      const cleanText = text.trim();
      return cleanText;
    });
  }

  waitForCalculatorToLoad(): this {
    cy.get(CALCULATOR_SELECTORS.calculatorSection).should("be.visible");
    cy.get(CALCULATOR_SELECTORS.textField)
      .should("be.visible")
      .and("contain.text", "0");
    return this;
  }

  ensureCalculatorReady() {
    this.getResultValue().then((currentValue) => {
      if (currentValue === "0") {
        cy.log("Calculator already in initial state");
        return;
      } else {
        const hasAC = this.isACVisible();
        const hasCE = this.isCEVisible();

        if (hasAC) {
          this.allClear();
        } else if (hasCE) {
          this.clearAllInput();
        } else {
          cy.reload();
        }
      }
      // Verify reset worked
      this.getResultValue().should("equal", "0");
    });
  }

  clearAllInput() {
    // Keep pressing CE until we get to 0
    this.getResultValue().then((value) => {
      if (value !== "0") {
        this.clearEntry();
        cy.wait(50);
        this.clearAllInput();
      }
    });
  }
}
