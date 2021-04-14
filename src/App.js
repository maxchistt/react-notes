import React from 'react';
import logo from './logo.svg';
import './App.css';
import CardList from './Cards/CardList'
import AddCard from './Cards/AddCard'
import Context from './context'
import Loader from './Shared/Loader'
import ModalCardEdit from './Cards/ModalCardEdit'
import ModalLogin from './Login/ModalLogin'
import DataService from './Services/DataService'
import Card, { checkCardsArr } from './Shared/Card'

const { loadData, postData, updDataServLogin } = DataService()

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

function useUpdater() {
  const [updaterVal, setUpdaterVal] = React.useState(null)
  const timer = React.useRef()
  if (timer.current) clearTimeout(timer.current)
  timer.current = setTimeout(() => {
    console.log("Timed update")
    setUpdaterVal(Date.now())
  }, 60 * 1000) // обновяем через минуту
  return [updaterVal]
}

function App() {
  const [cardsArr, setCards] = useCardsArr([])
  const [editCardId, setEditCardId] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  const [openLogin, setOpenLogin] = React.useState(false)
  const [logged, setLogged] = React.useState(false)
  const [userName, setUserName] = React.useState(undefined)

  const [updaterVal] = useUpdater()

  React.useEffect(loadDataFromServer, [logged, userName, updaterVal]) // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(loadDataToServer, [cardsArr]) // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(clearOldData, [logged]) // eslint-disable-line react-hooks/exhaustive-deps

  ///////////
  function onLogin(login) {
    //console.log("onLogin", login)
    return new Promise((res, rej) => {
      onLogout()
        .then(() => {
          //console.log("onLogin", login, "onLogout.then")
          updDataServLogin(login)
            .then(r => {
              //console.log("onLogin", login, "onLogout.then", "updDataServLogin.then")
              setLogged(Boolean(r))
              setUserName(login)
              res(r)
            })
            .catch(e => {
              //console.log("onLogin", login, "onLogout.then", "updDataServLogin.catch", e)
              rej(e)
            })
        })
        .catch(e => console.log("logout catch in onLogin", e))
    })
  }

  function onLogout() {
    //console.log("onLogout")
    return new Promise((res) => {
      updDataServLogin(null)
        .finally(() => {
          if (logged) {
            //console.log("onLogout - was logged, dislogin")
            setUserName(undefined)
            setLogged(false)
          } else {
            //console.log("onLogout - also not logged")
            clearOldData()
          }
        })
        .finally(res)
        .catch(e => console.log("Data service dislogin failed", e))
    })
  }

  function clearOldData() {
    //console.log("clearOldData, logged:", logged)
    if (!logged && !!cardsArr) deleteAll()
  }
  ///////////

  ///////////
  function loadDataToServer() {
    try {
      if (logged && userName) postData(cardsArr)
        .then(res => {
          console.log('[onPostData]', res)
        })
        .catch(e => console.log(`Data post request error. Response: ${e}`))
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
          })
          .catch(e => {
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
      cardsArr.concat([new Card({ id: ++cardCount, name: cardData.name, completed: cardData.sel, text: cardData.text })])
    )
  }

  function changeCardState(index) {
    cardsArr[index].completed = !cardsArr[index].completed
    setCards([...cardsArr])
  }

  function editCardContent(index, name, text) {
    
    if (cardsArr[index]) {
      let card
      card = new Card(cardsArr[index])
      card.name = name
      card.text = text
      cardsArr[index]=card
    }
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
          <nav className="d-flex container px-0 flex-wrap-reverse justify-content-around">
            <div className="text-center d-flex p-1 align-items-center justify-content-center flex-wrap">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="h2 m-0 text-dark pr-3">{testText}</h1>
            </div>
            <div className="text-center d-flex p-0 align-items-center flex-wrap ml-auto">
              {logged &&
                <button className="btn btn-light m-1" onClick={loadDataFromServer}>
                  <i className="bi bi-arrow-clockwise px-1"></i>
                  <span className='d-xl-inline d-none'>Update data</span>
                </button>
              }
              <button className="btn btn-light m-1" onClick={() => setOpenLogin(true)}>
                {logged ? <span><i className="bi bi-person"></i> {userName}</span> : <span><i className="bi bi-arrow-right-circle"></i> LOG IN</span>}
              </button>
            </div>
          </nav>
          <ModalLogin onLogin={onLogin} onLogout={onLogout} logged={logged} userName={userName} isOpen={openLogin} setOpenState={setOpenLogin} />
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
