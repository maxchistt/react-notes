const { checkNote } = require('./NoteCheck')

const noteTemplate = {
    id: "qweRty123",
    name: "note",
    color: "GREEN",
    text: "lorem ipsum adamet amer",
    order: 754444444424552
}

test('check correct validation', () => {
    let note = noteTemplate
    expect(checkNote(note)).toBe(true)
})

test('check validation with correct missing of "order"', () => {
    let note = noteTemplate
    delete note.order
    expect(checkNote(note)).toBe(true)
})

test('check validation with incorrect missing', () => {
    let note = noteTemplate
    delete note.id
    expect(checkNote(note)).toBe(false)
})

test('check incorrect validation', () => {
    let note = noteTemplate
    note.id = null
    expect(checkNote(note)).toBe(false)
})