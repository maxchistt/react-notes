import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Context from '../context'
import Card from './class/Card'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

function CardItem(props) {
    const { removeCard, setEditCard } = useContext(Context)
    const { card, index } = props
    const cardItem = card && new Card(card)
    const lineClip = 12
    const bgColor = cardItem.color

    return (

        <div className="p-1" >
            <div className="card" style={{ backgroundColor: bgColor }} >

                <div className="card-body" onClick={() => setEditCard(index)} >
                    <div
                        className="card-title h5"
                        style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: String(lineClip / 2), WebkitBoxOrient: "vertical" }} >
                        <ReactMarkdown remarkPlugins={[gfm]} children={cardItem.name.replace(/\n/gi, '  \n')} />
                    </div>
                    <div
                        className="card-text"
                        style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: String(lineClip), WebkitBoxOrient: "vertical" }}>
                        <ReactMarkdown remarkPlugins={[gfm]} children={cardItem.text.replace(/\n/gi, '  \n')} />
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
    card: PropTypes.object.isRequired,
    index: PropTypes.number
}

export default CardItem



