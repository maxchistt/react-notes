/**
 * @file ModalNoteEdit.js
 */
import React from 'react'
import PropTypes from 'prop-types'
import NotesContext from '../Context/NotesContext'
import TextareaAutosize from 'react-textarea-autosize'
import Modal, { ModalProps } from "../Shared/Modal/Modal"
import Note, { PropTypeNote } from './noteType/Note'
import Palette from './palette/palette'

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
 * @param {*} param0 
 * 
 */
function ModalNoteEdit({ note = new Note(), index }) {
    /**получение контекста */
    const { removeNote, changeNoteColor, unsetEditNote, editNoteContent } = React.useContext(NotesContext)
    React.useEffect(() => { if (note !== null) open() }, [note])

    /**хук состояния формы */
    const [showForm, setShowForm] = React.useState(false)

    /**создание параметров модального окна*/
    const modalProps = new ModalProps()
    modalProps.isOpen = showForm
    modalProps.setOpenState = setShowForm
    modalProps.sideClose = true
    modalProps.onSideClick = unsetEditNote

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
        editNoteContent(index, name, text)
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
        changeNoteColor(index, color)
    }

    /**
     * удаление
     */
    function tryRemove() {
        unsetEditNote();
        close();
        removeNote(index);
    }

    /**
     * закрытие и сброс окна
     */
    function tryClose() {
        unsetEditNote()
        close()
    }

    /**рендер */
    return (
        <Modal {...modalProps.bind()}>
            <div className="container p-2">
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
                            disabled={!note}
                            setColor={tryChangeColor}
                        ></Palette>
                        <button
                            className="btn btn-light"
                            disabled={!note}
                            onClick={tryRemove}
                        >&#10007;</button>
                    </div>
                    {/**Индикатор номера заметки */}
                    <div className="mx-auto">
                        <span style={{ color: "lightgray", fontWeight: "400" }}>Id {index}</span>
                    </div>
                    {/**Зактрытие окна */}
                    <div>
                        <button
                            className="btn btn-light"
                            onClick={tryClose}
                        >Close</button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

// Валидация
ModalNoteEdit.propTypes = {
    note: PropTypeNote,
    index: PropTypes.number,
}

export default ModalNoteEdit
