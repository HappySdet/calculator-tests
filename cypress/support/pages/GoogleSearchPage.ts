import { GOOGLE_SEARCH_PAGE_SELECTORS } from '../constants/google_search_selectors';

export class GoogleSearchPage {
  visit(): this {
    cy.visit('https://www.google.com');
    return this;
  }

  get searchBox() {
    return cy.get(GOOGLE_SEARCH_PAGE_SELECTORS.searchBox);
  }

  get searchButton() {
    return cy.get(GOOGLE_SEARCH_PAGE_SELECTORS.googleSearchButton);
  }

  get logo() {
    return cy.get(GOOGLE_SEARCH_PAGE_SELECTORS.googleLogo);
  }

  get navigationBar() {
    return cy.get(GOOGLE_SEARCH_PAGE_SELECTORS.navigationBar);
  }

  clearSearchBox(): this {
    this.searchBox.clear();
    return this;
  }

  typeSearchQuery(query: string): this {
    this.searchBox.type(query);
    return this;
  }

  submitSearch(): this {
    this.searchBox.type('{enter}');
    return this;
  }

  verifyLogoVisible(): this {
    this.logo.should('be.visible');
    return this;
  }

  verifyNavigationBarVisible(): this {
    this.navigationBar.should('be.visible');
    return this;
  }
}
