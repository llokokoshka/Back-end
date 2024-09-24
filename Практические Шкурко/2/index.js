const express = require('express');
const fs = require('fs');
const { Liquid }= require('liquidjs');

const app = express();
const port = 3000;

var engine = new Liquid({
  root: __dirname,                                           // путь до корневой папки проекта
});
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./'));

app.engine('liquid', engine.express());
app.set('views', './views');
app.set('view engine', 'liquid');

app.get('/', (req, res) => {
  res.render('base', {
    num1: '',
    num2: '',
    result: '0'
  });
});

app.post('/', (req, res) => {
  const exp = req.body.num1 + req.body.operator + req.body.num2;
  const result = eval(exp);
  console.log(result);

  res.render('base', {
    result: result,
    num1: req.body.num1,
    num2: req.body.num2,
    operator: req.body.operator
   
  });

  fs.appendFile('results.txt', `${req.body.num1} ${req.body.operator} ${req.body.num2} = ${result}\n`, (err) => {
    if (err) throw err;
    console.log('Result saved to file');
  });
  //res.redirect('/end');
});

app.get('/end', (req, res) => {
 const inputData = fs.readFileSync('results.txt', 'utf-8');
 const data = inputData.trim().split('\n');
 console.log(data);
 res.render('end', {notes: data});
});

app.listen(port, () => {
  console.log('Server started on port 3000');
});
