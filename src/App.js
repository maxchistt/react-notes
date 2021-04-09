import React from 'react';
import logo from './logo.svg';
import './App.css';
import CardList from './Cards/CardList'
import AddCard from './Cards/AddCard'
import Context from './context'
import Loader from './Content/Loader'
import ModalCardEdit from './Modal/ModalCardEdit'
import ModalLogin from './Modal/ModalLogin'
import DataService from './DataService'

const { loadData, postData, setDataServLogin } = DataService()
const testText = "Notes App"

var cardCount = 0
function calcCount(cards) {
  let id = cardCount;
  [...cards].forEach(element => {
    if (Number(element.id) >= id) id = Number(element.id)
  });
  return id
}

function useCardsArr(defaultValue) {
  const [value, setValue] = React.useState(defaultValue)

  function trySetValue(cardsArr) {
    if (checkCardsArr(cardsArr)) setValue(cardsArr)
    else console.error('Массив cardsArr не прошел проверку \n', cardsArr)
  }

  return [value, trySetValue]
}

function checkCardsArr(cardsArr) {
  if (!Array.isArray(cardsArr)) return false
  else if (cardsArr.length === 0) return true
  else {
    cardsArr.forEach((card) => {
      if (typeof card !== "object") return false
      else if (!checkCardFields(card)) return false
    })
    return true
  }
}

function checkCardFields(card) {
  let res = (
    !isNaN(card.id) &&
    typeof card.completed === "boolean" &&
    typeof card.text === "string"
  )
  return res
}

var timer

function App() {
  const [cardsArr, setCards] = useCardsArr([])
  const [editCardId, setEditCardId] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [logged, setLogged] = React.useState(false)
  const [userName, setUserName] = React.useState(undefined)

  const [timerVal, setTimerVal] = React.useState(null)
  if (timer) clearInterval(timer)
  timer = setInterval(() => setTimerVal(Date.now()), 60 * 1000) // обновяем через минуту
  React.useEffect(onLogout, [logged, userName])// eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(loadDataFromServer, [logged, userName, timerVal]) // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(loadDataToServer, [cardsArr]) // eslint-disable-line react-hooks/exhaustive-deps
  const [openLogin, setOpenLogin] = React.useState(false)

  ///////////
  function tryLogin(login) {
    return new Promise((res, rej) => {
      tryLogout()
        .then(() => {
          setDataServLogin(login)
            .then(
              r => {
                setLogged(Boolean(r))
                setUserName(login)
                res(r)
              }
            )
            .catch(
              e => {
                console.log("setDataServLogin in Try login", "catch", e);
                rej(e)
              }
            )
        })
        .catch((e) => console.log("logout catch in tryLogin", e))
    })
  }

  function tryLogout() {
    return new Promise((res) => {
      if (logged) console.log("Dislogin")
      let result = setDataServLogin(null)
      setUserName(undefined)
      setLogged(false)
      result.then(onLogout, onLogout).then(res, res).then(onLogout).catch(e => console.log("Data service dislogif failed", e))
    })
  }

  function onLogout() {
    if (!logged && !!cardsArr) deleteAll()
  }
  ///////////

  ///////////
  function loadDataToServer() {
    try {
      if (logged && userName) postData(cardsArr)
        .then((res) => {
          console.log('[onPostData]', res)
        }, e => console.log(`Data post request error. Response: ${e}`))
    }
    catch (e) {
      console.error(e)
    }
  }

  function loadDataFromServer() {
    try {
      if (logged && userName) {
        setLoading(true)
        loadData()
          .then(data => {
            console.log('[onLoadData]', 'Данные с сервера загружены')
            setLoadedCards(data)
            setLoading(false)
          }, e => {
            console.log(`Data load request error. Response: ${e}`)
            setLoading(false)
          })
      }
    }
    catch (e) {
      setLoading(false)
      console.error(e)
    }
  }
  ///////////

  ///////////
  function setLoadedCards(cards) {
    setCards([...cards])
    cardCount = calcCount(cards)
  }

  function removeCard(index) {
    cardsArr.splice(index, 1)
    setCards([...cardsArr])
  }

  function deleteAll() {
    setCards([])
  }

  function addCard(cardData = {}) {
    setCards(
      cardsArr.concat([
        {
          id: Number(++cardCount),
          completed: Boolean(cardData.sel),
          text: String(cardData.text)
        }
      ])
    )
  }

  function changeCardState(index) {
    cardsArr[index].completed = !cardsArr[index].completed
    setCards([...cardsArr])
  }

  function editCardContent(index, text) {
    if (cardsArr[index]) cardsArr[index].text = text
    setCards([...cardsArr])
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

  return (
    <Context.Provider value={{ removeCard, changeCardState, setEditCard, unsetEditCard, editCardContent, editCardId }}>
      <div className="App pb-3 mb-3">
        <header className="p-1">
          <nav className="d-flex container px-0 flex-wrap-reverse">
            <div className="text-center d-flex p-1 align-items-center justify-content-center flex-wrap">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="h2 m-0 text-dark">{testText}</h1>
            </div>
            <div className="text-center d-flex p-0 align-items-center flex-wrap ml-auto">
              {logged &&
                <button className="btn btn-light m-1" onClick={loadDataFromServer}>
                  <i className="bi bi-arrow-clockwise px-1"></i>
                  <span className='d-lg-inline d-none'>Update data</span>
                </button>
              }
              <button className="btn btn-light m-1" onClick={() => setOpenLogin(true)}>
                {logged ? <span><i className="bi bi-person"></i> {userName}</span> : <span><i className="bi bi-arrow-right-circle"></i> LOG IN</span>}
              </button>
            </div>
          </nav>
          <ModalLogin login={tryLogin} logout={tryLogout} logged={logged} userName={userName} isOpen={openLogin} setOpenState={setOpenLogin} />
        </header>

        <main className="p-1 pb-3 mb-3">
          <AddCard onCreate={addCard} onDeleteAll={deleteAll} />
          <ModalCardEdit card={getCardByIndex(editCardId)} index={editCardId} />

          {cardsArr.length ? (
            <CardList cards={cardsArr} />
          ) : loading ? null : logged ? (
            <div className="container text-center">
              <p className="m-3 p-3 h5 text-muted">No cards. You can add a new one!</p>
            </div>
          ) : (
            <div className="container text-center">
              <p className="m-3 p-3 h5 text-muted">Unlogged</p>
            </div>
          )}

          {loading && <Loader />}
        </main>
      </div>
    </Context.Provider>
  );
}

export default App;
