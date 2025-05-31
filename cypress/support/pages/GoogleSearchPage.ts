import { GOOGLE_SEARCH_PAGE_SELECTORS } from "../constants/google_search_selectors";

export class GoogleSearchPage {
  private static readonly BASE_URL = "https://www.google.com";

  visit(): this {
    cy.visit(GoogleSearchPage.BASE_URL);
    return this;
  }

  get searchBox() {
    return cy.get(GOOGLE_SEARCH_PAGE_SELECTORS.searchBox).should("be.visible");
  }

  get searchButton() {
    return cy
      .get(GOOGLE_SEARCH_PAGE_SELECTORS.googleSearchButton)
      .should("be.visible");
  }

  get logo() {
    return cy.get(GOOGLE_SEARCH_PAGE_SELECTORS.googleLogo).should("be.visible");
  }

  get navigationBar() {
    return cy
      .get(GOOGLE_SEARCH_PAGE_SELECTORS.navigationBar)
      .should("be.visible");
  }

  clearSearchBox(): this {
    this.searchBox.clear();
    return this;
  }

  typeSearchQuery(query: string, clear: boolean = false): this {
    if (clear) {
      this.clearSearchBox();
    }
    this.searchBox.type(query, { delay: 50 });
    return this;
  }

  submitSearch(): this {
    this.searchBox.type("{enter}");
    return this;
  }

  verifyPageLoaded(): this {
    this.logo.should("be.visible");
    this.searchBox.should("be.visible").and("be.enabled");
    this.navigationBar.should("be.visible");
    return this;
  }
}
