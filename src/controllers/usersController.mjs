import { client } from '../config/mongoClient.mjs';
import { ObjectId } from 'mongodb';

const db = () => client.db('myapp_db');
const usersCollection = () => db().collection('users');

// --- READ: всі користувачі з проекцією ---
export const getUsersHandler = async (req, res) => {
  try {
    const users = await usersCollection()
      .find({}, { projection: { name: 1, username: 1, email: 1, createdAt: 1 } })
      .toArray();

    res.render('index', {
      title: 'Users List',
      page: 'users/list',
      locals: { users },
      theme: req.cookies.theme || 'light'
    });
  } catch (error) {
    console.error('Помилка при отриманні користувачів:', error);
    res.status(500).send('Internal Server Error');
  }
};

// --- READ: користувач за ID ---
export const getUserByIdHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await usersCollection().findOne(
      { _id: new ObjectId(String(userId)) },
      { projection: { name: 1, username: 1, email: 1, createdAt: 1 } }
    );

    if (!user) return res.status(404).send('User Not Found');

    res.render('index', {
      title: user.name,
      page: 'users/detail',
      locals: { user },
      theme: req.cookies.theme || 'light'
    });
  } catch (error) {
    console.error('Помилка при отриманні користувача:', error);
    res.status(500).send('Internal Server Error');
  }
};

// --- CREATE: один користувач ---
export const postUsersHandler = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !password) return res.status(400).send('Missing required fields');

    await usersCollection().insertOne({
      name,
      username,
      email: email || '',
      password,
      createdAt: new Date()
    });

    res.status(201).send('User created');
  } catch (error) {
    console.error('Помилка при створенні користувача:', error);
    res.status(500).send('Internal Server Error');
  }
};

// --- UPDATE: один користувач ---
export const putUserByIdHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, username, email, password } = req.body;

    const result = await usersCollection().updateOne(
      { _id: new ObjectId(String(userId)) },
      { $set: { name, username, email, password } }
    );

    if (result.matchedCount === 0) return res.status(404).send('User Not Found');

    res.status(200).send(`Updated user: ${userId}`);
  } catch (error) {
    console.error('Помилка при оновленні користувача:', error);
    res.status(500).send('Internal Server Error');
  }
};

// --- REPLACE: повна заміна документа користувача ---
export const replaceUserByIdHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, username, email, password } = req.body;

    const result = await usersCollection().replaceOne(
      { _id: new ObjectId(String(userId)) },
      { _id: new ObjectId(String(userId)), name, username, email, password, createdAt: new Date() }
    );

    if (result.matchedCount === 0) return res.status(404).send('User Not Found');

    res.status(200).send(`Replaced user: ${userId}`);
  } catch (error) {
    console.error('Помилка при заміні користувача:', error);
    res.status(500).send('Internal Server Error');
  }
};

// --- DELETE: один користувач ---
export const deleteUserByIdHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await usersCollection().deleteOne({ _id: new ObjectId(String(userId)) });

    if (result.deletedCount === 0) return res.status(404).send('User Not Found');

    res.status(204).send('');
  } catch (error) {
    console.error('Помилка при видаленні користувача:', error);
    res.status(500).send('Internal Server Error');
  }
};

// --- bulk операції ---
export const insertManyUsers = async (usersArray) => {
  return await usersCollection().insertMany(usersArray);
};

export const updateManyUsers = async (filter, update) => {
  return await usersCollection().updateMany(filter, { $set: update });
};

export const deleteManyUsers = async (filter) => {
  return await usersCollection().deleteMany(filter);
};

// --- CURSOR: отримання користувачів з обробкою курсора ---
export const getUsersCursorHandler = async (req, res) => {
  try {
    const cursor = usersCollection().find({}, { projection: { name: 1, email: 1 } })
    const users = []

    for await (const user of cursor) {
      users.push(user)
    }

    res.status(200).json({
      count: users.length,
      users
    })
  } catch (error) {
    console.error('Помилка при обробці курсора користувачів:', error)
    res.status(500).send('Internal Server Error')
  }
}


// --- AGGREGATION: статистика користувачів ---
export const getUsersStatsHandler = async (req, res) => {
  try {
    const stats = await usersCollection()
      .aggregate([
        { $group: { _id: null, totalUsers: { $sum: 1 }, avgNameLength: { $avg: { $strLenCP: "$name" } } } }
      ])
      .toArray()

    res.status(200).json(stats[0])
  } catch (error) {
    console.error('Помилка при агрегації користувачів:', error)
    res.status(500).send('Internal Server Error')
  }
}
