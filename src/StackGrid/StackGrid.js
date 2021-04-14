import React from 'react'
import StackGridItem from "./StackGridItem"
import useResize from "./useResize"

function calcWidth() {
    switch (calcColsAmount()) {
        case 5: return '20%'
        case 4: return '25%'
        case 3: return '33.33%'
        case 2: return '50%'
        case 1: return '100%'

        default: return '100%'
    }
}

function calcColsAmount() {
    const small = 576
    const middle = 768
    const large = 992
    const xlarge = 1200
    const winWidth = window.innerWidth

    if (winWidth >= xlarge) return 5
    else if (winWidth >= large) return 4
    else if (winWidth >= middle) return 3
    else if (winWidth >= small) return 2
    else return 1
}

function StackGrid({ children }) {
    const ref = React.useRef(null)
    useResize(ref, false)

    const [hArr, setHArr] = React.useState([])

    function updHArr(h, index) {
        if (hArr[index] !== h) {
            hArr[index] = h
            setHArr(hArr.concat())
        }
    }

    function calcCol(index) {
        return index % calcColsAmount()
    }

    function calcPos(index) {
        let x, y
        let col = calcCol(index)
        x = col
        y = calcVerticalOffset(index, col)
        return [x, y]
    }

    function calcVerticalOffset(index) {
        let vertOffset = 0
        hArr.forEach((val, i) => {
            if (i < index && (calcCol(index) === calcCol(i))) vertOffset += val
        });
        return vertOffset
    }

    function calcGridHeight(length) {
        let res = 0;
        let colsArr = new Array(length).fill(0)
        hArr.forEach((val, i) => {
            if (i < length) colsArr[calcCol(i)] += val
        });
        colsArr.forEach((val) => {
            if (val > res) res = val
        })
        return res
    }

    return (
        <div ref={ref} style={{ position: 'relative', width: "100%", height: `${calcGridHeight(children.length)}px` }} className="p-0 m-0">

            {children.map ? (children.map((item, index) => {
                function updItemHeight(h) {
                    updHArr(h, index)
                }
                const [x, y] = calcPos(index)
                return (
                    <span
                        style={{
                            transition: "transform 480ms cubic-bezier(0.165, 0.84, 0.44, 1) 0s",
                            transform: `translate(${x * 100}%,${y}px)`,
                            position: 'absolute', top: "0", left: "0",
                            width: calcWidth()
                        }}
                        className="p-0 m-0 d-block"
                        key={index}
                    >
                        <StackGridItem updItemHeight={updItemHeight} key={index} >
                            {item}
                        </StackGridItem>
                    </span>
                )
            })) : null}

        </div>
    )
}

export default StackGrid
