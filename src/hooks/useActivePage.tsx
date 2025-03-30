import { useContext, useEffect, useState } from 'react';
import { PageContext } from '../components/full-page-scroll';

interface UseActivePageOptions {
  pageIndex: number;
  // Optional delay before considering the page active (in ms)
  delay?: number;
}

export const useActivePage = ({ pageIndex, delay = 0 }: UseActivePageOptions) => {
  const { activePage, totalPages, lockMainScroll, navigateToPage } = useContext(PageContext);
  const [isActive, setIsActive] = useState(false);
  const [hasBeenActive, setHasBeenActive] = useState(false);

  useEffect(() => {
    if (activePage === pageIndex) {
      // If there's a delay, wait for it
      if (delay > 0) {
        const timer = setTimeout(() => {
          setIsActive(true);
          setHasBeenActive(true);
        }, delay);
        return () => clearTimeout(timer);
      } else {
        setIsActive(true);
        setHasBeenActive(true);
      }
    } else {
      setIsActive(false);
    }
  }, [activePage, pageIndex, delay]);

  // Function to lock/unlock the main scroll functionality
  const setLockMainScroll = (lock: boolean) => {
    lockMainScroll(lock);
  };

  return { 
    isActive, 
    hasBeenActive, 
    setLockMainScroll, 
    activePage, 
    totalPages,
    navigateToPage 
  };
};