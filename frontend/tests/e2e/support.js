import '@synthetixio/synpress/support/index';

before(() => {
    if (!Cypress.env('SKIP_METAMASK_SETUP')) {
        cy.setupMetamask(
            "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d",
            {
              networkName: "localhost", 
              chainId: 1337, 
              rpcUrl: "http://localhost:8545", 
              isTestnet: true,
            }
        );
    }
})

