
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

    // For Amazon URLs
    if (cleanUrl.includes('amazon.com') || cleanUrl.includes('amazon.')) {
      const asinMatch = cleanUrl.match(/\/dp\/([A-Z0-9]{10})|\/gp\/product\/([A-Z0-9]{10})|\/([A-Z0-9]{10})(?=\/|\?|$)/);
      if (asinMatch) {
        const asin = asinMatch[1] || asinMatch[2] || asinMatch[3];
        return `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.L.jpg`;
      }
    }

    // For Nike URLs
    if (cleanUrl.includes('nike.com')) {
      try {
        const response = await fetch(cleanUrl);
        const html = await response.text();
        const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
        if (ogImageMatch) {
          return ogImageMatch[1];
        }
      } catch (error) {
        console.log('Nike image extraction failed, trying fallback');
      }
    }

    // For Adidas URLs
    if (cleanUrl.includes('adidas.com')) {
      try {
        const response = await fetch(cleanUrl);
        const html = await response.text();
        const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
        if (ogImageMatch) {
          return ogImageMatch[1];
        }
      } catch (error) {
        console.log('Adidas image extraction failed, trying fallback');
      }
    }

    // For New Balance URLs (since you mentioned it specifically)
    if (cleanUrl.includes('newbalance.com')) {
      try {
        const response = await fetch(cleanUrl);
        const html = await response.text();
        const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
        if (ogImageMatch) {
          return ogImageMatch[1];
        }
      } catch (error) {
        console.log('New Balance image extraction failed, trying fallback');
      }
    }

    // Generic approach for other e-commerce sites
    // Try to extract Open Graph image or other meta tags
    try {
      const response = await fetch(cleanUrl, {
        mode: 'cors',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      const html = await response.text();
      
      // Try Open Graph image first
      let imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
      if (imageMatch) {
        return imageMatch[1];
      }

      // Try Twitter card image
      imageMatch = html.match(/<meta name="twitter:image" content="([^"]+)"/);
      if (imageMatch) {
        return imageMatch[1];
      }

      // Try other common meta tags
      imageMatch = html.match(/<meta property="product:image" content="([^"]+)"/);
      if (imageMatch) {
        return imageMatch[1];
      }

    } catch (error) {
      console.log('Generic image extraction failed:', error);
    }
    
    return '';
  } catch (error) {
    console.error('Error extracting image:', error);
    return '';
  }
};

// Helper function to validate if an image URL is accessible
export const validateImageUrl = async (imageUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch {
    return false;
  }
};
