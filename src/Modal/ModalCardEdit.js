import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Context from '../context'
import TextareaAutosize from 'react-textarea-autosize'
import { ModalContext } from "./Modal"

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
    const { open, close, isOpen } = React.useContext(ModalContext)
    useEffect(() => { if (props.card !== null && !isOpen) open() }, [props.card]) // eslint-disable-line react-hooks/exhaustive-deps


    function onClose() {
        unsetEditCard()
        close()
    }
    function save(text) {
        editCardContent(props.index, text)
    }
    function onInputCange(e) {
        save(e.target.value)
    }
    function onRemove() {
        unsetEditCard();
        close();
        removeCard(props.index);
    }
    function onStateChange() {
        changeCardState(props.index)
    }

    return (
        <React.Fragment>
            <div className='bg-light'>
                {props.card ? (
                    <React.Fragment>
                        <h1 className="mb-2">Id: {props.card.id}</h1>
                        <h5 className="mb-2">Completed:
                                        <span className="px-2 py-1 m-1 d-inline-block text-center" style={{ borderRadius: "5px", width: "3em", color: "white", backgroundColor: props.card.completed ? "green" : "red" }}>
                                {String(props.card.completed)}
                            </span>
                        </h5>
                        <TextareaAutosize
                            className="form-control p-0 mb-2 bg-light"
                            style={{ border: "none", outline: "none", boxShadow: "none", resize: "none" }}
                            minRows={3}
                            maxRows={calcMaxRows()}
                            value={props.card.text}
                            onChange={onInputCange}
                        />
                    </React.Fragment>
                ) : (
                    <h1>No card</h1>
                )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }} className='bg-light'>
                <div>
                    <button
                        className="btn btn-light mx-1"
                        disabled={!props.card}
                        onClick={onStateChange}
                    >&#10003;</button>
                    <button
                        className="btn btn-light"
                        disabled={!props.card}
                        onClick={onRemove}
                    >&#10007;</button>
                </div>
                <div>
                    <button
                        className="btn btn-light"
                        onClick={onClose}
                    >Close</button>
                </div>
            </div>
        </React.Fragment>
    )
}

ModalCardEdit.propTypes = {
    card: PropTypes.object,
    index: PropTypes.number
}

export default ModalCardEdit
