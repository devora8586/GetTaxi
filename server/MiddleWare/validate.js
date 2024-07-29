
export const validate = (validator) => {

    return async function (req, res, next) {
        try {
            const validated = await validator.validateAsync(req.body)
            req.body = validated
            next()
        } catch (err) {
            if (err.isJoi)
                return next({ statusCode: 422, message: err.message })
            next({ statusCode: 500, message: "Internal server error" })
        }
    }
}
