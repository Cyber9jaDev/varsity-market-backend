## Authentication

```bash
  $POST /auth/register 
  - Register a new user

  $POST /auth/login
  - User login

  $POST /auth/forgot-password
  - Initiate forgot password process

  $POST /auth/reset-password
  - Reset password
 ```

## Products

```bash
  $GET /products
  - Get a list of all products

  $GET /products/:id
  - Get details of a specific product

  $POST /products
  - Create a new product (authenticated)

  $PUT /products/:id
  - Update a product (authenticated, owner)

  $DELETE /products/:id
  - Delete a product (authenticated, owner)

  $GET /products/seller/:sellerId
  - Get products by seller
 ```

## Messages

```bash
  $GET /messages
  - $Get all messages for the authenticated user

  $POST /messages
  - Send a new message (authenticated)

  $GET /messages/:id
  - Get details of a specific message (authenticated)
```
## Users

```bash
  $GET /users/:id
  - Get user profile (authenticated)

  $PUT /users/:id
  - Update user profile (authenticated)

  $GET /users/:id/products
  - Get products listed by a user
```
## Cart

```bash
  $GET /cart
  - Get all cart items for the user including the list of items, quantities, and total price.

  $POST /cart/item
  - Create a new order (authenticated)

  $GET /orders/:id
  - Get details of a specific order (authenticated)

  $PUT /orders/:id
  - Update order status (authenticated, seller)
```


```bash
  $GET /orders
  - Get all orders for the authenticated user

  $POST /orders
  - Create a new order (authenticated)

  $GET /orders/:id
  - Get details of a specific order (authenticated)

  $PUT /orders/:id
  - Update order status (authenticated, seller)
```
## Reviews

```bash
  $GET /reviews
  - Get all reviews for a product

  $POST /reviews
  - Create a new review (authenticated)

  $PUT /reviews/:id
  - Update a review (authenticated, owner)

  $DELETE /reviews/:id
  - Delete a review (authenticated, owner)
```
## Categories

```bash
  $GET /categories
  - Get a list of all product categories
 ```


 model Payment {
  id                  String   @id @default(uuid())
  amount              Float
  currency            String
  txRef               String   @unique
  flwRef              String   @unique
  status              PaymentStatus
  paymentMethod       String
  user                User     @relation(fields: [userId], references: [userId])
  userId              String
  cart                Cart     @relation(fields: [cartId], references: [id])
  cartId              String   @unique
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@index([txRef, flwRef])
}

enum PaymentStatus {
  SUCCESSFUL
  FAILED
  PENDING
}
