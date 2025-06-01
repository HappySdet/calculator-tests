# Calculator Tests

A comprehensive Cypress testing framework for Google Calculator functionality.

<img width="1722" alt="Screenshot 2025-05-31 at 6 02 19 PM" src="https://github.com/user-attachments/assets/284ae119-d3e0-4740-9394-e955298b674c" />


# Assumptions Taken

Tests should be ran on testing environment where reCAPTCHA is disabled. On production, reCAPTCHA stops the cypress from crawling into google search.
So, captcha handler is added in commands.ts to handle reCAPTCHA. In this case, if cypress detects captcha, it will pause the tests and wait for a human to solve the captcha. And then click the resume button to resume the tests.
Which also means, these tests can only be run using cy:open command.

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
└── tsconfig.json
└── README.md
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
