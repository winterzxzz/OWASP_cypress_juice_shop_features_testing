describe('Kiểm tra tìm kiếm Juice Shop', () => {
  beforeEach(() => {
    cy.visit('/#/search')
    cy.wait(1000);
    cy.closeDialogAndBanner();
    cy.openSearchInput();
  });

  it('TK_01 - Kiểm thử tìm kiếm với từ khóa hợp lệ', () => {
    cy.searchProduct('apple');
    cy.checkProductIsDisplayed('Apple Juice');
  });

  it('TK_02 - Kiểm thử tìm kiếm với chữ in hoa', () => {
    cy.searchProduct('APPLE');
    cy.checkProductIsDisplayed('Apple Juice');
  });

  it('TK_03 - Kiểm thử tìm kiếm với từ khóa một phần', () => {
    cy.searchProduct('app');
    cy.checkProductIsDisplayed('Apple Juice');
  });


  it('TK_04 - Kiểm thử tìm kiếm không ra kết quả', () => {
    cy.searchProduct('xyznotfound');
    cy.checkEmptyStateIsDisplayed();
  });

  it('TK_05 - Kiểm thử tìm kiếm với ký tự đặc biệt', () => {
    cy.searchProduct('@#!');
    cy.checkEmptyStateIsDisplayed();
  });

  it('TK_06 - Kiểm thử tìm kiếm có dấu cách đầu dòng', () => {
    cy.searchProduct(' apple');
    cy.checkProductIsDisplayed('Apple Juice');
  });

  it('TK_07 - Kiểm thử tìm kiếm có dấu cách cuối dòng', () => {
    cy.searchProduct('apple ');
    cy.checkProductIsDisplayed('Apple Juice');
  });
  

  it('TK_08 - Kiểm thử tìm kiếm chỉ với dấu cách', () => {
    cy.searchProduct('    ');
    cy.checkHeadingIsDisplayed('All Products');
  });

  it('TK_09 - Tìm kiếm với số', () => {
    cy.searchProduct('2020');
    cy.checkProductIsDisplayed('2020');
  });

  it('TK_10 - Kiểm thử kết quả tìm kiếm giữ nguyên khi mất focus (không tự động tìm lại)', () => {
    cy.searchProduct('Apple Juice');
    cy.checkProductIsDisplayed('Apple Juice');
    cy.get('body').click();
    cy.checkProductIsDisplayed('Apple Juice');
  });

  it('TK_11 - Kiểm thử tìm kiếm với chuỗi rất dài', () => {
    const longString = 'a'.repeat(1000);
    cy.searchProduct(longString);
    cy.checkEmptyStateIsDisplayed();
  });

  it('TK_12 - Kiểm thử tìm kiếm với chữ hoa và thường xen kẽ', () => {
    cy.searchProduct('aPpLe');
    cy.checkProductIsDisplayed('Apple Juice');
  });

  it('TK_13 - Kiểm thử tìm kiếm khi đang cuộn trang', () => {
    cy.get('#mat-input-1').type('Apple Juice');
    cy.get('.mat-drawer-container').scrollTo('bottom', {ensureScrollable: false});
    cy.get('#mat-input-1').type('{enter}');
    cy.checkProductIsDisplayed('Apple Juice');
  });

  it('TK_14 - Kiểm thử tìm kiếm với emoji', () => {
    cy.searchProduct('🍎');
    cy.checkEmptyStateIsDisplayed();
  });

  it('TK_15 - Hiện ô tìm kiếm khi nhấn icon kính lúp', () => {
  });

  it('TK_16 - Kiểm thử ẩn ô tìm kiếm khi nhấn icon X', () => {
    cy.hideSearchInput();
  });


  it('TK_17 - Kiểm thử tìm kiếm với nội dung chỉ xuất hiện trong mô tả sản phẩm', () => {
    cy.searchProduct('Unique digital painting depicting Stan');
    cy.openDetailProduct('Unique digital painting depicting Stan');
  });

  it('TK_18 - Kiểm thử tìm kiếm từ khóa có trong tiêu đề và nội dung', () => {
    cy.searchProduct('Facemask');
    cy.openDetailProduct('Facemask');
  });

  it('TK_19 - Kiểm thử tìm kiếm có dấu cách ở hai đầu', () => {
    cy.searchProduct(' Apple Juice ');
    cy.checkProductIsDisplayed('Apple Juice');
  });



  it('TK_20 - Kiểm thử tìm kiếm với từ khóa có nhiều dấu cách thừa ở đầu và cuối', () => {
    cy.searchProduct('   Apple Juice   ');
    cy.checkProductIsDisplayed('Apple Juice');
  });


  it('TK_21 - Kiểm thử xóa từ khóa khi đăng nhập ở tài khoản khác', () => {
    const searchContent = 'Juice';
    cy.searchProduct(searchContent);
    cy.checkProductIsDisplayed(searchContent);
    cy.wait(500)
  
    // Login
    cy.login('jim@juice-sh.op', 'ncc-1701');

    cy.checkIsHiddenSearchInputAndEmpty();
  });
});