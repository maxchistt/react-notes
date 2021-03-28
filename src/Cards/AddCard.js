import React from 'react'
// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types'

function AddCard(props) {
    return (

        <div className="container">
            <div className="row my-2">
                <div className="col-lg-3 col-md-6 p-1">
                    <input type="text" className="form-control" placeholder="Card name" id="Name" />
                </div>

                <div className="col-lg-3 col-md-6 p-1">
                    <select className="custom-select" id="Status" >
                        <option value="1">Онлайн</option>
                        <option value="">Офлайн</option>
                    </select>
                </div>

                <div className="col-lg-3 col-md-6 p-1">
                    <button className="btn btn-success btn-block">Add card</button>
                </div>

                <div className="col-lg-3 col-md-6 p-1">
                    <button className="btn btn-danger btn-block" >Delete All</button>
                </div>



            </div>
        </div>

    )
}

AddCard.propTypes = {

}

export default AddCard


