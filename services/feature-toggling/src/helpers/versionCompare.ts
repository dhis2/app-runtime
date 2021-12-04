export const parseVersionString = (v: string): (number | null)[] => {
    return v
        .split(/[.-]/g)
        .map(segment => parseInt(segment))
        .map(number => (isNaN(number) ? null : number))
}
export const versionCompare = (a: string, b: string) => {
    const parsedA = parseVersionString(a)
    const parsedB = parseVersionString(b)
    const maxLength = Math.max(parsedA.length, parsedB.length)
    let index = 0
    while (index < maxLength) {
        const aValue = parsedA[index] ?? null
        const bValue = parsedB[index] ?? null
        if (aValue !== bValue) {
            if (bValue === null || (aValue !== null && aValue > bValue)) {
                return 1
            }
            if (aValue === null || aValue < bValue) {
                return -1
            }
        }
        index += 1
    }
    return 0
}
