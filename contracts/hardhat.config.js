require("@nomicfoundation/hardhat-toolbox")
require("@nomicfoundation/hardhat-foundry")
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.24",
    networks: {
        hardhat: {
            auto: false,
            interval: 5000,
        },
    },
}
