/**
 * @file NotesPage.js
 */
import React from 'react';
import './NotesPage.css';
import NoteList from '../NoteComponents/NoteList'
import AddNote from '../NoteComponents/AddNote'
import NotesContext from '../Context/NotesContext'
import Loader from '../Shared/Loader'
import ModalNoteEdit from '../NoteComponents/ModalNoteEdit'
import Note, { checkNotesArr } from '../Shared/noteType/Note'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import { PageContext } from '../Context/PageContext'
import { useHttp } from '../Hooks/http.hook'

/**
 * Хук использования массива заметок
 * @param {*} defaultValue  
 */
function useNotesArr(defaultValue) {
    const [value, setValue] = React.useState(defaultValue)
    /**Сеттер с проверкой валидности массива */
    function trySetValue(notesArr) {
        if (checkNotesArr(notesArr) || notesArr === null) setValue(notesArr)
        else console.error('Массив notesArr не прошел проверку \n', notesArr)
    }
    return [value, trySetValue]
}

/**
 * Хук-таймер для обновления данных с очисткой счетчика при ререндере 
 */
function useUpdater() {
    const [updaterVal, setUpdaterVal] = React.useState(null)
    const timer = React.useRef()
    React.useEffect(() => {
        if (timer.current) clearTimeout(timer.current) // сброс при переопределении таймера
        timer.current = setTimeout(() => {
            console.log("Timed update")
            setUpdaterVal(Date.now())
        }, 60 * 1000) // обновяем через минуту
        return () => clearTimeout(timer.current) // сброс при ререндере
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    return [updaterVal]
}

/**
 * Страница с заметками 
 */
function NotesPage() {
    /**подключение контекстов */
    const auth = React.useContext(AuthContext)
    const page = React.useContext(PageContext)

    /**подключение хука http запросов */
    const { loading, request, error, clearError } = useHttp()

    /**хук сообщений от сервера */
    const [message, setMessage] = React.useState(null)

    /**Хук-функция для работы с базой данных заметок */
    const fetchNotes = React.useCallback(async (url = "", method = "GET", body = null, resCallback = () => { }) => {
        try {
            /**запрос к серверу с определенными параметрами*/
            const fetched = await request(`/api/notes${url ? ("/" + url) : ""}`, method, body, { Authorization: `Bearer ${auth.token}` })
            resCallback(tryParce(fetched))
        } catch (e) { }
        function tryParce(str) {
            try {
                return JSON.parse(str);
            } catch (e) {
                return str;
            }
        }
    }, [auth.token, request])

    /** очистка оштбок хука запросов и запись ошибки в сообщение*/
    React.useEffect(() => {
        if (error) setMessage(error)
        /**Выйти в случае неавторизации */
        if (error === 'Нет авторизации') auth.logout()
        clearError()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, clearError])

    /**Массив заметок */
    const [notesArr, setNotesArr] = useNotesArr(null)

    /**Id редактируемой заметки */
    const [editNoteId, setEditNoteId] = React.useState(null)

    const [updaterVal] = useUpdater()
    const updatingEnable = React.useRef(true)

    /**
     * хук обновления данных с сервера
     * флаг updatingEnable позволяет избежать взаимодействия с устаревшей unmount версией компонента
     */
    React.useEffect(() => {
        updatingEnable.current = true
        loadDataFromServer()
        return () => updatingEnable.current = false
    }, [auth.isAuthenticated, auth.email, updaterVal]) // eslint-disable-line react-hooks/exhaustive-deps

    ///////////
    //очистка старых данных
    React.useEffect(clearOldData, [auth.isAuthenticated]) // eslint-disable-line react-hooks/exhaustive-deps
    function clearOldData() {
        if (!auth.isAuthenticated) setNotesArr(null)
    }
    ///////////

    ///////////

    /**
     * получение данных с сервера
     */
    function loadDataFromServer() {
        fetchNotes("", "GET", null, setLoadedNotes)
    }

    /**
     * Внесение в полученных данных в массив
     * @param {*} notes 
     */
    function setLoadedNotes(notes) {
        if (updatingEnable.current) setNotesArr([...notes])
    }
    ///////////

    ///////////

    /**
     * Загрузка данных на сервер
     * @param {*} note 
     * @param {*} target 
     */
    function loadDataToServer(note = new Note(), target = 'set') {
        fetchNotes(target, "POST", { note })
    }

    /**
     * удаление карточки
     * @param {*} index 
     */
    function removeNote(index) {
        const toDelete = notesArr.splice(index, 1)[0]
        setNotesArr([...notesArr])
        loadDataToServer(toDelete, "delete")
    }

    /**
     * добавление карточки
     * @param {*} noteData 
     */
    function addNote(noteData = {}) {
        const newId = String(auth.email) + String(Date.now()) + String(Math.random())
        const newNote = new Note({ id: newId, name: noteData.name, color: noteData.color, text: noteData.text })
        //console.log(newId, newNote.id);
        const newIndex = (notesArr != null) ? notesArr.length : 0
        setNotesArr(
            (notesArr != null) ? notesArr.concat([newNote]) : [newNote]
        )
        loadDataToServer(newNote, "set")
        setEditNoteId(newIndex)
    }

    /**
     * Изменение цвета карточки
     * @param {*} index 
     * @param {*} color 
     */
    function changeNoteColor(index, color) {
        notesArr[index].color = color
        setNotesArr([...notesArr])
        loadDataToServer(notesArr[index], "set")
    }

    /**
     * Изменение текстового содержания карточки
     * @param {*} index 
     * @param {*} name 
     * @param {*} text 
     */
    function editNoteContent(index, name, text) {
        if (notesArr[index]) {
            let note = new Note(notesArr[index])
            note.name = name
            note.text = text
            notesArr[index] = note
        }
        setNotesArr([...notesArr])
        loadDataToServer(notesArr[index], "set")
    }
    ///////////

    ///////////
    /**функция назначения редактируемой заметки для модального окна */
    function setEditNote(index) {
        setEditNoteId(index)
    }
    /**функция сброса редактируемой заметки для модального окна */
    function unsetEditNote() {
        setEditNoteId(null)
    }
    /**функция получения карточки по id */
    function getNoteByIndex(index) {
        return index !== null ? notesArr[index] : null
    }
    ///////////

    /**
     * Обновление навбара при переходе на эту страницу и изменениях
     */
    React.useEffect(() => {
        /**Установка кнопок обновления контента и возврата к странице авторизации */
        page.setNav(
            <React.Fragment>
                <button className="btn btn-light m-1" onClick={loadDataFromServer}>
                    <i style={{ verticalAlign: "top" }} className={`bi bi-fix-align bi-arrow-${!loading ? "clockwise" : "repeat"} px-1 ${loading && "lds-animation"}`}></i>
                </button>
                <NavLink to="/auth" className="btn btn-light m-1">
                    <span><i className="bi bi-person"></i> {auth.email}</span>
                </NavLink>
            </React.Fragment>
        )
        return page.setNav
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.email, auth.token, loading])

    /**рендер */
    return (
        /**Здесь отрисовываются меню добавления и редактирования заметок и сам перечнь заметок в виде динамичной отзывчивой сетки */
        <NotesContext.Provider value={{ addNote, removeNote, changeNoteColor, setEditNote, unsetEditNote, editNoteContent, editNoteId }}>
            <div className="NotesPage">
                <main className="p-1 pb-3 mb-3">
                    {/**Компонент добавления карточки и модальное окно редактирования */}
                    <AddNote />
                    <ModalNoteEdit note={getNoteByIndex(editNoteId)} index={editNoteId} />
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
