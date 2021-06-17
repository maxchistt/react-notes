/**
 * @file media.js
 */
import React, { useContext } from "react"
import PropTypes from 'prop-types'
import "./media.css"
import NotesContext from "../../Context/NotesContext"
import Modal, { ModalProps } from "../../Shared/Components/Modal/Modal"

const MAX_PAYLOAD_SIZE = 100 * 1024

/**
 * компонент палитры
 * @param {*} param0 
 *  
 */
function Media({ setNoteMedia, mediaList = [], style, className, disabled, noteId }) {
  const { addMedia, removeMedia, getMediaById, getNoteById } = useContext(NotesContext)

  const limited = getNoteById(noteId).media.length >= 3

  /**хук состояния формы */
  const [showForm, setShowForm] = React.useState(false)

  /**создание параметров модального окна*/
  const modalProps = new ModalProps()
  modalProps.isOpen = showForm
  modalProps.setOpenState = setShowForm
  modalProps.sideClose = true

  /**открытие окна */
  function open() {
    setShowForm(true)
  }

  /**закрытие окна */
  function close() {
    setShowForm(false)
  }

  function encodeImageFileAsURLAndPost(e) {
    var file = e.target.files[0]
    var reader = new FileReader()

    reader.onloadend = function () {
      const res = reader.result
      if (res.length < MAX_PAYLOAD_SIZE) {
        console.log("readed suc", res.length)
        const mediaId = addMedia(res, noteId)
        Array.isArray(mediaList) ? mediaList.push(mediaId) : (mediaList = [mediaId])
        setNoteMedia(mediaList)
      } else {
        console.error("readed unsuc", res.length)
      }
      e.target.value = null
    }

    if (file !== undefined) reader.readAsDataURL(file)
  }

  function delImg(imgId, index) {
    removeMedia(imgId)
    mediaList.splice(index, 1)
    setNoteMedia(mediaList)
  }

  return (
    <React.Fragment>
      {/**Кнопка вызова media */}
      <button
        disabled={disabled}
        className={`btn ${className}`}
        style={style}
        type="button"
        onClick={open}
      >
        <i className="bi bi-image" ></i>
      </button>

      {/**Форма media */}
      <Modal {...modalProps.bind()} >
        <div className="p-1 d-flex flex-row flex-wrap justify-content-center align-items-center">

          <div className="form-group container d-flex flex-row flex-wrap mb-0">
            {Array.isArray(mediaList) ? (mediaList.map((imgId, index) => {
              const media = getMediaById(imgId)
              const src = typeof media === "object" && media && media.data
              return (
                <div className="card p-1 m-1" key={imgId} style={{ position: "relative" }}>
                  <img style={{ maxWidth: "8em", maxHeight: "8em" }} src={src} alt="note img"></img>
                  <button
                    style={{ position: "absolute", bottom: "0", right: "0", lineHeight: "1em", padding: "0.05em" }}
                    className={`btn btn-danger m-1`}
                    onClick={() => delImg(imgId, index)}
                  >&#10007;</button>
                </div>
              )
            })) : null}
          </div>

          <div className="form-group container d-flex flex-wrap justify-content-between mb-0">
            <div className="custom-file mb-0 m-1" style={{ maxWidth: "14em" }}>
              <input disabled={limited} onChange={encodeImageFileAsURLAndPost} type="file" className="custom-file-input" id="noteImgFile" accept=".jpg, .jpeg, .png" />
              <label className="custom-file-label" htmlFor="noteImgFile">{"Img - 100Kb max"}</label>
            </div>
            <button
              className="btn btn-light m-1"
              style={{ boxShadow: "none" }}
              onClick={close}
            >Close</button>
          </div>

        </div>
      </Modal>

    </React.Fragment>
  );
}

// Валидация
Media.propTypes = {
  setNoteMedia: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
}

export default Media;






