
// const router = require('express').Router();
// const { Post, User, Vote, Comment } = require('../../models');
// const sequelize = require('../../config/connection');

// // get all users
// router.get('/', (req, res) => {
//     Post.findAll({
//         order: [['created_at', 'DESC']],
//         attributes: ['id',
//             'post_url',
//             'title',
//             'created_at',
//             [sequelize.literal('(SELECT COUNT (*) FROM vote WHERE post.id= vote.post_id)'), 'vote_count']
//         ],
//         //    this is for adding the comment to the post in an array
//         include: [
//             {
//                 model: Comment,
//                 attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
//                 // this is for the comment user
//                 include: {
//                     model: User,
//                     attributes: ['username']
//                 }
//             },
//             {
//                 // this is for the user that created the post 
//                 model: User,
//                 attributes: ['username']
//             }
//         ]
//     })
//         .then(dbPostData => res.json(dbPostData))
//         .catch(err => {
//             console.log(err);
//             res.status(500).json(err);
//         });
// });

// // route for /api/posts/:id
// router.get('/:id', (req, res) => {
//     Post.findOne({
//         where: {
//             id: req.params.id
//         },
//         attributes: ['id',
//             'post_url',
//             'title',
//             'created_at',
//             // this will show the vote count for the post
//             [sequelize.literal('(SELECT COUNT (*) FROM vote WHERE post.id= vote.post_id)'), 'vote_count']
//         ],
//         include: [
//             {
//                 model: Comment,
//                 attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
//                 // this is name of who posted comment
//                 include: {
//                     model: User,
//                     attributes: ['username']
//                 }
//             },
//             {
//                 // this is name of the creater of the post
//                 model: User,
//                 attributes: ['username']
//             }
//         ]
//     })
//         .then(dbPostData => {
//             if (!dbPostData) {
//                 res.status(404).json({ message: 'No post with this ID found!' });
//                 return;
//             }
//             res.json(dbPostData);
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json(err);
//         });
// });

// router.post('/', (req, res) => {
//     Post.create({
//         title: req.body.title,
//         post_url: req.body.post_url,
//         user_id: req.body.user_id
//     })
//         .then(dbPostData => res.json(dbPostData))
//         .catch(err => {
//             console.log(err);
//             res.status(500).json(err);
//         });
// });

// // PUT /api/posts/upvote  this endpoint creates new vote
// // router.put('/upvote', (req, res) => {

// //     Vote.create({
// //         user_id: req.body.user_id,
// //         post_id: req.body.post_id
// //     }).then(() => {
// //         //   then find the post we just voted on
// //         return Post.findOne({
// //             where: {
// //                 id: req.body.post_id
// //             },
// //             attributes: [
// //                 'id',
// //                 'post_url',
// //                 'title',
// //                 'created_at',
// //                 // use raw MySQL aggreate function query to get a count of votes
// //                 [
// //                     sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post_id = vote.post_id)'),
// //                     'vote_count'

// //                 ]
// //             ]
// //         })
// //     })
// //         .then(dbPostData => res.json(dbPostData))
// //         .catch(err => {
// //             console.log(err)
// //             res.status(400).json(err);
// //         }

// //         );
// // });

// // refactored code for upvote
// router.put('/upvote', (req, res) => {
//     // make sure session exists first
//     if (req.session) {
//         // pass session id along with all destructured properties on req.body
//         Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
//             .then(updatedVoteData => res.json(updatedVoteData))
//             .catch(err => {
//                 console.log(err);
//                 res.status(500).json(err);
//             });
//     }
//     // custom static method created in models/Post.js
//     // Post.upvote(req.body, { Vote })
//     //     .then(updatedPostData => req.json(updatedPostData))
//     //     .catch(err => {
//     //         console.log(err);
//     //         res.status(400).json(err);
//     //     }
//     // );
// });

// // this PUT route will update the title of the post
// router.put('/:id', (req, res) => {
//     Post.update({
//         title: req.body.title,
//     },
//         {
//             where: {
//                 id: req.params.id
//             }
//         }
//     )
//         .then(dbPostData => {
//             if (!dbPostData) {
//                 res.status(404).json({ message: "No post found with this ID!" });
//                 return;
//             }
//             res.json(dbPostData);
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json(err);
//         });
// });

// router.delete('/:id', (req, res) => {
//     Post.destroy({
//         where: {
//             id: req.params.id
//         }
//     })
//         .then(dbPostData => {
//             if (!dbPostData) {
//                 res.status(404).json({ message: "No post found with this ID" });
//                 return;
//             }
//             res.json(dbPostData);
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json(err);
//         })
// });


// module.exports = router;

const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment, Vote } = require('../../models');

// get all users
router.get('/', (req, res) => {
  console.log('======================');
  Post.findAll({
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
  if (req.session) {
    Post.create({
      title: req.body.title,
      post_url: req.body.post_url,
      user_id: req.session.user_id
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  }
});

router.put('/upvote', (req, res) => {
  // custom static method created in models/Post.js
  if (req.session) {
    Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
      .then(updatedVoteData => res.json(updatedVoteData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  }
});

router.put('/:id', (req, res) => {
  Post.update(
    {
      title: req.body.title
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
  console.log('id', req.params.id);
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
