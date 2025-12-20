# Documentation API - Reboul Store

> Documentation générée automatiquement le 16/12/2025 à 15:18

## Vue d'ensemble

Cette documentation liste tous les endpoints disponibles dans l'API backend.

**Total** : 60 endpoints dans 9 controllers

---

## Auth Controller

**Route de base** : `/auth`

| Méthode | Route | Handler | Paramètres |
|---------|-------|---------|------------|
| `GET` | `/auth/me` | `getMe()` | - |
| `POST` | `/auth/register` | `register()` | registerDto: RegisterDto |
| `POST` | `/auth/login` | `login()` | loginDto: LoginDto |

### Détails des endpoints

#### `GET /auth/me`

- **Handler** : `getMe()`
- **Decorators** : UseGuards(JwtAuthGuard)
- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/auth/me"
  ```


#### `POST /auth/register`

- **Handler** : `register()`
- **Body** : `RegisterDto`

  **Champs du DTO `RegisterDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `email` | `string` | ✅ | required, email |
  | `password` | `string` | ✅ | required, email, minLength: 8, string |
  | `firstName` | `string` | ❌ | required, optional, email, minLength: 8, string |
  | `lastName` | `string` | ❌ | required, optional, email, minLength: 8, string |
  | `phone` | `string` | ❌ | required, optional, minLength: 8, string |

- **Exemple de requête** :

  ```bash
  curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
  "email": "user@example.com",
  "password": "user@example.com"
}' \
  "http://localhost:3000/auth/register"
  ```


#### `POST /auth/login`

- **Handler** : `login()`
- **Body** : `LoginDto`

  **Champs du DTO `LoginDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `email` | `string` | ✅ | required, email |
  | `password` | `string` | ✅ | required, email, string |

- **Decorators** : UseGuards(JwtAuthGuard)
- **Exemple de requête** :

  ```bash
  curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
  "email": "user@example.com",
  "password": "user@example.com"
}' \
  "http://localhost:3000/auth/login"
  ```


---

## Brands Controller

**Route de base** : `/brands`

| Méthode | Route | Handler | Paramètres |
|---------|-------|---------|------------|
| `GET` | `/brands` | `findAll()` | updateBrandDto: UpdateBrandDto |
| `GET` | `/brands/slug/:slug` | `findBySlug()` | updateBrandDto: UpdateBrandDto, slug: string |
| `GET` | `/brands/:id` | `findOne()` | updateBrandDto: UpdateBrandDto, id: string |
| `POST` | `/brands` | `create()` | createBrandDto: CreateBrandDto |
| `PATCH` | `/brands/:id` | `update()` | updateBrandDto: UpdateBrandDto, id: string |
| `DELETE` | `/brands/:id` | `remove()` | id: string |

### Détails des endpoints

#### `GET /brands`

- **Handler** : `findAll()`
- **Body** : `UpdateBrandDto`
- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/brands"
  ```


#### `GET /brands/slug/:slug`

- **Handler** : `findBySlug()`
- **Path Parameters** : slug
- **Body** : `UpdateBrandDto`
- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/brands/slug/example-slug"
  ```


#### `GET /brands/:id`

- **Handler** : `findOne()`
- **Path Parameters** : id
- **Body** : `UpdateBrandDto`
- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/brands/123e4567-e89b-12d3-a456-426614174000"
  ```


#### `POST /brands`

