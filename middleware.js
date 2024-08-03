// middleware.js

const authenticateUser = async (req, res, next) => {
    if (req.session && req.session.userId) {
        // User is authenticated, proceed to the next middleware or route handler
        return next();
    } else {
        // User is not authenticated, redirect to the signin page
        res.redirect('/login');
    }
};

const authenticateAdmin = async (req, res, next) => {
    if (req.session && req.session.userId && req.session.userType === 'admin') {
        // Admin is authenticated, proceed to the next middleware or route handler
        return next();
    } else {
        // Admin is not authenticated, redirect to the signin page
        res.redirect('/login');
    }
};

module.exports = {
    authenticateUser,
    authenticateAdmin,
};
