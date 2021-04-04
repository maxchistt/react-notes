import React from 'react'
import PropTypes from 'prop-types'
import './Modal.css'
import Context from '../context'
import TextareaAutosize from 'react-textarea-autosize'

function Modal(props) {
    const [isOpen, setOpenState] = React.useState(false)
    const { removeCard, changeCardState, unsetEditCard, editCardContent } = React.useContext(Context)


    if (props.card !== null && !isOpen) open()

    function open() {
        setOpenState(true)
    }

    function close() {
        unsetEditCard()
        setOpenState(false)
    }

    function save(text) {
        editCardContent(props.index, text)
    }

    return (
        <React.Fragment>
            <div className="container p-1 d-none">
                <button className="btn" onClick={open}>Open modal</button>
            </div>

            {isOpen && (
                <div className='edit-modal' onClick={(e) => { if (e.target.className === 'edit-modal') close() }}>
                    <div className='edit-modal-body'>

                        <div className='edit-modal-content'>
                            {props.card ? (
                                <React.Fragment>
                                    <h1 className="mb-2">Id: {props.card.id}</h1>
                                    <h5 className="mb-2">Completed:
                                        <span className="px-2 py-1 m-1 d-inline-block text-center" style={{borderRadius:"5px", width:"3em", color: "white", backgroundColor: props.card.completed ? "green" : "red" }}>
                                            {String(props.card.completed)}
                                        </span>
                                    </h5>
                                    <TextareaAutosize
                                        className="form-control p-0 mb-2"
                                        style={{ border: "none", outline: "none", boxShadow: "none", resize: "none" }}
                                        minRows={3}
                                        maxRows={17}
                                        value={props.card.text}
                                        onChange={(e) => save(e.target.value)}
                                    />
                                </React.Fragment>
                            ) : (
                                <h1>No card</h1>
                            )}
                        </div>

                        <div className='edit-modal-footer'>
                            <div>
                                <button
                                    className="btn btn-light mx-1"
                                    disabled={!props.card}
                                    onClick={() => changeCardState(props.card.id)}
                                >&#10003;</button>
                                <button
                                    className="btn btn-light"
                                    disabled={!props.card}
                                    onClick={() => { close(); removeCard(props.card.id); }}
                                >&#10007;</button>
                            </div>
                            <div>
                                <button
                                    className="btn btn-light"
                                    onClick={close}
                                >Close</button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </React.Fragment>
    )
}

Modal.propTypes = {
    card: PropTypes.object.isRequired,
    index: PropTypes.number
}

export default Modal