- **Handler** : `create()`
- **Body** : `CreateBrandDto`

  **Champs du DTO `CreateBrandDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `name` | `string` | ✅ | required, string |
  | `slug` | `string` | ✅ | required, string |
  | `description` | `string` | ❌ | required, optional, string |
  | `logoUrl` | `string` | ❌ | required, optional, string |
  | `megaMenuImage1` | `string` | ❌ | optional, string |
  | `megaMenuImage2` | `string` | ❌ | optional, string |
  | `megaMenuVideo1` | `string` | ❌ | optional, string |
  | `megaMenuVideo2` | `string` | ❌ | optional, string |

- **Decorators** : HttpCode(CREATED)
- **Exemple de requête** :

  ```bash
  curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
  "name": "string",
  "slug": "string"
}' \
  "http://localhost:3000/brands"
  ```


#### `PATCH /brands/:id`

- **Handler** : `update()`
- **Path Parameters** : id
- **Body** : `UpdateBrandDto`
- **Decorators** : HttpCode(NO_CONTENT)
- **Exemple de requête** :

  ```bash
  curl -X PATCH \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/brands/123e4567-e89b-12d3-a456-426614174000"
  ```


#### `DELETE /brands/:id`

- **Handler** : `remove()`
- **Path Parameters** : id
- **Decorators** : HttpCode(NO_CONTENT)
- **Exemple de requête** :

  ```bash
  curl -X DELETE \
  "http://localhost:3000/brands/123e4567-e89b-12d3-a456-426614174000"
  ```


---

## Cart Controller

**Route de base** : `/cart`

| Méthode | Route | Handler | Paramètres |
|---------|-------|---------|------------|
| `GET` | `/cart` | `getCart()` | addToCartDto: AddToCartDto |
| `POST` | `/cart/items` | `addItem()` | addToCartDto: AddToCartDto |
| `PUT` | `/cart/items/:id` | `updateItem()` | updateCartItemDto: UpdateCartItemDto, itemId: string |
| `DELETE` | `/cart/items/:id` | `removeItem()` | itemId: string |
| `DELETE` | `/cart` | `HttpCode()` | - |

### Détails des endpoints

#### `GET /cart`

- **Handler** : `getCart()`
- **Body** : `AddToCartDto`

  **Champs du DTO `AddToCartDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `variantId` | `string` | ✅ | uuid |
  | `quantity` | `number` | ✅ | min: 1, uuid, number |

- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -d '{
  "variantId": "123e4567-e89b-12d3-a456-426614174000",
  "quantity": "123e4567-e89b-12d3-a456-426614174000"
}' \
  "http://localhost:3000/cart"
  ```


#### `POST /cart/items`

- **Handler** : `addItem()`
- **Body** : `AddToCartDto`

  **Champs du DTO `AddToCartDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `variantId` | `string` | ✅ | uuid |
  | `quantity` | `number` | ✅ | min: 1, uuid, number |

- **Decorators** : HttpCode(CREATED)
- **Exemple de requête** :

  ```bash
  curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
  "variantId": "123e4567-e89b-12d3-a456-426614174000",
  "quantity": "123e4567-e89b-12d3-a456-426614174000"
}' \
  "http://localhost:3000/cart/items"
  ```


#### `PUT /cart/items/:id`

- **Handler** : `updateItem()`
- **Path Parameters** : id
- **Body** : `UpdateCartItemDto`

  **Champs du DTO `UpdateCartItemDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `quantity` | `number` | ✅ | min: 1, number |

- **Exemple de requête** :

  ```bash
  curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{
  "quantity": 0
}' \
  "http://localhost:3000/cart/items/123e4567-e89b-12d3-a456-426614174000"
  ```


#### `DELETE /cart/items/:id`

- **Handler** : `removeItem()`
- **Path Parameters** : id
- **Decorators** : HttpCode(NO_CONTENT)
- **Exemple de requête** :

  ```bash
  curl -X DELETE \
  "http://localhost:3000/cart/items/123e4567-e89b-12d3-a456-426614174000"
  ```


#### `DELETE /cart`

- **Handler** : `HttpCode()`
- **Decorators** : HttpCode(NO_CONTENT)
- **Exemple de requête** :

  ```bash
  curl -X DELETE \
  "http://localhost:3000/cart"
  ```


---

## Categories Controller

**Route de base** : `/categories`

| Méthode | Route | Handler | Paramètres |
|---------|-------|---------|------------|
| `GET` | `/categories` | `findAll()` | updateCategoryDto: UpdateCategoryDto |
| `GET` | `/categories/:id` | `findOne()` | updateCategoryDto: UpdateCategoryDto, id: string |
| `GET` | `/categories/slug/:slug` | `findBySlug()` | updateCategoryDto: UpdateCategoryDto, slug: string |
| `POST` | `/categories` | `create()` | createCategoryDto: CreateCategoryDto |
| `PATCH` | `/categories/:id` | `update()` | updateCategoryDto: UpdateCategoryDto, id: string |
| `DELETE` | `/categories/:id` | `remove()` | id: string |

### Détails des endpoints

#### `GET /categories`

- **Handler** : `findAll()`
- **Body** : `UpdateCategoryDto`
- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/categories"
  ```


#### `GET /categories/:id`

