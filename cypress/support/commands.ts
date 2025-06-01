declare namespace Cypress {
  interface Chainable {
    handleCaptcha(timeout?: number): Chainable<void>;
  }
}

Cypress.Commands.add("handleCaptcha", (timeout = 10000) => {
  cy.get("body", { timeout }).then(($body) => {
    const captchaForm = $body.find('form[id="captcha-form"]').length > 0;
    const captchaDiv = $body.find('div[id="recaptcha"]').length > 0;

    if (captchaForm || captchaDiv) {
      if (!Cypress.env("CI")) {
        cy.log("⚠️ CAPTCHA detected! Please solve manually in browser...");
        cy.pause();
        cy.log("✅ Resuming after manual CAPTCHA solution");

        // Wait a bit after resume to ensure page loads
        cy.wait(2000);
      } else {
        cy.log("🤖 CAPTCHA detected in CI environment. Skipping test.");
        return;
      }
    } else {
      cy.log("✅ No CAPTCHA detected, proceeding...");
    }
  });
});
