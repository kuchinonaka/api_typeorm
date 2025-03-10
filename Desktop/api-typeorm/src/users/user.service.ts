import bcrypt from 'bcryptjs';
import db, { Database } from '../_helpers/db';
import { User } from './user.model';

export default {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

type NewUser = {
  email: string;
  username: string;
  password: string;
  title: string;
  firstName: string;
  lastName: string;
  role: string;
};

type UpdateUser = Partial<NewUser> & { password?: string };

async function getAll(): Promise<User[]> {
  return await db.User.find();
}

async function getById(id: string): Promise<User> {
  return await getUser(id);
}

async function create(params: NewUser): Promise<void> {
  // Check if email is already registered
  if (await db.User.findOne({ where: { email: params.email } })) {
    throw new Error(`Email "${params.email}" is already registered`);
  }

  // Create user
  const user = db.User.create(params);

  // Hash the password
  user.passwordHash = await bcrypt.hash(params.password, 10);

  // Save user
  await user.save();
}

async function update(idOrUsername: string, params: UpdateUser): Promise<void> {
  let user;

  // Check if the input is a UUID (id) or a username
  const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(idOrUsername);
  if (isUUID) {
    // Search by id
    user = await db.User.findOneBy({ id: idOrUsername });
  } else {
    // Search by username
    user = await db.User.findOneBy({ username: idOrUsername });
  }

  if (!user) {
    throw new Error(`User with ${isUUID ? 'id' : 'username'} "${idOrUsername}" not found`);
  }

  // Check if the username is being updated and ensure it's unique
  const usernameChanged = params.username && user.username !== params.username;
  if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
    throw new Error(`Username "${params.username}" is already taken`);
  }

  // If password is provided, hash it
  if (params.password) {
    user.passwordHash = await bcrypt.hash(params.password, 10);
  }

  // Merge updates into the user and save
  Object.assign(user, params);
  await user.save();
}



async function _delete(idOrUsername: string): Promise<void> {
  let user;

  // Check if the input is a UUID (id) or a username
  const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(idOrUsername);
  if (isUUID) {
    // Search by id
    user = await db.User.findOneBy({ id: idOrUsername });
  } else {
    // Search by username
    user = await db.User.findOneBy({ username: idOrUsername });
  }

  if (!user) {
    throw new Error(`User with ${isUUID ? 'id' : 'username'} "${idOrUsername}" not found`);
  }

  // Remove the user
  await user.remove();
}


async function getUser(id: string): Promise<User> {
  // Use id directly as a string
  const user = await db.User.findOneBy({ id });
  if (!user) throw new Error('User not found');
  return user;
}
