# Express REST API Project + MongoDB

## Опис

Цей проєкт демонструє повноцінний сервер на **Express.js** з REST API, автентифікацією через **Passport.js**, збереженням сесій, підтримкою **cookies**, інтеграцією з **MongoDB**, і відображенням сторінок через **EJS шаблони**.

Функціонал включає:

- REST API для **користувачів** та **статей**  
- **MongoDB** як основне джерело даних  
- **Passport.js (Local Strategy)** для автентифікації  
- **express-session** для керування сесіями  
- **cookies** для збереження теми користувача  
- Валідація даних через middleware (`validateUser`, `validateArticle`)  
- Відображення через **EJS layout**  
- Сторінку **Access Denied** для неавторизованих користувачів  
- Повну обробку помилок: 400 / 401 / 404 / 500

### Використані бібліотеки

- `express` – веб-сервер  
- `ejs` – шаблони  
- `dotenv` – підключення змінних оточення  
- `express-session` – зберігання сесій  
- `cookie-parser` – робота з cookies  
- `passport` / `passport-local` – автентифікація  
- `bcrypt` – хешування паролів  
- `mongodb` – робота з MongoDB  
- `celebrate` / `joi` – валідація даних  
- `jsonwebtoken` – JWT (якщо буде потрібно)  
- `typescript` – для типізації (якщо буде потрібно)  
- `nodemon` – автоматичне перезапускання сервера  

## Основний функціонал

### 1. Авторизація (Passport Local Strategy)
- Конфігурація у `config/passport.mjs`.  
- Авторизація через `username + password`.  
- Сесія зберігається у cookie (`connect.sid`).  
- Користувач серіалізується та десеріалізується через MongoDB.  
- Після логіну доступні сторінки `/auth/profile` і `/protected`.

### 2. Сесії
Використано `express-session`:
```text
httpOnly: true
secure: false
maxAge: 1h
saveUninitialized: false
resave: false
```
Після логіну користувач залишається авторизованим між запитами.

### 3. Робота з темою (light / dark)
- Використовується cookie theme.
- Middleware `attachTheme` передає тему у всі шаблони EJS.
- Кнопка **Toggle Theme** перемикає режим теми на сторінках.

### 4. Захищені маршрути
- Захищені маршрути: `/users`, `/articles/:articleId`, `/auth/profile`, `/protected`.
- Неавторизованим користувачам відображається сторінка `accessDenied.ejs`.

### 5. Підключення MongoDB
- Підключення через `mongoClient.mjs` (MongoClient).
- База даних: `myapp_db`.
- Дві колекції: `users` та `articles`.
- **CRUD-операції**:
- Створення: insertOne, insertMany
- Читання: find з проекцією
- Оновлення: updateOne, updateMany, replaceOne
- Видалення: deleteOne, deleteMany

## Використані мідлвари
- `logRequests` - Логує всі запити.
- `basicAuth` -	Базова перевірка наявності користувача в сесії. Повертає accessDenied.ejs для 401.
- `checkArticleAccess` -	Дозволяє перегляд усіх статей, але деталі — лише авторизованим.
- `validateUser` -	Валідація даних користувача (перевірка username).
- `validateArticle` -	Валідація даних статті (title).
- `attachTheme` -	Додає поточну тему користувача в res.locals.
- `ensureAuthenticated` -	Passport middleware для перевірки сесії.

## Структура маршрутів
### Root /
- GET / – головна сторінка (root/home.ejs).

### Auth /auth
- GET /login – сторінка логіну
- POST /login – логін користувача через Passport
- GET /register – сторінка реєстрації
- POST /register – створення користувача у MongoDB
- POST /logout – завершення сесії, редірект на /login
- GET /profile – сторінка профілю користувача

### Users /users

- GET /users – повертає список усіх користувачів

Використовує `getUsersHandler`, рендерить `users/lis`t

Повертає масив об’єктів із полями: `name`, `username`, `email`, `createdAt`

- POST /users – створює нового користувача

Використовує `postUsersHandler`

Валідація: обов’язкові `name`, `username`, `password`

Повертає 201 зі статусом `User created`

- GET /users/:userId – отримує дані одного користувача

Використовує `getUserByIdHandler`, рендерить `users/detail`

Повертає об’єкт користувача з полями: `name`, `username`, `email`, `createdAt`

404, якщо користувача не знайдено

- PUT /users/:userId – часткове оновлення користувача

Використовує `putUserByIdHandler`

Повертає 200 зі статусом `Updated user: <userId>`

404, якщо користувача не знайдено

- PATCH /users/:userId – повна заміна користувача

