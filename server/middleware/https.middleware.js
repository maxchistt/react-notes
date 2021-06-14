/** @file https.middleware.js */
/**
 * Перенаправление с http на https для PWA 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = (req, res, next) => {
    if (req.header('x-forwarded-proto') === 'http') {
        res.redirect(`https://${req.header('host')}${req.url}`)
    } else {
        next()
    }
}