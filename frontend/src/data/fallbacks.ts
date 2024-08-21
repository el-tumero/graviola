import { NFT } from "../types/NFT"

// main fallbackNFT
export const fallbackNFTRarityLevel = "legendary"
export const fallbackNFT: NFT = {
    id: 99999,
    image: "QmSmZ7GBc3TssiZnZRazxCBSeenL2iSYmfQtNELGLCfg9d",
    description: "This is a fallback NFT image.",
    rarityGroup: "legendary",
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
        image: "QmNjGp4AKSoooj4YAdknye1RuWE3whGETa4h9VKZ13fVu5",
        description: "Fallback COMMON NFT image.",
        rarityGroup: "common",
        attributes: [
            {
                trait_type: "Rarity",
                value: 600000,
            },
        ],
    },
    {
        id: 9996,
        image: "QmS6Fp3nXyXhAYzGNwVBEfegtiPQLPnSn4dhCyemaaR4Fc",
        description: "Fallback UNCOMMON NFT image.",
        rarityGroup: "uncommon",
        attributes: [
            {
                trait_type: "Rarity",
                value: 120000,
            },
        ],
    },
    {
        id: 9997,
        image: "QmXjxcyEjt9WayCAasfh1gsWN8XFXDPZmm3BZyGY2RJAJ8",
        description: "Fallback RARE NFT image.",
        rarityGroup: "rare",
        attributes: [
            {
                trait_type: "Rarity",
                value: 30967,
            },
        ],
    },
    {
        id: 9998,
        image: "QmattqkasNWK55V84B5162sbjHh4whRefHjuY4w892dn3o",
        rarityGroup: "veryRare",
        description: "Fallback VERY RARE NFT image.",
        attributes: [
            {
                trait_type: "Rarity",
                value: 15460,
            },
        ],
    },
    {
        id: 9999,
        image: "QmZYffseN7YhEa3AukpjohJWhWeBG6mJ2YBF8QYgf6sU7h",
        rarityGroup: "legendary",
        description: "Fallback LEGENDARY NFT image.",
        attributes: [
            {
                trait_type: "Rarity",
                value: 2500,
            },
        ],
    },
]
