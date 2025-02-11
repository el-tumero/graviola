const enumConverter = (code: string) => {
    const enumRegex = /enum\s+(\w+)\s*{([^}]*)}/
    const match = code.match(enumRegex)

    if (match) {
        const enumName = match[1]
        const enumBody = match[2]

        const enumValues = enumBody
            .replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '')
            .replace(/\s+/g, '')
            .split(',')

        return {
            enumName: enumName,
            enumData: Object.fromEntries(
                enumValues.map((value, index) => [value, index]),
            ),
        }
    } else {
        console.error('No enum found in the Solidity file.')
    }
}

export default enumConverter
