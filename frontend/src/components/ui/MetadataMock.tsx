import { clsx as cl } from "clsx"

export interface MetadataMockProperty {
    name: string
    val: string
    comment?: string
}

const MetadataMock = (props: { metadata: MetadataMockProperty[] }) => {
    return (
        <div className={cl("font-mono rounded-xl break-words", "bg-light-border/30 dark:bg-dark-border/30", "px-6 py-9")}>
            {"{"}
            {props.metadata.map((property: MetadataMockProperty, idx: number) => (
                <div className="ml-6" key={idx}>
                    <p>
                        <span className="font-semibold text-violet-600">
                            "{property.name}": <span className="text-sky-600 dark:text-sky-300">"{property.val}" </span>
                        </span>
                        {property.comment && <span className="font-thin text-stone-500">{`// ${property.comment}`}</span>}
                    </p>
                </div>
            ))}
            {"}"}
        </div>
    )
}

export default MetadataMock
