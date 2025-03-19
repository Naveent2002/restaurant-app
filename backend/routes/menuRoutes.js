const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const upload = require('../middleware/upload'); // Import the upload middleware

router.get('/', menuController.getMenuItems);
router.post('/', menuController.createMenuItem);
router.get('/:id', menuController.getMenuItemById);
router.put('/:id', menuController.updateMenuItem);
router.delete('/:id', menuController.deleteMenuItem);
router.post('/', upload.single('image'), menuController.createMenuItem);

module.exports = router;