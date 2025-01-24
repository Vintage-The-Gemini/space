import React from 'react';
import { motion } from 'framer-motion';

const NewsSection = ({ news }) => {
  if (!news?.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 bg-gray-800/50" aria-label="Latest Space News">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold mb-4">Latest Space News</h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {news.map((article, index) => (
          <motion.article
            key={article.id}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group bg-black/30 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={article.image_url || '/api/placeholder/400/300'}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = '/api/placeholder/400/300';
                }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
              <div className="absolute bottom-4 left-4">
                <time className="text-sm text-gray-300">
                  {new Date(article.published_at).toLocaleDateString()}
                </time>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 line-clamp-2">{article.title}</h3>
              <p className="text-gray-300 mb-6 line-clamp-3">{article.summary}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-400 hover:text-blue-300"
              >
                Read Full Article
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;