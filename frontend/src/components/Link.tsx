
interface LinkProps {
    text: string
    href: string
    openInNewTab?: boolean
    additionalClasses?: string
}

const Link = ({ text, href, openInNewTab, additionalClasses }: LinkProps) => {
    return (
        <a target={openInNewTab ? "_blank" : ""} href={href} rel={openInNewTab ? "noopener noreferrer" : ""}>
            <p className={`hover:underline ${additionalClasses}`}>{text}</p>
        </a>
    )
}

export default Link