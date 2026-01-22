const User = require('../models/User');
const Session = require('../models/Session');

async function showLogin(req, res) {
  res.render('auth/login', { error: null });
}

async function showRegister(req, res) {
  res.render('auth/register', { error: null });
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
}

async function register(req, res) {
  let { username, email, password } = req.body;

  username = sanitizeInput(username);
  email = sanitizeInput(email);
  password = password ? password.trim() : '';

  if (!username || !email || !password) {
    return res.render('auth/register', { error: 'All fields are required' });
  }

  if (username.length < 3 || username.length > 20) {
    return res.render('auth/register', { error: 'Username must be between 3 and 20 characters' });
  }

  if (!validateUsername(username)) {
    return res.render('auth/register', { error: 'Username can only contain letters, numbers, and underscore' });
  }

  if (!validateEmail(email)) {
    return res.render('auth/register', { error: 'Invalid email address' });
  }

  if (password.length < 6) {
    return res.render('auth/register', { error: 'Password must be at least 6 characters' });
  }

  if (password.length > 100) {
    return res.render('auth/register', { error: 'Password is too long' });
  }

  try {
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.render('auth/register', { error: 'Username already exists' });
    }

    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.render('auth/register', { error: 'Email already exists' });
    }

    const userId = await User.create(username, email, password);
    const { token } = await Session.create(userId);
    
    req.session.sessionToken = token;
    res.redirect('/');
  } catch (error) {
    console.error('Registration error:', error);
    res.render('auth/register', { error: 'Registration error. Please try again.' });
  }
}

async function login(req, res) {
  let { username, password } = req.body;

  username = sanitizeInput(username);
  password = password ? password.trim() : '';

  if (!username || !password) {
    return res.render('auth/login', { error: 'Please enter username and password' });
  }

  if (username.length > 20 || password.length > 100) {
    return res.render('auth/login', { error: 'Invalid username or password' });
  }

  try {
    const user = await User.findByUsername(username);
    
    if (!user) {
      return res.render('auth/login', { error: 'Invalid username or password' });
    }

    const isValid = await User.verifyPassword(password, user.password_hash);
    
    if (!isValid) {
      return res.render('auth/login', { error: 'Invalid username or password' });
    }

    const { token } = await Session.create(user.id);
    req.session.sessionToken = token;
    
    res.redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    res.render('auth/login', { error: 'Login error. Please try again.' });
  }
}

async function logout(req, res) {
  const sessionToken = req.session.sessionToken;
  
  if (sessionToken) {
    await Session.delete(sessionToken);
  }
  
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
    }
    res.redirect('/auth/login');
  });
}

module.exports = {
  showLogin,
  showRegister,
  register,
  login,
  logout,
  validateEmail,
  validateUsername,
  sanitizeInput
};
