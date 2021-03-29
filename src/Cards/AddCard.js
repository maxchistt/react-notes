import React, { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types'
function useInputValue(defaultValue) {
    const [value, setValue] = useState(defaultValue)

    return {
        bind: {
            value,
            onChange: event => setValue(event.target.value)
        },
        clear: () => setValue(defaultValue),
        value: () => value
    }
}

function AddCard({ onCreate, onDeleteAll }) {

    const input = useInputValue('')
    const select = useInputValue(0)

    function submitHandler() {
        if (String(input.value()).trim() && String(select.value()).trim()) {
            onCreate({ text: String(input.value()).trim(), sel: Boolean(Number(select.value())) })
            input.clear()
        }
    }

    function onEnter(e) {
        if (e.keyCode === 13) {
            submitHandler();
        }
    }

    return (

        <div className="container">
            <div className="row my-2 text-center">

                <div className="col-lg-12 col-md-12 p-1">
                    <input onKeyDown={onEnter} type="text" className="form-control" placeholder="Card text" id="Text" {...input.bind} />
                </div>

                <div className="col-lg-8 col-md-6 col-sm-4 p-1">
                    <select className="custom-select" id="Status" {...select.bind}>
                        <option value="1">Done</option>
                        <option value="0">Not done</option>
                    </select>
                </div>

                <div className="col-lg-2 col-md-3 col-sm-4 col-6 p-1">
                    <button className="btn btn-success btn-block" onClick={submitHandler}>Add card</button>
                </div>

                <div className="col-lg-2 col-md-3 col-sm-4 col-6 p-1">
                    <button className="btn btn-danger btn-block" onClick={onDeleteAll}>Delete All</button>
                </div>

            </div>
        </div>

    )
}

AddCard.propTypes = {
    onCreate: PropTypes.func.isRequired,
    onDeleteAll: PropTypes.func.isRequired
}

export default AddCard


