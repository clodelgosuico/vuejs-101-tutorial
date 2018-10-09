const slideout = {
  isHidden: () => {
    cy.get('[data-cy="slideout"]').should('not.be.visible');
  },
  isVisible: () => {
    cy.get('[data-cy="slideout"]').should('be.visible');
  },
};

const globalPageLoad = () => {
  it('prints the page title and site title', () => {
    cy.contains('Demo Application');
    cy.title().should('eq', 'Hello world');
  });

  it('starts with the nav hidden', () => {
    slideout.isHidden();
  });
};

const navigateToLogin = () => {
  it('displays a login link', () => {
    cy.contains('Login');
    cy.get('[data-cy="log-in-out-link"]').should('exist');
  });

  it('navigates to the login page when the login link clicked', () => {
    cy.get('[data-cy="log-in-out-link"]').click();
    cy.location('pathname').should('equal', '/login');
    cy.get('[data-cy="title"]').should('exist');
  });

  it('closes the slideout when navigating', () => {
    slideout.isHidden();
  });

  it('navigates home when clicking the site title', () => {
    cy.contains('Demo Application').click();
    cy.location('pathname').should('equal', '/');
  });
};

export {
  globalPageLoad,
  navigateToLogin,
  slideout,
};
