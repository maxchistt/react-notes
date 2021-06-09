import React from 'react'
import PropTypes from 'prop-types'
import CardsContext from '../Context/CardsContext'
import TextareaAutosize from 'react-textarea-autosize'
import Modal, { ModalProps } from "../Shared/Modal/Modal"
import Card, { PropTypeCard } from './cardType/Card'
import Palette from './palette/palette'

function calcMaxRows() {
    const small = 576
    const middle = 768
    const large = 992
    const winWidth = window.innerWidth


    if (winWidth < small) return '7'
    else if (winWidth < middle) return '8'
    else if (winWidth < large) return '10'
    else return '17'
}

function ModalCardEdit({ card = new Card(), index }) {
    const { removeCard, changeCardColor, unsetEditCard, editCardContent } = React.useContext(CardsContext)
    React.useEffect(() => { if (card !== null) open() }, [card])

    const [showForm, setShowForm] = React.useState(false)

    const modalProps = new ModalProps()
    modalProps.isOpen = showForm
    modalProps.setOpenState = setShowForm
    modalProps.sideClose = true
    modalProps.onSideClick = unsetEditCard

    function open() {
        setShowForm(true)
    }

    function close() {
        setShowForm(false)
    }

    /////

    function save(name, text) {
        editCardContent(index, name, text)
    }

    function onInputChange(e) {
        let name = card.name
        let text = card.text
        if (e.target.id === "modal-edit-name") name = e.target.value
        if (e.target.id === "modal-edit-text") text = e.target.value
        save(name, text)
    }

    function tryChangeColor(color) {
        changeCardColor(index, color)
    }
    function tryRemove() {
        unsetEditCard();
        close();
        removeCard(index);
    }
    function tryClose() {
        unsetEditCard()
        close()
    }

    return (
        <Modal {...modalProps.bind()}>
            <div className="container p-2">
                <div>
                    {card ? (
                        <React.Fragment>
                            <TextareaAutosize
                                className="form-control form-control-lg p-0 mb-2 bg-light text-dark"
                                id="modal-edit-name"
                                style={{ color: "black", fontWeight: "600", fontSize: 'x-large', border: "none", outline: "none", boxShadow: "none", resize: "none" }}
                                minRows={1}
                                maxRows={3}
                                maxLength="100"
                                value={card.name}
                                onChange={onInputChange}
                            />

                            <p style={{ fontWeight: "500" }} className="mb-2 text-dark">
                                Color:
                                <span className={`m-1 d-inline-block text-center badge border border-secondary`} style={{ width: "3em", backgroundColor: card.color }}>
                                    &nbsp;
                                </span>
                            </p>

                            <TextareaAutosize
                                className="form-control p-0 mb-2 bg-light"
                                id="modal-edit-text"
                                style={{ border: "none", outline: "none", boxShadow: "none", resize: "none" }}
                                minRows={3}
                                maxRows={calcMaxRows()}
                                value={card.text}
                                onChange={onInputChange}
                            />
                        </React.Fragment>
                    ) : (
                        <h1>No card</h1>
                    )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap" }}>
                    <div>
                        <Palette
                            className="btn btn-light mx-1"
                            disabled={!card}
                            setColor={tryChangeColor}
                        ></Palette>
                        <button
                            className="btn btn-light"
                            disabled={!card}
                            onClick={tryRemove}
                        >&#10007;</button>
                    </div>

                    <div className="mx-auto">
                        <span style={{ color: "lightgray", fontWeight: "400" }}>Id {index}</span>
                    </div>

                    <div>
                        <button
                            className="btn btn-light"
                            onClick={tryClose}
                        >Close</button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

ModalCardEdit.propTypes = {
    card: PropTypeCard,
    index: PropTypes.number,
}

export default ModalCardEdit
