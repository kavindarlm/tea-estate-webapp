// src/services/factoryWeightService.js

const { FactoryWeight, Factory, Sequelize } = require('../models');
const { fn, col } = Sequelize;

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

export const getTotalWeightPerFactory = async () => {
    const totalWeights = await FactoryWeight.findAll({
        attributes: [
            'fac_id',
            [fn('SUM', col('fac_weight')), 'total_weight']
        ],
        group: ['fac_id'],
        raw: true,
    });

    // Fetch all factories
    const factories = await Factory.findAll();

    // Convert factories to plain objects
    const factoriesPlain = factories.map(fac => fac.toJSON());

    // Create a map for quick lookup of total weights by factory ID
    const totalWeightMap = new Map();
    totalWeights.forEach(totW => {
        totalWeightMap.set(totW.fac_id, parseFloat(totW.total_weight).toFixed(2));
    });

    // Add total_weight to each factory
    factoriesPlain.forEach(fac => {
        fac.total_weight = parseFloat(totalWeightMap.get(fac.fac_id)) || '000.0';
    });

    return factoriesPlain;
}