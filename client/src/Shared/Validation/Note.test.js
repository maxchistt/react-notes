import Note, { checkNotesArr } from './Note'

const noteTemplate = () => {
    return {
        id: "qweRty123",
        name: "note",
        color: "GREEN",
        text: "lorem ipsum adamet amer",
        order: 5
    }
}

test('Note class', () => {
    const note = noteTemplate()
    expect(new Note(note)).toEqual(note)
})

test('checkNotesArr correct', () => {
    let notesArr = []
    for (let i = 0; i < 10; i++) {
        notesArr[i] = noteTemplate()
        notesArr[i].id = String(Date.now() + i)
        notesArr[i].order = Number(i)
    }
    expect(checkNotesArr(notesArr)).toBeTruthy()
})

test('checkNotesArr incorrect', () => {
    let notesArr = []
    for (let i = 0; i < 10; i++) {
        notesArr[i] = noteTemplate()
        notesArr[i].id = String(Date.now() + i)
        notesArr[i].order = Number(i)
        if (i === 3) delete notesArr[i].id
    }
    expect(checkNotesArr(notesArr)).toBeFalsy()
})