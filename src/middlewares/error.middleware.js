const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = err.errors || [];

    if (process.env.NODE_ENV === 'development') {
        res.status(statusCode).json({
            statusCode,
            success: false,
            message,
            errors,
            stack: err.stack
        });
    } else {
        res.status(statusCode).json({
            statusCode,
            success: false,
            message,
            errors
        });
    }
}

export default errorHandler;