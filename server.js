const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Configurar body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database(':memory:');

// Criar tabela
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS data (number INTEGER, name TEXT)');
});

// Rota para obter dados armazenados
app.get('/data', (req, res) => {
  db.all('SELECT * FROM data ORDER BY number', [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

// Rota para armazenar dados
app.post('/data', (req, res) => {
  const { number, name } = req.body;
  db.get('SELECT * FROM data WHERE number = ?', [number], (err, row) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    if (row) {
      res.status(400).send('Erro: Este número já está armazenado.');
    } else {
      db.run('INSERT INTO data (number, name) VALUES (?, ?)', [number, name], (err) => {
        if (err) {
          res.status(500).send(err.message);
          return;
        }
        res.status(200).send('Dados armazenados com sucesso!');
      });
    }
  });
});

// Rota para login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'rifanatal' && password === 'rifa2024') {
    res.status(200).send('Login bem-sucedido!');
  } else {
    res.status(401).send('Credenciais inválidas.');
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
