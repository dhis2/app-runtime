import React from 'react'

// eslint-disable-next-line react/prop-types
export const RenderCounter = ({ id, countsObj }) => {
    if (!(id in countsObj)) countsObj[id] = 0
    return <div data-testid={id}>{++countsObj[id]}</div>
}

export const resetRenderCounts = renderCounts =>
    Object.keys(renderCounts).forEach(key => (renderCounts[key] = 0))
