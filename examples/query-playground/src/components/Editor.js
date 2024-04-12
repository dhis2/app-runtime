import { json } from '@codemirror/lang-json'
import { githubLight } from '@uiw/codemirror-theme-github'
import { monokai } from '@uiw/codemirror-theme-monokai'
import CodeMirror from '@uiw/react-codemirror'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './Editor.module.css'

export const Editor = ({ theme, ...editorProps }) => (
    <CodeMirror
        className={styles.editor}
        extensions={[json()]}
        theme={theme === 'light' ? githubLight : monokai}
        width="100%"
        height="100%"
        {...editorProps}
    />
)
Editor.propTypes = {
    theme: PropTypes.oneOf(['light', 'dark']),
}
