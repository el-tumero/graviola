import util from "util"
import { exec } from "child_process"
const execp = util.promisify(exec)

export async function deploy() {
    await execp("cd ../contracts && yarn deploy:local")
}

export async function oaoMockResponse() {
    await execp("cd ../contracts && node utils/oao-mock.js")
}
