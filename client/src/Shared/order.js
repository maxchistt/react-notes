/**@file order.js */

/**
 * Callback for Array.Sort
 * сортировка карточек по параметру order
 * @param {object} a 
 * @param {object} b 
 */
export function sortByOrder(a, b) {
    if (a.order > b.order) return 1
    if (a.order < b.order) return -1
    return 0
}

/**
 * Вычисление порядка новой заметки
 * @param {Array<object>} notesArr 
 */
export function calcOrder(notesArr = []) {
    let order = 0
    notesArr.forEach((note) => {
        if (note.order >= order) order = note.order + 1
    })
    return order
}

/**
 * Исправление параметров order в массиве заметок
 * @param {Array<object>} notesArr 
 */
export function fixOrders(notesArr = []) {
    let fixedArr = notesArr
    const sortedArr = Array.isArray(notesArr) ? notesArr.sort(sortByOrder) : []
    sortedArr.forEach((sortedNote, sortedNoteIndex) => {
        fixedArr.forEach((note) => {
            if (note.id === sortedNote.id) note.order = sortedNoteIndex
        })
    })
    return fixedArr
}
