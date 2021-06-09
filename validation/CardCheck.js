function checkCard(card) {
    return (
        typeof card.id === "string" &&
        typeof card.name === "string" &&
        typeof card.color === "string" &&
        typeof card.text === "string"
    )
}

module.exports = { checkCard }