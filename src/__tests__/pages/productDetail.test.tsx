import { render, screen, fireEvent } from '@testing-library/react';
import { CartContext, CartContextProps } from '@/context/CartContext';
import { AuthContext } from '@/context/AuthContext';  // Add this import
import ProductDetail from '@/pages/product/[id]';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { handlers as mockHandlers } from '@/mocks/handlers';
import { useRouter } from 'next/router';

// Mock Next.js useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Add base URL for tests
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/';

// Add mock handler for related products
const handlers = [
  // ...existing handlers...
  rest.get('*/products', (req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          {
            id: 2,
            title: 'Related Product',
            price: 49.99,
            images: ['/related-image.jpg'],
            category: { id: '1', name: 'Test Category' }
          }
        ]
      })
    );
  }),
];

// Mock server setup
const server = setupServer(...mockHandlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ProductDetail Component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { id: '1' }, // Mock route parameters
      push: jest.fn(),     // Mock push function
      replace: jest.fn(),
      pathname: '/product/1',
      asPath: '/product/1',
    });
  });

  const mockProduct = {
    id: 1,
    title: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    images: ['/test-image.jpg'],
    category: {
      id: '1',
      name: 'Test Category',
    },
  };

  const mockCartContext: CartContextProps = {
    cart: [],
    cartCount: 0,
    addToCart: jest.fn(),
    updateCart: jest.fn(),
  };

  const mockAuthContext = {  // Add mock auth context
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
    isAuthenticated: false,
    isLoading: false,
    fetchWithAuth: jest.fn().mockImplementation((url) => 
      fetch(url).then(res => res.json())
    ),
  };

  it('renders product details correctly', async () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <CartContext.Provider value={mockCartContext}>
          <ProductDetail product={mockProduct} />
        </CartContext.Provider>
      </AuthContext.Provider>
    );

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByAltText(mockProduct.title)).toBeInTheDocument();
  });

  it('handles adding a product to the cart', async () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <CartContext.Provider value={mockCartContext}>
          <ProductDetail product={mockProduct} />
        </CartContext.Provider>
      </AuthContext.Provider>
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
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <ProductDetail product={undefined} />
      </AuthContext.Provider>
    );

    expect(screen.getByText(/product not found!/i)).toBeInTheDocument();
  });
});
