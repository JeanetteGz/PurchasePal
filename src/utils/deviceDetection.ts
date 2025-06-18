
export const isRunningInApp = (): boolean => {
  // Check for Capacitor (when running as mobile app)
  if (typeof window !== 'undefined' && (window as any).Capacitor) {
    return true;
  }

  // Check for mobile user agents that might indicate app context
  if (typeof navigator !== 'undefined') {
    const userAgent = navigator.userAgent || '';
    
    // Check for common mobile app webview indicators
    const appIndicators = [
      'wv', // WebView
      'Mobile/',
      'iPhone.*Mobile/',
      'Android.*Mobile',
    ];
    
    const isWebView = appIndicators.some(indicator => 
      new RegExp(indicator).test(userAgent)
    );
    
    // Check if it's a mobile device with specific app characteristics
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    // Additional checks for standalone mode (PWA)
    const isStandalone = (window as any).navigator?.standalone || 
                        window.matchMedia('(display-mode: standalone)').matches;
    
    return (isMobile && isWebView) || isStandalone;
  }
  
  return false;
};

export const isMobileDevice = (): boolean => {
  if (typeof navigator !== 'undefined') {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  return false;
};
