import passport from 'passport'
import { getDB } from '../config/mongoClient.mjs'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'

// --- GET /auth/login ---
export const getLoginPage = (req, res) => {
  res.render('index', {
    page: 'auth/login',
    locals: { title: 'Login' },
    theme: req.cookies.theme || 'light',
  })
}

// --- GET /auth/register ---
export const getRegisterPage = (req, res) => {
  res.render('index', {
    page: 'auth/register',
    locals: { title: 'Register' },
    theme: req.cookies.theme || 'light',
  })
}

// --- POST /auth/register ---
export const registerHandler = async (req, res) => {
  try {
    const { username, name, email, password } = req.body
    if (!username || !password)
      return res.status(400).send('Missing credentials')

    const db = getDB()
    const usersCollection = db.collection('users')

    const existingUser = await usersCollection.findOne({ username })
    if (existingUser)
      return res.status(400).send('User already exists')

    const hashedPasswordDefault = await bcrypt.hash('password', 10);

    const newUser = {
      _id: new ObjectId(),
      username,
      password: hashedPasswordDefault,
      name: name || username,
      email: email || '',
      createdAt: new Date()
    }

    await usersCollection.insertOne(newUser)

    res.redirect('/auth/login')
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).send('Internal Server Error')
  }
}

// --- POST /auth/login ---
export const loginHandler = passport.authenticate('local', {
  successRedirect: '/auth/profile',
  failureRedirect: '/auth/login',
})

// --- POST /auth/logout ---
export const logoutHandler = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err)
    req.session.destroy(err => {
      if (err) {
        console.error('Session destroy error:', err)
        return next(err)
      }
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      })
      return res.redirect('/auth/login')
    })
  })
}

// --- GET /auth/profile ---
export const profileHandler = async (req, res) => {
  if (!req.user) return res.redirect('/auth/login')

  try {
    const db = getDB()
    const usersCollection = db.collection('users')
    const user = await usersCollection.findOne({ username: req.user.username })

    if (!user) return res.redirect('/auth/login')

    res.render('index', {
      page: 'auth/profile',
      locals: {
        title: 'Profile',
        user: {
          username: user.username,
          email: user.email || null,
          createdAt: user.createdAt?.toLocaleString(),
        },
      },
      theme: req.cookies.theme || 'light',
    })
  } catch (err) {
    console.error('Profile load error:', err)
    res.status(500).send('Internal Server Error')
  }
}
