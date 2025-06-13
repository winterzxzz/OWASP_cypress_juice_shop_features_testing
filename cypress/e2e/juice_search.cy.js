describe('Kiểm tra tìm kiếm Juice Shop', () => {
  beforeEach(() => {
    cy.visit('/#/search')
    cy.wait(1000);
    cy.closeDialogAndBanner();
    cy.openSearchInput();
  });

  it('TC01 - Kiểm thử tìm kiếm với từ khóa hợp lệ', () => {
    cy.searchProduct('apple');
    cy.checkProductIsDisplayed('Apple Juice');
  });

  it('TC02 - Kiểm thử tìm kiếm với chữ in hoa', () => {
    cy.searchProduct('APPLE');
    cy.checkProductIsDisplayed('Apple Juice');
  });

  it('TC03 - Kiểm thử tìm kiếm với từ khóa một phần', () => {
    cy.searchProduct('app');
    cy.checkProductIsDisplayed('Apple Juice');
  });

  it('TC04 - Tìm kiếm với từ khóa chính xác', () => {
    cy.searchProduct('Apple Pomace');
    cy.checkOnlyOneProductIsDisplayed('Apple Pomace');
  });

  it('TC05 - Kiểm thử tìm kiếm không ra kết quả', () => {
    cy.searchProduct('xyznotfound');
    cy.checkEmptyStateIsDisplayed();
  });

  it('TC06 - Kiểm thử tìm kiếm với ký tự đặc biệt', () => {
    cy.searchProduct('@#!');
    cy.checkEmptyStateIsDisplayed();
  });

  it('TC07 - Kiểm thử tìm kiếm có dấu cách đầu dòng', () => {
    cy.searchProduct(' apple');
    cy.checkProductIsDisplayed('Apple Juice');
  });

  it('TC08 - Kiểm thử tìm kiếm có dấu cách cuối dòng', () => {
    cy.searchProduct('apple ');
    cy.checkProductIsDisplayed('Apple Juice');
  });
  

  it('TC09 - Kiểm thử tìm kiếm chỉ với dấu cách', () => {
    cy.searchProduct('    ');
    cy.checkHeadingIsDisplayed('All Products');
  });

  it('TC10 - Tìm kiếm với số', () => {
    cy.searchProduct('2020');
    cy.checkProductIsDisplayed('2020');
  });

  it('TC11 - Kiểm thử kết quả tìm kiếm giữ nguyên khi mất focus (không tự động tìm lại)', () => {
    cy.searchProduct('Apple Juice');
    cy.checkProductIsDisplayed('Apple Juice');
    cy.get('body').click();
    cy.checkProductIsDisplayed('Apple Juice');
  });

  it('TC12 - Kiểm thử tìm kiếm với chuỗi rất dài', () => {
    const longString = 'a'.repeat(1000);
    cy.searchProduct(longString);
    cy.checkEmptyStateIsDisplayed();
  });

  it('TC13 - Kiểm thử tìm kiếm với chữ hoa và thường xen kẽ', () => {
    cy.searchProduct('aPpLe');
    cy.checkProductIsDisplayed('Apple Juice');
  });

  it('TC14 - Kiểm thử tìm kiếm khi đang cuộn trang', () => {
    cy.get('#mat-input-1').type('Apple Juice');
    cy.get('.mat-drawer-container').scrollTo('bottom', {ensureScrollable: false});
    cy.get('#mat-input-1').type('{enter}');
    cy.checkProductIsDisplayed('Apple Juice');
  });

  it('TC15 - Kiểm thử tìm kiếm với emoji', () => {
    cy.searchProduct('🍎');
    cy.checkEmptyStateIsDisplayed();
  });

  it('TC16 - Hiện ô tìm kiếm khi nhấn icon kính lúp', () => {
  });

  it('TC17 - Kiểm thử ẩn ô tìm kiếm khi nhấn icon X', () => {
    cy.hideSearchInput();
  });


  it('TC18 - Kiểm thử tìm kiếm với nội dung chỉ xuất hiện trong mô tả sản phẩm', () => {
    cy.searchProduct('Unique digital painting depicting Stan');
    cy.openDetailProduct('Unique digital painting depicting Stan');
  });

  it('TC19 - Kiểm thử tìm kiếm từ khóa có trong tiêu đề và nội dung', () => {
    cy.searchProduct('Facemask');
    cy.openDetailProduct('Facemask');
  });

  it('TC20 - Kiểm thử tìm kiếm có dấu cách ở hai đầu', () => {
    cy.searchProduct(' Apple Juice ');
    cy.checkProductIsDisplayed('Apple Juice');
  });

  it('TC21 - Kiểm thử tìm kiếm rồi xoá hết từ khoá và nhấn enter', () => {
    cy.searchProduct('Apple Juice');
    cy.checkProductIsDisplayed('Apple Juice');
    cy.clearSearchInput();
    cy.searchProduct('{enter}');
    cy.checkProductIsDisplayed('Apple Juice');
  });


  it('TC22 - Kiểm thử tìm kiếm với từ khóa có nhiều dấu cách thừa ở đầu và cuối', () => {
    cy.searchProduct('   Apple Juice   ');
    cy.checkProductIsDisplayed('Apple Juice');
  });


  it('TC23 - Kiểm thử xóa từ khóa khi đăng nhập ở tài khoản khác', () => {
    const searchContent = 'Juice';
    cy.searchProduct(searchContent);
    cy.checkProductIsDisplayed(searchContent);
    cy.wait(500)
  
    // Login
    cy.login('demo', 'demo');

    cy.checkIsHiddenSearchInputAndEmpty();
  });
});