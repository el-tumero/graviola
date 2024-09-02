

/*
* Encode keyword candidate to contract-readable uint256 representation
*/
export const encodeKeyword = (keyword: string) => {
    let res = 0
    const bytes = new TextEncoder().encode(keyword)
    for (let i = 0; i < bytes.length; i++ ) {
        res += (bytes[i] * (256 ** (bytes.length - (i+1))))
    }
    return res
}