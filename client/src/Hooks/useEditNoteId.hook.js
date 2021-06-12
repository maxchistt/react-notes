/** @file useDebouncedEffect.hook.js */
import React from 'react'

/**
 * Хук id редактируемой заметки 
 */
function useEditNoteId() {
    /**Id редактируемой заметки */
    const [editNoteId, setEditNoteId] = React.useState(null)

    /**функция сброса редактируемой заметки для модального окна */
    function unsetEditNoteId() {
        setEditNoteId(null)
    }

    return { editNoteId, setEditNoteId, unsetEditNoteId }
}

export default useEditNoteId