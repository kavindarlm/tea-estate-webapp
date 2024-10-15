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
      { userId: user.user_id, email: user.user_email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token , user_id: user});
  } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({ message: error.message });
  }
}