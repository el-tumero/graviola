// const { appendFileSync } = require/("fs")
import { appendFileSync } from "fs"

export default function createLogger(logPath: string) {
    return function writeToLog(data: string, logInConsole = true) {
        try {
            appendFileSync(logPath, data)
        } catch (error) {
            console.log("Can't write to log file!")
        }
        if (logInConsole) console.log(data)
    }
}
