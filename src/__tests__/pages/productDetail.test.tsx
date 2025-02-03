import { render, screen, fireEvent } from '@testing-library/react';
import { CartContext, CartContextProps } from '@/context/CartContext';
import ProductDetail from '@/pages/product/[id]';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { handlers } from '@/mocks/handlers';

// Mock server setup
const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ProductDetail Component', () => {
  const mockProduct = {
    id: 1,
    title: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    images: ['/test-image.jpg'], // Updated to use a valid relative path
  };

  const mockCartContext: CartContextProps = {
    cart: [],
    cartCount: 0,
    addToCart: jest.fn(),
    updateCart: jest.fn(),
  };

  it('renders product details correctly', async () => {
    render(
      <CartContext.Provider value={mockCartContext}>
        <ProductDetail product={mockProduct} />
      </CartContext.Provider>
    );

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByAltText(mockProduct.title)).toBeInTheDocument();
  });

  it('handles adding a product to the cart', async () => {
    render(
      <CartContext.Provider value={mockCartContext}>
        <ProductDetail product={mockProduct} />
      </CartContext.Provider>
    );

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    expect(mockCartContext.addToCart).toHaveBeenCalledWith({
      id: mockProduct.id,
      title: mockProduct.title,
      price: mockProduct.price,
      images: mockProduct.images,
    });
  });

  it('renders fallback UI when product is not found', () => {
    render(<ProductDetail product={undefined} />);

    expect(screen.getByText(/product not found!/i)).toBeInTheDocument();
  });
});
