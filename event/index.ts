import { WebSocketProvider } from "ethers"
import { GeneratorEventTester__factory } from "@graviola/contracts"

const provider = new WebSocketProvider("ws://127.0.0.1:8545/")

const GENERATION_TOPIC = "generation"

const server = Bun.serve({
    port: 8080,
    fetch(req, server) {
        if (server.upgrade(req)) {
            return
        }
        return new Response("Upgrade failed", { status: 500 })
    },
    websocket: {
        message(ws, message) {},
        open(ws) {
            ws.subscribe(GENERATION_TOPIC)
        },
        close(ws) {
            ws.unsubscribe(GENERATION_TOPIC)
        },
    },
})

const eventTester = GeneratorEventTester__factory.connect(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    provider,
)

eventTester.on(eventTester.filters.RequestVRFSent, (initiator, requestId) => {
    server.publish(GENERATION_TOPIC, `RequestVRFSent ${initiator}:${requestId}`)
})

eventTester.on(
    eventTester.filters.RequestVRFFulfilled,
    (initiator, requestId) => {
        server.publish(
            GENERATION_TOPIC,
            `RequestVRFFulfilled ${initiator}:${requestId}`,
        )
    },
)

eventTester.on(eventTester.filters.RequestOAOSent, (initiator, requestId) => {
    server.publish(GENERATION_TOPIC, `RequestOAOSent ${initiator}:${requestId}`)
})

eventTester.on(
    eventTester.filters.RequestOAOFulfilled,
    (initiator, requestId) => {
        server.publish(
            GENERATION_TOPIC,
            `RequestOAOFulfilled ${initiator}:${requestId}`,
        )
    },
)
