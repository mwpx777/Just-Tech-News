const express = require('express');
const routes = require('./controllers/');
const sequelize = require('./config/connection');
// this allows use of paths in folder tree
const path = require('path');
//  these are required for handlebars
const exphbs= require('express-handlebars');
const hbs = exphbs.create({});

const app = express();
const PORT = process.env.PORT || 3001;

const session = require('express-session');


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

// middleware

app.use(session(sess));


app.use(express.json());
app.use(express.urlencoded({extended: true}));
// this allows access to 'public' folder as static assets
app.use(express.static(path.join(__dirname, 'public')));
// this sets the template engine to handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({force: false}).then(()=> {
    app.listen(PORT, () => console.log('Now Listening'));
});
