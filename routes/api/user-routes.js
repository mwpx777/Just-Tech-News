const router = require('express').Router();
const { User } = require('../../models');


// THESE ARE RESTful APIs
// get /api/users
router.get('/', (req, res) => {
    // access User model and run .findAll() method  *this is same as SELECT * from users in SQL*
    User.findAll({
    // attributes: {exclude: ['password']}
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// get /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {exclude: ['password']},
    
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

// post /api/users
router.post('/', (req, res) => {
    // expects {username: name, email: email, password: password}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// route will be /api/users/login
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
    
        // res.json({ user: dbUserData });
    
        // Verify user 
        // this will pass req.body.password into checkPassword function in user.js checkPassword function
        const validPassword = dbUserData.checkPassword(req.body.password);
        // this is conditional statement!
            if (!validPassword){
                res.status(400).json({message: 'Incorrect password!'});
                return;
            }
            res.json({user: dbUserData, message: dbUserData.username + ' you are now logged in!'});
    
      });  
    });

// PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
  
    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {
        // this is for bcrypt 
        individualHooks: true,
      where: {
        id: req.params.id
      }
    })
      .then(dbUserData => {
        if (!dbUserData[0]) {
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

// delete /api/users/1
router.delete('/:id', (req, res) => { 
    User.destroy({
        where:{
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData){
            res.status(404).json({message: 'No user found with this id'});
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