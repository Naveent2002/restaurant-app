// menuController.js
const MenuItem = require('../models/MenuItem'); // Assuming you have a MenuItem model

exports.getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const newMenuItem = new MenuItem({ name, price, description });
    await newMenuItem.save();
    res.status(201).json(newMenuItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json(menuItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, price, description },
      { new: true }
    );
    if (!updatedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json(updatedMenuItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const deletedMenuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};