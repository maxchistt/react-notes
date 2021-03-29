import './App.css';

import React from 'react'
import CardList from './Cards/CardList'
import AddCard from './Cards/AddCard'
import Context from './context'

const testText = "My little cards-app c:";

const cards_start_arr = [
  { id: 1, completed: false, title: "Card1" },
  { id: 2, completed: true, title: "abcdefg2" },
  { id: 3, completed: false, title: "qwerty3" },
];


function App() {
  const [cardsArr, setTodos] = React.useState(cards_start_arr);

  function removeCard(id) {
    setTodos(cardsArr.filter(todo => todo.id !== id))
  } 

  return (
    <Context.Provider value={{ removeCard }}>
    <div className="App">
      <header className="p-1 h2 text-center">{testText}</header>
      <main className="p-1">
        <AddCard />
        <CardList cards={cardsArr} />
      </main>


    </div>
    </Context.Provider>
  );
}

export default App;
