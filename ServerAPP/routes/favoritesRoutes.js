const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const favoritesController = require("../controllers/favoritesController");

router.get("/", requireAuth, (req, res) => favoritesController.showFavorites(req, res));
router.post("/search", requireAuth, (req, res) => favoritesController.search(req, res));
router.post("/add", requireAuth, (req, res) => favoritesController.addFavorite(req, res));
router.delete("/:id", requireAuth, (req, res) => favoritesController.deleteFavorite(req, res));
router.post("/reorder", requireAuth, (req, res) => favoritesController.reorder(req, res));

module.exports = router;
