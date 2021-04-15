import React, { useState } from 'react'
import PropTypes from 'prop-types'
import TextareaAutosize from 'react-textarea-autosize'
import Palette, { colors } from './palette'

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

  const defColor = colors[0]
  const [color, setColor] = React.useState(defColor)

  function submitHandler() {
    if (String(input.value()).trim() && String(color).trim()) {
      onCreate({ name: String(input.value()).trim(), text: "", color: String(color) })
      input.clear()
      setColor(defColor)
    }
  }

  return (
    <div className="container">
      <div className="row my-2 text-center">

        <div className="col-lg-12 col-md-12 p-1">
          <TextareaAutosize type="text" className="form-control" placeholder="Card name" id="Text"
            {...input.bind}
            style={{ resize: "none" }}
            minRows={1}
            maxRows={3}
            maxLength="100"
          />
        </div>

        <div className="col-lg-8 col-md-6 col-sm-4 p-1">
          <Palette setColor={setColor} className="btn btn-outline-secondary" style={{ width: "100%" }}></Palette>
        </div>

        <div className="col-lg-2 col-md-3 col-sm-4 col-6 p-1">
          <button disabled={!input.value().trim()} className="btn btn-success btn-block" onClick={submitHandler}><i className="bi bi-clipboard-plus"></i> Add card</button>
        </div>

        <div className="col-lg-2 col-md-3 col-sm-4 col-6 p-1">
          <button className="btn btn-danger btn-block" onClick={onDeleteAll}><i className="bi bi-x-square"></i> Delete All</button>
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
