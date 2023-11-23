import Nano from 'nano';
import { DOC_TYPES } from '../helpers/contstants';

const dbName: string = process.env.DB_NAME || 'alice';

const nano = Nano(
  `http://${process.env.DB_USER}:${process.env.DB_PASSWORD}@db:5984`,
);

const db = nano.db.use(dbName);

const createDatabase = async (dbName) => {
  try {
    await nano.db.get(dbName);
    console.log(`Database '${dbName}' already exists.`);

    /**
     * create user design/view
     */
    try {
      await db.insert({
        _id: `_design/user`,
        views: {
          all: {
            map: "function(doc){ if (doc.type && doc.type == 'user') { emit(doc.type, doc)}}",
          },
        },
      });
    } catch (e) {}
  } catch (error) {
    if (isNotFoundError(error)) {
      console.log(`Database '${dbName}' does not exist. Creating...`);
      await nano.db.create(dbName);
      console.log(`Database '${dbName}' created successfully.`);
    } else {
      throw error;
    }
  }
};

function isNotFoundError(error) {
  return error && error.statusCode === 404;
}

export { createDatabase, nano, dbName, db };
