const app = require('./app');
const dotenv = require('dotenv');
const mongoose=require('mongoose');
dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;
process.on('uncaughtException', err => {
    console.log('uncaught exception!! Shutting Down...');
    console.log(err.name, err.message);
        process.exit(1);
});


const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(console.log('DB Connection Successful'));

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    console.log('Unhandled Rejection!! Shutting Down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
