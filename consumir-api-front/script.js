document.getElementById('fetchButton').addEventListener('click', fetchUsers);

function fetchUsers() {
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json()) 
        .then(data => {
            const userList = document.getElementById('userList');
            userList.innerHTML = ''; 
            data.forEach(user => {
                const listItem = document.createElement('li');
                listItem.textContent = `${user.name} (${user.email})`;
                // ${user.email}
                userList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Erro ao buscar usuários:', error)); 
}



