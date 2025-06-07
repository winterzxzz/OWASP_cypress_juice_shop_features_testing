describe('Juice Shop - Login Test', () => {
    it('should login with valid credentials', () => {
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
  
      // Login
      cy.get('#navbarAccount').click({ force: true })
      cy.get('#navbarLoginButton').click()
      cy.get('#email').type('demo')
      cy.get('#password').type('demo')
      cy.get('#loginButton').click()
  
      cy.contains('Your Basket').should('be.visible')
    })
  })
  
  it('Login với tài khoản hợp lệ', () => {
    cy.visit('/')
    cy.get('.cdk-overlay-backdrop').click({ force: true }) // đóng popup nếu có
    cy.get('#navbarAccount').click()
    cy.get('#navbarLoginButton').click()
    cy.get('#email').type('demo')
    cy.get('#password').type('demo')
    cy.get('#loginButton').click()
    cy.contains('Your Basket').should('be.visible')
  })
  
  
  it('Login với mật khẩu sai', () => {
    cy.visit('/')
    cy.get('.cdk-overlay-backdrop').click({ force: true })
    cy.get('#navbarAccount').click()
    cy.get('#navbarLoginButton').click()
    cy.get('#email').type('demo')
    cy.get('#password').type('wrongpassword')
    cy.get('#loginButton').click()
    cy.get('.error').should('contain', 'Invalid') // hoặc toast lỗi
  })
  
  it('Login với tài khoản không tồn tại', () => {
    cy.visit('/')
    cy.get('.cdk-overlay-backdrop').click({ force: true })
    cy.get('#navbarAccount').click()
    cy.get('#navbarLoginButton').click()
    cy.get('#email').type('nonexistent@abc.com')
    cy.get('#password').type('123456')
    cy.get('#loginButton').click()
    cy.get('.error').should('contain', 'Invalid') // kiểm tra thông báo lỗi
  })
  
  it('Login với mật khẩu sai', () => {
    cy.visit('/')
    cy.get('.cdk-overlay-backdrop').click({ force: true })
    cy.get('#navbarAccount').click()
    cy.get('#navbarLoginButton').click()
    cy.get('#email').type('demo')
    cy.get('#password').type('wrongpassword')
    cy.get('#loginButton').click()
    cy.get('.error').should('contain', 'Invalid') // hoặc toast lỗi
  })