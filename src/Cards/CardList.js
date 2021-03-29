import React from 'react'
import PropTypes from 'prop-types'
import CardItem from './CardItem'


function CardList(props) {
    return (
        <div className="container">
            <div className="row">
                {props.cards.map((card, index) => {
                    return (
                        <CardItem
                            card={card}
                            key={card.id}
                            index={index}
                        />
                    )
                })}

            </div>
        </div>

    )
}

CardList.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default CardList

