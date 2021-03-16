// // this is authguard route
// // it will restrict the route to authenticated users only

// const withAuth = (req, res, next) =>{
//     // if session doesn't exist, redirect to login page
//     if(!req.session.user_id) {
//         res.redirect('/login');
//     }else{
//         next();
//     }
// };

// module.exports = withAuth;

const withAuth = (req, res, next) => {
    if (!req.session.user_id) {
      res.redirect('/login');
    } else {
      next();
    }
  };
  
  module.exports = withAuth;
  