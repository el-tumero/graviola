import { clsx as cl } from "clsx"

export interface NavElementProps {
    children: React.ReactNode
    onClick?: () => void
}

const NavElement = ({ children, onClick }: NavElementProps) => {
    return (
        <div
            className={cl(
                "p-2 rounded-xl opacity-80 cursor-pointer",
                "hover:opacity-100 hover:cursor-pointer",
                "max-lg:flex max-lg:justify-center max-lg:w-full",
                "max-lg:bg-light-border/75 max-lg:dark:bg-dark-border/75",
                "hover:bg-light-border/20 dark:hover-bg-dark-border/20",
                "transition-colors duration-300",
            )}
            onClick={onClick}
        >
            {children}
        </div>
    )
}

export default NavElement
