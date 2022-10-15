const express           = require('express');
const mongoose          = require('mongoose');
const dotenv            = require('dotenv');
const morgan            = require('morgan');
const path              = require('path');
const hbs               = require('express-handlebars');
const passport          = require('passport');
const methodOverride    = require('method-override');
const session           = require('express-session');
const MongoStore        = require('connect-mongo')(session);
const connectDB         = require('./config/db');
const {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select
}                       = require('./helpers/hbs');

dotenv.config({
    path: '.env'
});

require('./config/passport')(passport);

// Connect Mongo
connectDB()
    .then(() => console.log('Mongo Connection Successful'))
    .catch(err => console.error('error:', err));

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method Override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}))

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.engine('handlebars', hbs.engine({
    defaultLayout: 'main',
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

// Session
app.use(session({
    secret              : 'keyboard cat',
    resave              : false,
    saveUninitialized   : true,
    store               : new MongoStore({
        mongooseConnection: mongoose.connection
    })
}))

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Static
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.locals.user = req.user || null;
    next();
})

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/auth', require('./routes/stories'));

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    () => console.log(`Server running on ${PORT} port`)
)
