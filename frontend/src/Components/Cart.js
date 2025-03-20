import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { removeFromCart, updateCartItemQuantity, placeOrder } from '../redux/actions';

function Cart() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const [customerInfo, setCustomerInfo] = useState({
    customerName: '',
    customerPhone: '', // No address field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity >= 1) {
      dispatch(updateCartItemQuantity(itemId, quantity));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      return;
    }

    if (!customerInfo.customerName.trim()) {
      alert('Please enter your name.');
      return;
    }

    const orderData = {
      items: items.map((item) => ({
        item: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount,
      ...customerInfo, // No address field
    };

    setIsSubmitting(true);

    try {
      await dispatch(placeOrder(orderData));
      alert('Order placed successfully!');
      history.push('/orders');
    } catch (error) {
      alert(`Failed to place order: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cart">
      <h2>Your Cart</h2>

      {items.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>${item.price.toFixed(2)}</p>
                </div>
                <div className="quantity-control">
                  <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <button className="remove-button" onClick={() => handleRemoveItem(item._id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <p>
              Total: <strong>${totalAmount.toFixed(2)}</strong>
            </p>

            <form onSubmit={handleSubmitOrder} className="customer-form">
              <div className="form-group">
                <label htmlFor="customerName">Name:</label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={customerInfo.customerName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="customerPhone">Phone (optional):</label>
                <input
                  type="tel"
                  id="customerPhone"
                  name="customerPhone"
                  value={customerInfo.customerPhone}
                  onChange={handleInputChange}
                />
              </div>

              <button type="submit" className="place-order-button" disabled={isSubmitting}>
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;