- **Handler** : `findOne()`
- **Path Parameters** : id
- **Body** : `UpdateCategoryDto`
- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/categories/123e4567-e89b-12d3-a456-426614174000"
  ```


#### `GET /categories/slug/:slug`

- **Handler** : `findBySlug()`
- **Path Parameters** : slug
- **Body** : `UpdateCategoryDto`
- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/categories/slug/example-slug"
  ```


#### `POST /categories`

- **Handler** : `create()`
- **Body** : `CreateCategoryDto`

  **Champs du DTO `CreateCategoryDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `name` | `string` | ✅ | required, string |
  | `slug` | `string` | ✅ | required, string |
  | `description` | `string` | ❌ | required, optional, string |
  | `imageUrl` | `string` | ❌ | required, optional, string |
  | `videoUrl` | `string` | ❌ | optional, string |
  | `sizeChart` | `Array<{
    size: string` | ❌ | optional, string, array |
  | `chest` | `number` | ❌ | optional, string, array |
  | `length` | `number` | ❌ | optional, array |
  | `waist` | `number` | ❌ | optional, array |
  | `hip` | `number` | ❌ | optional, array |

- **Decorators** : HttpCode(CREATED)
- **Exemple de requête** :

  ```bash
  curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
  "name": "string",
  "slug": "string"
}' \
  "http://localhost:3000/categories"
  ```


#### `PATCH /categories/:id`

- **Handler** : `update()`
- **Path Parameters** : id
- **Body** : `UpdateCategoryDto`
- **Exemple de requête** :

  ```bash
  curl -X PATCH \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/categories/123e4567-e89b-12d3-a456-426614174000"
  ```


#### `DELETE /categories/:id`

- **Handler** : `remove()`
- **Path Parameters** : id
- **Decorators** : HttpCode(NO_CONTENT)
- **Exemple de requête** :

  ```bash
  curl -X DELETE \
  "http://localhost:3000/categories/123e4567-e89b-12d3-a456-426614174000"
  ```


---

## Checkout Controller

**Route de base** : `/checkout`

| Méthode | Route | Handler | Paramètres |
|---------|-------|---------|------------|
| `POST` | `/checkout/create-session` | `createSession()` | createCheckoutSessionDto: CreateCheckoutSessionDto |
| `POST` | `/checkout/webhook` | `handleWebhook()` | - |

### Détails des endpoints

#### `POST /checkout/create-session`

- **Handler** : `createSession()`
- **Body** : `CreateCheckoutSessionDto`

  **Champs du DTO `CreateCheckoutSessionDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `variantId` | `string` | ✅ | required, string |
  | `quantity` | `number` | ✅ | required, min: 1, string |
  | `each` | `true })
  @Type(() => CheckoutItemDto)
  items: CheckoutItemDto[]` | ✅ | required, min: 1, string, array |

- **Decorators** : HttpCode(OK)
- **Exemple de requête** :

  ```bash
  curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
  "variantId": "string",
  "quantity": "string",
  "each": "string"
}' \
  "http://localhost:3000/checkout/create-session"
  ```


#### `POST /checkout/webhook`

- **Handler** : `handleWebhook()`
- **Decorators** : HttpCode(OK)
- **Exemple de requête** :

  ```bash
  curl -X POST \
  -d "{}" \
  "http://localhost:3000/checkout/webhook"
  ```


---

## Orders Controller

**Route de base** : `/orders`

| Méthode | Route | Handler | Paramètres |
|---------|-------|---------|------------|
| `GET` | `/orders/me` | `findMyOrders()` | updateStatusDto: UpdateOrderStatusDto |
| `GET` | `/orders` | `findAll()` | updateStatusDto: UpdateOrderStatusDto |
| `GET` | `/orders/:id` | `findOne()` | updateStatusDto: UpdateOrderStatusDto, id: string |
| `GET` | `/orders/:id/invoice` | `downloadInvoice()` | id: string |
| `POST` | `/orders` | `create()` | createOrderDto: CreateOrderDto |
| `POST` | `/orders/test-email` | `testEmail()` | updateStatusDto: UpdateOrderStatusDto |
| `POST` | `/orders/:id/capture` | `capturePayment()` | id: string |
| `PATCH` | `/orders/:id/cancel` | `cancel()` | updateStatusDto: UpdateOrderStatusDto, id: string |
| `PATCH` | `/orders/:id/status` | `updateStatus()` | updateStatusDto: UpdateOrderStatusDto, id: string |

### Détails des endpoints

