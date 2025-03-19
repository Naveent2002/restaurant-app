const Order = require('../models/Order'); // Ensure this path is correct

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.item');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  const { items, totalAmount, customerName, customerPhone, adderss } = req.body;
  try {
    const newOrder = new Order({ items, totalAmount, customerName, customerPhone, adderss });
     // Save the order to the database
     const savedOrder = await newOrder.save();
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.item');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
  const { items, totalAmount, status, customerName, customerPhone } = req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { items, totalAmount, status, customerName, customerPhone, updatedAt: Date.now() },
      { new: true }
    ).populate('items.item');
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update order status
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      console.log('Order not found'); // Log the error
      return res.status(404).json({ message: 'Order not found' });
    }
    console.log('Order updated:', updatedOrder); // Log the success
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error); // Log the error
    res.status(500).json({ message: error.message });
  }
};