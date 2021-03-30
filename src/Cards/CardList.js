import React from 'react'
import PropTypes from 'prop-types'
import CardItem from './CardItem'
import StackGrid, { transitions } from "react-stack-grid";
import sizeMe from 'react-sizeme';
import { createGridUpdater } from '../Content/GridLayoutUpdater'

const { scaleDown } = transitions;

let gridUpdater = createGridUpdater();

function calcWidth() {
    const smallMonitorWidth = 576
    const middleMonitorWidth = 768
    const winWidth = window.innerWidth

    if (winWidth >= middleMonitorWidth) return '33.33%'
    else if (winWidth >= smallMonitorWidth) return '50%'
    else return '100%'
}

function CardList(props) {
    return (
        <StackGrid className="container p-0"
            gridRef={gridR => gridUpdater.setGridRef(gridR)}
            appear={scaleDown.appear}
            appeared={scaleDown.appeared}
            enter={scaleDown.enter}
            entered={scaleDown.entered}
            leaved={scaleDown.leaved}
            columnWidth={calcWidth()}
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
    )
}

CardList.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default sizeMe()(CardList)
