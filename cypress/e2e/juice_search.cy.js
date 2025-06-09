describe('Juice Shop Search Tests', () => {
  beforeEach(() => {
      cy.visit('/')

      // Đợi trang load xong và xử lý các popup
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

      // Open the search bar
      cy.get('#searchQuery').click();
      cy.get('#mat-input-1').should('be.visible');
  });

  it('TC01 - Tìm kiếm với từ khóa hợp lệ', () => {
    cy.get('#mat-input-1').type('apple{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
  });

  it('TC02 - Tìm kiếm với chữ in hoa', () => {
    cy.get('#mat-input-1').type('APPLE{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
  });

  it('TC03 - Tìm kiếm với từ khóa một phần', () => {
    cy.get('#mat-input-1').type('app{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
  });

  it('TC04 - Tìm kiếm với từ khóa chính xác', () => {
    cy.get('#mat-input-1').type('apple juice{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice')
      .and('have.length', 1);
  });

  it('TC05 - Tìm kiếm không ra kết quả', () => {
    cy.get('#mat-input-1').type('xyznotfound{enter}');
    cy.get('.emptyState').should('exist');
  });

  it('TC06 - Tìm kiếm với ký tự đặc biệt', () => {
    cy.get('#mat-input-1').type('@#!{enter}');
    cy.get('.emptyState').should('exist');
  });

  it('TC07 - Tìm kiếm có dấu cách đầu dòng', () => {
    cy.get('#mat-input-1').type(' apple{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
  });

  it('TC08 - Tìm kiếm có dấu cách cuối dòng', () => {
    cy.get('#mat-input-1').type('apple {enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
  });

  it('TC09 - Tìm kiếm chỉ với dấu cách', () => {
    cy.get('#mat-input-1').type('    {enter}');
    cy.get('.mat-grid-tile').should('exist');
  });

  it('TC10 - Tìm kiếm với số', () => {
    cy.get('#mat-input-1').type('2020{enter}');
    // Giả định có sản phẩm chứa số 2020
    cy.get('.mat-grid-tile').should('exist');
  });

  it('TC11 - Kết quả search giữ nguyên khi mất focus (không tự động search lại)', () => {
    cy.get('#mat-input-1').type('apple{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
  
    cy.get('body').click();
  
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
  });

  it('TC12 - Tìm kiếm với chuỗi rất dài', () => {
    const longString = 'a'.repeat(1000);
    cy.get('#mat-input-1').type(`${longString}{enter}`);
    cy.get('.emptyState').should('exist');
  });

  it('TC13 - Tìm kiếm với chữ hoa và thường xen kẽ', () => {
    cy.get('#mat-input-1').type('ApPlE{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
  });

  it('TC14 - Tìm kiếm khi đang cuộn trang', () => {
    cy.get('.mat-drawer-container').scrollTo('bottom', {ensureScrollable: false});
    cy.get('#mat-input-1').type('apple{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
  });

  it('TC15 - Tìm kiếm với emoji', () => {
    cy.get('#mat-input-1').type('🍎{enter}');
    cy.get('.emptyState').should('exist');
  });

  it('TC16 - Hiện ô tìm kiếm khi nhấn icon kính lúp', () => {
    
  });

  it('TC17 - Ẩn ô tìm kiếm khi nhấn icon X', () => {
    cy.get('#searchQuery').click();
    cy.get('#mat-input-1').should('not.be.visible');
  });

  it('TC18 - Hiện tất cả sản phẩm khi nhấn nút X ở ô tìm kiếm', () => {
    cy.get('#mat-input-1').type('@#!{enter}');
    cy.get('.emptyState').should('exist');
    cy.get('#searchQuery').click();
    cy.get('.mat-grid-tile').should('exist');
  });

  it('TC19 - Tìm kiếm với nội dung chỉ xuất hiện trong nội dung sản phẩm', () => {
    cy.get('#mat-input-1').type('Unique digital painting depicting Stan{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Best Juice Shop Salesman Artwork');
  });

  it('TC20 - Tìm kiếm với từ khóa xuất hiện ở cả tiêu đề và nội dung', () => {
    cy.get('#mat-input-1').type('Facemask{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'OWASP Juice Shop "King of the Hill" Facemask');
    cy.get('div[aria-label="Click for more information about the product"]').click();
    cy.get('.mdc-dialog__content').should('contain.text', 'Facemask with compartment for filter from 50% cotton and 50% polyester.');
  });

});