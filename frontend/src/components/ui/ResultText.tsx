import { RarityGroupData } from "../../types/Rarity"

const ResultText = (props: { rGroup: RarityGroupData }) => {
    return (
        <p className="text-lg font-bold">{`Congratulations! You rolled a `}
            <span style={{ color: props.rGroup.color }} className="font-bold underline">{(props.rGroup.name).toUpperCase()}!</span>
        </p>
    )
}

export default ResultText