#### `GET /orders/me`

- **Handler** : `findMyOrders()`
- **Body** : `UpdateOrderStatusDto`

  **Champs du DTO `UpdateOrderStatusDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `status` | `OrderStatus` | ✅ | - |

- **Decorators** : UseGuards(JwtAuthGuard)
- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
  "status": "string"
}' \
  "http://localhost:3000/orders/me"
  ```


#### `GET /orders`

- **Handler** : `findAll()`
- **Body** : `UpdateOrderStatusDto`

  **Champs du DTO `UpdateOrderStatusDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `status` | `OrderStatus` | ✅ | - |

- **Decorators** : UseGuards(JwtAuthGuard)
- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
  "status": "string"
}' \
  "http://localhost:3000/orders"
  ```


#### `GET /orders/:id`

- **Handler** : `findOne()`
- **Path Parameters** : id
- **Body** : `UpdateOrderStatusDto`

  **Champs du DTO `UpdateOrderStatusDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `status` | `OrderStatus` | ✅ | - |

- **Decorators** : UseGuards(JwtAuthGuard)
- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
  "status": "string"
}' \
  "http://localhost:3000/orders/123e4567-e89b-12d3-a456-426614174000"
  ```


#### `GET /orders/:id/invoice`

- **Handler** : `downloadInvoice()`
- **Path Parameters** : id
- **Decorators** : UseGuards(JwtAuthGuard)
- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/orders/123e4567-e89b-12d3-a456-426614174000/invoice"
  ```


#### `POST /orders`

- **Handler** : `create()`
- **Body** : `CreateOrderDto`

  **Champs du DTO `CreateOrderDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `street` | `string` | ✅ | required, string |
  | `city` | `string` | ✅ | required, string |
  | `postalCode` | `string` | ✅ | required, string |
  | `country` | `string` | ✅ | required, string |
  | `name` | `string` | ✅ | required, string |
  | `email` | `string` | ✅ | required, email, string |
  | `phone` | `string` | ❌ | required, optional, email, string |
  | `address` | `AddressDto` | ❌ | required, optional, email, string |
  | `cartId` | `string` | ❌ | required, optional, uuid, string |
  | `customerInfo` | `CustomerInfoDto` | ✅ | required, uuid |

- **Decorators** : HttpCode(CREATED)
- **Exemple de requête** :

  ```bash
  curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
  "street": "string",
  "city": "string",
  "postalCode": "string",
  "country": "string",
  "name": "string",
  "email": "user@example.com",
  "customerInfo": "123e4567-e89b-12d3-a456-426614174000"
}' \
  "http://localhost:3000/orders"
  ```


#### `POST /orders/test-email`

- **Handler** : `testEmail()`
- **Body** : `UpdateOrderStatusDto`

  **Champs du DTO `UpdateOrderStatusDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `status` | `OrderStatus` | ✅ | - |

- **Decorators** : HttpCode(OK)
- **Exemple de requête** :

  ```bash
  curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
  "status": "string"
}' \
  "http://localhost:3000/orders/test-email"
  ```


#### `POST /orders/:id/capture`

- **Handler** : `capturePayment()`
- **Path Parameters** : id
- **Decorators** : HttpCode(OK), UseGuards(JwtAuthGuard)
- **Exemple de requête** :

  ```bash
  curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{}" \
  "http://localhost:3000/orders/123e4567-e89b-12d3-a456-426614174000/capture"
  ```


#### `PATCH /orders/:id/cancel`

- **Handler** : `cancel()`
- **Path Parameters** : id
- **Body** : `UpdateOrderStatusDto`

  **Champs du DTO `UpdateOrderStatusDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `status` | `OrderStatus` | ✅ | - |

- **Decorators** : HttpCode(OK), UseGuards(JwtAuthGuard)
- **Exemple de requête** :

  ```bash
  curl -X PATCH \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
  "status": "string"
}' \
  "http://localhost:3000/orders/123e4567-e89b-12d3-a456-426614174000/cancel"
  ```


#### `PATCH /orders/:id/status`

