import React from 'react';
import './CardsPage.css';
import CardList from '../Cards/CardList'
import AddCard from '../Cards/AddCard'
import CardsContext from '../Context/CardsContext'
import Loader from '../Shared/Loader'
import ModalCardEdit from '../Cards/ModalCardEdit'
import Card, { checkCardsArr } from '../Cards/cardType/Card'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import { PageContext } from '../Context/PageContext'
import { useHttp } from '../Hooks/http.hook'

/**
 * Хук использования массива заметок
 * @param {*} defaultValue  
 */
function useCardsArr(defaultValue) {
    const [value, setValue] = React.useState(defaultValue)
    /**Сеттер с проверкой валидности массива */
    function trySetValue(cardsArr) {
        if (checkCardsArr(cardsArr) || cardsArr === null) setValue(cardsArr)
        else console.error('Массив cardsArr не прошел проверку \n', cardsArr)
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
function CardsPage() {
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
    const [cardsArr, setCardsArr] = useCardsArr(null)

    /**Id редактируемой заметки */
    const [editCardId, setEditCardId] = React.useState(null)

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
        if (!auth.isAuthenticated) setCardsArr(null)
    }
    ///////////

    ///////////

    /**
     * получение данных с сервера
     */
    function loadDataFromServer() {
        fetchNotes("", "GET", null, setLoadedCards)
    }

    /**
     * Внесение в полученных данных в массив
     * @param {*} cards 
     */
    function setLoadedCards(cards) {
        if (updatingEnable.current) setCardsArr([...cards])
    }
    ///////////

    ///////////

    /**
     * Загрузка данных на сервер
     * @param {*} card 
     * @param {*} target 
     */
    function loadDataToServer(card = new Card(), target = 'set') {
        fetchNotes(target, "POST", { card })
    }

    /**
     * удаление карточки
     * @param {*} index 
     */
    function removeCard(index) {
        const toDelete = cardsArr.splice(index, 1)[0]
        setCardsArr([...cardsArr])
        loadDataToServer(toDelete, "delete")
    }

    /**
     * добавление карточки
     * @param {*} cardData 
     */
    function addCard(cardData = {}) {
        const newId = String(auth.email) + String(Date.now()) + String(Math.random())
        const newCard = new Card({ id: newId, name: cardData.name, color: cardData.color, text: cardData.text })
        //console.log(newId, newCard.id);
        setCardsArr(
            (cardsArr != null) ? cardsArr.concat([newCard]) : [newCard]
        )
        loadDataToServer(newCard, "set")

    }

    /**
     * Изменение цвета карточки
     * @param {*} index 
     * @param {*} color 
     */
    function changeCardColor(index, color) {
        cardsArr[index].color = color
        setCardsArr([...cardsArr])
        loadDataToServer(cardsArr[index], "set")
    }

    /**
     * Изменение текстового содержания карточки
     * @param {*} index 
     * @param {*} name 
     * @param {*} text 
     */
    function editCardContent(index, name, text) {
        if (cardsArr[index]) {
            let card = new Card(cardsArr[index])
            card.name = name
            card.text = text
            cardsArr[index] = card
        }
        setCardsArr([...cardsArr])
        loadDataToServer(cardsArr[index], "set")
    }
    ///////////

    ///////////
    /**функция назначения редактируемой заметки для модального окна */
    function setEditCard(index) {
        setEditCardId(index)
    }
    /**функция сброса редактируемой заметки для модального окна */
    function unsetEditCard() {
        setEditCardId(null)
    }
    /**функция получения карточки по id */
    function getCardByIndex(index) {
        return index !== null ? cardsArr[index] : null
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
                    {loading ? <Loader className='px-1' /> : <i className="bi bi-arrow-clockwise px-1"></i>}
                    <span className='d-xl-inline d-none'>Update</span>
                </button>
                <NavLink to="/authpage" className="btn btn-light m-1">
                    <span><i className="bi bi-person"></i> {auth.email}</span>
                </NavLink>
            </React.Fragment>
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.email, auth.token])

    /**рендер */
    return (
        /**Здесь отрисовываются меню добавления и редактирования заметок и сам перечнь заметок в виде динамичной отзывчивой сетки */
        <CardsContext.Provider value={{ addCard, removeCard, changeCardColor, setEditCard, unsetEditCard, editCardContent, editCardId }}>
            <div className="">
                <main className="p-1 pb-3 mb-3">
                    {/**Компонент добавления карточки и модальное окно редактирования */}
                    <AddCard />
                    <ModalCardEdit card={getCardByIndex(editCardId)} index={editCardId} />
                    {/**Вариативное отображение контента (заметок) */}
                    {cardsArr && cardsArr.length ? (
                        /**Список карточек */
                        <CardList cards={cardsArr} />
                    ) : (loading) ? null : !message ? (
                        /**Сообщение об отсутствии карточек */
                        <div className="container text-center">
                            <p className="m-3 p-3 h5 text-muted">No cards. You can add a new one!</p>
                        </div>
                    ) : (
                        /**Ошибка загрузки данных */
                        <div className="container text-center">
                            <p className="m-3 p-3 h5 text-muted">Data not loaded<br />{message}</p>
                        </div>
                    )}
                    {/**Компонент добавления карточки и модальное окно редактирования */}
                    {loading &&
                        <div className="container display-4 text-center p-3" >
                            <Loader />
                        </div>
                    }
                </main>
            </div>
        </CardsContext.Provider>
    );
}

export default CardsPage
