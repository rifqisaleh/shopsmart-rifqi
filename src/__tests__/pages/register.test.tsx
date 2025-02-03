import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '@/pages/register';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
    useRouter: jest.fn()
}));

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([{ role: 'Customer' }, { role: 'Admin' }])
    })
) as jest.Mock;

describe('Register Page', () => {
    beforeEach(() => {
        const mockRouter = {
            push: jest.fn(),
            pathname: '/register'
        };
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it('renders register form with all fields', async () => {
        render(<Register />);
        expect(screen.getByText('Create your account')).toBeInTheDocument();
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByRole('combobox', { name: /role/i })).toBeInTheDocument();
        });
    });

    it('validates required fields', async () => {
        render(<Register />);

        await waitFor(() => {
            expect(screen.queryByText(/loading roles/i)).not.toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    });

    it('validates password length and match', async () => {
        render(<Register />);

        await waitFor(() => {
            expect(screen.queryByText(/loading roles/i)).not.toBeInTheDocument();
        });

        const passwordInput = screen.getByLabelText('Password');
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

        fireEvent.change(passwordInput, { target: { value: '123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: '123' } });
        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();

        fireEvent.change(confirmPasswordInput, { target: { value: 'password124' } });
        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    });

    it('disables submit button while roles are loading', async () => {
        render(<Register />);
    
        // Check that the button is disabled and has the loading text
        expect(screen.getByRole('button', { name: /loading roles.../i })).toBeDisabled();
    
        // Wait for roles to load
        await waitFor(() => {
            expect(screen.queryByText(/loading roles/i)).not.toBeInTheDocument();
        });
    
        // Ensure button is now enabled
        const submitButton = screen.getByRole('button', { name: /register/i });
        expect(submitButton).not.toBeDisabled();
    });

    it('handles successful form submission', async () => {
        render(<Register />);
    
        await waitFor(() => {
            expect(screen.queryByText(/loading roles/i)).not.toBeInTheDocument();
        });
    
        // Fill in all required fields
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/role/i), { target: { value: 'Customer' } });
        fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '2000-01-01' } });
    
        fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
        // Assert success message
        expect(await screen.findByText(/registration successful/i)).toBeInTheDocument();
    });
});
