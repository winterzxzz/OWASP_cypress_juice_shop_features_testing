// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


// close dialog and banner
Cypress.Commands.add('closeDialogAndBanner', () => {
    cy.get('body').then(($body) => {
        if ($body.find('.cdk-overlay-backdrop').length > 0) {
            cy.get('.cdk-overlay-backdrop', { timeout: 5000 }).first().click({ force: true });
        }
        if ($body.find('.close-dialog').length > 0) {
            cy.get('.close-dialog', { timeout: 5000 }).first().click({ force: true });
        }
        // if ($body.find('button[aria-label="Close Welcome Banner"]').length > 0) {
        //     cy.get('button[aria-label="Close Welcome Banner"]', { timeout: 5000 }).first().click({ force: true });
        // }

        if ($body.find('a[aria-label="dismiss cookie message"]').length > 0) {
            cy.get('a[aria-label="dismiss cookie message"]', { timeout: 5000 }).first().click({ force: true });
        }
    });
});


// login
Cypress.Commands.add('login', (email, password) => {
    cy.get('#navbarAccount').click({ force: true });
    cy.get('#navbarLoginButton').click();
    cy.get('#email').type(email);
    cy.get('#password').type(password);
    cy.get('#loginButton').click();
    cy.wait(1000);
    cy.contains('Your Basket').should('be.visible');
});

// go to home page
Cypress.Commands.add('goToHomePage', () => {
    cy.get('button[aria-label="Back to homepage"]').click();
    cy.wait(1000);
});





// get cart quantity
Cypress.Commands.add('getCartQuantity', () => {
    return cy.get('button[aria-label="Show the shopping cart"] .mdc-button__label .warn-notification')
        .invoke('text')
        .then(text => parseInt(text.trim(), 10))
        .then(quantity => {
            return cy.wrap(quantity);
        });
});

// add product to cart
Cypress.Commands.add('addProductToCart', (productName, quantity = 1) => {
    cy.get('mat-card').contains(productName).parents('mat-card')
        .find('button[aria-label="Add to Basket"]')
        .then(($btn) => {
            for (let i = 0; i < quantity; i++) {
                cy.wrap($btn).click();
            }
        });

    cy.checkOverlayPaneWithText(productName);
});

// check overlay pane with text
Cypress.Commands.add('checkOverlayPaneWithText', (text) => {
    cy.get('.cdk-overlay-pane').should('contain.text', text);
});


// go to cart page
Cypress.Commands.add('goToCartPage', () => {
    cy.get('button[routerlink="/basket"]').click();
    cy.wait(1000);
});

// go to select address
Cypress.Commands.add('goToSelectAddress', () => {
    cy.get('#checkoutButton').click({ force: true });
    cy.wait(1000);
});

// select address
Cypress.Commands.add('selectAddress', (addressName) => {
    cy.get('mat-row').contains(addressName).click();
    cy.wait(1000);
});

// go to select delivery method
Cypress.Commands.add('goToSelectDeliveryMethod', () => {
    cy.get('button[aria-label="Proceed to payment selection"]').click();
    cy.wait(1000);
});

// check go to 


// check go to select delivery method is enabled
Cypress.Commands.add('checkGoToSelectDeliveryMethod', () => {
    cy.get('button[aria-label="Proceed to payment selection"]').should('be.enabled');
});

// select delivery method
Cypress.Commands.add('selectDeliveryMethod', (deliveryMethodName) => {
    cy.get('mat-row').contains(deliveryMethodName).click();
    cy.wait(1000);
});

// go to select payment method
Cypress.Commands.add('goToSelectPaymentMethod', () => {
    cy.get('button[aria-label="Proceed to delivery method selection"]').click();
    cy.wait(1000);
});

// check go to select payment method is enabled
Cypress.Commands.add('checkGoToSelectPaymentMethod', () => {
    cy.get('button[aria-label="Proceed to delivery method selection"]').should('be.enabled');
});

// select payment method
Cypress.Commands.add('selectPaymentMethod', (paymentMethodName) => {
    cy.get('mat-row').contains(paymentMethodName).parents('mat-row')
        .find('mat-radio-button')
        .click();
    cy.wait(1000);
});

// go to order summary
Cypress.Commands.add('goToOrderSummary', () => {
    cy.get('button[aria-label="Proceed to review"]').click();
    cy.wait(1000);
});

// check go to order summary is enabled
Cypress.Commands.add('checkGoToOrderSummary', () => {
    cy.get('button[aria-label="Proceed to review"]').should('be.enabled');
});

// go to order confirmation
Cypress.Commands.add('goToOrderConfirmation', () => {
    cy.get('button[aria-label="Complete your purchase"]').click();
    cy.wait(1000);
});

// get quantity of product in cart
Cypress.Commands.add('getQuantityOfProductInCart', (productName) => {
    return cy.get('mat-table').contains(productName).parents('mat-row').find('.mat-column-quantity span')
        .invoke('text')
        .then(text => parseInt(text, 10))
        .then(quantity => {
            return cy.wrap(quantity);
        });
});

