import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

export const client = new MongoClient(process.env.DB_URI);
let db;

export async function connectToDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    db = client.db('myapp_db'); 
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

export function getDB() {
  if (!db) throw new Error('Database not initialized');
  return db;
}