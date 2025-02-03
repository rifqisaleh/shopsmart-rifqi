import React from 'react';
import { render } from '@testing-library/react';
import ShippingPolicy from '../../pages/shipping-policy/index';

describe('ShippingPolicy', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<ShippingPolicy />);
    expect(getByText('Terms & Conditions')).toBeInTheDocument();
    expect(getByText('1. Return Policy')).toBeInTheDocument();
    expect(getByText('2. Shipping Policy')).toBeInTheDocument();
    expect(getByText('3. Payment Policy')).toBeInTheDocument();
    expect(getByText('4. Privacy Policy')).toBeInTheDocument();
  });

  it('displays the correct shipping rate', () => {
    const { getByText } = render(<ShippingPolicy />);
    expect(getByText('Rp50,000')).toBeInTheDocument();
    expect(getByText('Rp1,000,000')).toBeInTheDocument();
  });

  it("displays the correct payment methods", () => {
    const { getByText } = render(<ShippingPolicy />);
  
    // Use a custom function matcher to find "Bank transfers" even if split across multiple lines
    expect(getByText((content, element) => content.includes("Bank transfers"))).toBeInTheDocument();
    expect(getByText((content, element) => content.includes("Credit cards"))).toBeInTheDocument();
    expect(getByText((content, element) => content.includes("Digital wallets"))).toBeInTheDocument();
  });
});
