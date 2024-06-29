import { NFT } from "../types/NFT"
import { RarityLevel } from "../types/Rarity"

// main fallbackNFT
export const fallbackNFT: NFT = {
    id: 9999,
    image: "QmSmZ7GBc3TssiZnZRazxCBSeenL2iSYmfQtNELGLCfg9d",
    description: "This is a fallback NFT image.",
    attributes: [
        {
            trait_type: "Rarity",
            value: 1,
        },
    ],
}

export const nftRarityScaleArr: NFT[] = [
    {
        id: 9995,
        image: "QmSmZ7GBc3TssiZnZRazxCBSeenL2iSYmfQtNELGLCfg9d",
        description: "Fallback COMMON NFT image.",
        attributes: [
            {
                trait_type: "Rarity",
                value: 600000,
            },
        ],
    },
    {
        id: 9996,
        image: "QmSmZ7GBc3TssiZnZRazxCBSeenL2iSYmfQtNELGLCfg9d",
        description: "Fallback UNCOMMON NFT image.",
        attributes: [
            {
                trait_type: "Rarity",
                value: 120000,
            },
        ],
    },
    {
        id: 9997,
        image: "QmSmZ7GBc3TssiZnZRazxCBSeenL2iSYmfQtNELGLCfg9d",
        description: "Fallback RARE NFT image.",
        attributes: [
            {
                trait_type: "Rarity",
                value: 45000,
            },
        ],
    },
    {
        id: 9998,
        image: "QmSmZ7GBc3TssiZnZRazxCBSeenL2iSYmfQtNELGLCfg9d",
        description: "Fallback VERY RARE NFT image.",
        attributes: [
            {
                trait_type: "Rarity",
                value: 22000,
            },
        ],
    },
    fallbackNFT // Legendary
]

export const fallbackNFTRarityLevel = RarityLevel.Legendary
