import { useContext } from "react"
import { Tooltip as BaseTooltip } from "react-tooltip"
import { AppContext } from "../contexts/AppContext"
import { ITooltip } from "react-tooltip"
import tailwindColors from "../../tailwind.config"

const Tooltip = (props: ITooltip) => {

    const { theme, } = useContext(AppContext)

    const coreStyles = {
        fontSize: "0.75rem",
        lineHeight: "1rem",
        padding: "1rem"
    }

    const twPalette = tailwindColors.theme.extend.colors
    const darkStyles = {
        backgroundColor: twPalette.dark.bgPrimary,
        borderRadius: "0.25rem",
        color: twPalette.dark.text,
    }

    const lightStyles = {
        backgroundColor: twPalette.light.bgPrimary,
        borderRadius: "0.25rem",
        color: twPalette.light.text,
    }

    const themeStyles = {
        ...coreStyles,
        ...(theme === "dark") ? darkStyles : lightStyles
    }

    return (
        <BaseTooltip
            {...props}
            noArrow={true}
            border={`1px solid ${(theme === "dark")
                ? twPalette.dark.border
                : twPalette.light.border
                }`}
            style={{
                ...themeStyles,
                userSelect: "none",
                pointerEvents: "none",
                border: 0,
                zIndex: 100,
            }}
            opacity={1}
            className="shadow-md"
        />
    )
}

export default Tooltip