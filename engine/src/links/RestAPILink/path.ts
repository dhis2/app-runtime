export const joinPath = (...parts: (string | undefined | null)[]): string => {
    const realParts = parts.filter((part) => !!part) as string[]
    return realParts
        .map((part) => part.replace(/(^\/+)|(\/+$)/g, '')) // Replace leading and trailing slashes for each part
        .join('/')
}
