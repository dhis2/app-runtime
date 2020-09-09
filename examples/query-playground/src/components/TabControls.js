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
    isOnly,
    name,
    onClick,
    onEditClick,
    onEditDoneClick,
    onNameChange,
    onRemoveTab,
}) => {
    const [editName, setEditName] = useState(name)

    const save = () => {
        onNameChange(editName)
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

    const onRemoveIconClick = event => {
        event.stopPropagation()
        onRemoveTab()
    }

    return (
        <Tab selected={active} key={index} onClick={onClick}>
            <>
                {`${name} `}

                <span onClick={onEditIconClick} className={styles.editButton}>
                    edit
                </span>

                {!isOnly && (
                    <span
                        onClick={onRemoveIconClick}
                        className={styles.editButton}
                    >
                        x
                    </span>
                )}

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
    isOnly: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    onEditClick: PropTypes.func.isRequired,
    onEditDoneClick: PropTypes.func.isRequired,
    onNameChange: PropTypes.func.isRequired,
    onRemoveTab: PropTypes.func.isRequired,
}

export const TabControls = ({
    tabs,
    onAddTab,
    onRemoveTab,
    onTabClick,
    onNameChange,
}) => {
    const [edit, setEdit] = useState(-1)

    return (
        <TabBar>
            {tabs.map(({ active, id, name }, index) => (
                <TabControl
                    key={id}
                    active={active}
                    edit={index === edit}
                    index={index}
                    isOnly={tabs.length === 1}
                    name={name}
                    onNameChange={onNameChange(index)}
                    onClick={() => onTabClick(index)}
                    onEditClick={() => setEdit(index)}
                    onEditDoneClick={() => setEdit(-1)}
                    onRemoveTab={() => onRemoveTab(index)}
                />
            ))}

            <Tab onClick={onAddTab}>+ (add tab)</Tab>
        </TabBar>
    )
}

TabControls.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            active: PropTypes.bool.isRequired,
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    onAddTab: PropTypes.func.isRequired,
    onNameChange: PropTypes.func.isRequired,
    onRemoveTab: PropTypes.func.isRequired,
    onTabClick: PropTypes.func.isRequired,
}
