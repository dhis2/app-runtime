const RESOURCES_EXPECTING_TEXT_PLAIN_POSTS: Array<string | RegExp> = [
    'messageConversations/feedback',
    /^messageConversations\/[a-zA-Z0-9]{11}\/priority$/,
]

export const contentTypeForResource = (resource: string) => {
    const isResourceExpectingPlainText = RESOURCES_EXPECTING_TEXT_PLAIN_POSTS.some(
        textPlainResource =>
            textPlainResource instanceof RegExp
                ? textPlainResource.test(resource)
                : textPlainResource === resource
    )

    return isResourceExpectingPlainText ? 'text/plain' : 'application/json'
}
