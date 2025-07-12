// src/services/employeeService.js

import { Employee } from '../../models';

export const getAllEmployees = async () => {
  return await Employee.findAll();
}

export const getEmployeeByID = async (id) => {
  return await Employee.findByPk(id);
}

export const createEmployee = async (employeeData) => {
  return await Employee.create(employeeData);
}

export const updateEmployee = async (id, employeeData) => {
  const employee = await Employee.findByPk(id);
  if (!employee) throw new Error('Employee not found');
  return await employee.update(employeeData);
}

export const deleteEmployee = async (id) => {
  const employee = await Employee.findByPk(id);
  if (!employee) throw new Error('Employee not found');
  return await employee.destroy();
}

