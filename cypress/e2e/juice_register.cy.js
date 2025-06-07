describe('Juice Shop - Register Test', () => {
    beforeEach(() => {
        cy.visit('/')

        // Đợi trang load xong
        cy.wait(1000)


        // Close welcome banner and cookie dialog if they appear
        cy.get('body').then(($body) => {
            if ($body.find('button[aria-label="Close Welcome Banner"]').length > 0) {
                cy.get('button[aria-label="Close Welcome Banner"]').click({ force: true })
            }
            if ($body.find('a[aria-label="dismiss cookie message"]').length > 0) {
                cy.get('a[aria-label="dismiss cookie message"]').click({ force: true })
            }
        })

        // Chờ DOM ổn định
        cy.wait(500)

        // Go to registration page
        cy.get('#navbarAccount').click({ force: true })
        cy.get('#navbarLoginButton').click()
        cy.contains("Not yet a customer?").click({ force: true });
    })

    it('should register with valid credentials', () => {
        const email = `user${Date.now()}@test.com`
        cy.get('#emailControl').type(email)
        cy.get('#passwordControl').type('StrongPass123!')
        cy.get('#repeatPasswordControl').type('StrongPass123!')
        cy.get('[name="securityQuestion"]').click();
        cy.get("mat-option").contains("Your eldest siblings middle name?").click();
        cy.get("#securityAnswerControl").type("Le");
        cy.get("#registerButton").click();
        cy.contains('Registration completed successfully').should('be.visible')
    })

    it('should not register with an existing email', () => {
        cy.get('#emailControl').type('admin@juice-sh.op')
        cy.get('#passwordControl').type('StrongPass123!')
        cy.get('#repeatPasswordControl').type('StrongPass123!')
        cy.get('[name="securityQuestion"]').click();
        cy.get("mat-option").contains("Your eldest siblings middle name?").click();
        cy.get("#securityAnswerControl").type("Le");
        cy.get("#registerButton").click();
        cy.get('.error, .mat-error, .mat-snack-bar-container').should('contain', 'Email must be unique')
    })

    it('should not register with mismatched passwords', () => {
        cy.get('#emailControl').type(`user${Date.now()}@test.com`)
        cy.get('#passwordControl').type('StrongPass123!')
        cy.get('#repeatPasswordControl').type('WrongPass123!')
        cy.get('[name="securityQuestion"]').click();
        cy.get("mat-option").contains("Your eldest siblings middle name?").click();
        cy.get("#securityAnswerControl").type("Le");
        cy.get('.mat-mdc-form-field-error').should('contain', 'Passwords do not match')
        cy.get('#registerButton').should('be.disabled')
    })

    it('should not register with a weak password', () => {
        cy.get('#emailControl').type(`user${Date.now()}@test.com`)
        cy.get('#passwordControl').type('123')
        cy.get('#repeatPasswordControl').type('123')
        cy.get('[name="securityQuestion"]').click();
        cy.get("mat-option").contains("Your eldest siblings middle name?").click();
        cy.get("#securityAnswerControl").type("Le");
        cy.get('.mat-mdc-form-field-error').should('contain', 'Password must be 5-40 characters long. ')
        cy.get('#registerButton').should('be.disabled')
    })

})