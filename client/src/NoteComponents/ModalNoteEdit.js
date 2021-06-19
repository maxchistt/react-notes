/**
 * @file ModalNoteEdit.js
 */
import React from 'react'
import NotesContext from '../Context/NotesContext'
import TextareaAutosize from 'react-textarea-autosize'
import Modal, { ModalProps } from "../Shared/Components/Modal/Modal"
import Palette from './palette/palette'
import Media from './media/media'

/**расчет числа строк */
function calcMaxRows() {
    const small = 576
    const middle = 768
    const large = 992
    const winWidth = window.innerWidth

    if (winWidth < small) return '7'
    else if (winWidth < middle) return '8'
    else if (winWidth < large) return '10'
    else return '17'
}

/**
 * Модальное окно редактирования заметки
 */
function ModalNoteEdit() {
    /**получение контекста */
    const { removeNote, changeNoteColor, unsetEditNoteId, editNoteMedia, editNoteContent, getNoteById, editNoteId } = React.useContext(NotesContext)

    /** обьект заметки */
    const note = getNoteById(editNoteId)
    React.useEffect(() => { if (note !== null) open() }, [note])

    /**хук состояния формы */
    const [showForm, setShowForm] = React.useState(false)

    /**создание параметров модального окна*/
    const modalProps = new ModalProps()
    modalProps.isOpen = showForm
    modalProps.setOpenState = setShowForm
    modalProps.sideClose = true
    modalProps.onSideClick = unsetEditNoteId

    /**открытие окна */
    function open() {
        setShowForm(true)
    }

    /**закрытие окна */
    function close() {
        setShowForm(false)
    }

    /**сохранение данных */
    function save(name, text) {
        editNoteContent(editNoteId, name, text)
    }

    /**
     * обраюотчик изменений инпута
     * @param {*} e 
     */
    function onInputChange(e) {
        let name = note.name
        let text = note.text
        if (e.target.id === "modal-edit-name") name = e.target.value
        if (e.target.id === "modal-edit-text") text = e.target.value
        save(name, text)
    }

    /**
     * Изменение цвета
     * @param {*} color 
     */
    function tryChangeColor(color) {
        changeNoteColor(editNoteId, color)
    }

    /**
     * Изменение медиа заметки
     * @param {*} media 
     */
    function trySetNoteMedia(media) {
        editNoteMedia(editNoteId, media)
    }

    /**
     * удаление
     */
    function tryRemove() {
        unsetEditNoteId();
        close();
        removeNote(editNoteId);
    }

    /**
     * закрытие и сброс окна
     */
    function tryClose() {
        unsetEditNoteId()
        close()
    }

    const sizeRef = React.useRef()

    /**рендер */
    return (
        <Modal {...modalProps.bind()}>
            <div ref={sizeRef} className="container p-2">
                {/**Блок редактирования контента */}
                <div>
                    {note ? (
                        <React.Fragment>
                            {/**Редактирование заголовка */}
                            <TextareaAutosize
                                className="form-control form-control-lg p-0 mb-2 bg-light text-dark"
                                id="modal-edit-name"
                                style={{ color: "black", fontWeight: "600", fontSize: 'x-large', border: "none", outline: "none", boxShadow: "none", resize: "none" }}
                                minRows={1}
                                maxRows={3}
                                maxLength="100"
                                value={note.name}
                                onChange={onInputChange}
                            />
                            {/**Индикатор цвета заметки */}
                            <p style={{ fontWeight: "500" }} className="mb-2 text-dark">
                                Color:
                                <span className={`m-1 d-inline-block text-center badge border border-secondary`} style={{ width: "3em", backgroundColor: note.color }}>
                                    &nbsp;
                                </span>
                            </p>
                            {/**Редактирование текста */}
                            <TextareaAutosize
                                className="form-control p-0 mb-2 bg-light"
                                id="modal-edit-text"
                                style={{ border: "none", outline: "none", boxShadow: "none", resize: "none" }}
                                minRows={3}
                                maxRows={calcMaxRows()}
                                value={note.text}
                                onChange={onInputChange}
                            />
                        </React.Fragment>
                    ) : (
                        <h1>No note</h1>
                    )}
                </div>
                {/**Футер с функциональными кнопками */}
                <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap" }}>
                    {/**Палитра и кнопка удаления */}
                    <div>
                        <Palette
                            className="btn btn-light mx-1"
                            style={{ boxShadow: "none" }}
                            disabled={!note}
                            setColor={tryChangeColor}
                        ></Palette>
                        <Media
                            className="btn btn-light mx-1"
                            style={{ boxShadow: "none" }}
                            disabled={!note}
                            mediaList={note ? note.media || [] : []}
                            setNoteMedia={trySetNoteMedia}
                            noteId={note ? note.id : null}
                            sizeData={sizeRef}
                        ></Media>
                        <button
                            className="btn btn-light"
                            style={{ boxShadow: "none" }}
                            disabled={!note}
                            onClick={tryRemove}
                        ><i className="bi bi-trash text-dark"></i></button>
                    </div>
                    {/**Индикатор номера заметки */}
                    <div className="mx-auto">
                        <span style={{ color: "lightgray", fontWeight: "400" }}>{note && String(note.order)}</span>
                    </div>
                    {/**Зактрытие окна */}
                    <div>
                        <button
                            className="btn btn-light"
                            style={{ boxShadow: "none" }}
                            onClick={tryClose}
                        >Close</button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ModalNoteEdit
