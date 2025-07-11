import { loginUser } from '../../../services/userService';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    // Use the loginUser service to authenticate the user
    const user = await loginUser(email, password);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, email: user.user_email, role: user.user_role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return user data without password for security
    const { password: userPassword, ...userWithoutPassword } = user.toJSON();

    return res.status(200).json({ 
      success: true,
      token,
      user: userWithoutPassword,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({ 
      success: false,
      message: error.message 
    });
  }
}