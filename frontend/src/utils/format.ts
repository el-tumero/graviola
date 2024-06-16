// Get percentage from BP value, e.g. (1499 = 1,499%, 28230 = 28,230%)
export function formatBpToPercentage(bp: number): number {
    let divisor = 10_000
    return bp / divisor
}
