import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Context from '../context'
import Card from '../Shared/Card'

function createHTML(text) {
    let el = document.createElement("p")
    el.innerText = el.textContent = text
    return { __html: el.innerHTML }
}

function CardItem(props) {
    const { removeCard, changeCardState, setEditCard } = useContext(Context)
    const { card, index } = props
    const cardItem = card && new Card(card)
    const lineClip = 12
    const [color, btcolor] = cardItem && cardItem.completed ? ["green", "success"] : ["red", "danger"]
    return (

        <div className="p-1" >
            <div className="card" style={{ color: "white", backgroundColor: color }} >

                <div className="card-body" onClick={() => setEditCard(index)} >
                    <h5 className="card-title">{cardItem.name}</h5>
                    <p
                        className="card-text"
                        style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: String(lineClip), WebkitBoxOrient: "vertical" }}
                        dangerouslySetInnerHTML={createHTML(cardItem.text)}
                    />
                </div>

                <div className="card-body pt-0">
                    <button
                        className={`btn btn-${btcolor} p-0`}
                        style={{ width: "1.8em", height: "1.8em", float: "right", borderColor: "transparent", backgroundColor: "transparent" }}
                        onClick={() => removeCard(index)}
                    >
                        &#10007;
                    </button>
                    <button
                        className={`btn btn-${btcolor} p-0 mx-2`}
                        style={{ width: "1.8em", height: "1.8em", float: "right", borderColor: "transparent", backgroundColor: "transparent" }}
                        onClick={() => changeCardState(index)}
                    >
                        &#10003;
                    </button>
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



