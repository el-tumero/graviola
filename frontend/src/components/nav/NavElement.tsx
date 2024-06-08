import { clsx as cl } from "clsx"

export interface NavElementProps {
    children: React.ReactNode
    onClick?: () => void
}

const NavElement = ({ children, onClick }: NavElementProps) => {
    return (
        <div
            className={cl(
                "p-2 rounded-xl",
                "max-lg:flex max-lg:justify-center max-lg:w-full",
                "max-lg:bg-light-border max-lg:dark:bg-dark-border/40",
            )}
            onClick={onClick}
        >
            {children}
        </div>
    )
}

export default NavElement