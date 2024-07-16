const { appendFileSync } = require("fs");

function createLogger(logPath) {
    return function writeToLog(data, logInConsole = true) {
        appendFileSync(logPath, data, err => {
            if (err) console.log("Can't write to log file!")
            if (logInConsole) console.log(data)
        })
    }
}


module.exports = { createLogger }