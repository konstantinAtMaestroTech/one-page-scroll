import React from 'react';
import FullPageScroll from './components/full-page-scroll';
import { 
  AboutPage, 
  ContactPage, 
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
      id: 'maestro-bio',
      bgColor: 'bg-[#1E1E1E]',
      children: <MobileFeatures pageIndex={2} />,
    },
    {
      id: 'maestro-bio',
      bgColor: 'bg-[#1E1E1E]',
      children: <DesktopFeatures pageIndex={3} />,
    },
    {
      id: 'about',
      bgColor: 'bg-[#1E1E1E]',
      children: <Users pageIndex={4} />
    },
    {
      id: 'contact',
      bgColor: 'bg-purple-500',
      children: <ContactPage pageIndex={6} />
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