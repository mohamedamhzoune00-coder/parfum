import API from './axios';

export const createOrder = (data) => API.post('/orders', data);
export const getOrders = (params) => API.get('/orders', { params });
export const getOrder = (id) => API.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}`, { status });
export const getOrderStats = () => API.get('/orders/stats/summary');
