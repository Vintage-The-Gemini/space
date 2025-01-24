import React from 'react';
import { motion } from 'framer-motion';

const MarsPhotos = ({ photos }) => {
  if (!photos?.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 bg-gray-800/50" aria-label="Latest Mars Photos">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4">Latest from Mars</h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-lg aspect-square"
          >
            <img
              src={photo.img_src}
              alt={`Mars - Sol ${photo.sol}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-sm text-gray-300">Sol: {photo.sol}</p>
                <time className="text-xs text-gray-400">
                  {new Date(photo.earth_date).toLocaleDateString()}
                </time>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default MarsPhotos;