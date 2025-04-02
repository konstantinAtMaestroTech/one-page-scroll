import React from 'react';
import { AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/animated-section';
import { useActivePage } from '../hooks/useActivePage';

interface AboutPageProps {
  pageIndex: number;
}

const AboutPage: React.FC<AboutPageProps> = ({ pageIndex }) => {
  const { isActive } = useActivePage({ pageIndex, delay: 300 });

  return (
    <div className="text-center text-white px-4">
      <AnimatePresence>
        {isActive && (
          <>            
            <div className="grid grid-cols-2 p-10">
                <AnimatedSection direction="right" delay={0.5}>
                    <div className="text-left text-5xl font-bold">
                    <h3>
                        Built by practitioners, for practitioners.
                    </h3>
                    </div>
                </AnimatedSection>
                
              <AnimatedSection direction="left" delay={0.5}>
                <div className="text-left text-2xl font-semibold">
                  <p className="mb-4">
                    Originally developed as an in-house tool at <a href="https://maestro-tech.com" className=" hover:text-[#FF4300] underline">Maestro Technologies</a> — a general contractor — Maestro Pilot was born from real-world challenges in project delivery. 
                  </p>
                  <p>
                    To realise the transformative potential of prefabrication design, production, and assembly activities must run in sync.
                    MaestroPilot makes this happen with a data-driven workflow customized to your project.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AboutPage;