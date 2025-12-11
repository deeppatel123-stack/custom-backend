class ApiError extends Error {
    constructor(
        statusCode,
        message = "something went wrong",
        errors = [],
        stack = ""
    ){
        this.statusCode = statusCode
        super(message)
        this.errors = errors
        this.success = false
        this.data = null

        if(stack){
            this.stack = stack
        }else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError }