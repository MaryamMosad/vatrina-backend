const appeError = require('./../Utils/appError');
const handleCastErrorDB = err => {
    const message = `invalid ${err.path}:${err.value}`;
    return new appeError(message, 400);
};
const handleDuplicateFieldsDB=err=>{
   // const value=err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1 /)[0];
    const message=`Duplicate name please choose another name`;
    return new appeError(message, 400);
};
const handleValidationErrorDB=err=>{
    const messgae=`Invalid input Data`;
    return new appeError(message, 400);
}
const handleJWTError= ()=> new appeError('Invalid Token please log in again',401);
const handleExpiredError =()=>new appeError('Token Expired please log in again',401);
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
        name:err.name
    });
};
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    else {
        console.error('ERRRORRR', err)
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!!'
        })
    }
}
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        //isn't working anymore
        let error = { ...err };
        console.log(error);
        if (error.name === "CastError") error = handleCastErrorDB(error);//isn't working
        if(error.code===11000) error=handleDuplicateFieldsDB(error);
        if(error.name==="ValidationError") error=handleValidationErrorDB(error); //isn't working
        if(error.name==="JsonWebTokenError") error=handleJWTError();
        if (error.name==='TokenExpiredError') error=handleExpiredError();
        sendErrorProd(error, res);
    }
}