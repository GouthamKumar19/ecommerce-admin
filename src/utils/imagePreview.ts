/**
 * Constructs full S3 image URL from file path or returns fallback image
 * @param {string | undefined} filePath - The path of the image file
 * @returns {string} - Complete S3 URL or fallback image URL
 */
export const getImage = (filePath?: string): string => {
  // Get S3 base URL from environment variables
  const s3BaseUrl = import.meta.env.VITE_S3_URL || 'https://your-default-s3-bucket.s3.amazonaws.com/';
  
  // Fallback/dummy image URL
  const fallbackImage = '/assets/images/placeholder.jpg';
  
  // If no file path provided or it's empty, return fallback image
  if (!filePath || filePath.trim() === '') {
    return fallbackImage;
  }
  
  // Check if the filePath already contains the full URL
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  
  // Ensure file path starts with a forward slash if not already
  const formattedPath = filePath.startsWith('/') ? filePath : `${filePath}`;
  
  // Construct and return the full S3 URL
  return `${s3BaseUrl}${formattedPath}`;
};