// src/services/systemFeatureService.js

import { SystemFeature, User, UserSystemFeature } from '../models';

// Get all system features
export const getAllSystemFeatures = async () => {
  try {
    return await SystemFeature.findAll({
      order: [['system_feature_id', 'ASC']]
    });
  } catch (error) {
    console.error('Error fetching system features:', error);
    throw error;
  }
};

// Get system features for a specific user
export const getUserSystemFeatures = async (userId) => {
  try {
    console.log(`Getting system features for user ID: ${userId}`);
    
    const user = await User.findByPk(userId, {
      include: [
        {
          model: SystemFeature,
          as: 'systemFeatures',
          through: { attributes: [] } // Exclude junction table attributes
        }
      ]
    });

    if (!user) {
      throw new Error('User not found');
    }

    console.log(`Found ${user.systemFeatures?.length || 0} granted features for user ${userId}`);
    return user.systemFeatures || [];
  } catch (error) {
    console.error('Error fetching user system features:', error);
    throw error;
  }
};

// Get sidebar navigation items based on user role and permissions
export const getSidebarNavigation = async (userId, userRole) => {
  try {
    // Navigation mapping with the exact names from SystemFeature table
    const navigationMap = {
      'Dashboard': { href: '/dashboard', icon: 'HomeIcon' },
      'Tea Weight': { href: '/tea-weight', icon: 'ScaleIcon' },
      'Employees List': { href: '/employee-list', icon: 'UserGroupIcon' },
      'Factory List': { href: '/factory-list', icon: 'BuildingLibraryIcon' },
      'Reports': { href: '/reports', icon: 'ChartPieIcon' },
      'Calendar': { href: '/calendar', icon: 'CalendarDaysIcon' },
      'Salary': { href: '/salary', icon: 'WalletIcon' },
      'Tea Health': { href: '/tea-health', icon: 'MagnifyingGlassCircleIcon' },
      'User Management': { href: '/user-management', icon: 'UserIcon' }
    };

    let allowedFeatures;

    // Check if user is Admin (case-insensitive)
    if (userRole && userRole.toLowerCase() === 'admin') {
      // Admin gets all system features regardless of UserSystemFeature table
      allowedFeatures = await getAllSystemFeatures();
      console.log('Admin user detected - showing all system features');
    } else {
      // Regular user gets only granted features from UserSystemFeature table
      allowedFeatures = await getUserSystemFeatures(userId);
      console.log(`Regular user detected - showing ${allowedFeatures.length} granted features`);
    }

    // Map features to navigation items
    const navigation = allowedFeatures.map(feature => {
      const navItem = navigationMap[feature.name];
      return {
        name: feature.name,
        href: navItem?.href || '#',
        icon: navItem?.icon || 'HomeIcon',
        current: false
      };
    }).filter(item => item.href !== '#'); // Filter out unmapped items

    return navigation;
  } catch (error) {
    console.error('Error generating sidebar navigation:', error);
    throw error;
  }
};

// Grant system features to a user
export const grantSystemFeaturesToUser = async (userId, featureIds) => {
  try {
    // Remove existing features for the user
    await UserSystemFeature.destroy({
      where: { user_id: userId }
    });

    // Add new features
    const userFeatures = featureIds.map(featureId => ({
      user_id: userId,
      system_feature_id: featureId
    }));

    await UserSystemFeature.bulkCreate(userFeatures);

    return { success: true, message: 'System features granted successfully' };
  } catch (error) {
    console.error('Error granting system features to user:', error);
    throw error;
  }
};

// Grant individual system feature to user
export const grantSystemFeatureToUser = async (userId, featureId) => {
  try {
    const [userFeature, created] = await UserSystemFeature.findOrCreate({
      where: {
        user_id: userId,
        system_feature_id: featureId
      },
      defaults: {
        user_id: userId,
        system_feature_id: featureId
      }
    });

    return { 
      success: true, 
      message: created ? 'Feature granted successfully' : 'Feature already granted',
      created 
    };
  } catch (error) {
    console.error('Error granting system feature to user:', error);
    throw error;
  }
};

// Revoke system feature from user
export const revokeSystemFeatureFromUser = async (userId, featureId) => {
  try {
    const deleted = await UserSystemFeature.destroy({
      where: {
        user_id: userId,
        system_feature_id: featureId
      }
    });

    return { 
      success: true, 
      message: deleted > 0 ? 'Feature revoked successfully' : 'Feature was not granted',
      revoked: deleted > 0
    };
  } catch (error) {
    console.error('Error revoking system feature from user:', error);
    throw error;
  }
};

// Convert permission names from frontend to system feature IDs
export const convertPermissionsToFeatureIds = async (permissions) => {
  try {
    const permissionToFeatureMap = {
      'dashboard': 'Dashboard',
      'teaWeightManagement': 'Tea Weight',
      'employeeListManagement': 'Employees List',
      'factoryListManagement': 'Factory List',
      'reportsManagement': 'Reports',
      'calendarManagement': 'Calendar',
      'salaryManagement': 'Salary',
      'teaHealthManagement': 'Tea Health',
      'userManagement': 'User Management'
    };

    const grantedPermissions = Object.keys(permissions).filter(key => permissions[key]);
    const featureNames = grantedPermissions.map(perm => permissionToFeatureMap[perm]).filter(Boolean);

    if (featureNames.length === 0) {
      return [];
    }

    const features = await SystemFeature.findAll({
      where: {
        name: featureNames
      }
    });

    return features.map(feature => feature.system_feature_id);
  } catch (error) {
    console.error('Error converting permissions to feature IDs:', error);
    throw error;
  }
};
