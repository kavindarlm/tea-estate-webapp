// src/services/userService.js

const { User } = require('../models');

export const getAllUsers = async () => {
  return await User.findAll();
};

export const getUserByEmail = async (email) => {
  return await User.findOne({ where: { user_email: email } });
};

export const getUserByID = async (id) => {
  return await User.findByPk(id);
};

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const updateUser = async (id, userData) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  return await user.update(userData);
};

export const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  return await user.destroy();
};
