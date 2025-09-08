// Utility function to ensure image paths are correctly formatted
export function getImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it starts with /uploads/, it's already correctly formatted
  if (imagePath.startsWith('/uploads/')) {
    return imagePath;
  }
  
  // If it doesn't start with /, add it
  if (!imagePath.startsWith('/')) {
    return `/${imagePath}`;
  }
  
  return imagePath;
}

// Debug function to log image paths
export function debugImagePath(imagePath: string | null | undefined, context: string = '') {
  console.log(`[Image Debug ${context}]`, {
    originalPath: imagePath,
    processedPath: getImageUrl(imagePath),
    isNull: imagePath === null,
    isUndefined: imagePath === undefined,
  });
}
