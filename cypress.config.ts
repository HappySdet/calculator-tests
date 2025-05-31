import { defineConfig } from 'cypress'
export default defineConfig({
  e2e: {
    baseUrl: 'http://www.google.com',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 4000,
    chromeWebSecurity: false,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    video: true,
    videosFolder: 'cypress/videos',
    trashAssetsBeforeRuns: true,
    testIsolation: true
  },
});