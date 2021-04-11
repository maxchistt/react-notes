import React from 'react'
import PropTypes from 'prop-types'
import Context from '../context'
import TextareaAutosize from 'react-textarea-autosize'
import Modal, { ModalProps } from "../Modal/Modal"

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

    function save(text) {
        editCardContent(index, text)
    }
    function onInputCange(e) {
        save(e.target.value)
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
    const [color, btcolor] = card&&card.completed ? ["green", "success"] : ["red", "danger"]

    return (
        <Modal {...modalProps.bind()}>
            <div className="container p-2">

                <div>
                    {card ? (
                        <React.Fragment>
                            <h1 className="mb-2">Id: {card.id}</h1>
                            <h5 className="mb-2">Completed:
                            <span
                                    className={`p-1 m-1 d-inline-block text-center badge badge-${btcolor}`}
                                    style={{ width: "3em" }}
                                >
                                    {String(card.completed)}
                                </span>
                            </h5>
                            <TextareaAutosize
                                className="form-control p-0 mb-2 bg-light"
                                style={{ border: "none", outline: "none", boxShadow: "none", resize: "none" }}
                                minRows={3}
                                maxRows={calcMaxRows()}
                                value={card.text}
                                onChange={onInputCange}
                            />
                        </React.Fragment>
                    ) : (
                        <h1>No card</h1>
                    )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
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
