import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ silent: true });

const client = new MongoClient(process.env.DB_URI);
const dbName = process.env.DB_NAME || 'myapp_db';

async function testDB() {
  try {
    await client.connect();
    console.log('Connected to Database');

    const db = client.db(dbName);

    // ===== USERS =====
    const usersCollection = db.collection('users');

    // Очистка колекції
    await usersCollection.deleteMany({});
    console.log('Users collection cleared');

    // InsertOne
    const user1 = {
      name: 'Test User 1',
      username: 'testuser1',
      email: 'user1@example.com',
      password: '1234',
      createdAt: new Date(),
    };
    const insertOneResult = await usersCollection.insertOne(user1);
    console.log('Inserted one user:', insertOneResult.insertedId.toString());

    // InsertMany
    const users = [
      { name: 'Test User 2', username: 'testuser2', email: 'user2@example.com', password: '1234', createdAt: new Date() },
      { name: 'Test User 3', username: 'testuser3', email: 'user3@example.com', password: '1234', createdAt: new Date() },
    ];
    const insertManyResult = await usersCollection.insertMany(users);
    console.log('Inserted many users:', insertManyResult.insertedCount);

    // Find with projection
    const foundUsers = await usersCollection.find({}, { projection: { name: 1, username: 1, email: 1 } }).toArray();
    console.log('Users in collection:', foundUsers);

    // UpdateOne
    const updateOneResult = await usersCollection.updateOne(
      { username: 'testuser1' },
      { $set: { email: 'updated1@example.com' } }
    );
    console.log('Updated one user:', updateOneResult.modifiedCount);

    // UpdateMany
    const updateManyResult = await usersCollection.updateMany(
      {},
      { $set: { updatedAt: new Date() } }
    );
    console.log('Updated many users:', updateManyResult.modifiedCount);

    // ReplaceOne
    const replaceOneResult = await usersCollection.replaceOne(
      { username: 'testuser2' },
      { name: 'Replaced User', username: 'replaceduser', email: 'replaced@example.com', password: 'pass', createdAt: new Date() }
    );
    console.log('Replaced one user:', replaceOneResult.modifiedCount);

    // DeleteOne
    const deleteOneResult = await usersCollection.deleteOne({ username: 'testuser3' });
    console.log('Deleted one user:', deleteOneResult.deletedCount);

    // DeleteMany
    const deleteManyResult = await usersCollection.deleteMany({ username: /testuser/ });
    console.log('Deleted many users:', deleteManyResult.deletedCount);

    // ===== ARTICLES =====
    const articlesCollection = db.collection('articles');

    await articlesCollection.deleteMany({});
    console.log('Articles collection cleared');

    // InsertOne
    const article1 = { title: 'Test Article 1', content: 'Content 1', author: 'testuser1', createdAt: new Date() };
    const insertArticleOne = await articlesCollection.insertOne(article1);
    console.log('Inserted one article:', insertArticleOne.insertedId.toString());

    // InsertMany
    const articles = [
      { title: 'Test Article 2', content: 'Content 2', author: 'testuser2', createdAt: new Date() },
      { title: 'Test Article 3', content: 'Content 3', author: 'testuser3', createdAt: new Date() },
    ];
    const insertArticlesMany = await articlesCollection.insertMany(articles);
    console.log('Inserted many articles:', insertArticlesMany.insertedCount);

    // Find with projection
    const foundArticles = await articlesCollection.find({}, { projection: { title: 1, author: 1 } }).toArray();
    console.log('Articles in collection:', foundArticles);

    // UpdateOne
    const updateArticleOne = await articlesCollection.updateOne(
      { title: 'Test Article 1' },
      { $set: { content: 'Updated Content 1' } }
    );
    console.log('Updated one article:', updateArticleOne.modifiedCount);

    // UpdateMany
    const updateArticlesMany = await articlesCollection.updateMany(
      {},
      { $set: { updatedAt: new Date() } }
    );
    console.log('Updated many articles:', updateArticlesMany.modifiedCount);

    // ReplaceOne
    const replaceArticleOne = await articlesCollection.replaceOne(
      { title: 'Test Article 2' },
      { title: 'Replaced Article', content: 'New Content', author: 'admin', createdAt: new Date() }
    );
    console.log('Replaced one article:', replaceArticleOne.modifiedCount);

    // DeleteOne
    const deleteArticleOne = await articlesCollection.deleteOne({ title: 'Test Article 3' });
    console.log('Deleted one article:', deleteArticleOne.deletedCount);

    // DeleteMany
    const deleteArticlesMany = await articlesCollection.deleteMany({ title: /Test Article/ });
    console.log('Deleted many articles:', deleteArticlesMany.deletedCount);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

testDB();
