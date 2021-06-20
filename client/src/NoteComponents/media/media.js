/**
 * @file media.js
 */
import React, { useContext } from "react"
import PropTypes from 'prop-types'
import "./media.css"
import NotesContext from "../../Context/NotesContext"
import Modal, { ModalProps } from "../../Shared/Components/Modal/Modal"
import { downscaleImage } from "../../Shared/downscaleImage"

const MAX_PAYLOAD_SIZE = 1000000

/**
 * Сжатие url изображения c проверкой размера
 * @param {String} uncompressed 
 * @param {String} type 
 */
async function getCompressed(uncompressed, type) {
  const smallcompressedRes = await downscaleImage(uncompressed, type, 720)
  if (smallcompressedRes.length < MAX_PAYLOAD_SIZE) return smallcompressedRes
  const mediumcompressedRes = await downscaleImage(uncompressed, type, 480)
  if (mediumcompressedRes.length < MAX_PAYLOAD_SIZE) return mediumcompressedRes
  const extracompressedRes = await downscaleImage(uncompressed, type, 240)
  if (extracompressedRes.length < MAX_PAYLOAD_SIZE) return extracompressedRes
  console.error("compressed unsuc, too long url")
  return null
}

/**
 * компонент палитры
 * @param {object} props
 * @param {void} props.setNoteMedia
 * @param {Array<String>} props.mediaList
 * @param {{}} props.style
 * @param {String} props.className
 * @param {Boolean} props.disabled
 * @param {String} props.noteId
 * @param {{}} props.sizeData
 */
function Media({ setNoteMedia, mediaList = [], style, className, disabled, noteId, sizeData }) {
  const { addMedia, removeMedia, getMediaById, getNoteById } = useContext(NotesContext)

  const limited = noteId ? getNoteById(noteId).media.length >= 1 : false

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

    reader.onloadend = async function () {
      const uncompressedReaderRes = reader.result
      const compressedRes = await getCompressed(uncompressedReaderRes, file.type)

      if (compressedRes) {
        const mediaId = addMedia(compressedRes, noteId)
        Array.isArray(mediaList) ? mediaList.push(mediaId) : (mediaList = [mediaId])
        setNoteMedia(mediaList)
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
      <button disabled={disabled} className={`btn ${className}`} style={style} type="button" onClick={open} >
        <i className="bi bi-image" ></i>
      </button>

      {/**Форма media */}
      <Modal {...modalProps.bind()} >
        <div style={{ minHeight: `${sizeData.current ? sizeData.current.parentElement.clientHeight : 100}px` }} className="p-1 d-flex flex-wrap align-content-between align-items-center justify-content-center">

          <div className="form-group container d-flex flex-row flex-wrap align-items-start justify-content-around mb-0">
            {Array.isArray(mediaList) && mediaList.length ? (mediaList.map((imgId, index) => {
              const media = getMediaById(imgId)
              const src = typeof media === "object" && media && media.data
              return (
                <div className="card p-1 m-1" key={imgId} style={{ position: "relative" }}>
                  <img className="img-fluid" style={{ maxWidth: "35em", maxHeight: "15em" }} src={src} alt="note img"></img>
                  <button
                    style={{ position: "absolute", bottom: "0", right: "0", lineHeight: "1em", padding: "0.05em" }}
                    className={`btn btn-danger m-1`}
                    onClick={() => delImg(imgId, index)}
                  >&#10007;</button>
                </div>
              )
            })) : (
              <div className="p-1 m-1 text-center" style={{ minWidth: '100%' }}>
                No images
              </div>
            )}
          </div>

          <div className="form-group container row mb-0">
            <div className="custom-file p-0 col m-1" style={{ minWidth: "7.6em" }}>
              <input style={{ cursor: "pointer" }} disabled={limited} onChange={encodeImageFileAsURLAndPost} type="file" className="custom-file-input" id="noteImgFile" accept=".jpg, .jpeg, .png" />
              <label style={{ boxShadow: "none", border: "lightgray 1px solid" }} className="custom-file-label" htmlFor="noteImgFile">{"Img"}</label>
            </div>
            <button className="btn btn-light col-3 col-sm-2 m-1 ml-auto" style={{ boxShadow: "none", minWidth: "4em" }} onClick={close} >
              Close
            </button>
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






