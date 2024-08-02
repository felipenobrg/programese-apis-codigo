document.addEventListener('DOMContentLoaded', () => {
  const userForm = document.getElementById('userForm');
  const userList = document.getElementById('userList');
  let editingUserId = null;

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/usuarios');
      const users = await response.json();
      userList.innerHTML = '';
      users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `
          ${user.nome} (${user.email})
          <div>
            <button class="edit" onclick="editUser(${user.id}, '${user.nome}', '${user.email}', '${user.senha}')">Editar</button>
            <button onclick="deleteUser(${user.id})">Deletar</button>
          </div>
        `;
        userList.appendChild(li);
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  userForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
      const response = editingUserId
        ? await fetch(`http://localhost:3001/atualizarUsuario/${editingUserId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, email, senha }),
          })
        : await fetch('http://localhost:3001/criarUsuario', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, email, senha }),
          });

      if (response.ok) {
        alert(editingUserId ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
        userForm.reset();
        editingUserId = null;
        fetchUsers();
      } else {
        alert('Erro ao salvar usuário');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Erro ao salvar usuário');
    }
  });

  window.editUser = (id, nome, email, senha) => {
    document.getElementById('nome').value = nome;
    document.getElementById('email').value = email;
    document.getElementById('senha').value = senha;
    editingUserId = id;
  };

  window.deleteUser = async (id) => {
    if (confirm('Você tem certeza que deseja deletar este usuário?')) {
      try {
        const response = await fetch(`http://localhost:3001/deletarUsuario/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Usuário deletado com sucesso!');
          fetchUsers();
        } else {
          alert('Erro ao deletar usuário');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Erro ao deletar usuário');
      }
    }
  };

  fetchUsers();
});
