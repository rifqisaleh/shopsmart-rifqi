// filepath: /c:/Users/mrifq/Desktop/shopsmartpp_mrs/src/__tests__/pages/dashboard.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '@/pages/dashboard';
import { AuthProvider } from '@/context/AuthContext';
import { server } from '@/mocks/setupTests';
import { rest } from 'msw';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  prefetch: jest.fn().mockResolvedValue(undefined),
};

(useRouter as jest.Mock).mockReturnValue(mockRouter);

const mockProfile = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://example.com/avatar.jpg',
  role: 'user',
};

test('loads and displays profile', async () => {
  render(
    <AuthProvider>
      <Dashboard profile={mockProfile} />
    </AuthProvider>
  );

  const elements = await screen.findAllByText((content, element) => {
    return element?.textContent?.includes('John Doe') ?? false;
  });

  expect(elements.length).toBeGreaterThan(0);
});

test('redirects to login when profile is null', async () => {
  render(
    <AuthProvider>
      <Dashboard profile={null} />
    </AuthProvider>
  );

  expect(screen.getByText('Loading or redirecting...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});