// go to add new address
Cypress.Commands.add('goToAddNewAddress', () => {
    cy.get('button[aria-label="Add a new address"]').click();
    cy.wait(1000);
});

// check submit form add new address is enabled
Cypress.Commands.add('checkSubmitFormAddNewAddress', (isTrue) => {
    if (isTrue) {
        cy.get('#submitButton')
            .scrollIntoView()
            .should('be.visible')  // optional but recommended
            .should('be.enabled');  // safer than 'be.enabled' in Angular context
    } else {
        cy.get('#submitButton')
            .scrollIntoView()
            .should('be.visible')  // optional but recommended
            .should('not.be.enabled');  // safer than 'be.enabled' in Angular context
    }
});

// submit form add new address
Cypress.Commands.add('submitFormAddNewAddress', () => {
    cy.get('#submitButton').click();
    cy.wait(1000);
});

// check submit form add new card is enabled
Cypress.Commands.add('checkSubmitFormAddNewCard', (isTrue) => {
    if (isTrue) {
        cy.get('#submitButton').should('be.enabled');
    } else {
        cy.get('#submitButton').should('not.be.enabled');
    }
});

// submit form add new card
Cypress.Commands.add('submitFormAddNewCard', () => {
    cy.get('#submitButton').click();
    cy.wait(1000);
});

// open add new card
Cypress.Commands.add('openAddNewCard', () => {
    cy.get('mat-expansion-panel').first().click();
    cy.wait(1000);
});

// open add coupon
Cypress.Commands.add('openAddCoupon', () => {
    cy.get('mat-expansion-panel').eq(1).click();
    cy.wait(1000);
});

// check payment success
Cypress.Commands.add('checkPaymentSuccess', () => {
    cy.get('.confirmation').should('contain', 'Thank you for your purchase!');
});

// fill form add new card
Cypress.Commands.add('fillFormAddNewCard', (
    name,
    cardNumber,
    expiryMonth,
    expiryYear,
) => {
    cy.get('mat-expansion-panel').first().within(() => {
        // Name Field
        if (name) {
            cy.get('mat-form-field').eq(0).find('input').type(name);
        } else {
            cy.get('mat-form-field').eq(0).find('input').click().blur();
        }

        // Card Number Field
        if (cardNumber) {
            cy.get('mat-form-field').eq(1).find('input').type(cardNumber);
        } else {
            cy.get('mat-form-field').eq(1).find('input').click().blur();
        }

        // Expiry Month Field
        if (expiryMonth) {
            cy.get('mat-form-field').eq(2).find('select').select(expiryMonth);
        } else {
            cy.get('mat-form-field').eq(2).find('select').focus().blur();
        }

        // Expiry Year Field
        if (expiryYear) {
            cy.get('mat-form-field').eq(3).find('select').select(expiryYear);
        } else {
            cy.get('mat-form-field').eq(3).find('select').focus().blur();
        }
    });
});

// fill form add coupon
Cypress.Commands.add('fillFormAddCoupon', (couponCode) => {
    const input = (placeholder, value) => {
        const el = cy.get(`input[placeholder="${placeholder}"]`);
        if (value === '') {
            el.click().blur(); // focus rồi blur để hiện lỗi
        } else {
            el.type(value);
        }
    };

    input('Please enter your coupon code', couponCode);
});

// redeem coupon
Cypress.Commands.add('redeemCoupon', () => {
    cy.get('#applyCouponButton').click();
    cy.wait(1000);
});

// check redeem coupon is enabled
Cypress.Commands.add('checkRedeemCoupon', (isTrue) => {
    if (isTrue) {
        cy.get('#applyCouponButton').should('be.enabled');
    } else {
        cy.get('#applyCouponButton').should('not.be.enabled');
    }
});

// check error message coupon
Cypress.Commands.add('checkErrorMessageCoupon', (errorMessage) => {
    cy.get('.error').should('contain', errorMessage);
});

// check success message coupon
Cypress.Commands.add('checkSuccessMessageCoupon', (successMessage) => {
    cy.get('.confirmation').should('contain', successMessage);
});

// Check text of address
Cypress.Commands.add('checkTextShouldBeEmptyOfAddressForm', (placeholder) => {
    const selector = `input[placeholder="${placeholder}"]`;
    cy.get(selector).should('have.value', '');
});