- **Handler** : `updateStatus()`
- **Path Parameters** : id
- **Body** : `UpdateOrderStatusDto`

  **Champs du DTO `UpdateOrderStatusDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `status` | `OrderStatus` | ✅ | - |

- **Exemple de requête** :

  ```bash
  curl -X PATCH \
  -H "Content-Type: application/json" \
  -d '{
  "status": "string"
}' \
  "http://localhost:3000/orders/123e4567-e89b-12d3-a456-426614174000/status"
  ```


---

## Products Controller

**Route de base** : `/products`

| Méthode | Route | Handler | Paramètres |
|---------|-------|---------|------------|
| `GET` | `/products/:id/images` | `findImagesByProduct()` | body: any, id: string |
| `GET` | `/products` | `findAll()` | updateProductDto: UpdateProductDto, query: ProductQueryDto |
| `GET` | `/products/:id/variants` | `findVariantsByProduct()` | updateProductDto: UpdateProductDto, id: string |
| `GET` | `/products/:id` | `findOne()` | updateProductDto: UpdateProductDto, id: string |
| `GET` | `/products/category/:categoryId` | `findByCategory()` | updateProductDto: UpdateProductDto, categoryId: string, query: ProductQueryDto |
| `GET` | `/products/:productId/variants/:variantId` | `findVariantById()` | createVariantDto: CreateVariantDto, productId: string, variantId: string |
| `GET` | `/products/:productId/variants/:variantId/stock` | `checkStock()` | productId: string, variantId: string |
| `POST` | `/products/:id/images` | `createImage()` | body: any, productId: string |
| `POST` | `/products/:id/images/bulk` | `createImagesBulk()` | body: any, productId: string |
| `POST` | `/products` | `create()` | createProductDto: CreateProductDto |
| `POST` | `/products/:id/variants` | `createVariant()` | createVariantDto: CreateVariantDto, productId: string |
| `PATCH` | `/products/:productId/images/:imageId/order` | `updateImageOrder()` | updateOrderDto: UpdateImageOrderDto, productId: string, imageId: string |
| `PATCH` | `/products/:id` | `update()` | updateProductDto: UpdateProductDto, id: string |
| `PATCH` | `/products/:productId/variants/:variantId` | `updateVariant()` | updateVariantDto: UpdateVariantDto, productId: string, variantId: string |
| `DELETE` | `/products/:productId/images/:imageId` | `deleteImage()` | updateOrderDto: UpdateImageOrderDto, productId: string, imageId: string |
| `DELETE` | `/products/:id` | `remove()` | createVariantDto: CreateVariantDto, id: string |

### Détails des endpoints

#### `GET /products/:id/images`

- **Handler** : `findImagesByProduct()`
- **Path Parameters** : id
- **Body** : `any`
- **Decorators** : UseInterceptors(FileInterceptor('file', multerConfig)
- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/products/123e4567-e89b-12d3-a456-426614174000/images"
  ```


#### `GET /products`

- **Handler** : `findAll()`
- **Body** : `UpdateProductDto`
- **Query Parameters** : ProductQueryDto
- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/products"
  ```


#### `GET /products/:id/variants`

- **Handler** : `findVariantsByProduct()`
- **Path Parameters** : id
- **Body** : `UpdateProductDto`
- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/products/123e4567-e89b-12d3-a456-426614174000/variants"
  ```


#### `GET /products/:id`

- **Handler** : `findOne()`
- **Path Parameters** : id
- **Body** : `UpdateProductDto`
- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/products/123e4567-e89b-12d3-a456-426614174000"
  ```


#### `GET /products/category/:categoryId`

- **Handler** : `findByCategory()`
- **Path Parameters** : categoryId
- **Body** : `UpdateProductDto`
- **Query Parameters** : ProductQueryDto
- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/products/category/example-categoryId"
  ```


#### `GET /products/:productId/variants/:variantId`

- **Handler** : `findVariantById()`
- **Path Parameters** : productId, variantId
- **Body** : `CreateVariantDto`

  **Champs du DTO `CreateVariantDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `color` | `string` | ✅ | required, string |
  | `size` | `string` | ✅ | required, string |
  | `stock` | `number` | ✅ | required, min: 0, number, string |
  | `sku` | `string` | ✅ | required, min: 0, number, string |

- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -d '{
  "color": "string",
  "size": "string",
  "stock": 0,
  "sku": 0
}' \
  "http://localhost:3000/products/example-productId/variants/example-variantId"
  ```


#### `GET /products/:productId/variants/:variantId/stock`

- **Handler** : `checkStock()`
- **Path Parameters** : productId, variantId
- **Exemple de requête** :

  ```bash
  curl -X GET \
  "http://localhost:3000/products/example-productId/variants/example-variantId/stock"
  ```


