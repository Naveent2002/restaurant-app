// Menu Reducer
export const menuReducer = (state = { items: [], loading: false, error: null }, action) => {
  switch (action.type) {
    case 'FETCH_MENU_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_MENU_SUCCESS':
      return { ...state, loading: false, items: action.payload };
    case 'FETCH_MENU_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Cart Reducer
export const cartReducer = (state = { items: [], totalAmount: 0 }, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(
        item => item._id === action.payload._id
      );
            
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
                
        return {
          ...state,
          items: updatedItems,
          totalAmount: state.totalAmount + action.payload.price
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
          totalAmount: state.totalAmount + action.payload.price
        };
      }
    }
        
    case 'REMOVE_FROM_CART': {
      const itemToRemove = state.items.find(item => item._id === action.payload);
      if (!itemToRemove) return state;
      
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload),
        totalAmount: state.totalAmount - (itemToRemove.price * itemToRemove.quantity)
      };
    }
        
    case 'UPDATE_CART_ITEM_QUANTITY': {
      const { itemId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item._id === itemId);
              
      if (itemIndex >= 0) {
        const item = state.items[itemIndex];
        const quantityDiff = quantity - item.quantity;
        const updatedItems = [...state.items];
                
        updatedItems[itemIndex] = {
          ...item,
          quantity
        };
                
        return {
          ...state,
          items: updatedItems,
          totalAmount: state.totalAmount + (item.price * quantityDiff)
        };
      }
      return state;
    }
        
    case 'CLEAR_CART':
      return { items: [], totalAmount: 0 };
          
    default:
      return state;
  }
};

// Order Reducer
export const orderReducer = (
  state = { orders: [], loading: false, error: null, lastUpdated: null },
  action
) => {
  switch (action.type) {
    case 'PLACE_ORDER_REQUEST':
    case 'FETCH_ORDERS_REQUEST':
    case 'UPDATE_ORDER_STATUS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'PLACE_ORDER_SUCCESS':
      return {
        ...state,
        loading: false,
        orders: [action.payload, ...state.orders],
        lastUpdated: new Date().toISOString(),
      };

    case 'FETCH_ORDERS_SUCCESS':
      return {
        ...state,
        loading: false,
        orders: action.payload,
        lastUpdated: new Date().toISOString(),
      };

    case 'UPDATE_ORDER_STATUS_SUCCESS': {
      const updatedOrder = action.payload;
      return {
        ...state,
        loading: false,
        orders: state.orders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        ),
        lastUpdated: new Date().toISOString(),
      };
    }

    case 'PLACE_ORDER_FAILURE':
    case 'FETCH_ORDERS_FAILURE':
    case 'UPDATE_ORDER_STATUS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};