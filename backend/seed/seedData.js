const MenuItem = require('../models/MenuItem');

const seedMenuItems = async () => {
  const count = await MenuItem.countDocuments();
  if (count === 0) {
    const menuItems = [
      {
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and basil',
        price: 12.99,
        category: 'Pizza',
        image: 'https://picsum.photos/id/292/200/200',
      },
      {
        name: 'Veggie Burger',
        description: 'Plant-based patty with lettuce, tomato, and special sauce',
        price: 9.99,
        category: 'Burgers',
        image: 'https://picsum.photos/id/293/200/200',
      },
    ];
    await MenuItem.insertMany(menuItems);
    console.log('Sample menu items added');
  }
};

module.exports = seedMenuItems;