#### `POST /products/:id/images`

- **Handler** : `createImage()`
- **Path Parameters** : id
- **Body** : `any`
- **Decorators** : HttpCode(CREATED), UseInterceptors(FileInterceptor('file', multerConfig)
- **Exemple de requête** :

  ```bash
  curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/products/123e4567-e89b-12d3-a456-426614174000/images"
  ```


#### `POST /products/:id/images/bulk`

- **Handler** : `createImagesBulk()`
- **Path Parameters** : id
- **Body** : `any`
- **Decorators** : HttpCode(CREATED), UseInterceptors(FilesInterceptor('files', 7, multerConfig)
- **Exemple de requête** :

  ```bash
  curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/products/123e4567-e89b-12d3-a456-426614174000/images/bulk"
  ```


#### `POST /products`

- **Handler** : `create()`
- **Body** : `CreateProductDto`

  **Champs du DTO `CreateProductDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `name` | `string` | ✅ | required, string |
  | `description` | `string` | ❌ | required, optional, string |
  | `price` | `number` | ❌ | required, optional, min: 0, number, string |
  | `categoryId` | `string` | ❌ | required, optional, min: 0, uuid, number, string |
  | `shopId` | `string` | ❌ | required, optional, min: 0, uuid, number, string |
  | `brandId` | `string` | ❌ | required, optional, min: 0, uuid, number |
  | `materials` | `string` | ❌ | optional, uuid, string |
  | `careInstructions` | `string` | ❌ | optional, uuid, string |
  | `madeIn` | `string` | ❌ | optional, string |
  | `customSizeChart` | `Array<{
    size: string` | ❌ | optional, string, array |
  | `chest` | `number` | ❌ | optional, string, array |
  | `length` | `number` | ❌ | optional, array |
  | `waist` | `number` | ❌ | optional, array |
  | `hip` | `number` | ❌ | optional, array |

- **Decorators** : HttpCode(CREATED)
- **Exemple de requête** :

  ```bash
  curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
  "name": "string"
}' \
  "http://localhost:3000/products"
  ```


#### `POST /products/:id/variants`

- **Handler** : `createVariant()`
- **Path Parameters** : id
- **Body** : `CreateVariantDto`

  **Champs du DTO `CreateVariantDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `color` | `string` | ✅ | required, string |
  | `size` | `string` | ✅ | required, string |
  | `stock` | `number` | ✅ | required, min: 0, number, string |
  | `sku` | `string` | ✅ | required, min: 0, number, string |

- **Decorators** : HttpCode(CREATED)
- **Exemple de requête** :

  ```bash
  curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
  "color": "string",
  "size": "string",
  "stock": 0,
  "sku": 0
}' \
  "http://localhost:3000/products/123e4567-e89b-12d3-a456-426614174000/variants"
  ```


#### `PATCH /products/:productId/images/:imageId/order`

- **Handler** : `updateImageOrder()`
- **Path Parameters** : productId, imageId
- **Body** : `UpdateImageOrderDto`

  **Champs du DTO `UpdateImageOrderDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `order` | `number` | ✅ | min: 0, number |

- **Exemple de requête** :

  ```bash
  curl -X PATCH \
  -H "Content-Type: application/json" \
  -d '{
  "order": 0
}' \
  "http://localhost:3000/products/example-productId/images/example-imageId/order"
  ```


#### `PATCH /products/:id`

- **Handler** : `update()`
- **Path Parameters** : id
- **Body** : `UpdateProductDto`
- **Decorators** : HttpCode(NO_CONTENT)
- **Exemple de requête** :

  ```bash
  curl -X PATCH \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/products/123e4567-e89b-12d3-a456-426614174000"
  ```


#### `PATCH /products/:productId/variants/:variantId`

- **Handler** : `updateVariant()`
- **Path Parameters** : productId, variantId
- **Body** : `UpdateVariantDto`
- **Exemple de requête** :

  ```bash
  curl -X PATCH \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/products/example-productId/variants/example-variantId"
  ```


#### `DELETE /products/:productId/images/:imageId`

- **Handler** : `deleteImage()`
- **Path Parameters** : productId, imageId
- **Body** : `UpdateImageOrderDto`

  **Champs du DTO `UpdateImageOrderDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `order` | `number` | ✅ | min: 0, number |

- **Decorators** : HttpCode(NO_CONTENT)
- **Exemple de requête** :

  ```bash
  curl -X DELETE \
  -H "Content-Type: application/json" \
  -d '{
  "order": 0
}' \
  "http://localhost:3000/products/example-productId/images/example-imageId"
  ```


#### `DELETE /products/:id`

- **Handler** : `remove()`
- **Path Parameters** : id
- **Body** : `CreateVariantDto`

  **Champs du DTO `CreateVariantDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `color` | `string` | ✅ | required, string |
  | `size` | `string` | ✅ | required, string |
  | `stock` | `number` | ✅ | required, min: 0, number, string |
  | `sku` | `string` | ✅ | required, min: 0, number, string |

- **Decorators** : HttpCode(NO_CONTENT)
- **Exemple de requête** :

  ```bash
  curl -X DELETE \
  -H "Content-Type: application/json" \
  -d '{
  "color": "string",
  "size": "string",
  "stock": 0,
  "sku": 0
}' \
  "http://localhost:3000/products/123e4567-e89b-12d3-a456-426614174000"
  ```


---

## Shops Controller

**Route de base** : `/shops`

| Méthode | Route | Handler | Paramètres |
|---------|-------|---------|------------|
| `GET` | `/shops` | `findAll()` | updateShopDto: UpdateShopDto |
| `GET` | `/shops/:id` | `findOne()` | updateShopDto: UpdateShopDto, id: string |
| `GET` | `/shops/slug/:slug` | `findBySlug()` | updateShopDto: UpdateShopDto, slug: string |
| `POST` | `/shops` | `create()` | createShopDto: CreateShopDto |
| `PATCH` | `/shops/:id` | `update()` | updateShopDto: UpdateShopDto, id: string |
| `DELETE` | `/shops/:id` | `remove()` | id: string |

### Détails des endpoints

#### `GET /shops`

- **Handler** : `findAll()`
- **Body** : `UpdateShopDto`
- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/shops"
  ```


