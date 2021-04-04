import React from 'react'
import PropTypes from 'prop-types'
import CardItem from './CardItem'
import StackGrid, { transitions } from "react-stack-grid"
import sizeMe from 'react-sizeme'
const { scaleDown } = transitions

function calcWidth() {
    const small = 576
    const middle = 768
    const large = 992
    const xlarge = 1200
    const winWidth = window.innerWidth

    if (winWidth >= xlarge) return '20%'
    else if (winWidth >= large) return '25%'
    else if (winWidth >= middle) return '33.33%'
    else if (winWidth >= small) return '50%'
    else return '100%'
}

function CardList(props) {
    const [grid, setGrid] = React.useState(null)
    gridRedraw()
    function gridRedraw(delay = 10) {
        setTimeout(() => { if (grid && grid.updateLayout) grid.updateLayout() }, delay)
    }

    const gridSettings = {
        gridRef: setGrid,
        columnWidth: calcWidth(),
        gutterWidth: 0,
        gutterHeight: 0,

        appear: scaleDown.appear,
        appeared: scaleDown.appeared,
        enter: scaleDown.enter,
        entered: scaleDown.entered,
        leaved: scaleDown.leaved
    }

    return (
        <StackGrid className="container p-0" {...gridSettings}>
            {props.cards.map ? (props.cards.map((card, index) => {
                return (
                    <CardItem card={card} key={index} index={index} />
                )
            })) : null}
        </StackGrid>
    )
}

CardList.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default sizeMe()(CardList)
