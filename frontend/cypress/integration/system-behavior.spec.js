describe('System Behavior', () => {
    beforeEach(() => {
        cy.login('testuser', 'password');
        cy.visit('/dashboard');
    });

    it('should handle producer-consumer interactions', () => {
        // Set up configuration
        cy.get('input[name="numProducers"]').clear().type('2');
        cy.get('input[name="numConsumers"]').clear().type('2');
        cy.get('input[name="totalTickets"]').clear().type('10');
        cy.get('input[name="maxTicketCapacity"]').clear().type('5');
        cy.get('.config-submit-btn').click();

        // Start system
        cy.get('.system-status button').contains('Start System').click();

        // Check for producer and consumer activities
        cy.get('.activity-log', { timeout: 10000 }).should('contain', 'Producer');
        cy.get('.activity-log').should('contain', 'Consumer');

        // Verify ticket pool updates
        cy.get('.ticket-graph').should('exist');
        cy.get('.progress-bar').should('exist');

        // Stop system
        cy.get('.system-status button').contains('Stop System').click();
    });

    it('should handle system limits correctly', () => {
        // Test with maximum capacity
        cy.get('input[name="maxTicketCapacity"]').clear().type('1');
        cy.get('.config-submit-btn').click();
        cy.get('.system-status button').contains('Start System').click();

        // Verify pool doesn't exceed capacity
        cy.get('.status-card').should(($card) => {
            const text = $card.text();
            const available = parseInt(text.match(/\d+/)[0]);
            expect(available).to.be.at.most(1);
        });
    });
}); 