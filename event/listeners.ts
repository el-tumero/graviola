import type { Server } from "bun"
import {
    GraviolaGenerator__factory,
    GraviolaCollection__factory,
    GraviolaCollectionReadProxy__factory,
    addresses,
} from "@graviola/contracts"
import { WebSocketProvider } from "ethers"
import { GENERATION_TOPIC } from "./index"
import {
    type SupportedEvents,
    type Card,
    propertiesToCard,
} from "@graviola/core"
import { createEventMessage } from "./message"

const provider = new WebSocketProvider("ws://127.0.0.1:8545/")

const generator = GraviolaGenerator__factory.connect(
    addresses.local.GENERATOR_ADDRESS,
    provider,
)

const collectionReadProxy = GraviolaCollectionReadProxy__factory.connect(
    addresses.local.COLLECTION_READ_PROXY_ADDRESS,
    provider,
)

const publishEventMessage = (
    server: Server,
    requestId: bigint,
    eventName: SupportedEvents,
    initiator: string,
    card?: Card,
) => {
    server.publish(
        GENERATION_TOPIC,
        JSON.stringify(
            createEventMessage(requestId, eventName, initiator, card),
        ),
    )
}

export const setupListeners = (server: Server) => {
    provider.on("block", async (blockNumber: number) => {
        console.log("Block:", blockNumber)

        requestVRFSentListener(server, blockNumber)
        requestVRFFulfilledListener(server, blockNumber)
        requestOAOSentListener(server, blockNumber)
        requestOAOFulfilled(server, blockNumber)
    })
}

const requestVRFSentListener = async (server: Server, blockNumber: number) => {
    const events = await generator.queryFilter(
        generator.filters.RequestVRFSent(),
        blockNumber,
        blockNumber,
    )

    events.forEach((event) => {
        const [initiator, requestId] = event.args
        console.log("RequestVRFSent", initiator, requestId)
        publishEventMessage(server, requestId, "RequestVRFSent", initiator)
    })
}

const requestVRFFulfilledListener = async (
    server: Server,
    blockNumber: number,
) => {
    const events = await generator.queryFilter(
        generator.filters.RequestVRFFulfilled(),
        blockNumber,
        blockNumber,
    )

    events.forEach((event) => {
        const [initiator, requestId] = event.args
        console.log("RequestVRFFulfilled", initiator, requestId)
        publishEventMessage(server, requestId, "RequestVRFFulfilled", initiator)
    })
}

const requestOAOSentListener = async (server: Server, blockNumber: number) => {
    const events = await generator.queryFilter(
        generator.filters.RequestOAOSent(),
        blockNumber,
        blockNumber,
    )

    for (const event of events) {
        const [initiator, requestId] = event.args
        console.log("RequestOAOSent", initiator, requestId)
        publishEventMessage(server, requestId, "RequestOAOSent", initiator)
    }
}

const requestOAOFulfilled = async (server: Server, blockNumber: number) => {
    const events = await generator.queryFilter(
        generator.filters.RequestOAOFulfilled(),
        blockNumber,
        blockNumber,
    )

    for (const event of events) {
        const [initiator, requestId] = event.args
        console.log("RequestOAOFulfilled", initiator, requestId)
        const tokenId = await generator.getTokenId(requestId)
        const properties = await collectionReadProxy.getProperties(tokenId)
        const card = propertiesToCard(tokenId, properties)
        publishEventMessage(
            server,
            requestId,
            "RequestOAOFulfilled",
            initiator,
            card,
        )
    }
}
