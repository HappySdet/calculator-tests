# Calculator Tests

A comprehensive Cypress testing framework for Google Calculator functionality.

# Assumptions Taken

Tests will run on testing environment where reCAPTCHA is disabled. On production, reCAPTCHA stops the cypress from crawling into google search.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd calculator-tests

# Install dependencies
npm install

# Install Cypress
npm install cypress --save-dev
```

## 📁 Project Structure

```
calculator-tests/
├── cypress/
│   ├── e2e/
│   │   └── *.cy.ts
│   ├── fixtures/
│   │   └── *.json
│   ├── support/
│   │   ├── constants
              └── google_calculator_selectors.ts
              └── google_search_selectors.ts
│   │   └── pages
              └── CalculatorPage.ts # Page Object Model
              └── GoogleSearchPage.ts # Page Object Model
│   │   └── utils
│   │   └── e2e.ts
│   │   └── commands.js
│   │   └── e2e.js
│   ├── screenshots/
│   └── videos/             
├── cypress.config.ts
└── package.json
```

## 🧪 Running Tests

### Interactive Mode (Cypress GUI)
```bash
# Open Cypress Test Runner
npm run cy:open
```

### Headless Mode (CI/CD)
```bash
# Run all tests
npm run cy:run
```
