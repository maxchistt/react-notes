import PropTypes from 'prop-types'

export const PropTypeCard = PropTypes.shape({
    id:  PropTypes.string,
    name: PropTypes.string,
    color: PropTypes.string,
    text: PropTypes.string,
})

export function checkCard(card) {
    return (
        (typeof card.id === "string") &&
        typeof card.name === "string" &&
        typeof card.color === "string" &&
        typeof card.text === "string"
    )
}

export function checkCardsArr(cardsArr) {
    if (!Array.isArray(cardsArr)) return false
    else if (cardsArr.length === 0) return true
    else {
        let res = true
        cardsArr.forEach((card) => {
            if (typeof card !== "object") res = false
            else if (!checkCard(card)) res = false
        })
        return res
    }
}

export class Card {
    constructor({ id, name, color, text }) {
        this.id = String(id)
        this.name = String(name)
        this.color = String(color)
        this.text = String(text)
    }
}

export default Card
