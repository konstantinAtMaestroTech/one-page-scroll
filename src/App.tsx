import React from 'react';
import FullPageScroll from './components/full-page-scroll';
import CookieConsent from "react-cookie-consent";
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
    <div 
      className="App"
      id='app'
    >
      <FullPageScroll 
        pages={pages} 
        transitionDuration={1000}
        showNavigation={true}
      />
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        declineButtonText="Decline"
        enableDeclineButton
        cookieName="gdpr-consent"
        style={{ 
          background: "#FF4300",
          opacity: 0.9,
          zIndex: 999, // Ensure it's above everything
          backdropFilter: "blur(5px)" // Modern glass effect
        }}
        buttonStyle={{ 
          background: "#FF4300",
          borderWidth: 2,
          borderColor: 'white',
          borderStyle: 'solid',
          color: "white", 
          fontSize: "13px",
          borderRadius: "4px",
          padding: "8px 16px",
          fontWeight: "500",
          transition: "all 0.3s ease",
          boxShadow: "0 0 0 0 rgba(255, 255, 255, 0.5)",
          cursor: "pointer",
        }}
        declineButtonStyle={{
          background: "#1E1E1E",
          borderWidth: 2,
          borderColor: '#1E1E1E',
          borderStyle: 'solid',
          color: "white",
          fontSize: "13px",
          borderRadius: "4px",
          padding: "8px 16px",
          fontWeight: "500",
          marginRight: "10px",
          cursor: "pointer",
        }}
        onDecline={() => {
          // Handle decline action if needed
        }}
        expires={150}
      >
        Maestropilot.ai uses cookies to enhance your experience. Learn more about our
        {" "}
        <a href="https://www.maestro-tech.com/cookie-policy/" className="text-white underline"> cookies policy</a>
        {" "}
        and
        {" "}
        <a href="https://www.maestro-tech.com/privacy-policy/" className="text-white underline"> privacy policy</a>
      </CookieConsent>
    </div>
  );
};

export default App;