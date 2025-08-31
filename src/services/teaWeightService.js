// src/services/teaWeightService.js

import { TeaWeight, EmployeeWeight, FactoryWeight, Employee, Factory } from '../../models';
import db from '../../models';
const { sequelize } = db;

export const getAllTeaWeights = async () => {
    return await TeaWeight.findAll();
}

export const getTeaWeightByID = async (id) => {
    return await TeaWeight.findByPk(id);
}

export const createTeaWeight = async (teaWeightData) => {
    return await TeaWeight.create(teaWeightData);
}

export const createCompleteTeaWeight = async (data) => {
    const { date, totalWeight, employeeWeights, factoryWeights, createdBy } = data;
    
    const transaction = await sequelize.transaction();
    
    try {
        // Create the main tea weight record
        const teaWeight = await TeaWeight.create({
            tea_weight_total: totalWeight,
            tea_weight_date: date,
            created_by: createdBy || 1 // Default to user 1 if not provided
        }, { transaction });

        // Process employee weights
        for (const empWeight of employeeWeights) {
            // Create employee weight record
            await EmployeeWeight.create({
                emp_weight: empWeight.weight,
                emp_weight_date: date,
                emp_id: empWeight.id,
                created_by: createdBy || 1
            }, { transaction });
        }

        // Process factory weights
        for (const facWeight of factoryWeights) {
            // Create factory weight record
            await FactoryWeight.create({
                fac_weight: facWeight.weight,
                fac_weight_date: date,
                fac_id: facWeight.id,
                created_by: createdBy || 1
            }, { transaction });
        }

        await transaction.commit();
        return teaWeight;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

export const updateTeaWeight = async (id, teaWeightData) => {
    const teaWeight = await TeaWeight.findByPk(id);
    if (!teaWeight) throw new Error('Tea Weight not found');
    return await teaWeight.update(teaWeightData);
}

export const deleteTeaWeight = async (id) => {
    const teaWeight = await TeaWeight.findByPk(id);
    if (!teaWeight) throw new Error('Tea Weight not found');
    return await teaWeight.destroy();
}

