const resultsCollector = require('../results');

describe('Juice Shop Cart Tests', () => {
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
      cy.visit('/#/search');
    
      cy.wait(1000);
      cy.closeDialogAndBanner();
      cy.login('demo', 'demo');
      cy.goToCartPage();
      cy.deleteAllProductsFromCart();
      cy.goToHomePage();
    });
    

    it('DH_01 - Kiểm thử thêm 1 sản phẩm vào giỏ hàng ở trang chủ', () => {
      cy.getCartQuantity().then(oldQuantity => {
        cy.addProductToCart('Apple Juice');
        cy.wait(1000);
        cy.getCartQuantity().then(newQuantity => {
          expect(newQuantity).to.eq(oldQuantity + 1);
        });
      });
    });

    it('DH_02 - Kiểm thử thêm 1 sản phẩm nhiều lần vào giỏ hàng ở trang chủ', () => {
      cy.getCartQuantity().then(oldQuantity => {
        const quantity = 2;
        cy.addProductToCart('Apple Juice', quantity);
        cy.wait(1000);
        cy.getCartQuantity().then(newQuantity => {
          expect(newQuantity).to.eq(oldQuantity + quantity);
        });
      });
    });

    it('DH_03 - Kiểm thử thêm nhiều sản phẩm khác nhau vào giỏ hàng ở trang chủ', () => {
      cy.getCartQuantity().then(oldQuantity => {
        cy.addProductToCart('Banana Juice');
        cy.addProductToCart('Carrot Juice');
        cy.wait(1000);
        cy.getCartQuantity().then(newQuantity => {
          expect(newQuantity).to.eq(oldQuantity + 2);
        });
      });
    });


    it('DH_04 - Kiểm thử tăng số lượng sản phẩm trong giỏ hàng', () => {
      cy.addProductToCart('Apple Juice');
      cy.goToCartPage();
      cy.getQuantityOfProductInCart('Apple Juice').then(oldQuantity => {
        cy.increaseQuantityOfProductInCart('Apple Juice').then(newQuantity => {
          expect(newQuantity).to.eq(oldQuantity + 1);
        });
      });
    });

    it('DH_05 - Kiểm thử giảm số lượng sản phẩm trong giỏ hàng', () => {
      cy.addProductToCart('Apple Juice', 2);
      cy.goToCartPage();
      cy.getQuantityOfProductInCart('Apple Juice').then(oldQuantity => {
        cy.decreaseQuantityOfProductInCart('Apple Juice').then(newQuantity => {
          expect(newQuantity).to.eq(oldQuantity - 1);
        });
      });
    });

    it('DH_06 - Kiểm thử xóa một sản phẩm sản phẩm khỏi giỏ hàng', () => {
      cy.addProductToCart('Apple Juice');
      cy.goToCartPage();
      cy.deleteProductFromCart('Apple Juice');
    });

    it('DH_07 - Kiểm thử xóa tất cả sản phẩm trong giỏ hàng', () => {
      cy.addProductToCart('Banana Juice');
      cy.addProductToCart('Carrot Juice');
      cy.goToCartPage();
      cy.deleteAllProductsFromCart();
    });

    it('DH_08 - Kiểm thử cập nhật tổng tiền sau khi tăng số lượng sản phẩm', () => {
      cy.addProductToCart('Apple Juice');
      cy.goToCartPage();
    
      cy.getProductPrice('Apple Juice').then((productPrice) => {
        cy.getTotalPrice().then((oldTotalPrice) => {
          cy.increaseQuantityOfProductInCart('Apple Juice');
          cy.wait(1000);
          cy.getTotalPrice().then((newTotalPrice) => {
            expect(newTotalPrice).to.eq(oldTotalPrice + productPrice);
          });
        });
      });
    });

    it('DH_09 - Kiểm thử cập nhật tổng tiền sau khi giảm số lượng sản phẩm', () => {
      cy.addProductToCart('Apple Juice', 2);
      cy.goToCartPage();
      cy.getProductPrice('Apple Juice').then((productPrice) => {
        cy.getTotalPrice().then((oldTotalPrice) => {
          cy.decreaseQuantityOfProductInCart('Apple Juice');
          cy.wait(1000);
          cy.getTotalPrice().then((newTotalPrice) => {
            expect(newTotalPrice).to.eq(oldTotalPrice - productPrice);
          });
        });
      });
    });


    it('DH_10 - Kiểm thử cập nhật tổng tiền sau khi xóa một sản phẩm', () => {
      cy.addProductToCart('Banana Juice');
      cy.addProductToCart('Carrot Juice');
      cy.goToCartPage();
      cy.getProductPrice('Banana Juice').then((productPrice) => {
        cy.getTotalPrice().then((oldTotalPrice) => {
          cy.deleteProductFromCart('Banana Juice');
          cy.wait(1000);
          cy.getTotalPrice().then((newTotalPrice) => {
            expect(newTotalPrice).to.eq(oldTotalPrice - productPrice);
          });
        });
      });
    });

    it('DH_11 - Kiểm thử cập nhật tổng tiền sau khi xóa tất cả sản phẩm', () => {
      cy.addProductToCart('Banana Juice');
      cy.addProductToCart('Carrot Juice');
      cy.goToCartPage();
      cy.getProductPrice('Banana Juice').then((productPrice) => {
        cy.getTotalPrice().then((oldTotalPrice) => {
          cy.deleteAllProductsFromCart();
          cy.wait(1000);
          cy.getTotalPrice().then((newTotalPrice) => {
            expect(newTotalPrice).to.eq(0);
          });
        });
      });
    });

    it('DH_12 - Kiểm thử chọn địa chỉ khi mua hàng', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.selectAddress('Tim Tester');
      cy.checkGoToSelectDeliveryMethod();
    });


    it('DH_13 - Kiểm thử nhập địa chỉ mua hàng mới mà không điền thông tin nào', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.checkSubmitFormAddNewAddress(false);
    });

    
    it('DH_14 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập mà không nhập state', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        formNewAddressData.mobileNumber,
        formNewAddressData.zipCode,
        formNewAddressData.address,
        formNewAddressData.city,
      );
      cy.checkSubmitFormAddNewAddress(true);
      cy.submitFormAddNewAddress();
      cy.checkOverlayPaneWithText(formNewAddressData.city);
    });

    it('DH_15 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập đầy đủ thông tin', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        formNewAddressData.mobileNumber,
        formNewAddressData.zipCode,
        formNewAddressData.address,
        formNewAddressData.city,
        formNewAddressData.state
      );
      cy.checkSubmitFormAddNewAddress(true);
      cy.submitFormAddNewAddress();
      cy.checkOverlayPaneWithText(formNewAddressData.city);
    });

    it('DH_16 - Kiểm thử nhập địa chỉ mua hàng mới mà không nhập country', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        '',
        formNewAddressData.name,
        formNewAddressData.mobileNumber,
        formNewAddressData.zipCode,
        formNewAddressData.address,
        formNewAddressData.city,
        formNewAddressData.state
      );

        // kiểm tra có hiện lỗi country
      cy.checkSubmitFormAddNewAddress(false);
      cy.checkErrorMessage('Please provide a country.');
    });

      it('DH_17 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập country là kí tự đặc biệt', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        '@@#$%#(*$@',
        formNewAddressData.name,
        formNewAddressData.mobileNumber,
        formNewAddressData.zipCode,
        formNewAddressData.address,
        formNewAddressData.city,
        formNewAddressData.state
      );

        cy.checkTextShouldBeEmptyOfAddressForm('Please provide a country.');
    });

    it('DH_18 - Kiểm thử nhập địa chỉ mua hàng mới mà không nhập name', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        '',
        formNewAddressData.mobileNumber,
        formNewAddressData.zipCode,
        formNewAddressData.address,
        formNewAddressData.city,
        formNewAddressData.state
      );

        // kiểm tra có hiện lỗi country
      cy.checkSubmitFormAddNewAddress(false);
      cy.checkErrorMessage('Please provide a name.');
    });

    it('DH_19 - Kiểm thử nhập địa chỉ mua hàng mới mà không nhập mobile number', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        '',
        formNewAddressData.zipCode,
        formNewAddressData.address,
        formNewAddressData.city,
        formNewAddressData.state
      );

        // kiểm tra có hiện lỗi mobile number
      cy.checkSubmitFormAddNewAddress(false);
      cy.checkErrorMessage('Please provide a mobile number.');
    });


    it('DH_20 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập độ dài mobile number quá ngắn', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        formNewAddressData.mobileNumber.slice(0, 6),
        formNewAddressData.zipCode,
        formNewAddressData.address,
        formNewAddressData.city,
        formNewAddressData.state
      );

        // kiểm tra có hiện lỗi mobile number
      cy.checkSubmitFormAddNewAddress(false);
      cy.checkErrorMessage('Mobile number must');
    });

    it('DH_21 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập độ dài mobile number đúng tối thiểu', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        formNewAddressData.mobileNumber.slice(0, 7),
        formNewAddressData.zipCode,
        formNewAddressData.address,
        formNewAddressData.city,
        formNewAddressData.state
      );

      cy.checkSubmitFormAddNewAddress(true);
    });

    it('DH_22 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập độ dài mobile number trung bình', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        formNewAddressData.mobileNumber.slice(0, 8),
        formNewAddressData.zipCode,
        formNewAddressData.address,
        formNewAddressData.city,
        formNewAddressData.state
      );

      cy.checkSubmitFormAddNewAddress(true);
    });

    it('DH_23 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập độ dài mobile number cận tối đa', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        formNewAddressData.mobileNumber.slice(0, 9),
        formNewAddressData.zipCode,
        formNewAddressData.address,
        formNewAddressData.city,
        formNewAddressData.state
      );

      cy.checkSubmitFormAddNewAddress(true);
    });

    it('DH_24 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập độ dài mobile number đúng tối đa', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        formNewAddressData.mobileNumber,
        formNewAddressData.zipCode,
        formNewAddressData.address,
        formNewAddressData.city,
        formNewAddressData.state
      );

      cy.checkSubmitFormAddNewAddress(true);
    });

    it('DH_25 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập độ dài mobile number quá dài', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        formNewAddressData.mobileNumber + '77',
        formNewAddressData.zipCode,
        formNewAddressData.address,
        formNewAddressData.city,
        formNewAddressData.state
      );

      cy.checkSubmitFormAddNewAddress(false);
      cy.checkErrorMessage('Mobile number must');
    });

    it('DH_26 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập mobile number với ký tự . ở cuối', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        '08673333.69',
        formNewAddressData.zipCode,
        formNewAddressData.address,
        formNewAddressData.city,
        formNewAddressData.state
      );

      cy.checkSubmitFormAddNewAddress(false);
      cy.checkErrorMessage('Mobile number');
    });

    it('DH_27 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập mobile number chứa các kí tự chữ', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        '777e7',
        formNewAddressData.zipCode,
        formNewAddressData.address,
        formNewAddressData.city,
        formNewAddressData.state
      );

      cy.checkSubmitFormAddNewAddress(false);
      cy.checkErrorMessage('Mobile number');
    });

    it('DH_28 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập mobile number với ký tự + ở đầu', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        '+11111111 ',
        formNewAddressData.zipCode,
        formNewAddressData.address,
        formNewAddressData.city,
        formNewAddressData.state
      );

      cy.checkSubmitFormAddNewAddress(false);
      cy.checkErrorMessage('Mobile number');
    });

    

    it('DH_29 - Kiểm thử nhập địa chỉ mua hàng mới mà không nhập zip code', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        formNewAddressData.mobileNumber,
        '',
        formNewAddressData.address,
        formNewAddressData.city,
        formNewAddressData.state
      );

      cy.checkErrorMessage('Please provide a ZIP code.');
    });

    it('DH_30 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập zip code với các kí tự đặc biệt', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        formNewAddressData.mobileNumber,
        '@@#!',
        formNewAddressData.address,
        formNewAddressData.city,
        formNewAddressData.state
      );

      cy.checkErrorMessage('Please provide a ZIP code.');
    });

      it('DH_31 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập zip code với các kí tự chữ', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        formNewAddressData.mobileNumber,
        'winter',
        formNewAddressData.address,
        formNewAddressData.city,
        formNewAddressData.state
      );

      cy.checkTextShouldBeEmptyOfAddressForm('Please provide a ZIP code.');
    });

    it('DH_32 - Kiểm thử nhập địa chỉ mua hàng mới mà không nhập address', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        formNewAddressData.mobileNumber,
        formNewAddressData.zipCode,
        '',
        formNewAddressData.city,
        formNewAddressData.state
      );

      cy.checkErrorMessage('Please provide an address.');
    });

    it('DH_33 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập độ dài address < 160', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        formNewAddressData.mobileNumber,
        formNewAddressData.zipCode,
        formNewAddressData.address,
        formNewAddressData.city,
        formNewAddressData.state
      );

      cy.checkSubmitFormAddNewAddress(true);
    });

    it('DH_34 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập độ dài address > 160', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      const longAddress = 'a'.repeat(161);
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        formNewAddressData.mobileNumber,
        formNewAddressData.zipCode,
        longAddress,
        formNewAddressData.city,
        formNewAddressData.state
      );
      cy.checkInputAddressValueLength(longAddress);
    });

    it('DH_35 - Kiểm thử nhập địa chỉ mua hàng mới mà không nhập city', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        formNewAddressData.mobileNumber,
        formNewAddressData.zipCode,
        formNewAddressData.address,
        '',
        formNewAddressData.state
      );

      cy.checkErrorMessage('Please provide a city.');
    });

    it('DH_36 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập country là khoảng trắng', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        ' ',
        formNewAddressData.name,
        formNewAddressData.mobileNumber,
        formNewAddressData.zipCode,
        formNewAddressData.address,
        formNewAddressData.city,
        formNewAddressData.state
      );

      cy.checkErrorMessage('Please provide a country.');
    });

    

    it('DH_37 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập name là khoảng trắng', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        ' ',
        formNewAddressData.mobileNumber,
        formNewAddressData.zipCode,
        formNewAddressData.address,
        formNewAddressData.city,
        formNewAddressData.state
      );

      cy.checkErrorMessage('Please provide a name.');
    });


    it('DH_38 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập zipcode là khoảng trắng', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        formNewAddressData.mobileNumber,
        ' ',
        formNewAddressData.address,
        formNewAddressData.city,
        formNewAddressData.state
      );

      cy.checkErrorMessage('Please provide a ZIP code.');
    });

    it('DH_39 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập address là khoảng trắng', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        formNewAddressData.mobileNumber,
        formNewAddressData.zipCode,
        ' ',
        formNewAddressData.city,
        formNewAddressData.state
      );

      cy.checkErrorMessage('Please provide an address.');
    });

      it('DH_40 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập city là khoảng trắng', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        formNewAddressData.mobileNumber,
        formNewAddressData.zipCode,
        formNewAddressData.address,
        ' ',
        formNewAddressData.state
      );

      cy.checkErrorMessage('Please provide a city.');
    });

          it('DH_41 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập city là kí tự đặc biệt', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        formNewAddressData.mobileNumber,
        formNewAddressData.zipCode,
        formNewAddressData.address,
        '@@#$%#(*$@',
        formNewAddressData.state
      );

      cy.checkTextShouldBeEmptyOfAddressForm('Please provide a city.');
    });

    it('DH_42 - Kiểm thử nhập địa chỉ mua hàng mới mà nhập state là kí tự đặc biệt', () => {
      cy.addProductToCart('Banana Juice');
      cy.goToCartPage();
      cy.goToSelectAddress();
      cy.goToAddNewAddress();
      cy.fillFormAddNewAddress(
        formNewAddressData.country,
        formNewAddressData.name,
        formNewAddressData.mobileNumber,
        formNewAddressData.zipCode,
        formNewAddressData.address,
        formNewAddressData.city,
        '@@#$%#(*$@',
      );

      cy.checkTextShouldBeEmptyOfAddressForm('Please provide a state.');
    });

    it('DH_43 - Kiểm thử phương thức giao hàng khi mua hàng', () => {
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
    });

    it('DH_44 - Kiểm thử phương thức thanh toán khi mua hàng', () => {
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
      cy.selectPaymentMethod('Tim Tester');
      cy.checkGoToOrderSummary();
    });

    it('DH_45 - Kiểm thử thêm thẻ thanh toán mà nhập đầy đủ thông tin', () => {
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

    it('DH_46 - Kiểm thử thêm thẻ thanh toán mà không nhập Name', () => {
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
        '',
        formNewCardData.cardNumber,
        formNewCardData.expiryMonth,
        formNewCardData.expiryYear
      );
      cy.checkErrorMessage('Please provide a name.');
    });

    it('DH_47 - Kiểm thử thêm thẻ thanh toán mà không nhập Card Number', () => {
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
        '',
        formNewCardData.expiryMonth,
        formNewCardData.expiryYear
      );
      cy.checkErrorMessage('Please enter your card number.');
    });

    it('DH_48 - Kiểm thử thêm thẻ thanh toán mà không nhập Expiry Month', () => {
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
        '',
        formNewCardData.expiryYear
      );
      cy.checkErrorMessage('Please enter an expiry month.');
    });

    it('DH_49 - Kiểm thử thêm thẻ thanh toán mà không nhập Expiry Year', () => {
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
        ''
      );
      cy.checkErrorMessage('Please enter an expiry year.');
    });

    it('DH_50 - Kiểm thử thêm thẻ thanh toán mà nhập Name là khoảng trắng', () => {
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
        ' ',
        formNewCardData.cardNumber,
        formNewCardData.expiryMonth,
        formNewCardData.expiryYear
      );
      cy.checkSubmitFormAddNewCard(false)
    });

    it('DH_51 - Kiểm thử thêm thẻ thanh toán mà nhập Card Number là khoảng trắng', () => {
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
        ' ',
        formNewCardData.expiryMonth,
        formNewCardData.expiryYear
      );
      cy.checkSubmitFormAddNewCard(false)
    });

    it('DH_52 - Kiểm thử thêm thẻ thanh toán mà nhập độ dài Card Number < 16', () => {
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
        formNewCardData.cardNumber.slice(0, 15),
        formNewCardData.expiryMonth,
        formNewCardData.expiryYear
      );
      cy.checkErrorMessage('Please enter a valid sixteen digit card number.')
    });

    it('DH_53 - Kiểm thử thêm thẻ thanh toán mà nhập độ dài Card Number > 16', () => {
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
        formNewCardData.cardNumber + '1',
        formNewCardData.expiryMonth,
        formNewCardData.expiryYear
      );
      cy.checkErrorMessage('Please enter a valid sixteen digit card number.')
    });

    it('DH_54 - Kiểm thử nhập coupon khi mua hàng mà coupon không hợp lệ', () => {
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
      cy.openAddCoupon();
      cy.fillFormAddCoupon('ABCDEFAWEQ');

      cy.redeemCoupon();

      cy.checkErrorMessageCoupon('Invalid coupon');
    });

    it('DH_55 - Kiểm thử nhập coupon khi mua hàng mà độ dài coupon < 10', () => {
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
      cy.openAddCoupon();
      cy.fillFormAddCoupon('n(XRwh7ZQ');

      cy.checkRedeemCoupon(false);
    });

    it('DH_56 - Kiểm thử nhập coupon khi mua hàng mà độ dài coupon > 10', () => {
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
      cy.openAddCoupon();
      cy.fillFormAddCoupon('n(XRwh7ZQrr');

      cy.checkRedeemCoupon(false);
    });

    it('DH_57 - Kiểm thử nhập coupon khi mua hàng mà coupon hợp lệ', () => {
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
      cy.openAddCoupon();
      cy.fillFormAddCoupon('n(XRwh7ZQr');
      cy.redeemCoupon();
      cy.checkSuccessMessageCoupon('Your discount of 30% will be applied during checkout.');
    });

    it('DH_58 - Kiểm thử thanh toán thành công khi mua hàng', () => {
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
      cy.selectPaymentMethod('Tim Tester');
      cy.checkGoToOrderSummary();
      cy.goToOrderSummary();
      cy.goToOrderConfirmation();
      cy.checkPaymentSuccess();
    });

    
    it('DH_59 - Kiểm thử thanh toán thành công khi mua hàng với mã giảm giá hợp lệ', () => {
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
      cy.selectPaymentMethod('Tim Tester');
      cy.checkGoToOrderSummary();
      // Nhập Coupon
      cy.openAddCoupon();
      cy.fillFormAddCoupon('n(XRwh7ZQr');
      cy.redeemCoupon();
      cy.checkSuccessMessageCoupon('Your discount of 30% will be applied during checkout.');
      // Thanh toán
      cy.goToOrderSummary();
      cy.goToOrderConfirmation();
      cy.checkPaymentSuccess();
    });

});