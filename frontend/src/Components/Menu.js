import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenu, addToCart, addMenuItem } from '../redux/actions';

function Menu() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.menu);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
  });

  // Fetch menu items when the component mounts
  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  // Add an item to the cart
  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  // Handle input change for the new menu item form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: value,
    });
  };

  // Handle image upload for the new menu item
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setNewItem({
      ...newItem,
      image: file,
    });
  };

  // Handle form submission to add a new menu item
  const handleAddMenuItem = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', newItem.name);
    formData.append('description', newItem.description);
    formData.append('price', newItem.price);
    formData.append('image', newItem.image);

    try {
      const response = await fetch('/api/menu/add', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(addMenuItem(data)); // Dispatch action to add the new item to the Redux store
        setNewItem({
          name: '',
          description: '',
          price: '',
          image: null,
        });
        alert('Menu item added successfully!');
      } else {
        alert('Failed to add menu item');
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  // Display loading state
  if (loading) return <div className="loading">Loading menu...</div>;

  // Display error state
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="menu">
      <h2>Menu Items</h2>
      {/* Menu items grid */}
      <div className="menu-grid">
        {items.map((item) => (
          <div key={item._id} className="menu-item">
            <img src={item.imageUrl} alt={item.name} />
            <h3>{item.name}</h3>
            <p className="description">{item.description}</p>
            <p className="price">${item.price.toFixed(2)}</p>
            <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;