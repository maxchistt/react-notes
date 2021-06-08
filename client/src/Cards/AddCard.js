import React from 'react'
import PropTypes from 'prop-types'
import TextareaAutosize from 'react-textarea-autosize'
import Palette, { colors } from './palette/palette'
import useInputValue from '../Shared/useInputValue.hook'
import CardsContext from '../Context/cardsContext'

function AddCard() {
  const { addCard } = React.useContext(CardsContext)
  const input = useInputValue('')

  const defColor = colors[0]
  const [color, setColor] = React.useState(defColor)
  const blackOnHover = () => {
    switch (color) {
      case colors[0]:
      case colors[2]:
      case colors[3]:
      case colors[4]:
      case colors[6]:
      case colors[8]:
        return true
      default:
        return false
    }
  }

  function submitHandler() {
    if (String(input.value).trim() && String(color).trim()) {
      addCard({ name: String(input.value).trim(), text: "", color: String(color) })
      input.clear()
      setColor(defColor)
    }
  }

  function onEnter(e) {
    e.preventDefault()
    submitHandler()
  }

  return (
    <div className="container">
      <div className="row my-2 text-center">

        <div className="col-xl-10 col-lg-10 col-md-10 col-12 p-1">
          <TextareaAutosize type="text" className="form-control" placeholder="Card name" id="Text"
            {...input.bind}
            style={{ resize: "none" }}
            minRows={1}
            maxRows={3}
            maxLength="100"
            onKeyPress={e => {
              e.key === "\n" && input.addBreak()
              e.key === 'Enter' && onEnter(e)
            }}
          />
        </div>

        <div className="col-xl-1 col-lg-1 col-md-1 col-sm-3 col-4 p-1">
          <Palette setColor={setColor} className={`btn btn-outline-secondary palitra-btn ${blackOnHover() ? "palitra-blackOnHover" : "palitra-lightOnHover"}`} style={{ width: "100%", background: color }}></Palette>
        </div>

        <div className="col-xl-1 col-lg-1 col-md-1 col p-1">
          <button disabled={!input.value.trim()} className="btn btn-success btn-block" onClick={submitHandler}>
            <i className="bi bi-clipboard-plus"></i>
          </button>
        </div>

      </div>
    </div>
  )
}

AddCard.propTypes = {
  onDeleteAll: PropTypes.func.isRequired
}

export default AddCard
