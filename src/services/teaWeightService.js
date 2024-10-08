// src/services/teaWeightService.js

import { TeaWeight } from '../models';

export const getAllTeaWeights = async () => {
    return await TeaWeight.findAll();
}

export const getTeaWeightByID = async (id) => {
    return await TeaWeight.findByPk(id);
}

export const createTeaWeight = async (teaWeightData) => {
    return await TeaWeight.create(teaWeightData);
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

