/**
 * @file NotesPage.js
 */
import React from 'react'
import './NotesPage.css'
import NoteList from '../NoteComponents/NoteList'
import AddNote from '../NoteComponents/AddNote'
import NotesContext from '../Context/NotesContext'
import Loader from '../Shared/Loader'
import ModalNoteEdit from '../NoteComponents/ModalNoteEdit'
import Note from '../Shared/noteType/Note'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import useNavbarEffect from '../Hooks/useNavbarEffect.hook'
import useDataLoadingController from '../Hooks/useDataLoadingController.hook'
import useFetchNotes from '../Hooks/useFetchNotes.hook'
import useEditNoteId from '../Hooks/useEditNoteId.hook'
import useNotesArr from '../Hooks/useNotesArr.hook'
import { calcOrder, fixOrders } from '../Shared/order'
import useUpdaterSocket from '../Hooks/useUpdaterSocket.hook'

/**
 * Страница с заметками 
 */
function NotesPage() {
    /**подключение контекста авторизации */
    const auth = React.useContext(AuthContext)

    /** Подключение хука для обращения к бд с заметками */
    const { loading, fetchNotes, error, clearError } = useFetchNotes(auth.token)

    /**хук сообщений от сервера */
    const [message, setMessage] = React.useState(null)

    /** очистка ошибок хука запросов и запись ошибки в сообщение*/
    React.useEffect(() => {
        if (error) setMessage(error)
        /**Выйти в случае неавторизации */
        if (error === 'Нет авторизации') auth.logout()
        clearError()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error])

    /** очистка message */
    React.useEffect(() => {
        return () => message && setMessage(null)
    })

    /**Подключение хука id кудактируемой заметки */
    const { editNoteId, setEditNoteId, unsetEditNoteId } = useEditNoteId()

    /**Массив заметок */
    const [notesArr, setNotesArr] = useNotesArr(null)

    /**очистка старых данных */
    React.useEffect(() => !auth.isAuthenticated && setNotesArr(null), [auth.isAuthenticated]) // eslint-disable-line react-hooks/exhaustive-deps

    /** подключение контроллера обновления данных */
    const [updateData] = useDataLoadingController(loadDataFromServer, setLoadedNotes, auth, 60)

    /** подключение сокета обновления данных */
    const [sendUpdateMsg] = useUpdaterSocket(updateData, auth)

    ///////////

    /**
     * получение данных с сервера
     */
    function loadDataFromServer(setterClb = () => { }) {
        fetchNotes("", "GET", null, setterClb)
    }

    /**
     * Загрузка данных на сервер
     * @param {Note} note 
     * @param {string} target 
     */
    function loadDataToServer(note = new Note(), target = 'set') {
        fetchNotes(target, "POST", { note }, sendUpdateMsg)
    }

    ///////////

    /**
     * Внесение в полученных данных в массив
     * @param {Array<{}>} notes 
     */
    function setLoadedNotes(notes) {
        setNotesArr([...notes])
    }

    /**
     * удаление карточки
     * @param {string} id 
     */
    function removeNote(id) {
        const index = getNoteIndexById(id)
        const toDelete = notesArr.splice(index, 1)[0]
        setNotesArr([...notesArr])
        loadDataToServer(toDelete, "delete")
    }

    /**
     * добавление карточки
     * @param {{}} noteData 
     */
    function addNote(noteData = {}) {
        const newId = String(auth.email) + String(Date.now()) + String(Math.random())
        const newNote = new Note({
            id: newId,
            name: noteData.name,
            color: noteData.color,
            text: noteData.text,
            order: calcOrder(notesArr)
        })
        setNotesArr(
            (notesArr != null) ? notesArr.concat([newNote]) : [newNote]
        )
        loadDataToServer(newNote, "set")
        setEditNoteId(newId)
    }

    /**
     * Изменение цвета карточки
     * @param {string} id  
     * @param {string} color 
     */
    function changeNoteColor(id, color) {
        const index = getNoteIndexById(id)
        notesArr[index].color = color
        setNotesArr([...notesArr])
        loadDataToServer(notesArr[index], "set")
    }

    /**
     * Изменение текстового содержания карточки
     * @param {string} id  
     * @param {string} name 
     * @param {string} text 
     */
    function editNoteContent(id, name, text) {
        const index = getNoteIndexById(id)
        if (index !== null) {
            let note = new Note(notesArr[index])
            note.name = name
            note.text = text
            notesArr[index] = note
        }
        setNotesArr([...notesArr])
        loadDataToServer(notesArr[index], "set")
    }

    /**
     * Изменение порядка заметки
     * @param {string} id 
     * @param {boolean} orderOperationFlag 
     */
    function editNoteOrder(id, orderOperationFlag) {
        const index = getNoteIndexById(id)
        if (index !== null) {
            notesArr[index].order += orderOperationFlag ? 1 : -1
            let fixedArr = fixOrders(notesArr)
            setNotesArr(fixedArr)
            fixedArr.forEach((note) => {
                loadDataToServer(note, "set")
            })
        }
    }

    ///////////

    /**
     * функция получения карточки по id 
     * @param {string} id 
     */
    function getNoteById(id) {
        const byId = () => {
            let note = null
            if (Array.isArray(notesArr)) {
                notesArr.forEach((val, index) => {
                    if (val.id === id) note = val
                })
            }
            return note
        }
        return id !== null ? byId() : null
    }

    /**
     * функция получения индекса карточки по id 
     * @param {string} id 
     */
    function getNoteIndexById(id) {
        const byId = () => {
            let index = null
            if (Array.isArray(notesArr)) {
                notesArr.forEach((val, ind) => {
                    if (val.id === id) index = ind
                })
            }
            return index
        }
        return id !== null ? byId() : null
    }

    ///////////

    /**
     * Обновление навбара при переходе на эту страницу и изменениях
     */
    useNavbarEffect(
        /**Установка кнопок обновления контента и возврата к странице авторизации */
        <React.Fragment>
            <button className="btn btn-light m-1" onClick={updateData}>
                <i style={{ verticalAlign: "top" }} className={`bi bi-fix-align bi-arrow-${!loading ? "clockwise" : "repeat"} px-1 ${loading && "lds-animation"}`}></i>
            </button>
            <NavLink to="/auth" className="btn btn-light m-1">
                <span><i className="bi bi-person"></i> {auth.email}</span>
            </NavLink>
        </React.Fragment>,
        [auth.email, auth.token, loading]
    )

    /**рендер */
    return (
        /**Здесь отрисовываются меню добавления и редактирования заметок и сам перечнь заметок в виде динамичной отзывчивой сетки */
        <NotesContext.Provider value={{ addNote, removeNote, changeNoteColor, editNoteContent, editNoteOrder, setEditNoteId, unsetEditNoteId, editNoteId, getNoteById }}>
            <div className="NotesPage">
                <main className="p-1 pb-3 mb-3">
                    {/**Компонент добавления карточки и модальное окно редактирования */}
                    <AddNote />
                    <ModalNoteEdit />
                    {/**Вариативное отображение контента (заметок) */}
                    {notesArr && notesArr.length ? (
                        /**Список карточек */
                        <NoteList notes={notesArr} />
                    ) : (loading) ? null : !message ? (
                        /**Сообщение об отсутствии карточек */
                        <div className="container text-center">
                            <p className="m-3 p-3 h5 text-muted">No Notes. You can add a new one!</p>
                        </div>
                    ) : (
                        /**Ошибка загрузки данных */
                        <div className="container text-center">
                            <p className="m-3 p-3 h5 text-muted">Data not loaded<br />{message}</p>
                        </div>
                    )}
                    {/**Колесико загрузки */}
                    {(loading && !notesArr && editNoteId === null) &&
                        <div className="container display-4 text-center p-3" >
                            <Loader />
                        </div>
                    }
                </main>
            </div>
        </NotesContext.Provider>
    );
}

export default NotesPage
