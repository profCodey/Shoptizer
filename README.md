# EXPRESS

### Setup

1. Use and setup the project with `yarn`.
2. Convert the project to Typescript.
3. Initialize tsconfig.
4. Create .gitignore file to ignore the node_modules
## Problem Description:

A basic Express application, that makes a CRUD operation (create, read, update, delete) using SQLite database and EJS as template engine
In this project, you’ll build a basic CRUD (Create, Read, Update, Delete) for an Ecommerce Application.

## Requirements:

IMPLEMENT AUTHORIZATION AND AUTHENTICATION: PROTECT ALL ROUTES. ONLY THE LOGGED-IN USERS CAN PERFORM THE FOLLOWING OPERATIONS

- You can add product.
- You can edit products.
- You can delete products.

## NOTE
 - Users must not be authenticated before viewing or browsing through products.


- Data format example: This show the model for users and the products created by the user

```
[

 {
   fullname: 'john doe',
   email: 'john@example.com', // no duplicates allowed.
   gender:'m',
   phone:'+2347085647535',
   address:'1, rantech stop, ',
 },
 
   Products:[
   {
  name: "Ankara",
  image: "https://product image here",
  brand: "Nike",
  category: "men shoes",
  description: "Buy this nice product",
  price: 4200,
  countInStock: 7,
  rating: 6,
  numReviews: 5,
  }
   ......
]
```

## FRONTEND

- Page displays all products from all users
- An admin/dashboard area to add, edit and delete ( User can only edit and delete Products created by them)
- In the admin/dashboard, a page to shows the users information
- A Login Page and Sign Up Page

