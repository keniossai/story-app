const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const passport = require('passport')
const session = require('express-session')
const methodOverride = require('method-override')
// Morgan for login
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')

// Load Config
dotenv.config({ path: './config/config.env' })

// Passport Config
require('./config/passport')(passport)

connectDB()

const app = express()

// Body Parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Method Override
app.use(
	methodOverride(function (req, res) {
		if (req.body && typeof req.body === 'object' && '_method' in req.body) {
			// look in urlencoded POST bodies and delete it
			let method = req.body._method
			delete req.body._method
			return method
		}
	})
)

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

// Handlebars Helper
const {
	formatDate,
	stripTags,
	truncate,
	editIcon,
	select,
} = require('./helpers/hbs')

// Handlebars
app.engine(
	'.hbs',
	exphbs({
		helpers: { formatDate, stripTags, truncate, editIcon, select },
		defaultLayout: 'main',
		extname: '.hbs',
	})
)
app.set('view engine', '.hbs')

// Session store
const mongoStore = new MongoStore({
	mongoUrl: `mongodb+srv://keniossai:1234567890@kencluster.mpx9j.mongodb.net/
	storyapp?retryWrites=true&w=majority`,
	dbName: 'storyapp',
	stringify: false,
	colleectionName: 'session',
})
// Session
app.use(
	session({
		secret: 'mysecret',
		resave: true,
		saveUninitialized: true,
		store: mongoStore,
	})
)

// Paasport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global variable
app.use(function (req, res, next) {
	res.locals.user = req.user || null
	next()
})

// Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 4000

app.listen(
	PORT,
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
