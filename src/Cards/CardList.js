import React from 'react'
import PropTypes from 'prop-types'
import CardItem from './CardItem'
import StackGrid, { transitions } from "react-stack-grid";
import sizeMe from 'react-sizeme';

const { scaleDown } = transitions;

class CardList extends React.Component {
    calcWidth() {
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

    gridRedraw(delay = 10) { setTimeout(() => { if (this.grid) this.grid.updateLayout() }, delay) }

    render() {
        this.gridRedraw()
        return (
            <StackGrid className="container p-0"
                gridRef={grid => this.grid = grid}
                columnWidth={this.calcWidth()}
                gutterWidth={0}
                gutterHeight={0}
                //onLayout={() => console.log("`onLayout()` has been called.")}
                appearDelay={0}
                appear={scaleDown.appear}
                appeared={scaleDown.appeared}
                enter={scaleDown.enter}
                entered={scaleDown.entered}
                leaved={scaleDown.leaved}
            >
                {this.props.cards.map((card, index) => {
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
}

CardList.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default sizeMe()(CardList)
