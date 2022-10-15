const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path  = require('path');
const hbs = require('express-handlebars');
const connectDB = require('./config/db');

// Load config env
dotenv.config({
    path: './config/config.env'
});

// Connect mongodb
connectDB().then().catch();

const app = express();

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.engine('handlebars', hbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use('/', require('./routes/index'));
const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    () => console.log(`Server running on ${PORT} port`)
)
