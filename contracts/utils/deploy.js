require("dotenv").config()
const { exec } = require("child_process")
const generateContractTypes = require("./types")
const { writeFileSync } = require("fs")
const localhostConfig = require("../localhost-config.json")
const { createLogger } = require("./fs")
// const hardhat = require("hardhat")
const sendRpcCall = require("./rpcCall")

const LOG_PATH = "deploy.log"
const log = createLogger(LOG_PATH)

const config = {
    // Local dev (hardhat)
    local: {
        rpc: "localhost",
        privateKey: localhostConfig.privKey,
        output: "addresses-local.json",
        script: "GraviolaLocalDeploy.s.sol",
    },
    // Arbitrum Sepolia
    testnet: {
        rpc: "arb_sepolia",
        privateKey: process.env.PRIVATE_KEY,
        output: "addresses.json",
        script: "GraviolaDeploy.s.sol",
    },
}

const variant = process.argv[2]
if (!config[variant]) {
    throw Error(
        "Invalid deploy variant. Check the 'config' object for possible options.",
    )
}

const { rpc, output, privateKey, script } = config[variant]
const deployForgeCommand = `forge script script/${script} --rpc-url ${rpc} --private-key ${privateKey} --broadcast`

function deployContracts() {
    writeFileSync(LOG_PATH, "")
    log(`Deploy config: ${JSON.stringify(config[variant], null, 4)}\n`)

    const addresses = {
        GRAVIOLA_ADDRESS: "0x",
        OAO_ADDRESS: "0x",
        TOKEN_ADDRESS: "0x",
        SEASONS_ARCHIVE_ADDRESS: "0x",
        SEASONS_GOVERNOR_ADDRESS: "0x",
    }

    return new Promise((resolve, reject) => {
        log("Starting deploy script...\n")
        exec(deployForgeCommand, (err, stdout, stderr) => {
            if (err || stderr || !stdout) {
                log(
                    `Failed to deploy. Err:\n${err.message ?? "No err msg"}\n`,
                    false,
                )
                return reject(stderr ?? "Unknown error")
            }
            log(stdout)
            log("\nDeployed!\n")

            const lines = stdout.split("\n")
            const logsIndex = lines.findIndex((value) => value == "== Logs ==")

            for (let i = 0; i < Object.keys(addresses).length; i++) {
                const log = lines[logsIndex + i + 1]
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
        writeFileSync(output, JSON.stringify(addresses, null, 4), (err) => {
            if (err) {
                console.error(err)
                return
            } else {
                console.log(`Addresses saved to '${output}'`)
            }
        })
        await generateContractTypes()
        console.log("Contract types (typechain) generated")

        if (variant === "local") {
            await sendRpcCall("evm_setIntervalMining", [3000])
            // await hardhat.network.provider.send("evm_setIntervalMining", [3000])
            console.log("Interval mining setup")
        }
    } catch (err) {
        console.log(err)
    }
}

main()
