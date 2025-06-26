# OWASP Juice Shop Features Testing with Cypress

This repository contains automated tests for the OWASP Juice Shop application using Cypress testing framework. The project aims to demonstrate how to perform feature testing and security testing on a modern web application.

## About OWASP Juice Shop

[OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) is probably the most modern and sophisticated insecure web application! It can be used in security trainings, awareness demos, CTFs and as a guinea pig for security tools. Juice Shop encompasses vulnerabilities from the entire OWASP Top Ten along with many other security flaws found in real-world applications.

## Project Overview

This project implements automated tests using Cypress to verify the functionality and security features of the OWASP Juice Shop application. The tests cover various aspects of the application including:

- User Authentication and Authorization
- Shopping Cart Functionality
- Product Management
- User Profile Management
- Security Features Testing

## Prerequisites

Before running the tests, ensure you have the following installed:

- Node.js (latest LTS version recommended)
- npm (comes with Node.js)
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/winterzxzz/OWASP_cypress_juice_shop_features_testing.git
cd OWASP_cypress_juice_shop_features_testing
```

2. Install dependencies:
```bash
npm install
```

## Running the Tests

To run the Cypress tests:

```bash
# Open Cypress Test Runner
npm run cypress:open

# Run tests in headless mode
npm run cypress:run
```

## Project Structure

```
├── cypress/
│   ├── e2e/           # Test files
│   ├── fixtures/      # Test data
│   ├── support/       # Support files and commands
│   └── plugins/       # Cypress plugins
├── .gitignore
├── cypress.config.js  # Cypress configuration
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) team for providing an excellent vulnerable web application for testing
- [Cypress](https://www.cypress.io/) for their amazing testing framework

## Contact

Your Name - [@winterzxzz](https://github.com/winterzxzz)

Project Link: [https://github.com/winterzxzz/OWASP_cypress_juice_shop_features_testing](https://github.com/winterzxzz/OWASP_cypress_juice_shop_features_testing)
