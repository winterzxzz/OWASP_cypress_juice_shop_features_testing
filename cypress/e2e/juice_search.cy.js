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

  it('TC01 - Tìm kiếm với từ khóa hợp lệ', () => {
    cy.get('#mat-input-1').type('nước táo{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Nước táo');
  });

  it('TC02 - Tìm kiếm với chữ in hoa', () => {
    cy.get('#mat-input-1').type('NƯỚC TÁO{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Nước táo');
  });

  it('TC03 - Tìm kiếm với từ khóa một phần', () => {
    cy.get('#mat-input-1').type('táo{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Nước táo');
  });

  it('TC04 - Tìm kiếm với từ khóa chính xác', () => {
    cy.get('#mat-input-1').type('nước táo{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Nước táo')
      .and('have.length', 1);
  });

  it('TC05 - Tìm kiếm không ra kết quả', () => {
    cy.get('#mat-input-1').type('khongtimthay{enter}');
    cy.get('.emptyState').should('exist');
  });

  it('TC06 - Tìm kiếm với ký tự đặc biệt', () => {
    cy.get('#mat-input-1').type('@#!{enter}');
    cy.get('.emptyState').should('exist');
  });

  it('TC07 - Tìm kiếm có dấu cách đầu dòng', () => {
    cy.get('#mat-input-1').type(' nước táo{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Nước táo');
  });

  it('TC08 - Tìm kiếm có dấu cách cuối dòng', () => {
    cy.get('#mat-input-1').type('nước táo {enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Nước táo');
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

  it('TC11 - Kết quả tìm kiếm giữ nguyên khi mất focus (không tự động tìm lại)', () => {
    cy.get('#mat-input-1').type('nước táo{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Nước táo');
  
    cy.get('body').click();
  
    cy.get('.mat-grid-tile').should('contain.text', 'Nước táo');
  });

  it('TC12 - Tìm kiếm với chuỗi rất dài', () => {
    const chuoiDai = 'a'.repeat(1000);
    cy.get('#mat-input-1').type(`${chuoiDai}{enter}`);
    cy.get('.emptyState').should('exist');
  });

  it('TC13 - Tìm kiếm với chữ hoa và thường xen kẽ', () => {
    cy.get('#mat-input-1').type('NướC tÁo{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Nước táo');
  });

  it('TC14 - Tìm kiếm khi đang cuộn trang', () => {
    cy.get('.mat-drawer-container').scrollTo('bottom', {ensureScrollable: false});
    cy.get('#mat-input-1').type('nước táo{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Nước táo');
  });

  it('TC15 - Tìm kiếm với emoji', () => {
    cy.get('#mat-input-1').type('🍎{enter}');
    cy.get('.emptyState').should('exist');
  });

  it('TC16 - Hiện ô tìm kiếm khi nhấn icon kính lúp', () => {
    // Chưa có bước kiểm tra cụ thể
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

  it('TC19 - Tìm kiếm với nội dung chỉ xuất hiện trong mô tả sản phẩm', () => {
    cy.get('#mat-input-1').type('Tranh kỹ thuật số độc đáo mô tả Stan{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Tác phẩm nghệ thuật nhân viên bán hàng xuất sắc nhất Juice Shop');
  });

  it('TC20 - Tìm kiếm với từ khóa xuất hiện ở cả tiêu đề và mô tả', () => {
    cy.get('#mat-input-1').type('Khẩu trang{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Khẩu trang "Vua của Đồi" OWASP Juice Shop');
    cy.get('div[aria-label="Click for more information about the product"]').click();
    cy.get('.mdc-dialog__content').should('contain.text', 'Khẩu trang có ngăn lọc, 50% cotton và 50% polyester.');
  });

  it('TC21 - Tìm kiếm có dấu cách ở hai đầu', () => {
    cy.get('#mat-input-1').type(' nước táo {enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Nước táo');
  });

  it('TC22 - Tìm kiếm rồi xoá hết từ khoá và nhấn enter', () => {
    cy.get('#mat-input-1').type('nước táo{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Nước táo');
    cy.get('#mat-input-1').clear();
    cy.get('#mat-input-1').type('{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Nước táo');
  });

  it('TC23 - Tìm kiếm với từ khóa có nhiều dấu cách thừa ở giữa', () => {
    cy.get('#mat-input-1').type('nước    táo{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Nước táo');
  });

  it('TC24 - Tìm kiếm với từ khóa có nhiều dấu cách thừa ở đầu và cuối', () => {
    cy.get('#mat-input-1').type(' nước táo {enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Nước táo');
  });

  it('TC25 - Tìm kiếm với ký tự unicode bất thường', () => {
    cy.get('#mat-input-1').type('𝓝ướ𝓬 𝓽á𝓸{enter}');
    cy.get('.mat-grid-tile').should('contain.text', 'Nước táo');
  });

  it('TC26 - Tìm kiếm từ khóa đảo ngược thứ tự', () => {
    cy.get('#mat-input-1').type('táo nước{enter}');
    cy.get('.mat-grid-tile').should('not.contain.text', 'Nước táo');
  });
});