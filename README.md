# Inventory Management Frontend

This is the **frontend** of the Inventory Management System built with **Vue 3**, **Vite**, and **Ant Design Vue**.  
It provides a responsive UI for managing Products, Product Types, Product Categories, and Inventory Snapshots.  
Authentication is included (login → products page).

---

##  Features

- **Authentication**
    - Login page (no navbar visible).
    - Redirects to Products page after login.
    - Session stored securely.

- **Product Management**
    - Create, edit, delete products.
    - View product list with pagination.

- **Product Type Management**
    - Manage product types (`code`, `name`).
    - CRUD operations via UI.

- **Product Category Management**
    - Manage hierarchical product categories (`code`, `name`, `parent`).
    - CRUD operations with tree view.

- **Inventory Snapshots**
    - View stock quantities per product & location.
    - Display `product name`, `location name`, `quantity`.
    - Auto-refresh on changes.


## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```