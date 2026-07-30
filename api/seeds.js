// Al hacer require de db.js como efecto secundario, Mongoose se conecta automáticamente a MongoDB
// antes de que se ejecute cualquier operación de base de datos.
require('./src/lib/db');
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const logger = require('./src/lib/logger');
const User = require('./src/lib/models/user.model');
const Post = require('./src/lib/models/post.model');
const Comment = require('./src/lib/models/comment.model');

// Constantes que controlan el volumen de datos generados. Modifícalas para ajustar el tamaño del seed.
const USER_COUNT = 10;
const POSTS_PER_USER = 3;
const COMMENTS_PER_POST = 3;

async function run() {
  try {
    logger.warn('Dropping database...');
    // Borramos la base de datos entera antes de sembrar para evitar duplicados si ejecutamos
    // el script varias veces. Cada ejecución parte siempre de cero.
    await mongoose.connection.dropDatabase();

    logger.info(`Seeding ${USER_COUNT} users...`);
    // Array.from({ length: N }, fn) genera un array de N elementos llamando a fn por cada uno.
    // faker genera datos falsos pero realistas (nombres, emails, etc.).
    // La contraseña se guarda en texto plano aquí porque el hook pre-save del modelo User
    // la hashea automáticamente con bcrypt antes de persistirla en MongoDB.
    const users = await User.create(
      Array.from({ length: USER_COUNT }, () => ({
        name: faker.person.fullName(),
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: 'Password1!',
      }))
    );

    logger.info(`Seeding ${USER_COUNT * POSTS_PER_USER} posts...`);
    // flatMap hace un map y después aplana el resultado un nivel: cada usuario produce un array
    // de POSTS_PER_USER objetos, y flatMap los combina en un único array plano para Post.create().
    // user._id es el identificador único que MongoDB asigna a cada documento — es la "clave foránea"
    // que relaciona cada post con su autor en la colección de Users.
    const posts = await Post.create(
      users.flatMap((user) =>
        Array.from({ length: POSTS_PER_USER }, () => ({
          title: faker.lorem.sentence({ min: 3, max: 8 }),
          body: faker.lorem.paragraph(),
          author: user._id,
        }))
      )
    );

    logger.info(`Seeding ${posts.length * COMMENTS_PER_POST} comments...`);
    await Comment.create(
      posts.flatMap((post) =>
        Array.from({ length: COMMENTS_PER_POST }, () => ({
          body: faker.lorem.sentence(),
          // arrayElement elige un usuario aleatorio del array, simulando que distintos usuarios
          // comentan en cada post. Guardamos solo _id, no el objeto entero.
          author: faker.helpers.arrayElement(users)._id,
          post: post._id,
        }))
      )
    );

    logger.info('Done.');
  } catch (error) {
    logger.error(error);
  } finally {
    // finally se ejecuta siempre, haya error o no. Sin process.exit(0) el proceso de Node
    // quedaría abierto indefinidamente esperando la conexión de Mongoose.
    process.exit(0);
  }
}

// ponytail: waits for mongoose connection before running — dropDatabase() is not buffered
mongoose.connection.once('open', run);
