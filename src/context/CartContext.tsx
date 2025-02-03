import React, { createContext, useState, ReactNode, useMemo } from "react";

// Define the Product interface
interface Product {
  id: number;
  title: string;
  price: number;
  images: string[] | string | null; // Product can have multiple or single images, or no images
}

// Define the CartItem interface
interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image?: string; // Normalized single image
}

// Define the CartContextProps interface
export interface CartContextProps {
  cart: CartItem[];
  cartCount: number; // Total items in the cart
  addToCart: (product: Product) => void;
  updateCart: (productId: number, quantity: number) => void;
}

// Create the CartContext
export const CartContext = createContext<CartContextProps | undefined>(undefined);

// Define the CartProvider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Function to add a product to the cart
  const addToCart = (product: Product) => {
    const firstImage =
      Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : typeof product.images === "string"
        ? product.images
        : undefined; // Normalize the image to a single string or undefined

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // Increment quantity if the product already exists
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Add a new CartItem
      return [
        ...prevCart,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: 1,
          image: firstImage, // Add the normalized image
        },
      ];
    });
  };

  // Function to update the cart (change quantity or remove items)
  const updateCart = (productId: number, quantity: number) => {
    setCart((prevCart) =>
      quantity > 0
        ? prevCart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          )
        : prevCart.filter((item) => item.id !== productId)
    );
  };

  // Calculate the total number of items in the cart
  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  // Return the context provider
  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, updateCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
