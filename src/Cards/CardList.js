import React from 'react'
import PropTypes from 'prop-types'
import CardItem from './CardItem'
import StackGrid, { transitions } from "react-stack-grid";

const { scaleDown } = transitions;

function CardList(props) {
    return (
        <div className="container p-0">
            <StackGrid
                appear={scaleDown.appear}
                appeared={scaleDown.appeared}
                enter={scaleDown.enter}
                entered={scaleDown.entered}
                leaved={scaleDown.leaved}
            >
                {props.cards.map((card, index) => {
                    return (
                        <CardItem
                            card={card}
                            key={card.id}
                            index={index}
                        />
                    )
                })}
            </StackGrid>
        </div>

    )
}

CardList.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default CardList

