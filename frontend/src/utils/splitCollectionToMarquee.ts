import { NFT } from "../types/NFT";

export function splitCollectionToMarquee(array: NFT[]) {
    const ratios = [3, 5, 2]
    const totalLength = array.length;
    const totalProportions = ratios.reduce((a, b) => a + b, 0);

    let remainingLength = totalLength;
    const lengths = ratios.map((p) => {
        const length = Math.floor((p / totalProportions) * totalLength);
        remainingLength -= length;
        return length;
    });

    // Adjust the last part to account for any rounding issues
    lengths[lengths.length - 1] += remainingLength;

    let startIndex = 0;
    return lengths.map((length) => {
        const part = array.slice(startIndex, startIndex + length);
        startIndex += length;
        return part;
    });
}