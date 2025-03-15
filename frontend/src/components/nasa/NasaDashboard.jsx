import React, { useState, useEffect } from "react";
import axios from "axios";
import { Camera, Rocket, Globe, Star } from "lucide-react";

const NasaDashboard = () => {
  const [apodData, setApodData] = useState(null);
  const [marsPhotos, setMarsPhotos] = useState([]);
  const [neoData, setNeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNasaData = async () => {
      try {
        setLoading(true);

        // Fetch APOD
        const apodResponse = await axios.get(
          "https://space-mgph.onrender.com/api/nasa/apod"
        );
        setApodData(apodResponse.data);

        // Fetch Mars photos
        const marsResponse = await axios.get(
          "https://space-mgph.onrender.com/api/nasa/mars/curiosity"
        );
        setMarsPhotos(marsResponse.data.photos.slice(0, 4));

        // Fetch NEO data
        const today = new Date().toISOString().split("T")[0];
        const neoResponse = await axios.get(
          `https://space-mgph.onrender.com/api/nasa/neo?start_date=${today}&end_date=${today}`
        );
        setNeoData(neoResponse.data);

        setLoading(false);
      } catch (err) {
        setError("Error fetching NASA data");
        setLoading(false);
      }
    };

    fetchNasaData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* APOD Section */}
      {apodData && (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Astronomy Picture of the Day
            </h2>
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <img
                src={apodData.url}
                alt={apodData.title}
                className="object-cover rounded-lg"
              />
            </div>
            <h3 className="text-xl text-white mb-2">{apodData.title}</h3>
            <p className="text-gray-300">{apodData.explanation}</p>
          </div>
        </div>
      )}

      {/* Mars Photos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {marsPhotos.map((photo) => (
          <div
            key={photo.id}
            className="bg-gray-800 rounded-lg overflow-hidden"
          >
            <img
              src={photo.img_src}
              alt={`Mars - ${photo.camera.full_name}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <p className="text-white text-sm">
                {photo.camera.full_name} - Sol {photo.sol}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* NEO Stats */}
      {neoData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Star className="h-8 w-8 text-yellow-400 mr-3" />
              <h3 className="text-xl text-white">Near Earth Objects</h3>
            </div>
            <p className="text-3xl text-white">
              {neoData.element_count}
              <span className="text-sm text-gray-400 ml-2">detected today</span>
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Rocket className="h-8 w-8 text-red-400 mr-3" />
              <h3 className="text-xl text-white">Potentially Hazardous</h3>
            </div>
            <p className="text-3xl text-white">
              {
                Object.values(neoData.near_earth_objects)[0].filter(
                  (neo) => neo.is_potentially_hazardous_asteroid
                ).length
              }
              <span className="text-sm text-gray-400 ml-2">asteroids</span>
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Globe className="h-8 w-8 text-blue-400 mr-3" />
              <h3 className="text-xl text-white">Closest Approach</h3>
            </div>
            {Object.values(neoData.near_earth_objects)[0].length > 0 && (
              <p className="text-3xl text-white">
                {Math.round(
                  Object.values(neoData.near_earth_objects)[0][0]
                    .close_approach_data[0].miss_distance.lunar
                )}
                <span className="text-sm text-gray-400 ml-2">
                  lunar distances
                </span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NasaDashboard;
