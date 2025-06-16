
export const getCategoryEmoji = (category: string) => {
  const emojiMap: { [key: string]: string } = {
    clothing: '👕',
    electronics: '📱',
    books: '📚',
    home: '🏠',
    beauty: '💄',
    sports: '⚽',
    food: '🍔',
    travel: '✈️',
    other: '🛍️'
  };
  return emojiMap[category.toLowerCase()] || '🛍️';
};

export const extractImageFromUrl = async (url: string): Promise<string> => {
  try {
    // For Amazon URLs, try to extract product image
    if (url.includes('amazon.com') || url.includes('amazon.')) {
      const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})|\/gp\/product\/([A-Z0-9]{10})/);
      if (asinMatch) {
        const asin = asinMatch[1] || asinMatch[2];
        return `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.L.jpg`;
      }
    }
    
    // For other e-commerce sites, return empty string for now
    return '';
  } catch (error) {
    console.error('Error extracting image:', error);
    return '';
  }
};
