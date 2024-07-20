import { CandidateInfo } from "../pages/Voting"

type CompareSortType = "Ascending" | "Descending"

// Compare functions for candidate sorting (Voting page)
export const compareById = (a: CandidateInfo, b: CandidateInfo) => a.id - b.id
export const compareByScore = (t: CompareSortType) => (a: CandidateInfo, b: CandidateInfo) => (t === "Ascending") ? a.score - b.score : b.score - a.score
export const compareAlphabetically = (t: CompareSortType) => (a: CandidateInfo, b: CandidateInfo) => (t === "Ascending") ? a.keyword.localeCompare(b.keyword) : b.keyword.localeCompare(a.keyword)