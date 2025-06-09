describe('Address Form Validation - OWASP Juice Shop', () => {
    beforeEach(() => {
        cy.visit('/');

        cy.wait(1000);

        cy.get('body').then(($body) => {
            if ($body.find('.cdk-overlay-backdrop').length) {
                cy.get('.cdk-overlay-backdrop').click({ force: true });
            }
            if ($body.find('.close-dialog').length) {
                cy.get('.close-dialog').click({ force: true });
            }
            if ($body.find('button[aria-label="Close Welcome Banner"]').length) {
                cy.get('button[aria-label="Close Welcome Banner"]').click({ force: true });
            }
            if ($body.find('a[aria-label="dismiss cookie message"]').length) {
                cy.get('a[aria-label="dismiss cookie message"]').click({ force: true });
            }
        });

        cy.wait(500);

        // Đăng nhập
        cy.get('#navbarAccount').click({ force: true });
        cy.get('#navbarLoginButton').click();
        cy.get('#email').type('demo');
        cy.get('#password').type('demo');
        cy.get('#loginButton').click();

        cy.wait(1000);

        cy.contains('Your Basket').should('be.visible');

        // Xoá tất cả sản phẩm trong giỏ hàng
        cy.get('button[routerlink="/basket"]').click();

        cy.wait(1000);
        cy.get('body').then($body => {
            if ($body.find('.mdc-data-table__row').length > 0) {
                cy.get('.mdc-data-table__row').each(() => {
                    cy.get('.mat-column-remove button').first().click();
                });
            }
        });
        cy.wait(1000);
        // Kiểm tra giỏ hàng rỗng
        cy.get('mat-row').should('not.exist');
        // quay lại trang chủ
        cy.get('button[aria-label="Back to homepage"]').click();
        cy.wait(1000);
        // Thêm sản phẩm 
        cy.get('mat-card').contains('Apple Juice').parents('mat-card').within(() => {
            cy.get('button[aria-label="Add to Basket"]').click();
        });
        // vao gio hang
        cy.get('button[routerlink="/basket"]').click();
        cy.wait(1000);
        // vao checkout
        cy.get('#checkoutButton').click({ force: true });
        cy.wait(1000);
        // them dia chi moi
        cy.get('button[aria-label="Add a new address"]').click();
        
        
    });

    // // Positive Cases
    it('TC-P01 - Submit valid address successfully', () => {
        var city = 'Hà Nội';
        cy.get('input[placeholder="Please provide a country."]').type('Việt Nam');
        cy.get('input[placeholder="Please provide a name."]').type('Nguyễn Văn A');
        cy.get('input[placeholder="Please provide a mobile number."]').type('0912345678');
        cy.get('input[placeholder="Please provide a ZIP code."]').type('100000');
        cy.get('textarea[placeholder="Please provide an address."]').type('123 Đường ABC');
        cy.get('input[placeholder="Please provide a city."]').type(city);
        cy.get('#submitButton').click();
        cy.get('.cdk-overlay-pane').should('contain.text', city);
    })

    it('TC-P02 - Submit address with emojis and Unicode', () => {
        var city = 'Đà Nẵng';
        cy.get('input[placeholder="Please provide a country."]').type('🇻🇳')
        cy.get('input[placeholder="Please provide a name."]').type('Tèo 🐱')
        cy.get('input[placeholder="Please provide a mobile number."]').type('0909123456')
        cy.get('input[placeholder="Please provide a ZIP code."]').type('700000')
        cy.get('textarea[placeholder="Please provide an address."]').type('Số 9 🏠')
        cy.get('input[placeholder="Please provide a city."]').type(city)
        cy.get('#submitButton').click()
        cy.get('.cdk-overlay-pane').should('contain.text', city);
    })

    it('TC-P03 - Accepts international phone number', () => {
        var city = 'Hồ Chí Minh';
        cy.get('input[placeholder="Please provide a country."]').type('Việt Nam')
        cy.get('input[placeholder="Please provide a name."]').type('Test')
        cy.get('input[placeholder="Please provide a mobile number."]').type('+84981234567')
        cy.get('input[placeholder="Please provide a ZIP code."]').type('100000')
        cy.get('textarea[placeholder="Please provide an address."]').type('123 Street')
        cy.get('input[placeholder="Please provide a city."]').type(city)
        cy.get('#submitButton').click()
        cy.get('.cdk-overlay-pane').should('contain.text', city);
    })

    // Negative Cases
    it('TC-N01 - Submit empty form shows errors', () => {
        cy.get('#submitButton').click()
        cy.get('.mat-error').should('have.length.at.least', 6)
    })

    const requiredFields = [
        'country', 'name', 'mobileNumber', 'zipCode', 'address', 'city'
    ]

    requiredFields.forEach((field, index) => {
        it(`TC-N0${index + 2} - Missing required field: ${field}`, () => {
            const values = {
                country: 'VN',
                name: 'Test',
                mobileNumber: '0123456789',
                zipCode: '12345',
                address: 'Street',
                city: 'City'
            }
            delete values[field]
            Object.entries(values).forEach(([k, v]) => {
                const selector = k === 'address'
                    ? 'textarea[placeholder="Please provide an address."] '
                    : 'input[placeholder="Please provide a ' + k + '."] '
                cy.get(selector).type(v)
            })
            cy.get('#submitButton').click()
            cy.get('.mat-error').should('exist')
        })
    })

    it('TC-N08 - Mobile number contains letters', () => {
        cy.get('input[placeholder="Please provide a mobile number."]').type('09AB123')
        cy.get('#submitButton').click()
        cy.get('.mat-error').should('contain', 'Please provide a mobile number')
    })

    it('TC-N09 - ZIP code contains letters', () => {
        cy.get('input[placeholder="Please provide a ZIP code."]').type('12AB3')
        cy.get('#submitButton').click()
        cy.get('.mat-error').should('contain', 'Please provide a ZIP code')
    })

    it('TC-N10 - Extremely long input values (255+ chars)', () => {
        const longStr = 'a'.repeat(256)
        cy.get('input[placeholder="Please provide a country."]').type(longStr)
        cy.get('input[placeholder="Please provide a name."]').type(longStr)
        cy.get('input[placeholder="Please provide a mobile number."]').type('0123456789')
        cy.get('input[placeholder="Please provide a ZIP code."]').type('12345')
        cy.get('textarea[placeholder="Please provide an address."]').type(longStr)
        cy.get('input[placeholder="Please provide a city."]').type(longStr)
        cy.get('#submitButton').click()
        cy.url().should('include', '/address/saved') // Nếu không validate độ dài
    })

    it('TC-N11 - XSS injection in name field', () => {
        cy.get('input[placeholder="Please provide a country."]').type('VN')
        cy.get('input[placeholder="Please provide a name."]').type('<script>alert(1)</script>')
        cy.get('input[placeholder="Please provide a mobile number."]').type('0123456789')
        cy.get('input[placeholder="Please provide a ZIP code."]').type('100000')
        cy.get('textarea[placeholder="Please provide an address."]').type('Address')
        cy.get('input[placeholder="Please provide a city."]').type('City')
        cy.get('#submitButton').click()
        cy.contains('<script>').should('not.exist')
    })

    it('TC-N12 - Negative mobile number', () => {
        cy.get('input[placeholder="Please provide a mobile number."]').type('-0123456789')
        cy.get('#submitButton').click()
        cy.get('.mat-error').should('contain', 'Please provide a mobile number')
    })
})