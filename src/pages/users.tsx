import React from 'react';
import { AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/animated-section';
import { useActivePage } from '../hooks/useActivePage';

interface AboutPageProps {
  pageIndex: number;
}

const Users: React.FC<AboutPageProps> = ({ pageIndex }) => {
  const { isActive } = useActivePage({ pageIndex, delay: 300 });

  return (
    <div className="text-center text-white px-4">
      <AnimatePresence>
        {isActive && (
          <>            
            <div className="grid grid-rows-2 p-10 relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full my-auto top-0 bottom-0 w-px bg-white/30"></div>
              <AnimatedSection 
                direction="up" 
                delay={0.5}
                className='flex justify-end'
              >
                <div className="grid grid-cols-2 text-left text-4xl p-6 items-start">
                  <p className="pr-8">
                    For <span className='font-bold'>fabricators</span> and <span className='font-bold'>manufacturers</span> and <span className='font-bold'>installers</span>: optimise your operations 
                  </p>
                  <p className="pl-8">
                    For <span className="font-bold">General Contractors</span>, <span className="font-bold">Project Managers</span> and <span className='font-bold'>Developers</span>: master the complexity of your jobsite
                  </p>
                </div>
              </AnimatedSection>
                
              <AnimatedSection direction="down" delay={0.5}>
                <div className="grid grid-cols-2 text-left text-4xl p-6 ">
                  <p className="pr-8">
                    Upload your production models, plan logistics and assembly, and equip your crews with the real-time data they need to get the job done—faster and more accurately. 
                  </p>
                  <p className="pl-8">
                    Specify Maestro Pilot in your tender and let software be your boots on the ground: track production progress, manage complex scope splits and ensure assembly goes to plan.
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

export default Users;