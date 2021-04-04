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

const url = 'http://php-server-notes/'
let user = null

let recuestCount = 1;

function request(target, data, clb) {
  const rc = recuestCount++
  console.log(` \nrequest ${rc} - "${target}" started`)
  console.log(`params - user:"${user}" target:"${target}" data:"${data}"`)
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
      .always((data) => console.log(`requested - newUser:"${user}" target:"${target}" resolveData:"${trimStr(data)}"`))
      .done((data) => { if (clb) clb(data); res(data) })
      .fail((data) => { console.error(data); rej(data) })
      .always(() => console.log(`request ${rc} - "${target}" ended \n `))
  })

}

///////////////////////////////////

function requestUser(clb) {
  return request('ip', null,
    clb !== undefined
      ? clb
      : (usr) => {
        user = String(usr)
        console.log(`[req-clb-done] requestUser: ${usr}`)
      })
}

function requestGetData(clb) {
  return request('getData', null,
    clb !== undefined
      ? clb
      : (data) => {
        console.log(`[req-clb-done] requestGetData - data: ${trimStr(data)}`)
      })
}

function requestPostData(data = [], clb) {
  return request('setData', data,
    clb !== undefined
      ? clb
      : (req) => {
        console.log(`[req-clb-done] requestPostData - req: ${req}`)
      })
}

//////////////
function trimStr(str) {
  const trimLen = 50;
  return (str.length > trimLen) ? str.slice(0, trimLen) + "..." : str
}

function tryParce(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}
//////////////



////////////////////////////
var cardsLoadedArr = [];
function loadData() {
  return new Promise((res, rej) => {
    (user === null
      ? requestUser(null)
      : Promise.resolve(null))
      .then(() => requestGetData(null))
      .then((d) => {
        let data = tryParce(d)//here we parce json
        console.log("data from loadData(): ", trimStr(data))
        cardsLoadedArr = data
        
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
      let pDat = cardsLoadedArr == null ? postData.concat(data) : postData
      requestPostData(pDat)
    })
}

//////////////////


const testText = "My little cards-app c:";

let cardCount = 1;
function calcCount(cardsArr) {
  let id = cardCount;
  new Array(...cardsArr).forEach(element => {
    if (Number(element.id) >= id) id = Number(element.id)
  });
  return id
}

function App() {
  const [cardsArr, setCards] = React.useState([])
  const [editCardId, setEditCardId] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => { console.log("hook-cardsArr"); console.log(trimStr(cardsArr)) }, [cardsArr])
  React.useEffect(loadDataFromServer, [])


  function loadDataFromServer() {
    console.log("hook - loadDataFromServer")
    loadData().then(setLoadedCards)
  }



  function setLoadedCards(cardsLoadedArr) {
    console.log("hook's then - set loaded cards")
    console.log(trimStr(cardsLoadedArr))

    console.log("\n \n ***  \n ")
    let valToSet = tryParce(cardsLoadedArr)
    console.log("let valToSet = tryParce(cardsLoadedArr) :")
    console.log(valToSet)
    console.log("\n *** \n \n")

    setCards(valToSet)
    cardCount = calcCount(cardsArr)
    setLoading(false)
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
          id: Number(cardCount),
          completed: Boolean(cardData.sel),
          text: String(cardData.text)
        }
      ])
    )
    cardCount++
  }

  function getCardById(index) {
    return index !== null ? cardsArr[index] : null
  }

  function setEditCard(index) {
    setEditCardId(index)
  }

  function unsetEditCard() {
    setEditCardId(null)
  }

  function changeCardState(index) {
    cardsArr[index].completed = !cardsArr[index].completed
    setCards([...cardsArr])
  }

  function editCardContent(index, text) {
    if (cardsArr[index]) cardsArr[index].text = text
    setCards([...cardsArr])
  }

  return (
    <Context.Provider value={{ removeCard, changeCardState, setEditCard, unsetEditCard, editCardContent }}>
      <div className="App">
        <header className="p-1 h2 text-center">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="d-inline-block h2">{testText}</h1>
        </header>

        <main className="p-1">

          <AddCard onCreate={addCard} onDeleteAll={deleteAll} />
          {getCardById(editCardId) && <Modal card={getCardById(editCardId)} index={editCardId} />}
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
