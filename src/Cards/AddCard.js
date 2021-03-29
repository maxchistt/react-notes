import React, { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types'
function useInputValue(defaultValue = undefined) {
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

    function submitHandler(event) {
        //event.preventDefault()

        if (String(input.value()).trim() && String(select.value()).trim()) {
            onCreate({ name: String(input.value()).trim(), sel: Boolean(Number(select.value())) })
            input.clear()
        }
    }

    return (

        <div className="container">
            <div className="row my-2">
                <div className="col-lg-3 col-md-6 p-1">
                    <input type="text" className="form-control" placeholder="Card name" id="Name" {...input.bind} />
                </div>

                <div className="col-lg-3 col-md-6 p-1">
                    <select className="custom-select" id="Status" {...select.bind}>
                        <option value="1">Онлайн</option>
                        <option value="0">Офлайн</option>
                    </select>
                </div>

                <div className="col-lg-3 col-md-6 p-1">
                    <button className="btn btn-success btn-block" onClick={submitHandler}>Add card</button>
                </div>

                <div className="col-lg-3 col-md-6 p-1">
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


