describe('Authentication', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should display login form', () => {
        cy.get('input[type="text"]').should('exist');
        cy.get('input[type="password"]').should('exist');
        cy.get('button[type="submit"]').should('exist');
    });

    it('should show error on invalid login', () => {
        cy.get('input[type="text"]').type('invalid');
        cy.get('input[type="password"]').type('invalid');
        cy.get('button[type="submit"]').click();
        cy.get('.alert-danger').should('be.visible');
    });

    it('should redirect to dashboard on successful login', () => {
        cy.get('input[type="text"]').type('testuser');
        cy.get('input[type="password"]').type('password');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/dashboard');
    });
}); 