import React from 'react'
import StackGridItem from "./StackGridItem"
import useResize from "./useResize"

function calcWidth() {
    switch (calcCols()) {
        case 5: return '20%'
        case 4: return '25%'
        case 3: return '33.33%'
        case 2: return '50%'
        case 1: return '100%'

        default: return '100%'
    }
}

function calcCols() {
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
    const [w, h] = useResize(ref)

    const [hArr, setHArr] = React.useState([])

    function updHArr(h, index) {
        if (hArr[index] !== h) {
            hArr[index] = h
            setHArr(hArr.concat())
        }
    }

    function calcPos(index) {
        let x, y
        let col = index % calcCols()
        x = col
        y = calcVerticalOffset(index, col)
        return [x, y]
    }

    function calcVerticalOffset(index) {
        let vertOffset = 0
        hArr.forEach((val, i) => {
            if (i < index && (index % calcCols() === i % calcCols())) vertOffset += val
        });
        return vertOffset
    }

    return (
        <div ref={ref} style={{ position: 'relative', width: "100%" }} className="p-0 m-0">
            {children.map ? (children.map((item, index) => {
                function updItemHeight(h) {
                    updHArr(h, index)
                }
                const [x, y] = calcPos(index)
                return (
                    <div style={{ transform: `translate(${x * 100}%,${y}px)`, transition: 'transform 0.3s', position: 'absolute',top:"0",left:"0", width: calcWidth() }} className="p-0 m-0" key={index}>
                        <StackGridItem updItemHeight={updItemHeight} key={index} >
                            {item}
                        </StackGridItem>
                    </div>
                )
            })) : null}
        </div>
    )
}

export default StackGrid
