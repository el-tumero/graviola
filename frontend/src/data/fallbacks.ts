import { NFT } from "../types/NFT"

// main fallbackNFT
export const fallbackNFTProbabilityLevel = "legendary"
export const fallbackNFT: NFT = {
    id: 99999,
    image: "QmSmZ7GBc3TssiZnZRazxCBSeenL2iSYmfQtNELGLCfg9d",
    description: "This is a fallback NFT image.",
    rarityGroup: "legendary",
    seasonId: 0,
    probability: 1000,
    attributes: [
        {
            trait_type: "Score",
            value: 36,
        },
        {
            trait_type: "Probability",
            value: 1000,
        },
    ],
}

export const fallbackNFTsRarityList: NFT[] = [
    {
        id: 9995,
        image: "QmNjGp4AKSoooj4YAdknye1RuWE3whGETa4h9VKZ13fVu5",
        description: "Fallback COMMON NFT image.",
        rarityGroup: "common",
        seasonId: 0,
        probability: 600000,
        attributes: [
            {
                trait_type: "Score",
                value: 3,
            },
            {
                trait_type: "Probability",
                value: 600000,
            },
        ],
    },
    {
        id: 9996,
        image: "QmS6Fp3nXyXhAYzGNwVBEfegtiPQLPnSn4dhCyemaaR4Fc",
        description: "Fallback UNCOMMON NFT image.",
        rarityGroup: "uncommon",
        seasonId: 0,
        probability: 120000,
        attributes: [
            {
                trait_type: "Score",
                value: 7,
            },
            {
                trait_type: "Probability",
                value: 120000,
            },
        ],
    },
    {
        id: 9997,
        image: "QmXjxcyEjt9WayCAasfh1gsWN8XFXDPZmm3BZyGY2RJAJ8",
        description: "Fallback RARE NFT image.",
        rarityGroup: "rare",
        seasonId: 0,
        probability: 30967,
        attributes: [
            {
                trait_type: "Score",
                value: 18,
            },
            {
                trait_type: "Probability",
                value: 30967,
            },
        ],
    },
    {
        id: 9998,
        image: "QmattqkasNWK55V84B5162sbjHh4whRefHjuY4w892dn3o",
        description: "Fallback VERY RARE NFT image.",
        rarityGroup: "veryRare",
        seasonId: 0,
        probability: 15460,
        attributes: [
            {
                trait_type: "Score",
                value: 25,
            },
            {
                trait_type: "Probability",
                value: 15460,
            },
        ],
    },
    {
        id: 9999,
        image: "QmZYffseN7YhEa3AukpjohJWhWeBG6mJ2YBF8QYgf6sU7h",
        rarityGroup: "legendary",
        description: "Fallback LEGENDARY NFT image.",
        seasonId: 0,
        probability: 2500,
        attributes: [
            {
                trait_type: "Score",
                value: 36,
            },
            {
                trait_type: "Probability",
                value: 2500,
            },
        ],
    },
]
