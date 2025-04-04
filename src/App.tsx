import React from 'react';
import FullPageScroll from './components/full-page-scroll';
import { 
  GetStarted,
  KeyPoints, 
  LandingPage, 
  MaestroBio,
  MobileFeatures,
  DesktopFeatures,
  Users 
} from './pages';
import { PageProps } from './components/types';

const App: React.FC = () => {
  // Define pages with components as children
  const pages: PageProps[] = [
    {
      id: 'landing',
      bgColor: 'bg-[#1E1E1E]',
      children: <LandingPage pageIndex={0} />
    },
    {
      id: 'maestro-bio',
      bgColor: 'bg-[#1E1E1E]',
      children: <MaestroBio pageIndex={1} />,
    },
    {
      id: 'mobile-features',
      bgColor: 'bg-[#1E1E1E]',
      children: <MobileFeatures pageIndex={2} />,
    },
    {
      id: 'desktop-features',
      bgColor: 'bg-[#1E1E1E]',
      children: <DesktopFeatures pageIndex={3} />,
    },
    {
      id: 'about',
      bgColor: 'bg-[#1E1E1E]',
      children: <Users pageIndex={4} />
    },
    {
      id: 'key-points',
      bgColor: 'bg-[#FF4300]',
      children: <KeyPoints pageIndex={5}/>
    },
    {
      id: 'contact',
      bgColor: 'bg-[#1E1E1E]',
      children: <GetStarted pageIndex={6}/>
    }
  ];

  return (
    <div className="App">
      <FullPageScroll 
        pages={pages} 
        transitionDuration={1000}
        showNavigation={true}
      />
    </div>
  );
};

export default App;