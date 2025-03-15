import React, { useState, useEffect } from "react";
import axios from "axios";
import { Camera, Calendar, Map } from "lucide-react";

const MarsExplorer = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedRover, setSelectedRover] = useState("curiosity");
  const [selectedSol, setSelectedSol] = useState(1000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const rovers = ["Curiosity", "Perseverance", "Opportunity", "Spirit"];

  useEffect(() => {
    fetchMarsPhotos();
  }, [selectedRover, selectedSol]);

  const fetchMarsPhotos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://space-mgph.onrender.com/api/nasa/mars/${selectedRover}?sol=${selectedSol}`
      );
      setPhotos(response.data.photos);
      setLoading(false);
    } catch (err) {
      setError("Error fetching Mars photos");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Control Panel */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl text-white font-bold mb-4">Mars Explorer</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rover Selection */}
          <div>
            <label className="block text-gray-300 mb-2">Select Rover</label>
            <select
              value={selectedRover}
              onChange={(e) => setSelectedRover(e.target.value)}
              className="w-full bg-gray-700 text-white rounded p-2"
            >
              {rovers.map((rover) => (
                <option key={rover} value={rover.toLowerCase()}>
                  {rover}
                </option>
              ))}
            </select>
          </div>

          {/* Sol Selection */}
          <div>
            <label className="block text-gray-300 mb-2">Mars Sol</label>
            <input
              type="number"
              value={selectedSol}
              onChange={(e) => setSelectedSol(e.target.value)}
              className="w-full bg-gray-700 text-white rounded p-2"
              min="0"
              max="3000"
            />
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="bg-gray-800 rounded-lg overflow-hidden"
            >
              <img
                src={photo.img_src}
                alt={`Mars - ${photo.camera.full_name}`}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <Camera className="h-5 w-5 text-blue-400 mr-2" />
                  <span className="text-white">{photo.camera.full_name}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-green-400 mr-2" />
                  <span className="text-gray-300">
                    {new Date(photo.earth_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Map className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-gray-300">Sol {photo.sol}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && !loading && !error && (
        <div className="text-center text-gray-400 p-8">
          No photos found for the selected criteria
        </div>
      )}
    </div>
  );
};

export default MarsExplorer;
