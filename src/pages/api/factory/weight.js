import { getTotalWeightPerFactory } from "../../../services/factoryWeightService";

export default async function handler(req, res) {
    const { method } = req;

    try {
        switch (method) {
            case 'GET':
                // Fetch factories with their total weight
                const factoriesWithTotalWeight = await getTotalWeightPerFactory();
                console.log(factoriesWithTotalWeight);
                res.status(200).json(factoriesWithTotalWeight);
                break;
            default:
                res.setHeader('Allow', ['GET']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}