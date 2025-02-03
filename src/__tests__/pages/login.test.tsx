import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import Login from '@/pages/login'; // Path to your Login component
import { AuthProvider } from '@/context/AuthContext';
import { server } from '@/mocks/setupTests';
import { rest } from 'msw';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Login Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form with email and password fields', () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('displays error message on invalid credentials', async () => {
    // Mock the login API to return an error
    server.use(
      rest.post(`${process.env.NEXT_PUBLIC_API_URL}auth/login`, (req, res, ctx) => {
        return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }));
      })
    );

    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials');
  });

  test('redirects to dashboard on successful login', async () => {
    // Mock the login API to return a success response
    server.use(
      rest.post(`${process.env.NEXT_PUBLIC_API_URL}auth/login`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({ access_token: 'fakeAccessToken', refresh_token: 'fakeRefreshToken' })
        );
      })
    );

    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('disables button and shows loading state during submission', async () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
  });
});
