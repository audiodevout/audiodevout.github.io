import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import CustomCursor from "@/components/CustomCursor";
import ParticleSystem from "@/components/ParticleSystem";
import FloatingText from "@/components/FloatingText";
import Navigation from "@/components/Navigation";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={Home} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Set current year for footer
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear().toString();
    }

    // Set last updated date
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
      lastUpdatedElement.textContent = new Date().toLocaleDateString();
    }

    // Disable right-click on images for protection
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.tagName === 'AUDIO' || target.tagName === 'VIDEO') {
        e.preventDefault();
      }
    };

    // Disable text selection on media elements
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.tagName === 'AUDIO' || target.tagName === 'VIDEO') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <CustomCursor />
          <ParticleSystem />
          <FloatingText />
          <Navigation />
          <Toaster />
          <Router />
          
          {/* Footer */}
          <footer className="bg-card border-t border-border py-8 text-center">
            <div className="container">
              <p className="text-muted-foreground text-sm">
                © <span id="currentYear">2024</span> Atharva Gupta. All rights reserved.
              </p>
              <p className="text-muted-foreground text-xs mt-2">
                Last updated: <span id="lastUpdated">January 2024</span>
              </p>
            </div>
          </footer>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
