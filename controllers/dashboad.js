

module.exports = (req, res) => {
    res.render('dashboard', { name: req.user.name });
}