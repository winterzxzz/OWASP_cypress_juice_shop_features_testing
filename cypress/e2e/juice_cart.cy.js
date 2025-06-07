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
        cy.get('#cdk-overlay-3').should('contain.text', 'to basket');


        cy.wait(1000);

        // Kiểm tra số lượng
        cy.get('button[aria-label="Show the shopping cart"] .mdc-button__label .warn-notification').then(($el) => {
          const newQuantity = parseInt($el.text().trim(), 10);
          expect(newQuantity).to.eq(oldQuantity + 1);
        });
      });
      

      it('TC_C4 - Tăng số lượng sản phẩm trong giỏ hàng', () => {
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

    it('TC_C5 - Giảm số lượng sản phẩm trong giỏ hàng khi có nhiều hơn 2 sản phẩm', () => {
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
  
      it('TC_C6 - Xóa sản phẩm khỏi giỏ hàng', () => {
        cy.get('button[routerlink="/basket"]').click();
        cy.get('mat-table').contains('Apple Juice').parents('mat-row').within(() => {
          cy.get('.mat-column-remove button').first().click();
        });
        cy.get('mat-table').should('not.contain.text', 'Apple Juice');
      });

      // checkout
      it('TC_C7 - Thanh toán thành công', () => {
        // Thêm sản phẩm 
        cy.get('mat-card').contains('Apple Juice').parents('mat-card').within(() => {
          cy.get('button[aria-label="Add to Basket"]').click();
        });
        cy.get('button[routerlink="/basket"]').click();
        cy.get('#checkoutButton').click();
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