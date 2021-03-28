import './App.css';

import React from 'react'
import CardList from './Cards/CardList'
import AddCard from './Cards/AddCard'

const testText = "My little cards-app c:";
const cardsArr = [
  { id: 1, completed: false, title: "Card1" },
  { id: 2, completed: true, title: "abcdefg2" },
  { id: 3, completed: false, title: "qwerty3" },
];
function App() {
  return (
    <div className="App">
      <header className="p-1 h2 text-center">{testText}</header>
      <main className="p-1">
        <AddCard />
        <CardList cards={cardsArr} />
      </main>


    </div>
  );
}

export default App;
