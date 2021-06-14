/**
 * @file NoteList.js
 */
import React from 'react'
import PropTypes from 'prop-types'
import NoteItem from './NoteItem'
import StackGrid, { transitions } from "react-stack-grid"
import sizeMe from 'react-sizeme'
import { sortByOrder } from '../Shared/order'
const { scaleDown } = transitions

/**расчет ширины столбцов */
function calcWidth() {
    const small = 576
    const middle = 768
    const large = 992
    const xlarge = 1200
    const winWidth = document.getElementsByTagName('main')[0].clientWidth || window.innerWidth

    if (winWidth >= xlarge) return '25%'
    else if (winWidth >= large) return '33.33%'
    else if (winWidth >= middle) return '50%'
    else if (winWidth >= small) return '100%'
    else return '100%'
}

/** Компонент списка карточек */
function NoteList(props) {
    const grid = React.useRef(null)
    React.useEffect(gridRedraw, [props.size])

    /**обновление рендера */
    function gridRedraw() {
        setTimeout(() => { if (grid.current && grid.current.updateLayout) grid.current.updateLayout() }, 10)
    }

    /**параметры сетки */
    const gridSettings = {
        ref: grid,
        columnWidth: calcWidth(),
        gutterWidth: 0,
        gutterHeight: 0,

        appear: scaleDown.appear,
        appeared: scaleDown.appeared,
        enter: scaleDown.enter,
        entered: scaleDown.entered,
        leaved: scaleDown.leaved
    }

    /**рендер */
    return (
        <div className="p-0 m-0 px-sm-1 px-md-2 px-lg-3 px-xl-4">
            {/**Отзывчивая сетка карточек */}
            <StackGrid className="container p-0" {...gridSettings}>
                {/**Рендер каждой карточки из массива */}
                {Array.isArray(props.notes) ? (props.notes.sort(sortByOrder).reverse().map((note) => {
                    return (
                        <NoteItem note={note} key={note.id} />
                    )
                })) : null}
            </StackGrid>
        </div>
    )
}

// Валидация
NoteList.propTypes = {
    notes: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default sizeMe()(NoteList)
