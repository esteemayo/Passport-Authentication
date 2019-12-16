

module.exports = (req, res) => {
    if (req.isAuthenticated()) return redirect('/dashboard');
    res.render('register');
}