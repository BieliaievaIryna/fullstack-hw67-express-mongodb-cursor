import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import { getDB } from './mongoClient.mjs';
import { ObjectId } from 'mongodb';

export default function configurePassport() {
  passport.use(
    new LocalStrategy(
      { usernameField: 'username', passwordField: 'password' },
      async (username, password, done) => {
        try {
          const db = getDB()
          const usersCollection = db.collection('users')

          const user = await usersCollection.findOne({ username })
          if (!user) return done(null, false, { message: 'No user found' })

          const isMatch = await bcrypt.compare(password, user.password)
          if (!isMatch) {
            return done(null, false, { message: 'Invalid credentials' })
          }

          return done(null, user)
        } catch (err) {
          return done(err)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user._id.toString())
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const db = getDB()
      const usersCollection = db.collection('users')
      const user = await usersCollection.findOne({ _id: new ObjectId(id) })

      if (!user) return done(null, false)
      done(null, user)
    } catch (err) {
      done(err)
    }
  })

  return passport
}
