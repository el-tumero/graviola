async function sendRpcCall(method, params) {
    const body = {
        jsonrpc: "2.0",
        method,
        params,
        id: 1337,
    }

    await fetch("http://localhost:8545/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
}

module.exports = sendRpcCall
