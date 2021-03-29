import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Context from '../context'

function CardItem(props) {
    const { removeCard } = useContext(Context);
    return (

        <div className="p-1 col-lg-3 col-md-6" >

            <div className="card" style={{ color: "white", backgroundColor: props.card.completed ? "green" : "red" }} >
                <div className="card-body">
                    <h5 className="card-title">Card Id: {props.card.id}</h5>
                    <p className="card-text">Name: {props.card.title}</p>
                    <button className="btn btn-light p-0" style={{ width: "1.8em", height: "1.8em", float: "right" }} onClick={() => removeCard(props.card.id)}>&times;</button>
                </div>
            </div>

        </div>

    )
}

CardItem.propTypes = {
    card: PropTypes.object.isRequired,
    index: PropTypes.number,
    onChange: PropTypes.func.isRequired
}

export default CardItem



