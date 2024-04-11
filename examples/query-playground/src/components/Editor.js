import { json } from '@codemirror/lang-json'
import { githubLight } from '@uiw/codemirror-theme-github'
import { monokai } from '@uiw/codemirror-theme-monokai'
import CodeMirror from '@uiw/react-codemirror'
import PropTypes from 'prop-types'
import React from 'react'
import AceEditor from 'react-ace'
import styles from './Editor.module.css'

import 'brace/mode/json'
import 'brace/theme/monokai'
import 'brace/theme/github'
import './Editor.css'

export const Editor = ({ theme, ...editorProps }) => (
    <CodeMirror
        className={styles.editor}
        extensions={[json()]}
        width="100%"
        height="100%"
        theme={theme === 'light' ? githubLight : monokai}
        {...editorProps}
    />
)
Editor.propTypes = {
    theme: PropTypes.oneOf(['light', 'dark']),
}

export const Editor_Old = (props) => (
    <AceEditor
        fontSize={14}
        mode="json"
        theme="github"
        editorProps={{ $blockScrolling: true }}
        showPrintMargin={false}
        width="100%"
        height="100%"
        {...props}
    />
)