Використовує `replaceUserByIdHandler`

Повертає 200 зі статусом `Replaced user: <userId>`

404, якщо користувача не знайдено

- DELETE /users/:userId – видалення користувача

Використовує `deleteUserByIdHandler`

Повертає 204, якщо успішно, або 404, якщо користувача не знайдено

- Bulk операції: `insertManyUsers`, `updateManyUsers`, `deleteManyUsers` – для пакетного додавання/оновлення/видалення

### Articles /articles

- GET /articles – повертає список усіх статей

Використовує `getArticlesHandler`, рендерить `articles/list`

Повертає масив об’єктів із полями: `title`, `author`, `createdAt`

- POST /articles – створює нову статтю

Використовує `postArticlesHandler`

Обов’язкові поля: `title`, `author`

Повертає 201 зі статусом `Article created`

- GET /articles/:articleId – отримує дані однієї статті

Використовує `getArticleByIdHandler`, рендерить `articles/detail`

Повертає об’єкт із полями: `title`, `content`, `author`, `createdAt`

404, якщо статтю не знайдено

- PUT /articles/:articleId – часткове оновлення статті

Використовує `putArticleByIdHandler`

Повертає 200 зі статусом `Updated article: <articleId>`

404, якщо статтю не знайдено

- PATCH /articles/:articleId – повна заміна статті

Використовує `replaceArticleByIdHandler`

Повертає 200 зі статусом `Replaced article: <articleId>`

404, якщо статтю не знайдено

- DELETE /articles/:articleId – видалення статті

Використовує `deleteArticleByIdHandler`

Повертає 204, якщо успішно, або 404, якщо статтю не знайдено

- Bulk операції: `insertManyArticles`, `updateManyArticles`, `deleteManyArticles` – для пакетного додавання/оновлення/видалення

### Theme /theme
- GET / – повертає поточну тему
- POST / – змінює тему користувача у cookie

### Protected /protected
- GET / – доступ лише для авторизованих користувачів

### Курсори
- /users/cursor/list — отримати користувачів з використанням курсора

Метод: GET

Опис: Повертає список користувачів, оброблених за допомогою курсора без збереження всіх даних у пам’яті.

Приклад відповіді:
```json
{
  "count": 6,
  "articles": [
    {
      "_id": "68f3c23a01885321f8335e4c",
      "title": "Introduction to Node.js",
      "author": "admin"
    },
    {
      "_id": "68f3c23a01885321f8335e4d",
      "title": "Getting Started with Express",
      "author": "admin"
    },
    {
      "_id": "68f3c23a01885321f8335e4e",
      "title": "Understanding REST APIs",
      "author": "bob"
    },
    {
      "_id": "68f3c23a01885321f8335e4f",
      "title": "JavaScript ES6 Features",
      "author": "admin"
    },
    {
      "_id": "68f3c23a01885321f8335e50",
      "title": "Async/Await in JavaScript",
      "author": "david"
    },
    {
      "_id": "68f3c23a01885321f8335e51",
      "title": "Handling Errors in Express",
      "author": "bob"
    }
  ]
}
```

- /articles/cursor/list — отримати статті з використанням курсора

Метод: GET

Приклад відповіді:
```json
{
  "count": 6,
  "articles": [
    {
      "_id": "68f3c23a01885321f8335e4c",
      "title": "Introduction to Node.js",
      "author": "admin"
    },
    {
      "_id": "68f3c23a01885321f8335e4d",
      "title": "Getting Started with Express",
      "author": "admin"
    },
    {
      "_id": "68f3c23a01885321f8335e4e",
      "title": "Understanding REST APIs",
      "author": "bob"
    },
    {
      "_id": "68f3c23a01885321f8335e4f",
      "title": "JavaScript ES6 Features",
      "author": "admin"
    },
    {
      "_id": "68f3c23a01885321f8335e50",
      "title": "Async/Await in JavaScript",
      "author": "david"
    },
    {
      "_id": "68f3c23a01885321f8335e51",
      "title": "Handling Errors in Express",
      "author": "bob"
    }
  ]
}
```

### Агрегаційні запити
- /users/stats/summary

Метод: GET

Опис: Повертає статистику користувачів — кількість і середню довжину імен.

Приклад відповіді:
```json
{
  "_id": null,
  "totalUsers": 7,
  "avgNameLength": 11.2857142857143
}
```
- /articles/stats/summary

Метод: GET

Опис: Повертає кількість статей по кожному автору та середню довжину заголовку.

