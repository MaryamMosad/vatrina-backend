const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const appError = require('./Utils/appError');
const globalErrorHandler = require('./controllers/errorController')

const app = express();
app.use(morgan('dev'));
app.use(express.json());
// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/categories', categoryRouter);


app.all('*', (req, res, next) => {
    next(new appError(`cannot find ${req.originalUrl} on this server!`), 404);
});

app.use(globalErrorHandler);
app.get('/',(req,res)=>{
    res.send('welcome')
})

module.exports = app;