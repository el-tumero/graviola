const { exec } = require("child_process");
const { writeFile } = require("fs");
const generateContractTypes = require("./types")

const rpc = "arb_sepolia"

const deployForgeCommand = `forge script script/GraviolaDeploy.s.sol --rpc-url ${rpc} --broadcast`

const logsPath = "deploy.log"
const outputPath = "addresses.json"

function writeToLog(data) {
    writeFile(logsPath, data, err => {
        if(err) console.log("Can't write to log file!")
    })
}

function deployContracts() {
    const addresses = {
        GRAVIOLA_ADDRESS: "0x",
        OAO_ADDRESS: "0x"
    }

    return new Promise((resolve, reject) => {
        exec(deployForgeCommand, (err, stdout, stderr) => {    
            if(err || stderr){
                reject(err ?? stderr)
            }
            writeToLog(stdout)

            console.log("Deployed!")
            const lines = stdout.split("\n")
            const logsIndex = lines.findIndex(value => value == "== Logs ==")
        
            for (let i = 0; i < 2; i++) {
                const log = lines[logsIndex+i+1];
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
        console.log(`Logs saved to ${logsPath}`)
        writeFile(outputPath, JSON.stringify(addresses), err => {
            if(err){
                console.error(err)
                return
            } else{
                console.log(`Addresses saved to ${outputPath}`)
            }
        })
        await generateContractTypes()
        console.log("Contract types (typechain) generated")
    } catch (err) {
        console.log(err)
    }
    
}

main()




