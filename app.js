const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path  = require('path');
const hbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');

// Load config env
dotenv.config({
    path: '.env'
});

require('./config/passport')(passport);

// Connect mongodb
connectDB()
    .then(()=> console.log('Mongo Connection Successful'))
    .catch(err => console.error('error:', err));

const app = express();

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.engine('handlebars', hbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Static
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));


const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    () => console.log(`Server running on ${PORT} port`)
)
