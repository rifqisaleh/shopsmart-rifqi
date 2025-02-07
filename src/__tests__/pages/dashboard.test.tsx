import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "@/pages/dashboard";
import { AuthProvider } from "@/context/AuthContext";
import { useRouter } from "next/router";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn(); // Ensure replace is mocked
const mockRouter = {
  push: mockPush,
  replace: mockReplace, // Fix: Add replace function
  prefetch: jest.fn().mockResolvedValue(undefined),
};

(useRouter as jest.Mock).mockReturnValue(mockRouter);

beforeEach(() => {
  jest.clearAllMocks(); // Ensure previous mocks don't interfere with the next test
});

const mockProfile = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://example.com/avatar.jpg",
  role: "user",
};

test("loads and displays profile", async () => {
  render(
    <AuthProvider>
      <Dashboard profile={mockProfile} />
    </AuthProvider>
  );

  const elements = await screen.findAllByText((content, element) =>
    element?.textContent?.includes("John Doe") ?? false
  );

  expect(elements.length).toBeGreaterThan(0);
});

test("redirects to login when profile is null", async () => {
  render(
    <AuthProvider>
      <Dashboard profile={null} />
    </AuthProvider>
  );

  expect(screen.getByText("Loading or redirecting...")).toBeInTheDocument();

  await waitFor(() => {
    expect(mockReplace).toHaveBeenCalledWith("/login"); // Fix: Changed to `replace`
  });
});
