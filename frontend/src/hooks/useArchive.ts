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
        try {
            const groupSizes = await fetchGroupSizes()
            const weights = [12, 8, 5, 3, 1]

            const keywords =
                await seasonsArchiveContract.getKeywordsCurrentSeason()

            dispatch(setGroupSizes(groupSizes))
            dispatch(setWeights(weights.map((w) => Number(w))))
            dispatch(setKeywords(keywords))
        } catch (error) {
            console.error(error)
        }
    }

    return { weights, groupSizes, keywords, fetchArchive }
}