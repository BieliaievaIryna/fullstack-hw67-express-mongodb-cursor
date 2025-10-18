import express from 'express'
import session from 'express-session'
import passport from 'passport'
import configurePassport from './config/passport.mjs'
import cookieParser from 'cookie-parser'
import router from './routes/index.mjs'
import { errors } from 'celebrate'
import { logRequests } from './middlewares/logger.mjs'
import { attachTheme } from './middlewares/theme.mjs'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectToDB } from './config/mongoClient.mjs'

const PORT = 3000
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(attachTheme)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logRequests)

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret123',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60,
    },
  })
)

// --- Підключення до MongoDB перед ініціалізацією Passport ---
await connectToDB()
configurePassport()

app.use(passport.initialize())
app.use(passport.session())

app.use(router)

// --- Обробники помилок ---
app.use((req, res) => res.status(404).send('Not Found'))
app.use(errors())
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Internal Server Error')
})

const server = app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
)

export { server, app }
