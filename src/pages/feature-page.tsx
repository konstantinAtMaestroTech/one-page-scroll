import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/animated-section';
import { useActivePage } from '../hooks/useActivePage';

interface FeaturePageProps {
  pageIndex: number;
}

const FeaturePage: React.FC<FeaturePageProps> = ({ pageIndex }) => {
  const { isActive } = useActivePage({ pageIndex, delay: 300 });

  const features = [
    { id: 1, title: 'Responsive Design', description: 'Works on all devices and screen sizes' },
    { id: 2, title: 'TypeScript Support', description: 'Fully typed for better development experience' },
    { id: 3, title: 'Smooth Transitions', description: 'Beautiful scroll-based page transitions' }
  ];

  React.useEffect(()=>{
      if(isActive) console.log('the feature page is active')
  },[isActive])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="text-center text-white max-w-5xl px-4">
      <AnimatePresence>
        {isActive && (
          <>
            <AnimatedSection>
              <h2 className="text-5xl font-bold mb-12">Key Features</h2>
            </AnimatedSection>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {features.map(feature => (
                <motion.div 
                  key={feature.id} 
                  className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)"
                  }}
                >
                  <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p>{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeaturePage;