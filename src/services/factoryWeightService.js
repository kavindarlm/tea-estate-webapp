// src/services/factoryWeightService.js

import { FactoryWeight, Factory } from '../../models';
import { fn, col, Op } from 'sequelize';

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

export const getTotalWeightPerFactory = async (dateFilter = null) => {
    let whereClause = {};
    
    if (dateFilter) {
        const { type, date } = dateFilter;
        
        if (type === 'day') {
            // Filter for specific date
            const targetDate = new Date(date);
            const startOfDay = new Date(targetDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(targetDate);
            endOfDay.setHours(23, 59, 59, 999);
            
            whereClause.fac_weight_date = {
                [Op.between]: [startOfDay, endOfDay]
            };
        }
    }

    const totalWeights = await FactoryWeight.findAll({
        attributes: [
            'fac_id',
            [fn('SUM', col('fac_weight')), 'total_weight']
        ],
        where: whereClause,
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
        fac.total_weight = parseFloat(totalWeightMap.get(fac.fac_id)) || 0;
    });

    return factoriesPlain;
}