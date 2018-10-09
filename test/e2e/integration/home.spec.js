import { globalPageLoad, navigateToLogin, slideout } from '../helpers';

describe('home flows', () => {
  describe('loading the home page', () => {
    it('visits the items page', () => {
      cy.visit('http://localhost:3000/');
    });

    globalPageLoad();

    it('displays the title', () => {
      cy.get('[data-cy="title"]').invoke('text').should('equal', 'Welcome ');
    });
  });

  describe('navigating to the items page', () => {
    it('visits the home page', () => {
      cy.visit('http://localhost:3000/');
    });

    it('shows the menu when the hamburger is clicked', () => {
      cy.get('[data-cy="menu-icon"]').click();
      slideout.isVisible();
    });

    it('navigates to the items page when clicked', () => {
      cy.get('[data-cy="menu-item"]').first().click();
      cy.location('pathname').should('equal', '/items');
    });

    it('closes the slideout when navigating', () => {
      slideout.isHidden();
    });

    it('navigates home when clicking the site title', () => {
      cy.contains('Demo Application').click();
      cy.location('pathname').should('equal', '/');
    });
  });

  describe('navigating to the login page', () => {
    it('visits the home page', () => {
      cy.visit('http://localhost:3000/');
    });

    navigateToLogin();
  });
});
