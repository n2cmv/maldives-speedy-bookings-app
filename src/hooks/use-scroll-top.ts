
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Multiple methods to ensure scroll to top works across different browsers
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
    
    // Fallback methods for different browser behaviors
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [location.pathname]);
};

// Separate function that doesn't require Router context
// Can be used anywhere, including App.tsx before BrowserRouter is initialized
export const scrollToTopWithoutRouter = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'auto'
  });
  
  window.scrollTo(0, 0);
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};
