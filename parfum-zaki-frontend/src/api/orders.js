import API from './axios';

// Customer: Create a new order (Cash on delivery)
export const createOrder = async (orderData) => {
  const response = await API.post('/orders', orderData);
  return response.data;
};

// Admin: Get list of orders
export const getOrders = async (params = {}) => {
  const response = await API.get('/orders', { params });
  return response.data;
};

// Admin: Get order by ID
export const getOrderById = async (id) => {
  const response = await API.get(`/orders/${id}`);
  return response.data;
};

// Admin: Update order status (pending, confirmed, shipped, delivered, cancelled)
export const updateOrderStatus = async (id, status) => {
  const response = await API.put(`/orders/${id}`, { status });
  return response.data;
};

// Admin: Get summary statistics for dashboard
export const getOrderStats = async () => {
  const response = await API.get('/orders/stats/summary');
  return response.data;
};
