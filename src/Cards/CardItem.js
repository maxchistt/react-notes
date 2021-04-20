import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Context from '../context'
import Card from '../Shared/Card'
//import Palette from './palette'

function createHTML(text) {
    let el = document.createElement("p")
    el.innerText = el.textContent = text
    return { __html: el.innerHTML }
}

function CardItem(props) {
    const { removeCard, /*changeCardColor,*/ setEditCard } = useContext(Context)
    const { card, index } = props
    const cardItem = card && new Card(card)
    const lineClip = 12
    const bgColor = cardItem.color
    /*function tryChangeColor(color) {
        changeCardColor(index, color)
    }*/
    return (

        <div className="p-1" >
            <div className="card" style={{ backgroundColor: bgColor }} >

                <div className="card-body" onClick={() => setEditCard(index)} >
                    <h5
                        className="card-title"
                        style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: String(lineClip / 2), WebkitBoxOrient: "vertical" }}
                        dangerouslySetInnerHTML={createHTML(cardItem.name)}
                    />
                    <p
                        className="card-text"
                        style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: String(lineClip), WebkitBoxOrient: "vertical" }}
                        dangerouslySetInnerHTML={createHTML(cardItem.text)}
                    />
                </div>

                <div className="card-body pt-0">
                    <button
                        className={`btn btn-light p-0`}
                        style={{ width: "1.8em", height: "1.8em", float: "right", borderColor: "transparent", backgroundColor: "transparent" }}
                        onClick={() => removeCard(index)}
                    >
                        &#10007;
                    </button>
                    {/*<Palette
                        className={`btn btn-light p-0 mx-2`}
                        style={{ width: "1.8em", height: "1.8em", float: "right", borderColor: "transparent", backgroundColor: "transparent" }}
                        setColor={tryChangeColor}
                    ></Palette>*/}
                </div>

            </div>
        </div>

    )
}

CardItem.propTypes = {
    card: PropTypes.object.isRequired,
    index: PropTypes.number
}

export default CardItem



