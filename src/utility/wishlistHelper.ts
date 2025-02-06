export interface WishlistItem {
  id: number;
  title: string;
  price: number;
  image: string;
}

export const getWishlist = (): WishlistItem[] => {
  if (typeof window === 'undefined') return [];
  const wishlist = localStorage.getItem('wishlist');
  return wishlist ? JSON.parse(wishlist) : [];
};

export const addToWishlist = (item: WishlistItem) => {
  const wishlist = getWishlist();
  if (!wishlist.some(i => i.id === item.id)) {
    wishlist.push(item);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }
};

export const removeFromWishlist = (id: number) => {
  const wishlist = getWishlist();
  const newWishlist = wishlist.filter(item => item.id !== id);
  localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  return newWishlist;
};
