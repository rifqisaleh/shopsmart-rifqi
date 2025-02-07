import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Checkout from '@/pages/checkout';
import { CartContext } from '@/context/CartContext';
import { useRouter } from 'next/router';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

// Mock cart items
const mockCart = [
  { id: 1, title: 'Test Product 1', price: 10.99, quantity: 2, image: 'test1.jpg' },
  { id: 2, title: 'Test Product 2', price: 20.50, quantity: 1, image: 'test2.jpg' }
];

describe('Checkout Page', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  const renderCheckout = (cart = mockCart) => {
    return render(
      <CartContext.Provider value={{ cart, updateCart: jest.fn(), cartCount: cart.length, addToCart: jest.fn() }}>
        <Checkout />
      </CartContext.Provider>
    );
  };

  it('renders checkout page with cart summary', () => {
    renderCheckout();
    
    expect(screen.getByText('Checkout')).toBeInTheDocument();
    // Use getByText with a function to match partial content
    expect(screen.getByText((content) => content.includes('Test Product 1'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Test Product 2'))).toBeInTheDocument();
  });

  it('displays correct total price', () => {
    renderCheckout();
    // Calculate expected total: (10.99 * 2) + (20.50 * 1) = 42.48
    expect(screen.getByText('Total: $42.48')).toBeInTheDocument();
  });

  it('displays empty cart message when cart is empty', () => {
    renderCheckout([]);
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  it('handles form input changes', () => {
    renderCheckout();
    
    const nameInput = screen.getByPlaceholderText('Enter your full name');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const addressInput = screen.getByPlaceholderText('Enter your full address');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(addressInput, { target: { value: '123 Test St' } });

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(addressInput).toHaveValue('123 Test St');
  });

  it('shows ATM Transaction as disabled payment method', () => {
    renderCheckout();
    
    const paymentMethod = screen.getByDisplayValue('ATM Transaction');
    expect(paymentMethod).toBeDisabled();
  });

  it('validates required fields before payment', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    renderCheckout();
    
    const paymentButton = screen.getByText('Proceed to Payment');
    fireEvent.click(paymentButton);

    expect(alertMock).toHaveBeenCalledWith('Please fill in all required fields.');
    alertMock.mockRestore();
  });

  it('processes payment with valid form data', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    renderCheckout();
    
    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your full address'), {
      target: { value: '123 Test St' }
    });

    // Submit the form
    fireEvent.click(screen.getByText('Proceed to Payment'));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Proceeding to Payment... (Mock Function)');
      expect(mockRouter.push).toHaveBeenCalledWith('/order-confirmation');
    });

    alertMock.mockRestore();
    consoleMock.mockRestore();
  });

  it('navigates to order confirmation after successful payment', async () => {
    renderCheckout();
    
    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your full address'), {
      target: { value: '123 Test St' }
    });

    // Submit the form
    fireEvent.click(screen.getByText('Proceed to Payment'));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/order-confirmation');
    });
  });
});
