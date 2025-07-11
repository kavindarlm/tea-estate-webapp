import { useState, useEffect } from 'react';

const EditFactory = ({ factoryId, onClose }) => {
    const [factory, setFactory] = useState({
        fac_name: '',
        fac_email: '',
        fac_address: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (factoryId) {
            fetchFactoryData(factoryId);
        }
    }, [factoryId]);

    const fetchFactoryData = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/factory/${id}`);
            const data = await response.json();
            setFactory(data);
            setLoading(false);
        }
        catch (error) {
            console.error('Error fetching factory data:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFactory((prevFactory) => ({
            ...prevFactory,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/api/factory/${factoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(factory)
            });
            if (!response.ok) {
                console.error('Failed to update factory data:', response.status);
                return;
            }
            alert('Factory data updated successfully');
            onClose();
        } catch (error) {
            console.error('Error updating factory data:', error);
        }
    };

    const handleCancelClick = () => {
        onClose();
    };

    const handleDeleteClick = async () => {
        if (confirm('Are you sure you want to delete this factory?')) {
            try {
                const response = await fetch(`http://localhost:3000/api/factory/${factoryId}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    console.error('Failed to delete factory data:', response.status);
                    return;
                }
                onClose();
            } catch (error) {
                console.error('Error deleting factory data:', error);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    };

    return (
        <form className="space-y-8 px-4 sm:px-4 lg:px-8 sm:py-2 lg:py-4" onSubmit={handleSubmit}>
            <div className="border-b border-gray-900/10 pb-10">
                <h2 className="text-lg font-semibold leading-7 text-gray-900">Edit Factory Details</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">Update factory information</p>

                <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                    <div className="sm:col-span-full">
                        <label htmlFor="fac_name" className="block text-sm font-medium leading-6 text-gray-900">
                            Factory name
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="fac_name"
                                id="fac_name"
                                autoComplete="given-name"
                                value={factory.fac_name}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="fac_email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email Address
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="fac_email"
                                id="fac_email"
                                autoComplete="factory-email"
                                value={factory.fac_email}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                            />
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="fac_address" className="block text-sm font-medium leading-6 text-gray-900">
                            Address
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="fac_address"
                                id="fac_address"
                                autoComplete="factory-address"
                                value={factory.fac_address}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-x-6">
                <button
                    type="button"
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-buttonColor"
                    onClick={handleDeleteClick}
                >
                    Delete
                </button>
                <div className="flex items-center gap-x-6">
                    <button
                        type="button"
                        className="text-sm font-semibold leading-6 text-gray-900"
                        onClick={handleCancelClick}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-buttonColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-buttonColor"
                    >
                        Update
                    </button>
                </div>
            </div>
        </form>
    )


}

export default EditFactory;