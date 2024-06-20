import Datastore from 'nedb';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Datastore({ filename: join(__dirname, 'products.db'), autoload: true });

export default db;