// getDevice.util.js
export const getOperatingSystem = () => {
  // 1. Try modern User-Agent Client Hints first
  if (navigator.userAgentData && navigator.userAgentData.platform) {
    return navigator.userAgentData.platform;
  }

  // 2. Fallback to classic UserAgent parsing
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('win')) return 'Windows';
  if (userAgent.includes('android')) return 'Android';
  if (userAgent.includes('linux')) return 'Linux';
  if (userAgent.includes('mac') || userAgent.includes('iphone') || userAgent.includes('ipad')) {
    return 'Mac / iOS';
  }
  
  return 'Unknown OS';
};
