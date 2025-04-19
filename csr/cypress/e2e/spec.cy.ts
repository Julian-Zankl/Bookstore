describe("template spec", () => {
  it("passes", () => {
    cy.visit("/");
    cy.lighthouse({
      performance: 80,
      accessibility: 80,
      "best-practices": 80,
      seo: 80,
      pwa: 0,
    });
  });
});
