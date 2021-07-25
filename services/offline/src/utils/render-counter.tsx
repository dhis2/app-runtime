import React from 'react'

interface RenderCounts {
    [index: string]: number
}

export const RenderCounter = ({
    id,
    countsObj,
}: {
    id: string
    countsObj: RenderCounts
}): JSX.Element => {
    if (!(id in countsObj)) countsObj[id] = 0
    return <div data-testid={id}>{++countsObj[id]}</div>
}

export const resetRenderCounts = (renderCounts: RenderCounts): void =>
    Object.keys(renderCounts).forEach(key => (renderCounts[key] = 0))
