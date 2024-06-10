import Datastore from "nedb";
import { v4 as uuidv4 } from "uuid";


const userDb = new Datastore({ filename: "users.db", autoload: true });


const createUser = (username, password, callback) => {
  const userId = uuidv4();
  const newUser = { userId, username, password, orders: [] };
  userDb.insert(newUser, callback);
};

const getUserById = (userId, callback) => {
  userDb.findOne({ userId }, callback);
};

const validateUser = (username, password, callback) => {
  userDb.findOne({ username: username, password: password }, callback);
};

export { createUser, getUserById, validateUser };
