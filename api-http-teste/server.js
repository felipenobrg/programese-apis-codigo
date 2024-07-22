import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Erro ao iniciar o banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
    db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        email TEXT,
        senha TEXT
      )
    `, (err) => {
      if (err) {
        console.error('Erro ao criar a tabela usuarios:', err.message);
      }
    });
  }
});

const app = express();
app.use(express.json());
app.use(cors());

app.post("/criarUsuario", (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).send("Por favor, preencha todos os campos: nome, email e senha.");
  }

  db.run(
    "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
    [nome, email, senha],
    function (err) {
      if (err) {
        console.error('Erro ao criar usuário:', err.message);
        res.status(500).send("Erro ao criar usuário. Por favor, tente novamente.");
      } else {
        res.status(201).send("Usuário criado com sucesso!");
      }
    }
  );
});

app.get("/usuarios", (req, res) => {
  db.all("SELECT * FROM usuarios", [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err.message);
      res.status(500).send("Erro ao buscar usuários. Por favor, tente novamente.");
    } else {
      res.json(rows);
    }
  });
});

app.put("/atualizarUsuario/:id", (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;

  if (!id) {
    return res.status(400).send("Por favor, informe o ID do usuário.");
  }

  const fields = [];
  const values = [];

  if (nome) {
    fields.push("nome = ?");
    values.push(nome);
  }
  if (email) {
    fields.push("email = ?");
    values.push(email);
  }
  if (senha) {
    fields.push("senha = ?");
    values.push(senha);
  }

  if (fields.length === 0) {
    return res.status(400).send("Nenhum campo para atualizar.");
  }

  values.push(id);
  const sql = `UPDATE usuarios SET ${fields.join(", ")} WHERE id = ?`;

  db.run(sql, values, function (err) {
    if (err) {
      console.error('Erro ao atualizar usuário:', err.message);
      res.status(500).send("Erro ao atualizar usuário. Por favor, tente novamente.");
    } else if (this.changes === 0) {
      res.status(404).send("Usuário não encontrado.");
    } else {
      res.send("Usuário atualizado com sucesso!");
    }
  });
});

app.delete("/deletarUsuario/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM usuarios WHERE id = ?", id, function (err) {
    if (err) {
      console.error('Erro ao deletar usuário:', err.message);
      res.status(500).send("Erro ao deletar usuário. Por favor, tente novamente.");
    } else if (this.changes === 0) {
      res.status(404).send("Usuário não encontrado.");
    } else {
      res.send("Usuário deletado com sucesso!");
    }
  });
});

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
