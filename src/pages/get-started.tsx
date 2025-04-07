import React from 'react';
import { AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/animated-section';
import { useActivePage } from '../hooks/useActivePage';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import emailjs from '@emailjs/browser';
import { useIsMobile } from '../hooks/useIsMobile';

interface GetStartedPageProps {
  pageIndex: number;
}

interface FormData {
  profession: string;
  country: string;
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface EmailJSTemplateParams {
  to_emails: string;
  first_name: string;
  last_name: string;
  from_email: string;
  profession: string;
  country: string;
  company_name: string;
  phone: string;
  [key: string]: string; // This adds the index signature
}

const GetStartedPage: React.FC<GetStartedPageProps> = ({ pageIndex }) => {

  const { isActive, setLockMainScroll } = useActivePage({ pageIndex, delay: 300 });
  const isMobile = useIsMobile();

  // Add these states to track dropdown menu open status
  const [isProfessionMenuOpen, setIsProfessionMenuOpen] = React.useState(false);
  const [isCountryMenuOpen, setIsCountryMenuOpen] = React.useState(false);

  React.useEffect(() => {
    // Lock scroll if any dropdown is open
    if (isProfessionMenuOpen || isCountryMenuOpen) {
      setLockMainScroll(true);
    } else {
      setLockMainScroll(false);
    }
  }, [isProfessionMenuOpen, isCountryMenuOpen]);


  // Form state
  const [formData, setFormData] = React.useState<FormData>({
    profession: '',
    country: '',
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // Loading and success states
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  // Professions list - you can customize this
  const professions: string[] = [
    "Fabricator",
    "Manufacturer",
    "Installer",
    "General Contractor",
    "Project Manager",
    "Developer",
    "Architect",
    "Structural Engineer",
    "MEP Engineer",
    "Site Supervisor",
    "Construction Foreman",
    "Procurement Specialist",
    "Supply Chain Manager",
    "Operations Manager",
    "Quality Control Inspector",
    "Construction Consultant",
    "BIM Specialist",
    "Logistics Coordinator"
  ];

  // Convert countries object to array
  const countryOptions = countryList().getData().map(country => ({
    value: country.value,
    label: country.label
  }));

  const professionOptions = professions.map(profession => ({
    value: profession,
    label: profession
  }));

  const formatOptionLabel = ({ value, label }: {value: string, label: string}) => (
    <div className="flex items-center">
      <img
        src={`https://flagcdn.com/16x12/${value.toLowerCase()}.png`}
        alt={label}
        className="mr-2"
      />
      <span>{label}</span>
    </div>
  );

  // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Replace these values with your actual EmailJS service, template, and user IDs
      const serviceId: string = 'service_64bb84r';
      const templateId: string = 'template_uli6m8b';
      const userId: string = '_k2-bwIcrrX_ZxyD6';
      
      const templateParams: EmailJSTemplateParams = {
        to_emails: 'konstantin@maestro-tech.com', // Multiple recipients
        first_name: formData.firstName,
        last_name: formData.lastName,
        from_email: formData.email,
        profession: formData.profession,
        country: formData.country,
        company_name: formData.companyName,
        phone: formData.phone
      };
      
      await emailjs.send(serviceId, templateId, templateParams, userId);
      
      setIsSuccess(true);
      setFormData({
        profession: '',
        country: '',
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      });
    } catch (err) {
      console.error('Error sending email:', err);
      setError('Failed to send your request. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`${isMobile ? 'h-svh pt-20' : ''} text-center text-white px-4 w-full`}
    >
      <AnimatePresence>
        {isActive && (
          <div
            className={`grid w-full ${isMobile ? '' : 'grid-cols-2'} justify-items-center`}
          >
            {!isMobile && <AnimatedSection
              className='flex flex-col w-fit justify-between items-start gap-8 text-left'
            >
                <AnimatedSection
                  direction="left" 
                  delay={0.3}
                  className='flex flex-col gap-3'
                >
                  <h1 className="text-5xl text-[#FF4300] font-bold">
                      Get Started
                  </h1>
                  <AnimatedSection
                  direction="right" 
                  delay={1}
                  className='flex flex-col gap-4'
                  >
                    <h2 className="text-3xl text-white">
                        Free Pilot Programme Active
                    </h2>
                  </AnimatedSection>
                </AnimatedSection>
                <AnimatedSection
                  direction="left" 
                  delay={0.3}
                  className='flex flex-col gap-4'
                >
                  <span 
                      className="text-4xl font-semibold text-white max-w-5xl"
                  >
                    Schedule a demo
                  </span>
                  <span 
                      className="text-4xl font-semibold text-white max-w-5xl"
                  >
                    Get a custom plan
                  </span>
                  <span 
                      className="text-4xl font-semibold text-white max-w-5xl"
                  >
                    Start orchestrating your site
                  </span>
                </AnimatedSection>
            </AnimatedSection>}
            {isSuccess ? (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
                <p className="font-medium">Thank you for your submission!</p>
                <p>We'll be in touch with you shortly.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-3 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                  type="button"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
                <AnimatedSection
                  className='flex w-full justify-center items-center'
                >
                  <form onSubmit={handleSubmit} className={`${isMobile ? '' : 'space-y-4'}`}>
                    {/* Profession Selection */}
                    <div>
                      <label htmlFor="profession" className="block mb-2 text-sm text-left font-medium text-gray-600">
                        What describes your role in the project delivery?
                      </label>
                      <Select
                        id="profession"
                        name="profession"
                        options={professionOptions}
                        value={countryOptions.find(option => option.label === formData.profession)}
                        onChange={(option) => handleChange({
                          target: { name: 'profession', value: option?.label || '' }
                        } as any)}
                        onMenuOpen={() => setIsProfessionMenuOpen(true)}
                        onMenuClose={() => setIsProfessionMenuOpen(false)}
                        placeholder="Select your job title"
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: '#1E1E1E',
                            borderColor: 'rgb(209, 213, 219)',
                            textAlign: 'left',
                            boxShadow: 'none',
                            '&:hover': {
                              borderColor: '#FF4300'
                            }
                          }),
                          option: (base, { isFocused, isSelected }) => ({
                            ...base,
                            backgroundColor: isFocused ? '#FF4300' : '#1E1E1E',
                            textAlign: 'left',
                            color: isFocused ? 'white' : isSelected ? 'white' : 'rgb(209, 213, 219)',
                            '&:hover': {
                              backgroundColor: '#FF4300',
                            }
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: 'white'
                          }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: '#1E1E1E',
                            "&::-webkit-scrollbar": {
                              width: "8px"
                            },
                            "&::-webkit-scrollbar-track": {
                              background: "#1E1E1E"
                            },
                            "&::-webkit-scrollbar-thumb": {
                              background: "white",
                              borderRadius: "4px"
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                              background: "white"
                            }
                          }),
                          menuList: (base) => ({
                            ...base,
                            // These are important for the scrollbar styling to work
                            "&::-webkit-scrollbar": {
                              width: "8px"
                            },
                            "&::-webkit-scrollbar-track": {
                              background: "#1E1E1E"
                            },
                            "&::-webkit-scrollbar-thumb": {
                              background: "white",
                              borderRadius: "4px"
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                              background: "#4b5563"
                            }
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: 'rgb(209, 213, 219)'
                          }),
                        }}
                        required
                      />
                    </div>
                    
                    {/* Country Selection */}
                    <div>
                      <label htmlFor="country" className="block mb-2 text-sm text-left font-medium text-gray-600">
                        Country
                      </label>
                      <Select
                        id="country"
                        name="country"
                        options={countryOptions}
                        value={countryOptions.find(option => option.label === formData.country)}
                        onChange={(option) => handleChange({
                          target: { name: 'country', value: option?.label || '' }
                        } as any)}
                        onMenuOpen={() => setIsCountryMenuOpen(true)}
                        onMenuClose={() => setIsCountryMenuOpen(false)}
                        formatOptionLabel={formatOptionLabel}
                        placeholder="Select your country"
                        className="basic-select"
                        classNamePrefix="select"
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: '#1E1E1E',
                            borderColor: 'rgb(209, 213, 219)',
                            textAlign: 'left',
                            boxShadow: 'none',
                            '&:hover': {
                              borderColor: '#FF4300'
                            }
                          }),
                          option: (base, { isFocused, isSelected }) => ({
                            ...base,
                            backgroundColor: isFocused ? '#FF4300' : '#1E1E1E',
                            textAlign: 'left',
                            color: isFocused ? 'white' : isSelected ? 'white' : 'rgb(209, 213, 219)',
                            '&:hover': {
                              backgroundColor: '#FF4300',
                            }
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: 'white'
                          }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: '#1E1E1E',
                            "&::-webkit-scrollbar": {
                              width: "8px"
                            },
                            "&::-webkit-scrollbar-track": {
                              background: "#1E1E1E"
                            },
                            "&::-webkit-scrollbar-thumb": {
                              background: "white",
                              borderRadius: "4px"
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                              background: "white"
                            }
                          }),
                          menuList: (base) => ({
                            ...base,
                            "&::-webkit-scrollbar": {
                              width: "8px"
                            },
                            "&::-webkit-scrollbar-track": {
                              background: "#1E1E1E"
                            },
                            "&::-webkit-scrollbar-thumb": {
                              background: "white",
                              borderRadius: "4px"
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                              background: "#4b5563"
                            }
                          }),
                          input: (base) => ({
                            ...base,
                            color: 'white'
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: 'rgb(209, 213, 219)'
                          }),
                          indicatorSeparator: (base) => ({
                            ...base,
                            backgroundColor: 'rgb(209, 213, 219)'
                          }),
                          dropdownIndicator: (base) => ({
                            ...base,
                            color: 'rgb(209, 213, 219)',
                            '&:hover': {
                              color: '#FF4300'
                            }
                          })
                        }}
                        required
                      />
                    </div>
                    
                    {/* Company Name */}
                    <div>
                      <label htmlFor="companyName" className="block mb-2 text-sm text-left font-medium text-gray-600">
                        Company / Institution
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-[#1E1E1E] text-white"
                      />
                    </div>
                    
                    {/* First Name */}
                    <div>
                      <label htmlFor="firstName" className="block mb-2 text-sm text-left font-medium text-gray-600">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-[#1E1E1E] text-white"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label htmlFor="lastName" className="block mb-2 text-sm text-left font-medium text-gray-600">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-[#1E1E1E] text-white"
                      />
                    </div>
                    
                    {/* Corporate Email */}
                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm text-left font-medium text-gray-600">
                        Business Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-[#1E1E1E] text-white"
                      />
                    </div>
                    
                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block mb-2 text-sm text-left font-medium text-gray-600">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-[#1E1E1E] text-white"
                      />
                    </div>
                    
                    {/* Error message */}
                    {error && (
                      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                        <p>{error}</p>
                      </div>
                    )}

                    {/* Privacy */}
                    <span
                      className='text-sm md:text-base'
                    >
                      Learn more about our
                      {" "}
                      <a href="https://www.maestro-tech.com/cookie-policy/" className="text-white underline"> cookies policy</a>
                      {" "}
                      and
                      {" "}
                      <a href="https://www.maestro-tech.com/privacy-policy/" className="text-white underline"> privacy policy</a>
                    </span>
                    
                    {/* Submit Button */}
                    <div
                      className='mt-6'
                    >
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full ${isMobile ? 'bg-[#FF4300]' : 'bg-transparent'} border-2 hover:bg-[#FF4300] text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF4300] disabled:bg-blue-300`}
                      >
                        {isLoading ? 'Submitting...' : isMobile ? 'Schedule a demo' :'Submit'}
                      </button>
                    </div>
                  </form>
                </AnimatedSection>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GetStartedPage;