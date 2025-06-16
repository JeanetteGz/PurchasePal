
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
    // Clean up the URL
    const cleanUrl = url.trim();
    if (!cleanUrl) return '';

    // For Amazon URLs - use direct ASIN extraction
    if (cleanUrl.includes('amazon.com') || cleanUrl.includes('amazon.')) {
      const asinMatch = cleanUrl.match(/\/dp\/([A-Z0-9]{10})|\/gp\/product\/([A-Z0-9]{10})|\/([A-Z0-9]{10})(?=\/|\?|$)/);
      if (asinMatch) {
        const asin = asinMatch[1] || asinMatch[2] || asinMatch[3];
        return `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.L.jpg`;
      }
    }

    // For direct image URLs
    if (cleanUrl.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)) {
      return cleanUrl;
    }

    // For common e-commerce patterns - extract product ID and build image URL
    if (cleanUrl.includes('nike.com')) {
      const productMatch = cleanUrl.match(/\/([A-Z0-9\-]+)(?=\/|\?|$)/);
      if (productMatch) {
        return `https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/${productMatch[1]}.png`;
      }
    }

    if (cleanUrl.includes('adidas.com')) {
      const productMatch = cleanUrl.match(/\/([A-Z0-9\-_]+)\.html/);
      if (productMatch) {
        return `https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/products/${productMatch[1]}.jpg`;
      }
    }

    // For New Balance - try to extract product code
    if (cleanUrl.includes('newbalance.com')) {
      const productMatch = cleanUrl.match(/\/([MWU]\w+)/);
      if (productMatch) {
        return `https://nb.scene7.com/is/image/NB/${productMatch[1]}_nb_02_i?$dw_detail_main_lg$`;
      }
    }

    // Fallback: Try to use a proxy service for meta tag extraction
    // This is a safer approach that doesn't trigger CORS errors
    try {
      // Use a public API that can extract Open Graph data
      const proxyUrl = `https://api.microlink.io/?url=${encodeURIComponent(cleanUrl)}&screenshot=false&meta=false`;
      
      const response = await fetch(proxyUrl);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.data?.image?.url) {
          return data.data.image.url;
        }
      }
    } catch (proxyError) {
      console.log('Proxy extraction failed, using fallback');
    }

    // If all else fails, return empty string
    return '';
    
  } catch (error) {
    console.error('Error extracting image:', error);
    return '';
  }
};

// Helper function to validate if an image URL is accessible
export const validateImageUrl = async (imageUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(imageUrl, { 
      method: 'HEAD',
      mode: 'no-cors' // This prevents CORS errors for validation
    });
    return true; // If no error is thrown, assume it's accessible
  } catch {
    return false;
  }
};

// Helper function to generate placeholder image based on category
export const getCategoryPlaceholder = (category: string): string => {
  const placeholders: { [key: string]: string } = {
    clothing: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
    electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop',
    books: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
    home: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    sports: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    food: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    travel: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop',
    other: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop'
  };
  return placeholders[category.toLowerCase()] || placeholders.other;
};
