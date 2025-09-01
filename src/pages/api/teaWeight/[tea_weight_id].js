// src/pages/api/teaWeight/[tea_weight_id].js

import { getTeaWeightByID, updateTeaWeight, deleteTeaWeight } from '../../../services/teaWeightService';
import { TeaWeight, EmployeeWeight, FactoryWeight, Employee, Factory } from '../../../../models';

export default async function handler(req, res) {
    const { method, body, query } = req;
    const { tea_weight_id } = query;

    try {
        switch (method) {
            case 'GET':
                const teaWeight = await getTeaWeightByID(tea_weight_id);
                if (!teaWeight) {
                    res.status(404).json({ error: 'Tea Weight not found' });
                } else {
                    res.status(200).json(teaWeight);
                }
                break;
            case 'PUT':
                const updatedTeaWeight = await updateTeaWeight(tea_weight_id, body);
                res.status(200).json(updatedTeaWeight);
                break;
            case 'DELETE':
                const { sequelize } = require('../../../../models');
                const transaction = await sequelize.transaction();

                try {
                    // Get the tea weight record first
                    const teaWeightRecord = await TeaWeight.findByPk(tea_weight_id, {
                        transaction
                    });

                    if (!teaWeightRecord) {
                        await transaction.rollback();
                        return res.status(404).json({ error: 'Tea weight record not found' });
                    }

                    const weightDate = teaWeightRecord.tea_weight_date;

                    // Delete related employee weight records by date
                    await EmployeeWeight.destroy({
                        where: { emp_weight_date: weightDate },
                        transaction
                    });

                    // Delete related factory weight records by date
                    await FactoryWeight.destroy({
                        where: { fac_weight_date: weightDate },
                        transaction
                    });

                    // Delete main tea weight record
                    await TeaWeight.destroy({
                        where: { tea_weight_id: tea_weight_id },
                        transaction
                    });

                    await transaction.commit();
                    res.status(200).json({ message: 'Tea weight deleted successfully' });
                } catch (error) {
                    await transaction.rollback();
                    throw error;
                }
                break;
            default:
                res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
}