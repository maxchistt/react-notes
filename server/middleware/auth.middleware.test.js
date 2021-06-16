const authMiddleware = require("./auth.middleware");

test('block on incorrect token', done => {
    const req = {
        headers: {
            authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJraXJpZXNoa2kifQ.1rvQo1jjvB-mgTmxSGp7qWDvLGxpxY2ZHMe6qZfxOok'
        },
        url: "/example"
    }

    const res = {
        status(code) {
            try {
                expect(code).toBe(401)
                return this
            } catch (error) {
                done(error)
            }
        },
        json(obj) {
            try {
                expect(obj).toEqual({ message: 'Нет авторизации' })
                done()
            } catch (error) {
                done(error)
            }
        }
    }

    const next = jest.fn()

    authMiddleware(req, res, next)

    expect(next).not.toHaveBeenCalled()
})