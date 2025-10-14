// src/services/userService.js

import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { User } from '../../models';
import { grantSystemFeaturesToUser, convertPermissionsToFeatureIds } from './systemFeatureService';
import dotenv from 'dotenv';
dotenv.config();

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
    // Check if the email is already in use (including soft-deleted users)
    const existingUser = await User.findOne({ where: { user_email: userData.user_email } });
    
    let newUser;
    let temporaryPassword;
    
    if (existingUser) {
      if (existingUser.deleted) {
        // Reactivate the deleted user with new data
        console.log('Reactivating deleted user with email:', userData.user_email);
        
        // Extract permissions from userData
        const { permissions, ...userDataWithoutPermissions } = userData;
        
        // Generate a new temporary password
        temporaryPassword = generateTemporaryPassword();
        
        // Update the existing user with new data and reactivate
        await existingUser.update({
          ...userDataWithoutPermissions,
          password: temporaryPassword,
          deleted: false
        });
        
        newUser = existingUser;
        
        // Grant system features to user if permissions are provided and user role is 'User'
        if (permissions && userData.user_role === 'User') {
          try {
            const featureIds = await convertPermissionsToFeatureIds(permissions);
            if (featureIds.length > 0) {
              await grantSystemFeaturesToUser(newUser.user_id, featureIds);
            }
          } catch (permissionError) {
            console.error('Error granting permissions to user:', permissionError);
            // Continue with user reactivation even if permissions fail
          }
        }
      } else {
        throw new Error('Email already in use');
      }
    } else {
      // Extract permissions from userData
      const { permissions, ...userDataWithoutPermissions } = userData;

      // Generate a temporary password
      temporaryPassword = generateTemporaryPassword();

      // Add the temporary password to userData (DO NOT hash here - model hook will handle it)
      const userWithTempPassword = {
        ...userDataWithoutPermissions,
        password: temporaryPassword
      };

      // Create the user with the temporary password
      newUser = await User.create(userWithTempPassword);

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
  try {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');

    // Extract permissions from userData
    const { permissions, ...userDataWithoutPermissions } = userData;

    // Update user data
    await user.update(userDataWithoutPermissions);

    // Update system features if permissions are provided and user role is 'User'
    if (permissions && userData.user_role === 'User') {
      try {
        const featureIds = await convertPermissionsToFeatureIds(permissions);
        if (featureIds.length > 0) {
          await grantSystemFeaturesToUser(user.user_id, featureIds);
        } else {
          // If no permissions are granted, remove all permissions
          await grantSystemFeaturesToUser(user.user_id, []);
        }
      } catch (permissionError) {
        console.error('Error updating permissions for user:', permissionError);
        // Continue with user update even if permissions fail
      }
    }

    return user;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
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
  const user = await User.findOne({ where: { user_email: email, deleted: false } });
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

// service for forgot password
export const forgotPassword = async (email) => {
  try {
    // Check if user exists with this email
    const user = await User.findOne({ where: { user_email: email, deleted: false } });
    if (!user) {
      throw new Error('No account found with this email address');
    }

    // Generate a new temporary password
    const temporaryPassword = generateTemporaryPassword();

    // Hash the temporary password using bcrypt
    const saltRounds = 10;
    const hashedTempPassword = await bcrypt.hash(temporaryPassword, saltRounds);

    // Update user's password in database
    await User.update(
      { password: hashedTempPassword }, 
      { where: { user_id: user.user_id } }
    );

    // Send email with the temporary password
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset - TeaEstate Pro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">TeaEstate Pro - Password Reset</h2>
          <p>Hello ${user.user_name},</p>
          <p>We received a request to reset your password. Your new temporary password is:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <strong style="font-size: 18px; color: #1f2937;">${temporaryPassword}</strong>
          </div>
          <p><strong>Important:</strong> Please log in with this temporary password and change it immediately for security reasons.</p>
          <p>If you did not request this password reset, please contact our support team immediately.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', email);

    return {
      success: true,
      message: 'Password reset instructions have been sent to your email address'
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};