const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Galaxy AI Hub API",
    version: "1.0.0",
    description: "API documentation for Galaxy AI Hub - AI-powered e-commerce platform",
    contact: {
      name: "Galaxy AI Hub Team",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "galaxy_auth_token",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string", format: "email" },
          name: { type: "string" },
          role: { type: "string", enum: ["USER", "ADMIN"] },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          image: { type: "string" },
          category: { type: "string" },
          stock: { type: "integer" },
          featured: { type: "boolean" },
        },
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "string" },
          orderNumber: { type: "string" },
          userId: { type: "string" },
          customerName: { type: "string" },
          customerEmail: { type: "string" },
          shippingAddress: { type: "string" },
          subtotal: { type: "number" },
          tax: { type: "number" },
          shipping: { type: "number" },
          total: { type: "number" },
          paymentStatus: { type: "string" },
          orderStatus: { type: "string" },
          paymentMethod: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderItem" },
          },
        },
      },
      OrderItem: {
        type: "object",
        properties: {
          id: { type: "string" },
          productId: { type: "string" },
          productName: { type: "string" },
          productImage: { type: "string" },
          quantity: { type: "integer" },
          unitPrice: { type: "number" },
          totalPrice: { type: "number" },
        },
      },
      CartItem: {
        type: "object",
        properties: {
          id: { type: "string" },
          productId: { type: "string" },
          quantity: { type: "integer" },
          product: { $ref: "#/components/schemas/Product" },
        },
      },
      Review: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          productId: { type: "string" },
          rating: { type: "integer" },
          comment: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      AIFeature: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          slug: { type: "string" },
          description: { type: "string" },
          icon: { type: "string" },
          endpoint: { type: "string" },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
          message: { type: "string" },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: "Unauthorized - Authentication required",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
            example: { error: "Unauthorized" },
          },
        },
      },
      NotFound: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
            example: { error: "Not found" },
          },
        },
      },
      ServerError: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
            example: { error: "Internal server error" },
          },
        },
      },
    },
  },
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "User created successfully" },
          "400": { description: "Validation error" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Login successful" },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": { description: "Current user data" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "List all products",
        parameters: [
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Products list" },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Create product",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Product" },
            },
          },
        },
        responses: {
          "201": { description: "Product created" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get product by ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Product details" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Products"],
        summary: "Update product",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Product updated" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete product",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "204": { description: "Product deleted" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/orders": {
      get: {
        tags: ["Orders"],
        summary: "List orders",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": { description: "Orders list" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
      post: {
        tags: ["Orders"],
        summary: "Create order",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["items", "customerName", "customerEmail", "shippingAddress"],
                properties: {
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["productId", "quantity"],
                      properties: {
                        productId: { type: "string" },
                        quantity: { type: "integer" },
                        selectedColor: { type: "string" },
                        selectedStorage: { type: "string" },
                      },
                    },
                  },
                  customerName: { type: "string" },
                  customerEmail: { type: "string", format: "email" },
                  shippingAddress: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Order created" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/payments": {
      get: {
        tags: ["Payments"],
        summary: "Get available payment providers",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": { description: "Payment providers list" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
      post: {
        tags: ["Payments"],
        summary: "Process payment",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderId"],
                properties: {
                  orderId: { type: "string" },
                  provider: { type: "string", enum: ["demo", "stripe", "razorpay"] },
                  paymentMethod: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Payment processed" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/payments/webhook": {
      post: {
        tags: ["Payments"],
        summary: "Stripe webhook",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "string" },
            },
          },
        },
        responses: {
          "200": { description: "Webhook received" },
        },
      },
    },
    "/api/cart": {
      get: {
        tags: ["Cart"],
        summary: "Get cart items",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": { description: "Cart items" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
      post: {
        tags: ["Cart"],
        summary: "Add to cart",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId", "quantity"],
                properties: {
                  productId: { type: "string" },
                  quantity: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Added to cart" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/wishlist": {
      get: {
        tags: ["Wishlist"],
        summary: "Get wishlist",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": { description: "Wishlist items" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
      post: {
        tags: ["Wishlist"],
        summary: "Add to wishlist",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId"],
                properties: {
                  productId: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Added to wishlist" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/reviews": {
      get: {
        tags: ["Reviews"],
        summary: "Get product reviews",
        parameters: [
          { name: "productId", in: "query", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Reviews list" },
        },
      },
      post: {
        tags: ["Reviews"],
        summary: "Create review",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId", "rating"],
                properties: {
                  productId: { type: "string" },
                  rating: { type: "integer", minimum: 1, maximum: 5 },
                  comment: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Review created" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/upload": {
      post: {
        tags: ["Upload"],
        summary: "Upload image",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Upload successful" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/ai/chat": {
      post: {
        tags: ["AI"],
        summary: "Chat with AI assistant",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["message"],
                properties: {
                  message: { type: "string" },
                  conversationId: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "AI response" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
  },
};

export { swaggerSpec };
