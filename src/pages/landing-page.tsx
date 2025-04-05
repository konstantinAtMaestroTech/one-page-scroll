import React from 'react';
import {motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/animated-section';
import { useActivePage } from '../hooks/useActivePage';
import { MoveRight } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

interface LandingPageProps {
    pageIndex: number;
}

const LandingPage: React.FC<LandingPageProps> = ({ pageIndex }) => {

    const isMobile = useIsMobile();

    return isMobile ? <LandingPageMobile pageIndex={pageIndex} /> : <LandingPageDesktop pageIndex={pageIndex} />
}

const LandingPageMobile: React.FC<LandingPageProps> = ({ pageIndex }) => {
    const { isActive } = useActivePage({ pageIndex });
    const videoRef1 = React.useRef<HTMLVideoElement>(null);
    const videoRef2 = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        // Ensure videos play when component mounts and is active
        if (isActive) {
            if (videoRef1.current) {
                videoRef1.current.play().catch(err => console.log('Video 1 autoplay failed:', err));
            }
            if (videoRef2.current) {
                videoRef2.current.play().catch(err => console.log('Video 2 autoplay failed:', err));
            }   
        }
    }, [isActive]);

    return (
        <AnimatePresence>
            {isActive && (
                <div 
                    className='h-svh w-screen grid grid-rows-2 bg-amber-400 mb-7'
                >
                    {/* <div>
                        <AnimatedSection
                            direction='left'
                            duration={1}
                            delay={0.2}
                            className='px-8 mt-28 h-full w-full flex flex-col items-center justify-start gap-8'
                        >
                            <div
                                className='flex flex-col gap-5'
                            >
                                <h1 className="text-5xl font-bold text-white text-left">
                                    From factory floor to final installation
                                </h1>
                                <h2 
                                    className="text-2xl text-white font-bold max-w-5xl text-left"
                                >
                                    <span className='text-[#FF4300]'>MAESTRO PILOT</span> bridges production data and site execution for a faster build
                                </h2>
                            </div>
                            <motion.button 
                                className="flex justify-between gap-4 border-2 border-[#FF4300] bg-transparent text-[#FF4300] font-semibold py-2 px-6 rounded-full"
                                whileHover={{ scale: 1.05, background:"#FF4300", color: 'white' }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                onClick={() => navigateToPage(6)}
                            >
                                Get Started
                                <MoveRight/>
                            </motion.button>
                        </AnimatedSection>
                    </div>
                    <div className='relative flex justify-center items-center'>
                        <div className='absolute inset-8 flex justify-center items-center'>
                            <video 
                                ref={videoRef2}
                                className='max-h-full max-w-full object-contain'
                                loop
                                muted
                                playsInline
                                autoPlay
                            >
                                <source src="./videos/static-pc.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div className='absolute inset-20 flex justify-center items-center z-10 transform translate-x-[70px] translate-y-[40px]'>
                            <video 
                                ref={videoRef1}
                                className='max-h-full max-w-full object-contain'
                                loop
                                muted
                                playsInline
                                autoPlay
                            >
                                <source src="./videos/webm_transparency.webm" type="video/webm" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div> */}
                </div>
        )}
        </AnimatePresence>
    );
}

const LandingPageDesktop: React.FC<LandingPageProps> = ({ pageIndex }) => {
    const { isActive, navigateToPage } = useActivePage({ pageIndex });
    const videoRef1 = React.useRef<HTMLVideoElement>(null);
    const videoRef2 = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        // Ensure videos play when component mounts and is active
        if (isActive) {
            if (videoRef1.current) {
                videoRef1.current.play().catch(err => console.log('Video 1 autoplay failed:', err));
            }
            if (videoRef2.current) {
                videoRef2.current.play().catch(err => console.log('Video 2 autoplay failed:', err));
            }   
        }
    }, [isActive]);
  
        return (
            <AnimatePresence>
            {isActive && (
                <div 
                className='h-screen w-screen grid grid-rows-3'
                >
                    <div>
                        <AnimatedSection
                            direction='left'
                            duration={1}
                            delay={0.2}
                            className='px-8 h-full w-full flex flex-col items-center justify-end gap-4'
                        >
                            <div
                                className='flex flex-col gap-3'
                            >
                                <h1 className="text-5xl font-bold text-white text-center">
                                    From factory floor to final installation
                                </h1>
                                <h2 
                                    className="text-4xl text-white max-w-5xl text-center"
                                >
                                    <span className='text-[#FF4300]'>Maestro Pilot</span> bridges production data and site execution for a faster build
                                </h2>
                            </div>
                            <motion.button 
                                className="flex justify-between gap-4 border-2 border-[#FF4300] bg-transparent text-[#FF4300] font-semibold py-2 px-6 rounded-full"
                                whileHover={{ scale: 1.05, background:"#FF4300", color: 'white' }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                onClick={() => navigateToPage(6)}
                            >
                                Get Started
                                <MoveRight/>
                            </motion.button>
                        </AnimatedSection>
                    </div>
                    <div className='row-span-2 relative flex justify-center items-center'>
                        <div className='absolute inset-8 flex justify-center items-center'>
                            <video 
                                ref={videoRef2}
                                className='max-h-full max-w-full object-contain'
                                loop
                                muted
                                playsInline
                                autoPlay
                            >
                                <source src="./videos/static-pc.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                        </video>
                    </div>
                    <div className='absolute inset-12 flex justify-center items-center z-10 transform translate-x-[-270px] translate-y-[50px]'>
                        <video 
                            ref={videoRef1}
                            className='max-h-full max-w-full object-contain'
                            loop
                            muted
                            playsInline
                            autoPlay
                        >
                            <source src="./videos/webm_transparency.webm" type="video/webm" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>
          )}
        </AnimatePresence>
    );
  };
  
  export default LandingPage;