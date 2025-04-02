import React from 'react';
import FullPageScroll from './components/full-page-scroll';
import { HomePage, FeaturePage, AboutPage, ContactPage, LandingPage } from './pages';
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
      id: 'home',
      bgColor: 'bg-[#1E1E1E]',
      children: <HomePage pageIndex={1} />
    },
    {
      id: 'features',
      bgColor: 'bg-red-500',
      children: <FeaturePage pageIndex={2} />
    },
    {
      id: 'about',
      bgColor: 'bg-green-500',
      children: <AboutPage pageIndex={3} />
    },
    {
      id: 'contact',
      bgColor: 'bg-purple-500',
      children: <ContactPage pageIndex={4} />
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