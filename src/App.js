import logo from './logo.svg';
import './App.css';

import React from 'react'
import CardList from './Cards/CardList'
import AddCard from './Cards/AddCard'
import Context from './context'

import { lorem } from './Content/Lorem'

const testText = "My little cards-app c:";

let cardCount = 0;
const start_cards_arr = fillCards();

function fillCards() {
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
  const [cardsArr, setCards] = React.useState(start_cards_arr);

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

  function changeCardState(id) {
    cardsArr.forEach(card => {
      if (card.id === id) {
        card.completed = !card.completed;
      }
    })
    setCards([...cardsArr]);
  }

  return (
    <Context.Provider value={{ removeCard, changeCardState }}>
      <div className="App">
        <header className="p-1 h2 text-center">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="d-inline-block h2">{testText}</h1>
        </header>
        <main className="p-1">
          <AddCard onCreate={addCard} onDeleteAll={deleteAll} />
          {cardsArr.length ? (
            <CardList cards={cardsArr} />
          ) : (
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
