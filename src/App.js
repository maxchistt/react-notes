import logo from './logo.svg';
import './App.css';
import React from 'react'
import CardList from './Cards/CardList'
import AddCard from './Cards/AddCard'
import Context from './context'
import Loader from './Content/Loader'
import Modal from './Modal/Modal'
import $ from "jquery";
//import { } from './DataService'


///////////////////////////////////

const url = 'http://php-server-notes/'
let user = null
//let recuestCount = 1;
function request(target, data) {
  //const rc = recuestCount++
  //console.log(` \nrequest ${rc} - "${target}" started \n params - user:"${user}" data:"${trimStr(data)}"`)
  return new Promise((res, rej) => {
    $.ajax({
      url: url,
      type: "POST",
      dataType: "html",
      data: {
        user: user,
        target: target,
        data: data,
      },
    })
      .done(data => res(data))
      .fail(data => rej(data))
    //.always(() => console.log(`requested - newUser:"${user}" resolveData:"${trimStr(data)}" \n request ${rc} - "${target}" ended \n `))
  })
}
///////////////////////////////////

///////////////////////////////////
function requestUser() {
  return request('ip', null)
}
function requestGetData() {
  return request('getData', null)
}
function requestPostData(data) {
  return request('setData', data || [])
}
///////////////////////////////////

///
function trimStr(str) {
  const trimLen = 50
  try {
    return (str.length > trimLen) ? str.slice(0, trimLen) + "..." : str
  } catch (e) {
    return str
  }
}
function tryParce(str) {
  try {
    return JSON.parse(str,reviver);
  } catch (e) {
    return str;
  }
}
function reviver(key, value) {
  if (typeof value == 'string' && (Boolean(value) !== undefined)) {
    if(value==="false")return false;
    if(value==="true")return true;
  }
  return value;
}
///

//////////////
function loadData() {
  return new Promise((res, rej) => {
    (user === null
      ? requestUser(null)
      : Promise.resolve(null))
      .then(() => requestGetData(null))
      .then((d) => {
        let data = tryParce(d)//here we parce json
        console.log("[DATA] from loadData(): ", data)
        res(data)
      })
      .catch(rej)
  })
}
function postData(postData) {
  (user === null
    ? loadData(null)
    : Promise.resolve(null))
    .then((data) => {
      let pDat = postData == null ? postData.concat(data) : postData
      requestPostData(pDat)
    })
}
//////////////////


const testText = "My little cards-app c:";

let cardCount = 1;
function calcCount(cardsArr) {
  let id = cardCount;
  [...cardsArr].forEach(element => {
    if (Number(element.id) >= id) id = Number(element.id)
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
