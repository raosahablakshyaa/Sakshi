const User = require('../models/User');

let cachedUser = null;

const protect = async (req, res, next) => {
  try {
    if (cachedUser) {
      req.user = cachedUser;
      return next();
    }
    let user = await User.findOne({ username: 'sakshi' }).select('-password');
    if (!user) {
      user = await User.create({
        name: 'Sakshi',
        email: 'sakshi@mentor.com',
        username: 'sakshi',
        password: 'sakshi1234',
        role: 'student',
        currentClass: 7,
        targetYear: 2035,
      });
      user = await User.findOne({ username: 'sakshi' }).select('-password');
    }
    cachedUser = user;
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const adminOnly = (req, res, next) => next();

module.exports = { protect, adminOnly };
