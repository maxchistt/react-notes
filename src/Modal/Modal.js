import React from 'react'
import PropTypes from 'prop-types'
import './Modal.css'
import Context from '../context'

function Modal(props) {
    const [isOpen, setOpenState] = React.useState(false)
    const { removeCard, changeCardState, unsetEditCard } = React.useContext(Context)

    if (props.card !== null && !isOpen) open()

    function open() {
        setOpenState(true)
    }

    function close() {
        unsetEditCard()
        setOpenState(false)
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
                                    <h1>Id: {props.card.id}</h1>
                                    <h5>Completed: {String(props.card.completed)}</h5>
                                    <p>{props.card.text}</p>
                                </React.Fragment>
                            ) : (
                                <h1>No card</h1>
                            )}
                        </div>

                        <div className='edit-modal-footer'>
                            {props.card ? (
                                <div>
                                    <button
                                        className="btn btn-light mx-1"
                                        onClick={() => changeCardState(props.card.id)}
                                    >&#10003;</button>
                                    <button
                                        className="btn btn-light"
                                        onClick={() => { close(); removeCard(props.card.id); }}
                                    >&#10007;</button>
                                </div>
                            ) : (
                                null
                            )}
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
    card: PropTypes.object.isRequired
}

export default Modal
