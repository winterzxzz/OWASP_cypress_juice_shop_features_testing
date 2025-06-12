describe('Kiểm tra tìm kiếm Juice Shop', () => {
  beforeEach(() => {
      cy.visit('/')

      // Đợi trang tải xong và xử lý các popup
      cy.wait(1000)
  
      cy.get('body').then(($body) => {
        if ($body.find('.cdk-overlay-backdrop').length > 0) {
          cy.get('.cdk-overlay-backdrop').click({ force: true })
        }
        if ($body.find('.close-dialog').length > 0) {
          cy.get('.close-dialog').click({ force: true })
        }
        if ($body.find('button[aria-label="Close Welcome Banner"]').length > 0) {
          cy.get('button[aria-label="Close Welcome Banner"]').click({ force: true })
        }

        cy.wait(1000);  

        if($body.find('a[aria-label="dismiss cookie message"]').length > 0) {
            cy.get('a[aria-label="dismiss cookie message"]').click({ force: true })
        }
      })
  
      // Chờ DOM ổn định
      cy.wait(500)

      // Mở thanh tìm kiếm
      cy.get('#searchQuery').click();
      cy.get('#mat-input-1').should('be.visible');
  });

  it('TC01 - Kiểm thử tìm kiếm với từ khóa hợp lệ', () => {
    cy.get('#mat-input-1').type('apple{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
  });

  it('TC02 - Kiểm thử tìm kiếm với chữ in hoa', () => {
    cy.get('#mat-input-1').type('APPLE{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
  });

  it('TC03 - Kiểm thử tìm kiếm với từ khóa một phần', () => {
    cy.get('#mat-input-1').type('app{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
  });

  it('TC04 - Tìm kiếm với từ khóa chính xác', () => {
    cy.get('#mat-input-1').type('Apple Pomace{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Pomace')
      .and('have.length', 1);
  });

  it('TC05 - Kiểm thử tìm kiếm không ra kết quả', () => {
    cy.get('#mat-input-1').type('xyznotfound{enter}');
    cy.get('.emptyState').should('exist');
  });

  it('TC06 - Kiểm thử tìm kiếm với ký tự đặc biệt', () => {
    cy.get('#mat-input-1').type('@#!{enter}');
    cy.get('.emptyState').should('exist');
  });

  it('TC07 - Kiểm thử tìm kiếm có dấu cách đầu dòng', () => {
    cy.get('#mat-input-1').type(' apple{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
  });

  it('TC08 - Kiểm thử tìm kiếm có dấu cách cuối dòng', () => {
    cy.get('#mat-input-1').type('apple {enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
  });
  

  it('TC09 - Kiểm thử tìm kiếm chỉ với dấu cách', () => {
    cy.get('#mat-input-1').type('    {enter}');
    cy.get('.heading').should('contain.text', 'All Products');
  });

  it('TC10 - Tìm kiếm với số', () => {
    cy.get('#mat-input-1').type('2020{enter}');
    cy.get('.mat-grid-tile').should('contain.text', '2020')
  });

  it('TC11 - Kiểm thử kết quả tìm kiếm giữ nguyên khi mất focus (không tự động tìm lại)', () => {
    cy.get('#mat-input-1').type('Apple Juice{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
    cy.get('body').click();
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
  });

  it('TC12 - Kiểm thử tìm kiếm với chuỗi rất dài', () => {
    const longString = 'a'.repeat(1000);
    cy.get('#mat-input-1').type(`${longString}{enter}`);
    cy.get('.emptyState').should('exist');
  });

  it('TC13 - Kiểm thử tìm kiếm với chữ hoa và thường xen kẽ', () => {
    cy.get('#mat-input-1').type('aPpLe{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
  });

  it('TC14 - Kiểm thử tìm kiếm khi đang cuộn trang', () => {
    cy.get('#mat-input-1').type('Apple Juice');
    cy.get('.mat-drawer-container').scrollTo('bottom', {ensureScrollable: false});
    cy.get('#mat-input-1').type('{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
  });

  it('TC15 - Kiểm thử tìm kiếm với emoji', () => {
    cy.get('#mat-input-1').type('🍎{enter}');
    cy.get('.emptyState').should('exist');
  });

  it('TC16 - Hiện ô tìm kiếm khi nhấn icon kính lúp', () => {
  });

  it('TC17 - Kiểm thử ẩn ô tìm kiếm khi nhấn icon X', () => {
    cy.get('#searchQuery').click();
    cy.get('#mat-input-1').should('not.be.visible');
  });


  it('TC18 - Kiểm thử tìm kiếm với nội dung chỉ xuất hiện trong mô tả sản phẩm', () => {
    cy.get('#mat-input-1').type('Unique digital painting depicting Stan{enter}');
    cy.get('.mat-grid-tile').first().click();
    cy.get('.mdc-dialog__content').should('contain.text', 'Unique digital painting depicting Stan');
  });

  it('TC19 - Kiểm thử tìm kiếm từ khóa có trong tiêu đề và nội dung', () => {
    cy.get('#mat-input-1').type('Facemask{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Facemask');
    cy.get('div[aria-label="Click for more information about the product"]').click();
    cy.get('.mdc-dialog__content').should('contain.text', 'Facemask');
  });

  it('TC20 - Kiểm thử tìm kiếm có dấu cách ở hai đầu', () => {
    cy.get('#mat-input-1').type(' Apple Juice {enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
  });

  it('TC21 - Kiểm thử tìm kiếm rồi xoá hết từ khoá và nhấn enter', () => {
    cy.get('#mat-input-1').type('Apple Juice{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
    cy.get('#mat-input-1').clear();
    cy.get('#mat-input-1').type('{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
  });


  it('TC22 - Kiểm thử tìm kiếm với từ khóa có nhiều dấu cách thừa ở đầu và cuối', () => {
    cy.get('#mat-input-1').type('   Apple Juice   {enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
  });


  it('TC23 - Kiểm thử xóa từ khóa khi đăng nhập ở tài khoản khác', () => {
    const searchContent = 'Juice';
    cy.get('#mat-input-1').type(`${searchContent}{enter}`);
    cy.get('.mat-grid-tile').should('contain.text', searchContent);
    cy.wait(500)
  
    // Login
    cy.get('#navbarAccount').click({ force: true })
    cy.get('#navbarLoginButton').click()
    cy.get('#email').type('demo')
    cy.get('#password').type('demo')
    cy.get('#loginButton').click()

    cy.get('#mat-input-1').should('not.be.visible');

    cy.get('#mat-input-1').invoke('val').then((val) => {
      expect(val).to.be.equal('');
    });
  });
});