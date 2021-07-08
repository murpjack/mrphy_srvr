const error = (status, message, errors) => ({
    status,
    content: {
        message,
        errors: errors || []
    }
});

module.exports = {
    notFound: _ => error(404, "Not found"),
    unauthorised: message => error(401, message || "Unauthorised"),
    badRequest: (message, errors) => error(400, message || "Bad request", errors),
    serverError: message => error(500, message || "Internal server error"),
    custom: error
};