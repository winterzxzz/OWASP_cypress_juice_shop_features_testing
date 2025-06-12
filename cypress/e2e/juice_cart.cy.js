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

    it('TC01 - Không hiển thị nút Add to Basket nếu chưa đăng nhập', () => {
      cy.get('mat-card').first().within(() => {
        cy.get('button[aria-label="Add to Basket"]').should('not.exist');
      });
    });

    it('TC02 - Không thể truy cập giỏ hàng nếu chưa đăng nhập', () => {
      cy.get('button[routerlink="/basket"]').should('not.exist');
    });
  });

  context('2️⃣ Khi đã đăng nhập', () => {
    const formNewAddressData = {
      country: 'Viet Nam',
      name: 'Phan Hong Quan',
      mobileNumber: '0867333697',
      zipCode: '10000',
      address: 'Tan Trieu, Thanh Tri, Ha Noi',
      city: 'Ha Noi',
      state: 'Thanh Tri'
    }

    const formNewCardData = {
      name: 'Phan Hong Quan',
      cardNumber: '4000056655665556',
      expiryMonth: '12',
      expiryYear: '2099'
    }




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

    // it('TC01 - Kiểm thử thêm 1 sản phẩm vào giỏ hàng ở trang chủ', () => {
    //   cy.getCartQuantity().then(oldQuantity => {
    //     cy.addProductToCart('Apple Juice');
    //     cy.wait(1000);
    //     cy.getCartQuantity().then(newQuantity => {
    //       expect(newQuantity).to.eq(oldQuantity + 1);
    //     });
    //   });
    // });

    // it('TC02 - Kiểm thử thêm 1 sản phẩm nhiều lần vào giỏ hàng ở trang chủ', () => {
    //   cy.getCartQuantity().then(oldQuantity => {
    //     const quantity = 2;
    //     cy.addProductToCart('Apple Juice', quantity);
    //     cy.wait(1000);
    //     cy.getCartQuantity().then(newQuantity => {
    //       expect(newQuantity).to.eq(oldQuantity + quantity);
    //     });
    //   });
    // });

    // it('TC03 - Kiểm thử thêm nhiều sản phẩm khác nhau vào giỏ hàng ở trang chủ', () => {
    //   cy.getCartQuantity().then(oldQuantity => {
    //     cy.addProductToCart('Banana Juice');
    //     cy.addProductToCart('Carrot Juice');
    //     cy.wait(1000);
    //     cy.getCartQuantity().then(newQuantity => {
    //       expect(newQuantity).to.eq(oldQuantity + 2);
    //     });
    //   });
    // });


    // it('TC04 - Kiểm thử tăng số lượng sản phẩm trong giỏ hàng', () => {
    //   cy.addProductToCart('Apple Juice');
    //   cy.goToCartPage();
    //   cy.getQuantityOfProductInCart('Apple Juice').then(oldQuantity => {
    //     cy.increaseQuantityOfProductInCart('Apple Juice').then(newQuantity => {
    //       expect(newQuantity).to.eq(oldQuantity + 1);
    //     });
    //   });
    // });

    // it('TC05 - Kiểm thử giảm số lượng sản phẩm trong giỏ hàng', () => {
    //   cy.addProductToCart('Apple Juice', 2);
    //   cy.goToCartPage();
    //   cy.getQuantityOfProductInCart('Apple Juice').then(oldQuantity => {
    //     cy.decreaseQuantityOfProductInCart('Apple Juice').then(newQuantity => {
    //       expect(newQuantity).to.eq(oldQuantity - 1);
    //     });
    //   });
    // });

    // it('TC06 - Kiểm thử xóa một sản phẩm sản phẩm khỏi giỏ hàng', () => {
    //   cy.addProductToCart('Apple Juice');
    //   cy.goToCartPage();
    //   cy.deleteProductFromCart('Apple Juice');
    // });

    // it('TC07 - Kiểm thử xóa tất cả sản phẩm trong giỏ hàng', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.addProductToCart('Carrot Juice');
    //   cy.goToCartPage();
    //   cy.deleteAllProductsFromCart();
    // });

    // it('TC08 - Kiểm thử cập nhật tổng tiền sau khi tăng số lượng sản phẩm', () => {
    //   cy.addProductToCart('Apple Juice');
    //   cy.goToCartPage();
    
    //   cy.getProductPrice('Apple Juice').then((productPrice) => {
    //     cy.getTotalPrice().then((oldTotalPrice) => {
    //       cy.increaseQuantityOfProductInCart('Apple Juice');
    //       cy.wait(1000);
    //       cy.getTotalPrice().then((newTotalPrice) => {
    //         expect(newTotalPrice).to.eq(oldTotalPrice + productPrice);
    //       });
    //     });
    //   });
    // });

    // it('TC09 - Kiểm thử cập nhật tổng tiền sau khi giảm số lượng sản phẩm', () => {
    //   cy.addProductToCart('Apple Juice', 2);
    //   cy.goToCartPage();
    //   cy.getProductPrice('Apple Juice').then((productPrice) => {
    //     cy.getTotalPrice().then((oldTotalPrice) => {
    //       cy.decreaseQuantityOfProductInCart('Apple Juice');
    //       cy.wait(1000);
    //       cy.getTotalPrice().then((newTotalPrice) => {
    //         expect(newTotalPrice).to.eq(oldTotalPrice - productPrice);
    //       });
    //     });
    //   });
    // });


    // it('TC10 - Kiểm thử cập nhật tổng tiền sau khi xóa một sản phẩm', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.addProductToCart('Carrot Juice');
    //   cy.goToCartPage();
    //   cy.getProductPrice('Banana Juice').then((productPrice) => {
    //     cy.getTotalPrice().then((oldTotalPrice) => {
    //       cy.deleteProductFromCart('Banana Juice');
    //       cy.wait(1000);
    //       cy.getTotalPrice().then((newTotalPrice) => {
    //         expect(newTotalPrice).to.eq(oldTotalPrice - productPrice);
    //       });
    //     });
    //   });
    // });

    // it('TC11 - Kiểm thử cập nhật tổng tiền sau khi xóa tất cả sản phẩm', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.addProductToCart('Carrot Juice');
    //   cy.goToCartPage();
    //   cy.getProductPrice('Banana Juice').then((productPrice) => {
    //     cy.getTotalPrice().then((oldTotalPrice) => {
    //       cy.deleteAllProductsFromCart();
    //       cy.wait(1000);
    //       cy.getTotalPrice().then((newTotalPrice) => {
    //         expect(newTotalPrice).to.eq(0);
    //       });
    //     });
    //   });
    // });

    // it('TC12 - Kiểm thử chọn địa chỉ khi mua hàng', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.selectAddress('Tim Tester');
    //   cy.checkGoToSelectDeliveryMethod();
    // });


    // it('TC13 - Kiểm thử nhập địa chỉ mua hàng mới mà không điền thông tin nào', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   cy.checkSubmitFormAddNewAddress();
    // });

        // it('TCX - Thanh toán thành công', () => {
        //   cy.addProductToCart('Apple Juice');
        //   cy.goToCartPage();
        //   cy.goToSelectAddress();
        //   cy.selectAddress('Tim Tester');
        //   cy.goToSelectDeliveryMethod();
        //   cy.selectDeliveryMethod('One Day Delivery');
        //   cy.goToSelectPaymentMethod();
        //   cy.selectPaymentMethod('Tim Tester');
        //   cy.goToOrderSummary();
        //   cy.goToOrderConfirmation();
        //   cy.get('.confirmation').should('be.visible');
        // });

    
    // it('TC14 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập mà không nhập state', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   cy.fillFormAddNewAddress(
    //     formNewAddressData.country,
    //     formNewAddressData.name,
    //     formNewAddressData.mobileNumber,
    //     formNewAddressData.zipCode,
    //     formNewAddressData.address,
    //     formNewAddressData.city,
    //   );
    // });

    // it('TC15 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập đầy đủ thông tin', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   cy.fillFormAddNewAddress(
    //     formNewAddressData.country,
    //     formNewAddressData.name,
    //     formNewAddressData.mobileNumber,
    //     formNewAddressData.zipCode,
    //     formNewAddressData.address,
    //     formNewAddressData.city,
    //     formNewAddressData.state
    //   );
    // });

    // it('TC16 - Kiểm thử nhập địa chỉ mua hàng mới mà không nhập country', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   cy.fillFormAddNewAddress(
    //     '',
    //     formNewAddressData.name,
    //     formNewAddressData.mobileNumber,
    //     formNewAddressData.zipCode,
    //     formNewAddressData.address,
    //     formNewAddressData.city,
    //     formNewAddressData.state
    //   );

    //     // kiểm tra có hiện lỗi country
    //   cy.checkErrorMessage('Please provide a country.');
    // });

    // it('TC17 - Kiểm thử nhập địa chỉ mua hàng mới mà không nhập name', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   cy.fillFormAddNewAddress(
    //     formNewAddressData.country,
    //     '',
    //     formNewAddressData.mobileNumber,
    //     formNewAddressData.zipCode,
    //     formNewAddressData.address,
    //     formNewAddressData.city,
    //     formNewAddressData.state
    //   );

    //     // kiểm tra có hiện lỗi country
    //   cy.checkErrorMessage('Please provide a name.');
    // });

    // it('TC18 - Kiểm thử nhập địa chỉ mua hàng mới mà không nhập mobile number', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   cy.fillFormAddNewAddress(
    //     formNewAddressData.country,
    //     formNewAddressData.name,
    //     '',
    //     formNewAddressData.zipCode,
    //     formNewAddressData.address,
    //     formNewAddressData.city,
    //     formNewAddressData.state
    //   );

    //     // kiểm tra có hiện lỗi mobile number
    //   cy.checkErrorMessage('Please provide a mobile number.');
    // });


    // it('TC19 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập độ dài mobile number < 8', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   cy.fillFormAddNewAddress(
    //     formNewAddressData.country,
    //     formNewAddressData.name,
    //     formNewAddressData.mobileNumber.slice(0, 7),
    //     formNewAddressData.zipCode,
    //     formNewAddressData.address,
    //     formNewAddressData.city,
    //     formNewAddressData.state
    //   );

    //     // kiểm tra có hiện lỗi mobile number
    //   cy.checkErrorMessage('Mobile number must');
    // });

    // it('TC20 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập độ dài mobile number > 12', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   cy.fillFormAddNewAddress(
    //     formNewAddressData.country,
    //     formNewAddressData.name,
    //     formNewAddressData.mobileNumber + '1234',
    //     formNewAddressData.zipCode,
    //     formNewAddressData.address,
    //     formNewAddressData.city,
    //     formNewAddressData.state
    //   );

    //     // kiểm tra có hiện lỗi mobile number
    //   cy.checkErrorMessage('Mobile number must');
    // });

    // it('TC21 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập mobile number dạng XXX-XXX-XXXX', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   cy.fillFormAddNewAddress(
    //     formNewAddressData.country,
    //     formNewAddressData.name,
    //     formNewAddressData.mobileNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'),
    //     formNewAddressData.zipCode,
    //     formNewAddressData.address,
    //     formNewAddressData.city,
    //     formNewAddressData.state
    //   );

    //   cy.checkSubmitFormAddNewAddress(true);
    // });

    // it('TC22 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập mobile number dạng XXX.XXX.XXXX', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   cy.fillFormAddNewAddress(
    //     formNewAddressData.country,
    //     formNewAddressData.name,
    //     formNewAddressData.mobileNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1.$2.$3'),
    //     formNewAddressData.zipCode,
    //     formNewAddressData.address,
    //     formNewAddressData.city,
    //     formNewAddressData.state
    //   );

    //   cy.checkSubmitFormAddNewAddress(true);
    // });
    
    // it('TC23 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập mobile number chứa các kí tự chữ', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   cy.fillFormAddNewAddress(
    //     formNewAddressData.country,
    //     formNewAddressData.name,
    //     formNewAddressData.mobileNumber.replace(/^(\d{3})/, 'e'),
    //     formNewAddressData.zipCode,
    //     formNewAddressData.address,
    //     formNewAddressData.city,
    //     formNewAddressData.state
    //   );

    //     // kiểm tra có hiện lỗi mobile number
    //   cy.checkErrorMessage('Please provide a mobile number.');
    // });

    // it('TC24 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập mobile number với định dạng quốc tế', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   cy.fillFormAddNewAddress(
    //     formNewAddressData.country,
    //     formNewAddressData.name,
    //     formNewAddressData.mobileNumber.replace(/^(\d{3})/, '+84'),
    //     formNewAddressData.zipCode,
    //     formNewAddressData.address,
    //     formNewAddressData.city,
    //     formNewAddressData.state
    //   );

    //   cy.checkSubmitFormAddNewAddress(true);
    // });

    // it('TC25 - Kiểm thử nhập địa chỉ mua hàng mới mà không nhập zip code', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   cy.fillFormAddNewAddress(
    //     formNewAddressData.country,
    //     formNewAddressData.name,
    //     formNewAddressData.mobileNumber,
    //     '',
    //     formNewAddressData.address,
    //     formNewAddressData.city,
    //     formNewAddressData.state
    //   );

    //   cy.checkErrorMessage('Please provide a ZIP code.');
    // });

    // it('TC26 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập zip code với các kí tự đặc biệt', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   cy.fillFormAddNewAddress(
    //     formNewAddressData.country,
    //     formNewAddressData.name,
    //     formNewAddressData.mobileNumber,
    //     '@@#!',
    //     formNewAddressData.address,
    //     formNewAddressData.city,
    //     formNewAddressData.state
    //   );

    //   cy.checkErrorMessage('Please provide a ZIP code.');
    // });

    // it('TC27 - Kiểm thử nhập địa chỉ mua hàng mới mà không nhập address', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   cy.fillFormAddNewAddress(
    //     formNewAddressData.country,
    //     formNewAddressData.name,
    //     formNewAddressData.mobileNumber,
    //     formNewAddressData.zipCode,
    //     '',
    //     formNewAddressData.city,
    //     formNewAddressData.state
    //   );

    //   cy.checkErrorMessage('Please provide an address.');
    // });

    // it('TC28 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập độ dài address < 160', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   cy.fillFormAddNewAddress(
    //     formNewAddressData.country,
    //     formNewAddressData.name,
    //     formNewAddressData.mobileNumber,
    //     formNewAddressData.zipCode,
    //     formNewAddressData.address,
    //     formNewAddressData.city,
    //     formNewAddressData.state
    //   );

    //   cy.checkSubmitFormAddNewAddress(true);
    // });

    // it('TC29 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập độ dài address > 160', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   const longAddress = 'a'.repeat(161);
    //   cy.fillFormAddNewAddress(
    //     formNewAddressData.country,
    //     formNewAddressData.name,
    //     formNewAddressData.mobileNumber,
    //     formNewAddressData.zipCode,
    //     longAddress,
    //     formNewAddressData.city,
    //     formNewAddressData.state
    //   );

    //   cy.checkInputAddressValueLength(longAddress);

    // });

    // it('TC30 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập country là khoảng trắng', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   const longAddress = 'a'.repeat(161);
    //   cy.fillFormAddNewAddress(
    //     ' ',
    //     formNewAddressData.name,
    //     formNewAddressData.mobileNumber,
    //     formNewAddressData.zipCode,
    //     longAddress,
    //     formNewAddressData.city,
    //     formNewAddressData.state
    //   );

    //   cy.checkErrorMessage('Please provide a country.');
    // });

    // it('TC31 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập name là khoảng trắng', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   const longAddress = 'a'.repeat(161);
    //   cy.fillFormAddNewAddress(
    //     formNewAddressData.country,
    //     ' ',
    //     formNewAddressData.mobileNumber,
    //     formNewAddressData.zipCode,
    //     longAddress,
    //     formNewAddressData.city,
    //     formNewAddressData.state
    //   );

    //   cy.checkErrorMessage('Please provide a name.');
    // });


    // it('TC32 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập zipcode là khoảng trắng', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   const longAddress = 'a'.repeat(161);
    //   cy.fillFormAddNewAddress(
    //     formNewAddressData.country,
    //     formNewAddressData.name,
    //     formNewAddressData.mobileNumber,
    //     '',
    //     longAddress,
    //     formNewAddressData.city,
    //     formNewAddressData.state
    //   );

    //   cy.checkErrorMessage('Please provide a ZIP code.');
    // });

    // it('TC33 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập address là khoảng trắng', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   const longAddress = 'a'.repeat(161);
    //   cy.fillFormAddNewAddress(
    //     formNewAddressData.country,
    //     formNewAddressData.name,
    //     formNewAddressData.mobileNumber,
    //     formNewAddressData.zipCode,
    //     ' ',
    //     formNewAddressData.city,
    //     formNewAddressData.state
    //   );

    //   cy.checkErrorMessage('Please provide an address.');
    // });

    // it('TC34 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập city là khoảng trắng', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   cy.goToSelectAddress();
    //   cy.goToAddNewAddress();
    //   const longAddress = 'a'.repeat(161);
    //   cy.fillFormAddNewAddress(
    //     formNewAddressData.country,
    //     formNewAddressData.name,
    //     formNewAddressData.mobileNumber,
    //     formNewAddressData.zipCode,
    //     formNewAddressData.address,
    //     ' ',
    //     formNewAddressData.state
    //   );

    //   cy.checkErrorMessage('Please provide a city.');
    // });

    // it('TC35 - Kiểm thử phương thức giao hàng khi mua hàng', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   // chọn địa chỉ
    //   cy.goToSelectAddress();
    //   cy.selectAddress('Tim Tester');
    //   // chọn phương thức giao hàng
    //   cy.checkGoToSelectDeliveryMethod();
    //   cy.goToSelectDeliveryMethod();
    //   cy.selectDeliveryMethod('One Day Delivery');
    //   cy.checkGoToSelectPaymentMethod();
    // });

    // it('TC36 - Kiểm thử phương thức thanh toán khi mua hàng', () => {
    //   cy.addProductToCart('Banana Juice');
    //   cy.goToCartPage();
    //   // chọn địa chỉ
    //   cy.goToSelectAddress();
    //   cy.selectAddress('Tim Tester');
    //   // chọn phương thức giao hàng
    //   cy.checkGoToSelectDeliveryMethod();
    //   cy.goToSelectDeliveryMethod();
    //   cy.selectDeliveryMethod('One Day Delivery');
    //   cy.checkGoToSelectPaymentMethod();
    //   cy.goToSelectPaymentMethod();
    //   // chọn phương thức thanh toán
    //   cy.selectPaymentMethod('Tim Tester');
    //   cy.checkGoToOrderSummary();
    // });

    it('TC37 - Kiểm thử thêm thẻ thanh toán mà nhập đầy đủ thông tin', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      // chọn địa chỉ
      cy.goToSelectAddress();
      cy.selectAddress('Tim Tester');
      // chọn phương thức giao hàng
      cy.checkGoToSelectDeliveryMethod();
      cy.goToSelectDeliveryMethod();
      cy.selectDeliveryMethod('One Day Delivery');
      cy.checkGoToSelectPaymentMethod();
      cy.goToSelectPaymentMethod();
      // chọn phương thức thanh toán
      cy.openAddNewCard();
      cy.fillFormAddNewCard(
        formNewCardData.name,
        formNewCardData.cardNumber,
        formNewCardData.expiryMonth,
        formNewCardData.expiryYear
      );
      cy.checkSubmitFormAddNewCard(true);
      cy.submitFormAddNewCard();
      cy.checkOverlayPaneWithText(`Your card ending with ${formNewCardData.cardNumber.slice(-4)}`);
    });

  });
});