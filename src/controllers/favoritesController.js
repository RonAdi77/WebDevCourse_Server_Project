const Favorite = require('../models/Favorite');
const { searchVideos } = require('../utils/youtubeApi');

async function showFavorites(req, res) {
  try {
    const favorites = await Favorite.findByUserId(req.user.id);
    res.render('favorites', { 
      user: req.user, 
      favorites: favorites,
      searchResults: null,
      searchQuery: null
    });
  } catch (error) {
    console.error('Error loading favorites:', error);
    res.render('favorites', { 
      user: req.user, 
      favorites: [],
      searchResults: null,
      searchQuery: null,
      error: 'Error loading favorites'
    });
  }
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
}

function validateVideoId(videoId) {
  return typeof videoId === 'string' && /^[a-zA-Z0-9_-]{11}$/.test(videoId);
}

function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

async function search(req, res) {
  let { query } = req.body;
  
  query = sanitizeInput(query);
  
  if (!query || query.length === 0) {
    return res.redirect('/favorites');
  }

  if (query.length > 100) {
    return res.redirect('/favorites');
  }

  try {
    const videos = await searchVideos(query, 10);
    const favorites = await Favorite.findByUserId(req.user.id);
    
    res.render('favorites', {
      user: req.user,
      favorites: favorites,
      searchResults: videos,
      searchQuery: query
    });
  } catch (error) {
    console.error('Search error:', error);
    const favorites = await Favorite.findByUserId(req.user.id);
    res.render('favorites', {
      user: req.user,
      favorites: favorites,
      searchResults: null,
      searchQuery: query,
      error: error.message || 'Error searching videos'
    });
  }
}

async function addFavorite(req, res) {
  let { videoId, title, thumbnailUrl } = req.body;

  if (!videoId || !title || !thumbnailUrl) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  videoId = String(videoId).trim();
  title = sanitizeInput(String(title));
  thumbnailUrl = String(thumbnailUrl).trim();

  if (!validateVideoId(videoId)) {
    return res.status(400).json({ error: 'Invalid video ID' });
  }

  if (title.length === 0 || title.length > 200) {
    return res.status(400).json({ error: 'Invalid title' });
  }

  if (!validateUrl(thumbnailUrl)) {
    return res.status(400).json({ error: 'Invalid thumbnail URL' });
  }

  try {
    const existing = await Favorite.findByVideoId(req.user.id, videoId);
    if (existing) {
      return res.status(400).json({ error: 'Video already in favorites' });
    }

    await Favorite.create(req.user.id, videoId, title, thumbnailUrl);
    res.json({ success: true, message: 'Video added to favorites' });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Error adding video to favorites' });
  }
}

async function deleteFavorite(req, res) {
  const { id } = req.params;

  const favoriteId = parseInt(id);
  if (isNaN(favoriteId) || favoriteId <= 0) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    await Favorite.delete(favoriteId, req.user.id);
    res.json({ success: true, message: 'Video deleted from favorites' });
  } catch (error) {
    console.error('Delete favorite error:', error);
    res.status(500).json({ error: 'Error deleting video' });
  }
}

async function reorderFavorites(req, res) {
  const { id, newPosition } = req.body;

  if (id === undefined || newPosition === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const favoriteId = parseInt(id);
  const position = parseInt(newPosition);

  if (isNaN(favoriteId) || favoriteId <= 0) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  if (isNaN(position) || position < 0) {
    return res.status(400).json({ error: 'Invalid position' });
  }

  try {
    await Favorite.updatePosition(favoriteId, req.user.id, position);
    res.json({ success: true, message: 'Order updated' });
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({ error: 'Error updating order' });
  }
}

module.exports = {
  showFavorites,
  search,
  addFavorite,
  deleteFavorite,
  reorderFavorites
};
