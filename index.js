const express = require('express');
const { startBot } = require('./logica.js');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(cors());

app.get('/start', (req, res) => {
  const controller = req.query.controller;

  startBot(controller);

  res.json({ status: 'Bot iniciado com controller: ' + controller });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
