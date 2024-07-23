describe("connect wallet spec", () => {
    before(() => {
        cy.visit("/")
    })

    it("import private key and connect wallet using imported metamask account", () => {
        cy.get("w3m-button").click()
        // cy.get('[data-test-id="wallet-selector-walletconnect"]').click();
        cy.acceptMetamaskAccess()
        // cy.get('#accounts').should(
        //   'have.text',
        //   '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
        // );
    })
})
