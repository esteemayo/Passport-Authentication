exports.index = (req, res) => {
    res.status(200).render('welcome', {
        title: 'Welcome'
    });
}

exports.dashboard = (req, res) => {
    res.status(200).render('dashboard', {
        title: `${req.user.name}'s Dashboard!`
    });
}