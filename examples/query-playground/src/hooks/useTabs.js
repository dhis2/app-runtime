import { useState } from 'react'

export const useTabs = () => {
    const [tabs, setTabs] = useState([true])

    const setActiveTab = index =>
        setTabs(tabs.map((tab, curIndex) => curIndex === index))

    const addTab = () =>
        setTabs([
            ...Array.apply(null, Array(tabs.length)).map(() => false),
            true,
        ])

    return { tabs, setActiveTab, addTab }
}
