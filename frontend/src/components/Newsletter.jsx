import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Add your newsletter subscription logic here
    try {
      setStatus({ type: 'success', message: 'Thank you for subscribing!' });
      setEmail('');
    } catch (error) {
      setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16" aria-label="Newsletter Subscription">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-12 text-center backdrop-blur-sm"
      >
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter for the latest space discoveries and mission updates
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-6 py-3 rounded-lg bg-black/50 border border-gray-700 focus:outline-none focus:border-blue-500"
            required
            aria-label="Email address"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
          >
            Subscribe
            <Radio className="w-4 h-4 ml-2" aria-hidden="true" />
          </button>
        </form>

        {status.message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 ${
              status.type === 'error' ? 'text-red-400' : 'text-green-400'
            }`}
          >
            {status.message}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
};

export default Newsletter;