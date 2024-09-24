const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');
const session = require('express-session');
const app = express();

var { Liquid } = require('liquidjs');
var engine = new Liquid();
const port = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('liquid', engine.express()); 
app.set('views', './views');            
app.set('view engine', 'liquid');      
//app.use(express.static('./')); //для применения css

const sequelize = new Sequelize("notes", "root", "Lokotok17.", {
  dialect: "mysql",
  host: "localhost"
});

const authenticate = async () => {
  try {
      await sequelize.authenticate()
      console.log('Соединение с БД было успешно установлено')
    } catch (err) {
      console.log('Невозможно выполнить подключение к БД: ', err)
    }
  };

authenticate();

const User = sequelize.define('users', {
  id_users: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.INTEGER,
    allowNull: false
  }},
  {
    timestamps: false // отключаем создание полей createAt и updatedAt
  }
);

const Daily = sequelize.define('dailies', {
  id_daily: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tasks: {
    type: DataTypes.STRING,
    allowNull: false
  },
  done: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }}, {
    timestamps: false // отключаем создание полей createAt и updatedAt
  }
);

User.hasMany(Daily,  { foreignKey: 'id_users' });
Daily.belongsTo(User,  { foreignKey: 'id_users' });

sequelize.sync();


app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
  }));
  
  const requiresAuth = (req, res, next) => {
      if (req.session && req.session.user && req.session.user.isAuthenticated) {
          return next();
      } else {
          return res.redirect('/login');
      }
  };
  
  app.get('/login', (req, res) => {
      res.render('login');
  });
  
  app.post('/login', async (req, res) => {
      var login = req.body.username;
      var password = req.body.password;

     const user = await User.findOne({ where: { login: login, password: password } });
    if (user) {
        req.session.user = { isAuthenticated: true, login: user.login, password: user.password, id_users: user.id_users };
         return res.redirect('/dailies');
       } else {
        return res.redirect('/login');
       }
  });
  
  app.get('/dailies', requiresAuth, async (req, res) => {
    const userId = req.session.user.id_users;
    if (!userId) {
      return res.redirect('/login');
    }
    const user = await User.findOne({ where: { id_users: userId } });
    if (!user) {
      return res.redirect('/login');
    }
    const dailies = await Daily.findAll({ where: { id_users: user.id_users } });
    const plannedTasks = dailies.filter((daily) => !daily.done);
    const completedTasks = dailies.filter((daily) => daily.done);
    console.log(completedTasks);
    res.render('dailies', { plannedTasks: plannedTasks, completedTasks: completedTasks });
  });
  
  app.get('/logout', (req, res) => { 
    req.session.destroy();
    res.redirect('/login'); 
  });    
  
  app.post('/add', async (req, res) => {
    const daily = new Daily();
    const  task  = req.body.tasks;
    const userId = req.session.user.id_users;
    daily.id_users = userId;
    daily.tasks = task;
    await daily.save();
    res.redirect('/dailies');
  });

  app.get('/complete/:id_daily', async (req, res) => {
   const itemId = req.params.id_daily;
    console.log(itemId);
    const daily = await Daily.findOne({ where: { id_daily: itemId } });
    if (!daily) {
      return res.status(404).send('Daily not found');
    }
    daily.done = true;
    await daily.save();
    res.redirect('/dailies');
  });
  
  app.get('/delete/:id_daily', async (req, res) => {
    const itemId = req.params.id_daily;
    const daily = await Daily.findOne({ where: { id_daily: itemId } });
    if (!daily) {
      return res.status(404).send('Daily not found');
    }
    await daily.destroy();
    res.redirect('/dailies');
  });

app.listen(port, () => console.log('started'));