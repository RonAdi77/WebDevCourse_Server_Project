const Session = require('../models/Session');
const User = require('../models/User');

async function requireAuth(req, res, next) {
  const sessionToken = req.session.sessionToken;
  
  if (!sessionToken) {
    return res.redirect('/auth/login');
  }

  try {
    const session = await Session.findByToken(sessionToken);
    
    if (!session) {
      req.session.destroy();
      return res.redirect('/auth/login');
    }

    const user = await User.findById(session.user_id);
    
    if (!user) {
      req.session.destroy();
      return res.redirect('/auth/login');
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    req.session.destroy();
    return res.redirect('/auth/login');
  }
}

function redirectIfAuthenticated(req, res, next) {
  if (req.session.sessionToken) {
    return res.redirect('/');
  }
  next();
}

module.exports = {
  requireAuth,
  redirectIfAuthenticated
};
