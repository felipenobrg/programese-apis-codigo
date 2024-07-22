import express from 'express';
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!', 200);
});

app.listen(3000, function () {
  console.log('Rodando na porta 3000');
});