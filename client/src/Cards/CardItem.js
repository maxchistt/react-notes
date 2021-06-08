import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import CardsContext from '../Context/cardsContext'
import Card, { PropTypeCard } from './cardType/Card'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

function fixLineBreaks(mdStr) {
    return String(mdStr).replace(/\n/gi, '  \n')
}

function CardItem({ card = new Card(), index }) {
    const { removeCard, setEditCard } = useContext(CardsContext)
    const lineClip = 12
    const bgColor = card.color

    return (

        <div className="p-1" >
            <div className="card" style={{ backgroundColor: bgColor }} >

                <div className="card-body" onClick={() => setEditCard(index)} >
                    <div
                        className="card-title h5"
                        style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: String(lineClip / 2), WebkitBoxOrient: "vertical" }} >
                        <ReactMarkdown remarkPlugins={[gfm]} children={fixLineBreaks(card.name)} />
                    </div>
                    <div
                        className="card-text"
                        style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: String(lineClip), WebkitBoxOrient: "vertical" }}>
                        <ReactMarkdown remarkPlugins={[gfm]} children={fixLineBreaks(card.text)} />
                    </div>
                </div>

                <div className="card-body pt-0">
                    <button
                        className={`btn btn-light p-0`}
                        style={{ width: "1.8em", height: "1.8em", float: "right", borderColor: "transparent", backgroundColor: "transparent" }}
                        onClick={() => removeCard(index)}
                    >
                        &#10007;
                    </button>
                </div>

            </div>
        </div>

    )
}

CardItem.propTypes = {
    card: PropTypeCard.isRequired,
    index: PropTypes.number
}

export default CardItem



