import { globalPageLoad, navigateToLogin } from '../helpers';

describe('item details flows', () => {
  describe('loading the item details page', () => {
    it('visits the item details page', () => {
      cy.visit('http://localhost:3000/items/2');
    });

    globalPageLoad();

    it('displays the title', () => {
      cy.get('[data-cy="title"]').invoke('text').should('equal', 'This is exercitation duis duis');
    });

    it('displays the lazy-loaded content', () => {
      cy.contains('Lazy-loaded content with SEO relevance');
      cy.contains('Lazy-loaded content without SEO relevance');
    });
  });

  describe('navigating back to the items page', () => {
    it('visits the item details page', () => {
      cy.visit('http://localhost:3000/items/2');
    });

    it('navigates to the item details page when the "back to items" button is clicked', () => {
      cy.contains('Back to Items').click();
      cy.location('pathname').should('equal', '/items');
      cy.wait(300); // give time for the new page content to fetch and render
      cy.get('[data-cy="title"]').invoke('text').should('equal', 'Items');
    });

    it('displays the lazy-loaded content with navigating client-side', () => {
      cy.get('[data-cy="item"]').first().click();
      cy.location('pathname').should('equal', '/items/1');
      cy.wait(300); // give time for the new page content to fetch and render
      cy.contains('Lazy-loaded content with SEO relevance');
      cy.contains('Lazy-loaded content without SEO relevance');
    });
  });

  describe('navigating to the login page', () => {
    it('visits the items page', () => {
      cy.visit('http://localhost:3000/items');
    });

    navigateToLogin();
  });
});
