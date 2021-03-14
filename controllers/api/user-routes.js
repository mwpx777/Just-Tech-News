// const router = require('express').Router();
// // this destructures from the imported models
// const { User, Post, Vote, Comment } = require('../../models');


// // THESE ARE RESTful APIs
// // get /api/users
// router.get('/', (req, res) => {
//   // access User model and run .findAll() method  *this is same as SELECT * from users in SQL*
//   User.findAll({
//     attributes: { exclude: ['password'] }
//   })
//     .then(dbUserData => res.json(dbUserData))
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

// // get /api/users/1
// router.get('/:id', (req, res) => {
//   User.findOne({
//     attributes: { exclude: ['password'] },
//     // include id number from query
//     where: {
//       id: req.params.id
//     },
//     include: [
//       {
//         model: Post,
//         attributes: ['id', 'title', 'post_url', 'created_at']
//       },
//       // this is finding the comments this user made 
//       {
//         model: Comment,
//         attributes: ['id', 'comment_text', 'created_at'],
//         include: {
//           model: Post,
//           attributes: ['title']
//         }
//       },
//       // this will get the titles of articles the user voted on
//       {
//         model: Post,
//         attributes: ['title'],
//         through: Vote,
//         // this will create a table column called voted_posts
//         as: 'voted_posts'
//       }
//     ]
//   })
//     .then(dbUserData => {
//       if (!dbUserData) {
//         res.status(404).json({ message: 'No user found with this id' });
//         return;
//       }
//       res.json(dbUserData);
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

// // post /api/users
// router.post('/', (req, res) => {
//   // expects {username: name, email: email, password: password}
//   User.create({
//     username: req.body.username,
//     email: req.body.email,
//     password: req.body.password
//   })
//     // .then(dbUserData => res.json(dbUserData))
//     // .catch(err => {
//     //     console.log(err);
//     //     res.status(500).json(err);
//     // });

//     // this will access session information
//     .then(dbUserData => {
//       req.session.save(() => {
//         req.session.user_id = dbUserData.id;
//         req.session.username = dbUserData.username;
//         req.session.loggedIn = true;

//         res.json(dbUserData);
//       })
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

// // route will be /api/users/login
// router.post('/login', (req, res) => {
//   // expects {email: 'lernantino@gmail.com', password: 'password1234'}
//   User.findOne({
//     where: {
//       email: req.body.email
//     }
//   }).then(dbUserData => {
//     if (!dbUserData) {
//       res.status(400).json({ message: 'No user with that email address!' });
//       return;
//     }

//     // res.json({ user: dbUserData });

//     // Verify user 
//     // this will pass req.body.password into checkPassword function in user.js checkPassword function
//     const validPassword = dbUserData.checkPassword(req.body.password);
//     // this is conditional statement!
//     if (!validPassword) {
//       res.status(400).json({ message: 'Incorrect password!' });
//       return;
//     }

//     req.session.save(() => {
//       req.session.user_id = dbUserData.id;
//       req.session.username = dbUserData.username;
//       req.session.loggedIn = true;
  
//       res.json({ user: dbUserData, message: 'You are now logged in!' });
//     });
//   });
// });

// router.post('/logout', (req, res) => {
//   if (req.session.loggedIn) {
//     req.session.destroy(() => {

//     });
//     res.status(204).end();
//   }
//   else {
//     res.status(404).end()
//   }
// });

// // PUT /api/users/1
// router.put('/:id', (req, res) => {
//   // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

//   // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
//   User.update(req.body, {
//     // this is for bcrypt 
//     individualHooks: true,
//     where: {
//       id: req.params.id
//     }
//   })
//     .then(dbUserData => {
//       if (!dbUserData[0]) {
//         res.status(404).json({ message: 'No user found with this id' });
//         return;
//       }
//       res.json(dbUserData);
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

// // delete /api/users/1
// router.delete('/:id', (req, res) => {
//   User.destroy({
//     where: {
//       id: req.params.id
//     }
//   })
//     .then(dbUserData => {
//       if (!dbUserData) {
//         res.status(404).json({ message: 'No user found with this id' });
//         return;
//       }
//       res.json(dbUserData);
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

// module.exports = router;

const router = require('express').Router();
const { User, Post, Comment, Vote } = require('../../models');

// get all users
router.get('/', (req, res) => {
  User.findAll({
    attributes: { exclude: ['password'] }
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_url', 'created_at']
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'created_at'],
        include: {
          model: Post,
          attributes: ['title']
        }
      },
      {
        model: Post,
        attributes: ['title'],
        through: Vote,
        as: 'voted_posts'
      }
    ]
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
    .then(dbUserData => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;

        res.json(dbUserData);
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/login', (req, res) => {
  // expects {email: 'lernantino@gmail.com', password: 'password1234'}
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
    }

    const validPassword = dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;

      res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
  });
});

router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.put('/:id', (req, res) => {
  // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

  // pass in req.body instead to only update what's passed through
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
