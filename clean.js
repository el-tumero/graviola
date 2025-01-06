const { rimraf } = require("rimraf")

const packages = ["contracts", "core", "event", "render"]

Promise.all(
    packages
        .map((packageName) => `./${packageName}/node_modules`)
        .concat(["./node_modules"])
        .map((path) => rimraf(path)),
).then(() => {
    console.log("Cleaned!")
})
