// src/services/factoryService.js

import { Factory } from '../../models';

export const getAllFactories = async () => {
    return await Factory.findAll();
}

export const getFactoryByID = async (id) => {
    return await Factory.findByPk(id);
}

export const createFactory = async (factoryData) => {
    return await Factory.create(factoryData);
}

export const updateFactory = async (id, factoryData) => {
    const factory = await Factory.findByPk(id);
    if (!factory) throw new Error('Factory not found');
    return await factory.update(factoryData);
}

export const deleteFactory = async (id) => {
    const factory = await Factory.findByPk(id);
    if (!factory) throw new Error('Factory not found');
    return await factory.destroy();
}