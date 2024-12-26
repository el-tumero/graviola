export const descriptionToKeywords = (description: string): string[] => {
    return description.slice(130).trim().split(",")
}
