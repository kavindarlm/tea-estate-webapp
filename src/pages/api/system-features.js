// src/pages/api/system-features.js

import { getSidebarNavigation, getAllSystemFeatures } from '../../services/systemFeatureService';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { userId, userRole, type } = req.query;

      if (type === 'all') {
        // Get all system features (for admin use)
        const features = await getAllSystemFeatures();
        return res.status(200).json({ success: true, data: features });
      }

      if (type === 'sidebar') {
        // Get sidebar navigation for specific user
        if (!userId) {
          return res.status(400).json({ 
            success: false, 
            message: 'userId is required for sidebar navigation' 
          });
        }

        // If userRole is not provided, default to 'User' for safety
        const safeUserRole = userRole || 'User';
        
        console.log(`API: Getting sidebar navigation for user ${userId} with role ${safeUserRole}`);
        
        const navigation = await getSidebarNavigation(parseInt(userId), safeUserRole);
        
        return res.status(200).json({ 
          success: true, 
          data: navigation,
          meta: {
            userId: parseInt(userId),
            userRole: safeUserRole,
            isAdmin: safeUserRole.toLowerCase() === 'admin',
            itemCount: navigation.length
          }
        });
      }

      return res.status(400).json({ 
        success: false, 
        message: 'Invalid type parameter. Use "all" or "sidebar"' 
      });
    } catch (error) {
      console.error('Error fetching system features:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch system features',
        error: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ 
      success: false, 
      message: `Method ${req.method} not allowed` 
    });
  }
}
