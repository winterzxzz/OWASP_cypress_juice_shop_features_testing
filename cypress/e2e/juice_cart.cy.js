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
  
      it('TC_C3 - Thêm sản phẩm vào giỏ hàng', () => {
          // Lấy số lượng hiện tại
          var oldQuantity = 0;
          cy.get('button[aria-label="Show the shopping cart"] .mdc-button__label .warn-notification').then(($el) => {
            oldQuantity = parseInt($el.text().trim(), 10);
          });

        // Thêm sản phẩm 
        cy.get('mat-card').contains('Apple Juice').parents('mat-card').within(() => {
          cy.get('button[aria-label="Add to Basket"]').click();
        });

        // Kiểm tra số lượng
        cy.get('button[aria-label="Show the shopping cart"] .mdc-button__label .warn-notification').then(($el) => {
          const newQuantity = parseInt($el.text().trim(), 10);
          expect(newQuantity).to.eq(oldQuantity + 1);
        });

        // Kiểm tra sản phẩm đã thêm vào giỏ hàng
        cy.get('mat-table').contains('Apple Juice').parents('mat-row').within(() => {
          cy.get('.mat-column-quantity span').invoke('text').then((quantity) => {
            expect(quantity).to.eq(oldQuantity + 1);
          });
        });
      });

    // it('TC_C4 - Giảm số lượng sản phẩm trong giỏ hàng', () => {
    //     cy.get('mat-card').contains('Apple Juice').parents('mat-card').within(() => {
    //       cy.get('button[aria-label="Add to Basket"]').click().click();
    //     });
    //     cy.get('button[routerlink="/basket"]').click();
    //     cy.get('mat-table').contains('Apple Juice').parents('mat-row').within(() => {
    //       cy.get('.mat-column-quantity button').first().click();
    //       cy.get('.mat-column-quantity span').should('contain.text', '1');
    //     });
    //   });
  
    //   it('TC_C5 - Xóa sản phẩm khỏi giỏ hàng', () => {
    //     cy.get('button[routerlink="/basket"]').click();
    //     cy.get('mat-table').contains('Apple Juice').parents('mat-row').within(() => {
    //       cy.get('.mat-column-remove button').click();
    //     });
    //     cy.get('mat-table').should('not.contain.text', 'Apple Juice');
    //   });
  
    //   it('TC_C5 - Thêm nhiều sản phẩm giống nhau vào giỏ', () => {
    //     cy.get('mat-card').contains('Apple Juice').parents('mat-card').within(() => {
    //       cy.get('button[aria-label="Add to Basket"]').click().click().click();
    //     });
    //     cy.get('button[routerlink="/basket"]').click();
    //     cy.get('mat-table').contains('Apple Juice').parents('mat-row').within(() => {
    //       cy.get('mat-cell').eq(2).should('contain.text', '3'); // quantity
    //     });
    //   });
  
  
    //   it('TC_C7 - Giảm về 0 sẽ xóa sản phẩm khỏi giỏ hàng', () => {
    //     cy.get('mat-card').contains('Apple Juice').parents('mat-card').within(() => {
    //       cy.get('button[aria-label="Add to Basket"]').click();
    //     });
    //     cy.get('button[routerlink="/basket"]').click();
    //     cy.get('mat-table').contains('Apple Juice').parents('mat-row').within(() => {
    //       cy.get('button[aria-label="Decrease Quantity"]').click();
    //     });
    //     cy.get('mat-table').should('not.contain.text', 'Apple Juice');
    //   });
  
    //   it('TC_C8 - Giỏ hàng giữ nguyên sau khi reload', () => {
    //     cy.get('button[routerlink="/basket"]').click();
    //     cy.reload();
    //     cy.get('button[routerlink="/basket"]').click();
    //     cy.get('mat-table').should('contain.text', 'Apple Juice');
    //   });
  
    //   it('TC_C9 - Đăng xuất và đăng nhập lại giữ được giỏ hàng', () => {
    //     cy.get('#navbarAccount').click();
    //     cy.get('#navbarLogoutButton').click();
    //     cy.get('#navbarAccount').click();
    //     cy.get('#navbarLoginButton').click();
    //     cy.get('#email').type('demo');
    //     cy.get('#password').type('demo');
    //     cy.get('#loginButton').click();
    //     cy.get('button[routerlink="/basket"]').click();
    //     cy.get('mat-table').should('contain.text', 'Apple Juice');
    //   });
  
    //   it('TC_C10 - Giỏ hàng trống hiển thị đúng thông báo', () => {
    //     cy.get('button[routerlink="/basket"]').click();
    //     cy.get('mat-table').should('not.exist');
    //     cy.get('.mat-card').should('contain.text', 'Your basket is empty');
    //   });
    });
  });