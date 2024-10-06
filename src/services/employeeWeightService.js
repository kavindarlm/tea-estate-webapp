// src/services/employeeWeightService.js

const { EmployeeWeight, Employee, Sequelize } = require('../models');
const { fn, col } = Sequelize;

// Fetch all employee weights
export const getAllEmployeeWeights = async () => {
    return await EmployeeWeight.findAll();
}

// Fetch employee weight by ID
export const getEmployeeWeightByID = async (id) => {
    return await EmployeeWeight.findByPk(id);
}

// Create a new employee weight entry
export const createEmployeeWeight = async (employeeWeightData) => {
    return await EmployeeWeight.create(employeeWeightData);
}

// Update an existing employee weight entry
export const updateEmployeeWeight = async (id, employeeWeightData) => {
    const employeeWeight = await EmployeeWeight.findByPk(id);
    if (!employeeWeight) throw new Error('Employee Weight not found');
    return await employeeWeight.update(employeeWeightData);
}

// Delete an employee weight entry
export const deleteEmployeeWeight = async (id) => {
    const employeeWeight = await EmployeeWeight.findByPk(id);
    if (!employeeWeight) throw new Error('Employee Weight not found');
    return await employeeWeight.destroy();
}


// Fetch total weight per employee including employee details
export const getTotalWeightPerEmployee = async () => {
    // Fetch total weights grouped by employee ID
    const totalWeights = await EmployeeWeight.findAll({
        attributes: [
            'emp_id',
            [fn('SUM', col('emp_weight')), 'total_weight']
        ],
        group: ['emp_id'],
        raw: true, // Ensures result is a plain object
    });

    // Fetch all employees
    const employees = await Employee.findAll();
    
    // Convert employees to plain objects
    const employeesPlain = employees.map(emp => emp.toJSON());

    // Create a map for quick lookup of total weights by employee ID
    const totalWeightMap = new Map();
    totalWeights.forEach(totW => {
        totalWeightMap.set(totW.emp_id, parseFloat(totW.total_weight).toFixed(2));
    });

    // Add total_weight to each employee
    employeesPlain.forEach(emp => {
        emp.total_weight = parseFloat(totalWeightMap.get(emp.emp_id)) || '000.0';
    });

    return employeesPlain;
}
