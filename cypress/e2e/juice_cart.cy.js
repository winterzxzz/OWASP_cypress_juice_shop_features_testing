describe('Juice Shop Cart Tests', () => {

  context('1️⃣ Khi chưa đăng nhập', () => {
    beforeEach(() => {
      cy.visit('/');
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
    });

    it('TC_C1 - Không hiển thị nút Add to Basket nếu chưa đăng nhập', () => {
      cy.get('mat-card').first().within(() => {
        cy.get('button[aria-label="Add to Basket"]').should('not.exist');
      });
    });

    it('TC_C2 - Không thể truy cập giỏ hàng nếu chưa đăng nhập', () => {
      cy.get('button[routerlink="/basket"]').should('not.exist');
    });
  });

  context('2️⃣ Khi đã đăng nhập', () => {
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
    });

    it('TC_C3 - Thêm 1 sản phẩm vào giỏ hàng ở trang chủ', () => {
      // Lấy số lượng hiện tại
      var oldQuantity = 0;
      cy.get('button[aria-label="Show the shopping cart"] .mdc-button__label .warn-notification').then(($el) => {
        oldQuantity = parseInt($el.text().trim(), 10);
      });

      // Thêm sản phẩm 
      cy.get('mat-card').contains('Apple Juice').parents('mat-card').within(() => {
        cy.get('button[aria-label="Add to Basket"]').click();
      });

      // Kiểm tra đã thêm vào giỏ hàng chưa
      cy.get('.cdk-overlay-pane').should('contain.text', 'Apple Juice');


      cy.wait(1000);

      // Kiểm tra số lượng
      cy.get('button[aria-label="Show the shopping cart"] .mdc-button__label .warn-notification').then(($el) => {
        const newQuantity = parseInt($el.text().trim(), 10);
        expect(newQuantity).to.eq(oldQuantity + 1);
      });
    });

    it('TC_C4 - Thêm 1 sản phẩm nhiều lần vào giỏ hàng ở trang chủ', () => {
      // Lấy số lượng hiện tại
      var oldQuantity = 0;
      cy.get('button[aria-label="Show the shopping cart"] .mdc-button__label .warn-notification').then(($el) => {
        oldQuantity = parseInt($el.text().trim(), 10);
      });

      const quantity = 2;

      // Thêm sản phẩm 
      cy.get('mat-card').contains('Apple Juice').parents('mat-card').within(() => {
        for (let i = 0; i < quantity; i++) {
          cy.get('button[aria-label="Add to Basket"]').click();
          cy.wait(1000);
        }
      });

      // Kiểm tra đã thêm vào giỏ hàng chưa
      cy.get('.cdk-overlay-pane').should('contain.text', 'Apple Juice');


      cy.wait(1000);

      // Kiểm tra số lượng
      cy.get('button[aria-label="Show the shopping cart"] .mdc-button__label .warn-notification').then(($el) => {
        const newQuantity = parseInt($el.text().trim(), 10);
        expect(newQuantity).to.eq(oldQuantity + quantity);
      });
    });

    it('TC_C5 - Thêm nhiều sản phẩm khác nhau vào giỏ hàng ở trang chủ', () => {
      // Lấy số lượng hiện tại
      var oldQuantity = 0;
      cy.get('button[aria-label="Show the shopping cart"] .mdc-button__label .warn-notification').then(($el) => {
        oldQuantity = parseInt($el.text().trim(), 10);
      });

      // Thêm sản phẩm 
      cy.get('mat-card').contains('Banana Juice').parents('mat-card').within(() => {
        cy.get('button[aria-label="Add to Basket"]').click();
      });

      // Kiểm tra đã thêm vào giỏ hàng chưa
      cy.get('.cdk-overlay-pane').should('contain.text', 'Banana Juice');

      // Thêm sản phẩm 
      cy.get('mat-card').contains('Carrot Juice').parents('mat-card').within(() => {
        cy.get('button[aria-label="Add to Basket"]').click();
      });

      // Kiểm tra đã thêm vào giỏ hàng chưa
      cy.get('.cdk-overlay-pane').should('contain.text', 'Carrot Juice');


      cy.wait(1000);

      // Kiểm tra số lượng
      cy.get('button[aria-label="Show the shopping cart"] .mdc-button__label .warn-notification').then(($el) => {
        const newQuantity = parseInt($el.text().trim(), 10);
        expect(newQuantity).to.eq(oldQuantity + 2);
      });
    });


    it('TC_C6 - Tăng số lượng sản phẩm trong giỏ hàng', () => {
      // Thêm sản phẩm 
      cy.get('mat-card').contains('Apple Juice').parents('mat-card').within(() => {
        cy.get('button[aria-label="Add to Basket"]').click();
      });

      cy.get('button[routerlink="/basket"]').click();
      var oldQuantity = 0;
      cy.get('mat-table').contains('Apple Juice').parents('mat-row').within(() => {
        cy.get('.mat-column-quantity span').invoke('text').then((quantity) => {
          oldQuantity = parseInt(quantity, 10);
        });
      });

      cy.get('mat-table').contains('Apple Juice').parents('mat-row').within(() => {
        cy.get('.mat-column-quantity button').last().click();
        cy.wait(1000);
        cy.get('.mat-column-quantity span').invoke('text').then((quantity) => {
          expect(parseInt(quantity, 10)).to.eq(oldQuantity + 1);
        });
      });
    });

    it('TC_C7 - Giảm số lượng sản phẩm trong giỏ hàng khi có nhiều hơn 2 sản phẩm', () => {
      // Thêm sản phẩm 
      cy.get('mat-card').contains('Apple Juice').parents('mat-card').within(() => {
        for (let i = 0; i < 2; i++) {
          cy.get('button[aria-label="Add to Basket"]').click();
          cy.wait(1000);
        }
      });

      cy.get('button[routerlink="/basket"]').click();
      // Lấy số lượng hiện tại
      var oldQuantity = 0;
      cy.get('mat-table').contains('Apple Juice').parents('mat-row').within(() => {
        cy.get('.mat-column-quantity span').invoke('text').then((quantity) => {
          oldQuantity = parseInt(quantity, 10);
        });
      });

      cy.get('mat-table').contains('Apple Juice').parents('mat-row').within(() => {
        cy.get('.mat-column-quantity button').first().click();
        cy.wait(1000);
        cy.get('.mat-column-quantity span').invoke('text').then((quantity) => {
          expect(parseInt(quantity, 10)).to.eq(oldQuantity - 1);
        });
      });
    });


    it('TC_C8 - Xóa một sản phẩm sản phẩm khỏi giỏ hàng', () => {
      // Thêm sản phẩm 
      cy.get('mat-card').contains('Apple Juice').parents('mat-card').within(() => {
        cy.get('button[aria-label="Add to Basket"]').click();
      });

      cy.get('button[routerlink="/basket"]').click();
      cy.get('mat-table').contains('Apple Juice').parents('mat-row').within(() => {
        cy.get('.mat-column-remove button').first().click();
      });
      cy.get('mat-table').should('not.contain.text', 'Apple Juice');
    });

    it('TC_C9 - Cập nhật tổng tiền sau khi tăng số lượng sản phẩm', () => {
      // Thêm sản phẩm 
      cy.get('mat-card').contains('Apple Juice').parents('mat-card').within(() => {
        cy.get('button[aria-label="Add to Basket"]').click();
      });
      cy.get('button[routerlink="/basket"]').click();
      var productPrice = 0;
      cy.get('mat-table').contains('Apple Juice').parents('mat-row').within(() => {
        cy.get('.mat-column-price').invoke('text').then((price) => {
          productPrice = parseFloat(price.replace('¤', ''));
        });
      });

      // get old total price
      var oldTotalPrice = 0;
      cy.get('#price').invoke('text').then((totalPrice) => {
        // Total Price: 2.88¤
        console.log(totalPrice);
        oldTotalPrice = parseFloat(totalPrice.split(' ')[2].replace('¤', ''));
      });

      cy.get('mat-table').contains('Apple Juice').parents('mat-row').within(() => {
        cy.get('.mat-column-quantity button').last().click();
        cy.wait(1000);
      });

      cy.get('#price').invoke('text').then((totalPrice) => {
        expect(parseFloat(totalPrice.split(' ')[2].replace('¤', ''))).to.eq(oldTotalPrice + productPrice);
      });
    });

    it('TC_C10 - Cập nhật tổng tiền sau khi giảm số lượng sản phẩm', () => {
      cy.get('mat-card').contains('Apple Juice').parents('mat-card').within(() => {
        for (let i = 0; i < 2; i++) {
          cy.get('button[aria-label="Add to Basket"]').click();
          cy.wait(1000);
        }
      });


      cy.get('button[routerlink="/basket"]').click();
      var productPrice = 0;
      cy.get('mat-table').contains('Apple Juice').parents('mat-row').within(() => {
        cy.get('.mat-column-price').invoke('text').then((price) => {
          productPrice = parseFloat(price.replace('¤', ''));
        });
      });

      // get old total price
      var oldTotalPrice = 0;
      cy.get('#price').invoke('text').then((totalPrice) => {
        // Total Price: 2.88¤
        oldTotalPrice = parseFloat(totalPrice.split(' ')[2].replace('¤', ''));
      });

      cy.get('mat-table').contains('Apple Juice').parents('mat-row').within(() => {
        cy.get('.mat-column-quantity button').first().click();
        cy.wait(1000);
      });

      cy.get('#price').invoke('text').then((totalPrice) => {
        expect(parseFloat(totalPrice.split(' ')[2].replace('¤', ''))).to.eq(oldTotalPrice - productPrice);
      });
    });


    it('TC_C11 - Cập nhật tổng tiền sau khi xóa tất cả sản phẩm', () => {
      // Thêm sản phẩm 
      cy.get('mat-card').contains('Banana Juice').parents('mat-card').within(() => {
        cy.get('button[aria-label="Add to Basket"]').click();
      });

      // Kiểm tra đã thêm vào giỏ hàng chưa
      cy.get('.cdk-overlay-pane').should('contain.text', 'Banana Juice');

      // Thêm sản phẩm 
      cy.get('mat-card').contains('Carrot Juice').parents('mat-card').within(() => {
        cy.get('button[aria-label="Add to Basket"]').click();
      });

      cy.get('.cdk-overlay-pane').should('contain.text', 'Carrot Juice');

      cy.get('button[routerlink="/basket"]').click();
      cy.get('mat-row').then($rows => {
        if ($rows.length > 0) {
          // Remove all rows
          cy.wrap($rows).each(() => {
            cy.get('.mat-column-remove button').first().click();
          });
        }
      });
      cy.get('#price').invoke('text').then((totalPrice) => {
        expect(parseFloat(totalPrice.split(' ')[2].replace('¤', ''))).to.eq(0);
      });
    });

    // it('TC_C12 - Checkout - tạo địa chỉ nếu chưa có địa chỉ nào', () => {
    //   // Thêm sản phẩm 
    //   cy.get('mat-card').contains('Apple Juice').parents('mat-card').within(() => {
    //     cy.get('button[aria-label="Add to Basket"]').click();
    //   });
    //   cy.get('button[routerlink="/basket"]').click();
    //   cy.wait(1000);
    //   cy.get('#checkoutButton').click({ force: true });
    //   cy.get('mat-row').should('not.exist');
    //   cy.get('button[aria-label="Add a new address"]').click();
    // });    

    // checkout
    it('TC_C13 - Thanh toán thành công', () => {
      // Thêm sản phẩm 
      cy.get('mat-card').contains('Apple Juice').parents('mat-card').within(() => {
        cy.get('button[aria-label="Add to Basket"]').click();
      });
      cy.get('button[routerlink="/basket"]').click();
      cy.wait(1000);
      cy.get('#checkoutButton').click({ force: true });
      cy.get('mat-row').contains('Tim Tester').click();

      cy.get('button[aria-label="Proceed to payment selection"]').click();


      cy.get('mat-row').contains('One Day Delivery').click();

      cy.get('button[aria-label="Proceed to delivery method selection"]').click();

      cy.get('mat-row').contains('Tim Tester').parents('mat-row').within(() => {
        cy.get('mat-radio-button').click();
      });

      cy.get('button[aria-label="Proceed to review"]').click();

      cy.get('button[aria-label="Complete your purchase"]').click();

      cy.get('.confirmation').should('be.visible');
    });
  });
});