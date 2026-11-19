import API from './axios';

// Get active products for storefront (with search, category, sort params)
export const getProducts = async (params = {}) => {
  const response = await API.get('/products', { params });
  return response.data;
};

// Get single product details by ID
export const getProductById = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

// Admin: Get all products (including inactive)
export const getAdminProducts = async () => {
  const response = await API.get('/products/admin/all');
  return response.data;
};

// Admin: Create product
export const createProduct = async (productData) => {
  const response = await API.post('/products', productData);
  return response.data;
};

// Admin: Update product
export const updateProduct = async (id, productData) => {
  const response = await API.put(`/products/${id}`, productData);
  return response.data;
};

// Admin: Delete product
export const deleteProduct = async (id) => {
  const response = await API.delete(`/products/${id}`);
  return response.data;
};

// Get categories
export const getCategories = async () => {
  const response = await API.get('/categories');
  return response.data;
};
