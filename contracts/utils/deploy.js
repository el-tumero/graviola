require("dotenv").config()
const { exec } = require("child_process");
const generateContractTypes = require("./types")
const { writeFileSync } = require("fs")
const localhostConfig = require("../localhost-config.json");
const { createLogger } = require("./fs");

const LOG_PATH = "deploy.log"
const log = createLogger(LOG_PATH)

const config = {
    // Local dev (ganache)
    local: {
        rpc: "localhost",
        privateKey: localhostConfig.privKey,
        output: "addresses-local.json"
    },
    // Arbitrum Sepolia
    testnet: {
        rpc: "arb_sepolia",
        privateKey: process.env.PRIVATE_KEY,
        output: "addresses.json",
    }
}

const variant = process.argv[2]
if (!config[variant]) {
    throw Error("Invalid deploy variant. Check the 'config' object for possible options.")
}

const { rpc, output, privateKey } = config[variant]
const deployForgeCommand = `forge script script/GraviolaDeploy.s.sol --rpc-url ${rpc} --private-key ${privateKey} --broadcast`

function deployContracts() {

    writeFileSync(LOG_PATH, "")
    log(`Deploy config: ${JSON.stringify(config[variant], null, 4)}\n`)

    const addresses = {
        GRAVIOLA_ADDRESS: "0x",
        OAO_ADDRESS: "0x"
    }

    return new Promise((resolve, reject) => {
        log("Starting deploy script...\n")
        exec(deployForgeCommand, (err, stdout, stderr) => {
            if (err || stderr || !stdout) {
                log(`Failed to deploy. Err:\n${err.message ?? "No err msg"}\n`, false)
                return reject(stderr ?? "Unknown error")
            }
            log(stdout)
            log("\nDeployed!\n")

            const lines = stdout.split("\n")
            const logsIndex = lines.findIndex(value => value == "== Logs ==")

            for (let i = 0; i < 2; i++) {
                const log = lines[logsIndex + i + 1];
                const [name, address] = log.split(":")
                addresses[name.trim()] = address
            }
            resolve(addresses)
        })
    })
}

async function main() {
    try {
        const addresses = await deployContracts()
        console.log(`Logs saved to '${LOG_PATH}'`)
        writeFileSync(output, JSON.stringify(addresses, null, 4), err => {
            if (err) {
                console.error(err)
                return
            } else {
                console.log(`Addresses saved to '${output}'`)
            }
        })
        await generateContractTypes()
        console.log("Contract types (typechain) generated")
    } catch (err) {
        console.log(err)
    }

}

main()




