import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Context from '../context'

function createHTML(text) {
    let el = document.createElement("p")
    el.innerText = el.textContent = text
    return { __html: el.innerHTML }
}

function CardItem(props) {
    const { removeCard, changeCardState, setEditCard } = useContext(Context)
    const lineClip = 12
    return (

        <div className="p-1" >
            <div className="card" style={{ color: "white", backgroundColor: props.card.completed ? "green" : "red" }} >

                <div className="card-body" onClick={() => setEditCard(props.index)} >
                    <h5 className="card-title">Id: {props.card.id}</h5>
                    <p
                        className="card-text"
                        style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: String(lineClip), WebkitBoxOrient: "vertical" }}
                        dangerouslySetInnerHTML={createHTML(props.card.text)}
                    />
                </div>

                <div className="card-body pt-0">
                    <button
                        className="btn btn-light p-0"
                        style={{ width: "1.8em", height: "1.8em", float: "right" }}
                        onClick={() => removeCard(props.index)}
                    >
                        &#10007;
                    </button>
                    <button
                        className="btn btn-light p-0 mx-2"
                        style={{ width: "1.8em", height: "1.8em", float: "right" }}
                        onClick={() => changeCardState(props.index)}
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



