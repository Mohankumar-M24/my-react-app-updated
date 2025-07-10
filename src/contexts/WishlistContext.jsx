import { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  //  Load from localStorage once at startup
  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch (e) {
        console.error(' Failed to parse wishlist from localStorage');
      }
    }
  }, []);

  //  Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      return exists
        ? prev.filter((item) => item._id !== product._id)
        : [...prev, product];
    });
  };

  const isInWishlist = (id) => wishlist.some(item => item._id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
