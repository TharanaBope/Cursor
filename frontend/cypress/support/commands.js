Cypress.Commands.add('login', (username, password) => {
    cy.request({
        method: 'POST',
        url: 'http://localhost:5000/api/auth/login',
        body: {
            username,
            password
        }
    }).then((response) => {
        window.localStorage.setItem('token', response.body.token);
        window.localStorage.setItem('user', JSON.stringify(response.body.user));
    });
});

Cypress.Commands.add('logout', () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
}); 