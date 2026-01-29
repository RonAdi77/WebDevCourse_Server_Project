const favoriteRepository = require("../repositories/favoriteRepository");
const { searchVideos } = require("../utils/youtubeApi");

class FavoritesController {
    async showFavorites(req, res) {
        try {
            const favorites = await favoriteRepository.findByUserId(req.session.user.id);
            res.render("favorites", {
                user: req.session.user,
                favorites,
                searchResults: null,
                searchQuery: null,
            });
        } catch (err) {
            console.error(err);
            res.render("favorites", {
                user: req.session.user,
                favorites: [],
                searchResults: null,
                searchQuery: null,
                error: "Error loading favorites.",
            });
        }
    }

    async search(req, res) {
        const query = (req.body.query || "").trim();
        if (!query) return res.redirect("/favorites");
        try {
            const videos = await searchVideos(query, 10);
            const favorites = await favoriteRepository.findByUserId(req.session.user.id);
            res.render("favorites", {
                user: req.session.user,
                favorites,
                searchResults: videos,
                searchQuery: query,
            });
        } catch (err) {
            console.error(err);
            const favorites = await favoriteRepository.findByUserId(req.session.user.id);
            res.render("favorites", {
                user: req.session.user,
                favorites,
                searchResults: null,
                searchQuery: query,
                error: err.message || "Error searching videos.",
            });
        }
    }

    async addFavorite(req, res) {
        try {
            const { videoId, title, thumbnailUrl } = req.body;
            if (!videoId || !title || !thumbnailUrl) {
                return res.status(400).json({ error: "Missing required fields." });
            }
            const existing = await favoriteRepository.findByUserAndVideo(req.session.user.id, videoId);
            if (existing) {
                return res.status(400).json({ error: "Video already in favorites." });
            }
            await favoriteRepository.create({
                userId: req.session.user.id,
                videoId,
                title: title.trim(),
                thumbnailUrl: thumbnailUrl.trim(),
            });
            res.json({ success: true, message: "Video added to favorites." });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error adding to favorites." });
        }
    }

    async deleteFavorite(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ error: "Invalid ID." });
            }
            await favoriteRepository.delete(id, req.session.user.id);
            res.json({ success: true, message: "Video removed from favorites." });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error deleting favorite." });
        }
    }

    async reorder(req, res) {
        try {
            const { id, newPosition } = req.body;
            if (id == null || newPosition == null) {
                return res.status(400).json({ error: "Missing id or newPosition." });
            }
            const fid = parseInt(id, 10);
            const pos = parseInt(newPosition, 10);
            if (isNaN(fid) || fid <= 0 || isNaN(pos) || pos < 0) {
                return res.status(400).json({ error: "Invalid id or position." });
            }
            await favoriteRepository.updatePosition(fid, req.session.user.id, pos);
            res.json({ success: true, message: "Order updated." });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error updating order." });
        }
    }
}

module.exports = new FavoritesController();
