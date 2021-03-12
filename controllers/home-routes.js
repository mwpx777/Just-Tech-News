const router = require('express').Router();
const sequelize = require('../config/connection');
const{Post, User, Comment, Vote} = require('../models');
const { route } = require('./api');

// router.get('/', (req, res) => {
//     // this will render homepage.handlebars (handlebars extention is implied!)
//     res.render('homepage', {
//         id: 1,
//         post_url: 'https://handlebarsjs.com/guide/',
//         title: 'Handlebars Docs',
//         created_at: new Date(),
//         vote_count: 10, 
//         comments: [{}, {}],
//         user: {
//             username: 'test_user'
//         }
//     });
// });

router.get('/', (req, res) =>{
   
    console.log(req.session);
    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT (*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at' ],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
    .then(dbPostData =>{
        // pass a single post object into the homepage template
        // console.log(dbPostData[0])
        // this will map over the array and serialize the info that we need
        const posts = dbPostData.map(post => post.get({plain: true}));
        // this will render only the info we want to display
        res.render('homepage', {posts});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json(err);
    });
});

// router.get('/login', (req, res) =>{
    
//     // if loggedIn, redirect to homepage
//     if(req.session.loggedIn) {
//         res.redirect('/');
//         console.log('you are logged in!')
//         return;
//     }
//     res.render('login');
// });

// module.exports = router;

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        console.log('you are logged in!')
      res.redirect('/');
      return;
    }
  
    res.render('login');
  });
  
  module.exports = router;