/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_DEV_RPC: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}