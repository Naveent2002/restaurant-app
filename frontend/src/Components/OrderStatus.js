import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../redux/actions';

function OrderStatus() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.orders);
  
  useEffect(() => {
    dispatch(fetchOrders());
    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchOrders());
    }, 30000);
    
    return () => clearInterval(interval);
  }, [dispatch]);
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Cooking': return 'status-cooking';
      case 'Ready': return 'status-ready';
      case 'Delivered': return 'status-delivered';
      default: return '';
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  if (loading && orders.length === 0) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  
  return (
    <div className="orders">
      <h2>Your Orders</h2>
      
      {orders.length === 0 ? (
        <p className="no-orders">You haven't placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span className="order-id">Order #{order._id.slice(-6)}</span>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="order-time">
                Placed: {formatDate(order.createdAt)}
              </div>
              
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span className="item-quantity">{item.quantity}x</span>
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="order-total">
                Total: <strong>${order.totalAmount.toFixed(2)}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderStatus;