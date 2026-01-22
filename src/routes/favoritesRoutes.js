const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', requireAuth, favoritesController.showFavorites);
router.post('/search', requireAuth, favoritesController.search);
router.post('/add', requireAuth, favoritesController.addFavorite);
router.delete('/:id', requireAuth, favoritesController.deleteFavorite);
router.post('/reorder', requireAuth, favoritesController.reorderFavorites);

module.exports = router;
