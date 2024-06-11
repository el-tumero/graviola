import { Fragment } from "react"
import { clsx as cl } from "clsx"

const NavList = (props: {
    navItems: React.ReactNode[]
    mobileStyles: boolean
}) => {
    const desktopStyles = cl("flex justify-center items-center gap-3")
    const mobileStyles = cl("flex flex-col items-center", "w-full gap-3 p-3")
    return (
        <div className={props.mobileStyles ? mobileStyles : desktopStyles}>
            {props.navItems.map((item, i) => {
                return <Fragment key={i}>{item}</Fragment>
            })}
            <w3m-button />
        </div>
    )
}

export default NavList
