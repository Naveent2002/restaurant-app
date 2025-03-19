import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../redux/actions';

function AdminDashboard() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [refreshTime, setRefreshTime] = useState(new Date());
  const [processingOrders, setProcessingOrders] = useState(new Set());

  useEffect(() => {
    dispatch(fetchOrders())
      .then(() => {
        setIsInitialLoad(false);
        setRefreshTime(new Date());
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
        setIsInitialLoad(false);
      });

    // Poll for updates every 10 seconds
    const interval = setInterval(() => {
      dispatch(fetchOrders())
        .then(() => {
          setRefreshTime(new Date());
        })
        .catch((error) => {
          console.error('Error in polling orders:', error);
        });
    }, 10000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    setProcessingOrders((prev) => new Set(prev).add(orderId));

    try {
      await dispatch(updateOrderStatus(orderId, newStatus));
      await dispatch(fetchOrders());
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setProcessingOrders((prev) => {
        const updated = new Set(prev);
        updated.delete(orderId);
        return updated;
      });
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'Pending':
        return 'Cooking';
      case 'Cooking':
        return 'Ready';
      case 'Ready':
        return 'Delivered';
      default:
        return null;
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'Pending':
        return '⏱️';
      case 'Cooking':
        return '🔥';
      case 'Ready':
        return '✅';
      case 'Delivered':
        return '🚚';
      default:
        return '';
    }
  };

  const getButtonClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'cooking-button';
      case 'Cooking':
        return 'ready-button';
      case 'Ready':
        return 'delivered-button';
      default:
        return '';
    }
  };

  const getButtonText = (status) => {
    switch (status) {
      case 'Pending':
        return 'Start Cooking';
      case 'Cooking':
        return 'Mark Ready';
      case 'Ready':
        return 'Mark Delivered';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const calculateTimeDifference = (dateString) => {
    const orderDate = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - orderDate) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const mins = diffInMinutes % 60;
      return `${hours}h ${mins}m ago`;
    }
  };

  if (loading && orders.length === 0 && isInitialLoad) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <svg width="50" height="50" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r="20"
              stroke="#4a90e2"
              strokeWidth="4"
              fill="none"
              strokeDasharray="94.2"
              strokeDashoffset="25"
            />
          </svg>
        </div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error && isInitialLoad) {
    return (
      <div className="error-container">
        <div className="error-icon">❌</div>
        <h3>Error Loading Orders</h3>
        <p>{error}</p>
        <button
          className="retry-button"
          onClick={() => dispatch(fetchOrders())}
        >
          Retry
        </button>
      </div>
    );
  }

  // Group orders by status
  const pendingOrders = orders.filter((order) => order.status === 'Pending');
  const cookingOrders = orders.filter((order) => order.status === 'Cooking');
  const readyOrders = orders.filter((order) => order.status === 'Ready');
  const deliveredOrders = orders.filter((order) => order.status === 'Delivered');

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Restaurant Management Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat-box">
            <span className="stat-value">{orders.length}</span>
            <span className="stat-label">Total Orders</span>
          </div>
          <div className="stat-box pending-stat">
            <span className="stat-value">{pendingOrders.length}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-box cooking-stat">
            <span className="stat-value">{cookingOrders.length}</span>
            <span className="stat-label">Cooking</span>
          </div>
          <div className="stat-box ready-stat">
            <span className="stat-value">{readyOrders.length}</span>
            <span className="stat-label">Ready</span>
          </div>
        </div>
        <div className="last-updated">
          {loading ? (
            <span className="refreshing-text">Refreshing...</span>
          ) : (
            <span>Last updated: {refreshTime.toLocaleTimeString()}</span>
          )}
          {error && <span className="error-message"> (Error: {error})</span>}
        </div>
      </div>

      <div className="order-columns">
        {['Pending', 'Cooking', 'Ready', 'Delivered'].map((status) => {
          const statusOrders = {
            Pending: pendingOrders,
            Cooking: cookingOrders,
            Ready: readyOrders,
            Delivered: deliveredOrders,
          }[status];

          const columnClass = `order-column ${status.toLowerCase()}`;

          return (
            <div key={status} className={columnClass}>
              <div className="column-header">
                <h3>
                  {getStatusEmoji(status)} {status}
                </h3>
                <div className="order-count">{statusOrders.length}</div>
              </div>

              <div className="column-content">
                {statusOrders
                  .slice(0, status === 'Delivered' ? 5 : undefined)
                  .map((order) => {
                    const isProcessing = processingOrders.has(order._id);

                    return (
                      <div
                        key={order._id}
                        className={`order-card ${isProcessing ? 'processing' : ''}`}
                      >
                        <div className="order-card-header">
                          <span className="order-id">#{order._id.slice(-6)}</span>
                          <span
                            className="order-time"
                            title={formatDate(order.createdAt)}
                          >
                            {calculateTimeDifference(order.createdAt)}
                          </span>
                        </div>

                        <div className="customer-info">
                          <div className="customer-avatar">
                            {order.customerName.charAt(0).toUpperCase()}
                          </div>
                          <div className="customer-details">
                            <strong>{order.customerName}</strong>
                            {order.customerPhone && (
                              <span className="customer-phone">
                                {order.customerPhone}
                              </span>
                            )}
                          </div>
                        </div>

                        {status !== 'Delivered' && (
                          <div className="order-items">
                            {order.items.map((item, index) => (
                              <div key={index} className="order-item">
                                <span className="item-quantity">
                                  {item.quantity}×
                                </span>
                                <span className="item-name">{item.name}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {status === 'Pending' && (
                          <div className="order-total">
                            <span className="total-label">Total:</span>
                            <span className="total-amount">
                              ${order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        )}

                        {status === 'Delivered' ? (
                          <div className="delivered-time">
                            Delivered {calculateTimeDifference(order.updatedAt)}
                          </div>
                        ) : (
                          <button
                            className={`status-button ${getButtonClass(order.status)}`}
                            onClick={() =>
                              handleStatusChange(order._id, getNextStatus(order.status))
                            }
                            disabled={isProcessing}
                          >
                            {isProcessing ? 'Updating...' : getButtonText(order.status)}
                          </button>
                        )}
                      </div>
                    );
                  })}

                {status === 'Delivered' && deliveredOrders.length > 5 && (
                  <div className="more-orders">
                    +{deliveredOrders.length - 5} more orders
                  </div>
                )}

                {statusOrders.length === 0 && (
                  <div className="empty-column">
                    <p>No {status.toLowerCase()} orders</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminDashboard;