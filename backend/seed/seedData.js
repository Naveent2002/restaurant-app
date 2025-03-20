const MenuItem = require('../models/MenuItem');

const seedMenuItems = async () => {
  try {
    await MenuItem.deleteMany(); // Clear existing data
    const menuItems = [
      { name: 'Pizza', description: 'Delicious pizza', price: 10, imageUrl: 'pizza.jpg' },
      { name: 'Burger', description: 'Tasty burger', price: 8, imageUrl: 'burger.jpg' },
    ];
    await MenuItem.insertMany(menuItems);
    console.log('Menu items seeded successfully');
  } catch (error) {
    console.error('Error seeding menu items:', error);
  }
};

module.exports = seedMenuItems;