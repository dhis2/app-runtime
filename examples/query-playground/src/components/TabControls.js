import { PropTypes } from '@dhis2/prop-types'
import {
    Button,
    ButtonStrip,
    InputField,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    TabBar,
    Tab,
} from '@dhis2/ui'
import React, { useState } from 'react'
import styles from './TabControls.module.css'

const TabControl = ({
    active,
    edit,
    index,
    onClick,
    onEditClick,
    onEditDoneClick,
}) => {
    const [name, setName] = useState(`Tab ${index}`)
    const [editName, setEditName] = useState(name)

    const save = () => {
        setName(editName)
        onEditDoneClick()
    }

    const cancel = () => {
        setEditName(name)
        onEditDoneClick()
    }

    const onEditIconClick = event => {
        event.stopPropagation()
        onEditClick()
    }

    return (
        <Tab selected={active} key={index} onClick={onClick}>
            <>
                {`${name} `}
                <span onClick={onEditIconClick} className={styles.editButton}>
                    edit
                </span>

                {edit && (
                    <div onClick={e => e.stopPropagation()}>
                        <Modal>
                            <form onSubmit={save}>
                                <ModalTitle>Edit tab name</ModalTitle>
                                <ModalContent>
                                    <InputField
                                        initialFocus
                                        name="tab-name"
                                        value={editName}
                                        onChange={({ value }) =>
                                            setEditName(value)
                                        }
                                    />
                                </ModalContent>
                                <ModalActions>
                                    <ButtonStrip>
                                        <Button primary type="submit">
                                            Save
                                        </Button>

                                        <Button onClick={cancel}>Cancel</Button>
                                    </ButtonStrip>
                                </ModalActions>
                            </form>
                        </Modal>
                    </div>
                )}
            </>
        </Tab>
    )
}

TabControl.propTypes = {
    active: PropTypes.bool.isRequired,
    edit: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    onEditClick: PropTypes.func.isRequired,
    onEditDoneClick: PropTypes.func.isRequired,
}

export const TabControls = ({ tabs, onAddTab, onTabClick }) => {
    const [edit, setEdit] = useState(-1)

    return (
        <TabBar>
            {tabs.map((active, index) => (
                <TabControl
                    active={active}
                    index={index}
                    key={index}
                    edit={index === edit}
                    onClick={() => onTabClick(index)}
                    onEditClick={() => setEdit(index)}
                    onEditDoneClick={() => setEdit(-1)}
                />
            ))}

            <Tab onClick={onAddTab}>+ (add tab)</Tab>
        </TabBar>
    )
}

TabControls.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.bool).isRequired,
    onAddTab: PropTypes.func.isRequired,
    onTabClick: PropTypes.func.isRequired,
}
