// src/service/employeeWeightService.js

const { EmployeeWeight } = require('../models');

export const getAllEmployeeWeights = async () => {
    return await EmployeeWeight.findAll();
}

export const getEmployeeWeightByID = async (id) => {
    return await EmployeeWeight.findByPk(id);
}

export const createEmployeeWeight = async (employeeWeightData) => {
    return await EmployeeWeight.create(employeeWeightData);
}

export const updateEmployeeWeight = async (id, employeeWeightData) => {
    const employeeWeight = await EmployeeWeight.findByPk(id);
    if (!employeeWeight) throw new Error('Employee Weight not found');
    return await employeeWeight.update(employeeWeightData);
}

export const deleteEmployeeWeight = async (id) => {
    const employeeWeight = await EmployeeWeight.findByPk(id);
    if (!employeeWeight) throw new Error('Employee Weight not found');
    return await employeeWeight.destroy();
}
