module.exports = function requireAuth(req, res, next) {
  if (!req.session.user) {
    console.log("[DEBUG] requireAuth: no session.user, redirecting to /login");
    return res.redirect("/login");
  }
  console.log("[DEBUG] requireAuth: OK", { userId: req.session.user.id, email: req.session.user.email });
  next();
};
