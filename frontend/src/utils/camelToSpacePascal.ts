export default function camelToSpacePascal(text: string) {
    return text.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
        return str.toUpperCase()
    })
}
