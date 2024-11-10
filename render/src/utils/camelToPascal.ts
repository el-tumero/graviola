export default function camelToPascal(
    text: string,
    spaces: boolean = true,
): string {
    if (spaces) {
        return text
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
    } else {
        return text.replace(/^./, (str) => str.toUpperCase())
    }
}