#### `GET /shops/:id`

- **Handler** : `findOne()`
- **Path Parameters** : id
- **Body** : `UpdateShopDto`
- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/shops/123e4567-e89b-12d3-a456-426614174000"
  ```


#### `GET /shops/slug/:slug`

- **Handler** : `findBySlug()`
- **Path Parameters** : slug
- **Body** : `UpdateShopDto`
- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/shops/slug/example-slug"
  ```


#### `POST /shops`

- **Handler** : `create()`
- **Body** : `CreateShopDto`

  **Champs du DTO `CreateShopDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `name` | `string` | ✅ | required, string |
  | `slug` | `string` | ✅ | required, string |
  | `description` | `string` | ❌ | required, optional, string |
  | `shippingPolicy` | `{
    freeShippingThreshold?: number` | ❌ | required, optional, string |
  | `deliveryTime` | `string` | ❌ | required, optional, string |
  | `internationalShipping` | `boolean` | ❌ | optional, string |
  | `shippingCost` | `string` | ❌ | optional |
  | `description` | `string` | ❌ | optional |
  | `returnPolicy` | `{
    returnWindow?: number` | ❌ | optional |
  | `returnShippingFree` | `boolean` | ❌ | optional |
  | `conditions` | `string` | ❌ | optional |

- **Decorators** : HttpCode(CREATED)
- **Exemple de requête** :

  ```bash
  curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
  "name": "string",
  "slug": "string"
}' \
  "http://localhost:3000/shops"
  ```


#### `PATCH /shops/:id`

- **Handler** : `update()`
- **Path Parameters** : id
- **Body** : `UpdateShopDto`
- **Decorators** : HttpCode(NO_CONTENT)
- **Exemple de requête** :

  ```bash
  curl -X PATCH \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/shops/123e4567-e89b-12d3-a456-426614174000"
  ```


#### `DELETE /shops/:id`

- **Handler** : `remove()`
- **Path Parameters** : id
- **Decorators** : HttpCode(NO_CONTENT)
- **Exemple de requête** :

  ```bash
  curl -X DELETE \
  "http://localhost:3000/shops/123e4567-e89b-12d3-a456-426614174000"
  ```


---

## Users Controller

**Route de base** : `/users`

| Méthode | Route | Handler | Paramètres |
|---------|-------|---------|------------|
| `GET` | `/users/me` | `getProfile()` | updateUserDto: UpdateUserDto |
| `GET` | `/users/me/addresses` | `getAddresses()` | createAddressDto: CreateAddressDto |
| `GET` | `/users/me/addresses/:id` | `getAddress()` | updateAddressDto: UpdateAddressDto, addressId: string |
| `POST` | `/users/me/addresses` | `createAddress()` | createAddressDto: CreateAddressDto |
| `PATCH` | `/users/me` | `updateProfile()` | updateUserDto: UpdateUserDto |
| `PATCH` | `/users/me/addresses/:id` | `updateAddress()` | updateAddressDto: UpdateAddressDto, addressId: string |
| `DELETE` | `/users/me/addresses/:id` | `deleteAddress()` | addressId: string |

### Détails des endpoints

#### `GET /users/me`

- **Handler** : `getProfile()`
- **Body** : `UpdateUserDto`

  **Champs du DTO `UpdateUserDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `email` | `string` | ❌ | optional, email |
  | `password` | `string` | ❌ | optional, email, minLength: 8, string |
  | `firstName` | `string` | ❌ | optional, email, minLength: 8, string |
  | `lastName` | `string` | ❌ | optional, email, minLength: 8, string |
  | `phone` | `string` | ❌ | optional, minLength: 8, string |

- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/users/me"
  ```


#### `GET /users/me/addresses`

- **Handler** : `getAddresses()`
- **Body** : `CreateAddressDto`

  **Champs du DTO `CreateAddressDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `street` | `string` | ✅ | required, string |
  | `city` | `string` | ✅ | required, string |
  | `postalCode` | `string` | ✅ | required, string |
  | `country` | `string` | ❌ | required, optional, string |
  | `additionalInfo` | `string` | ❌ | required, optional, string |
  | `isDefault` | `boolean` | ❌ | required, optional, string |

- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -d '{
  "street": "string",
  "city": "string",
  "postalCode": "string"
}' \
  "http://localhost:3000/users/me/addresses"
  ```


#### `GET /users/me/addresses/:id`

- **Handler** : `getAddress()`
- **Path Parameters** : id
- **Body** : `UpdateAddressDto`
- **Exemple de requête** :

  ```bash
  curl -X GET \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/users/me/addresses/123e4567-e89b-12d3-a456-426614174000"
  ```


#### `POST /users/me/addresses`

- **Handler** : `createAddress()`
- **Body** : `CreateAddressDto`

  **Champs du DTO `CreateAddressDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `street` | `string` | ✅ | required, string |
  | `city` | `string` | ✅ | required, string |
  | `postalCode` | `string` | ✅ | required, string |
  | `country` | `string` | ❌ | required, optional, string |
  | `additionalInfo` | `string` | ❌ | required, optional, string |
  | `isDefault` | `boolean` | ❌ | required, optional, string |

