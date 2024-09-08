export function hasKey<T>(obj: T, key: PropertyKey): key is keyof T {
    if (!obj || typeof obj !== "object") {
        return false
    }
    return key in obj
}
