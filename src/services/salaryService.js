// src/services/salaryService.js

import { SalaryConfig, EmployeeWeight, Employee } from '../../models';
import { fn, col, Op } from 'sequelize';
import db from '../../models';
const { sequelize } = db;

export const getAllSalaryConfigs = async () => {
    return await SalaryConfig.findAll({
        order: [['createdAt', 'DESC']]
    });
}

export const getActiveSalaryConfig = async () => {
    return await SalaryConfig.findOne({
        where: { is_active: true }
    });
}

export const createSalaryConfig = async (configData) => {
    const transaction = await sequelize.transaction();
    
    try {
        // Deactivate all existing configs
        await SalaryConfig.update(
            { is_active: false },
            { 
                where: { is_active: true },
                transaction 
            }
        );

        // Create new active config
        const newConfig = await SalaryConfig.create({
            ...configData,
            is_active: true
        }, { transaction });

        await transaction.commit();
        return newConfig;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

export const updateSalaryConfig = async (id, configData) => {
    const transaction = await sequelize.transaction();
    
    try {
        // Deactivate all existing configs
        await SalaryConfig.update(
            { is_active: false },
            { 
                where: { is_active: true },
                transaction 
            }
        );

        // Update and activate the specified config
        const config = await SalaryConfig.findByPk(id);
        if (!config) throw new Error('Salary Config not found');
        
        const updatedConfig = await config.update({
            ...configData,
            is_active: true
        }, { transaction });

        await transaction.commit();
        return updatedConfig;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

export const calculateEmployeeSalary = async (employeeId, date) => {
    // Get active salary config
    const config = await getActiveSalaryConfig();
    if (!config) {
        throw new Error('No active salary configuration found');
    }

    // Get employee's total weight for the specified date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const employeeWeight = await EmployeeWeight.findOne({
        attributes: [
            [fn('SUM', col('emp_weight')), 'total_weight']
        ],
        where: {
            emp_id: employeeId,
            emp_weight_date: {
                [Op.between]: [startOfDay, endOfDay]
            }
        },
        raw: true
    });

    const totalWeight = parseFloat(employeeWeight?.total_weight || 0);
    let salary = 0;

    // Calculate salary based on config
    if (totalWeight >= parseFloat(config.minimum_kg_threshold)) {
        // Base amount for reaching threshold
        salary = parseFloat(config.base_amount);

        // Additional amount for exceeding threshold
        const exceededWeight = totalWeight - parseFloat(config.minimum_kg_threshold);
        if (exceededWeight > 0) {
            salary += exceededWeight * parseFloat(config.per_kg_rate);
        }
    }

    return {
        totalWeight,
        salary,
        baseAmount: parseFloat(config.base_amount),
        threshold: parseFloat(config.minimum_kg_threshold),
        perKgRate: parseFloat(config.per_kg_rate),
        exceededWeight: Math.max(0, totalWeight - parseFloat(config.minimum_kg_threshold))
    };
}

export const calculateAllEmployeesSalary = async (date) => {
    const config = await getActiveSalaryConfig();
    if (!config) {
        throw new Error('No active salary configuration found');
    }

    const employees = await Employee.findAll();
    const salaryCalculations = [];

    for (const employee of employees) {
        const calculation = await calculateEmployeeSalary(employee.emp_id, date);
        salaryCalculations.push({
            employee,
            ...calculation
        });
    }

    return salaryCalculations;
}
