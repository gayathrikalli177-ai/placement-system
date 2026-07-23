const { ValidationError } = require("./validation");

function notFound(req, res) {
    res.status(404).json({ message: "Route not found" });
}

function errorHandler(error, req, res, next) {
    console.error(error);

    if (error instanceof ValidationError) {
        return res.status(400).json({
            message: "Invalid request data",
            errors: error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message }))
        });
    }

    if (error.code === "23505") {
        return res.status(409).json({ message: "This record already exists" });
    }

    if (error.code === "23502" || error.code === "23503" || error.code === "23514" || error.code === "22P02") {
        return res.status(400).json({ message: "Invalid related or stored data" });
    }

    return res.status(error.statusCode || 500).json({ message: "Internal server error" });
}

module.exports = { notFound, errorHandler };
