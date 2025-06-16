
export const cleanupFirebaseKeys = () => {
  Object.keys(localStorage).forEach(key => {
    if (key.includes('firebase') || key.includes('Firebase')) {
      console.log('Removing Firebase key:', key);
      localStorage.removeItem(key);
    }
  });
};

export const isAccountDeleted = () => {
  return localStorage.getItem('accountDeleted') === 'true';
};

export const setAccountDeleted = (deleted: boolean) => {
  if (deleted) {
    localStorage.setItem('accountDeleted', 'true');
  } else {
    localStorage.removeItem('accountDeleted');
  }
};

export const setUserSignedOut = (signedOut: boolean) => {
  if (signedOut) {
    localStorage.setItem('userSignedOut', 'true');
  } else {
    localStorage.removeItem('userSignedOut');
  }
};