// fill form add new address
Cypress.Commands.add('fillFormAddNewAddress', (
    country,
    name,
    mobileNumber,
    zipCode,
    address,
    city,
    state
) => {
    const input = (placeholder, value) => {
        const selector = `input[placeholder="${placeholder}"]`;

        if (value === '') {
            cy.get(selector).click().blur(); // trigger validation
        } else {
            if (placeholder === 'Please provide a mobile number.') {
                if (value.includes('+') || value.includes('-') || value.includes('.')) {
                    cy.get(selector)
                        .invoke('attr', 'type', 'tel')
                        .clear()
                        .type(value);
                } else {
                    cy.get(selector)
                        .clear()
                        .type(value);
                }
            } else {
                cy.get(selector)
                    .clear()
                    .type(value);
            }
        }
    };

    const textarea = (placeholder, value) => {
        const el = cy.get(`textarea[placeholder="${placeholder}"]`);
        if (value === '') {
            el.click().blur(); // trigger validation
        } else {
            el.clear().type(value);
        }
    };

    // Gọi hàm điền vào các trường
    input('Please provide a country.', country);
    input('Please provide a name.', name);
    input('Please provide a mobile number.', mobileNumber);
    input('Please provide a ZIP code.', zipCode);
    textarea('Please provide an address.', address);
    input('Please provide a city.', city);

    if (state !== undefined && state !== null) {
        input('Please provide a state.', state);
    }
});

// check error message
Cypress.Commands.add('checkErrorMessage', (errorMessage) => {
    cy.get('mat-error').should('contain', errorMessage);
});

// check input address value length is less than 160
Cypress.Commands.add('checkInputAddressValueLength', (address) => {
    cy.get('textarea[placeholder="Please provide an address."]')
        .type(address)
        .invoke('val')
        .should('have.length.at.most', 160);
});



// increase quantity of product in cart
Cypress.Commands.add('increaseQuantityOfProductInCart', (productName) => {
    return cy.get('mat-table')
        .contains(productName)
        .parents('mat-row')
        .find('.mat-column-quantity button')
        .last()
        .click()
        .wait(1000)
        .then(() => {
            return cy.getQuantityOfProductInCart(productName);
        });
});



// decrease quantity of product in cart
Cypress.Commands.add('decreaseQuantityOfProductInCart', (productName) => {
    return cy.get('mat-table')
        .contains(productName)
        .parents('mat-row')
        .find('.mat-column-quantity button')
        .first()
        .click()
        .wait(1000)
        .then(() => {
            return cy.getQuantityOfProductInCart(productName);
        });
});

// delete product from cart
Cypress.Commands.add('deleteProductFromCart', (productName) => {
    cy.get('mat-table').contains(productName).parents('mat-row')
        .find('.mat-column-remove button')
        .first()
        .click();
    cy.get('mat-table').should('not.contain.text', productName);
});

// delete all products from cart
Cypress.Commands.add('deleteAllProductsFromCart', () => {
    cy.get('body').then($body => {
        if ($body.find('.mdc-data-table__row').length > 0) {
            cy.get('.mdc-data-table__row').each(() => {
                cy.get('.mat-column-remove button').first().click();
            });
        }
    });
    cy.get('mat-row').should('not.exist');
});

// get product price
Cypress.Commands.add('getProductPrice', (productName) => {
    return cy.get('mat-table').contains(productName).parents('mat-row').find('.mat-column-price')
        .invoke('text')
        .then((price) => {
            const numericPrice = parseFloat(price.replace(/[^\d.]/g, '')); // loại bỏ ký tự không phải số
            return cy.wrap(numericPrice);
        });
});


// get total price
Cypress.Commands.add('getTotalPrice', () => {
    return cy.get('#price').invoke('text').then((totalPrice) => {
        const value = parseFloat(totalPrice.split(' ')[2].replace(/[^\d.]/g, ''));
        return cy.wrap(value);
    });
});



// open search input
Cypress.Commands.add('openSearchInput', () => {
    cy.get('#searchQuery').click();
    cy.get('#mat-input-1').should('be.visible');
});

// search product
Cypress.Commands.add('searchProduct', (productName) => {
    cy.get('#mat-input-1').type(productName + '{enter}');
});


// check product is displayed
Cypress.Commands.add('checkProductIsDisplayed', (productName) => {
    cy.get('.mat-grid-tile').should('contain.text', productName);
});


// check only one product is displayed
Cypress.Commands.add('checkOnlyOneProductIsDisplayed', (productName) => {
    cy.get('.mat-grid-tile').should('contain.text', productName)
        .and('have.length', 1);
});


// check empty state is displayed
Cypress.Commands.add('checkEmptyStateIsDisplayed', () => {
    cy.get('.emptyState').should('be.visible');
});

// hide search input
Cypress.Commands.add('hideSearchInput', () => {
    cy.wait(500);
    cy.get('#searchQuery').click();
    cy.get('#mat-input-1').should('not.be.visible');
});

// open detail product
Cypress.Commands.add('openDetailProduct', (productName) => {
    cy.get('.mat-grid-tile').first().click();
    cy.get('.mdc-dialog__content').should('contain.text', productName);
});


// clear search input
Cypress.Commands.add('clearSearchInput', () => {
    cy.get('#mat-input-1').clear();
});

// check is hidden search input and empty
Cypress.Commands.add('checkIsHiddenSearchInputAndEmpty', () => {
    cy.get('#mat-input-1').should('not.be.visible');
    cy.get('#mat-input-1').should('have.value', '');
});
