import { getTotalWeightPerFactory } from "../../../services/factoryWeightService";

export default async function handler(req, res) {
    const { method, query } = req;

    try {
        switch (method) {
            case 'GET':
                let dateFilter = null;
                
                // Check if date filtering parameters are provided
                if (query.filterType && query.date) {
                    dateFilter = {
                        type: query.filterType, // 'day' for specific date filtering
                        date: query.date
                    };
                }
                
                // Fetch factories with their total weight (filtered or unfiltered)
                const factoriesWithTotalWeight = await getTotalWeightPerFactory(dateFilter);
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