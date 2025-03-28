import React from 'react';
import FullPageScroll from './components/full-page-scroll';
import { HomePage, FeaturePage, AboutPage, ContactPage } from './pages';
import { PageProps } from './components/types';

const App: React.FC = () => {
  // Define pages with components as children
  const pages: PageProps[] = [
    {
      id: 'home',
      bgColor: 'bg-blue-500',
      children: <HomePage pageIndex={0} />
    },
    {
      id: 'features',
      bgColor: 'bg-red-500',
      children: <FeaturePage pageIndex={1} />
    },
    {
      id: 'about',
      bgColor: 'bg-green-500',
      children: <AboutPage pageIndex={2} />
    },
    {
      id: 'contact',
      bgColor: 'bg-purple-500',
      children: <ContactPage pageIndex={3} />
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