export const DeployedContractEnum = {
    VRF: 0,
    OAO: 1,
    TOKEN: 2,
    COLLECTION: 3,
    SEASONS_ARCHIVE: 4,
    SEASONS_GOVERNOR: 5,
    GENERATOR: 6,
    COLLECTION_READ_PROXY: 7,
    MIGRATOR: 8,
}

export const DeployedContractAddressEnum = {
    VRF_ADDRESS: 0,
    OAO_ADDRESS: 1,
    TOKEN_ADDRESS: 2,
    COLLECTION_ADDRESS: 3,
    SEASONS_ARCHIVE_ADDRESS: 4,
    SEASONS_GOVERNOR_ADDRESS: 5,
    GENERATOR_ADDRESS: 6,
    COLLECTION_READ_PROXY_ADDRESS: 7,
    MIGRATOR_ADDRESS: 8,
}

export type DeployedContractAddressData = Record<
    keyof typeof DeployedContractAddressEnum,
    string
>
