/**
 * @file Note.js
 */
import PropTypes from 'prop-types'

/**валидация пропсов заметки*/
export const PropTypeNote = PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    color: PropTypes.string,
    text: PropTypes.string,
})

/**валидация заметки */
export function checkNote(note) {
    return (
        (typeof note.id === "string") &&
        typeof note.name === "string" &&
        typeof note.color === "string" &&
        typeof note.text === "string"
    )
}

/**валидация массива заметок */
export function checkNotesArr(notesArr) {
    if (!Array.isArray(notesArr)) return false
    else if (notesArr.length === 0) return true
    else {
        let res = true
        notesArr.forEach((note) => {
            if (typeof note !== "object") res = false
            else if (!checkNote(note)) res = false
        })
        return res
    }
}

/**класс заметки */
export class Note {
    constructor({ id, name, color, text }) {
        this.id = String(id)
        this.name = String(name)
        this.color = String(color)
        this.text = String(text)
    }
}

export default Note
