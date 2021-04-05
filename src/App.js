import logo from './logo.svg';
import './App.css';
import React from 'react'
import CardList from './Cards/CardList'
import AddCard from './Cards/AddCard'
import Context from './context'
import Loader from './Content/Loader'
import Modal from './Modal/Modal'
import DataService from './DataService'

const { loadData, postData, tryParce } = DataService()

const testText = "My little cards-app c:";

let cardCount = 1;
function calcCount(cardsArr) {
  let id = cardCount;
  [...cardsArr].forEach(element => {
    if (Number(element.id) >= id) id = Number(element.id) + 1
  });
  return id
}

function App() {
  const [cardsArr, setCards] = React.useState([])
  const [editCardId, setEditCardId] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(loadDataFromServer, [])
  React.useEffect(loadDataToServer, [cardsArr])

  function loadDataToServer() {
    //console.log("***\n[HOOK] - loadDataToServer (onCardsArr)\n***")
    postData(cardsArr)
  }

  function loadDataFromServer() {
    //console.log("[HOOK]  - loadDataFromServer")
    loadData().then(setLoadedCards)
  }

  function setLoadedCards(cards) {
    cards = tryParce(cards)
    setCards([...cards])
    cardCount = calcCount(tryParce(cards))
    setLoading(false)
  }

  ///////////
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
          id: Number(cardCount),
          completed: Boolean(cardData.sel),
          text: String(cardData.text)
        }
      ])
    )
    cardCount++
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

  ///
  function getCardByIndex(index) {
    return index !== null ? cardsArr[index] : null
  }
  function setEditCard(index) {
    setEditCardId(index)
  }
  function unsetEditCard() {
    setEditCardId(null)
  }
  ///


  return (
    <Context.Provider value={{ removeCard, changeCardState, setEditCard, unsetEditCard, editCardContent }}>
      <div className="App">
        <header className="p-1 h2 text-center">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="d-inline-block h2">{testText}</h1>
          <p className="show_login"></p>
        </header>

        <main className="p-1">

          <AddCard onCreate={addCard} onDeleteAll={deleteAll} />
          {getCardByIndex(editCardId) && <Modal card={getCardByIndex(editCardId)} index={editCardId} />}
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
