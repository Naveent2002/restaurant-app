// Menu Actions
export const fetchMenu = () => async (dispatch) => {
  dispatch({ type: 'FETCH_MENU_REQUEST' });
  try {
    const response = await fetch('http://localhost:5000/api/menu');
    if (!response.ok) {
      throw new Error('Failed to fetch menu');
    }
    const data = await response.json();
    dispatch({ type: 'FETCH_MENU_SUCCESS', payload: data });
    return data;
  } catch (error) {
    dispatch({ type: 'FETCH_MENU_FAILURE', payload: error.message });
    throw error;
  }
};

// Add a new menu item
export const addMenuItem = (item) => async (dispatch) => {
  dispatch({ type: 'ADD_MENU_ITEM_REQUEST' });
  try {
    const formData = new FormData();
    formData.append('name', item.name);
    formData.append('description', item.description);
    formData.append('price', item.price);
    formData.append('image', item.image);

    const response = await fetch('http://localhost:5000/api/menu/add', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to add menu item');
    }

    const data = await response.json();
    dispatch({ type: 'ADD_MENU_ITEM_SUCCESS', payload: data });
    return data;
  } catch (error) {
    dispatch({ type: 'ADD_MENU_ITEM_FAILURE', payload: error.message });
    throw error;
  }
};

// Cart Actions
export const addToCart = (item) => ({
  type: 'ADD_TO_CART',
  payload: item,
});

export const removeFromCart = (itemId) => ({
  type: 'REMOVE_FROM_CART',
  payload: itemId,
});

export const updateCartItemQuantity = (itemId, quantity) => ({
  type: 'UPDATE_CART_ITEM_QUANTITY',
  payload: { itemId, quantity },
});

export const clearCart = () => ({
  type: 'CLEAR_CART',
});

// Order Actions
export const placeOrder = (orderData) => async (dispatch) => {
  dispatch({ type: 'PLACE_ORDER_REQUEST' });
  try {
    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Failed to place order');
    }

    const data = await response.json();
    dispatch({ type: 'PLACE_ORDER_SUCCESS', payload: data });
    dispatch({ type: 'CLEAR_CART' });
    return data;
  } catch (error) {
    dispatch({ type: 'PLACE_ORDER_FAILURE', payload: error.message });
    throw error;
  }
};

export const fetchOrders = () => async (dispatch) => {
  dispatch({ type: 'FETCH_ORDERS_REQUEST' });
  try {
    const response = await fetch('http://localhost:5000/api/orders');

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    const data = await response.json();
    dispatch({ type: 'FETCH_ORDERS_SUCCESS', payload: data });
    return data;
  } catch (error) {
    dispatch({ type: 'FETCH_ORDERS_FAILURE', payload: error.message });
    throw error;
  }
};

export const updateOrderStatus = (orderId, status) => async (dispatch) => {
  dispatch({ type: 'UPDATE_ORDER_STATUS_REQUEST' });
  try {
    const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update order status');
    }

    const data = await response.json();
    dispatch({ type: 'UPDATE_ORDER_STATUS_SUCCESS', payload: data });
    return data;
  } catch (error) {
    dispatch({ type: 'UPDATE_ORDER_STATUS_FAILURE', payload: error.message });
    throw error;
  }
};