import { useState, useEffect } from 'react';
import BackgroundCanvas from '../components/BackgroundCanvas';
import CustomCursor from '../components/CustomCursor';
import FloatingText from '../components/FloatingText';
import AudioPlayer from '../components/AudioPlayer';
import GlitchOverlay from '../components/GlitchOverlay';

const titles = ['Atharva Gupta', 'Asymmetrica', 'AudioDevout'];

export default function Home() {
  const [currentTitle, setCurrentTitle] = useState(titles[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitle(prev => {
        const currentIndex = titles.indexOf(prev);
        return titles[(currentIndex + 1) % titles.length];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const glitchNavigate = (target: string) => {
    (window as any).triggerGlitch?.(() => {
      if (target.startsWith('#')) {
        scrollToSection(target.substring(1));
      }
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to stop all audio
      if (e.code === 'Escape') {
        const audios = document.querySelectorAll('audio');
        audios.forEach(audio => audio.pause());
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-doto overflow-x-hidden">
      <BackgroundCanvas />
      <CustomCursor />
      <FloatingText />
      <GlitchOverlay />

      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded"
        style={{ 
          backgroundColor: 'var(--accent-color)', 
          color: 'var(--bg-color)' 
        }}
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 p-4 md:p-6">
        {/* Title */}
        <h1 
          className="text-center text-lg md:text-2xl font-bold glow-text transition-all duration-300"
          style={{ 
            color: 'var(--accent-color)', 
            textShadow: '0 0 10px var(--accent-color)' 
          }}
        >
          {currentTitle}
        </h1>

        {/* Navigation */}
        <nav className="fixed top-16 md:top-20 left-4 md:left-6 z-40" role="navigation" aria-label="Main navigation">
          <ul className="flex flex-col gap-2 md:gap-3">
            <li>
              <button
                onClick={() => scrollToSection('main-content')}
                className="px-3 py-2 md:px-4 md:py-2 text-sm md:text-base bg-transparent border border-current rounded hover:bg-current hover:text-black transition-all duration-300 glow-text focus:outline-none focus:ring-2 focus:ring-current"
                style={{ 
                  color: 'var(--accent-color)', 
                  borderColor: 'var(--accent-color)' 
                }}
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => glitchNavigate('#about')}
                className="px-3 py-2 md:px-4 md:py-2 text-sm md:text-base bg-transparent border border-current rounded hover:bg-current hover:text-black transition-all duration-300 glow-text focus:outline-none focus:ring-2 focus:ring-current"
                style={{ 
                  color: 'var(--accent-color)', 
                  borderColor: 'var(--accent-color)' 
                }}
              >
                About
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('audio-section')}
                className="px-3 py-2 md:px-4 md:py-2 text-sm md:text-base bg-transparent border border-current rounded hover:bg-current hover:text-black transition-all duration-300 glow-text focus:outline-none focus:ring-2 focus:ring-current"
                style={{ 
                  color: 'var(--accent-color)', 
                  borderColor: 'var(--accent-color)' 
                }}
              >
                Audio
              </button>
            </li>
          </ul>
        </nav>

        {/* Social Links */}
        <nav className="fixed top-16 md:top-20 right-4 md:right-6 z-40" role="navigation" aria-label="Social media links">
          <ul className="flex flex-col gap-3 md:gap-4">
            <li>
              <a
                href="mailto:atharva152@gmail.com"
                className="text-lg md:text-xl flicker-text hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-current rounded"
                style={{ color: 'var(--accent-color)' }}
                aria-label="Send email to Atharva"
              >
                <i className="fas fa-envelope" aria-hidden="true"></i>
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/audiodevout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg md:text-xl flicker-text hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-current rounded"
                style={{ color: 'var(--accent-color)' }}
                aria-label="Visit Instagram profile"
              >
                <i className="fab fa-instagram" aria-hidden="true"></i>
              </a>
            </li>
            <li>
              <a
                href="https://youtube.com/@audiodevout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg md:text-xl flicker-text hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-current rounded"
                style={{ color: 'var(--accent-color)' }}
                aria-label="Visit YouTube channel"
              >
                <i className="fab fa-youtube" aria-hidden="true"></i>
              </a>
            </li>
            <li>
              <a
                href="https://asymmetrica.bandcamp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg md:text-xl flicker-text hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-current rounded"
                style={{ color: 'var(--accent-color)' }}
                aria-label="Visit Bandcamp profile"
              >
                <i className="fab fa-bandcamp" aria-hidden="true"></i>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/atharva--gupta/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg md:text-xl flicker-text hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-current rounded"
                style={{ color: 'var(--accent-color)' }}
                aria-label="Visit LinkedIn profile"
              >
                <i className="fab fa-linkedin" aria-hidden="true"></i>
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main id="main-content" className="relative z-10 pt-32 md:pt-40 px-4 md:px-8">
        {/* About Section */}
        <section id="about" className="max-w-2xl mx-auto mb-16 md:mb-24" aria-labelledby="about-heading">
          <div 
            className="audio-player rounded-lg p-6 md:p-8 backdrop-blur-sm"
            style={{ 
              borderColor: 'var(--accent-color)', 
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)' 
            }}
          >
            <h2 
              id="about-heading" 
              className="text-xl md:text-2xl font-bold mb-4 md:mb-6"
              style={{ color: 'var(--accent-color)' }}
            >
              Artist Statement
            </h2>
            <p className="text-sm md:text-base leading-relaxed mb-6 opacity-90">
              I make experimental systems that combine sound, light, code, and kinetic structures. 
              My work explores the edges between control and collapse—between what is designed and what breaks, flickers, loops, or hums out of place. 
              I'm interested in tinnitus, entropy, machine rhythms, and the emotional textures of noise and silence.
            </p>
            <p className="text-sm md:text-base leading-relaxed opacity-90">
              I often build my own instruments, use generative processes, and work with tools like TouchDesigner to create immersive and reactive experiences. 
              Each piece is a system with its own quirks, sometimes meditative, sometimes glitchy and unstable—always slightly off-centre.
            </p>
          </div>
        </section>

        {/* Bio Section */}
        <section className="max-w-2xl mx-auto mb-16 md:mb-24" aria-labelledby="bio-heading">
          <div 
            className="audio-player rounded-lg p-6 md:p-8 backdrop-blur-sm"
            style={{ 
              borderColor: 'var(--accent-color)', 
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)' 
            }}
          >
            <h2 
              id="bio-heading" 
              className="text-xl md:text-2xl font-bold mb-4 md:mb-6"
              style={{ color: 'var(--accent-color)' }}
            >
              About
            </h2>
            <p className="text-sm md:text-base leading-relaxed opacity-90">
              I'm Atharva Gupta (aka <em>asymmetrica</em>), an artist from Ajmer, India, currently based in the Netherlands. 
              I study MADTech at the Frank Mohr Institute in Groningen. 
              My work includes audiovisual installations, kinetic sound objects, and generative media, often investigating the politics and poetics of sensing through machines.
            </p>
          </div>
        </section>

        {/* Audio Section */}
        <section id="audio-section" className="max-w-2xl mx-auto mb-16 md:mb-24" aria-labelledby="audio-heading">
          <h2 
            id="audio-heading" 
            className="text-xl md:text-2xl font-bold mb-8 text-center"
            style={{ color: 'var(--accent-color)' }}
          >
            Audio Works
          </h2>
          
          <div className="space-y-6 md:space-y-8">
            <AudioPlayer
              title="Stranded Deep"
              src="/audio/stranded-deep.mp3"
              className="backdrop-blur-sm"
            />
            
            <AudioPlayer
              title="Not As I Remember It"
              src="/audio/not-as-i-remember-it.mp3"
              className="backdrop-blur-sm"
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 md:py-12 opacity-70">
          <p className="text-xs md:text-sm">
            © 2024 Atharva Gupta. Experimental Systems.
          </p>
        </footer>
      </main>
    </div>
  );
}
