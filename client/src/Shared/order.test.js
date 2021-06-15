import { sortByOrder, calcOrder, fixOrders } from './order'

const noteTemplate = () => {
    return {
        id: "qweRty123",
        name: "note",
        color: "GREEN",
        text: "lorem ipsum adamet amer",
        order: 5
    }
}

test('sortByOrder', () => {
    let note1 = noteTemplate()
    let note2 = noteTemplate()
    note1.order = 1
    note2.order = 2
    expect(sortByOrder(note2, note1)).toBe(1)
    expect(sortByOrder(note1, note2)).toBe(-1)
    expect(sortByOrder(note1, note1)).toBe(0)
})

test('calcOrder', () => {
    let notesArr = []
    for (let i = 0; i < 10; i++) {
        notesArr[i] = noteTemplate()
        notesArr[i].id = String(Date.now() + i)
        notesArr[i].order = Number(i)
    }
    expect(calcOrder(notesArr)).toBe(10)
    notesArr.sort(() => Math.random() - 0.5)
    expect(calcOrder(notesArr)).toBe(10)
})

test('fixOrders', () => {
    let notesArr = []
    for (let i = 0; i < 10; i++) {
        notesArr[i] = noteTemplate()
        notesArr[i].id = String(Date.now() + i)
        notesArr[i].order = Number(i * 10 * (Math.random() - 0.5))
    }
    notesArr.sort(() => Math.random() - 0.5)
    const fixedArr = fixOrders(notesArr)
    for (let i = 0; i < 10; i++) {
        expect(fixedArr[i].order).toBe(i)
    }
})