import { forgotPassword } from '../../../services/userService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  const { email } = req.body;

  // Validate input
  if (!email) {
    return res.status(400).json({ 
      success: false,
      message: 'Email address is required' 
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      message: 'Please provide a valid email address' 
    });
  }

  try {
    // Use the forgotPassword service to handle password reset
    const result = await forgotPassword(email);

    return res.status(200).json({ 
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Forgot password API error:', error);
    
    // Return a generic message for security (don't reveal if email exists or not)
    return res.status(200).json({ 
      success: true,
      message: 'If an account with this email exists, password reset instructions have been sent'
    });
  }
}