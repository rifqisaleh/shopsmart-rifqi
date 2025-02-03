import { rest } from "msw";

export const handlers = [
  // API for Dashboard
  rest.get(`${process.env.NEXT_PUBLIC_API_URL}auth/profile`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "https://example.com/avatar.jpg",
        role: "user",
      })
    );
  }),

  // Get product detail
  rest.get(`${process.env.NEXT_PUBLIC_API_URL}products/:id`, (req, res, ctx) => {
    const { id } = req.params;

    if (id === "1") {
      return res(
        ctx.status(200),
        ctx.json({
          status: "success",
          message: "Product retrieved successfully",
          data: {
            id: 1,
            name: "Test Product",
            description: "Test Description",
            price: 99.99,
            category: "Test Category",
            image: "test-image.jpg",
          },
        })
      );
    }

    return res(
      ctx.status(404),
      ctx.json({
        status: "error",
        message: "Product not found!",
      })
    );
  }),

  // Add to cart
  rest.post(`${process.env.NEXT_PUBLIC_API_URL}cart/add`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: "success",
        message: "Product added to cart successfully!",
      })
    );
  }),

  // Fetch roles dynamically
  rest.get(`${process.env.NEXT_PUBLIC_API_URL}users`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { role: "Customer" },
        { role: "Admin" },
      ])
    );
  }),

  // Fetch users
  rest.get('http://localhost:3000/api/users', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, role: 'Customer' },
        { id: 2, role: 'Admin' }
      ])
    );
  }),

  // Mock POST /api/users request
  rest.post('http://localhost:3000/api/users', async (req, res, ctx) => {
    const { name, email, password, role, dob } = await req.json();

    if (!name || !email || !password || !role || !dob) {
      return res(ctx.status(400), ctx.json({ message: 'Missing fields' }));
    }

    return res(ctx.status(200), ctx.json({ message: 'Registration successful!' }));
  }),
];

