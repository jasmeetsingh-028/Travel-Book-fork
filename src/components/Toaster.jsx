import React, { useEffect } from 'react';
import { Toaster as SonnerToaster } from 'sonner';

// Custom Toaster wrapper to prevent the "setState during render" warning
const Toaster = (props) => {
  const [mounted, setMounted] = React.useState(false);

  // Mount the toaster after initial render to avoid the setState during render issue
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <SonnerToaster {...props} />;
};

export default Toaster;