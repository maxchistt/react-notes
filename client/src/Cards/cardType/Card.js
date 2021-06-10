/**
 * @file Card.js
 */
import PropTypes from 'prop-types'

/**валидация пропсов заметки*/
export const PropTypeCard = PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    color: PropTypes.string,
    text: PropTypes.string,
})

/**валидация заметки */
export function checkCard(card) {
    return (
        (typeof card.id === "string") &&
        typeof card.name === "string" &&
        typeof card.color === "string" &&
        typeof card.text === "string"
    )
}

/**валидация массива заметок */
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

/**класс заметки */
export class Card {
    constructor({ id, name, color, text }) {
        this.id = String(id)
        this.name = String(name)
        this.color = String(color)
        this.text = String(text)
    }
}

export default Card