Приклад відповіді:
```json
[
  {
    "_id": "admin",
    "totalArticles": 3,
    "avgTitleLength": 24.6666666666667
  },
  {
    "_id": "bob",
    "totalArticles": 2,
    "avgTitleLength": 24.5
  },
  {
    "_id": "david",
    "totalArticles": 1,
    "avgTitleLength": 25
  }
]
```
### Error Handling

- Запит до неіснуючого маршруту повертає `404 Not Found`.  
- Глобальна обробка помилок повертає `500 Internal Server Error`. 

### Шаблони EJS
```text
views/
├─ index.ejs                # головний лейаут
├─ root/
│  └─ home.ejs              # головна сторінка
├─ users/
│  ├─ list.ejs              # список користувачів
│  └─ detail.ejs            # деталі користувача
├─ articles/
│  ├─ list.ejs              # список статей
│  └─ detail.ejs            # деталі статті
├─ auth/
│  ├─ login.ejs             # сторінка входу
│  ├─ register.ejs          # сторінка реєстрації
│  └─ profile.ejs           # профіль користувача
└─ protected/
   ├─ protected.ejs         # захищена сторінка
   └─ accessDenied.ejs      # сторінка 401-доступу
```
- **index.ejs** – лейаут, який включає загальні елементи HTML (head, стилі, container).  
- **home.ejs** – головна сторінка із посиланнями на `/users` та `/articles`.  
- **list.ejs** – відображає масив елементів (`users` або `articles`) у стилізованому списку.  
- **detail.ejs** – відображає детальну інформацію про одного користувача або статтю.

## Стилі
- CSS підключено через /public/styles.css.
- Використовується простий дизайн з контейнером, картками та кнопками для кращої візуалізації.
- Додано favicon.ico у папку public. Сервер Express налаштований віддавати статичні файли з public.
- Підтримка світлої та темної теми.

## Тестування
Тестовий користувач:
```text
username: admin
password: 12345
```
Після входу створюється cookie `connect.sid`.
Ви отримуєте доступ до захищених маршрутів.

## Запуск проєкту
### 1. Клонувати репозиторій
```bash
Копіювати код
git clone https://github.com/BieliaievaIryna/fullstack-hw67-express-mongodb-cursor
```

### 2. Встановити залежності
```bash
npm install
```

### 3. Запустити сервер
```bash
npm run dev
```

### 4. Відкрити в браузері
```text
http://localhost:3000
```

### Додаткова інформація

Файл `seedDB.mjs` використовується для початкового заповнення бази даних тестовими даними.  
Він додає користувачів та статті до колекцій `users` і `articles` у MongoDB.

Ініціалізувати тестові дані:
```bash
npm run seed
```
### Тестування CRUD-операцій (`testCrudDB.mjs`)

Скрипт демонструє всі методи: `insertOne`, `insertMany`, `find`, `updateOne`, `updateMany`, `replaceOne`, `deleteOne`, `deleteMany`.

Використовується для перевірки коректності роботи бази даних.

Запускається через:
```bash
npm run crud
```
Результат виконання (лог у консолі з повідомленнями про успішні CRUD-операції):
```text
Connected to Database
Users collection cleared
Inserted one user: 68f2069d36fdcbe73dd06510
Inserted many users: 2
Users in collection: [
  {
    _id: new ObjectId('68f2069d36fdcbe73dd06510'),
    name: 'Test User 1',
    username: 'testuser1',
    email: 'user1@example.com'
  },
  {
    _id: new ObjectId('68f2069d36fdcbe73dd06511'),
    name: 'Test User 2',
    username: 'testuser2',
    email: 'user2@example.com'
  },
  {
    _id: new ObjectId('68f2069d36fdcbe73dd06512'),
    name: 'Test User 3',
    username: 'testuser3',
    email: 'user3@example.com'
  }
]
Updated one user: 1
Updated many users: 3
Replaced one user: 1
Deleted one user: 1
Deleted many users: 1
Articles collection cleared
Inserted one article: 68f2069d36fdcbe73dd06513
Inserted many articles: 2
Articles in collection: [
  {
    _id: new ObjectId('68f2069d36fdcbe73dd06513'),
    title: 'Test Article 1',
    author: 'testuser1'
  },
  {
    _id: new ObjectId('68f2069d36fdcbe73dd06514'),
    title: 'Test Article 2',
    author: 'testuser2'
  },
  {
    _id: new ObjectId('68f2069d36fdcbe73dd06515'),
    title: 'Test Article 3',
    author: 'testuser3'
  }
]
Updated one article: 1
Updated many articles: 3
Replaced one article: 1
Deleted one article: 1
Deleted many articles: 1
Connection closed
```