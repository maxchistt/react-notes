
function checkCard(card) {
    return (
        typeof card.id === "string" &&
        typeof card.name === "string" &&
        typeof card.color === "string" &&
        typeof card.text === "string"
    )
}

function checkCardsArr(cardsArr) {
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

module.exports = { checkCardsArr, checkCard }