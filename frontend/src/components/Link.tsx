import { cn } from "../utils/cn"

interface LinkProps {
    text: string
    href: string
    openInNewTab?: boolean
    additionalClasses?: string
}

const Link = ({ text, href, openInNewTab, additionalClasses }: LinkProps) => {
    return (
        <a
            className="flex w-min"
            target={openInNewTab ? "_blank" : ""}
            href={href}
            rel={openInNewTab ? "noopener noreferrer" : ""}
            tabIndex={0}
        >
            <p className={cn("hover:underline hover:cursor-pointer", additionalClasses)}>{text}</p>
        </a>
    )
}

export default Link
