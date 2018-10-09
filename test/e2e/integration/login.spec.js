import { globalPageLoad } from '../helpers';

describe('login flows', () => {
  describe('loading the login page', () => {
    it('visits the login page', () => {
      cy.visit('http://localhost:3000/login');
    });

    globalPageLoad();

    it('displays the title', () => {
      cy.get('[data-cy="title"]').invoke('text').should('equal', 'Login');
    });

    it('displays an error if the incorrect username/password is entered', () => {
      cy.get('form')
        .get('input[name=username]').type('asdf').end()
        .get('input[name=password]')
        .type('asdf{enter}'); // {enter} causes the form to submit

      cy.location('pathname').should('equal', '/login'); // should not have navigated away
      cy.contains('username must be test and password must be abc123');
    });

    it('navigates to the home page and updates the state of the log in/out button after successful login', () => {
      cy.get('form')
        .get('input[name=username]').clear().type('test')
        .end()
        .get('input[name=password]')
        .clear()
        .type('abc123{enter}'); // {enter} causes the form to submit

      cy.location('pathname').should('equal', '/');
      cy.wait(300); // give time for the new page content to fetch and render
      cy.get('[data-cy="title"]').invoke('text').should('equal', 'Welcome Test User');
      cy.contains('Logout');
    });

    it('updates the state when clicking on the logout link', () => {
      cy.get('[data-cy="log-in-out-link"]').click();
      cy.contains('Login');
      cy.get('[data-cy="title"]').invoke('text').should('equal', 'Welcome ');
    });
  });

  describe('navigating to the login page', () => {
    it('visits the items page', () => {
      cy.visit('http://localhost:3000/items');
    });

    it('routes to the login page', () => {
      cy.get('[data-cy="log-in-out-link"]').click();
      cy.location('pathname').should('equal', '/login'); // should not have navigated away
    });

    it('redirects back to the items page after successful login', () => {
      cy.get('form')
        .get('input[name=username]').clear().type('test')
        .end()
        .get('input[name=password]')
        .clear()
        .type('abc123{enter}'); // {enter} causes the form to submit

      cy.location('pathname').should('equal', '/items');
    });
  });
});
