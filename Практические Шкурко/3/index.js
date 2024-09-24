const express = require('express');
const app = express();
const session = require('express-session');

var { Liquid } = require('liquidjs');
var engine = new Liquid();

const fs = require('fs');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //парсинг массивов и пр и запись в сво-во req.body

//настройка для отображения html с помощью liquid
app.engine('liquid', engine.express()); 
app.set('views', './views');           //путь к шаблонам
app.set('view engine', 'liquid');      //установка механизма отображения на liquid

//app.set('trust proxy', 1) // trust first proxy
// Настройки сессий
app.use(session({
    secret: 'lokoko',             // секретный ключ для подписи cookie
    resave: false,
    saveUninitialized: true,
}));

const MyUsers = [];
fs.readFile('./users.json', (err, data) => {
    if (err) {throw err;}
    Object.assign(MyUsers, JSON.parse(data));        //слияние
});

//проверка авторизации
const requiresAuth = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.isAuthenticated) {
        return next();
    } else {
        return res.redirect('/login');
    }
};

// проверка прав администратора
const requiresAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.isAuthenticated && req.session.user.role == 'admin') {
        return next();
    } else {
        return res.redirect('/access_denied');
    }
};

// Страница ввода логина и пароля
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    var login = req.body.username;
    var password = req.body.password;
    // Поиск пользователя с заданным логином и паролем
    const user = MyUsers?.find(u => u.login == login && u.password == password);
    if (user) {
        // Установка сессии для пользователя
        req.session.user = { isAuthenticated: true, role: user.role, login: user.login, password: user.password };
        return res.redirect('/profile');
    } else {
        return res.redirect('/login');
    }
});

// Страница информации о пользователе
app.get('/profile', requiresAuth, (req, res) => {
    // Получение данных о текущем пользователе из сессии
    const { isAuthenticated, role, login, password } = req.session.user;
    res.render('profile', { isAuthenticated, role, login, password });
});

app.post('/profile', requiresAuth, (req, res) => {
    req.session.destroy();
   res.redirect('/login');
});

// Страница со списком пользователей (доступна только администраторам)
app.get('/users', requiresAdmin, (req, res) => {
    res.render('users', { users: MyUsers });
});

// Страница отсутствия доступа
app.get('/access_denied', (req, res) => {
    res.render('access_denied');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});