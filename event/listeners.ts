import type { Server } from "bun"
import {
    GraviolaGenerator__factory,
    GraviolaCollectionReadProxy__factory,
    addresses,
    type GraviolaGenerator,
    type GraviolaCollectionReadProxy,
} from "@graviola/contracts"

import { GENERATION_TOPIC } from "./index"
import {
    type SupportedEvents,
    type Card,
    propertiesToCard,
} from "@graviola/core"
import { createEventMessage } from "./message"
import { JsonRpcProvider, Log } from "ethers"

const rpcUrl = "http://127.0.0.1:8545/"

const LOGS_QUERY_INTERVAL = 5000

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

type GeneratorEvent = {
    name: string
    initiator: string
    requestId: bigint
}

export const setup = async (server: Server) => {
    const provider = new JsonRpcProvider(rpcUrl)
    let lastBlockNumber = await provider.getBlockNumber()

    const generator = GraviolaGenerator__factory.connect(
        addresses.local.GENERATOR_ADDRESS,
        provider,
    )

    const collectionReadProxy = GraviolaCollectionReadProxy__factory.connect(
        addresses.local.COLLECTION_READ_PROXY_ADDRESS,
        provider,
    )

    const topics = [
        [
            generator.filters.RequestVRFSent().fragment.topicHash,
            generator.filters.RequestVRFFulfilled().fragment.topicHash,
            generator.filters.RequestOAOSent().fragment.topicHash,
            generator.filters.RequestOAOFulfilled().fragment.topicHash,
        ],
    ]

    setInterval(async () => {
        const currentBlockNumber = await provider.getBlockNumber()
        if (currentBlockNumber > lastBlockNumber) {
            const filter = {
                address: addresses.local.GENERATOR_ADDRESS,
                topics,
                fromBlock: lastBlockNumber + 1,
                toBlock: currentBlockNumber,
            }

            const logs = await provider.getLogs(filter)
            if (logs.length > 0) {
                const events = logsToEvents(logs, generator)
                handleEvents(server, events, generator, collectionReadProxy)
            }

            lastBlockNumber = currentBlockNumber
        }
    }, LOGS_QUERY_INTERVAL)
}

const logsToEvents = (
    logs: Log[],
    generator: GraviolaGenerator,
): GeneratorEvent[] => {
    const events: GeneratorEvent[] = []
    for (const log of logs) {
        const parsed = generator.interface.parseLog(log)
        if (!parsed) {
            continue
        }

        const [initiator, requestId] = parsed.args
        events.push({
            name: parsed.name,
            initiator,
            requestId,
        })
    }
    return events
}

const handleEvents = (
    server: Server,
    events: GeneratorEvent[],
    generator: GraviolaGenerator,
    collection: GraviolaCollectionReadProxy,
) => {
    events.forEach((event) => {
        const { name, initiator, requestId } = event
        switch (event.name) {
            case "RequestVRFSent":
                console.log("RequestVRFSent", event.initiator, event.requestId)
                publishEventMessage(
                    server,
                    requestId,
                    "RequestVRFSent",
                    initiator,
                )
                break
            case "RequestVRFFulfilled":
                console.log(
                    "RequestVRFFulfilled",
                    event.initiator,
                    event.requestId,
                )
                publishEventMessage(
                    server,
                    requestId,
                    "RequestVRFFulfilled",
                    initiator,
                )
                break
            case "RequestOAOSent":
                console.log("RequestOAOSent", event.initiator, event.requestId)
                publishEventMessage(
                    server,
                    requestId,
                    "RequestOAOSent",
                    initiator,
                )
                break
            case "RequestOAOFulfilled":
                requestOAOFulfilled(
                    server,
                    initiator,
                    requestId,
                    generator,
                    collection,
                )
                break
        }
    })
}

const requestOAOFulfilled = async (
    server: Server,
    initiator: string,
    requestId: bigint,
    generator: GraviolaGenerator,
    collectionReadProxy: GraviolaCollectionReadProxy,
) => {
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
