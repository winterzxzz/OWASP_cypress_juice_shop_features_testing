let testResults = [];
let title;
var startTime;

function setTitle(name) {
  title = name;
}

function getTitle() {
  return title;
}

function addTestResult(result) {
  testResults.push(result);
}

function getTestResults() {
  return testResults;
}

function clearTestResults() {
  testResults = [];
}

// Function to extract describe title from Cypress context
function extractDescribeTitle() {
  // Try to get the parent suite title
  if (Cypress.currentTest && Cypress.currentTest.parent) {
    let parent = Cypress.currentTest.parent;
    return parent.title;
  }
  return 'Unknown Test Suite';
}

module.exports = {
  setTitle,
  getTitle,
  addTestResult,
  getTestResults,
  clearTestResults,
  extractDescribeTitle
};
