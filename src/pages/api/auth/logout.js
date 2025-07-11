import { logoutUser } from '../../../services/userService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId } = req.body;

  try {
    const user = await logoutUser(userId);
    // Perform any additional logout logic here, such as clearing cookies or session data
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}