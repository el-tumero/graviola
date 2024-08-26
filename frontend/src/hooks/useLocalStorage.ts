import { useEffect, useState } from "react"

type AvailableTypes = number | bigint | string

export default function useLocalStorage<T extends AvailableTypes>(
    key: string,
): [T | undefined, (newValue: T) => void, () => void] {
    const [value, setValue] = useState<T>()

    useEffect(() => {
        if (!value) {
            const data = localStorage.getItem(key)
            if (!data) return
            setValue(valueFromString<T>(data))
        }
    }, [value])

    function updateValue(newValue: T) {
        localStorage.setItem(key, valueToString(newValue))
        setValue(newValue)
    }

    function clearValue() {
        localStorage.removeItem(key)
        setValue(undefined)
    }

    return [value, updateValue, clearValue]
}

function valueFromString<T extends AvailableTypes>(data: string): T {
    switch (typeof data) {
        case "number":
            return Number(data) as T
        case "bigint":
            return BigInt(data) as T
        case "string":
            return data as T
        default:
            throw new Error("Unsupported type")
    }
}

function valueToString(data: AvailableTypes): string {
    switch (typeof data) {
        case "number":
            return data.toString()
        case "bigint":
            return data.toString()
        case "string":
            return data
        default:
            throw new Error("Unsupported type")
    }
}
