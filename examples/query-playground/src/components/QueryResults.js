import React, { useState, useEffect } from 'react'
import styles from './QueryResults.styles'
import { Editor } from './Editor'

export const QueryResults = ({ result }) => {
    return (
        <div className="results">
            <style jsx>{styles}</style>
            <Editor
                value={result}
                theme="github"
                readOnly={true}
                name="results"
                placeholder="Results will appear here..."
            />
        </div>
    )
}
