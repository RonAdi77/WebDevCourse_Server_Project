async function showHome(req, res) {
  res.render('home', { user: req.user });
}

module.exports = {
  showHome
};
