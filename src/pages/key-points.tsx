import React from 'react';
import { AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/animated-section';
import { useActivePage } from '../hooks/useActivePage';

interface KeyPointsProps {
  pageIndex: number;
}

const KeyPoints: React.FC<KeyPointsProps> = ({ pageIndex }) => {
  const { isActive } = useActivePage({ pageIndex, delay: 300 });

  return (
    <div className="text-center text-white px-4">
      <AnimatePresence>
        {isActive && (
          <>            
            <div className="grid grid-rows-2 p-10 relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full my-auto top-0 bottom-0 w-px bg-white/30"></div>
              <div className="absolute top-1/2 transform -translate-y-1/2 w-full my-auto left-0 right-0 h-px bg-white/30"></div>
              <div
              >
                <div className="grid grid-cols-2 text-left text-3xl p-6">
                    <AnimatedSection 
                        direction="left" 
                        delay={0.5}
                        className='flex flex-col gap-2'
                    >
                        <p className="pr-8 font-bold">
                            Project setup in under an hour. 
                        </p>
                        <p className="pr-8">
                            We support 26 different model types & provide simple tools to organise your logistics and create an assembly plan. From there, its all about time savings: no more drafting installation plans, no more reporting paperwork & less time spent on site.
                        </p>
                    </AnimatedSection>
                    <AnimatedSection 
                        direction="right" 
                        delay={0.8}
                        className='flex flex-col gap-2'
                    >
                        <p className="pl-8 font-bold">
                            Accessible anywhere, anytime.  
                        </p>
                        <p className="pl-8">
                            Maestro Pilot is 100% web-based, allowing your teams to collaborate on model-set up, and site crews to access the latest data from any device.
                        </p>
                    </AnimatedSection>
                </div>
              </div>
                
              <div>
                <div className="grid grid-cols-2 text-left text-3xl p-6 ">
                    <AnimatedSection
                        direction='left'
                        delay={1.1}
                        className='flex flex-col gap-2'
                    >
                        <p className="pr-8 font-bold">
                            Artificial Intelligence in your tool belt.
                        </p>
                        <p className="pr-8">
                            Enjoy predictive logistics, automated progress tracking, and AI-driven delay prevention—so you can spot issues early and keep your project on course.
                        </p>
                    </AnimatedSection>
                    <AnimatedSection
                        direction="right"
                        delay={1.4}
                        className='flex flex-col gap-2'
                    >
                        <p className="pl-8 font-bold">
                            Integrated with your infrastructure.  
                        </p>
                        <p className="pl-8">
                            Looking to optimise your operation, but don't want to substitute tried and tested tools? Inquire about seamless integration with warehousing & ERP systems.
                        </p>
                    </AnimatedSection>
                </div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KeyPoints;