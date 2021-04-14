import React from 'react'
import PropTypes from 'prop-types'
import CardItem from './CardItem'
import StackGrid from "../StackGrid/StackGrid"

function CardList(props) {
    return (
        <div className="container p-0" style={{ width: "100%"}}>
            <StackGrid>
                {props.cards.map ? (props.cards.map((card, index) => {
                    return (
                        <CardItem card={card} key={index} index={index} />
                    )
                })) : null}
            </StackGrid>
        </div>
    )
}

CardList.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default CardList
