const path = require('path')
const express = require('express')
const dotenv = require('dotenv')

// Morgan for login
const morgan = require('morgan')

const exphbs = require('express-handlebars')

const conneectDB = require('./config/db')

// Load Config
dotenv.config({ path: './config/config.env' })

conneectDB()

const app = express()

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes

app.use('/', require('./routes/index'))

const PORT = process.env.PORT || 4000

app.listen(
	PORT,
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
