describe('Dashboard', () => {
    beforeEach(() => {
        // Login before each test
        cy.login('testuser', 'password');
        cy.visit('/dashboard');
    });

    it('should display all dashboard components', () => {
        cy.get('.config-form').should('exist');
        cy.get('.ticket-graph').should('exist');
        cy.get('.activity-log').should('exist');
        cy.get('.system-status').should('exist');
    });

    it('should allow configuration input', () => {
        cy.get('input[name="numProducers"]').clear().type('3');
        cy.get('input[name="numConsumers"]').clear().type('4');
        cy.get('input[name="totalTickets"]').clear().type('100');
        cy.get('.config-submit-btn').click();
        cy.get('.alert-success').should('be.visible');
    });

    it('should start and stop system', () => {
        cy.get('.system-status button').contains('Start System').click();
        cy.get('.system-status').should('contain', 'System Running');
        cy.get('.system-status button').contains('Stop System').click();
        cy.get('.system-status').should('contain', 'System Stopped');
    });
}); 