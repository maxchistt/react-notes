/** @file mongoOperations.js */
const User = require('../models/User')
const Note = require('../models/Note')
const Media = require('../models/Media')

/**поиск пользователя */
module.exports.findUserByEmail = async function (email) {
    const user = await User.findOne({ email })
    return user
}

/**создание нового пользователя */
module.exports.addUser = async function (email, hashedPassword) {
    const user = new User({ email, password: hashedPassword })
    await user.save()
    return user
}

///////////////////////////////////////////////////////////

/**Нахождение пользовательских заметок в бд */
module.exports.getNotes = async function (userId) {
    const notes = await Note.find({ owner: userId })
    return notes
}

/**Добавление или редактирование заметки в бд */
module.exports.postNote = async function (noteToSave, userId) {

    noteToSave.owner = userId

    /**проверка существования заметки */
    const existing = await Note.findOne({ id: noteToSave.id })

    if (existing) {
        /**Выполнится если такая заметка уже есть */
        existing.overwrite(noteToSave)
        existing.save()
    } else {
        /**Выполнится если нет такой заметки */
        const note = new Note(noteToSave)
        await note.save()
    }

}

/**Удаление заметки в бд */
module.exports.deleteNote = async function (noteToSave, userId) {
    noteToSave.owner = userId

    const existing = await Note.findOne({ id: noteToSave.id })

    if (existing) {
        const media = existing.media
        if (Array.isArray(media)) media.forEach(mediaId => deleteMedia({ id: mediaId }, userId))
        await existing.remove()
    }
}

///////////////////////////////////////////////////////////

/**Нахождение пользовательских media в бд */
module.exports.getMedia = async function (userId) {
    const media = await Media.find({ owner: userId })
    return media
}

/**Добавление или редактирование media в бд */
module.exports.postMedia = async function (mediaToSave, userId) {
    mediaToSave.owner = userId

    /**проверка существования media */
    const existing = await Media.findOne({ id: mediaToSave.id })

    if (existing) {
        /**Выполнится если такая media уже есть */
        existing.overwrite(mediaToSave)
        await existing.save()
    } else {
        /**Выполнится если нет такой media */
        const media = new Media(mediaToSave)
        await media.save()
    }
}

/**Удаление media связанных с заметкой в бд */
module.exports.deleteMedia = async function (mediaToDelete, userId) {
    mediaToDelete.owner = userId

    /**проверка существования media */
    const existing = await Media.findOne({ id: mediaToDelete.id })

    if (existing) {
        await existing.remove()
    }
}

/**Проверка и удаление старого media в бд */
module.exports.deleteUnactualMedia = async function (mediaToDelete) {
    try {
        const note = mediaToDelete.note ? await Note.findOne({ id: mediaToDelete.note }) : null
        if (!note) {
            /**проверка существования media */
            const existing = await Media.findOne({ id: mediaToDelete.id })
            if (existing) {
                existing.remove()
            }
        }
    } catch { }
}