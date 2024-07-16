import '@synthetixio/synpress/support/index';
import localhostConfig from "../../../contracts/localhost-config.json"

before(() => {
    if (!Cypress.env('SKIP_METAMASK_SETUP')) {
        cy.setupMetamask(
            localhostConfig.privKey,
            {
                networkName: "localhost",
                chainId: 1337,
                rpcUrl: localhostConfig.rpcUrl,
                isTestnet: true,
            }
        );
    }
})

