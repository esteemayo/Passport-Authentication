

module.exports = (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/dashboard');
    res.render('login');
}