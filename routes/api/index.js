const router = require('express').Router();
const userRoutes = require('./user-Routes.js');

// middleware
router.use('/users', userRoutes);

module.exports = router;