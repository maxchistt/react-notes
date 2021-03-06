const { checkNote } = require('./NoteCheck')

const noteTemplate = () => {
    return {
        id: "qweRty123",
        name: "note",
        color: "GREEN",
        text: "lorem ipsum adamet amer",
        media: [],
        order: 5
    }
}

test('check correct validation', () => {
    let note = noteTemplate()
    expect(checkNote(note)).toBe(true)
})

test('check validation with correct missing of "order"', () => {
    let note = noteTemplate()
    delete note.order
    expect(checkNote(note)).toBe(true)
})

test('check validation with incorrect missing', () => {
    let note = noteTemplate()
    delete note.id
    expect(checkNote(note)).toBe(false)
})

test('check incorrect validation', () => {
    let note = noteTemplate()
    note.id = null
    expect(checkNote(note)).toBe(false)
})