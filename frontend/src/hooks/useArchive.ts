import { useAppSelector } from "../redux/hooks"
import { fetchGroupSizes, seasonsArchiveContract } from "../web3"
import { useAppDispatch } from "../redux/hooks"
import {
    setGroupSizes,
    setWeights,
    setKeywords,
} from "../redux/reducers/graviola"

export default function useArchive() {
    const weights = useAppSelector((state) => state.graviolaData.weights)
    const groupSizes = useAppSelector((state) => state.graviolaData.groupSizes)
    const keywords = useAppSelector((state) => state.graviolaData.keywords)

    const dispatch = useAppDispatch()

    async function fetchArchive() {
        const groupSizes = await fetchGroupSizes()
        const weights = await seasonsArchiveContract.getGroupWeights()
        const keywords = await seasonsArchiveContract.getKeywordsCurrentSeason()

        dispatch(setGroupSizes(groupSizes.reverse()))
        dispatch(setWeights(weights.map((w) => Number(w)).reverse()))
        dispatch(setKeywords(keywords))
    }

    return { weights, groupSizes, keywords, fetchArchive }
}
