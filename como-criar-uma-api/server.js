import express from 'express';
const app = express();

app.get('/', function (req, res) {
  res.send('Deu errado!', 404);
});

app.post('/criarUsuario')

app.listen(3000, function () {
  console.log('Servidor rodando na porta 3000');
});