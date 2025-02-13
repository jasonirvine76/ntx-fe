import { gql } from "@apollo/client/core";

// Define interfaces for type safety (optional)
export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category_id: string;
}

export interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  // Nested categories
  subcategories: Category[];
  // Optionally, you may also include products if your schema supports it:
  products?: Product[];
}

// Query to fetch products
export const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      price
      quantity
      category_id
    }
  }
`;

// Query to fetch categories with nested subcategories (up to 5 levels deep)
export const GET_CATEGORIES = gql`
  fragment CategoryFields on Category {
    id
    name
  }

  fragment CategoriesRecursive on Category {
    subcategories {
      ...CategoryFields
      subcategories {
        ...CategoryFields
        subcategories {
          ...CategoryFields
          subcategories {
            ...CategoryFields
            subcategories {
              ...CategoryFields
            }
          }
        }
      }
    }
  }

  query GetCategories {
    categories {
      id
      name
      parent_id
      ...CategoriesRecursive
    }
  }
`;

// Mutation to add a product
export const ADD_PRODUCT = gql`
  mutation AddProduct(
    $name: String!
    $price: numeric!
    $quantity: Int!
    $categoryId: Int!
  ) {
    insert_products(
      objects: {
        name: $name
        price: $price
        quantity: $quantity
        category_id: $categoryId
      }
    ) {
      returning {
        id
        name
        price
        quantity
      }
    }
  }
`;

// Mutation to update a product
export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: Int!, $name: String!, $price: numeric!) {
    update_products_by_pk(
      pk_columns: { id: $id }
      _set: { name: $name, price: $price }
    ) {
      id
      name
      price
    }
  }
`;

// Mutation to delete a product
export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: Int!) {
    delete_products_by_pk(id: $id) {
      id
    }
  }
`;

// Mutation to add a category  
// Note: This mutation assumes that the relationship for a parent category is set using a field named "category"
// which might differ from your schema. Adjust the input type if necessary.
export const ADD_CATEGORY = gql`
  mutation AddCategory(
    $name: String!
    $category: categories_obj_rel_insert_input
  ) {
    insert_categories(objects: { name: $name, category: $category }) {
      returning {
        id
        name
        category {
          id
          name
        }
      }
    }
  }
`;

// Mutation to update a category
export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: Int!, $name: String!) {
    update_categories_by_pk(
      pk_columns: { id: $id }
      _set: { name: $name }
    ) {
      id
      name
    }
  }
`;

// Mutation to delete a category
export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: Int!) {
    delete_categories_by_pk(id: $id) {
      id
    }
  }
`;
