/**
 * @file NoteItem.js
 */
import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import NotesContext from '../Context/NotesContext'
import Note, { PropTypeNote } from '../Shared/noteType/Note'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

/**исправление переноса строки в markdown */
function fixLineBreaks(mdStr) {
    return String(mdStr).replace(/\n/gi, '  \n')
}

/**
 * Компонент заметки
 * @param {*} param0 
 *  
 */
function NoteItem({ note = new Note(), index }) {
    /**Подключение контекста */
    const { removeNote, setEditNote } = useContext(NotesContext)

    const lineClip = 12
    const bgColor = note.color

    return (
        <div className="p-1" >
            <div className="card" style={{ backgroundColor: bgColor }} >
                {/**Заголовок и текст заметки с обработчиками отображения markdown*/}
                <div className="card-body" onClick={() => setEditNote(index)} >
                    <div
                        className="card-title h5"
                        style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: String(lineClip / 2), WebkitBoxOrient: "vertical" }} >
                        <ReactMarkdown remarkPlugins={[gfm]} children={fixLineBreaks(note.name)} />
                    </div>
                    <div
                        className="card-text"
                        style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: String(lineClip), WebkitBoxOrient: "vertical" }}>
                        <ReactMarkdown remarkPlugins={[gfm]} children={fixLineBreaks(note.text)} />
                    </div>
                </div>
                {/**Кнопка удаления */}
                <div className="card-body pt-0">
                    <button
                        className={`btn btn-light p-0`}
                        style={{ width: "1.8em", height: "1.8em", float: "right", borderColor: "transparent", backgroundColor: "transparent" }}
                        onClick={() => removeNote(index)}
                    >
                        &#10007;
                    </button>
                </div>
            </div>
        </div>
    )
}

// Валидация
NoteItem.propTypes = {
    note: PropTypeNote.isRequired,
    index: PropTypes.number
}

export default NoteItem



