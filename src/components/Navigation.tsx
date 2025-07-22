import { useEffect, useState } from 'react';
import { usePortfolioData } from '@/hooks/usePortfolioData';

export default function Navigation() {
  const { data: portfolioData } = usePortfolioData();
  const [currentTitle, setCurrentTitle] = useState('Atharva Gupta');
  const [titleIndex, setTitleIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  // Dynamic title cycling
  useEffect(() => {
    if (!portfolioData?.titles) return;

    const interval = setInterval(() => {
      setTitleIndex(prev => {
        const next = (prev + 1) % portfolioData.titles.length;
        setCurrentTitle(portfolioData.titles[next]);
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [portfolioData]);

  // Handle navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setActiveSection(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavClick = (section: string) => {
    window.location.hash = section;
    setActiveSection(section);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'audio', label: 'Audio' },
    { id: 'images', label: 'Images' },
    { id: 'videos', label: 'Videos' },
    { id: 'texts', label: 'Texts' },
    { id: 'downloads', label: 'Downloads' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'thesis', label: 'Thesis' },
  ];

  return (
    <nav className="fixed-nav">
      <div className="nav-container">
        <div className="nav-logo">
          <a 
            href="#home" 
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
          >
            {currentTitle}
          </a>
        </div>
        
        <ul className="nav-menu">
          {navItems.map(item => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
