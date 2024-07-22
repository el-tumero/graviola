require("@nomicfoundation/hardhat-toolbox")
require("@nomicfoundation/hardhat-foundry")
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.24",
    networks: {
        hardhat: {
            mining: {
                auto: false,
                interval: 3000,
            },
        },
    },
}