- **Exemple de requête** :

  ```bash
  curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
  "street": "string",
  "city": "string",
  "postalCode": "string"
}' \
  "http://localhost:3000/users/me/addresses"
  ```


#### `PATCH /users/me`

- **Handler** : `updateProfile()`
- **Body** : `UpdateUserDto`

  **Champs du DTO `UpdateUserDto`** :

  | Champ | Type | Requis | Validations |
  |-------|------|--------|-------------|
  | `email` | `string` | ❌ | optional, email |
  | `password` | `string` | ❌ | optional, email, minLength: 8, string |
  | `firstName` | `string` | ❌ | optional, email, minLength: 8, string |
  | `lastName` | `string` | ❌ | optional, email, minLength: 8, string |
  | `phone` | `string` | ❌ | optional, minLength: 8, string |

- **Exemple de requête** :

  ```bash
  curl -X PATCH \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/users/me"
  ```


#### `PATCH /users/me/addresses/:id`

- **Handler** : `updateAddress()`
- **Path Parameters** : id
- **Body** : `UpdateAddressDto`
- **Exemple de requête** :

  ```bash
  curl -X PATCH \
  -H "Content-Type: application/json" \
  -d '{
}' \
  "http://localhost:3000/users/me/addresses/123e4567-e89b-12d3-a456-426614174000"
  ```


#### `DELETE /users/me/addresses/:id`

- **Handler** : `deleteAddress()`
- **Path Parameters** : id
- **Exemple de requête** :

  ```bash
  curl -X DELETE \
  "http://localhost:3000/users/me/addresses/123e4567-e89b-12d3-a456-426614174000"
  ```


---

