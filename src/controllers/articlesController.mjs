import { client } from '../config/mongoClient.mjs';
import { ObjectId } from 'mongodb';

const db = () => client.db('myapp_db');
const articlesCollection = () => db().collection('articles');

// --- READ: всі статті з проекцією ---
export const getArticlesHandler = async (req, res) => {
  try {
    const articles = await articlesCollection()
      .find({}, { projection: { title: 1, author: 1, createdAt: 1 } })
      .toArray();

    res.render('index', {
      title: 'Articles List',
      page: 'articles/list',
      locals: { articles },
      theme: req.cookies.theme || 'light'
    });
  } catch (error) {
    console.error('Помилка при отриманні статей:', error);
    res.status(500).send('Internal Server Error');
  }
};

// --- READ: стаття за ID ---
export const getArticleByIdHandler = async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await articlesCollection().findOne(
      { _id: new ObjectId(String(articleId)) },
      { projection: { title: 1, author: 1, content: 1, createdAt: 1 } }
    );

    if (!article) return res.status(404).send('Article Not Found');

    res.render('index', {
      title: article.title,
      page: 'articles/detail',
      locals: { article },
      theme: req.cookies.theme || 'light'
    });
  } catch (error) {
    console.error('Помилка при отриманні статті:', error);
    res.status(500).send('Internal Server Error');
  }
};

// --- CREATE: одна стаття ---
export const postArticlesHandler = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    if (!title || !author) return res.status(400).send('Title and Author are required');

    await articlesCollection().insertOne({
      title,
      content: content || '',
      author,
      createdAt: new Date()
    });

    res.status(201).send('Article created');
  } catch (error) {
    console.error('Помилка при створенні статті:', error);
    res.status(500).send('Internal Server Error');
  }
};

// --- UPDATE: одна стаття ---
export const putArticleByIdHandler = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { title, content, author } = req.body;

    const result = await articlesCollection().updateOne(
      { _id: new ObjectId(String(articleId)) },
      { $set: { title, content, author } }
    );

    if (result.matchedCount === 0) return res.status(404).send('Article Not Found');

    res.status(200).send(`Updated article: ${articleId}`);
  } catch (error) {
    console.error('Помилка при оновленні статті:', error);
    res.status(500).send('Internal Server Error');
  }
};

// --- REPLACE: повна заміна документа статті ---
export const replaceArticleByIdHandler = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { title, content, author } = req.body;

    const result = await articlesCollection().replaceOne(
      { _id: new ObjectId(String(articleId)) },
      { _id: new ObjectId(String(articleId)), title, content, author, createdAt: new Date() }
    );

    if (result.matchedCount === 0) return res.status(404).send('Article Not Found');

    res.status(200).send(`Replaced article: ${articleId}`);
  } catch (error) {
    console.error('Помилка при заміні статті:', error);
    res.status(500).send('Internal Server Error');
  }
};

// --- DELETE: одна стаття ---
export const deleteArticleByIdHandler = async (req, res) => {
  try {
    const { articleId } = req.params;
    const result = await articlesCollection().deleteOne({ _id: new ObjectId(String(articleId)) });

    if (result.deletedCount === 0) return res.status(404).send('Article Not Found');

    res.status(204).send('');
  } catch (error) {
    console.error('Помилка при видаленні статті:', error);
    res.status(500).send('Internal Server Error');
  }
};

// --- bulk операції ---
export const insertManyArticles = async (articlesArray) => {
  return await articlesCollection().insertMany(articlesArray);
};

export const updateManyArticles = async (filter, update) => {
  return await articlesCollection().updateMany(filter, { $set: update });
};

export const deleteManyArticles = async (filter) => {
  return await articlesCollection().deleteMany(filter);
};

// --- CURSOR: отримання статей ---
export const getArticlesCursorHandler = async (req, res) => {
  try {
    const cursor = articlesCollection().find({}, { projection: { title: 1, author: 1 } })
    const articles = []

    for await (const article of cursor) {
      articles.push(article)
    }

    res.status(200).json({
      count: articles.length,
      articles
    })
  } catch (error) {
    console.error('Помилка при обробці курсора статей:', error)
    res.status(500).send('Internal Server Error')
  }
}


// --- AGGREGATION: статистика статей ---
export const getArticlesStatsHandler = async (req, res) => {
  try {
    const stats = await articlesCollection()
      .aggregate([
        {
          $group: {
            _id: "$author",
            totalArticles: { $sum: 1 },
            avgTitleLength: { $avg: { $strLenCP: "$title" } }
          }
        },
        { $sort: { totalArticles: -1 } }
      ])
      .toArray()

    res.status(200).json(stats)
  } catch (error) {
    console.error('Помилка при агрегації статей:', error)
    res.status(500).send('Internal Server Error')
  }
}
