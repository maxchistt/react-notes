/**
 * @file NoteCheck.js file
 * @breif validation of note
 */
/**
 * Проверка рбьекта заметки
 * @param {*} note 
 *  
 */
function checkNote(note) {
    return (
        typeof note.id === "string" &&
        typeof note.name === "string" &&
        typeof note.color === "string" &&
        typeof note.text === "string"
    )
}

module.exports = { checkNote }