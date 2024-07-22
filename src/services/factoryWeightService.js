// src/services/factoryWeightService.js

const { FactoryWeight } = require('../models');

export const getAllFactoryWeights = async () => {
    return await FactoryWeight.findAll();
}

export const getFactoryWeightByID = async (id) => {
    return await FactoryWeight.findByPk(id);
}

export const createFactoryWeight = async (factoryWeightData) => {
    return await FactoryWeight.create(factoryWeightData);
}

export const updateFactoryWeight = async (id, factoryWeightData) => {
    const factoryWeight = await FactoryWeight.findByPk(id);
    if (!factoryWeight) throw new Error('Factory Weight not found');
    return await factoryWeight.update(factoryWeightData);
}

export const deleteFactoryWeight = async (id) => {
    const factoryWeight = await FactoryWeight.findByPk(id);
    if (!factoryWeight) throw new Error('Factory Weight not found');
    return await factoryWeight.destroy();
}

