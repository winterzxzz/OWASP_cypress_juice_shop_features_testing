describe('Juice Shop Search Tests', () => {
    beforeEach(() => {
        cy.visit('/')
  
        // Đợi trang load xong
        cy.wait(1000)
    
        // Xử lý overlay popup nếu xuất hiện
        cy.get('body').then(($body) => {
          if ($body.find('.cdk-overlay-backdrop').length > 0) {
            cy.get('.cdk-overlay-backdrop').click({ force: true }) // Đóng overlay mờ
          }
          if ($body.find('.close-dialog').length > 0) {
            cy.get('.close-dialog').click({ force: true }) // Đóng popup chào mừng
          }
          if ($body.find('button[aria-label="Close Welcome Banner"]').length > 0) {
            cy.get('button[aria-label="Close Welcome Banner"]').click({ force: true }) // đóng banner nếu có
          }
  
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
  
    it('1. Tìm kiếm chính xác', () => {
      cy.get('#mat-input-1').type('apple{enter}');
      cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
    });
  
    it('2. Tìm kiếm một phần', () => {
      cy.get('#mat-input-1').type('appl{enter}');
      cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
    });
  
    it('3. Tìm kiếm không phân biệt chữ hoa/thường', () => {
      cy.get('#mat-input-1').type('APPLE{enter}');
      cy.get('.mat-grid-tile').should('contain.text', 'Apple Juice');
    });
  
    it('4. Tìm kiếm với ô trống', () => {
      cy.get('#mat-input-1').type('{enter}');
      cy.get('.mat-grid-tile').should('exist'); // Có thể hiển thị tất cả sản phẩm
    });
  
    it('5. Ký tự đặc biệt', () => {
      cy.get('#mat-input-1').type('!@#$%{enter}');
      cy.get('.emptyState').should('exist');
    });
  
    it('6. Ký tự Unicode', () => {
      cy.get('#mat-input-1').type('漢字{enter}');
      cy.get('.emptyState').should('exist');
    });
  
    it('7. Chuỗi rất dài', () => {
      const longInput = 'a'.repeat(1000);
      cy.get('#mat-input-1').type(`${longInput}{enter}`);
      cy.get('.emptyState').should('exist');
    });
  
    it('8. Chuỗi độ dài biên (254 ký tự)', () => {
      const input = 'b'.repeat(254);
      cy.get('#mat-input-1').type(`${input}{enter}`);
      cy.get('.emptyState').should('exist');
    });
  
    it('9. Không tìm thấy kết quả', () => {
      cy.get('#mat-input-1').type('xyz123{enter}');
      cy.get('.emptyState').should('exist');
    });

  
    it('10. Tìm kiếm theo mô tả sản phẩm', () => {
      cy.get('#mat-input-1').type('carrot{enter}');
      cy.get('.mat-grid-tile').should('contain.text', 'Carrot');
    });
  });