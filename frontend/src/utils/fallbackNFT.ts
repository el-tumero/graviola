import { NFT } from "../types/NFT";
import { RarityLevel } from "../types/Rarity";

export const fallbackNFT: NFT = {
    image: "QmSmZ7GBc3TssiZnZRazxCBSeenL2iSYmfQtNELGLCfg9d",
    description: "This is a fallback NFT image.",
    attributes: [{
        "trait_type": "Rarity",
        "value": 0.01
    }]
}

export const fallbackNFTRarity = RarityLevel.Legendary