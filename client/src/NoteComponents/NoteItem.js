/**
 * @file NoteItem.js
 */
import React, { useContext } from 'react'
import NotesContext from '../Context/NotesContext'
import { PropTypeNote } from '../Shared/Validation/Note'
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
function NoteItem({ note }) {
    /**Подключение контекста */
    const { setEditNoteId, editNoteOrder } = useContext(NotesContext)

    const lineClip = 12
    const bgColor = note.color

    const footerBtn = {
        className: `btn btn-light p-0 text-secondary item-footer-btn`,
        style: {
            width: "1.8em", height: "1.8em", float: "right",
            borderColor: "transparent",
            backgroundColor: "transparent",
            boxShadow: "none"
        }
    }

    return (
        <div className="p-1" >
            <div className="card" style={{ backgroundColor: bgColor }} >
                {/**Заголовок и текст заметки с обработчиками отображения markdown*/}
                <div className="card-body" onClick={() => setEditNoteId(note.id)} >
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
                {/**Кнопки изменения порядка */}
                <div className="card-body pt-0">
                    <button
                        className={footerBtn.className}
                        style={footerBtn.style}
                        onClick={() => editNoteOrder(note.id, false)}
                    >
                        <i className="bi bi-chevron-compact-right"></i>
                    </button>
                    <button
                        className={footerBtn.className}
                        style={footerBtn.style}
                        onClick={() => editNoteOrder(note.id, true)}
                    >
                        <i className="bi bi-chevron-compact-left"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

// Валидация
NoteItem.propTypes = {
    note: PropTypeNote.isRequired
}

export default NoteItem



