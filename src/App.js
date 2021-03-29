import './App.css';

import React from 'react'
import CardList from './Cards/CardList'
import AddCard from './Cards/AddCard'
import Context from './context'

const testText = "My little cards-app c:";

let cardCount = 0;
const start_cards_arr = fillCards();

function fillCards() {
  let start_cards_arr = [];
  for (let index = 0; index < 8; index++) {
    start_cards_arr.push({
      id: Number(cardCount++),
      completed: Boolean(Math.floor(Math.random() * 2)),
      title: String("Card-" + (index + 1))
    })
  }
  return start_cards_arr;
};



function App() {
  const [cardsArr, setCards] = React.useState(start_cards_arr);

  function removeCard(id) {
    setCards(cardsArr.filter(todo => todo.id !== id))
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
          title: String(cardData.name)
        }
      ])
    )
    cardCount++
  }







  return (
    <Context.Provider value={{ removeCard }}>
      <div className="App">
        <header className="p-1 h2 text-center">{testText}</header>
        <main className="p-1">
          <AddCard
            onCreate={addCard}
            onDeleteAll={deleteAll}
          />
          <CardList cards={cardsArr} />
        </main>
      </div>
    </Context.Provider>
  );
}

export default App;
