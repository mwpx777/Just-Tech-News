
const router = require('express').Router();

const userRoutes = require('./user-routes');
const postRoutes = require('./post-routes');

const commentRoutes = require('./comment-routes');

// middleware 
// this is so you don't need to use /users, /posts, or /comments in routes
router.use('/users', userRoutes);
router.use('/posts', postRoutes);

router.use('/comments', commentRoutes);


module.exports = router;