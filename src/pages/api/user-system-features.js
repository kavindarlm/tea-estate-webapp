// src/pages/api/user-system-features.js

import { 
  getUserSystemFeatures, 
  grantSystemFeaturesToUser, 
  convertPermissionsToFeatureIds 
} from '../../services/systemFeatureService';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'userId is required' 
        });
      }

      const features = await getUserSystemFeatures(parseInt(userId));
      return res.status(200).json({ success: true, data: features });
    } catch (error) {
      console.error('Error fetching user system features:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch user system features',
        error: error.message 
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { userId, permissions } = req.body;

      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'userId is required' 
        });
      }

      if (!permissions) {
        return res.status(400).json({ 
          success: false, 
          message: 'permissions object is required' 
        });
      }

      // Convert permissions to feature IDs
      const featureIds = await convertPermissionsToFeatureIds(permissions);
      
      // Grant features to user
      const result = await grantSystemFeaturesToUser(userId, featureIds);
      
      return res.status(200).json({ 
        success: true, 
        message: 'User system features updated successfully',
        data: result 
      });
    } catch (error) {
      console.error('Error updating user system features:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to update user system features',
        error: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ 
      success: false, 
      message: `Method ${req.method} not allowed` 
    });
  }
}
