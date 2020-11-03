import React, { useState } from 'react'
import { useAlert } from '@dhis2/app-runtime'

const style = {
    backgroundColor: 'white',
    padding: 12,
    position: 'fixed',
    top: 10,
    left: 10,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 8,
}

export const Alerter = () => {
    const [message, setMessage] = useState('')
    const show = useAlert(message)

    return (
        <div style={style}>
            <input
                type="text"
                onChange={e => setMessage(e.target.value)}
                value={message}
            />
            <button type="button" onClick={show}>
                Show alert
            </button>
        </div>
    )
}
