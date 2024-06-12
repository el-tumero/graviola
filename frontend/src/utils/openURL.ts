
export const openURL = (url: string, newTab: boolean = false) => {
    if (newTab) {
        window.open(
            url,
            "_blank",
            "noopener,noreferrer",
        )
        return
    }
    window.open(url)
}