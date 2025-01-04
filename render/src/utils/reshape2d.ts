export const reshape2d = <T>(arr: T[], rowSize: number) => {
    if (arr.length % rowSize !== 0)
        throw new Error("Array length must be divisible by row size")
    const output: T[][] = []
    const copy = [...arr]
    while (copy.length) output.push(copy.splice(0, rowSize))
    return output
}
