import { client } from './config/mongoClient.mjs';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

// Хешування паролів
const hashedPasswordAdmin = await bcrypt.hash('12345', 10);
const hashedPasswordDefault = await bcrypt.hash('password', 10);

const users = [
  {
    _id: new ObjectId(),
    name: 'Admin Admin',
    username: 'admin',
    email: 'admin@example.com',
    password: hashedPasswordAdmin, 
    createdAt: new Date(),
  },
  {
    _id: new ObjectId(),
    name: 'Alice Johnson',
    username: 'alice',
    email: 'alice.johnson@example.com',
    password: hashedPasswordDefault,
    createdAt: new Date(),
  },
  {
    _id: new ObjectId(),
    name: 'Bob Smith',
    username: 'bob',
    email: 'bob.smith@example.com',
    password: hashedPasswordDefault,
    createdAt: new Date(),
  },
  {
    _id: new ObjectId(),
    name: 'Carol Williams',
    username: 'carol',
    email: 'carol.williams@example.com',
    password: hashedPasswordDefault,
    createdAt: new Date(),
  },
  {
    _id: new ObjectId(),
    name: 'David Brown',
    username: 'david',
    email: 'david.brown@example.com',
    password: hashedPasswordDefault,
    createdAt: new Date(),
  },
  {
    _id: new ObjectId(),
    name: 'Eva Davis',
    username: 'eva',
    email: 'eva.davis@example.com',
    password: hashedPasswordDefault,
    createdAt: new Date(),
  },
  {
    _id: new ObjectId(),
    name: 'Frank Miller',
    username: 'frank',
    email: 'frank.miller@example.com',
    password: hashedPasswordDefault,
    createdAt: new Date(),
  },
];

const articles = [
  {
    _id: new ObjectId(),
    title: 'Introduction to Node.js',
    content: 'Node.js is a JavaScript runtime built on Chrome’s V8 engine.',
    author: 'admin',
    createdAt: new Date(),
  },
  {
    _id: new ObjectId(),
    title: 'Getting Started with Express',
    content: 'Express is a minimal and flexible Node.js web application framework.',
    author: 'admin',
    createdAt: new Date(),
  },
  {
    _id: new ObjectId(),
    title: 'Understanding REST APIs',
    content: 'REST stands for Representational State Transfer.',
    author: 'bob',
    createdAt: new Date(),
  },
  {
    _id: new ObjectId(),
    title: 'JavaScript ES6 Features',
    content: 'ES6 introduced let/const, arrow functions, template literals, and more.',
    author: 'admin',
    createdAt: new Date(),
  },
  {
    _id: new ObjectId(),
    title: 'Async/Await in JavaScript',
    content: 'Async/await makes asynchronous code easier to write and read.',
    author: 'david',
    createdAt: new Date(),
  },
  {
    _id: new ObjectId(),
    title: 'Handling Errors in Express',
    content: 'Proper error handling is essential for stable web applications.',
    author: 'bob',
    createdAt: new Date(),
  },
];

async function seed() {
  try {
    await client.connect();
    const db = client.db('myapp_db'); 

    const usersCollection = db.collection('users');
    const articlesCollection = db.collection('articles');

    await usersCollection.deleteMany({});
    await articlesCollection.deleteMany({});

    await usersCollection.insertMany(users);
    await articlesCollection.insertMany(articles);

    console.log('✅ Seed completed successfully!');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    await client.close();
  }
}

seed();
