// const express = require('express');
// const routes = require('./controllers/');
// const sequelize = require('./config/connection');
// // this allows use of paths in folder tree
// const path = require('path');
// //  these are required for handlebars
// const exphbs= require('express-handlebars');
// const helpers = require('./utils/helpers');
// const hbs = exphbs.create({helpers});


// const app = express();
// const PORT = process.env.PORT || 3001;

// const session = require('express-session');


// const SequelizeStore = require('connect-session-sequelize')(session.Store);

// const sess = {
//   secret: 'Super secret secret',
//   cookie: {},
//   resave: false,
//   saveUninitialized: true,
//   store: new SequelizeStore({
//     db: sequelize
//   })
// };

// // middleware

// app.use(session(sess));


// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
// app.use(require('./controllers/'));
// // this allows access to 'public' folder as static assets
// app.use(express.static(path.join(__dirname, 'public')));
// // this sets the template engine to handlebars
// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');

// // turn on routes
// app.use(routes);

// // turn on connection to db and server
// sequelize.sync({force: false}).then(()=> {
//     app.listen(PORT, () => console.log('Now Listening'));
// });

const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require("./config/connection");
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

const helpers = require('./utils/helpers');

const hbs = exphbs.create({ helpers });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./controllers/'));

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});