
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

    console.log('Attempting to extract image from URL:', cleanUrl);

    // For Amazon URLs - use direct ASIN extraction
    if (cleanUrl.includes('amazon.com') || cleanUrl.includes('amazon.')) {
      const asinMatch = cleanUrl.match(/\/dp\/([A-Z0-9]{10})|\/gp\/product\/([A-Z0-9]{10})|\/([A-Z0-9]{10})(?=\/|\?|$)/);
      if (asinMatch) {
        const asin = asinMatch[1] || asinMatch[2] || asinMatch[3];
        const imageUrl = `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.L.jpg`;
        console.log('Amazon ASIN found, using image:', imageUrl);
        return imageUrl;
      }
    }

    // For direct image URLs
    if (cleanUrl.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)) {
      console.log('Direct image URL detected:', cleanUrl);
      return cleanUrl;
    }

    // Enhanced e-commerce site support
    if (cleanUrl.includes('bestbuy.com')) {
      const skuMatch = cleanUrl.match(/skuId=(\d+)/);
      if (skuMatch) {
        const sku = skuMatch[1];
        const imageUrl = `https://pisces.bbystatic.com/image2/BestBuy_US/images/products/${sku}/${sku}_sd.jpg`;
        console.log('Best Buy product detected, using image:', imageUrl);
        return imageUrl;
      }
    }

    if (cleanUrl.includes('target.com')) {
      const productMatch = cleanUrl.match(/\/A-(\d+)/);
      if (productMatch) {
        const productId = productMatch[1];
        const imageUrl = `https://target.scene7.com/is/image/Target/GUEST_${productId}`;
        console.log('Target product detected, using image:', imageUrl);
        return imageUrl;
      }
    }

    if (cleanUrl.includes('walmart.com')) {
      const productMatch = cleanUrl.match(/\/ip\/[^\/]+\/(\d+)/);
      if (productMatch) {
        const productId = productMatch[1];
        const imageUrl = `https://i5.walmartimages.com/asr/${productId}_1.jpeg`;
        console.log('Walmart product detected, using image:', imageUrl);
        return imageUrl;
      }
    }

    if (cleanUrl.includes('nike.com')) {
      const productMatch = cleanUrl.match(/\/([A-Z0-9\-]+)(?=\/|\?|$)/);
      if (productMatch) {
        const imageUrl = `https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/${productMatch[1]}.png`;
        console.log('Nike product detected, using image:', imageUrl);
        return imageUrl;
      }
    }

    if (cleanUrl.includes('adidas.com')) {
      const productMatch = cleanUrl.match(/\/([A-Z0-9\-_]+)\.html/);
      if (productMatch) {
        const imageUrl = `https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/products/${productMatch[1]}.jpg`;
        console.log('Adidas product detected, using image:', imageUrl);
        return imageUrl;
      }
    }

    if (cleanUrl.includes('newbalance.com')) {
      const productMatch = cleanUrl.match(/\/([MWU]\w+)/);
      if (productMatch) {
        const imageUrl = `https://nb.scene7.com/is/image/NB/${productMatch[1]}_nb_02_i?$dw_detail_main_lg$`;
        console.log('New Balance product detected, using image:', imageUrl);
        return imageUrl;
      }
    }

    // Try to fetch the page and extract Open Graph or meta images
    try {
      console.log('Attempting to fetch page content for meta extraction...');
      
      // Use a CORS proxy service to fetch the page content
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(cleanUrl)}`;
      const response = await fetch(proxyUrl);
      
      if (response.ok) {
        const data = await response.json();
        const htmlContent = data.contents;
        
        // Try to extract Open Graph image
        const ogImageMatch = htmlContent.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
        if (ogImageMatch) {
          let imageUrl = ogImageMatch[1];
          // Handle relative URLs
          if (imageUrl.startsWith('//')) {
            imageUrl = 'https:' + imageUrl;
          } else if (imageUrl.startsWith('/')) {
            const urlObj = new URL(cleanUrl);
            imageUrl = urlObj.origin + imageUrl;
          }
          console.log('Open Graph image found:', imageUrl);
          return imageUrl;
        }
        
        // Try to extract Twitter card image
        const twitterImageMatch = htmlContent.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
        if (twitterImageMatch) {
          let imageUrl = twitterImageMatch[1];
          // Handle relative URLs
          if (imageUrl.startsWith('//')) {
            imageUrl = 'https:' + imageUrl;
          } else if (imageUrl.startsWith('/')) {
            const urlObj = new URL(cleanUrl);
            imageUrl = urlObj.origin + imageUrl;
          }
          console.log('Twitter card image found:', imageUrl);
          return imageUrl;
        }
        
        // Try to find the first product image in the page
        const productImageMatch = htmlContent.match(/<img[^>]*src=["']([^"']*product[^"']*)["']/i) ||
                                 htmlContent.match(/<img[^>]*src=["']([^"']*item[^"']*)["']/i) ||
                                 htmlContent.match(/<img[^>]*class=["'][^"']*product[^"']*["'][^>]*src=["']([^"']+)["']/i);
        
        if (productImageMatch) {
          let imageUrl = productImageMatch[1];
          // Handle relative URLs
          if (imageUrl.startsWith('//')) {
            imageUrl = 'https:' + imageUrl;
          } else if (imageUrl.startsWith('/')) {
            const urlObj = new URL(cleanUrl);
            imageUrl = urlObj.origin + imageUrl;
          }
          console.log('Product image found in HTML:', imageUrl);
          return imageUrl;
        }
      }
    } catch (fetchError) {
      console.log('Could not fetch page content:', fetchError);
    }

    // If no specific pattern matches, return empty string
    console.log('No image could be extracted from the URL');
    return '';
    
  } catch (error) {
    console.error('Error extracting image:', error);
    return '';
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
