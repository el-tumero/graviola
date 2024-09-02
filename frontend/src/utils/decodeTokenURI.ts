import { RawNFTData } from "../types/NFT"

export function decodeTokenURI(uri:string):RawNFTData {
    const withoutHeader = uri.slice(29)
    const raw = Buffer.from(withoutHeader, 'base64').toString()
    return JSON.parse(raw)
}