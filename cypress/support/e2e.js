// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

const resultsCollector = require('../results');

before(() => {
    resultsCollector.clearTestResults();
});

beforeEach(function () {
    // Capture the describe title on first test run
    // for mat hh:mn:ss - dd/mm/yyyy
    this.startTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' - ' + new Date().toLocaleDateString('vi-VN');
});

afterEach(function () {
    
    if (!resultsCollector.getTitle()) {
        const describeTitle = this.currentTest.parent.title;
        resultsCollector.setTitle(describeTitle);
    }
  


    const { state, title } = this.currentTest;
    resultsCollector.addTestResult({
        title,
        state: state.charAt(0).toUpperCase() + state.slice(1),
        time: this.startTime
    });
});



after(() => {
    const results = resultsCollector.getTestResults();
    const title = resultsCollector.getTitle();
    cy.task('exportResultsToExcel', { results, title });
});
