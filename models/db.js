import Datastore from 'nedb-promise';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Datastore({ filename: `${__dirname}/products.db`, autoload: true });

export default db;
