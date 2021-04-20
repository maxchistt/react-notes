import React from 'react'
import PropTypes from 'prop-types'
import Context from '../context'
import TextareaAutosize from 'react-textarea-autosize'
import Modal, { ModalProps } from "../Shared/Modal/Modal"
import debounce from '../Shared/debounce'
import Card from '../Cards/class/Card'
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

function ModalCardEdit(props) {
    const { removeCard, changeCardColor, unsetEditCard, editCardContent } = React.useContext(Context)
    const { card, index } = props
    React.useEffect(() => { if (card !== null) open() }, [card])

    const cardEdit = card && new Card(card)

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

    function onInputCange(e) {
        let name = cardEdit.name
        let text = cardEdit.text
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
                    {cardEdit ? (
                        <React.Fragment>
                            <TextareaAutosize
                                className="form-control form-control-lg p-0 mb-2 bg-light text-dark"
                                id="modal-edit-name"
                                style={{ color: "black", fontWeight: "600", fontSize: 'x-large', border: "none", outline: "none", boxShadow: "none", resize: "none" }}
                                minRows={1}
                                maxRows={3}
                                maxLength="100"
                                value={cardEdit.name}
                                onChange={debounce(onInputCange, 700)}
                            />

                            <p style={{ fontWeight: "500" }} className="mb-2 text-dark">
                                Color:
                                <span className={`m-1 d-inline-block text-center badge border border-secondary`} style={{ width: "3em", backgroundColor: cardEdit.color }}>
                                    &nbsp;
                                </span>
                            </p>

                            <TextareaAutosize
                                className="form-control p-0 mb-2 bg-light"
                                id="modal-edit-text"
                                style={{ border: "none", outline: "none", boxShadow: "none", resize: "none" }}
                                minRows={3}
                                maxRows={calcMaxRows()}
                                value={cardEdit.text}
                                onChange={debounce(onInputCange, 1000)}
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
                            disabled={!cardEdit}
                            setColor={tryChangeColor}
                        ></Palette>
                        <button
                            className="btn btn-light"
                            disabled={!cardEdit}
                            onClick={tryRemove}
                        >&#10007;</button>
                    </div>

                    <div className="mx-auto">
                        <span style={{ color: "lightgray", fontWeight: "400" }}>Id: {cardEdit && cardEdit.id}</span>
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
    card: PropTypes.object,
    index: PropTypes.number,

    //isOpen: PropTypes.bool,
    //setOpenState: PropTypes.func
}

export default ModalCardEdit
