require("dotenv").config()
const { exec } = require("child_process");
const { writeFileSync, appendFileSync } = require("fs");
const generateContractTypes = require("./types")
const localhostConfig = require("../localhost-config.json")

const LOG_PATH = "deploy.log"

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

function writeToLog(data, logInConsole = true) {
    appendFileSync(LOG_PATH, data, err => {
        if (err) console.log("Can't write to log file!")
        if (logInConsole) console.log(data)
    })
}

function deployContracts() {

    writeFileSync(LOG_PATH, "")
    writeToLog(`Deploy config: ${JSON.stringify(config[variant], null, 4)}\n`)

    const addresses = {
        GRAVIOLA_ADDRESS: "0x",
        OAO_ADDRESS: "0x"
    }

    return new Promise((resolve, reject) => {
        writeToLog("Starting deploy script...\n")
        exec(deployForgeCommand, (err, stdout, stderr) => {
            if (err || stderr || !stdout) {
                writeToLog(`Failed to deploy. Err:\n${err.message ?? "No err msg"}\n`, false)
                return reject(stderr ?? "Unknown error")
            }

            console.log(123)

            writeToLog(stdout)
            writeToLog("\nDeployed!\n")

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




