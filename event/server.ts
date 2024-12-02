import { GENERATION_TOPIC } from "./index"
import { setupListeners } from "./listeners"

const server = Bun.serve({
    port: 8085,
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

console.log("[EVENT] Server started on port 8085")

setupListeners(server)
