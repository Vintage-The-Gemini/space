import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const InstrumentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [instrument, setInstrument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInstrumentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/instruments/${id}`);
                setInstrument(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchInstrumentDetails();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        </div>
    );

    if (!instrument) return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center">No instrument found</div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            {instrument.name}
                        </h1>
                        <span className={`px-4 py-2 rounded ${
                            instrument.status === 'Active' ? 'bg-green-100 text-green-800' :
                            instrument.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                            {instrument.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                            <div className="space-y-3">
                                <p className="text-gray-600">
                                    <span className="font-semibold">Type:</span> {instrument.type}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-semibold">Location:</span> {instrument.location}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-semibold">Discovery Date:</span>{' '}
                                    {new Date(instrument.discoveryDate).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-semibold">Last Contact:</span>{' '}
                                    {new Date(instrument.lastContact).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                            <div className="space-y-3">
                                {instrument.specifications && (
                                    <>
                                        <p className="text-gray-600">
                                            <span className="font-semibold">Dimensions:</span>{' '}
                                            {`${instrument.specifications.dimensions?.length}x${instrument.specifications.dimensions?.width}x${instrument.specifications.dimensions?.height} ${instrument.specifications.dimensions?.unit}`}
                                        </p>
                                        <p className="text-gray-600">
                                            <span className="font-semibold">Weight:</span>{' '}
                                            {`${instrument.specifications.weight?.value} ${instrument.specifications.weight?.unit}`}
                                        </p>
                                        <p className="text-gray-600">
                                            <span className="font-semibold">Power Source:</span>{' '}
                                            {instrument.specifications.powerSource}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Mission Details</h2>
                        {instrument.mission && (
                            <div className="space-y-3">
                                <p className="text-gray-600">
                                    <span className="font-semibold">Mission Name:</span> {instrument.mission.name}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-semibold">Agency:</span> {instrument.mission.agency}
                                </p>
                                <div>
                                    <span className="font-semibold">Objectives:</span>
                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                        {instrument.mission.objectives?.map((objective, index) => (
                                            <li key={index} className="text-gray-600 ml-4">{objective}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-300"
                        >
                            Back to List
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstrumentDetails;