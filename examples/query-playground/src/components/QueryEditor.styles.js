import css from 'styled-jsx/css'

export default css.global`
    .editor {
        width: 50%;
        display: flex;
        flex-direction: column;
    }
    .controls {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 8px;
        align-items: center;
    }

    .controls .group-label {
        display: none;
    }
    .error {
        padding: 8px;
        color: white;
        background-color: darkred;
        width: 100%;
        text-align: center;
    }
`
