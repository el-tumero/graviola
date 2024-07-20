/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_DEV_RPC: string
    VITE_DEV_PROVIDER: string
    VITE_DEV_GRAVIOLA_ADDRESS: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}