import logo from './logo.svg';
import './App.css';

import React from 'react'
import CardList from './Cards/CardList'
import AddCard from './Cards/AddCard'
import Context from './context'
import Loader from './Content/Loader'
import Modal from './Modal/Modal'

import { lorem } from './Content/Lorem'

const testText = "My little cards-app c:";

let cardCount = 1;

function generateCardsArr() {
  let arr = [];
  for (let index = 0; index < 8; index++) {
    let len = Math.floor(Math.random() * lorem.length);
    arr.push({
      id: Number(cardCount++),
      completed: Boolean(Math.floor(Math.random() * 2)),
      text: lorem.slice(0, len)
    })
  }
  return arr;
};

function App() {
  const [cardsArr, setCards] = React.useState([])
  const [editCardId, setEditCardId] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  React.useEffect(loadCards, [])

  function loadCards() {
    setTimeout(() => {
      setCards(generateCardsArr())
      setLoading(false)
    }, 200)
  }

  function removeCard(id) {
    setCards(cardsArr.filter(card => card.id !== id))
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

  function getCardById(index) {
    return index !== null ? cardsArr[index] : null;
  }

  function setEditCard(index) {
    setEditCardId(index)
  }

  function unsetEditCard() {
    setEditCardId(null)
  }

  function changeCardState(id) {
    cardsArr.forEach(card => {
      if (card.id === id) {
        card.completed = !card.completed;
      }
    })
    setCards([...cardsArr]);
  }

  return (
    <Context.Provider value={{ removeCard, changeCardState, setEditCard, unsetEditCard }}>
      <div className="App">
        <header className="p-1 h2 text-center">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="d-inline-block h2">{testText}</h1>
        </header>

        <main className="p-1">

          <AddCard onCreate={addCard} onDeleteAll={deleteAll} />
          <Modal card={getCardById(editCardId)} />
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
