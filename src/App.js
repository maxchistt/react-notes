import logo from './logo.svg';
import './App.css';
import React from 'react'
import CardList from './Cards/CardList'
import AddCard from './Cards/AddCard'
import Context from './context'
import Loader from './Content/Loader'
import ModalCardEdit from './Modal/ModalCardEdit'
import Modal from './Modal/Modal'
import DataService from './DataService'

const { loadData, postData, login } = DataService()

const testText = "My little cards-app c:"

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

function App() {
  const [cardsArr, setCards] = useCardsArr([])
  const [editCardId, setEditCardId] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [logged, setLogged] = React.useState(false)
  React.useEffect(tryLogin, []) // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(loadDataFromServer, [logged]) // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(loadDataToServer, [cardsArr]) // eslint-disable-line react-hooks/exhaustive-deps


  ///////////
  function tryLogin() {
    try {
      login().then(setLogged, alert)
    } catch (e) {
      console.error(e)
    }
  }
  ///////////

  ///////////
  function loadDataToServer() {
    try {
      if (logged) postData(cardsArr).then((res) => {
        console.log('[onPostData]', res)
      }, dataError)
    }
    catch (e) {
      console.error(e)
    }
  }

  function loadDataFromServer() {
    try {
      if (logged) {
        setLoading(true)
        loadData().then(data => {
          console.log('[onLoadData]', 'Данные с сервера загружены')
          setLoadedCards(data)
          setLoading(false)
        }, dataError)
      }
    }
    catch (e) {
      console.error(e)
    }
  }

  function dataError(msg) {
    console.log(`Data request error. Response: ${msg}`)
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
      <div className="App">
        <header className="p-1 h2 text-center">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="d-inline-block h2">{testText}</h1>
          <p className="show_login" onClick={(e) => { e.target.style.opacity = e.target.style.opacity !== '0' ? '0' : '1' }}>
            {logged && `Login: ${logged}`}
          </p>
        </header>

        <main className="p-1">
          <AddCard onCreate={addCard} onDeleteAll={deleteAll} />
          <Modal component={ModalCardEdit} componentProps={{ card: getCardByIndex(editCardId), index: editCardId }} />
          {loading && <Loader />}
          {cardsArr.length ? (
            <CardList cards={cardsArr} />
          ) : loading ? null : (
            <div className="container text-center">
              <p className="m-3 p-3 h5 text-muted">No cards. You can add a new one!</p>
            </div>
          )}
        </main>
      </div>
    </Context.Provider>
  );
}

export default App;
