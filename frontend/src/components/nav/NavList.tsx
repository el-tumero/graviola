import { Fragment } from "react"
import { clsx as cl } from "clsx"

const NavListDesktop = (props: { navItems: React.ReactNode[] }) => {
    return (
        <div
            className={cl("flex justify-center items-center gap-4")}>
            {props.navItems.map((item, i) => {
                return (
                    <Fragment key={i}>
                        {item}
                    </Fragment>
                )
            })}
            <w3m-button />
        </div>
    )
}

export default NavListDesktop