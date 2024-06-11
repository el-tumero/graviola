import { cn } from "../../utils/cn"

const NavItemText = (props: { text: string; additionalClasses?: string }) => (
    <span
        className={cn(
            "cursor-pointer opacity-80 hover:opacity-100",
            props.additionalClasses,
        )}
    >
        {props.text}
    </span>
)

export default NavItemText
