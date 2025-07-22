import { useEffect, useState } from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import AudioPlayer from "@/components/AudioPlayer";

export default function Home() {
  const { data: portfolioData } = usePortfolioData();
  const [currentSection, setCurrentSection] = useState('home');

  useEffect(() => {
    // Handle navigation changes
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setCurrentSection(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return (
          <section className="page-section active" id="home">
            <div className="container">
              <div className="hero-section">
                <h1 className="hero-title glitch-text" data-text="Welcome">
                  Welcome
                </h1>
                <p className="hero-subtitle">
                  Digital artist exploring the intersection of sound, image, and technology. 
                  Experience my work through audio compositions, visual art, and experimental media.
                </p>
              </div>
              
              <div className="featured-grid">
                <div className="featured-item">
                  <h3><i className="fas fa-music"></i> Latest Audio Works</h3>
                  <p>Immersive soundscapes and experimental compositions that blur the boundaries between digital and organic.</p>
                </div>
                <div className="featured-item">
                  <h3><i className="fas fa-palette"></i> Visual Experiments</h3>
                  <p>Generative art pieces and multimedia installations exploring themes of identity and technology.</p>
                </div>
                <div className="featured-item">
                  <h3><i className="fas fa-code"></i> Interactive Projects</h3>
                  <p>Code-based artworks and digital experiences that invite audience participation and exploration.</p>
                </div>
              </div>
            </div>
          </section>
        );

      case 'audio':
        return (
          <section className="page-section active" id="audio">
            <div className="container">
              <div className="section-header text-center mb-16">
                <h2 className="section-title neon-glow glitch-title neon-title text-4xl font-bold mb-4" data-text="Audio">Audio</h2>
                <p className="section-description text-lg text-muted-foreground">
                  Stream my latest audio compositions and experimental sound works.
                </p>
              </div>
              <div className="audio-players space-y-6">
                {portfolioData?.audio?.map((track: any, index: number) => (
                  <AudioPlayer key={index} track={track} />
                )) || (
                  <div className="text-center text-muted-foreground">
                    No audio tracks available. Add tracks to portfolio_data.js
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'images':
        return (
          <section className="page-section active" id="images">
            <div className="container">
              <div className="section-header text-center mb-16">
                <h2 className="section-title neon-glow glitch-title neon-title text-4xl font-bold mb-4" data-text="Images">Images</h2>
                <p className="section-description text-lg text-muted-foreground">
                  Visual explorations in digital and mixed media.
                </p>
              </div>
              <div className="image-gallery asymmetric-layout">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolioData?.images?.map((image: any, index: number) => (
                    <div key={index} className="gallery-item aspect-square bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-all duration-300 group jitter-hover">
                      <img 
                        src={image.file} 
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23111"/><text x="150" y="150" text-anchor="middle" fill="%2300ffff" font-family="monospace">Image Not Found</text></svg>';
                        }}
                      />
                      <div className="gallery-overlay absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                        <h4 className="font-bold text-accent">{image.title}</h4>
                        <p className="text-sm">{image.description}</p>
                      </div>
                    </div>
                  )) || (
                    <div className="col-span-full text-center text-muted-foreground">
                      No images available. Add images to portfolio_data.js and upload files to public/assets/images/
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        );

      case 'videos':
        return (
          <section className="page-section active" id="videos">
            <div className="container">
              <div className="section-header text-center mb-16">
                <h2 className="section-title neon-glow glitch-title neon-title text-4xl font-bold mb-4" data-text="Videos">Videos</h2>
                <p className="section-description text-lg text-muted-foreground">
                  Video works and documentation of performances.
                </p>
              </div>
              <div className="video-gallery featured-grid asymmetric-layout">
                {portfolioData?.videos?.map((video: any, index: number) => (
                  <div key={index} className="featured-item">
                    <h3>{video.title}</h3>
                    <p>{video.description}</p>
                    {video.embedUrl ? (
                      <div className="aspect-video mt-4 bg-muted rounded-lg overflow-hidden">
                        <iframe
                          src={video.embedUrl}
                          title={video.title}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="aspect-video mt-4 bg-muted rounded-lg flex items-center justify-center">
                        <i className="fas fa-play text-accent text-4xl"></i>
                      </div>
                    )}
                  </div>
                )) || (
                  <div className="text-center text-muted-foreground">
                    No videos available. Add videos to portfolio_data.js
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'texts':
        return (
          <section className="page-section active" id="texts">
            <div className="container">
              <div className="section-header text-center mb-16">
                <h2 className="section-title neon-glow text-4xl font-bold mb-4">Texts</h2>
                <p className="section-description text-lg text-muted-foreground">
                  Written works, artist statements, and critical texts.
                </p>
              </div>
              <div className="text-content featured-grid">
                {portfolioData?.texts?.map((text: any, index: number) => (
                  <div key={index} className="featured-item">
                    <h3>{text.title}</h3>
                    <p>{text.excerpt}</p>
                    <p className="text-sm text-muted-foreground mt-4">
                      Published: {text.date}
                    </p>
                  </div>
                )) || (
                  <div className="text-center text-muted-foreground">
                    No texts available. Add texts to portfolio_data.js
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'downloads':
        return (
          <section className="page-section active" id="downloads">
            <div className="container">
              <div className="section-header text-center mb-16">
                <h2 className="section-title neon-glow text-4xl font-bold mb-4">Downloads</h2>
                <p className="section-description text-lg text-muted-foreground">
                  Available resources and documentation.
                </p>
              </div>
              <div className="download-list featured-grid">
                {portfolioData?.downloads?.map((download: any, index: number) => (
                  <div key={index} className="featured-item">
                    <h3><i className="fas fa-file-pdf"></i> {download.title}</h3>
                    <p>{download.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Format: {download.format} | Size: {download.size}
                    </p>
                    <a 
                      href={download.file} 
                      download
                      className="inline-block mt-4 px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors rounded"
                    >
                      Download
                    </a>
                  </div>
                )) || (
                  <div className="text-center text-muted-foreground">
                    No downloads available. Add downloads to portfolio_data.js
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section className="page-section active" id="about">
            <div className="container">
              <div className="section-header text-center mb-16">
                <h2 className="section-title neon-glow text-4xl font-bold mb-4">About</h2>
              </div>
              <div className="about-content grid md:grid-cols-2 gap-16 max-w-4xl mx-auto">
                <div>
                  <h3 className="text-accent text-xl font-bold mb-4">Biography</h3>
                  <div className="space-y-4 text-foreground leading-relaxed">
                    {portfolioData?.about?.biography?.map((paragraph: string, index: number) => (
                      <p key={index}>{paragraph}</p>
                    )) || (
                      <p>Biography not available. Add content to portfolio_data.js</p>
                    )}
                  </div>
                  
                  <h3 className="text-accent text-xl font-bold mb-4 mt-8">Education</h3>
                  <p>{portfolioData?.about?.education || 'Education information not available.'}</p>
                </div>
                
                <div>
                  <h3 className="text-accent text-xl font-bold mb-4">Exhibitions</h3>
                  <ul className="space-y-2 mb-8">
                    {portfolioData?.about?.exhibitions?.map((exhibition: string, index: number) => (
                      <li key={index}>{exhibition}</li>
                    )) || (
                      <li>Exhibition information not available.</li>
                    )}
                  </ul>

                  <h3 className="text-accent text-xl font-bold mb-4">Artist Statement</h3>
                  <p className="leading-relaxed">
                    {portfolioData?.about?.statement || 'Artist statement not available.'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section className="page-section active" id="contact">
            <div className="container">
              <div className="section-header text-center mb-16">
                <h2 className="section-title neon-glow text-4xl font-bold mb-4">Contact</h2>
                <p className="section-description text-lg text-muted-foreground">
                  Get in touch for collaborations and inquiries.
                </p>
              </div>
              <div className="contact-content grid md:grid-cols-2 gap-16">
                <div>
                  <h3 className="text-accent text-xl font-bold mb-4">Connect</h3>
                  <p className="mb-8">
                    Interested in collaboration, exhibitions, or commissions? 
                    I'd love to hear from you.
                  </p>
                  <div className="contact-links space-y-4">
                    {portfolioData?.contact?.links?.map((link: any, index: number) => (
                      <a 
                        key={index}
                        href={link.url} 
                        className="flex items-center gap-3 text-accent hover:text-accent/80 transition-colors"
                      >
                        <i className={link.icon}></i> {link.label}
                      </a>
                    )) || (
                      <div className="text-muted-foreground">
                        Contact links not available. Add to portfolio_data.js
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <form 
                    className="contact-form space-y-6" 
                    action={portfolioData?.contact?.formspreeUrl || "https://formspree.io/f/YOUR_FORM_ID"} 
                    method="POST"
                  >
                    <div className="form-group">
                      <label htmlFor="name" className="block text-accent font-bold text-sm uppercase tracking-wide mb-2">
                        Name
                      </label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required
                        className="w-full bg-card border border-border text-foreground p-3 rounded focus:border-accent focus:outline-none transition-colors"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email" className="block text-accent font-bold text-sm uppercase tracking-wide mb-2">
                        Email
                      </label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required
                        className="w-full bg-card border border-border text-foreground p-3 rounded focus:border-accent focus:outline-none transition-colors"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="message" className="block text-accent font-bold text-sm uppercase tracking-wide mb-2">
                        Message
                      </label>
                      <textarea 
                        id="message" 
                        name="message" 
                        rows={6} 
                        required
                        className="w-full bg-card border border-border text-foreground p-3 rounded focus:border-accent focus:outline-none transition-colors resize-none"
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      className="submit-button w-full bg-transparent border border-accent text-accent py-3 px-6 rounded font-bold uppercase tracking-wide hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <i className="fas fa-paper-plane mr-2"></i> Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        );

      case 'thesis':
        return (
          <section className="page-section active" id="thesis">
            <div className="container">
              <div className="section-header text-center mb-16">
                <h2 className="section-title neon-glow text-4xl font-bold mb-4">Thesis</h2>
                <p className="section-description text-lg text-muted-foreground">
                  {portfolioData?.thesis?.title || 'Academic research and documentation.'}
                </p>
              </div>
              
              <div className="thesis-content">
                <div className="featured-item max-w-4xl mx-auto">
                  <h3>Abstract</h3>
                  <p className="my-6 leading-relaxed">
                    {portfolioData?.thesis?.abstract || 'Thesis abstract not available. Add content to portfolio_data.js'}
                  </p>
                  
                  <div className="mt-8 pt-8 border-t border-border">
                    <p className="text-sm text-muted-foreground space-y-1">
                      <span className="block"><strong>Institution:</strong> {portfolioData?.thesis?.institution || 'Not specified'}</span>
                      <span className="block"><strong>Year:</strong> {portfolioData?.thesis?.year || 'Not specified'}</span>
                      <span className="block"><strong>Advisor:</strong> {portfolioData?.thesis?.advisor || 'Not specified'}</span>
                    </p>
                  </div>

                  {portfolioData?.thesis?.pdfUrl && (
                    <div className="text-center mt-8">
                      <a 
                        href={portfolioData.thesis.pdfUrl}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block py-3 px-6 bg-transparent border border-accent text-accent rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <i className="fas fa-file-pdf mr-2"></i> View PDF
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <main className="main-content">
      {renderSection()}
    </main>
  );
}
