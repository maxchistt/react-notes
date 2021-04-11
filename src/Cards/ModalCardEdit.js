import React from 'react'
import PropTypes from 'prop-types'
import Context from '../context'
import TextareaAutosize from 'react-textarea-autosize'
import Modal, { ModalProps } from "../Modal/Modal"
import debounce from '../Shared/debounce'

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
    const { removeCard, changeCardState, unsetEditCard, editCardContent } = React.useContext(Context)
    const { card, index } = props

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

    function onInputCange(e) {
        let name = card.name
        let text = card.text
        if (e.target.id === "modal-edit-name") name = e.target.value
        if (e.target.id === "modal-edit-text") text = e.target.value
        save(name, text)
    }

    function tryStateChange() {
        changeCardState(index)
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

    // eslint-disable-next-line no-unused-vars
    const [color, btcolor] = card && card.completed ? ["green", "success"] : ["red", "danger"]

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
                                onChange={debounce(onInputCange, 700)}
                            />

                            <p style={{ fontWeight: "500" }} className="mb-2 text-dark">
                                Completed:
                                <span className={`m-1 d-inline-block text-center badge badge-${btcolor}`} style={{ width: "3em" }}>
                                    {String(card.completed)}
                                </span>
                            </p>

                            <TextareaAutosize
                                className="form-control p-0 mb-2 bg-light"
                                id="modal-edit-text"
                                style={{ border: "none", outline: "none", boxShadow: "none", resize: "none" }}
                                minRows={3}
                                maxRows={calcMaxRows()}
                                value={card.text}
                                onChange={debounce(onInputCange, 1000)}
                            />
                        </React.Fragment>
                    ) : (
                        <h1>No card</h1>
                    )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap" }}>
                    <div>
                        <button
                            className="btn btn-light mx-1"
                            disabled={!card}
                            onClick={tryStateChange}
                        >&#10003;</button>
                        <button
                            className="btn btn-light"
                            disabled={!card}
                            onClick={tryRemove}
                        >&#10007;</button>
                    </div>

                    <div className="mx-auto">
                        <span style={{ color: "lightgray", fontWeight: "400" }}>Id: {card && card.id}</span>
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
