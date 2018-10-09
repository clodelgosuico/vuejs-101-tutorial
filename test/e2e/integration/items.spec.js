import { globalPageLoad, navigateToLogin } from '../helpers';

describe('items flows', () => {
  describe('loading the items page', () => {
    it('visits the items page', () => {
      cy.visit('http://localhost:3000/items');
    });

    globalPageLoad();

    it('displays the title', () => {
      cy.get('[data-cy="title"]').invoke('text').should('equal', 'Items');
    });

    it('renders more items when scrolling to the bottom of the page', () => {
      cy.get('[data-cy="item"]').should('have.length', 24);
      cy.scrollTo('bottom');
      cy.get('[data-cy="item"]').should('have.length', 36);
      cy.wait(100); // give time for the 12 items to render before attempting to scroll again
      cy.scrollTo('bottom');
      cy.get('[data-cy="item"]').should('have.length', 48);
    });
  });

  describe('navigating to the item details page', () => {
    it('visits the items page', () => {
      cy.visit('http://localhost:3000/items');
    });

    it('navigates to the item details page when an item is clicked', () => {
      cy.get('[data-cy="item"]').first().click();
      cy.location('pathname').should('equal', '/items/1');
      cy.wait(300); // give time for the new page content to fetch and render
      cy.get('[data-cy="title"]').invoke('text').should('equal', 'This is labore magna exercitation mollit cupidatat');
    });
  });

  describe('navigating to the login page', () => {
    it('visits the items page', () => {
      cy.visit('http://localhost:3000/items');
    });

    navigateToLogin();
  });
});
