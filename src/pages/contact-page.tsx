import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/animated-section';
import { useActivePage } from '../hooks/useActivePage';

interface ContactPageProps {
  pageIndex: number;
}

const ContactPage: React.FC<ContactPageProps> = ({ pageIndex }) => {
  const { isActive } = useActivePage({ pageIndex, delay: 300 });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    alert('Thanks for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const formItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="text-white max-w-3xl w-full px-4">
      <AnimatePresence>
        {isActive && (
          <>
            <AnimatedSection>
              <h2 className="text-5xl font-bold mb-8 text-center">Contact Us</h2>
            </AnimatedSection>
            
            <motion.form 
              onSubmit={handleSubmit} 
              className="w-full"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="mb-4" variants={formItemVariants}>
                <label htmlFor="name" className="block mb-2 font-medium">Name</label>
                <motion.input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 bg-white bg-opacity-10 rounded-lg border border-gray-300 border-opacity-20 
                             text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  whileFocus={{ scale: 1.01, borderColor: '#3b82f6' }}
                  required
                />
              </motion.div>
              
              <motion.div className="mb-4" variants={formItemVariants}>
                <label htmlFor="email" className="block mb-2 font-medium">Email</label>
                <motion.input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-white bg-opacity-10 rounded-lg border border-gray-300 border-opacity-20 
                             text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  whileFocus={{ scale: 1.01, borderColor: '#3b82f6' }}
                  required
                />
              </motion.div>
              
              <motion.div className="mb-6" variants={formItemVariants}>
                <label htmlFor="message" className="block mb-2 font-medium">Message</label>
                <motion.textarea 
                  id="message" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full p-3 bg-white bg-opacity-10 rounded-lg border border-gray-300 border-opacity-20 
                             text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  whileFocus={{ scale: 1.01, borderColor: '#3b82f6' }}
                  required
                ></motion.textarea>
              </motion.div>
              
              <motion.button 
                type="submit"
                className="w-full py-3 px-6 bg-blue-500 text-white font-medium rounded-lg"
                variants={formItemVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Send Message
              </motion.button>
            </motion.form>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactPage;