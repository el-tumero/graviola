export interface SvgIconData {
    style: string
    viewBox: string
    pathD: string
}

const SvgIcon = ({ style, viewBox, pathD }: SvgIconData) => {
    return (
        <svg className={style} viewBox={viewBox}>
            <path fillRule="evenodd" clipRule="evenodd" d={pathD} />
        </svg>
    )
}

export default SvgIcon