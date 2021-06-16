const httpsMiddleware = require("./https.middleware");

test('correct redirect', done => {
    const req = {
        header: query => {
            switch (query) {
                case 'x-forwarded-proto':
                    return 'http'
                case 'host':
                    return 'test.host'
                default:
                    break
            }
        },
        url: "/example"
    }

    const res = {
        redirect(address) {
            try {
                expect(address).toBe(`https://test.host/example`)
                done()
            } catch (error) {
                done(error)
            }
        }
    }

    const next = jest.fn()

    httpsMiddleware(req, res, next)

    expect(next).not.toHaveBeenCalled()
})