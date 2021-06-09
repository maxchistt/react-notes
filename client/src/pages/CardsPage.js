import React from 'react';

import './CardsPage.css';
import CardList from '../Cards/CardList'
import AddCard from '../Cards/AddCard'
import CardsContext from '../context/CardsContext'
import Loader from '../shared/Loader'
import ModalCardEdit from '../Cards/ModalCardEdit'

import Card, { checkCardsArr } from '../Cards/cardType/Card'


import { NavLink } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { PageContext } from '../context/PageContext'

import { useHttp } from '../hooks/http.hook'

function useCardsArr(defaultValue) {
    const [value, setValue] = React.useState(defaultValue)

    function trySetValue(cardsArr) {
        if (checkCardsArr(cardsArr) || cardsArr === null) setValue(cardsArr)
        else console.error('Массив cardsArr не прошел проверку \n', cardsArr)
    }

    return [value, trySetValue]
}

function useUpdater() {
    const [updaterVal, setUpdaterVal] = React.useState(null)
    const timer = React.useRef()
    React.useEffect(() => {
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            console.log("Timed update")
            setUpdaterVal(Date.now())
        }, 60 * 1000) // обновяем через минуту
        return () => clearTimeout(timer.current)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    return [updaterVal]
}

function CardsPage() {

    const auth = React.useContext(AuthContext)
    const page = React.useContext(PageContext)

    const { loading, request, error, clearError } = useHttp()
    const fetchNotes = React.useCallback(async (url = "", method = "GET", body = null, resCallback = () => { }) => {
        try {
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

    const [message, setMessage] = React.useState(null)

    React.useEffect(() => {
        if (error) setMessage([error, false])
        clearError()
    }, [error, clearError])



    const [cardsArr, setCardsArr] = useCardsArr(null)
    const [editCardId, setEditCardId] = React.useState(null)

    const [updaterVal] = useUpdater()

    const updatingEnable = React.useRef(true)

    React.useEffect(() => {
        updatingEnable.current = true
        loadDataFromServer()
        return () => updatingEnable.current = false
    }, [auth.isAuthenticated, auth.email, updaterVal]) // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect(clearOldData, [auth.isAuthenticated]) // eslint-disable-line react-hooks/exhaustive-deps

    ///////////
    function clearOldData() {
        //console.log("clearOldData, auth.isAuthenticated:", auth.isAuthenticated)
        if (!auth.isAuthenticated) setCardsArr(null)
    }
    ///////////

    ///////////
    function loadDataFromServer() {
        fetchNotes("", "GET", null, setLoadedCards)
    }

    function setLoadedCards(cards) {
        if (updatingEnable.current) setCardsArr([...cards])
    }
    ///////////

    ///////////

    function loadDataToServer(card = new Card(), target = 'set') {
        fetchNotes(target, "POST", { card })
    }

    function removeCard(index) {
        const toDelete = cardsArr.splice(index, 1)[0]
        setCardsArr([...cardsArr])
        loadDataToServer(toDelete, "delete")
    }

    function addCard(cardData = {}) {
        const newId = String(auth.email) + String(Date.now()) + String(Math.random())
        const newCard = new Card({ id: newId, name: cardData.name, color: cardData.color, text: cardData.text })
        //console.log(newId, newCard.id);
        setCardsArr(
            (cardsArr != null) ? cardsArr.concat([newCard]) : [newCard]
        )
        loadDataToServer(newCard, "set")

    }

    function changeCardColor(index, color) {
        cardsArr[index].color = color
        setCardsArr([...cardsArr])
        loadDataToServer(cardsArr[index], "set")
    }

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
    function getCardByIndex(index) {
        return index !== null ? cardsArr[index] : null
    }
    function setEditCard(index) {
        setEditCardId(index)
    }
    function unsetEditCard() {
        setEditCardId(null)
    }
    ///////////

    React.useEffect(() => {
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

    return (
        <CardsContext.Provider value={{ addCard, removeCard, changeCardColor, setEditCard, unsetEditCard, editCardContent, editCardId }}>
            <div className="">

                <main className="p-1 pb-3 mb-3">
                    <AddCard />
                    <ModalCardEdit card={getCardByIndex(editCardId)} index={editCardId} />

                    {cardsArr && cardsArr.length ? (
                        <CardList cards={cardsArr} />
                    ) : (loading) ? null : !message ? (
                        <div className="container text-center">
                            <p className="m-3 p-3 h5 text-muted">No cards. You can add a new one!</p>
                        </div>
                    ) : (
                        <div className="container text-center">
                            <p className="m-3 p-3 h5 text-muted">Data not loaded</p>
                            <p className="m-3 p-3 h5 text-muted">{message}</p>
                        </div>
                    )}

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
