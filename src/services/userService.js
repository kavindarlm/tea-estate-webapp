// src/services/userService.js

import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { User } from '../models';
import { grantSystemFeaturesToUser, convertPermissionsToFeatureIds } from './systemFeatureService';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// generate temporary password
const generateTemporaryPassword = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// service for get all users
export const getAllUsers = async () => {
  return await User.findAll({ where: { deleted: false } });
};

// service for get user by email
export const getUserByEmail = async (email) => {
  return await User.findOne({ where: { user_email: email } });
};

// service for get user by id
export const getUserByID = async (id) => {
  return await User.findByPk(id);
};

// service for create new user
export const createUser = async (userData) => {
  try {
    // Check if the email is already in use
    const existingUser = await User.findOne({ where: { user_email: userData.user_email, deleted: false } });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Extract permissions from userData
    const { permissions, ...userDataWithoutPermissions } = userData;

    // Generate a temporary password
    const temporaryPassword = generateTemporaryPassword();

    // Hash the temporary password
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Add the temporary password to userData
    const userWithTempPassword = {
      ...userDataWithoutPermissions,
      password: hashedPassword
    };

    // Create the user with the temporary password
    const newUser = await User.create(userWithTempPassword);

    // Grant system features to user if permissions are provided and user role is 'User'
    if (permissions && userData.user_role === 'User') {
      try {
        const featureIds = await convertPermissionsToFeatureIds(permissions);
        if (featureIds.length > 0) {
          await grantSystemFeaturesToUser(newUser.user_id, featureIds);
        }
      } catch (permissionError) {
        console.error('Error granting permissions to user:', permissionError);
        // Continue with user creation even if permissions fail
      }
    }

    // Send email with the temporary password
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userData.user_email,
      subject: 'Your Temporary Password',
      text: `Hello ${userData.user_name},\n\nYour temporary password is: ${temporaryPassword}\n\nPlease change your password after logging in.`
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    return newUser;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
};

// service for update user
export const updateUser = async (id, userData) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  return await user.update(userData);
};

// service for delete user
export const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  
  // Set the deleted flag to true
  user.deleted = true;
  await user.save();
  
  return user;
};


// service for login user
export const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { user_email: email } });
  if (!user) {
    throw new Error('User not found');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error('Invalid password');
  }
  
  return user;
};

// Check if user is admin (helper function)
// export const isUserAdmin = (userRole) => {
//   return userRole && userRole.toLowerCase() === 'admin';
// };

// service for logout user
export const logoutUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  return user;
};

// service for change password
export const updateUserPassword = async (id, hashedPassword) => {
  try {
    await User.update({ password: hashedPassword }, { where: { user_id: id} });
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
};