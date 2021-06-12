/**@file useNotesArr.hook.js */
import { useState } from 'react'
import { checkNotesArr } from '../Shared/noteType/Note'

/**
 * Хук использования массива заметок
 * @param {(null|Array)} defaultValue  
 */
function useNotesArr(defaultValue) {
    const [valueArr, setValueArr] = useState(defaultValue)
    /**Сеттер с проверкой валидности массива */
    function trySetValueArr(notesArr) {
        if (checkNotesArr(notesArr) || notesArr === null) setValueArr(notesArr)
        else console.error('Массив notesArr не прошел проверку \n', notesArr)
    }
    return [valueArr, trySetValueArr]
}

export default useNotesArr